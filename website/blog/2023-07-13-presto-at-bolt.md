---
title: Migrating to Presto - How Bolt Built a Data Platform Architecture for Scalability and Cost Efficiency
author: Ali LeClerc, Chair of Presto Foundation Outreach Team
authorURL: https://www.linkedin.com/in/alidodson/
---

At PrestoCon Day we heard from Bolt, a ride sharing app with 100 million users across 45 countries in Eastern Europe, who shared why they chose Presto to underpin their data architecture platform. By leveraging Presto's capabilities, Bolt was able to address scalability limits, cost efficiency, and workload management challenges. In this blog we’ll recap the presentation delivered by Bolt, which includes their data platform architecture, challenges faced, the migration process, and what their outcomes were.

<!--truncate-->
<div style="text-align: center;">
  <em>Sign up for the <a href="https://prestodb.io/newsletter.html" style="color:blue;">Presto community newsletter</a></em>
</div>
<br>

## Bolt's Initial Data Platform Architecture
Bolt’s initial architecture leveraged AWS services, with data flowing from various sources into S3, using Redshift as their centralized data warehouse solution. Spark played a crucial role in processing the data, while Looker served as their primary business intelligence (BI) tool. 

![Boltlegacyplatform](/img/blog/2023-07-13-presto-at-bolt/Boltlegacyplatform.png)

This architecture faced scalability limits, cost inefficiencies, and challenges with workload management. These limitations became apparent as Bolt's user base and data volume grew. Redshift's scalability constraints hindered further expansion, and workload management became complex, leading to occasional performance degradation. Additionally, cost attribution and visibility into Redshift costs posed challenges.

They needed a data platform that would be able to handle:
* 2+ PB of structured data (mostly parquet)
* 2K+ active internal users (ops, BI, data analysts, data scientists)
* Peak load of 100K+ queries/day
* 1.5M+ queries/month
* Lots of complex Looker-generated queries with 50+ joins

## Evaluating Alternatives
To address these challenges, Bolt embarked on an evaluation of alternative solutions. They explored options like Snowflake, BigQuery, Trino, Databricks SQL Analytics, and Redshift Spectrum. While each had its strengths, Bolt considered factors such as price-performance, vendor lock-in, and ease of implementation. 

Ultimately, they chose Presto and partnered with Ahana to implement it. When asked why they didn’t choose a competitive technology like Trino, Kostiantyn shared that they were looking for a project with open governance that was focused on the Data Lakehouse, and Trino did not check these boxes.

## Choosing Presto & their migration journey
Bolt's decision to adopt Presto was based on several factors. Presto's separation of storage and compute, open-source nature, and Ahana’s managed Presto infrastructure offering within AWS aligned well with their requirements. This partnership saved time in building the Presto infrastructure and accelerated their migration process.

The migration to Presto was a massive undertaking for Bolt. They faced the challenge of migrating hundreds of existing jobs and thousands of tables while adapting queries and data layouts to work optimally with Presto. The self-service aspect was crucial, enabling teams to migrate their workloads independently. Data synchronization and consistency verification were key to keeping the business running during the migration process.

![Boltmigrationtimeline](/img/blog/2023-07-13-presto-at-bolt/Boltmigrationtimeline.png)

## Bolt’s New Architecture: Presto for the Data Lakehouse
The migration to Presto transformed Bolt's data platform architecture. They rebuilt their ingestion pipeline using structured Spark streaming, ingesting data from Kafka into an S3-based data lake powered by Delta Lake. Presto replaced Redshift as the primary query engine for BI, with over 10 Presto clusters supporting different business verticals. AWS Glue continued to serve as their data catalog.

![Prestoatboltarchitecture](/img/blog/2023-07-13-presto-at-bolt/PrestoatBoltarchitecture.png)

### Post-Migration Challenges and Solutions
While the migration was successful, Bolt encountered some post-migration challenges. First was AWS-specific issues with S3 and AWS Glue's performance - they were paying over 10% of total Presto costs for list requests at one point. Glue can also be a bottleneck, so they had to work on fine-tuning the metadata cache and increasing limits with AWS.

