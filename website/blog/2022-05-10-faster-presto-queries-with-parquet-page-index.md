---
title: Faster Presto Queries with Parquet Page Index
author: Xinli Shang
authorURL: https://www.linkedin.com/in/xinli-shang-2479863/
---
**Uber:** Xinli Shang

**Uber:** Chen Liang

## Introduction
Today’s data is growing very fast, which creates challenges for query engines like Presto.  Presto is a popular interactive query engine, because of its scalability, high performance, and smooth integration with Hadoop. As the volume of data grows, Presto needs to read larger chunks of data and load them into memory, which causes higher IO, memory usage, and GC time etc.

Apache Parquet is an open source, column-oriented data file format designed for efficient data storage and retrieval. It provides efficient data compression and encoding schemes with enhanced performance to handle complex data in bulk.

There are some initiatives done earlier to speed up the Presto reading Parquet data, but there is still a lot of data to read. Since the Java version Parquet(parquet-mr 1.11.0) release, a feature called Page Index has been added to speed up the queries by filtering unnecessary Parquet pages in column chunks.

This article discusses this feature, the porting status into Presto and the benchmark testing result. 

##  Parquet Statistics
Parquet file metadata contains statistics which have the min/max values of the data in the file. For a given query filter of a query,  the min/max value of the statistics can be used as the range of the values for the filter to look up. If the value being looked for is not in the range, we can skip reading that chunk of data. As a result, it improves resource usage like IO, memory and CPU time and eventually speeds up the queries.  

The example below shows how a filter is applied to a table with statistics. The filter ‘x > 100’ is looking for values that are in the range (100, ∞). The statistics in the table showing only the second  column that has min value 1 and  max value 209, which forms a range [1, 209], has overlap with the range of the filter. As a result, we can  skip reading all 3 other columns which reduce ¾ data reading time.

![Example of Parquet Statistics Usage](/img/blog/2022-05-10-faster-presto-queries-with-parquet-page-index/image3.png)

## Parquet Page Index 
Parquet has the statistics for column chunk and page. For the concept of chunk and page, please read the Parquet file format for more details. The statistics for a column chunk indicates the range of the values for the data in that column chunk, while the page statistics indicates it for the page data, which is finer grained and more effective.  Here are examples on how page statistics can help better on reducing data reading than column statistics.

In the first example below, we have a query which has a filter ‘x = 2000’. For demonstration purposes only, we just show three pages in a column chunk. The three pages in the diagram have statistics that forms ranges of [-100, 60],  [50, 234], [800, 1000]. The column chunk has the statistic that forms the range [-100, 1000]. Since we are looking for the value of 2000, neither page statistics nor the column chunk statistics indicate we should read the data in this column. In this case, page statistics and column chunk statistics equally effective to reduce data reading. 

![Effectiveness Comparison: Both Reject](/img/blog/2022-05-10-faster-presto-queries-with-parquet-page-index/image8.png)

In the second example, the data and statistics in both column chunk and page are the same as the first example. The only change is the filter ‘x = 55’.  In this case, the column chunk statistic range [-100, 1000] determines ‘yes’ to read because it falls into its range. The first page statistic range [50, 234] and the second one [-100, 60]  also determines ‘yes’ for the same reason, but the last page determines ‘no’, because it fall out of it range [800, 1000]

![Effectiveness Comparison: Column Statistics accept, Page Statistics partially accept](/img/blog/2022-05-10-faster-presto-queries-with-parquet-page-index/image5.png)

In the third example, the data and statistics in both column chunk and page are still the same as the first example, but the filter is changed to ‘x =  700’. The column chunk statistic still determines ‘yes’ because it falls into its range [-100, 1000], but all the page statistics determine ‘no’ because none of them have a range that can cover the value ‘700’ that we are looking for. As a result, the whole column data is skipped for reading. 

![Effectiveness Comparison: Column Statistics accept, Page Statistics reject](/img/blog/2022-05-10-faster-presto-queries-with-parquet-page-index/image6.png)

In the above examples, we only show 3 pages in a column chunk, but in reality generally it has tens or hundreds pages in a column chunk. So the savings would be larger in reality. If the column data is sorted, the page statistics work the better because the possibility of false alarm is reduced.   

## Page Statistics in Presto
The page statistics in older versions than 1.11.0 are placed in the page header. The problem is that the reader has to read each individual page to get the page statistics. Then even if it determines later not to read the page, but it is already read. The parquet-mr 1.11.0 fixed this issue by placing all the page statistics for a column chunk into one place, so that the reader can read them at once and make determination which page should be read.
Because Presto partially rewrites the parquet-mr code, we need to port the changes in Parquet 1.11.0 into the Presto code base. The code change([PR-17284](https://github.com/prestodb/presto/pull/17284)) has been merged into Presto master branch in Feb 2022 and will be released in the 0.273 version.

## Benchmark Result
We benchmarked the Parquet column index based on one of our heavily accessed production tables. We created a test table that is a snapshot of the original production tables with some partitions, and the test table is sorted. We then run Presto queries on the table from our staging environment. The Page Index feature can be opted on and off on a per query level using Presto session property. This allows us to do side-to-side comparison.

We observed great improvement potential on input data scan. The figures below show the stats of running one example query when Parquet Paeg Index is enabled (left) vs disabled (right). As can be seen, they generated the same data for this stage, but it had to scan 149.31MB/239K rows raw input data when Parquet column index was not enabled, while it only needed to scan 63.31MB/75.4K rows raw input data if we enable Parquet column index. This is a 57% input read volume reduction. This is because when using Parquet Page Index, the operator can identify and skip pages that did not fall into the filter condition.

![Benchmarking Result with Page Index Disabled](/img/blog/2022-05-10-faster-presto-queries-with-parquet-page-index/image2.png)
![Benchmarking Result with Page Index Enabled](/img/blog/2022-05-10-faster-presto-queries-with-parquet-page-index/image1.png)

Besides the raw input read volume improvement, we also observed memory usage improvement from our testing. As can be seen from screenshots below, when enabling Parquet Page Index (right), it only needed to use 91.73MB peak memory vs 141.60 MB memory when Parquet Page index was not enabled. This improvement is expected: as the query needs to read less raw input data,  the query demands less memory to keep the data in memory.

![](/img/blog/2022-05-10-faster-presto-queries-with-parquet-page-index/image4.png)
It is worth noting though, our testing Presto queries have filters on the sorting column, for example, a filter such as WHERE foo = bar condition where foo is the sorting column. This is where the Parquet Page Index brings the most of the read reduction. If the column data that the filter relies on is not sorted, then benefit could be less. 