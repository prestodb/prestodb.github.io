---
title: Quick Stats - Runtime ANALYZE for Better Query Plans with Presto 
author: Ali LeClerc, Chair of Presto Foundation Outreach Team
authorURL: https://www.linkedin.com/in/alidodson/
---

At PrestoCon Day, Anant Aneja of Ahana, an IBM Company introduced a new feature for Presto called Quick Stats which aims to enhance query optimization by providing up-to-date statistics for the query optimizer. This enables more accurate cost-based decisions and better selectivity for non-trivial queries. In this blog post we’ll recap the details and benefits of Quick Stats for Presto and how it can help improve query optimization. 

<!--truncate-->
<div style="text-align: center;">
  <em>Sign up for the <a href="https://prestodb.io/newsletter.html" style="color:blue;">Presto community newsletter</a></em>
</div>
<br>

## The Need for Up-to-Date Statistics 

An essential component of efficient query planning is having accurate statistics. Ahana had observed that for many customer workloads, queries performed on new tables or recently loaded partitions suffered from poor query plans. This was primarily due to the lack of statistics, as Presto reported "unknown" statistics for tables, partitions, and columns. 

Traditionally, the recommended solution was to run the ANALYZE command on new data inserted into tables. However, this approach can be costly and challenging to implement correctly. Determining which partitions were updated and when the operation was last performed can be a complex task, often overlooked in ETL pipelines. 

Additionally, running queries against non-Hive metastores, such as Iceberg or Hudi tables, could lead to a similar issue. When these tables are brought online for the first time, they might be missing backing statistics, resulting in suboptimal query plans. 

## Introducing Quick Stats: Leveraging Metadata Sources 

To address these challenges, Ahana recognized the potential of exploiting alternative metadata sources to build a quick version of statistics. By leveraging these sources, the optimizer could generate decent joint planning models, even without comprehensive statistics. 

Ahana identified metadata sources similar to those available for popular file storage formats like Parquet and ORC, which provide statistics such as minimum and maximum values, null counts, and total cardinality for files. These statistics can be aggregated to understand the overall cardinality across queried partitions. 

To ensure efficiency, Ahana implemented a bounded approach to building statistics inline with query execution. By caching these statistics, they could be reused for future queries, eliminating the need for redundant operations. 

## Quick Stats Workflow 

Let's take a closer look at the workflow enabled by Quick Stats: 

1. A query arrives, and the planner identifies the partitions that have missing statistics. 

2. For such partitions, the quick stats provider is invoked, which checks its cache for previously computed statistics. 

3. If statistics are not cached, stats builder plugins are explored one-by-one to check if they can be used to build stats. For example, the *ParquetQuickStatsBuilder* plugin builds stats from parquet footers (if the partition contains parquet files). By utilizing a plugin model, multiple metadata sources can be exploited to build up-to-date statistics for the table/partition. 

4. The built stats are cached for use by subsequent queries. 

![Workflow](/img/blog/2023-07-20-quick-stats-presto-blog/Workflow.png)

## Evaluating Quick Stats: Results and Benefits 

During initial testing, Ahana compared the performance of queries on a TPC-H scale factor 100, Parquet schema with and without Quick Stats. The results were striking: 

- Without Quick Stats, Presto reported no statistics, resulting in poor query plans. 

- The join differences between queries with and without statistics were significant, leading to suboptimal execution times. 

- With Quick Stats and utilizing Parquet statistics, you see statistics including MIN and MAX values for all the columns and overall row count 

- Although some subplans differed due to missing statistics like NDVs and data sizes, the optimizer was able to generate better plans overall. 

The impact on query latency was evident. Queries without statistics performed poorly, but once Quick Stats were incorporated, the execution times aligned with expectations, showcasing the benefits of accurate statistics. 

![Latency](/img/blog/2023-07-20-quick-stats-presto-blog/Latency.png)

## What’s coming next 

So what’s coming next? Here’s what Ahana is working on (and has worked on) for Presto Quick Stats: 

**Distinct Value Estimates:** Computing number of distinct values (NDVs) from parquet footers is not possible, since parquet footers do not track data sketches. NDVs are essential for determining the selectivity factor for a join. To address this limitation, Ahana introduced a feature called "default join selectivity." This factor, set to 0.1, is applied during joins to improve query plans. However, more precise NDV estimates would require further enhancements. 

**Expansion of Strategies:** Ahana plans to build out additional strategies, such as the Iceberg Quick Stats Builder strategy. By incorporating different strategies, Quick Stats can support a broader range of metadata sources, enabling more accurate statistics for various file storage formats. 

**Sampling Enhancement:** Ahana intends to explore the use of sampling techniques to improve NDV estimates. Sampling can provide a representative subset of data for statistical analysis, enabling more precise estimations of distinct values. 

## Better query optimizer capabilities in Presto 

In this blog, we recapped Ahana's presentation on Presto's new feature, Quick Stats. By leveraging alternative metadata sources to build stats in-line with query execution, Quick Stats enhances the query optimizer's capabilities in Presto. The incorporation of accurate statistics leads to better query plans and therefore improved execution times for queries. 

While Quick Stats provides significant benefits, there are considerations, such as the absence of distinct value estimates, which Ahana addresses through the "default join selectivity" feature. Looking ahead, Ahana's roadmap includes expanding strategies and exploring stats built from samples to further enhance the accuracy and usefulness of Quick Stats. 

With Quick Stats, Presto users can unlock the power of up-to-date statistics and optimize their data analytics workflows with greater confidence and efficiency. Stay tuned for future updates and enhancements as Ahana continues to evolve this valuable feature. 

You can check out the <a href="https://www.youtube.com/watch?v=NotgeUG8V4E&list=PLJVeO1NMmyqXm5_fuFoKyMfZWyT5jOeKh&index=13" style="color:blue;">full talk on the Presto Foundation YouTube channel</a>. 