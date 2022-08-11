export const Items = [
  {
    title:
      "PrestoDB TSC Chair Keynote - Tim Meehan, Chair of Presto TSC & Software Engineer, Meta",
    description:
      "PrestoDB TSC Chair Keynote - Tim Meehan, Chair of Presto Technical Steering Committee & Software Engineer, Meta",
    thumbnail: "prestodbchairkeynote-video-23.jpg",
    video:
      "https://www.youtube.com/watch?v=RL36PNzKf2Q&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=2",
  },
  {
    title: "Presto for Real Time Analytics at Uber - Ankit Sultana, Uber",
    description:
      "The Real Time Analytics Platform at Uber serves 100M+ queries daily and is used for several critical features: from end-user app features to radius selection for Uber Eats. All these queries are proxied via a custom internal fork of Presto (named Neutrino) that is optimized for low-latency/high-throughput (50ms latency at 1000s of RPS). With this talk we plan to share our learnings over the last 6 months and how we run Presto reliably at this scale for real-time analytics.",
    thumbnail: "prestoforrtauber-video-24.jpg",
    video:
      "https://www.youtube.com/watch?v=FCZeIt9FqnM&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=3",
  },
  {
    title:
      "Free-Forever Managed Service for Presto for your Cloud-Native Open SQL Lakehouse - Wen Phan, Ahana",
    description:
      "Getting started with a do-it-yourself approach to standing up an open SQL Lakehouse can be challenging and cumbersome. Ahana Cloud Community Edition dramatically simplifies it and gives you the ability to learn and validate Presto for your open SQL Lakehouse—for free. In this session, we’ll show you how easy it is to register for, stand up, and use the Ahana Cloud Community Edition to query on top of your Lakehouse.",
    thumbnail: "freeforevermanagedservice-video-25.jpg",
    video:
      "https://www.youtube.com/watch?v=B8V7e3JWLVc&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=4",
  },
  {
    title:
      "Building a Modern Data Platform with Presto - Denis Krivenko, Platform24",
    description:
      "Hadoop era is gone. Cloud computing is today's reality. But... What if you cannot use public clouds? What if your cloud does not provide data platform capabilities? What if you want your solution to be cloud agnostic? In this case you create your own cloud native data platform on Kubernetes. In the session Denis will talk about reasons for building analytics data platform solution in Platform24, cloud native data platform architecture principles, data stack they use and why Presto plays one of the key roles in it.",
    thumbnail: "moderndataplatform-video-26.jpg",
    video:
      "https://www.youtube.com/watch?v=mJoP71_Keyo&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=5&t=212s",
  },
  {
    title:
      "How Blinkit is Building an Open Data Lakehouse with Presto on AWS - Satyam Krishna & Akshay Agarwal",
    description:
      "Blinkit, India’s leading instant delivery service, uses Presto on AWS to help them deliver on their promise of “everything delivered in 10 minutes”. In this session, Satyam and Akshay will discuss why they moved to Presto on S3 from their cloud data warehouse for more flexibility and better price performance. They’ll also share more on their open data lakehouse architecture which includes Presto as their SQL engine for ad hoc reporting, Ahana as SaaS for Presto, Apache Hudi and Iceberg to help manage transactions, and AWS S3 as their data lake.",
    thumbnail: "blinkitbuildingopendatalakehouse-video-27.jpg",
    video:
      "https://www.youtube.com/watch?v=V_GJHhnxCgU&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=6",
  },
  {
    title:
      "Query Execution Optimization for Broadcast Join using Replicated-Reads Strategy - George Wang, Ahana",
    description:
      "Today presto supports broadcast join by having a worker to fetch data from a small data source to build a hash table and then sending the entire data over the network to all other workers for hash lookup probed by large data source. This can be optimized by a new query execution strategy as source data from small tables is pulled directly by all workers which is known as replicated reads from dimension tables. This feature comes with a nice caching property given that all worker nodes N are now participating in scanning the data from remote sources. The table scan operation for dimension tables is cacheable per all worker nodes. In addition, there will be better resource utilization because the presto scheduler can now reduce the number plan fragment to execute as the same workers run tasks in parallel within a single stage to reduce data shuffles.",
    thumbnail: "queryexecutionoptimization-video-28.jpg",
    video:
      "https://www.youtube.com/watch?v=0xpwpSZyyDk&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=7",
  },
  {
    title:
      "Powered by Presto: Experimentation Platform @Meta - Zac Wen & Sergii Lavrinenko, Meta",
    description:
      "The experimentation platform is one of the most important use cases supported by Presto at Meta. This talk introduces the background, requirements, architecture and how we addressed the challenge problems with Presto and shares lessons we learned from supporting this use case.",
    thumbnail: "poweredbypresto-video-29.jpg",
    video:
      "https://www.youtube.com/watch?v=GHXjjfGyCw8&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=8",
  },
  {
    title:
      "Architecting Your Data Platform with Presto and Alluxio in Heterogeneous Environment - Adit Madan",
    description:
      "As the cloud is evolving and the adoption of a hybrid-cloud or multi-cloud approach grows, the data architecture must adapt to heterogeneous environments. In this talk, Adit Madan shares insights on how to architect a data platform with Presto and Alluxio that provides agility and simplicity to your data team.",
    thumbnail: "architectingdataplatform-video-30.jpg",
    video:
      "https://www.youtube.com/watch?v=WooUZoAZaZ4&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=9",
  },
  {
    title:
      "Dynamic UDF Framework and its Applications - Rongrong Zhong, Alluxio & Yanbing Zhang, Bytedance",
    description:
      "Presto supports dynamically registered User Defined Functions (UDFs) since 2020. Over the years, we used this framework to add support for SQL UDFs and remote / external UDFs. One common community request in the UDF domain is to support Hive UDFs. Many companies have legacy Hive pipelines, and engineers who are familiar with HQL and Hive UDFs. With remote UDF, one can implement Hive UDF support as UDFs running on the remote cluster. But since HiveUDFs are written in Java, we can also run them inside the engine. We extended the dynamic UDF framework to support Java UDFs, and used this new extension to add HiveUDF support in Presto. With this feature, users can directly use their familiar HiveUDFs and UDAFs in their Presto query.",
    thumbnail: "dynamicudfframework-video-31.jpg",
    video:
      "https://www.youtube.com/watch?v=hd12u-JtEHg&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=10",
  },
  {
    title:
      "PrestoDB and Apache Hudi for the Lakehouse - Sagar Sumit & Bhavani Sudha Saktheeswaran",
    description:
      "Apache Hudi is a rich platform to build self-managing, exabyte-scale data lakes, optimized for incremental as well as regular batch processing. Hudi tables can be seamlessly synced to Hive metastore, which unlocks the powerful capabilities of Presto engine via the Hive connector. Presto-Hudi integration is over five years old. What started as simply fetching splits using a custom input format for a Hudi Copy-On-Write table has evolved into snapshot querying of Merge-On-Read tables and using Hudi’s internal metadata table to boost query performance. In this session, we trace that journey and discuss in detail the recent developments that have made this integration stronger not only in terms of usability but also performance. We discuss the additional features that come with the brand new presto-hudi connector, such as multi-modal index and data skipping for better query performance.",
    thumbnail: "prestodbandapache-video-32.jpg",
    video:
      "https://www.youtube.com/watch?v=3zQJR-IGH0Y&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=11",
  },
  {
    title:
      "Speed Up Presto at Uber with Alluxio Caching - Chen Liang, Uber & Beinan Wang, Alluxio",
    description:
      "At Uber, Presto is heavily used as one of the primary data analytics tools, and Presto's query performance has profound production impact at Uber. As part of the Presto optimization effort, we turned to explore Alluxio as a caching solution. Alluxio is an open source data orchestration platform often used by many compute frameworks as the caching layer. Alluxio caching is currently enabled on ~2000 nodes across 6 clusters at Uber. In this presentation, we will talk about our journey at Uber of integrating Alluxio cache into Presto. We will discuss the Uber specific challenges we encountered and how we addressed them. We will also present the performance improvements we have seen. Besides, we will also discuss our plan and next steps, and potential future collaboration opportunities with the community.",
    thumbnail: "speeduppresto-video-33.jpg",
    video:
      "https://www.youtube.com/watch?v=ik3x-LdeAN8&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=12",
  },
  {
    title: "Connect to PrestoDB from Anywhere - Jerod Johnson, CData",
    description:
      "Leveraging the benefits of PrestoDB with 3rd-party BI, reporting, ETL, and custom applications can present unique challenges. The CData Connectivity Solutions allow you to connect, integrate, and automate your PrestoDB data in the tools and applications you already use. In this video, you'll learn about the different connectivity solutions CData offers and see how to connect to PrestoDB through CData's technology.",
    thumbnail: "connecttoprestodb-video-34.jpg",
    video:
      "https://www.youtube.com/watch?v=MkGwgdc82Dk&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=13",
  },
  {
    title:
      "Presto & the Foundations of Open Lake House: Trends & Opportunities - Biswapesh Chattopadhyay, Meta",
    description:
      "Building open and shared foundational tech to build a lake house architecture can provide the best-of-breed user experience across the Analytics and ML domains and potentially beyond. In this talk, Biswa will share examples drawn from the evolution of the data stack at Meta over the last few years including efforts towards dialect unification (Sapphire aka Presto-on-Spark and Xstream-IE streaming engine efforts), eval unification (using Velox as the base), eliminating the need for data duplication for interactive analytics by building smart caching (RaptorX), building a best-of-breed file format that works across Analytics and ML (Alpha), and building an open source ML data pre-proc engine (TorchArrow) which shares the core dialect and eval components with Presto.",
    thumbnail: "prestoandthefoundations-video-35.jpg",
    video:
      "https://www.youtube.com/watch?v=yjZH0CKD8fk&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=14",
  },
  {
    title:
      "Update on Intel’s Participation in the Presto and Velox Communities - David Cohen, Intel",
    description:
      "In this talk I will provide a brief update on Intel’s involvement in the Presto and Velox projects.",
    thumbnail: "updateonintelparticipation-video-36.jpg",
    video:
      "https://www.youtube.com/watch?v=LM06eghyBsM&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=15",
  },
  {
    title:
      "Executing Any External Code in Any Language with Presto - A Universal Connector - Ravishankar Nair",
    description:
      "Connector based architecture is one of the powerful features in Presto for extensibility. While we have a solid pack of many connectors, the ability to reuse an existing external snippet to fetch data and access through Presto will make it enormously helpful. For example, consider accessing mainframe code through Presto using simple SQL which is quite cumbersome to handle by creating a connector paradigm. Ravishankar explores how he implemented this feature using a protocol server and a protocol connector which eventually helped him to achieve a patent on the concept",
    thumbnail: "executingexternalcode-video-37.jpg",
    video:
      "https://www.youtube.com/watch?v=tgMl44ScA1E&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=16",
  },
  {
    title: "Panel Discussion: Presto for the Open Data Lakehouse",
    description:
      "Today’s digital-native companies need a modern data infra that can handle data wrangling and data-driven analytics for the ever-increasing amount of data needed to drive business. Specifically, they need to address challenges like complexity, cost, and lock-in. An Open SQL Data Lakehouse approach enables flexibility and better cost performance by leveraging open technologies and formats. Join us for this panel where leading technologists from the Presto open source project will share their vision of the SQL Data Lakehouse and why Presto is a critical component.",
    thumbnail: "paneldiscussionpresto-video-38.jpg",
    video:
      "https://www.youtube.com/watch?v=XxyU6TeJs-I&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=17",
  },
  {
    title:
      "Presto Query Analysis for Data Layout Formatting and Query Result Caching - Gurmeet Singh, Uber",
    description:
      "Today’s digital-native companies need a modern data infra that can handle data wrangling and data-driven analytics for the ever-increasing amount of data needed to drive business. Specifically, they need to address challenges like complexity, cost, and lock-in. An Open SQL Data Lakehouse approach enables flexibility and better cost performance by leveraging open technologies and formats. Join us for this panel where leading technologists from the Presto open source project will share their vision of the SQL Data Lakehouse and why Presto is a critical component.",
    thumbnail: "prestoqueryanalysis-video-39.jpg",
    video:
      "https://www.youtube.com/watch?v=2S5_mOba5nE&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=18",
  },
  {
    title:
      "Using Presto for Long Running Batch Queries at Meta - Tim Meehan & Arjun Gupta, Meta",
    description:
      "Meta uses Presto extensively for batch. Come learn about the architecture of Meta’s batch usage, how Presto is tuned in batch clusters, how monitoring and reliability is set up, and the future direction with Spark.",
    thumbnail: "prestoforbatchqueries-video-40.jpg",
    video:
      "https://www.youtube.com/watch?v=kYBHNQi4ZDg&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=19",
  },
  {
    title:
      "HermesDB - Integrated Presto with a lucene-based Query Engine - Yue Long, Tencent",
    description:
      "HermesDB is the next generation of OLAP engine at Tencent with the architecture featuring separation of storage and calculation. HermesDB characterizes efficient indexing files in storage data, equipping with customized Presto as the core query engine. With the help of Presto connector, HermesDB could not only support full ANSI syntax but also ultilize Apache Lucene as underlying computer core. Besides, we are in the progress of improving the end-to-end performance with the newly released Java Vector APIs, acclecerating different kinds of complex computations with SIMD instructions. According to the benchmark(SSB) we have, HermesDB outperformances other mainstream C++ based MPP engines.",
    thumbnail: "hermesdb-video-41.jpg",
    video:
      "https://www.youtube.com/watch?v=5SrrM1cT2gM&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=20",
  },
];
