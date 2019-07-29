---
title: Memory Management in Presto
author: Nezih Yigitbasi
authorURL: https://www.linkedin.com/in/nezihyigitbasi/
authorFBID: 100000082666878
---

In a multi-tenant system like Presto careful memory management is required to keep the system stable and prevent individual queries from taking over all the resources. However, tracking the memory usage of data structures in an application (Presto) running on the Java Virtual Machine (JVM) requires a significant amount of work. In addition, Presto is a distributed system, which makes the problem more complicated. This post provides an overview of how memory management works in Presto, and provides info about the various memory management related JMX counters/endpoints that can be used for monitoring production clusters.

<!--truncate-->

## Memory Pools

To understand the details described in the rest of the article it would be instructive to first take a look at different types of memory allocations and memory pools in Presto.

In the Presto engine there are two types of memory allocations: user and system. User memory is the type of memory that's easier for the users to reason about given the input data (e.g., the memory usage of an aggregation is proportional to its
cardinality). System memory, however, is the type of memory that's a byproduct of the execution (e.g., table scan and write buffers), and doesn't necessarily have a strong correlation with the query input/shape.

Throughout the execution of a query, operator implementations allocate user/system memory from memory pools on the workers. Presto has two memory pools: general and reserved (historically it also had a system memory pool, and it has been removed for various reasons, but that's another story). The general pool serves the user and system memory allocations in "normal" mode of operation of the system. However, when there is a worker that has exhausted its general pool the reserved pool comes into the play. In that state, the coordinator selects the query with the largest total (user + system) memory reservation across the cluster, and assigns that query to the reserved pool on all workers. This assignment guarantees the completion of that particular query and also guarantees forward progress in the system. 

It is worth noting that the reserved pool is set aside on startup and it's as large as the largest query that the cluster is configured to execute with the `query.max-total-memory-per-node` config property. However, this is not efficient as the reserved pool is unused in normal mode of operation. Therefore, the engine also supports disabling the reserved pool with a config (`experimental.reserved-pool-enabled`). To guarantee forward progress in the system when the reserved pool is disabled, the OOM killer should be enabled (`query.low-memory-killer.policy=total-reservation-on-blocked-nodes`). The OOM killer, which is running on the coordinator, will trigger when the cluster goes into the OOM state, and will kill some query to free up space on the workers guaranteeing the progress of other blocked queries that are waiting for memory.

## Memory Limits

The Presto engine has two main mechanisms to keep itself stable under high memory pressure. One of these mechanisms is the configured local (worker level) and distributed memory limits. When a query hits either of these limits it gets killed by the Presto engine with a special error code (`EXCEEDED_LOCAL_MEMORY_LIMIT`/`EXCEEDED_GLOBAL_MEMORY_LIMIT`). The local memory limit can be configured with the `query.max-memory-per-node` and `query.max-total-memory-per-node` config parameters. The former configures the worker level user memory limit while the latter configures the worker level total (user + system) memory limit. Similarly, `query.max-memory` and `query.max-total-memory` can be used to configure the distributed user and total memory limits, respectively. For a detailed description of these properties please refer to [1]. The other mechanism to keep the system stable under high memory pressure is the cooperative blocking mechanism built into the memory tracking framework. When the general memory pool gets full the operators will block until memory is available in the general pool. This mechanism prevents aggressive queries from filling up the JVM heap and cause reliability issues.


## How Does Presto Track Memory?

Each Presto operator (e.g., `ScanFilterAndProjectOperator`, `HashAggregationOperator`, etc.) has an `OperatorContext` that has a bunch of info about the operator, counters, and the methods to get/create memory contexts. Memory context instances are used to  account for memory in the Presto engine. A common pattern in operator implementations is to get/create a memory context from the operator context, and then call `setBytes(N)` on the memory context instance to account for `N` bytes of memory for this particular operator. It is worth noting that calculating `N` is not always trivial as the engine has complex data structures and we need to properly account for the Java object overhead and we need to make sure that we don't account for a piece of memory multiple times if there are multiple references to it (e.g., multiple references pointing to a single physical copy). The JOL (Java Object Layout) library [2] helps solving the first problem by providing the APIs to get the retained size of Java objects in an easy way. However, the latter requires careful accounting of the data structures throughout the engine.

The memory contexts are organized in a tree hierarchy that reflects the hierarchy of the operators, drivers, pipelines, tasks, and the query. The memory accounted by all operators running for a particular task and a query are summed all the way up the tree, and eventually gets accounted for in the memory pool. Through this tracking mechanism the memory pools can track the memory used by every operator and every query running on that worker, which is exposed via a REST endpoint mentioned in the last section below.

The engine also sets aside some headroom (`memory.heap-headroom-per-node`) to account for the allocations that it cannot track, for example, due to allocations in the 3rd party dependencies, local/stack allocations during execution, etc. Without enough headroom it's possible to fill up the JVM heap as the general pool gets full, and that may cause reliability problems.

For more details about memory management in Presto please refer to our ICDE'19 paper [3].

## How About the Coordinator?

So far we have mostly looked at the worker-side of memory management. The coordinator also has various responsibilities to help with the memory management across the cluster. 

The coordinator collects the memory pool information from all the workers periodically and builds the global state of all memory pools in the cluster. This state is used for taking decisions (e.g., which query to kill when cluster is in OOM state or to kill a query if it exceeds the distributed memory limit) and for monitoring.

Coordinator has multiple responsibilities related to memory management: 

- __Enforce distributed memory limits:__ If a query reserves more than the configured distributed user/total memory limits, the coordinator kills the query with a special error code (`EXCEEDED_GLOBAL_MEMORY_LIMIT`).
- __Assign queries to reserved pool__: If any worker in the cluster exhausts its general pool, the coordinator assigns the largest query to the reserved pool on all workers.
- __Kill queries when the cluster is in the OOM state (a.k.a. the OOM killer)__: When the cluster goes into the OOM state the coordinator uses the configured heuristic (`query.low-memory-killer.policy`) to select a query to kill. For a cluster to go into the OOM state one or more workers should exhaust their general pool and the reserved pool should have a query assigned to it (if reserved pool is enabled).
- __Detect memory accounting leaks:__ Life is not perfect. So, it's possible that there are memory accounting bugs in the engine causing accounting leaks, that is, a query has non-zero memory reservation in the general pool even after it completes. Such leaks have a bunch of side effects, such as causing premature exhaustion of the general pool and preventing OOM killer from kicking in. The reason OOM killer cannot kick in when there are leaks is that it waits for the previously killed query to leave the system, however when  there are leaks previously killed query will still have a non-zero reservation in the memory pool state (and hence will not leave the system). This is a critical problem, because preventing OOM killer from kicking in may cause the cluster to get stuck in the OOM state, which will significantly reduce the cluster throughput. Presto addresses this problem by running a cluster memory leak detector on the coordinator to mark a query as "possibly leaked" if the query has finished 1m ago, but it still has non-zero memory reservation on the workers. With that the OOM killer can just coordinate with the leak detector to continue functioning properly.

Most of this functionality is implemented in Presto's cluster memory manager that runs on the coordinator, please see [4] for the implementation.

## Getting Visibility Into the Memory Management Framework

Finally, let's take a look at some of the important JMX counters and REST endpoints that may help with getting more visibility into the memory management framework, and help with monitoring production clusters.

The memory pools exports various counters for monitoring the used/free/max memory in the pools. For example, the free memory in the general pool on a worker can be monitored with the `presto.com.facebook.presto.memory:type=MemoryPool:name=general:FreeBytes` JXM counter. Similarly, the amount of memory allocated in the reserved pool can be monitored on a worker with the `presto.com.facebook.presto.memory:type=MemoryPool:name=reserved:ReservedBytes` JMX counter.

The coordinator exports similar counters for monitoring the memory pools, but at the cluster level. For example, `presto.com.facebook.presto.memory:type=ClusterMemoryPool:name=reserved:AssignedQueries` can be used to track the number of active queries in the reserved pools across all workers in the cluster. Another interesting counter is `presto.com.facebook.presto.memory:type=ClusterMemoryPool:name=general:BlockedNodes`, which can be used to monitor the number of "blocked" workers, that is, the number of workers that have exhausted their general pool. These two counters can be handy to understand whether the cluster is in the OOM state. Another useful counter is `presto.com.facebook.presto.memory:name=ClusterMemoryManager:QueriesKilledDueToOutOfMemory`, which is for monitoring the number of queries killed by the OOM killer.

The workers provide the REST endpoint `/v1/memory/{poolName}` to expose detailed memory tracking information at the query and the operator level where `{poolName}` is the name of the memory pool (general or reserved). This info can be useful to get deep visibility into the allocation information per operator per query. Simiarly, this info is rolled up at the cluster level and exposed via the `/v1/cluster/memory` endpoint on the coordinator.

When debugging reliability problems in production deployments one usually requires these counters plus the JVM's memory-related [5] and garbage collection-related [6] JMX counters. Using both Presto's view of the memory and the JVM's view of the memory and garbage collection activity provides a comprehensive coverage of the state of the system.

If you have questions about Presto internals including memory management please join [the Presto Slack community](https://prestodb.github.io/community.html).

## References
[1] [Presto Configuration Reference for Memory Management](https://prestodb.github.io/docs/current/admin/properties.html#memory-management-properties)

[2] [Java Object Layout library](https://openjdk.java.net/projects/code-tools/jol/)

[3] [Presto: SQL on Everything ICDE'19 paper](https://research.fb.com/publications/presto-sql-on-everything/)

[4] [ClusterMemoryManager implementation](https://github.com/prestodb/presto/blob/master/presto-main/src/main/java/com/facebook/presto/memory/ClusterMemoryManager.java)

[5] [Java MemoryMXBean Reference](https://docs.oracle.com/javase/10/docs/api/java/lang/management/MemoryMXBean.html)

[6] [Java GarbageCollectorMXBean Reference](https://docs.oracle.com/javase/10/docs/api/com/sun/management/GarbageCollectorMXBean.html)
