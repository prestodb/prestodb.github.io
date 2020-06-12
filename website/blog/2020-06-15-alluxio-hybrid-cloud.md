---
title: On-Demand Presto+Alluxio for Data Analytics in Hybrid Cloud
author: Adit Madan
authorURL: https://www.linkedin.com/in/aditm/
---

The whitepaper, [“Zero-Copy” Hybrid Cloud for Data Analytics - Strategy, Architecture, and Benchmark Report](https://www.alluxio.io/resources/whitepapers/zero-copy-hybrid-cloud-for-data-analytics-strategy-architecture-and-benchmark-report/), was originally published by Alluxio on the Alluxio Engineering Blog on April 6, 2020. Check out our [blogs](https://www.alluxio.io/blog/) for more articles about Alluxio’s engineering work and join Alluxio Open Source community on [Slack](http://alluxio-community.slack.com) for any questions you might have. 

Today’s conventional wisdom states that network latency across the two ends of a hybrid cloud prevents you from running analytic workloads in the cloud with the data on-premises. As a result, most companies copy their data into a cloud environment and maintain that duplicate data (also known as Lift and Shift). Companies with compliance and data sovereignty requirements may even prevent organizations from copying data into the cloud. All of this means that it is challenging to make on-premise Hadoop data accessible with the desired application performance.

This article details how to leverage a public cloud to scale Presto workloads using data stored on-premises without copying and synchronizing the data into the cloud. We will show an example of what it might look like to run on-demand Presto and Hive with Alluxio in the public cloud using on-premise HDFS. We will also show how to set up and execute performance benchmarks in two geographically dispersed Amazon EMR clusters along with a summary of our findings.

## Hybrid Cloud Architecture with Alluxio

[Alluxio](https://www.alluxio.io/) is a [data orchestration platform](https://www.alluxio.io/data-orchestration/) for analytics and machine learning applications. Counter to conventional wisdom, you can enable high performance for data analytics across a hybrid cloud by mounting on-premises data sources into Alluxio.

Alluxio integrates with the private computing environment on-premises and the public cloud computing environment to provide an enterprise hybrid cloud analytics strategy. Workloads can be migrated to the public cloud on-demand without moving data between computing environments first. By bringing data to applications on-demand, the performance with Alluxio for migrated workloads is the same as having data co-located in the public cloud. The private computing environment is offloaded and the I/O overhead is minimized.

![](/img/blog/2020-06-15-alluxio-hybrid-cloud/PrestoAlluxioHadoop.png)

Alluxio integrates with the private computing environment on-premises and the public cloud computing environment to provide an enterprise hybrid cloud analytics strategy. Workloads can be migrated to the public cloud on-demand without moving data between computing environments first. By bringing data to applications on-demand, the performance with Alluxio for migrated workloads is the same as having data co-located in the public cloud. The private computing environment is offloaded and the I/O overhead is minimized.

The deployment architecture consists of a cloud compute cluster, containing Alluxio and Presto, connecting to an HDFS storage cluster on-premises. The core building blocks of this architecture are applicable to other hybrid cloud environments as well, especially when there is a high latency or low bandwidth link separating the two clusters.  

![](/img/blog/2020-06-15-alluxio-hybrid-cloud/AlluxioArchitecture.png)

A comprehensive description of Alluxio’s architecture can be found [here](https://docs.alluxio.io/ee/user/stable/en/overview/Architecture.html).

![](/img/blog/2020-06-15-alluxio-hybrid-cloud/DirectConnect.png)

In this deployment scenario, Alluxio is co-located with the compute framework. In the diagram above, Alluxio and Presto are co-located on an [Amazon EMR](https://aws.amazon.com/emr/) cluster. The following features are realized with Alluxio. 
- **Data locality**: Since Alluxio is co-located with compute, Presto read workloads see a performance boost from node locality and [short-circuit access](https://docs.alluxio.io/ee/user/stable/en/overview/Architecture.html?q=short-circuit#local-cache-hit). Similarly, write workloads can proceed without a bandwidth limitation.
- **Ease of deployment**: Alluxio is deployed and pre-configured natively for Hadoop, Presto, and Spark on EMR using the available [bootstrap action](https://docs.alluxio.io/ee/user/stable/en/cloud/AWS-EMR.html).
- **Ease of manageability**: The Alluxio deployment is easy to manage and scale up or down for elasticity along with compute. Even when the Alluxio workers are scaled down to zero instances and then scaled back up, Alluxio can retrieve data from the data source on-premises without interruption.
- **Zero Time-to-Available-Data with Long-Running Masters**: By having long-running [master nodes](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-master-core-task-nodes.html), Alluxio maintains an up-to-date copy of metadata in sync with the data source even while files are mutated on-premises by prevailing data ingestion pipelines using a feature called [Active Sync](https://docs.alluxio.io/ee/user/stable/en/core-services/Unified-Namespace.html?q=active%20sync#metadata-active-sync-for-hdfs). Data is made accessible instantly without the performance overhead associated with fetching the metadata from the data store on-premises during query execution.

## Benchmarking Performance

For benchmarking, we will use Presto as the compute framework to run SQL queries on data in a geographically separated Hive and HDFS cluster.

![](/img/blog/2020-06-15-alluxio-hybrid-cloud/VPCPeering.png)

The hybrid cloud environment used for experimentation in this section includes two Amazon EMR clusters in different AWS regions. Because the two clusters are geographically dispersed, there is noticeable network latency between the clusters. [VPC peering](https://docs.aws.amazon.com/vpc/latest/peering/create-vpc-peering-connection.html) is used to create VPC connections to allow traffic between the two VPCs over the global AWS backbone with no bandwidth bottleneck. Readers can follow the [tutorial in the whitepaper](https://www.alluxio.io/resources/whitepapers/zero-copy-hybrid-cloud-for-data-analytics-strategy-architecture-and-benchmark-report/) to reproduce the benchmark results if using AWS as the cloud provider.

We use data and queries from the industry standard [TPC-DS](http://www.tpc.org/tpcds/) benchmark for decision support systems that examine large amounts of data and answer business questions. The queries can be categorized into the following classes (according to visualizations in this [repository](https://github.com/databricks/spark-sql-perf/blob/e9ef9788c2094aeb40c0f7d883b8c1cb0f852b74/src/main/notebooks/performance.dashboard.scala)): Reporting, Interactive, and Deep Analytics.

With Alluxio, we collect two numbers for all TPC-DS queries; denoted by **Cold** and **Warm**. 
- **Cold** is the case where data is not loaded in Alluxio storage before the query is run. In this case Alluxio fetches data from HDFS on-demand during query execution.
- **Warm** is the case where data is loaded into Alluxio storage after the Cold run. Subsequent queries accessing the same data do not communicate with HDFS. 

With HDFS, we collect two numbers as well; **Local** and **Remote**.
- **Local** is the case where Presto and HDFS are co-located in the same region. This number shows us the performance of running the compute on-premises when data is local without bursting into the cloud.
- **Remote** is the case where Presto reads from storage in another region.

### TPC-DS Data Specificiations

| Scale Factor | Format  | Compression | Data Size | Number of Files |
| ------------ | ------- | ----------- | --------- | --------------- |
| 1000         | Parquet | Snappy      | 463.5 GB  | 234.2 K         |

### EMR Instance Specificiations

| Instance Type | Master Instance Count | Worker Instance Count | Alluxio Storage Volume (us-west-1) | HDFS Storage Volume (ap-southeast-1) |
| ------------- | --------------------- | --------------------- | ---------------------------------- | ------------------------------------ |
| r5.4xlarge    | 1 each                | 10 each               | NVMe SSD                           | EBS                                  |

We compare the performance of Alluxio (Cold and Warm) with HDFS (Local and Remote). Benchmarking shows an average of **3x improvement** in performance with Alluxio when the cache is warm over accessing HDFS data remotely.

![](/img/blog/2020-06-15-alluxio-hybrid-cloud/AlluxioWarmVsHdfsRemote.png)

The following table summarizes the results by class. Overall the maximum improvement seen with Alluxio was for q9 (7.1x) and the minimum was for q39a (1x - no difference).

Query Class: Reporting
Max Improvement: q27 (3.1x)
Min Improvement:  q43 (2.7x)

![](/img/blog/2020-06-15-alluxio-hybrid-cloud/TpcdsReporting.png)

Query Class: Interactive
Max Improvement: q73 (3.9x)
Min Improvement:  q98 (2.2x)

![](/img/blog/2020-06-15-alluxio-hybrid-cloud/TpcdsInteractive.png)

Query Class: Deep Analytics
Max Improvement: q34 (4.2x)
Min Improvement:  q59 (1.9x)

![](/img/blog/2020-06-15-alluxio-hybrid-cloud/TpcdsDeepAnalytics.png)

With a 10 node compute cluster, the peak bandwidth utilization throughout running all the queries remained under 2Gbps when accessing data from the geographically separated cluster. Bandwidth was not the bottleneck with the AWS backbone network. As the utilization scales with the size of the compute cluster, a bandwidth bottleneck could be expected for larger clusters when not using Alluxio since the bandwidth available with Direct Connect may be limited.

Most of the performance gain seen with Alluxio is explained by the latency difference for both metadata and data, when cached seamlessly into the localized Alluxio cluster.


![](/img/blog/2020-06-15-alluxio-hybrid-cloud/TpcdsAll.png)

## Conclusion

The hybrid cloud architecture allows cloud computing resources to be used for data analytics, even if the data resides in a completely different network. In addition to achieving significantly better performance, the execution plan outlined does not require any significant reconfiguration of the on-premise infrastructure. Since users can harness the compute power of a public cloud, this opens up more opportunities for Presto to be utilized as a scalable and performant compute framework for analytics using data stored on-premises.

