export const Items = [
  {
    title: "Presto Tech Talk: Intro to Presto and Superset",
    description:
      "Presto and Superset are a powerful combination, because it enables analysts to query data from a data lake environment or join data from multiple data sources. In this event, we’ll do an introductory demo on how to query data from S3 using Presto to build a Superset dashboard.",
    thumbnail: "prestotechtalk-video-1.jpg",
    video:
      "https://www.youtube.com/watch?v=32gIQey6dGY&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=1&t=1s",
  },
  {
    title:
      "Build & Query Secure S3 Data Lakes with Ahana Cloud and AWS Lake Formation",
    description:
      "AWS Lake Formation is a service that allows data platform users to set up a secure data lake in days. Creating a data lake with Presto and AWS Lake Formation is as simple as defining data sources and what data access and security policies you want to apply. In this talk, Wen will walk through the recently announced AWS Lake Formation and Ahana integration",
    thumbnail: "buildandquery-video-2.jpg",
    video:
      "https://www.youtube.com/watch?v=d8gEMe5jy-c&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=3",
  },
  {
    title: "Real Time Analytics at Uber with Presto-Pinot",
    description:
      "In this talk, seasoned engineers at Uber will walk through the real time analytics use cases at Uber and the work they have done on the Presto architecture and the Presto-Pinot connector to address them.",
    thumbnail: "realtimeanalyticsuber-video-3.jpg",
    video:
      "https://www.youtube.com/watch?v=p_HRY7UQej4&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=2&t=3s&ab_channel=PrestoFoundation",
  },
  {
    title: "(Chinese) Presto at Bytedance - Hive UDF Wrapper for Presto",
    description:
      "Presto has been widely used at Bytedance in several ways such as in the data warehouse, BI tools, ads etc. And, the Presto team at Bytedance has also delivered many key features and optimizations such as the Hive UDF wrapper, coordinator, runtime filter and so on which extend Presto usages and enhance Presto stabilities. Nowadays, most companies will use both Hive (or Spark) and Presto together. But Presto UDFs have very different syntax and internal mechanisms compared with Hive UDFs. This restricts Presto usage while users need to maintain 2 kinds of functions. In this talk, we will present a way to execute Hive UDF/UDAF inside Presto.",
    thumbnail: "prestoatbytedance-video-4.jpg",
    video:
      "https://www.youtube.com/watch?v=AOaGcBN8Y6k&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=4",
  },
  {
    title:
      "(Chinese & English) Presto at Meta: A Guide to Tuning Clusters at Enormous Scale",
    description:
      "Facebook operates Presto at an enormous scale. A critical part of the success of Presto is properly tuning the clusters according to the use case they target. Swapnil Tailor, Basar Onat and Tim Meehan describe important session properties and configuration properties used to configure Presto, and guidance on when and how to use them.",
    thumbnail: "prestoatmeta-video-5.jpg",
    video:
      "https://www.youtube.com/watch?v=CzZ7jotj5VM&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=5",
  },
  {
    title: "Presto at Meta: A Guide to Tuning Clusters at Enormous Scale",
    description:
      "Facebook operates Presto at an enormous scale. A critical part of the success of Presto is properly tuning the clusters according to the use case they target. Swapnil Tailor, Basar Onat and Tim Meehan describe important session properties and configuration properties used to configure Presto, and guidance on when and how to use them.",
    thumbnail: "prestoatmeta-video-6.jpg",
    video:
      "https://www.youtube.com/watch?v=VZLxk_zulJ4&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=6",
  },
  {
    title: "Presto at Bytedance- Hive UDF Wrapper for Presto",
    description:
      "Presto has been widely used at Bytedance in several ways such as in the data warehouse, BI tools, ads etc. And, the Presto team at Bytedance has also delivered many key features and optimizations such as the Hive UDF wrapper, coordinator, runtime filter and so on which extend Presto usages and enhance Presto stabilities. Nowadays, most companies will use both Hive (or Spark) and Presto together. But Presto UDFs have very different syntax and internal mechanisms compared with Hive UDFs. This restricts Presto usage while users need to maintain 2 kinds of functions. In this talk, we will present a way to execute Hive UDF/UDAF inside Presto.",
    thumbnail: "prestoatbytedance-video-7.jpg",
    video:
      "https://www.youtube.com/watch?v=57kwBoPIBKM&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=7",
  },
  {
    title: "Querying streaming data with Presto, Amazon Athena and Upsolver",
    description:
      "In this session, Yoni will present on querying streaming data with Presto and Amazon Athena including performance, data partitioning and compaction. In addition, we will demo using the Upsolver platform with Amazon Athena. In addition, he will share what they are working on with Prestodb.",
    thumbnail: "querystreamingdata-video-8.jpg",
    video:
      "https://www.youtube.com/watch?v=XOldUGyHTlE&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=8",
  },
  {
    title: "Discovering Data with Presto and Amundsen at Lyft",
    description:
      "Amundsen is an open-source data discovery and metadata platform which is part of LF AI & Data foundation. In this talk, we will deep dive into Amundsen's architecture and how we integrate Amundsen with Presto to power the data preview and data exploration.",
    thumbnail: "discoveringdata-video-9.jpg",
    video:
      "https://www.youtube.com/watch?v=EdH-mT23wd0&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=9",
  },
  {
    title: "Running PrestoDB on Kubernetes with Ahana Cloud and AWS EKS",
    description: "PrestoDB is built to be cloud agnostic and container-friendly, but getting it to run on Kubernetes in the cloud can be challenging. In this talk, Gary Stafford (AWS) and Dipti Borkar (Ahana) will discuss: Why use the in-VPC deployment model with AWS and demo, etc - Deploying PrestoDB on AWS EKS using the Ahana Cloud managed service within the user’s AWS account",
    thumbnail: "runningprestodb-video-10.jpg",
    video: "https://www.youtube.com/watch?v=pPMCkG9KiHM&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=10",
  },
  {
    title: "Parquet Column Level Access Control with Presto",
    description:
      "including challenges, solutions, integration with Hive/Spark Parquet column encryption and look forward to the next step of encryption work.",
    thumbnail: "parquetcolumn-video-11.jpg",
    video:
      "https://www.youtube.com/watch?v=lnk4M94_Wg4&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=11",
  },
  {
    title:
      "Presto at Walmart and enhancements for cross cloud query federation",
    description:
      "In this talk we are going to introduce Presto cross environment query federation which will enable query execution across different clouds and on-prem Presto clusters. This helps in reducing the network data transfer which results in lower Egress and Ingress costs when we are querying across clouds.",
    thumbnail: "prestoatwalmart-video-12.jpg",
    video:
      "https://www.youtube.com/watch?v=w22fXF8cFKk&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=12",
  },
  {
    title: "Presto and Apache Hudi",
    description:
      "In this talk we are going to introduce Hudi, discuss different table/query types and how Hudi integrates with Presto to support these queries. We like to share our experience on how this integration has evolved over time and also discuss upcoming file listing and query planning improvements in Presto Hudi queries.",
    thumbnail: "prestoandapache-video-13.jpg",
    video:
      "https://www.youtube.com/watch?v=nA3rwOdmm3A&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=13",
  },
  {
    title:
      "Predicting Resource Usages of Future Queries Based on 10M Presto Queries at Twitter",
    description:
      "Here, Chunxu and Beinan would like to share what they have learned in developing a highly-scalable query predictor service through applying machine learning algorithms to ~10 million historical Presto queries to classify queries based on their CPU times and peak memory bytes. At Twitter, this service is helping to improve the performance of Presto clusters and provide expected execution statistics on Business Intelligence dashboards.",
    thumbnail: "predictingresourceusage-video-14.jpg",
    video:
      "https://www.youtube.com/watch?v=Zuk5AUi6ASQ&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=14",
  },
  {
    title: "Optimizing Presto for Uber scale",
    description:
      "In this talk, we present some of the work streams we have underway at Uber to optimize Presto performance. In particular, we will cover enabling aggregation pushdown in queries in order to use statistics in the file headers/footers, our investigations into and attempts to efficiently executing approximate queries, and our experience with humongous object allocation in Presto.",
    thumbnail: "prestoforuber-video-15.jpg",
    video:
      "https://www.youtube.com/watch?v=N9y-GeuzqtY&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=15",
  },
  {
    title: "Presto on Spark - Facebook - Virtual Meetup",
    description:
      "At Facebook, we have spent the past several years in independently building and scaling both Presto and Spark to Facebook scale batch workloads. It is now increasingly evident that there is significant value in coupling Presto's state-of-art low-latency evaluation with Spark's robust and fault tolerant execution engine. In this talk, we'll take a deep dive in Presto and Spark architecture with a focus on key differentiators (e.g., disaggregated shuffle) that are required to further scale Presto",
    thumbnail: "prestoonspark-video-16.jpg",
    video:
      "https://www.youtube.com/watch?v=hpNCwr2O0Mc&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=16",
  },
  {
    title: "Building the Presto Open Source Community - Ahana Round Table",
    description:
      "In this round table moderated by Eric Kavanagh of The Bloor Group, panelists from Uber, Facebook, Ahana, and Alibaba will discuss all aspects of building a thriving open source community around PrestoDB including why Presto is so popular & the problems it solves, the open source model the foundation follows, why governance and transparency are so important to an open source community, and what the community looks for in open source projects.",
    thumbnail: "ahanaroundtable-video-17.jpg",
    video:
      "https://www.youtube.com/watch?v=ybqXixa23HY&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=17",
  },
  {
    title:
      "Enterprise Distributed Query Service powered by Presto & Alluxio across clouds at WalmartLabs",
    description:
      "In this talk, WalmartLabs is sharing how tehey build Enterprise Distributed Query Service powered by Presto & Alluxio across clouds.",
    thumbnail: "enterprisedistributedquery-video-18.jpg",
    video:
      "https://www.youtube.com/watch?v=smsRPZ0tO30&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=18",
  },
  {
    title: "Presto SQL Functions - Facebook",
    description:
      "In this talk we will show how to use the recently introduced SQL function feature, how it works, and the ongoing work to support invoking arbitrary functions remotely with remote UDF server.",
    thumbnail: "prestosqlfunctions-video-19.jpg",
    video:
      "https://www.youtube.com/watch?v=rhvfjraRbno&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=19",
  },
  {
    title:
      "How Jampp architected a real time bidding system on AWS with PrestoDB",
    description:
      "In this presentation, Dante and Fede will show Jampp’s data architecture, how they’re training their machine learning algorithms directly from Presto to identify potential purchasers, and why Presto has become 24/7 critical to ensure ads are relevant to users.",
    thumbnail: "jamparchitected-video-20.jpg",
    video:
      "https://www.youtube.com/watch?v=JQsFDVBwinA&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=20",
  },
  {
    title: "Common Sub Expression Optimization at Facebook",
    description:
      "In complex analytics queries, we often see repeated expressions, for example parsing the same JSON column but extracting different fields, elaborate CASE statement with common predicates and different ones. Previously, Presto will compute the same expression many times as they appear in query. With common sub expression optimization, we would only evaluate the same expression once within the same project operator or filter operator. In our workload, we’ve seen 3x improvements on certain queries with expensive common sub expressions like JSON_PARSE. Microbenchmark also shows a consistent ~10% performance improvement for simple common sub-expressions like x + y. In this talk, we will talk about how this is implemented.",
    thumbnail: "commonsubexpression-video-21.jpg",
    video:
      "https://www.youtube.com/watch?v=7TMj5412dQc&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=21",
  },
  {
    title: "Extending Presto at LinkedIn with a Smart Catalog Layer LinkedIn",
    description:
      "In this talk, Walaa describes how LinkedIn extended its Presto Hive Catalog with a smart logical abstraction layer that is capable of reasoning about logical views with UDFs by using two core components, Coral and Transport UDFs. Coral is a view virtualization library, powered by Apache Calcite, that represents views using their logical query plans. Walaa shows how LinkedIn leverages Coral abstractions to decouple view expression language from the execution engine, and hence execute non-Presto-SQL views inside Presto, and achieve on-the-fly query rewrite for data governance and query optimization.",
    thumbnail: "prestoatlinkedin-video-22.jpg",
    video:
      "https://www.youtube.com/watch?v=hbUMX_Qo1no&list=PLJVeO1NMmyqUO07nUAbu7RyG1AM36iCGS&index=22",
  },
];