Next was around stats collection and addressing stats collection bugs. Because stats collection can be expensive, they created an event-based pipeline for stats collection to improve efficiency and had to fix some Presto-related edge cases related to stats collection.

To address OOM/memory leads/performance degradation, they split workloads by business verticals and tweaked memory settings and instance types per workload.

For autoscaling optimization, the used a mix of CPU-based autoscaling and scheduled scaling to “preheat” the clusters.

They realized they had lots of unoptimized or poorly migrated workloads. The learning here was that a new query engine will not fix your data modeling, so he encouraged companies making the same migration to clean up outdated and unused workloads and monitor usage.

Finally, managing costs would continue to be critical for Bolt. He shared that it was hard to work on migration and cost optimization at the same time, but spot instances allowed for significant cost savings.

### Outcomes
Moving to a Presto-based open data lakehouse helped alleviate some critical issues in their legacy architecture in addition to saving on costs. Here are five key areas that Bolt recognized improvements:

1. No More Fires during Peak Load: One of the most significant improvements for Bolt was the elimination of fires caused by the heavy load on Mondays. With their previous architecture, peak loads often led to performance issues and system failures. However, with the migration to Presto, Bolt successfully tackled the scalability challenges and bid farewell to those dreaded Monday incidents. The new architecture handled the high load seamlessly, ensuring smooth operations even during peak periods.

2. Reduction in Average Query Runtime by ~30%: Bolt witnessed a significant improvement in query performance after migrating to Presto. On average, query runtimes decreased by approximately 30%. This improvement was a direct result of Presto's distributed nature and Bolt's ability to scale resources independently. Faster query processing translated into quicker insights, empowering teams to make data-driven decisions with greater efficiency.

3. Reduction in Blast Radius - Issues Are More Localized: With their previous architecture, any performance issues or heavy workloads could have a widespread impact, affecting other critical processes. However, the migration to Presto brought a significant reduction in the blast radius of such issues. Now, when problems occur, they are more localized to specific clusters, minimizing the impact on other business operations. This enhanced isolation ensures smoother overall system performance and reliability.

4. Self-Service Improvements: Bolt's migration to Presto also empowered their teams through enhanced self-service capabilities. Analysts, high-level personnel, and data scientists gained the ability to migrate workloads, create dashboards, and perform data transformations independently. This self-service approach reduced dependency on the data platform team and streamlined the migration process. Analysts could focus on their specific needs, resulting in faster insights and increased productivity.

5. Costs Stabilized with Optimization Opportunities: The migration to Presto allowed Bolt to stabilize their costs and optimize their infrastructure. By leveraging open-source technologies and managed Presto infrastructure from Ahana, Bolt minimized vendor lock-in and achieved better cost efficiency. Additionally, they identified optimization opportunities with spot instances, which could provide further cost savings. With a stabilized cost structure and ongoing optimization efforts, Bolt's data platform became a more cost-effective and sustainable solution.

## Conclusion
The migration of Bolt's data platform to Presto helped address scalability, cost efficiency, and workload management challenges. By leveraging Presto's distributed SQL query engine, Bolt transformed its architecture, unlocking new possibilities for data analytics and business intelligence.

With the adoption of Presto, Bolt achieved enhanced scalability, breaking free from the limitations of their previous architecture. The separation of storage and compute provided the flexibility to scale resources independently, enabling Bolt to handle the growing user base and data volume seamlessly.

The migration to Presto also brought significant cost savings for Bolt. By utilizing the open-source nature of Presto and partnering with Ahana for managed Presto infrastructure, Bolt minimized vendor lock-in and optimized their infrastructure costs. The self-service migration approach empowered teams to migrate their workloads independently, improving efficiency and reducing operational overhead.

Bolt was also able to streamline their data ingestion pipeline and leverage the power of structured streaming. With multiple Presto clusters supporting different business verticals, Bolt achieved faster and more efficient query processing, empowering their teams with real-time insights for decision-making. 

Watch the full <a href="https://www.youtube.com/watch?v=G9LDAxxKsAE&list=PLJVeO1NMmyqXm5_fuFoKyMfZWyT5jOeKh&index=9" style="color:blue;">Implementing a Lakehouse architecture with Presto at Bolt presentation</a> from PrestoCon Day. 