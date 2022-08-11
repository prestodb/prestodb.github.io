export const Items = [
  {
    Company: "Meta",
    Description:
      "Facebook uses Presto for interactive queries against several internal data stores, including their 300PB data warehouse. Over 1,000 Facebook employees use Presto daily to run more than 30,000 queries that in total scan over a petabyte each per day.",
    CTA: "See how Presto powers Meta's experimentation platform",
    Link: "https://www.youtube.com/watch?v=GHXjjfGyCw8&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=8",
    logo: "img/presto-users/logo-meta.svg",
  },
  {
    Company: "Uber",
    Description:
      "Uber uses Presto for the SQL Data Lakehouse where over 7K weekly active users run 500K queries/day on 59 PB HDFS bytes/day. ",
    CTA: "Read case study",
    Link: "https://ahana.io/case-studies/uber?utm_source=prestodbio&utm_medium=community&utm_campaign=powered_by",
    logo: "img/presto-users/logo-uber.svg",
  },
  {
    Company: "Twitter",
    Description:
      "At Twitter, to overcome performance issues that can arise in developing and maintaining SQL systems with increasing volumes of data, we designed a large-scale SQL federation system across on-premises and cloud Hadoop and Google Cloud Storage (GCS) clusters. leveraging Presto as the core of SQL engine clusters, pursuing high scalability and availability to fulfill the increasing need for data analytics on a petabyte (PB) scale of data. All the presto clusters have ran more than 10 million presto sql queries. ",
    CTA: "Read blog",
    Link: "https://blog.twitter.com/engineering/en_us/topics/insights/2021/forecasting-sql-query-resource-usage-with-machine-learning",
    logo: "img/presto-users/logo-twitter.svg",
  },
  {
    Company: "Ahana",
    Description:
      "Ahana offers the only managed service for Presto as a feature rich, next-gen SQL query engine in Ahana Cloud. It plays a critical role for our data platform users who want easy-to-use, fully integrated and cloud native SQL engine on their S3 data lakes and other data sources. Ahana has everything you need to get started with SQL on the Open Data Lakehouse.",
    CTA: "Learn more",
    Link: "https://ahana.io/",
    logo: "img/presto-users/logo-ahana.svg",
  },
  {
    Company: "Alibaba",
    Description:
      "Alibaba Data Lake Analytics embraces Presto’s federated query engine capability and has accumulated a number of successful business use cases that signify the power of Presto's analytics capability.",
    CTA: "Read blog",
    Link: "https://prestodb.io/blog/2020/06/30/data-lake-analytics-blog",
    logo: "img/presto-users/logo-alibaba.svg",
  },
  {
    Company: "Carbon",
    Description:
      "Carbon is a real-time revenue management platform that consolidates revenue and audience analytics, data management, and yield operations into a single solution. Real-time analytics is super critical - their customers rely on real-time data to make revenue decisions. After facing issues around performance, visibility & ease of use, and serverless pricing model with AWS Athena, the team moved to a managed service for PrestoDB in the cloud - Ahana Cloud - to power their customer-facing dashboards.",
    CTA: "Read case study",
    Link: "https://ahana.io/case-studies/carbon/",
    logo: "img/presto-users/logo-carbon.svg",
  },
  {
    Company: "Cartona",
    Description:
      "Cartona is one of the fastest growing B2B e-commerce marketplaces in Egypt that connects retailers with suppliers, wholesalers, and production companies. We needed to federate across multiple data sources, including transactional databases like Postgres and AWS S3 data lake and Presto allowed us to join across all of these data sources without having to copy or ingest data - it’s all done in place.",
    CTA: "Watch presentation",
    Link: "https://www.youtube.com/watch?v=fibzqwCz4ok",
    logo: "img/presto-users/logo-cartona.png",
  },
  {
    Company: "Blinkit",
    Description:
      "Blinkit, India’s leading instant delivery service, uses Presto on AWS to help them deliver on their promise of “everything delivered in 10 minutes”. Blinkit moved to Presto on S3 from their cloud data warehouse for more flexibility and better price performance and created open data lakehouse architecture which includes Presto as their SQL engine for ad hoc reporting, Ahana as SaaS for Presto, Apache Hudi and Iceberg to help manage transactions, and AWS S3 as their data lake.",
    CTA: "Watch presentation",
    Link: "https://www.youtube.com/watch?v=V_GJHhnxCgU&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=6",
    logo: "img/presto-users/logo-blinkit.svg",
  },
  {
    Company: "Securonix",
    Description:
      "Securonix uses Ahana Cloud for Presto to enable extremely fast SQL queries on AWS S3 for ‘Threat Hunting’.          “Before Presto we were using a Hadoop cluster, and the challenge was on scale…not only was it expensive but the scaling factors were not linear. The Presto engine was designed for scale, and it’s feature-built just for a query engine. Ahana Cloud made it easy for us to use Presto in the cloud.” - Derrick Harcey, Chief Architect at Securonix",
    CTA: "Read case study",
    Link: "https://ahana.io/customers/securonix/",
    logo: "img/presto-users/logo-securonix.png",
  },
  {
    Company: "Metropolis",
    Description:
      "Facing challenges with PostgreSQL and MySQL when it came to their rapid increase in data volume and compute, Metropolis needed a flexible and horizontally scalable data lake architecture to address their challenges associated with control and flexibility but still needed fine-grained security policies.  They moved to a data lake architecture which includes AWS S3 for data storage, AWS Lake Formation for fine-grained security control, and Ahana for Presto for SQL on S3. Metropolis augments their own data with third-party sources like Zendesk, Heap, and Stripe, storing the resulting datasets in the data lake.",
    CTA: "Read case study",
    Link: "https://ahana.io/customers/metropolis/",
    logo: "img/presto-users/logo-metropolis.png",
  },
  {
    Company: "Adroitts",
    Description:
      "Adroitts’ mission is to build secure, reliable and cost-effective products for their customers. When it comes to data analytics, they must be able to link transactions to respective customers with their profile information to get the full view of the customer. They chose Presto as the underlying query engine to do this.",
    CTA: "Read case study",
    logo: "img/presto-users/logo-adroitts.png",
    Link: "https://ahana.io/customers/adroitts/",
  },
  {
    Company: "Platfrom24",
    Description:
      "Platform 24, the digital healthcare SaaS platform for healthcare providers, based in Sweden uses Presto as SQL engine for their Modern Data Platform to address the need of Open Source, Self hosted, Kubernetes friendly, Reliable, Scalable and Cost effective, etc.",
    CTA: "Watch presentation",
    Link: "https://www.youtube.com/watch?v=mJoP71_Keyo&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=5",
    logo: "img/presto-users/logo-platform24.png",
  },
  {
    Company: "Bytedance",
    Description:
      "Presto has been widely used in Bytedance, e.g. DataWarehouse, BI Tools, Ads and so on. At Bytedance, OLAP Platform migrated their ad-hoc workloads from Apache Hive and Apache Spark to Presto and It quickly become popular and expanded fast. Today, Presto cluster at Bytedance have tens of thousands compute cores and serves about 1 million queries per day which cover more than 90 percent of interactive queries. This dramatically reduced the query latency and saved a lot of compute resources.",
    CTA: "Watch presentation",
    Link: "https://www.youtube.com/watch?v=Yn5aIqOqODI",
    logo: "img/presto-users/logo-bytedance.svg",
  },
  {
    Company: "Tencent",
    Description:
      "HermesDB is the next generation of OLAP engine at Tencent with the architecture featuring separation of storage and calculation. HermesDB characterizes efficient indexing files in storage data, equipping with customized Presto as the core query engine. With the help of Presto connector, HermesDB could not only support full ANSI syntax but also ultilize Apache Lucene as underlying computer core. ",
    CTA: "Watch presentation",
    Link: "https://www.youtube.com/watch?v=5SrrM1cT2gM&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=20",
    logo: "img/presto-users/logo-tencent.png",
  },
];
