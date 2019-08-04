---
title: Table Scan: Doing The Right Thing With Structured Types
author: Orri Erling
authorURL: https://www.linkedin.com/in/orrierling/
authorFBID: 100026224749124
---

In the previous article we saw what gains are possible when filtering early and in the right order. In this article we look at how we do this with nested and structured types.

<!--truncate-->

We use the 100G TPC-H dataset, but now we group top level columns into structs or maps.

Maps, lists and structs are very common with big data because ETL jobs tend to put all data of interest in a single fact table. If the data involves any schema variability or over 100 or 200 of columns, maps tend to be used instead of top level columns. These can be copied as a unit and adding keys does not require top level schema change with its complications. In this article we mimick these practices by reshaping the TPC-H data.


The tables are defined as follows:

```sql
CREATE TABLE exportlineitem  (
    orderkey BIGINT,
    linenumber INTEGER,
    shipment row(
        partkey BIGINT,
        suppkey BIGINT,
        extendedprice DOUBLE,
        discount DOUBLE,
        quantity DOUBLE,
        shipdate DATE,
        receiptdate DATE,
        commitdate DATE,
        comment VARCHAR,
    export row(
        s_nation BIGINT,
        c_nation BIGINT,
        is_inside_eu INTEGER,
        is_restricted INTEGER,
        license row(
            applydate DATE,
            grantdate DATE,
            filing_no BIGINT,
            comment VARCHAR))
)
WITH (
    format = 'ORC'
);
```

The `shipment` struct has the non-null top-level columns we all have come to know and love. The `export` struct is null if the customer` and supplier nations are the same and present otherwise. A fraction of the rows have an additional nested export `license` struct.

```sql
CREATE TABLE lineitem_map (
    orderkey BIGINT,
    linenumber INTEGER,
    ints map(INTEGER, BIGINT),
    strs map(VARCHAR, VARCHAR)
)
WITH (
    format = 'ORC'
);
```

This table has a map of 12 integers in `ints` and 5 strings in `strs`. The key is the column ordinal number in the original `lineitem` table as an integer in `ints` and as a string in `strs`.

Like before, the tables are in ORC V2 and are compressed with Snappy. We show the Aria and baseline times as wall time seconds / CPU seconds, labeled with Aria: and Baseline: respectively. The queries were run on a desktop machine with two sockets and four hyperthreaded Skylake cores per socket clocked at 3.5GHz.

First we compare performance of top level columns to performance of columns embedded in a non-null struct:
```sql
SELECT COUNT(*)
FROM lineitem
WHERE partkey BETWEEN 1000000 AND 2000000 AND suppkey BETWEEN 100000 AND 200000 AND extendedprice > 0;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 4                   | 35                 | 1.0                     |
| Baseline | 7                   | 80                 | 2.28                    |

```sql
SELECT COUNT(*)
FROM exportlineitem
WHERE shipment.partkey BETWEEN 1000000 AND 2000000 AND shipment.suppkey BETWEEN 100000 AND 200000 AND shipment.extendedprice > 0 ;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 4                   | 35                 | 1.0                     |
| Baseline | 16                  | 227                | 6.5                     |

We notice that for Aria it makes no difference whether the filtered columns are top level or in a non-null struct. We also note that none of the columns are materialized by Aria, since these are only filtered on, but they are materialized by baseline Presto.

```sql
SELECT COUNT(*), SUM(shipment.extendedprice)
FROM exportlineitem
WHERE shipment.partkey BETWEEN 1000000 AND 2000000 AND shipment.suppkey BETWEEN 100000 AND 200000;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 4                   | 34                 | 1.0                     |
| Baseline | 18                  | 253                | 7.44                    |

Now, instead of having a filter that is always true, we retrieve the value of `extendedprice` and materialize a struct. We only materialize 1% of the structs with this predicate, and the struct only has the `extendedprice` column filled in. The cost of materialization for Aria is within the margin of error. We could of course, since we only access fields of the struct and not the whole struct, elide materializing the struct and only materialize the component columns. But the gain of this last optimization will not yield much improvement unless a larger percentage of the values are materialized and/or the struct to materialize has many fields.

```sql
SELECT COUNT(*), SUM(shipment.extendedprice), COUNT(export.license.filing_no)
FROM exportlineitem
WHERE shipment.suppkey BETWEEN 200000 AND 400000 AND shipment.quantity < 10;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 10                  | 58                 | 1.0                     |
| Baseline | 30                  | 330                | 5.68                    |

Here we add a second struct to the mix. We filter on members of one struct and return a field, `filing_no`, which is wrapped inside two structs. Both the `export` struct and the `license` struct inside it are nullable, i.e. not all shipments are international and not all export shipments need a license.
This takes longer because 4x more rows are returned in order to highlight the cost of handling null flags. We must read two levels of null flags, one for `export` and the other for the `license` substruct. Then we read the filing number for the positions where there is a `license` and fill in a null for the case where either `license` or the enclosing `export` struct is null.

# Experiments

```sql
SELECT SUM(shipment.extendedprice), COUNT(export.license.filing_no)
FROM exportlineitem
WHERE shipment.partkey BETWEEN 200000 AND 400000 AND shipment.quantity < 10 AND export.s_nation IN (1, 3, 6) AND export.c_nation = 11;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 5.6                 | 49.8               | 1.0                     |
| Baseline | 30                  | 309                | 6.20                    |

