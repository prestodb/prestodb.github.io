---
title: Harnessing Presto - A Deep Dive into Adobe Advertising's Three Use Cases 
author: Ali LeClerc, Chair of Presto Foundation Outreach Team
authorURL: https://www.linkedin.com/in/alidodson/
---

At PrestoCon Day 2023, we had a team from Adobe showcasing three different Presto-based use cases. As part of Adobe Advertising, Rajmani Arya, Varun Senthilnathan and Manoj Kumar Dhakad detailed the Adobe Data Processing platform (ADP) and three use cases for Presto: scheduled pipelines, ad-hoc query, and custom reporting. Let’s dive into what they covered. 

<!--truncate-->
<div style="text-align: center;">
  <em>Sign up for the <a href="https://prestodb.io/newsletter.html" style="color:blue;">Presto community newsletter</a></em>
</div>
<br>

## Presto in the Adobe Data Processing Platform 
As part of Adobe Advertising, ADP is a behemoth in the world of data analytics that handles an astounding data throughput of 12 billion events daily. That’s in addition to 20B user profiles for audience targeting and segmentation and 200B auctions/day for their real time ad bidding. Given the sheer scale of data being handled, ensuring seamless data processing and analysis becomes a crucial task for the team. Presto plays a central role in managing this herculean task. 

![AdobeOverview](/img/blog/2023-06-29-presto-at-adobe-prestocon-day/AdobeOverview.png)

For instance, imagine having to sift through data equivalent to the size of New York's population multiple times over, every single day. The complexity increases ten-fold when you need to extract specific information from this data ocean quickly. Presto makes this possible, supporting complex queries, interactive analytics, and on-the-fly data extraction. 

### Adobe's Data Studio: Innovation for Query Handling 

To make data analytics even more efficient and accessible, the Adobe team introduced their custom-built Data Studio platform. Picture a platform where even non-technical users can execute complex data queries without getting lost in the intricate maze of the backend process; this is what Data Studio brings to the table. 

This platform stands out because of its ability to deliver fast results. For example, if you're a marketing manager wanting to analyze the recent performance of a campaign, the Data Studio platform makes it possible to get insights quickly without needing to understand the underlying technicalities. 

Data Studio is designed to handle approximately 400 Adobe report requests and roughly 4,000 Presto queries every month. With a data scan size ranging from a few megabytes to terabytes, the platform proves to be versatile. In terms of performance, Data Studio outshines other engines, providing 3-10 times better performance on average. 

## Use case: Presto for data pipelines at Adobe Advertising 

Adobe Advertising's data pipeline is for the processing and transformation of raw data into usable forms. The data pipeline serves as the backbone of the platform, handling vast amounts of data from various sources such as supply-side platforms, ad exchanges, and devices. 

The architecture of Adobe Advertising's data pipeline involves multiple data stages, including data extraction, transformation, and storage. Presto plays a crucial role in the transformation stage, where raw data is converted into a format that can be efficiently analyzed and used for decision-making. 

The data pipeline runs on a daily, weekly, or monthly basis, processing data ranging from a few gigabytes to several terabytes. It dynamically generates queries that act on the source data, which could be stored in platforms like Hive or Delta. The transformed data is then stored in a storage layer, such as S3, for easy accessibility by other pipelines and teams within Adobe Advertising. 

![PrestoPipelines](/img/blog/2023-06-29-presto-at-adobe-prestocon-day/PrestoPipelines.png)

Different pipelines have different uses. For example, one pipeline focuses on real-time bidding (RTB) optimization. This pipeline utilizes data from auctions, wins, and bids to train a model that suggests optimal bidding prices. Presto extracts and filters the required data from the intermediate level, enabling the model to train on a rolling 90-day dataset.  

Another pipeline is for the consolidation of data, where raw and extensive data is transformed into consolidated formats. By running these pipelines, Adobe Advertising ensures that multiple teams can access the consolidated data without rerunning extensive processing. Presto's flexibility and scalability make it an ideal tool for this data consolidation, optimizing storage and improving overall pipeline efficiency. 

## Use case: Presto for ad hoc query at Adobe Advertising 

Adobe Advertising leverages Presto for ad-hoc queries to enable their data engineers to perform on-the-fly analysis and address various issues. Ad-hoc queries play a crucial role in gaining real-time insights and conducting exploratory data analysis.  

