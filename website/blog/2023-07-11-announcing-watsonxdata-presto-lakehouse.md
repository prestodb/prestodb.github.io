---
title: IBM watsonx.data - a modern open data lakehouse architecture, built on Presto!  
author: Vikram Murali, VP Hybrid Data Management at IBM
authorURL: https://www.linkedin.com/in/vikram-murali-40878112
---

**Co-authors**
[Steven Mih](https://www.linkedin.com/in/stevenmih/), Co-Founder and CEO of Ahana, an IBM Company

Today we are happy to share that IBM watsonx.data, a Presto-based Open Data Lakehouse architecture, is now generally available. Back in April we shared that <a href="https://prestodb.io/blog/2023/04/12/IBM-joins-presto-foundation" style="color:blue;">IBM had joined the Presto Foundation</a> through the acquisition of Ahana. To reiterate what we talked about then, we believe that this is an exciting time for the Presto open source project.  

<!--truncate-->

We’re seeing more users running Presto at massive scale; just recently at PrestoCon Day we heard from users like Adobe, Bytedance, Bolt, Meta, Uber who all use Presto to power mission-critical applications. You can read the <a href="https://prestodb.io/blog/2023/06/23/prestocon-day-recap" style="color:blue;">PrestoCon Day recap</a> to learn more. Many of these companies are leveraging Presto for their own purpose-built data lakehouses. 

We’re also seeing exciting growth in the Presto ecosystem. Companies like HPE, Intel, Denodo, Onehouse, Alluxio, and Carrot Cache are building Presto-based / -integrated products, and more are surfacing every day. 

We continue to believe that Presto is the best engine for the SQL open data lakehouse, both from a technical perspective as well as a governance perspective. IBM watsonx.data is a testament to that – we built it to be open and interoperable, leveraging not only Presto but other open source technologies including Apache Iceberg and Apache Spark, all of which boast broad and diverse communities of users and contributors. 

To share more about <a href="https://www.ibm.com/products/watsonx-data?utm_source=prestodb&utm_medium=blog&utm_campaign=ga" style="color:blue;">watsonx.data</a>, it is a fit-for-purpose data store built on an open lakehouse architecture, optimized to scale all data, analytics, and AI workloads. Through a single point of entry, watsonx.data will allow users to access their data across cloud and on-premises environments and share a single copy of data across multiple query engines, facilitating greater collaboration and eliminating data duplication. With multiple engines, organizations can optimize data warehouse workloads for price and performance, pairing the right workload with the right engine. Presto and Apache Spark engines support workloads for exploration, data transformation, analytics and BI, and AI model training and tuning. It also offers built-in governance and automation to get to trusted insights within minutes, as well as integrations with an organization’s existing databases and tools to simplify setup and user experience. 

Since the acquisition announcement, the Ahana/IBM team has been busy integrating more into the Presto open source community and contributing back, including <a href="https://github.com/prestodb/presto/pull/20004" style="color:blue;">fixing critical security vulnerabilities</a> and <a href="https://github.com/prestodb/presto/pull/18968" style="color:blue;">introducing several basic but important features like the new keyword FETCH FIRST N ROWS ONLY</a> in Presto. We’ve also been incorporating the latest Presto performance enhancements into watsonx.data, which will include the Velox acceleration library as well as Intel’s built-in accelerators on Intel’s new 4th Gen Xeon Scalable Processors. 

Watsonx.data is for enterprises of all sizes which are looking for the benefits of running OSS Presto but with a partner like IBM who bring decades of experience in security, governance, databases, and more. To see watsonx.data in action, <a href="https://www.ibm.com/account/reg/signup?formid=DEMO-dataaiwatsonxdata" style="color:blue;">request a live demo</a>, or get started with a <a href="https://cloud.ibm.com/registration?target=/lakehouse&uucid=0b526df2f9c41d5f&utm_content=WXDWW" style="color:blue;">free trial</a>, where you’ll receive $1,500 in IBM Cloud credits to test drive a watsonx.data instance.  

The future of Presto is bright, and we look forward to continue working closely with the Presto open source community and contributing back to the project in areas around performance with the Velox engine, security, and more. Stay tuned! 