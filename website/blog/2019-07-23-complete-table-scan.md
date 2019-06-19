---
title: Complete Table Scan: A Quantitative Assessment
author: Orri Erling
authorURL: https://www.linkedin.com/in/orrierling/
authorFBID: 100026224749124
---

In the previous article we looked at the abstract problem statement and possibilities inherent in scanning tables. In this piece we look at the quantitative upside with Presto. We look at a number of queries and explain the findings.

The initial impulse motivating this work is the observation that table scan is by far the #1 operator in Presto workloads I have seen. This is a little over half of all Presto CPU, with repartitioning a distant second, at around 1/10 of the total. The other half of the motivation is ready opportunity: Presto in its pre-Aria state does almost none of the things that are common in table scan.

<!--truncate-->

For easy reproducibility and staying away from proprietary material, we use a TPC-H dataset at scale factor 100 running on a desktop machine with two sockets and four hyperthreaded Skylake cores per socket clocked at 3.5GHz. The data is compressed with Snappy and we are running with warm OS cache. The Presto is a modified 0.221 where the Aria functionality can be switched on and off. Not to worry, we will talk about disaggregated storage and IO in due time but the basics will come first.

# Simple scan

The base case for scan optimization is the simplest possible query:

```sql
SELECT SUM(extendedprice)
FROM lineitem
WHERE suppkey = 12345;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 2                   | 14.2               | 1.0                     |
| Baseline | 3                   | 29.0               | 2.04                    |


This is a 2x win for the most basic case. This selects approximately 600 rows from 600 million rows and spends all its time in scan. It is here worthwhile to step through exactly how each implementation does this, as we need to understand this when analyzing the more complex cases.

## Mechanics of a scan

Baseline Presto does this as follows: The `OrcPageSource` produces consecutive `Page` instances that contain a `LazyBlock` for each column. This operation as such takes no time since the `LazyBlock` instances are just promises. The actual work takes place when evaluating the generated code for the comparison. This sees that the column is not loaded, loads all the values in the range of the `LazyBlock`, typically 1024 values and then does the operation and produces a set of passing row numbers. This set is empty for all but 1/100k of the cases. If this is empty, the `LazyBlock` for `extendedprice` is not touched. If there are hits, the `extendedprice` `LazyBlock` is loaded and the values for the selected rows are copied out. When this happens, 1024 values are decoded from the column and most often one of them is accessed. Loading a `LazyBlock` allocates memory for each value. In the present case this becomes garbage immediately after first use. The same applies to the values in extended price, of which only one is copied to a `Block` of output. This is handled by a special buffering stage that accumulates rows from multiple loaded `LazyBlock` instances until there is a minimum batch worth of rows to pass to the next operator.

The Aria implementation works as follows: The `OrcRecordReader` has an adaptable column order. It reads up to a full row group worth of data for the first column. When decoding the encoded values, it applies a callback to each value. The callback will either test the value and record the row number for passing values or copy out the value into a results buffer of the column or both. In the case of `suppkey = 12345` we only record the row number. Since for virtually all row groups there is no hit we do not touch the second column. If there is a hit, we touch the hit rows of the second column. This has the effect of copying the decoded value into the column's result buffer. We keep going from row group to row group until enough data has been accumulated, at which point we return it as a `Page`. The `Block` instances in the `Page` are loaded and may either be views into the column reader's buffers or copies of the data, depending on what kind of downstream operator we have. If the downstream operator does not keep references to memory of processed `Block` instances, we can reuse the memory, which is owned by the column readers.

## Allocation overhead

We execute the query three times with both baseline and Aria and consider the top 5 memory allocations:

Aria:
```java
12378062280 54.03% 3261 byte[] (out)

1137340888 4.96% 1881 java.lang.Object[]

1058280112 4.62% 764 byte[]

941224808 4.11% 280 com.facebook.presto.orc.metadata.statistics.ColumnStatistics

908822304 3.97% 272 com.facebook.presto.orc.proto.OrcProto$ColumnStatistics
```

Baseline:

```java
12370936336 28.75% 3146 byte[] (out)

9689400112 22.52% 2399 long[]

4661750784 10.84% 1128 com.facebook.presto.spi.block.LongArrayBlock

2551827928 5.93% 766 boolean[]

1289650912 3.00% 1982 java.lang.Object[]
```

In both cases, the top item is `byte[]`, which comes from most often allocating new memory for raw data read from the ORC file. There is no reason whatever to do this. There is another Aria fix that saves another 10% by fixing this but this is not in scope here. We will talk about what to do with this allocation when we cover smart IO and buffering in later articles.

The main difference is that the `long[]` allocation for `suppkey` values that are tested once and then dropped on the floor are gone. The other observation is that there is a lot of memory allocated for column row group statistics. Again there is no need for allocation and even if these were allocated, there is no need to read stats for columns that have no filters. The use of the stats is here to eliminate row groups based on column min/max. The current implementation reads stats for all columns of the table in any case. For larger queries this is not that significant, but this does stand out in this minimal case.

# Complex queries
## Reduced materialization
We have now covered the core basics. Let's see how these play out with more complex queries.
```sql
SELECT COUNT(*), SUM(extendedprice), SUM(quantity)
FROM lineitem
WHERE partkey BETWEEN 10000000 AND 10200000 AND suppkey BETWEEN 500000 AND 510000;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 4                   | 41.5               | 1.0                     |
| Baseline | 6                   | 72                 | 1.73                    |

