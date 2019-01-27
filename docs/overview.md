---
id: overview
title: Overview
sidebar_label: Example Page
---

# Introduction

Presto is a distributed system that runs on a cluster of machines.
A full installation includes a coordinator and multiple workers.
Queries are submitted from a client such as the Presto CLI to the
coordinator. The coordinator parses, analyzes and plans the query
execution, then distributes the processing to the workers.
 
![Presto Installation Overview](/img/presto-overview.png)

# Requirements

- Linux or Mac OS X
- Java 8, 64-bit
- Python 2.4+

# Connectors

Presto supports pluggable connectors that provide data for queries.
The requirements vary by connector.

## Hadoop / Hive

Presto supports reading Hive data from the following versions of Hadoop:

- Apache Hadoop 1.x
- Apache Hadoop 2.x
- Cloudera CDH 4
- Cloudera CDH 5

The following file formats are supported: Text, SequenceFile,
RCFile, ORC and Parquet.

Additionally, a remote Hive metastore is required.
Local or embedded mode is not supported.
Presto does not use MapReduce and thus only requires HDFS.

## Cassandra

Cassandra 2.x is required. This connector is completely
independent of the Hive connector and only requires an
existing Cassandra installation.

## TPC-H

The TPC-H connector dynamically generates data that can be used
for experimenting with and testing Presto. This connector has
no external requirements.

# Deployment

See <a href="docs/current/installation/deployment.html">Deploying Presto</a>
for complete deployment instructions.

# Running Queries

You can run queries using the
<a href="docs/current/installation/cli.html">Command Line Interface</a>
after deploying Presto.