---
author: George Wang
authorURL: https://www.linkedin.com/in/george-wang-9a5a46190/
title: Presto Cluster Memory Tuning
---

##Presto Memory Management

Presto's memory management system is carefully designed to achieve high performing query engine in a distributed system. It defines the memory into two categories: user memory and system memory.
* The user memory is related to user data. For example, reading user data from cloud storage on AWS S3 bucket will occupy the corresponding memory. The amount of data is tightly related;
* The system memory is meant for some memory allocated for the operator itself that needs to execute in order to process the query, such as tablescan operation and aggregation operation, for which the memory space may be required by operators, and are not strongly related to the user's data itself.

Presto designs to divide the entire memory into three memory pools, namely System Pool, Reserved Pool, and General Pool. Reserved Pool and General Pool are used for query execution.  In general, the memory required for query execution is allocated from the general pool, and the reserved pool is usually idle meaning unused. When the general pool in the cluster is exhausted by a worker, the coordinator will select the query that occupies the most memory in the cluster, and allocate this query to the reserved pool, so that this large query can continue to execute by itself, and the freed memory will also make available for others query to continue. So that the entire system can move forward.

###Why use memory pool

The System Pool is used for the memory used by the system. For example, when transferring data between machines, the buffer is maintained in the memory. This part of the memory is mounted under the name of the system. So, why do you need reserved memory? If there is no Reserved Pool, when there are a lot of queries and the memory space is almost used up, a query that consumes a lot of memory starts to run. But at this time, there is no memory space for the query to run, and the query has been in a suspended state, waiting for available memory. But after other small-memory queries are finished, new small-memory queries are added. Because the small memory query occupies a small amount of memory, it is easy to find the available memory. In this case, the large-memory query will hang until starved to death, usually gets timed-out.

Therefore, in order to prevent this kind of starvation, a space must be reserved for a large memory query to run. The reserved space is equal to the maximum memory allowed by the query. Every second, Presto picks out a query with the largest memory usage and allows it to use the reserved pool to avoid that there is always no available memory for the query to run.

##Memory Tuning

Presto has a couple of system configs on memory for the stability of the entire cluster:
* `query.max-memory`: The maximum user memory allowed by a single query in the entire cluster
* `query.max-memory-per-node`: The maximum user memory allowed by a query on a single worker
* `query.max-total-memory`: The maximum (user + system) memory allowed by a single query in the entire cluster
* `query.max-total-memory-per-node`: The maximum (user + system) memory allowed by a query on a single worker. If not set, by default it's 1/3 of heap size

When these thresholds are exceeded, your query will be terminated with an insufficient memory error. Presto also has another memory related self-protection mechanism. When the general pool memory is used up, some operators will be set to a blocked state, allowing the operator to suspend for a while, thereby avoiding the entire system from crashing.

Now for a cluster configured for concurrent queries, there are a few factors that should be considered when setting memory in a Presto Worker:

* TotalMemory: Total amount of distributed memory a query may use
* GeneralPool: User and system memory allocations may use
* ReservedPool: reserved memory pool may be disabled by configuring `experimental.reserved-pool-enabled`.
* Other: Operating system, some other processes in the system, and some off-heap memory, some operations in calculations require off-heap memory, such as some decompression algorithms
* `memory.heap-headroom-per-node`: There are some memory allocations that cannot be counted by the Presto framework, such as some memory allocations in the third party library
* `query.hash-partition-count`: The number of hash partitions in distributed joins and aggregations
* `query.max-memory`: total memory allowed for a single query. When the user memory allocation of a query across all workers hits this limit, the query will be killed.
* `query.max-total-memory-per-node`: Limits the total amount of memory a query may use on a single node

Below is the relationship between these configs:

* GeneralPool = TotalMemory-ReservedPool-`memory.heap-headroom-per-node`-Other
* ReservedPool = `query.max-total-memory-per-node` (True only when user memory pool is exhausted. Reserved pool is as large as `query.max-total-memory-per-node` as revocable memory is kicked in to prevent cluster concurrency reduction. In general case, reserved pool is not used)
* `query.max-memory` = `query.hash-partition-count` * `query.max-total-memory-per-node` / hash skew factor （where the skew factor is how much skew it can be tolerated)
  
Node: In the case of heavy data skew or scheduled many splits on single worker, the per-node memory limit may set to a high bar to be more tolerant of skew, meaning high skew factor * `query.max-memory => high `query.max-total-memory-per-node`

##Concurrent cluster scenario:

Assuming if the worker memory size is 128GB, TotalMemory=128GB, other is 16GB, heap-headroom is 8GB. 

* `query.max-total-memory-per-node` = 0.3 * 128GB = 38GB. This is the maximum allowed memory size on a single worker
* ReservedPool = 16GB
* GeneralPool = 128GB - 38GB - 8GB - 16GB = 66GB

That's 66GB * # of worker nodes in the entire cluster. 

Assuming `query.hash-partition-count=8`, if we can tolerate skew factor of 2, then:

`query.max-memory`= `query.hash-partition-count` * `query.max-total-memory-per-node` / hash skew factor = 8 * 38GB / 4 = 76GB that will result in 76G/8=9.5GB per node memory usage roughly per partition if there's no data skew and all data is well distributed across all nodes. We can increase `query.max-memory-per-node`=48GB, which means that the data skew factor to be `query.hash-partition-count` * `query.max-total-memory-per-node` /`query.max-memory` usage per node = 8 * 58G / 76G=6.1. This means that the task to consume memory could be up to as much as 6 times per worker node when the data is heavily skewed.

The above scenario is just one way of tuning for memory, there are some specific factors that need to be considered, how much value the configurations should be set should be carried out according to the stress test of workload.

##Further reading

For more information please refer to another blog [here](https://prestodb.io/blog/2019/08/19/memory-tracking)

If you have any questions, feel free to ask in the [PrestoDB Slack Channel](https://prestodb.slack.com/)