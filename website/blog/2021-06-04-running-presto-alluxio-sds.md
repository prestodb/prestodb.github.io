---
id: running-presto-alluxio-sds
title: Running Presto on Alluxio Structured Data Service on Your Laptop
author: Baolong Mao
authorURL: https://www.linkedin.com/in/baolong-mao-180624136/
---

**Tencent**: Baolong Mao
**Fudan University**: Bowen Ding

## Overview

When running Presto on Hive, Hive Metastore (HMS) is by default used to serve the metadata, including the information about locations of Hive partitions and tables. If you want to migrate the data in Hive to another storage system, the metadata must be updated in HMS. However, in many production deployments, HMS is a global shared service that is highly sensitive, any update to the locations would need to be synchronized in all the compute applications that depend on it. As a result, this process is error-prone and may introduce considerable maintenance overhead for this kind of setup.  In this article, we will introduce an effective solution to avoid such overhead and error using Alluxio Structured Data Service (SDS). 


![Presto on Hive Setup](/img/blog/2021-06-04-running-presto-alluxio-sds/Presto-hive-setup.png)


[Alluxio Structured Data Service](https://docs.alluxio.io/os/user/stable/en/core-services/Catalog.html) (SDS), like Alluxio File System for files and objects, acts as a proxy between Presto and HMS. Presto can utilize Alluxio Master as its metadata provider through its Hive-Hadoop2 connector, while SDS of Alluxio Master fetches the metadata from the underlying HMS, optionally applies necessary transformations, and returns what is needed by Presto. For the location metadata, Presto receives paths in the Alluxio filesystem, and as a result, it reads data from Alluxio. This way we can make Presto access data through Alluxio without modifying the metadata in HMS, thus greatly saving what could otherwise become a headache for sysadmins.


![Presto on Alluxio Architecture](/img/blog/2021-06-04-running-presto-alluxio-sds/Presto-on-Alluxio.png)


The rest of this article walks through the process of setting up Presto on Alluxio on a single server and verifying that Presto is accessing the data cached in Alluxio from Hive.


## Prerequisites

Component | Version
--------- | -------
OS | Debian Buster
Hadoop | 2.8.5
Java | 8
Hive | 2.3.8
MariaDB | 10.3.27
Presto | 0.253
Alluxio | 2.5.0-2

## Preparations

This section provides a detailed setup of the test environment, including installing and configuring Hive, Presto, and Alluxio, as well as preparing the test dataset.

-   ### Java

    Make sure `JAVA_HOME` is set in your profile, or explicitly set on the command line:

    ```bash
    export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
    ```

-   ### Hadoop

    Set the `HADOOP_HOME` environment variable to where Hadoop is installed:

    ```bash
    export HADOOP_HOME=/root/hadoop-2.8.5
    ```

-   ### Hive

    Set the `HIVE_HOME` environment variable to where Hive is installed:

    ```bash
    export HIVE_HOME=/root/apache-hive-2.3.8-bin
    ```

    As well as these environment variables:

    ```bash
    export HIVE_CONF_DIR=$HIVE_HOME/conf
    export HIVE_AUX_JARS_PATH=$HIVE_HOME/lib
    ```

    1.  Prepare MariaDB as the metastore for Hive:

        1.  Login to MariaDB as the root user or any other user with management privileges:

            `mysql -u root -p`

            Enter the password for root in the prompt.

        2.  Create MariaDB user `hive` and set the password to `hive`:

            `CREATE USER hive IDENTIFIED BY 'hive';`

        3.  Create database "metastore" to be used as the metastore for Hive:

            `CREATE DATABASE metastore;`

        4.  Grant privileges to `hive` user on the database:

            `GRANT ALL ON metastore.* TO hive@'%' IDENTIFIED BY 'hive';`
            `GRANT ALL ON metastore.* TO hive@'localhost' IDENTIFIED BY 'hive';`

            This allows Hive to connect to MariaDB from any IP address and localhost.

            `FLUSH PRIVILEGES;`

    2.  Install MySQL JDBC Connector:

        1.  Download from Maven Central: 

            `wget https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.49/mysql-connector-java-5.1.49.jar`

        2.  Move the jar to the Hive installation directory:

            `cp mysql-connector-java-5.1.49.jar $HIVE_HOME/lib`

    3.  Configure Hive:

        -   `conf/hive-env.sh`:

            ```bash
            export METASTORE_PORT=9083
            ```

        -   `conf/hive-site.xml`:

            ```xml
            <configuration>
                <property>
                    <name>javax.jdo.option.ConnectionURL</name>
                    <value>jdbc:mysql://127.0.0.1:3306/metastore?createDatabaseIfNotExist=true&amp;characterEncoding=UTF-8&amp;useSSL=false</value>
                    <description>JDBC connection string used by Hive Metastore</description>
                </property>
                <property>
                    <name>javax.jdo.option.ConnectionDriverName</name>
                    <value>com.mysql.jdbc.Driver</value>
                    <description>JDBC Driver class</description>
                </property>
                <property>
                    <name>javax.jdo.option.ConnectionUserName</name>
                    <value>hive</value>
                    <description>Metastore database user name</description>
                </property>
                <property>
                    <name>javax.jdo.option.ConnectionPassword</name>
                    <value>hive</value>
                    <description>Metastore database password</description>
                </property>
                <property>
                    <name>hive.metastore.uris</name>
                    <value>thrift://127.0.0.1:9083</value>
                    <description>Thrift server hostname and port</description>
                </property>
                <property>
                    <name>hive.metastore.warehouse.dir</name>
                    <!-- Default warehouse location, change this to where data will be stored -->
                    <value>/user/hive/warehouse/</value> 
                    <description>Hive warehouse</description>
                </property>
            </configuration>
            ```
        
        The `hive.metastore.warehouse.dir` property defaults to `/user/hive/warehouse`. This directory may not exist, so make sure to create this directory, or change the config entry to where you want hive to store its data.
      
    4.  Initialize and start the metastore:

        Inside the Hive installation directory, run:

        `bin/schematool -dbType mysql -initSchema hive hive`

        This should initialize the metastore, and create the necessary tables.

        `bin/hive --service metastore -p 9083 &`

        This starts the metastore service in the background.

    5.  Create a test database in Hive:

        Suppose we have a sample data file at `/root/testdb/person/person.csv`, with content:

        ```
        mary 18 1000
        john 19 1001
        jack 16 1002
        luna 17 1003
        ```
        
        1.  Start the Hive CLI:

            `bin/hive`

        2.  Inside the Hive CLI, create a test database:

            `CREATE SCHEMA test;`

        3.  Create an external table with the data file:

            `CREATE EXTERNAL TABLE test.person(name STRING, age INT, id INT) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' LOCATION 'file:///root/testdb/person';`

        4.  Test if the test data can be accessed:

            `SELECT * FROM test.person;`

-   ### Presto

    Download Presto and extract the files. Inside the Presto installation directory:

    1.  Create directories for configuration and data: 

        `mkdir -p etc/catalog`

        `mkdir -p var/presto/data`

    2.  Create Presto config files:

        -   `etc/node.properties`:

            ```
            node.environment=production
            node.id=node01
            node.data-dir=/root/presto-server-0.253/var/presto/data
            ```
            
            Change the `node.data-dir` directory according to your Presto installation path.

        -   `etc/config.properties`:

            ```
            coordinator=true
            node-scheduler.include-coordinator=true
            http-server.http.port=8080
            query.max-memory=2GB
            query.max-memory-per-node=1GB
            discovery-server.enabled=true
            discovery.uri=http://localhost:8080
            ```

        -   `etc/jvm.config`:

            ```
            -server
            -Xmx4G
            -XX:+UseConcMarkSweepGC
            -XX:+ExplicitGCInvokesConcurrent
            -XX:+CMSClassUnloadingEnabled
            -XX:+AggressiveOpts
            -XX:+HeapDumpOnOutOfMemoryError
            -XX:OnOutOfMemoryError=kill -9 %p
            -XX:ReservedCodeCacheSize=150M
            ```

        -   `etc/log.properties`

            ```
            com.facebook.presto=INFO
            ```

        -   `etc/catalog/hive.properties`

            ```
            connector.name=hive-hadoop2
            hive.metastore.uri=thrift://localhost:9083
            ```

    3.  Start Presto server:

        `bin/launcher start`

    4.  Launch the Presto CLI client:

        1.  Download it from Maven Central:

            `wget https://repo1.maven.org/maven2/com/facebook/presto/presto-cli/0.253/presto-cli-0.253-executable.jar`

        2.  Set executable permission:

            `chmod +x presto-cli-0.253-executable.jar`

        3.  Start the CLI:

            `./presto-cli-0.253-executable.jar --catalog hive --schema test`

        4.  Inside the CLI, verify that the test database is accessible from Presto:

            ```SQL
            show schemas from hive;
            show tables from hive.test;
            select * from hive.test.person;
            select count(*) from person;
            ```

-   ### Alluxio

    Download the Alluxio distribution tarball and extract the files. Inside the Alluxio directory:

    1.  Create Alluxio config file from template:

        `cp conf/alluxio-site.properties.template conf/alluxio-site.properties`

    2.  Edit `conf/alluxio-site.properties`:
   
        Uncomment the lines with `alluxio.master.hostname` and `alluxio.master.mount.table.root.ufs`, 
        so that `alluxio.master.hostname` is set to `localhost` 
        and `alluxio.master.mount.table.root.ufs` is set to `${alluxio.work.dir}/underFSStorage`

    3.  Mount RAMFS filesystem:

        `./bin/alluxio-mount.sh SudoMount`

        You may need to input your password because mounting RAMFS requires sudo privileges.

    4.  Format Alluxio filesystem:

        `./bin/alluxio format`

        NOTE: This step is only required when you run Alluxio for the first time. If you run this command for an existing Alluxio cluster, all previously stored data and metadata in the Alluxio filesystem will be erased. However, data in under storage will not be changed.

    5.  Start Alluxio filesystem locally:

        `./bin/alluxio-start.sh local`

## Configure Presto to use Alluxio SDS

Before accessing a Hive database through Alluxio in Presto, it needs to be attached to the Alluxio catalog. To do so, use the Alluxio tables commands:

`./bin/alluxio table attachdb hive thrift://localhost:9083 test`

This command will attach the Hive database `test` from the URI `thrift://localhost:9083` to the Alluxio catalog. For more information, please refer to the [Alluxio documentation](https://docs.alluxio.io/os/user/stable/en/operation/User-CLI.html#table-operations).

We can then proceed to configure Presto to use Alluxio SDS. Inside the Presto installation directory, edit the Presto config file `etc/catalog/hive.properties` so that it contains these contents:

```
connector.name=hive-hadoop2
hive.metastore=alluxio
hive.metastore.alluxio.master.address=localhost:19998
```

Restart the Presto server:

`./bin/launcher stop`

`./bin/launcher start`


Again, launch the Presto CLI client:

`./presto-cli-0.253-executable.jar --catalog hive --schema test`

And execute these SQL queries, so that data will be cached in Alluxio:

```SQL
show schemas from hive;
show tables from hive.test;
select * from hive.test.person;
select count(*) from person;
```

Switch to the Alluxio installation directory, and verify that the test data file `person.csv` has been loaded into Alluxio filesystem:

`./bin/alluxio fs ls /catalog/test/tables/person/hive`

## Summary

In this tutorial, we configured Presto to access the metadata stored in Hive Metastore through Alluxio SDS, without making any changes to the underlying Hive Metastore or any other compute engines. This way Presto can benefit from the flexible data storage solution Alluxio offers.

## Looking Forward

Alluxio SDS acts as a proxy between Presto and Hive Metastore, by understanding the semantics of the data it hosts. This unlocks even more possibilities with Alluxio, e.g. converting CSV to Parquet, coalescing small files.

## References

1. https://docs.alluxio.io/os/user/stable/en/core-services/Catalog.html#using-the-alluxio-catalog-service
2. https://www.alluxio.io/blog/serving-structured-data-in-alluxio-concept/
