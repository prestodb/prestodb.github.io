---
title: Everything You Always Wanted To Do in Table Scan
author: Orri Erling
authorURL: https://www.linkedin.com/in/orrierling/
authorFBID: 100026224749124
---

Orri Erling, Maria Basmanova, Ying Su, Timothy Meehan, Elon Azoulay

Table scan, on the face of it, sounds trivial and boring. What’s there in just reading a long bunch of records from first to last? Aren’t indexing and other kinds of physical design more interesting?

As data has gotten bigger, the columnar table scan has only gotten more prominent. The columnar scan is a fairly safe baseline operation: The cost of writing data is low, the cost of reading it is predictable.

Another factor that makes the table scan the main operation is the omnipresent denormalization in data warehouse. This only goes further as a result of ubiquitous use of lists and maps and other non-first normal form data.

The aim of this series of articles is to lay out the full theory and practice of table scan with all angles covered. We will see that this is mostly a matter of common sense and systematic application of a few principles: Do not do extra work and do the work that you do always in bulk. Many systems like Google’s BigQuery do some subset of the optimizations outlined here. Doing all of these is however far from universal in the big data world, so there is a point in laying this all out and making a model implementation on top of Presto. We are here talking about the ORC format, but the same things apply equally to Parquet or JSON shredded into columns.

<!--truncate-->

We divide the presentation into several parts:

* The logical structure of the data and the operations to apply to it. What are the strictly necessary steps for producing a result?
* What are the performance gains as opposed to a naive implementation?
* How does the implementation work and what are the difficulties and tradeoffs?
* Physical aspects of execution. When are we CPU bound and when IO bound? How can we schedule IO and what do we gain from it in a world that is increasingly about disaggregated storage?
* What can we say about file formats? What are the evolutionary pressures from use cases? What about metadata?

The ideal table scan can be described in terms of first principles as follows:

* Do not materialize data that is not part of the result
* Only read the data that is strictly necessary for producing the result
* Filter early, run the most efficient filters first.
* Produce output in predictable sized chunks and run in fixed memory.

This is the logical aspect. The physical aspect is about making the best use of the IO, reading the right block sizes and doing so ahead of demand, so that the data has arrived before it is accessed.

Next, we look at this at the level of principles. In subsequent articles we look at the physical reality and what it takes to implement this.

# Structure of ORC

ORC divides data into stripes and row groups, often 10K rows per group but sometimes less, if the rows are wide. The usual case for wide rows comes from maps and lists, which may have up to a few thousand nested values per row. A stripe is a few row groups. The encoding of any particular column is set at the stripe level. For example, a column may be encoded as a dictionary in one stripe and as a sequence of values in another, according to the properties of the data.

Columns consist of streams. A stream corresponds to a contiguous area in an ORC file. Streams consist of compression chunks, which are up to 256K of raw data that may or may not be compressed with a stream compression like gzip, ZSTD, or Snappy. Different streams encode different aspects of a column, for example nullness, lengths, and the data itself.

Reading an ORC file involves a reader per column. The readers form a class hierarchy. Some readers in fact encapsulate a tree of readers, as we have structured types like lists, maps and structs.

We distinguish the following abstract super classes:

* Column reader — Encapsulates common logic for keeping track of nulls and lengths.
* Null wrapper — Superclass for streams with complex internal structure that applies to non-null values
* Repeated - A common superclass for lists and maps. This deals with logic related to having multiple nested rows for one top level row
* Variant — This encapsulates a selection of alternating readers that may be used for different stripes of one column. For example, a string reader is a variant that wraps a direct and a dictionary string reader

The actual stream readers correspond to SQL data types, like numbers and strings. The three structured types, list, map and struct wrap one or more readers of arbitrary types. A list has one nested reader for the repeated data. A struct has a reader for each member, a map has a nested reader for keys (string or number) and another for values. Combinations like lists inside maps and maps inside a struct inside a list occur frequently.

# Logical Steps in Scanning a Table

A Presto worker receives stripes to scan. It looks at the row group metadata to see if it can exclude row groups based on metadata, in practice min/max values of columns. Since data is seldom sorted or otherwise correlated, skipping whole row groups is rare.

The Presto table scan then seeks to the beginning of a row group.

The scan touches a number of columns. For each column, we either evaluate a filter and produce the set of row numbers for which the filter is true, or we retrieve the value at each row in the qualifying set. We may also do both, in which case the filter comes first. If the column has structure, i.e. is a list, map or struct, there may be filters on subfields and only a fraction of the subfields may be referenced by the query. A subfield is a member of a struct, a specific index in a list, a specific key in a map or it may refer to the number of elements in a list or map. More on this later.

At the beginning, we have a choice of filters. Some filters may be independent of any columns, for example in the case of random sampling. If we have such, these produce the initial set of rows to scan. Otherwise the initial set is a fraction of the row group. The size of the fraction depends on the width of the data and the target batch size. Thus, we have an initial selection of rows to look at. This is called a qualifying set and will get restricted as we evaluate filters.

# Different Kinds of Filters

In practice, most filters are comparisons between a single column and a literal. The literal may be a single value, a set of ranges or an IN list. Most of the time filters are AND’ed together. Each term of a top level AND is called a top-level conjunct. Most conjuncts are comparisons of a column and literal. These are separated in their own category and can be independently evaluated when decoding the representation of a column. In the Presto context we call these tuple domain filters. The next most common filter is an expression over a column, for example a regexp match of a JSON field extraction over the column. Finally, there are cases of expressions that depend on multiple columns, for example `discount > 0.08 OR comment LIKE ‘%special price%’`. The two operands of OR (disjuncts) could plausibly be evaluated on the column itself but the OR makes this a two-column expression. A more common example of a multicolumn filter is a hash join probe pushed down into a scan with a multi-part key. We will come back to this later.