Data engineers at Adobe Advertising handle approximately 4,000 ad-hoc queries per month, which serve multiple purposes such as dashboard building, pipeline design, ML model data preparation, and data analysis. These queries are tailored to address specific business needs, allowing the team to gain deeper insights into the data and make informed decisions. 

The volume of data processed during ad-hoc queries varies significantly, ranging from a few megabytes to terabytes. This data encompasses both small static tables and large tables containing bid, impression, click, and event data. Despite the scale, Presto demonstrates its capabilities by efficiently scanning and analyzing the data, delivering reliable and fast results. 

Through extensive benchmarking, the team at Adobe Advertising found that Presto outperforms other query engines, providing an average improvement of 3 to 10x in performance. This enhanced performance directly contributes to increased efficiency and allows data engineers to iterate quickly, saving valuable time and resources. 

![PrestoAdHoc](/img/blog/2023-06-29-presto-at-adobe-prestocon-day/PrestoAdHoc.png)

To ensure optimal performance and scalability, Adobe Advertising's platform is designed to handle concurrent queries, automatically scaling based on factors such as the number of queries, CPU utilization, and memory usage. This dynamic scaling capability allows the team to handle varying workloads effectively and ensures a smooth user experience even during peak query times. 

## Use case: Presto for custom reporting at Adobe Advertising 

Alongside internal applications, Adobe has also effectively utilized Presto for customer-facing tasks, particularly in custom reporting. In the realm of digital advertising, reporting and analytics form the backbone of campaign strategy. Adobe's custom reporting solution, built on Presto, provides a highly customizable and interactive platform for advertisers. 

Consider an advertiser wanting to track the effectiveness of a digital campaign. They need real-time data on various parameters like impressions, clicks, and reach. Adobe's pre-built reports and dashboards facilitate this. However, every campaign is unique, and sometimes, pre-built reports may not provide the specific insights needed. 

Here's where the custom reporting solution shines. Advertisers can choose various dimensions to analyze their campaign performance more intricately. For example, they could compare how their campaign performs across different platforms like mobile, desktop, or connected TV. This feature empowers advertisers to make informed budget allocation decisions based on real-time data. 

Additionally, the flexibility offered in terms of report generation is noteworthy. Reports can be triggered on-demand or scheduled for a later time. Today Presto is used to power 2K+ reports running daily on a data lake with 400B records. 

![PrestoReporting](/img/blog/2023-06-29-presto-at-adobe-prestocon-day/PrestoReporting.png)

## Presto at Scale 

Adobe Advertising relies on Presto to support various critical use cases within its data analytics infrastructure. Presto's flexibility, scalability, real-time querying capabilities, and integration with visualization tools make it a powerful solution for extracting insights from large volumes of data. Let's summarize the three key use cases where Presto plays a crucial technical role at Adobe Advertising. 

1. **Data Pipelines**: Presto serves as a key component in Adobe Advertising's automated data pipelines, facilitating data ingestion, transformation, and aggregation processes. By leveraging Presto's distributed architecture and its support for parallel processing, data engineers can extract, transform, and load (ETL) large volumes of data, ensuring the availability of clean, structured data for downstream analytics tasks. 

2. **Ad-hoc Querying**: Presto enables data analysts and data scientists at Adobe Advertising to perform 4K ad-hoc queries per month, empowering them to explore and analyze data interactively. Its ability to query diverse data sources, including structured and unstructured data, in real-time allows analysts to gain valuable insights and make data-driven decisions efficiently. 

3. **Custom Reporting**: Presto enables the creation of 2K+ comprehensive and customizable reports for Adobe Advertising’s customers. Integrating Presto with visualization tools allows stakeholders to explore data through interactive dashboards, gaining valuable insights and making informed decisions. 

Overall, Presto plays a pivotal technical role in Adobe Advertising's data analytics infrastructure. It delivers valuable insights and empowers stakeholders to optimize advertising strategies, improve campaign performance, and drive business growth. By leveraging Presto's capabilities, Adobe Advertising fosters a data-driven culture, enabling stakeholders to extract actionable intelligence from their data and stay at the forefront of the rapidly evolving advertising landscape. 

Watch the full <a href="https://www.youtube.com/watch?v=kdMNVRBqxQc&list=PLJVeO1NMmyqXm5_fuFoKyMfZWyT5jOeKh&index=5" style="color:blue;">Adobe Advertising on-demand presentation</a> from PrestoCon Day. 