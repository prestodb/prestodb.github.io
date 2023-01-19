---
title: A recap of PrestoCon 2022 - Bringing Data Lakehouse Analytics to Life (plus a special video recap)
author: Ali LeClerc
authorURL: https://www.linkedin.com/in/alidodson/
---

Last month the Computer History Museum in Mountain View, California, reverberated with “all things Presto,” at our PrestoCon 2022 conference. Back for the third time—and the first time post-pandemic—PrestoCon was ground zero for training, knowledge sharing, and inspiration about the open-source Presto for data analytics and lakehouses, as well as for the vibrant Presto community. This year was special however, as it was the first ever in-person PrestoCon event, and I couldn’t have been more thrilled to meet the community, hear how companies are using Presto in production, and learn  what’s coming up on the engineering roadmap.

To memorialize this awesome event, we put together [a quick 3 minute video of PrestoCon](https://youtu.be/sKYy_PwaGYA)! Check it out, and we hope you enjoy it 🙂

<iframe width="560" height="315" src="https://www.youtube.com/embed/sKYy_PwaGYA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<!--truncate-->

We kicked off PrestoCon with three incredible keynotes:
**Girish Baliga**, Chair of Presto Foundation and Senior Engineering Manager at Uber, provided [an overview of how Presto delivers fast and reliable SQL for data analytics and the open lakehouse.](https://youtu.be/8-BvFyhn8CI?list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&t=72) Girish outlined:
- The challenges facing today’s data engineers.
- How Presto addresses those challenges—with one language: SQL, one interface, and fast, reliable, efficient operation.
- The principles and goals of the open, community-driven Presto Foundation.
- A peek into how Uber uses Presto for its own data analytics.
 
**Tim Meehan**, Chair of the Presto Technical Steering Committee and Software Engineer at Meta, outlined [how Presto is like a Swiss army knife for the data lakehouse](https://www.youtube.com/watch?v=ihAjlLGi7zY&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=3), able to use a single consistent language to bridge together multiple sources of data. Calling Presto “auto-awesome,” Tim explained how Presto provides:
- Native integration to move JVM off the data path, with Velox for streaming, and with Velox + Sapphire for fast batch execution.
- Interactive fault tolerance.
- Support for large clusters.
After outlining how code owners can become Presto committers, as well as the characteristics of good open source endeavors, he previewed some future direction and initiatives that will make Presto even more convenient, reliable, and efficient for the lakehouse.
 
**Steven Mih**, Presto Foundation board member, and Co-founder and CEO of Ahana, drew on his experience with various open source distributed systems in his talk on [“Data Lakehouse: Country Club or Community Center?”](https://www.youtube.com/watch?v=aZsgdEBCKqc&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=12) He explored the five shades of openness within the open data lakehouse ecosystem:
- Open spec, format, and standards
- Open (source) code
- Open development
- Open community
- Open governance
Steven explained how Presto checks the boxes in all five of these categories.
 
A couple of the presentations provided in-depth, case study-style discussions of how companies are using Presto in their own operations:

- **Andy Li**, Senior Software Engineer at Rippling, an employee management platform, described [how his company is using Presto for larger-scale analytical queries](https://www.youtube.com/watch?v=Wy_KGKb3alQ&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=2) and for powering its data platform and customer-facing scripting language, RQL (Rippling Query Language). Presto provides a core query layer in Rippling’s ecosystem.

- **Aakash Pradeep**, Principal Software Engineer, and **Badri Tripathy**, Senior Engineering Manager, talked about their journey with **[Presto at Twilio](https://www.youtube.com/watch?v=PyATuQDixdQ&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=1)**, a leader in cloud communication platforms. Focusing heavily on data and data-based decision-making, Twilio has scaled its Presto-powered system to a multi-PB data lakehouse supporting more than 75,000 queries per day.
 
A panel on **[“Women in Open Source & Presto”](https://www.youtube.com/watch?v=-9R3qdLOP5A&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=11)** featured a discussion among RongRong Zhong, Staff Software Engineer at Celonis; Dipti Borkar, Vice President and General Manager at Microsoft; Neha Pawar, Founding Engineer at StarTree; and Rebecca Schlussel, Software Engineer at Meta.
 
Two Ahana representatives—**Bill McKenna**, Principal Software Engineer, and **Aditi Pandit**, Principal Software Engineer—gave deep technical presentations about, respectively, the [future of Presto’s query optimizer](https://www.youtube.com/watch?v=6wZF6odzi2k&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=6) and building large-scale query operators and [window functions for Prestissimo using Velox](https://www.youtube.com/watch?v=WN6BvKwdP-A&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=5).
 
**Biswapesh Chattopadhyay**, Distinguished Engineer at Google (and previously with Meta) and a highly regarded expert in data and distributed systems, spoke about the [shared foundations of composable data systems.](https://www.youtube.com/watch?v=V59GpmYdhFY&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=4)
 
**Philip Bell**, Developer Advocate at Meta, closed out the day’s presentation with [insights into the past, present, and future of Presto](https://www.youtube.com/watch?v=FP29mDKG1pA&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=18), including encouragement of Presto Foundation members to become more involved in Presto’s evolution.
 
***Other technical breakout sessions and lightning talks included:***

- **Chunxu Tang**, an open source advocate, and **Beinan Wang**, Software Engineer at Alluxio, talked about [scaling cache for the Presto Iceberg connector.](https://www.youtube.com/watch?v=S-ru0uXfgy0&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=13)

- **Satish Ramakrishnan**, a senior technical executive at MinIO, discussed [building modern data lakes for analytics using object storage.](https://www.youtube.com/watch?v=dAAprvTbz18&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=9)

- **Vinodhini Sivakami Duraisamy**, Developer Advocate for Treeverse explained how chaos engineering principles apply to distributed data systems and [how to use a Git-like repository for a data lake.](https://www.youtube.com/watch?v=DEi0KD420hw&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=19)

- **Sivabalan Narayanan**, Software Engineer at Onehouse and a distributed systems enthusiast, talked about [how to speed up lakehouse queries by an order of magnitude](https://www.youtube.com/watch?v=RVnsxj26ekY&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=8) with a multimodal index subsystem using Apache Hudi and Presto.

- Two Collate executives—**Suresh Srinivas**, Co-founder, and **Sriharsha Chinatalapani**, CTO—discussed [how to get the most from Presto by connecting to OpenMetadata.](https://www.youtube.com/watch?v=lbE3dNuJF48&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=10)

- **Derek Salama**, Product Manager at Tecton, covered [scalable feature engineering with Tecton on Athena.](https://www.youtube.com/watch?v=QnoXDq5jtg0&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=14)

- **Jared Zhao**, CEO and founder of AskEdith, gave [five reasons why AI is the future of SQL.](https://www.youtube.com/watch?v=aiDC6QZgSSI&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=15)

- **Roy Hasson**, Head of Product for Upsolver, spoke about ending DAG distress by building [self-orchestrating pipelines for Presto.](https://www.youtube.com/watch?v=CH2jlYhy1qI&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=16)

- **Pavel Tiunov**, CTO of Cube Dev, discussed the [tradeoffs of headless BI architecture](https://www.youtube.com/watch?v=Z6Yy1xxWQ_0&list=PLJVeO1NMmyqXvoKFad0_SJ9C9AlqtVaQ3&index=17), which injects a component between data warehouses and other data sources and tools on the other side of the stack.
 
It was fantastic to get everyone in a room, in person, to immerse ourselves in the world of Presto. Thanks to everyone who helped make PrestoCon 2022 a success—and we can’t wait to see what unfolds in our industry by the time PrestoCon 2023 rolls around!

You can check out some of our more in-depth blogs that cover the [Rippling](https://prestodb.io/blog/2023/01/09/presto-at-rippling) and [Twilio](https://prestodb.io/blog/2022/12/28/presto-at-twilio) sessions as well. 
 