# Filter and Column Order

SQL does not specify any order for evaluating filters. The rows for which all conjuncts are true are the result of the selection. Most filters are defined for all values in a column; thus, errors are infrequent. However, some filters may produce errors, e.g. division by zero, and in those cases different filter orders may have different error behavior.

Presto in its initial state evaluates complex filters left to right in the order of the original query and signals the leftmost error of the first row that has an error. We change this to reordering filters according to their performance and to signaling the first error on the first row that has no false filters.

Having defined this, we now have full freedom in rearranging filters so that we get the most selection as early as possible. The cost function of a filter is `time / (rows_in / rows_out)`. The lower the value, the better the filter. Thus, we can sort all filters by this score and since we can read the columns independently and, in any order, we can rearrange the column order according to the filter order. The only constraint is that a multicolumn filter may not be placed earlier than its last operand.

The theoretically complete solution to this ordering problem would be like query join order selection where we run a cost model on all possible permutations. In practice, something simpler works just as well, in this case placing all the single column filters in order of ascending cost and then placing all multicolumn filters, starting with the cheapest, after the last column this depends on. If a column the filter depends on is not in the set of columns placed so far, it is added. After all filters are placed, we place all the non-filtered columns, widest first.

# Nested Structure: Lists, Maps and Structs

Scanning a struct is just like scanning a group of top-level columns. The reason why the columns inside a struct cannot just be treated as regular top-level columns is that they all share a struct-level null indicator. Within the struct, exactly the same filter order choices are possible as between top level columns. Reading a struct thus starts with a qualifying set of row numbers at the level of the struct. This is translated into a set of row numbers at the level of the struct members. This translation is identity if there are no null structs. The inner qualifying set is then restricted by filters over struct columns. Finally, this is converted into a set of qualifying rows at the outer level. If null structs are included in the result, the nulls are added after everything else. This last step happens only if there were no filters other than is null on struct members.

A list or map is like a struct, except that now there may be zero or more nested rows per top level row. Now the inner qualifying set is a two-way mapping from top level row to the set of corresponding nested row numbers and back.

Filtering over lists or maps adds the extra complication of applying a different filter on different positions of one column. Consider the case of `features[1] = 2 AND features[3] = 4`. This is in fact a very common case, especially in machine learning applications where training data is often represented as a map.

The map reader here reads the keys and filters out the positions where the value is either 1 or 3. From this, the reader knows which value positions should have `= 2` and `= 4` as a filter. The qualifying set for the values column reader is set to these rows and a position dependent filter is created so that we alternately apply one or the other condition. If, for any enclosing row, we had less than 2 filter hits, the row is discarded. If for any enclosing row, we placed less than 2 filters then a key was absent, which is either and error or discards the row. A global configuration controls the error behavior for `[]`. The `element_at(map, key)` form is always null for missing keys.

There are some more complications depending on whether all or part of the map keys are projected out but the general principle as above. Lists are like maps, except that here we do not need the key column to map a top-level row number and subscript to a position in the value column.

The Facebook DWRF format, a customized ORC V1, has an additional concept called a flat map. This has one column of values and present flags for each distinct key. When reading a subset of keys, this is much more efficient than the direct map where it is at the very least necessary to skip over values that are not wanted. The reader for this becomes a modified struct reader. This reintroduces the possibilities of filter reordering also for maps.

Finally, there are cases of deeply nested maps, lists and structs. Expressions like `map[1].field.list[0] = 10 AND map[2].field2.list2[1] = 11` involve a tree of position dependent filters. These operations are composable and work as expected by just stacking multiple levels of inner to outer row numbers on top of each other. In all cases we get long tight loops over the leaf columns and need no tuple at a time processing.

# Adaptation

So far, we have two kinds of adaptation: Filter order and batch size. The point of filter order is obvious: In the good case, it costs nothing and in the bad case it saves the day. It does this without relying on an optimizer cost model, which is an extra plus. Statistics are often absent or wrong and, in any case,, these do not cover data correlations. This is not so much an issue in a DBMS which writes all its data but is more of an issue with a data lake where multiple engines work on the same data and there is no centralized control over metadata.

Adapting the batch size is a compromise between having long loops over consecutive values and maintaining a memory cap on intermediate results. The basic point of columnar data representation is that it is efficient to compress and loop over consecutive values of one column: The same operation applies to all and the values are all of one domain. The longer one stays with one column the less time one spends in interpreting the query, e.g. switching between columns.

But with data that is usually wide, always denormalized and has unpredictable runs of repeated elements, it is no longer practical to do for example 1K values of a column and then move to the next column.

In practice, we are always operating under memory pressure and basically all reliability incidents with Presto have to do with running out of memory. For this reason, we must enforce a memory cap in scanning a table.

This is done by keeping statistics over filter selectivity and column width. The basic formula is to start with the proposed batch size and for each column add the value size times the product of selectivity’s of filters applied before the column. This gives the estimated size of the batch. One needs to apply reasonable safety margins because data is not uniformly distributed. In this way we get an estimate that allows scaling the batch size so that we are likely to fit within budget. If a hard limit is exceeded, we retry the scan with a much smaller batch size.

This is relatively easy to implement and as long as the retry happens in under 1/1000 of the row groups we are fine.

In practice, for getting the gains from tight loops over columns, it is enough that we loop over several thousand values of the highest cardinality column. Usually this is the deepest nested column. If there is this pattern of nesting, the number of top-level rows processed in a batch is not very significant.

# Conclusions and Next Steps

We have described the general operation of scanning columnar data and what choices and optimization possibilities there are. Next, we will look at results and compare with baseline Presto using TPC-H with both flat tables and nested structures.
