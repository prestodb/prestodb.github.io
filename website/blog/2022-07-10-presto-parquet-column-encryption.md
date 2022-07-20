---
title: Presto Parquet Column Encryption
author: Xinli Shang
authorURL: https://www.linkedin.com/in/xinli-shang-2479863/
---
**Uber:** Xinli Shang

## Introduction
Apache Parquet modular encryption provides encryption at-rest and in-transit at finer-grained. In big data world, data analytic tables are usually very wide with hundreds of columns, while only a small number of columns need to be protected. So the finer-grained access control is a better fit than coarse-grained one like table level access control.

In addition, data access restrictions, retention, and encryption at rest are fundamental security controls. Column encryption with access control at the encryption key can solve all three problems with one unified solution as discussed in another blog [One Stone, Three Birds: Finer-Grained Encryption @ Apache Parquet™](https://eng.uber.com/one-stone-three-birds-finer-grained-encryption-apache-parquet).

Apache Parquet modular encryption has been released in Parquet 1.12.0 and Presto has been updated to 1.12.1. This enables the Presto repository to incorporate the Parquet column encryption.

<!--truncate-->

## Challenges 
While core encryption and decryption libraries have become very fast due to recent hardware-level acceleration (i.e., [Intel® AES-NI](https://www.intel.com/content/www/us/en/architecture-and-technology/advanced-encryption-standard-aes/data-protection-aes-general-technology.html)) instructions, the question about read-write overhead still has some relevance. The performance penalty could come from key accesses, encryption decisions such as block vs. single value, 256 vs. 128 bit, etc. At the Uber scale, where a user query could potentially scan billions of records, a tiny amount of overhead could halt the execution.

Parquet modular encryption is a block operation. Here the term ‘block’ is referring to Parquet Page which is the unit for encoding, compression and encryption. If user doesn't have permission on the key, the decryption will throw exception. However, in reality, the user might be okay to get a masked value (i.e., null) as the column value since she does not care about the sensitive column. At the same time, most of the queries run with the wild card (“SELECT * ..”) as projection. In this case, explicitly selecting a long list of columns (skipping only one sensitive column) is time-consuming and not convenient for the user. More importantly, there are a lot of queries running regularly through pipelines for years where no active developers are available. Hard failure will instantly cause thousands of pipelines to fail, creating an operational nightmare with immediate business impact. At the same time, silently returning a masked value could cause an unintended business decision. As part of this initiative, we will need to address these conflicting scenarios acceptably.

## Apache Parquet™ Modular Encryption
A Parquet™ file can be protected by the modular encryption mechanism that encrypts and authenticates the file data and metadata, while allowing for regular Parquet functionality (columnar projection, predicate pushdown, encoding, and compression). The mechanism also enables column access control, via support for encryption of different columns with different keys.

Currently,  Parquet™ supports 2 encryption algorithms: AES-GCM and AES-CTR. AES-GCM is an authenticated encryption algorithm that can prevent unauthenticated writing. Besides the data confidentiality (encryption), it supports 2 levels of integrity verification/authentication: of the data (default), and of the data combined with an optional additional authenticated data (AAD), which is a free text to be signed, together with the data. However, the AAD is required to be stored separately, in a KV store as an example, from the file itself, while the AAD metadata/index is saved in the Parquet™ file itself. The decryption application reads the AAD metadata/index first from the Parquet™ file and then reads AAD from the KV store before it can decrypt the Parquet™-encrypted data. More details about AAD can be found in RFC Using AES-CCM and AES-GCM Authenticated Encryption(https://tools.ietf.org/html/rfc5084).
AES-CTR doesn’t require integrity verification/authentication. As a result, it is faster than AES-GCM. The benchmarking result shows AES-CTR is 3 times faster than AES-GCM in single-thread applications in Java 9, or 4.5 times faster than AES-GCM in single-thread applications in Java 8.

## Parquet Column Encryption in Presto
There are two Parquet writing code paths in current Presto repository native writer and legacy writer. The legacy writer relies on parquet-mr repository, which already has the implementation of Parquet modular encryption. As a result, Presto legacy writer already supports Parquet encryption in the newest release. The work to support native writer Parquet encryption is in progress.

Parquet reader was rewritten in Presto, which requires the decryption code in parquet-mr need to be ported in Presto.  The code change [PR-17791](https://github.com/prestodb/presto/pull/17791) was merged into Presto repository and it will be released in next release Presto-0.274.

One example about the Parquet encryption and decryption in Presto is described in the diagram below. In this example, there are only 2 columns (c1, c2). C2 is defined as a sensitive column while c1 is not. After the Parquet™ encryption, c2 is encrypted before being sent to storage, which could be HDFS or cloud storage like S3, GCS, Azure Blob, etc. On the reading path, the crypto metadata is stored in each file ([format](https://github.com/apache/parquet-format/blob/master/Encryption.md)) and the Parquet™ library uses that to determine what key to be retrieved to decrypt the data. The KMS client is wrapped up with the same plugin.

![Presto Parquet Column Encryption Example](/img/blog/2022-07-10-presto-parquet-column-encryption/presto_paraquet_encryption_example.png)

## Performance
Parquet modular encryption has been benchmarked at white box level and discussed in this blog [Test Driving Parquet Encryption](https://medium.com/@tomersolomon/test-driving-parquet-encryption-3d5319f5bc22), and at end-end level by the Uber blog [One Stone, Three Birds: Finer-Grained Encryption @ Apache Parquet™](https://eng.uber.com/one-stone-three-birds-finer-grained-encryption-apache-parquet/). Overall, we see minimum increase - write overhead is 5.7% and the read overhead is 3.7%.

There overhead is mainly from two places: encryption and key retrieval time. Given Presto use the same parquet-mr code for these two places, it is not expected difference between Parquet-mr and Presto for encryption and decryption. After deployment, we didn’t see the interactive queries through Presto have visually any difference for the encrypted tables. 

## Interoperability
It is worth to mention that, the reader and writer doesn’t need to be all Presto application. The encrypted data by any application that follows the Parquet modular encryption standard can be decrypted by Presto Parquet application. On the other hand, the encrypted data by Presto can be decrypted by any other Parquet application that follow the Parquet modular encryption standard. 
