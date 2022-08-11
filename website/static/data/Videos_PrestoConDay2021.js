export const Items = [
  {
    title: "PrestoDB - Technical Steering Committee Update - Tim Meehan,",
    description:
      "In this talk, Technical Steering Committee member and Committer, and Software Engineer at Facebook shares Presto reliability and scalability at Facebook.",
    thumbnail: "prestodb-video-72.jpg",
    video:
      "https://www.youtube.com/watch?v=mxgPEet_u7Y&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=2",
  },
  {
    title:
      "Presto at Facebook: State of the Union - Biswapesh Chattopadhyay, Facebook",
    description:
      "An overview of how we are evolving Presto to be the next generation query engine at Facebook and beyond.",
    thumbnail: "prestoatfacebook-video-73.jpg",
    video:
      "https://www.youtube.com/watch?v=JuWiWmUtn3M&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=3",
  },
  {
    title: "Intel & Presto: Better Together - Will Werts, Intel",
    description:
      "In this talk Intel shares their Presto contribution plans and collabaration with Presto Community",
    thumbnail: "intelandpresto-video-74.jpg",
    video:
      "https://www.youtube.com/watch?v=9Dsd-igyusM&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=4",
  },
  {
    title:
      "Presto, Today & Beyond - Dipti Borkar, David Simmen, Girish Baliga & Biswapesh Chattopadhyay",
    description:
      "In this PrestoCon talk, team of community experts share Presto evolution, Today & Beyond",
    thumbnail: "presto,today,beyond-video-75.jpg",
    video:
      "https://www.youtube.com/watch?v=rGIoXoEd_Js&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=5",
  },
  {
    title: "Presto on AWS using Ahana Cloud at Cartona - Omar Mohamed, Cartona",
    description:
      "Cartona is one of the fastest growing B2B e-commerce marketplaces in Egypt that connects retailers with suppliers, wholesalers, and production companies. We needed to federate across multiple data sources, including transactional databases like Postgres and AWS S3 data lake. In this session, we’ll talk about how Presto allows us to join across all of these data sources without having to copy or ingest data - it’s all done in place. In addition, we’ll talk about how we were up and running in less than an hour with the Ahana Cloud managed service. It gives us the power of Presto and the ease of use without the need to manage it or have deep skills to deploy and operate it.",
    thumbnail: "prestoonaws-video-76.jpg",
    video:
      "https://www.youtube.com/watch?v=fibzqwCz4ok&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=6",
  },
  {
    title: "Disaggregated Coordinator - Swapnil Tailor, Facebook",
    description:
      "In the existing Presto architecture, single coordinator has become a bottleneck in a number of ways for cluster scalability. - With an increasing number of workers, the coordinator has the potential of slow down due to a high number of tasks. - In high QPS use cases, we have found workers can become starved of splits by excessive CPU being spend on task updates in coordinator. - Also with single coordinator, we have an upper limit on the worker pool because of above-mentioned reasons. To overcome with this challenges, we are coming up with a new architecture which supports multiple coordinators in a single cluster.",
    thumbnail: "disaggregatedcoordinator-video-77.jpg",
    video:
      "https://www.youtube.com/watch?v=slwPm-mROZ0&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=7&t=1s",
  },
  {
    title: "RaptorX: Building a 10X Faster Presto - James Sun, Facebook, Inc",
    description:
      "RaptorX is an internal project name aiming to boost query latency significantly beyond what vanilla Presto is capable of. For this session, we introduce the hierarchical cache work including Alluxio data cache, fragment result cache, etc. Cache is the key building block for RaptorX. With the support of the cache, we are able to boost query performance by 10X. This new architecture can beat performance oriented connectors like Raptor with the added benefit of continuing to work with disaggregated storage.",
    thumbnail: "raptorx-video-78.jpg",
    video:
      "https://www.youtube.com/watch?v=odf1Qp6b5W0&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=8&t=524s",
  },
  {
    title: "Prism: Presto Gateway Service at Uber - Hitarth Trivedi, Uber",
    description:
      "Prism is a gateway service for all Presto queries at Uber. It addresses Uber specific needs in four main areas - resource management, query gating, monitoring, and security. It is responsible for proxying over three million weekly queries from 6000+ weekly active users across all of Uber. Presto has variable execution times due to high multi-tenancy at Uber. Prism helps in overcoming those challenges using features like query routing, load balancing, query gating, session parameter checks, failover clusters which helps in maintaining a 99.9% availability and reliability SLA for Presto at Uber. Functionality - Query Execution: 1. Async execution API returns data stream 2. Async execution API returns File Descriptor - Routing - Prism can route queries to different clusters based on client sources. Other functionalities: Load Balancing, Query Gating, Failover, Session Properties, Security",
    thumbnail: "prism-video-79.jpg",
    video:
      "https://www.youtube.com/watch?v=0NwUCvOZuHY&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=9",
  },
  {
    title: "Top 10 Reasons to Use & Contribute to Presto - Steven Mih, Ahana",
    description:
      "Presto is complicated with many intricacies. Ahana Cloud is the only managed service for Presto on AWS that simplifies Presto, bringing its power to platform teams of any size or skill set. In this session we’ll give you a quick overview of Ahana Cloud, including managing multiple Presto clusters seamlessly, querying a range of data sources, as well as just-released capabilities.",
    thumbnail: "10reasons-video-80.jpg",
    video:
      "https://www.youtube.com/watch?v=HxayQLsI_aQ&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=10",
  },
  {
    title:
      "Realtime Analytics with Presto and Apache Pinot - Xiang Fu, Stealth Startup",
    description:
      "In this world, most analytics products either focus on ad-hoc analytics, which requires query flexibility without guaranteed latency, or low latency analytics with limited query capability. In this talk, we will explore how to get the best of both worlds using Apache Pinot and Presto: 1. How people do analytics today to trade-off Latency and Flexibility: Comparison over analytics on raw data vs pre-join/pre-cube dataset. 2. Introduce Apache Pinot as a column store for fast real-time data analytics and Presto Pinot Connector to cover the entire landscape. 3. Deep dive into Presto Pinot Connector to see how the connector does predicate and aggregation push down. 4. Benchmark results for Presto Pinot connector.",
    thumbnail: "rtawithpresto-video-81.jpg",
    video:
      "https://www.youtube.com/watch?v=0VCVfm7Orzw&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=11",
  },
  {
    title:
      "Petabyte Scale Log Analysis at Alibaba :Infrastructure, Challenge and Optimization - Yunlei Ma",
    description:
      "Yunlei will share the infrastructure for petabytes scale log data collection, storage and analysis at Alibaba . Presto plays a key role in the infrastructure. Presto processes over hundreds of billions of query, about over 1 quadrillion rows every day .",
    thumbnail: "petabytescale-video-82.jpg",
    video:
      "https://www.youtube.com/watch?v=bNdeIDGGJlM&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=12",
  },
  {
    title: "Why is Starburst a Member of the ? - Justin Borgman, Starburst",
    description:
      "We get this question a lot. In this short 5 minute talk, we'll explain who we are and why we're here.",
    thumbnail: "starburst-video-83.jpg",
    video:
      "https://www.youtube.com/watch?v=-rW5gLmURpE&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=13",
  },
  {
    title: "The Presto Ecosystem",
    description:
      "The Presto Ecosystem - Moderated by Dipti Borkar, Ahana; Maxime Beauchemin, Preset; Vinoth Chandar, Apache Hudi; Kishore Gopalakrishna, Apache Pinot & James Sun, Facebook, Inc.",
    thumbnail: "prestoecosystem-video-84.jpg",
    video:
      "https://www.youtube.com/watch?v=PMBh0h-P-WQ&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=14",
  },
  {
    title: "Presto and Apache Iceberg - Chunxu Tang, Twitter",
    description:
      "Apache Iceberg is an open table format for huge analytic datasets. At Twitter, engineers are working on the Presto-Iceberg connector, aiming to bring high-performance data analytics on Iceberg to the Presto ecosystem. Here, Chunxu would like to share what they have learned during the development, hoping to shed light on the future work of interactive queries.",
    thumbnail: "prestoandapache-video-85.jpg",
    video:
      "https://www.youtube.com/watch?v=M8HLX2CivpI&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=15",
  },
  {
    title:
      "How Carbon uses PrestoDB in the Cloud with Ahana to Power its Real-time Customer D... Jordan Hoggart",
    description:
      "Carbon is a real-time revenue management platform that consolidates revenue and audience analytics, data management, and yield operations into a single solution. Real-time analytics is super critical - their customers rely on real-time data to make revenue decisions. After facing issues around performance, visibility & ease of use, and serverless pricing model with AWS Athena, the team moved to a managed service for PrestoDB in the cloud - Ahana Cloud - to power their customer-facing dashboards. In this session, Jordan will discuss some of the reasons the team moved from AWS Athena to a managed PrestoDB on Intel-optimized AWS instances. He will also dive into their current architecture that includes an Ahana-managed Hive Metastore along with Apache ORC file format and an S3-based data lake. Last, he’ll share some performance benchmarks and talk about what’s next for PrestoDB at Carbon.",
    thumbnail: "prestodbincloud-video-86.jpg",
    video:
      "https://www.youtube.com/watch?v=RbRJ35p9GkU&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=16&t=10s",
  },
  {
    title:
      "Speeding up Presto Queries Using Apache Hudi Clustering - Satish Kotha & Nishith Agarwal, Uber",
    description:
      "Apache Hudi is a data lake platform that supercharges data lakes. Originally created at Uber, Hudi provides various ways to strike trade-offs between ingestion speed and query performance by supporting user defined partitioners, automatic file sizing which are favorable to query performance. Hudi integrates with PrestoDB to make this data available for queries. During ingestion, data is typically co-located based on arrival time. However, query engines perform better when the data frequently queried is co-located together, which may be different from arrival time order. We will discuss a new framework called “data clustering” to make data lakes adaptable to query patterns, thereby improving query latencies. Finally, we will discuss future work to support improving data locality using custom bucketing of data during ingestion, avoiding some of the rewrite costs.",
    thumbnail: "speedinguppresto-video-87.jpg",
    video:
      "https://www.youtube.com/watch?v=1WSg2aiCwDQ&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=17",
  },
  {
    title:
      "Using Presto's BigQuery Connector for Better Performance and Ad-hoc Qu... George Wang & Roderick Yao",
    description:
      "The Google BigQuery connector gives users the ability to query tables in the BigQuery service, Google Cloud's fully managed data warehouse. In this presentation, we'll discuss the BigQuery Connector plugin for Presto which uses the BigQuery Storage API to stream data in parallel, allowing users to query from BigQuery tables via gPRC to achieve a better read performance. We'll also discuss how the connector enables interactive ad-hoc query to join data across distributed systems for data lake analytics.",
    thumbnail: "prestoconnector-video-88.jpg",
    video:
      "https://www.youtube.com/watch?v=Vl9wNa7jI08&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=18",
  },
  {
    title:
      "Drag and Drop Query Builder for PrestoDB - Ravishankar Nair, PassionBytes",
    description:
      "You use multiple tools for databases, for example Azure Data Studio for SQLServer access, Toad or SQLDeveloper for Oracle access, MySQLWorkbench for MySQL databases. Imagine we have one tool and we can query any database, bring any table from any catalog to a single canvas! Now you join, the underlying PrestoDB compatible query is generated. Click a button, you get the profiled data, including distributions and correlations. An amazing tool in action.",
    thumbnail: "querybuilderforprestodb-video-89.jpg",
    video:
      "https://www.youtube.com/watch?v=Idtc7t93Q00&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=19",
  },
  {
    title:
      "The Data Lake House: Powering Open Architecture in the Cloud - Ori Rafael, Upsolver",
    description:
      "Ori Rafael, Co-founder and CEO of Upsolver, will present the Cloud Lake House as the foundation of an open data lake architecture built on Apache Parquet. Ori will explain how this architecture supports diverse analytic consumers and use cases, from open-source Presto to proprietary data warehouses.",
    thumbnail: "datalakehouse-video-90.jpg",
    video:
      "https://www.youtube.com/watch?v=RrpGuV7FhNs&list=PLJVeO1NMmyqUDkrabo6CRGQ7zNTOMvu2L&index=20",
  },
];
