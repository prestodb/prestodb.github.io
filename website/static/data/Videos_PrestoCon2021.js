export const Items = [
  {
    title:
      "Updates from the New PrestoDB C++ Execution Engine - Deepak Majeti, Ahana & Dave Cohen, Intel",
    description:
      "This talk will provide an overview of an ongoing effort to enable the new PrestoDB C++ execution engine, code-named Prestissimo, and its use of the Velox library with the ability to run the TPC-H benchmark with good performance",
    thumbnail: "updatesfromnewpresto-video-44.jpg",
    video:
      "https://www.youtube.com/watch?v=2UNvTfW4a7M&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=2",
  },
  {
    title:
      "The Top 10 Reasons Ahana Makes Running Presto in the Cloud Easy - Dipti Borkar & Wen Phan, Ahana",
    description:
      "Want to run Presto in the cloud? We’ll give you 10 reasons why it’s easy! Join us for this lightening session where we’ll cover the most cutting edge innovation happening with Presto in the cloud",
    thumbnail: "10reasonsahana-video-45.jpg",
    video:
      "https://www.youtube.com/watch?v=zHaiNHLDcIU&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=3",
  },
  {
    title:
      "Speed Up Presto Reading with Paquet Column Indexes - Xinli Shang, & Chen Liang, Uber",
    description:
      "Data analytic tables in the big data ecosystem are usually large and some of them can reach petabytes in size. Presto as a fast query engine needs to be intelligent to skip reading unnecessary data based on filters. In addition to the existing filtering to skip partitions, files, and row groups, Apache Parquet Column Index provides further filtering to pages, which is the I/O unit for the Parquet data source. In this presentation, we will show the work that we integrated Parquet Column Index to Presto code base, the performance gains, etc. We will also talk about our effort to open-source this project to PrestoDB and look forward to collaborating with the community to merge!",
    thumbnail: "speeduppresto-video-47.jpg",
    video:
      "https://www.youtube.com/watch?v=fr_HdhMEa3s&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=5",
  },
  {
    title:
      "Self-serve Data Architecture Evolution with Presto and Alluxio Across Clouds - Adit Madan, Alluxio",
    description:
      "n this presentation, Adit Madan shares insights to help architect a data platform ready to minimize the impact of change and evolution. He will co-relate industry trends for a multi-tenant environment with how the Presto & Alluxio stack drives agility for hundreds of users in the cloud, across multiple datacenters and a hybrid cloud.",
    thumbnail: "selfservedata-video-48.jpg",
    video:
      "https://www.youtube.com/watch?v=ylTFPtcl-so&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=6",
  },
  {
    title:
      "Secure PrestoDB Using Apache Ranger; How Privacera can Help - Don Bosco Durai, Privacera",
    description:
      "Don Bosco Durai who is the founding member of the project Apache Ranger will do a quick show and tell on how to do fine grain authorization using Apache Ranger in PrestoDB.",
    thumbnail: "secureprestodb-video-49.jpg",
    video:
      "https://www.youtube.com/watch?v=4qdanWnSoqk&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=7",
  },
  {
    title:
      "PrestoDB, the Velox Library, and the Coming Age of Heterogeneous Hardware - Dave Cohen, Intel",
    description:
      "This talk will quickly review the market shift to use heterogeneous hardware, the need for new language runtime and library level abstractions to hide the complexity of this hardware, and position the PrestoDB SQL query engine with the Velox and Cachelib libraries embodiments of these abstractions.",
    thumbnail: "prestodbandvelox-video-50.jpg",
    video:
      "https://www.youtube.com/watch?v=NaPlak-yRyw&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=8",
  },
  {
    title: "PrestoDB TSC Chair Keynote - Tim Meehan, Meta",
    description:
      "In this talk, PrestoDB TSC Chair talks about speed, scalability, reliability and free features of Presto",
    thumbnail: "prestodbtscchairkeynote-video-51.jpg",
    video:
      "https://www.youtube.com/watch?v=LF3HrWpTjnY&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=9",
  },
  {
    title:
      "Presto On Spark: Scaling not Failing with Spark - Ariel Weisberg, Meta & Shradha Ambekar, Intuit",
    description:
      "Presto on Spark is an integration between Presto and Spark that leverages Presto's compiler/evaluation as a library and Spark's large scale processing capabilities. It enables a unified SQL experience between interactive and batch use cases. A unified option for batch data processing and ad hoc is very important for creating the experience of queries that scale instead of fail without requiring rewrites between different SQL dialects. In this session, we'll talk about Presto On Spark architecture, why it matters and its implementation/usage at Intuit.",
    thumbnail: "prestoonspark-video-52.jpg",
    video:
      "https://www.youtube.com/watch?v=MDjW7OKxBro&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=10",
  },
  {
    title: "Presto on Kafka at Scale - Yang Yang & Yupeng Fu, Uber",
    description:
      "Presto is a popular distributed SQL query engine for running interactive analytic queries. Presto provides a Connector API that allows plugins to dozens of data sources, and thus positions itself as a single point of access to a wide variety of data. At Uber, we significantly improved Presto’s Kafka connector to meet Uber’s scale. For example, the new connector allows dynamic Kafka cluster and topic discovery so users can directly query existing Kafka topics without any registration and onboarding process; dynamic schema discovery allows fetching the latest schema without any Presto restart or deployment; smart time range suggestions to users based on Kafka metadata analysis to avoid large-range scans and thus keep the query interactive.",
    thumbnail: "prestoonkafka-video-53.jpg",
    video:
      "https://www.youtube.com/watch?v=PLGQVEsibO4&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=11",
  },
  {
    title:
      "Presto on Elastic Capacity - Neerad Somanchi & Abhisek Saikia, Meta",
    description:
      "Presto on elastic capacity - Elasticity of a shared fleet is one of the fundamental pillars of the IaaS (Infrastructure-as-a-Service) world. The ability of services to efficiently use both guaranteed and non-guaranteed (opportunistic) capacity is important in such a setting. Presto is great when it runs on guaranteed capacity (i.e, capacity that is fixed and stable). But what if we want Presto to leverage elastic (opportunistic) capacity, i.e, capacity that is shifting, but in a predictable manner (think Amazon EC2 Spot Blocks)? In this lightning presentation, Neerad Somanchi and Abhisek Saikia will talk about how a recent feature developed for Presto can help it efficiently utilize such elastic compute.",
    thumbnail: "prestoonelastic-video-54.jpg",
    video:
      "https://www.youtube.com/watch?v=96oMfOUeipk&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=12",
  },
  {
    title:
      "Presto for Batch Processing in Data Lake - Santhosh Kumar Ravindran, Adroitts",
    description:
      "We like to explain how we explored Presto via Ahana service in AWS for our client's data processing in data lake",
    thumbnail: "prestoforbatch-video-55.jpg",
    video:
      "https://www.youtube.com/watch?v=ULVC6F-DGoo&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=13&t=3s",
  },
  {
    title: "Presto Connector for DataCTRL - Mario Ceste, Jr., SAP NS2",
    description:
      "DataCTRL is a data management platform for ingesting large quantities of disparate data sets. We’ve written a connector for Presto which allows our users to leverage the data they’ve ingested using SQL. Integrating Presto with our platform has given our customers a quick and effective way to query their data while also building additional data products.",
    thumbnail: "prestoconnector-video-56.jpg",
    video:
      "https://www.youtube.com/watch?v=B22UwTdtqh0&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=14",
  },
  {
    title:
      "Presto Authorization with Apache Ranger - Reetika Agrawal, Ahana & William Brooks, Privacera",
    description:
      "Apache Ranger has been the user’s choice to support authorization in various data platforms from small-scale to enterprise-grade production environments. At Ahana, engineers are working on the Presto-Ranger integration, aiming to support global fine-grained data access control across all catalogs for Presto, while also providing auditing and monitoring of user access. We would like to collaborate with the Privacera and share our learnings, what we developed so far, and also hope to shed light on the future work of the Ranger Presto Plugin with Apache Ranger committer.",
    thumbnail: "prestoauthorization-video-57.jpg",
    video:
      "https://www.youtube.com/watch?v=qv6B0DPla-A&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=15",
  },
  {
    title: "Presto at Uber: SQL for Everything - Devesh Agrawal, Uber",
    description:
      'Uber uses Presto to query nearly every data source: both in motion and at rest. We will describe how we achieve this "Presto SQL for everything" in addition to covering our deployment architecture and scale.',
    thumbnail: "prestoatuber-video-58.jpg",
    video:
      "https://www.youtube.com/watch?v=CXuF-3S2uWo&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=16",
  },
  {
    title:
      "Presto at Tencent at Scale: Usability Extension, Stability Improvement and... Junyi Huang & Pan Liu",
    description:
      "Presto has been adopted at Tencent as scale to serve scenarios of ad-hoc queries and interactive queries for different business units. In this talk, we'd like to share our practice of Presto in production. In details, we'll talk about our works to further improve the stability, extend the usability, and optimize the performance of Presto. The works all together make Presto better fit in our production environment, which we think will also benefit the community.",
    thumbnail: "prestoattencent-video-59.jpg",
    video:
      "https://www.youtube.com/watch?v=ww4LhaX1sBI&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=17",
  },
  {
    title: "Presto at Bytedance - Pengfei Chang, Bytedance",
    description:
      "Presto has been widely used in Bytedance, e.g. DataWarehouse, BI Tools, Ads and so on. Meanwhile the presto team of Bytedance also delivered many important features and optimizations like Hive UDF Wrapper, multiple coordinator, runtime filter and so on which extend Presto usages and enhance Presto stababilities.",
    thumbnail: "prestoatbytedance-video-60.jpg",
    video:
      "https://www.youtube.com/watch?v=Yn5aIqOqODI&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=18&t=168s",
  },
  {
    title:
      "Prestissimo - Presto-on-Velox for Faster More Efficient Queries - Orri Erling, Meta",
    description:
      "We built a drop-in replacement for the Presto worker using C++ and Velox and saw a dramatic improvements in CPU efficiency and latency for interactive queries. We embraced adaptive execution provided by Velox to efficiently evaluate filters pushed down into scan and automatically enable array-based aggregations and joins. We make extensive use of dictionary encodings to achieve zero-copy execution throughout the engine. We allow for vectorization friendly function implementations, provide ASCII-only fast paths and many other tricks. We'd like to share our learnings, early results and future plans. We are looking forward to invite the community to join our efforts in building the next generation of Presto together.",
    thumbnail: "prestissimo-video-61.jpg",
    video:
      "https://www.youtube.com/watch?v=H56vJF-SiX0&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=19",
  },
  {
    title:
      "Open Source Data Lake Analytics: Trends and Opportunities - Biswapesh Chattopadhyay, Meta",
    description:
      "Open source data analytics is undergoing an interesting transformation as the industry rapidly evolves around it. Accelerating migration to the cloud, the rise of immensely well funded proprietary vendors, fast evolving needs of the users all contribute to this. This talk goes into detail about the trends and opportunities in the OSS data analytics space, and a call to action on how this space can stay relevant.",
    thumbnail: "opensourcedatalake-video-62.jpg",
    video:
      "https://www.youtube.com/watch?v=2k3qNY34dsA&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=20",
  },
  {
    title: "Introduction to Starburst Galaxy - Dain Sundstrom, Starburst",
    description:
      "In this session, you will get a high-level understanding of Starburt’s new fully managed offering. Starburst Galaxy is designed to eliminate administrative overhead and infrastructure buildout so you can spend less time managing clusters and more time analyzing data. Its intuitive user experience allows you to start analyzing your data in just a few clicks with a pre-configured and guided environment. Starburst Galaxy is the fastest path from big data to better decisions.",
    thumbnail: "introductiontostarbust-video-63.jpg",
    video:
      "https://www.youtube.com/watch?v=hfOA8kGVJMQ&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=21",
  },
  {
    title: "Introducing Materialized View in Presto - Rohit Jain, Meta",
    description:
      "The materialized view is a well-known technique in the data world, it is used to increase the performance and efficiency of queries by precomputing and persisting results. We are announcing materialized view support in the PrestoDB in this talk. Please join us to learn more about it.",
    thumbnail: "introducingmaterializedview-video-64.jpg",
    video:
      "https://www.youtube.com/watch?v=U-bANi2eGC8&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=22",
  },
  {
    title:
      "Handling Billions of Messages with PrestoDB in the Country of Pyramids - Ravishankar Nair",
    description:
      'Millions of messages are legacy, and in the new modern world of data, we like "billions". This is exactly the terminology in the use case we faced from a very prominent client in Egypt. The scenario demanded more attention as this valuable client did multiple proof of the concepts with many other open sources and could not meet exact SLA and needs. The client wanted to have more than a hundred billion( yes, "b") messages in eight hours to be ingested and further queried without much latency. The presentation will be a live demonstration of how we can architect such a solution with PrestoDB under the hood and some simple but advanced ingestion capabilities and data formats. The salient features of the solution will help audience architect need for massive ingestion of data requirements and faster analysis. Enjoy and feel the thrill of having delivered the results with Presto.',
    thumbnail: "handling-video-65.jpg",
    video:
      "https://www.youtube.com/watch?v=I20VCA_rmXo&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=23",
  },
  {
    title:
      "Disaggregated Coordinator Production Rollout - Swapnil Tailor, Meta",
    description:
      "We would like to talk about disaggregated coordinator production rollout with some stats. Also we can inform community about changes needed to support deployment of disaggregated coordinator.",
    thumbnail: "disaggregated-video-66.jpg",
    video:
      "https://www.youtube.com/watch?v=smvaVLLWaYY&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=24&t=2s",
  },
  {
    title: "Delta Lake Connector for Presto - Denny Lee, Databricks",
    description:
      "Delta lake is an open-source project that enables building a lakehouse architecture on top of existing storage systems such as S3, ADLS, GCS, and HDFS. We - the Presto and Delta Lake communities - have come together to make it easier for Presto to leverage the reliability of data lakes by integrating with Delta Lake. In this session, we would like to share the design decisions and internals of the Presto/Delta connector.",
    thumbnail: "deltalakeconnector-video-67.jpg",
    video:
      "https://www.youtube.com/watch?v=JrXGkqpl7xk&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=25&t=1541s",
  },
  {
    title:
      "Benchmarking Continuous Data Processing on Snowflake with Upsolver - Sean Spediacci, Upsolver",
    description:
      "In this talk, we provide a glimpse at the results of our latest benchmark test which compares the speed and cost of processing data inside Snowflake (ELT) vs. processing and serving prepared live tables from a data lake using Upsolver (ETL).",
    thumbnail: "benchmarkingdataprocessing-video-68.jpg",
    video:
      "https://www.youtube.com/watch?v=0oM9k2v1-9U&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=26",
  },
  {
    title:
      "Authorizing Presto with AWS Lake Formation - Jalpreet Singh Nanda, Ahana & Roy Hasson, Amazon",
    description:
      "AWS Lake Formation is a service that allows data platform users to set up a secure data lake in days. Creating a data lake with Presto and Lake Formation is as simple as defining data sources and what data access and security policies you want to apply. At Ahana and Amazon, engineers are working on Presto and Lake Formation integration to support Authorization on Presto. This means that Presto clusters will be enforce data permissions on user queries against Lake Formation backed data lakes, which is a tightly integrated Lake Formation, AWS Glue, and Amazon S3 data lake stack. In this session we will present high level design, our leanings, future plans and demo how data platform users can use Lake Formation integration to support fine-grained data access controls on Presto.",
    thumbnail: "prestowithaws-video-69.jpg",
    video:
      "https://www.youtube.com/watch?v=o9abTPWnQOw&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=27",
  },
  {
    title:
      "After RaptorX: Improve Performance Understanding and Workload Analysis in Presto - Ke Wang & Bin Fan",
    description:
      "RaptorX, an umbrella project presented in PrestoCon Day in March, enabled the Presto interactive fleet in Facebook to reduce latency by 10x, based on a set of architectural improvements and optimizations with hierarchical caching. This presentation provides an update on the follow-up enhancement. Bin Fan from Alluxio will talk about the exploration of a probabilistic algorithm in Alluxio caching to estimate cache working set and the implementation of shadow cache Ke Wang from Facebook will talk about how shadow cache is used to understand the system bottleneck for better resource allocation and query routing decisions. She will also cover a recent improvement in collecting and aggregating per-query runtime statistics on the Presto engine to better understand the time breakdown, resource usage breakdown and cache hit rate on a per-query basis, which can help identify areas of improvement.",
    thumbnail: "afterraptorx-video-70.jpg",
    video:
      "https://www.youtube.com/watch?v=lNYlOIlJzdY&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=28",
  },
  {
    title:
      "A Tour of Presto Iceberg Connector - Beinan Wang, Alluxio & Chunxu Tang, Twitter",
    description:
      "Apache Iceberg is an open table format for huge analytic datasets. The Presto Iceberg connector consolidates the SQL engine and the table format, to empower high-performant data analytics. Here, Beinan and Chunxu would like to discuss and share the architectural design of the Presto Iceberg connector, advanced Iceberg feature support (such as native iceberg connector, row-level deletion, and iceberg v2 support), and the future roadmap.",
    thumbnail: "prestoiceberg-video-71.jpg",
    video:
      "https://www.youtube.com/watch?v=xtOJid00-xY&list=PLJVeO1NMmyqX8-cfwo5ZAuuNv4WnwSP-w&index=29",
  },
];
