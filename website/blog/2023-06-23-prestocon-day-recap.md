---
title: Recapping PrestoCon Day 2023 - Presto for the Data Lakehouse, Presto at scale
author: Ali LeClerc, Chair of Presto Foundation Outreach Team
authorURL: https://www.linkedin.com/in/alidodson/
---

# Recapping PrestoCon Day 2023: Presto for the Data Lakehouse, Presto at scale

Just a few weeks ago we hosted PrestoCon Day, our annual virtual community conference. Thank you to everyone who attended - it was an awesome day! We had a fantastic agenda with many Presto users sharing why they chose Presto and how they’re using it to power some pretty sizable workloads.

<!--truncate-->
<div style="text-align: center;">
  Sign up for the <a href="https://prestodb.io/newsletter.html" style="color:blue;">Presto community newsletter</a>
</div>
<br>

Two specific themes I saw really come out during the day were how companies are using Presto as the backbone for their Open Data Lakehouse, and how companies are using Presto at pretty massive scale. More on that below.

I kicked the day off with Girish Baliga, Chair of the Presto Foundation and Director of Engineering at Uber. Girish shared more about Presto helping to solve 3 key challenges for today’s data engineer:

1) Different engines for different workloads might mean having to re-platform down the road
2) Managing multiple query languages and interfaces for siloed systems is hard
3) Data infra costs are rising

By giving you one language and one interface, Presto is fast, reliable, and efficient at scale to help address those challenges.

## Presto for the Open Data Lakehouse

One of the key themes from PrestoCon Day was Presto as the engine for the Data Lakehouse.
![PrestoLakehouse](/img/blog/2023-06-23-prestcon-day-recap/PrestoLakehouse.png)

As we see more companies moving to an Open Data Lakehouse architecture, Presto has become a critical piece of that architecture. Its flexibility, ability to work with open data formats like Apache Parquet and ORC and table formats like Hudi and Iceberg coupled with very good price performance.

If you want to learn more about how companies are using Presto for the Data Lakehouse, check out these PrestoCon Day presentations:

- **Bolt**: The “Uber” of Eastern Europe, Bolt migrated to a Data Lakehouse architecture using Presto as its engine. Today over 2K+ active internal users run 1.5M queries/month using Presto. You can see their full presentation <a href="https://www.youtube.com/watch?v=G9LDAxxKsAE&list=PLJVeO1NMmyqXm5_fuFoKyMfZWyT5jOeKh&index=9" style="color:blue;">here</a>

- **IBM**: recently announced watsonx.data, a data lakehouse with Presto as the query engine and Iceberg as the table formatting. At PrestoCon Day, they gave a demo of watsonx.data which you can see <a href="https://www.youtube.com/watch?v=d7TEID6tG2Q&list=PLJVeO1NMmyqXm5_fuFoKyMfZWyT5jOeKh&index=4" style="color:blue;">here</a>

- **Onehouse**: As part of the Presto ecosystem, Onehouse shared a demo on how Apache Hudi together with Presto and Apache Flink creates a holistic data lakehouse platform. Check out their session <a href="https://www.youtube.com/watch?v=CCb-zBEV0Oc&list=PLJVeO1NMmyqXm5_fuFoKyMfZWyT5jOeKh&index=6" style="color:blue;">here</a>

## Presto at Scale

Another key theme from PrestoCon Day was how companies are today are running Presto at massive scale. We heard from Adobe, Bytedance, Alibaba Cloud, Intuit, Meta, and Uber who shared some impressive numbers. A quick summary:

- **Adobe**: Adobe Advertising runs over 2K daily reports and 100s of pipelines on a 7PB data lake with over 400B records using Presto

- **Meta**: Just one of their Presto use cases, Meta runs 30K queries/day with 1K daily active users on a 300 PB data lake

- **Uber**: Runs 100M queries/day with Presto for over 7K weekly active users on a 50PB data lake

- **Bytedance**: Runs 2M+ queries/day for business intelligence and ad hoc use cases

- **Intuit**: Uses Presto to power the analytics, marketing, and aggregate reports for Turbo Tax, which has 200K+ tables with over 30+ years of historical data and 100M customers

I’m pleased to share that all of the on-demand presentations are now up on the Presto Foundation YouTube channel, available <a href="https://www.youtube.com/playlist?list=PLJVeO1NMmyqXm5_fuFoKyMfZWyT5jOeKh" style="color:blue;">here</a>

Over the course of the next few weeks, we’ll be sharing out more blogs that dive into the details of many of those sessions, so stay tuned!

And finally, <a href="https://events.linuxfoundation.org/prestocon/" style="color:blue;">we announced PrestoCon!</a> This is our annual in-person community conference that will take place at the Computer History Museum in Mountain View, CA on Dec 5-6th. Early bird passes are on sale now, and the CFP is open. If you’re using Presto today, we encourage you to submit a talk. See you soon!