Here we add a filter on `export`. The filters within structs are reorderable as well as the top level structs. We find that the new filter does not negatively impact running time and in fact can improve it. The best filter is evaluated first and after this all column access is sparse and only the data at interesting positions gets touched.

```sql
SELECT COUNT(*)
FROM lineitem_map
WHERE ints[2] BETWEEN 1000000 AND 2000000 AND ints[3] BETWEEN 100000 AND 200000;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 35                  | 422                | 1.0                     |
| Baseline | 50                  | 706                | 1.67                    |

This case corresponds to a `lineitem` table represented as a map. This would be common if this were the feature vector for a machine learning use case, except that we would typically have hundreds of keys per map instead of the 12 here. we do the same thing as in the first query but use a direct encoded map instead. This is noticeably slower than the struct case because we must read through all the keys even if we do not look at them. However only the values for keys that are accessed need to be read. Thus we do not save in decompression but do save in materialization and filtering. Internally, this makes a filter `ints.key IN (2, 3)`. This selects the positions in the values column that we look at. Then we make a list of filters to apply to these positions. Different positions have a different filter.  There is an extra trick in this: If there are `n` filters, e.g. 2 for 2 values that we look at out of a total of 12 values in each map and the `ith` filter is false, then we can fail the next `n - i` filters without even looking at the data.

Because the map is only filtered on, we do not create any `MapBlock` at any point in the query.

Processing the positional filter is only around 5% of the query CPU. The bulk goes into decoding and skipping over the ORC columns for keys and values.

The Facebook DWRF addition of flat map brings this again into the struct range. A flat map is a columnar representation where we have a separate column for each key that occurs at least once within a stripe. This is much like the representation for a struct, except that nested columns have an extra flag that tells whether they are present in each of the maps.

```sql
SELECT COUNT(*), SUM(ints[6])
FROM lineitem_map
WHERE ints[2] BETWEEN 1000000 AND 2000000 AND ints[3] BETWEEN 100000 AND 200000;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 37                  | 476                | 1.0                     |
| Baseline | 55                  | 710                | 1.49                    |

When we use values in a map outside of simple filters on these values, we need to actually construct a map  column and return it from table scan to the next operator. But here we know that only key 6 is actually used by the query, so we can leave out the 11 other values that would be in the map. This takes a little longer than the previous query but the extra cost is not very high because the resulting map only has the entry for key 6 filled in. The `MapBlock` and its hash tables are thus only 1/12th of what they would otherwise be.


```sql
SELECT COUNT(*), SUM(ints[6])
FROM lineitem_map
WHERE ints[2] BETWEEN 1000000 AND 2000000 AND ints[3] BETWEEN 100000 AND 200000 AND strs['13'] = 'AIR';
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 45                  | 572                | 1.0                     |
| Baseline | 76                  | 1080               | 1.88                    |

Here we add another map to look at. The relative gain against `LazyBlock` is now higher because baseline materializes the `strs` map for all rows and all keys while the access is fairly sparse.  Also, making the hash table for all the string keys is very expensive and generates a lot of garbage in single-use `Slices`. Here we do not materialize any string map but just look at the appropriate places in the value column. The value column must still be uncompressed, which takes time since this contains the `comment` column of the original table. The high cardinality of `comment` also prevents dictionary encoding for the values. The keys on the other hand are encoded as a string dictionary.

```sql
SELECT COUNT(*), SUM(ints[6])
FROM lineitem_map
WHERE ints[2] + 1 BETWEEN 1000000 AND 2000000 AND ints[3] + 1 BETWEEN 100000 AND 200000 AND strs['15'] LIKE '%theodol%';
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 51                  | 703                | 1.0                     |
| Baseline | 77                  | 1083               | 1.54                    |

Here we evaluate code against the maps, hence we cannot elide materializing these. We still win because the `strs` map is sparsely accessed and only the keys that are actually needed get extracted into `MapBlock` instances.
`

## Try Aria
The prototype of Aria is [available](https://github.com/aweisberg/presto/tree/tablescan-structs) to experiment with along with [instructions](https://github.com/aweisberg/presto/blob/tablescan-structs/BENCHMARK.md) on how to try these queries yourself.

The ideas presented here are currently being integrated into mainline Presto.

# Conclusions

We see that pruning subfields and map keys produces solid value and as one would expect never loses. But since we must still uncompress and skip over all the map keys and values, the gains are less for maps as opposed to structs. Maps are especially common with machine learning applications where these encode the feature vector for model training.  We commonly see maps of several thousand keys, of which a handful are accessed. Thus the gains in these cases tend to be higher than seen here with small maps.

The 'schemaless struct', i.e. flat map will equalize the situation.

In the next installment we will look at the experience gained in building and testing this functionality.  We will see where the complexities and pitfalls lie and talk about some of the surprises and catches we met when testing this on production workload.