In this example there is a 1/10K selection that consists of two 1/100 filters. With `LazyBlock`, the two first columns are materialized in their entirety and 1/10th of the last two columns is materialized because we have on the average one hit in a row group and 1K rows get materialized for each load. In Aria we materialize none of this, which is the principal difference, much as in the previous example.

```sql
SELECT sum (partkey)
FROM lineitem
WHERE quantity < 10;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 2                   | 23.4               | 1.0                     |
| Baseline | 5                   | 49.5               | 2.11                    |

Here we read with less selectivity, taking 1/5 of the rows.

```sql
SELECT MAX(orderkey), MAX(partkey), MAX(suppkey)
FROM lineitem
WHERE suppkey > 0;
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 4                   | 37.8               | 1.0                     |
| Baseline | 4                   | 54.9               | 1.45                    |

Here we read all rows. The difference is not very large since there is only so much that can be done when having to decode and copy everything. The principal inefficiency of baseline is `BlockBuilder` and again the fact of always allocating new memory. The main point of this query is to show that the techniques used here are never worse than baseline.

## Filter reordering
```sql
SELECT count (*)
FROM lineitem
WHERE partkey < 19000000 AND suppkey < 900000 AND quantity < 45 AND extendedprice < 9000;
```
| Version              | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------------------- | ------------------- | ------------------ | ----------------------- |
| Aria                 | 5                   | 52                 | 1.0                     |
| Aria w/no reordering | 5                   | 57                 | 1.09                    |
| Baseline             | 7                   | 96                 | 1.84                    |

Here we have a conjunction of low selectivity filters, each true approximately 9/10 of the time. We are running Aria with and without filter reordering. We see about 10% gain from reordering even in a situation where the difference between different filter orders is small. We discussed the basic principle of reordering in [Everything You Always Wanted To Do in Table Scan](/blog/2019/06/29/everything-you-always-wanted-to-do-in-a-table-scan). Measure the time per dropped row and put the fastest first.

```sql
SELECT COUNT(*), MAX(partkey)
FROM hive.tpch.lineitem
WHERE comment LIKE '%fur%' AND partkey + 1 < 19000000 AND suppkey + 1 < 100000;
```
| Version              | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------------------- | ------------------- | ------------------ | ----------------------- |
| Aria                 | 7                   | 98.7               | 1.0                     |
| Aria w/no reordering | 24                  | 339                | 3.43                    |
| Baseline             | 25                  | 361                | 3.65                    |

Here we have a case where adaptivity makes a large difference with expensive filter expressions. The key to the puzzle is that the conjunct on `partkey` is cheap and selects 1/10. The like is 1/5 and expensive. The `partkey` is cheap and 19/20. Putting `suppkey` first wins the race. This happens without any reliance on statistics or pre-execution optimization and will adapt at run time if the data properties change.

## More flexible filters

```sql
SELECT COUNT(*), SUM(extendedprice)
FROM lineitem
WHERE shipmode LIKE '%AIR%' AND shipinstruct LIKE '%PERSON';
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 4                   | 44.2               | 1.0                     |
| Baseline | 21                  | 271                | 6.13                    |

The filtered columns are of low cardinality and are encoded as dictionaries. This is an example of evaluating an expensive predicate on only distinct values. Baseline Presto misses the opportunity because all filters are generated into a monolithic code block. Aria generates filter expressions for each distinct set of required columns. In this case the filters are independent and reorderable.

```sql
SELECT COUNT(*), SUM(extendedprice)
FROM lineitem
WHERE shipmode LIKE '%AIR%';
```
| Version  | Wall time (seconds) | CPU time (seconds) | Baseline CPU / Aria CPU |
| -------- | ------------------- | ------------------ | ----------------------- |
| Aria     | 4                   | 38.5               | 1.0                     |
| Baseline | 5                   | 52.9               | 1.37                    |

When we select on only one column, baseline Presto can use its dictionary aware filter and the difference drops to the usual magnitude.

## Try Aria
The prototype of Aria is [available](https://github.com/aweisberg/presto/tree/aria-scan-prototype) to experiment with along with [instructions](https://github.com/aweisberg/presto/blob/aria-scan-prototype/BENCHMARK.md) on how to try these queries yourself.

The ideas presented here are currently being integrated into mainline Presto.

# Conclusions and Next Steps
We have so far had a look at the low-hanging fruits for scanning flat tables. These techniques are widely known and their use in Presto are a straightforward way to improve it.

In the next installment we will look at more complex cases having to do with operating on variously nested lists, structs and maps. After this we will talk about experiences of implementation and considerations of efficient use of Java.
