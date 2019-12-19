---
title: 5 design choices—and 1 weird trick — to get 2x efficiency gains in Presto repartitioning
author: Ying Su
authorURL: https://www.linkedin.com/in/ying-su-b00b81107/
authorFBID: 656599427
---

Ying Su, Masha Basmanova, Orri Erling, Tim Meehan, Sahar Massachi, Bhavani Hari

We like Presto. We like it a lot — so much we want to make it better in every way. Here's an example: we just optimized the PartitionedOutputOperator. It's now 2-3x more CPU efficient, which, when measured against Facebook's production workload, translates to 6% gains overall. That's huge.

The optimized repartitioning is in use on some production Presto clusters right now, and available for use as of release 0.229.

In this note, let's go over how we did it, what optimizations we unlocked specifically, and a case study of how we approached opportunity sizing whether this was worth doing at all.

<!--truncate-->

## What is the Partitioned Output Operator, anyway?

In a distributed query engine data needs to be shuffled between workers so that each worker only has to process a fraction of the total data. Because rows are usually not pre-ordered based on the hash of the partition key for an operation (for example join columns, or group by columns), repartitioning is needed to send the rows to the right workers. PartitionedOutputOperator is responsible for this process: it takes a stream of data that is not partitioned, and divide the stream into a series of output data ready to be sent to other workers.

The PartitionedOutputOperator takes about 10% of the total CPU of all Facebook warehouse workload. That's a lot! We can cut it down to 3-5%.

The legacy PartionedOutputOperator works as follows:

1. Building step: Each destination partition has a PageBuilder. When a page comes in, the destination of each row is calculated using a hash function (xxHash64) on the partitioning columns which may be pre-computed. The rows are appended to each destination’s PageBuilder.
2. Serialization step: If any PageBuilder's size is larger than configured max page size then it will be split into several pages that fit into the limit.  Then each of these pages will be serialized to a SerializedPage which is enqueued to the OutputBuffer for the destination.

In the new implementation we removed the build step and directly append the data to buffers. Then we concatenate these buffers to form a SerializedPage, and then send it out. The new one looks like this:

```text
For each incoming page
    Populate the top level row numbers for each destination partition
    Decode the blocks by peeling off the Dictionary or RLE wrappings
        For each partition
            Populate nested level row numbers for nested blocks like ArrayBlock
            Calculate row sizes
            Calculate how many rows can fit the buffers before reaching the limit. This is based on the result of step 1 and 2.
            Append the rows to the buffers block by block
            If the size limit is reached (e.g. 1MB for a destination), flush the buffer
```

## Results: Things are easier, faster, stronger, better

Optimized repartitioning has been enabled on several Facebook clusters. A substantial improvement in CPU utilization for PartitionedOutputOperator has been observed in all regions. The percentage of CPU consumed by PartitionedOutputOperator dropped from approximately 10% to about 4%. TPCH SF3000 benchmark on 22 read only queries show an overall 13% gain in CPU reduction. Certain queries improved by over 30%:

![Remote Exchange](/img/blog/2019-12-20-repartition.md/tpch_sf3000_repartition.png)

## Opportunity Sizing: How we decided to make these changes

A key part of our work is making sure we choose the right projects. To butcher a saying, there will always be fruit on the tree. How did we choose this low hanging fruit? Here's an example of how we started:

First, we looked at all the operators in production, and realized that PartionedOutputOperator took up a nice chunk of total CPU. We took the CPU profiles for some of the queries with high PartionedOutputOperator cost, and found the cost of the PageBuilder is on top of the profiles. This step can be skipped in fact, and we just need to write the data directly into buffers that conforms to the serialized format and concatenate them before putting them on the wire. Now we need to find an efficient way to do this memory copying and serialization.

We performed a few experiments to game out the performance differences between different options for reading data from the pages and blocks, and writing data into memory.

### Experiment 1: Reading blocks

Our first experiment helped us decide between two different ways of reading data. Which did we prefer?

1. Directly access the raw arrays at specified positions
2. Access the values through the Block.getXXX() interface

Directly accessing arrays would in theory be faster. Compilers can do all sorts of tricks like loop unrolling and auto-vectorization, but, in Presto, the Block interface does not expose the raw arrays, just the getXXX() methods to access a single value. To access the raw arrays directly, the Block interface would have to be changed — and we generally want to avoid that. Block.getXXX() methods are virtual interface functions. In C++, virtual calls are mostly expensive, because it’s AOT compilation and cannot devirtualize the virtual function calls at run time. Each call involves a vtable lookup and a jump.

How well can JVM optimize the code? This is the first experiment we needed to do. Can we achieve similar performance of accessing raw arrays in Java without modifying the Block interface? Theoretically yes, if the number of types is not more than 2.

In the first experiment, we read one type (BIGINT) from a LongArrayBlock. We compared it to reading from a raw array. The destination for both cases are byte arrays with same size. The raw array was up to 33% faster. Was it due to virtual function dispatch or something else?

We verified the functions were being optimized by C2 in level 4 and were inlined properly. We then got the async-profiler and perf-asm results and found the difference was coming from the boundary check in the getLong() implementation:

```java
public long getLong(int position)
{
    checkReadablePosition(position);
    return getLongUnchecked(position + arrayOffset);
}

private void checkReadablePosition(int position)
{
    if (position < 0 || position >= getPositionCount()) {
        throw new IllegalArgumentException("position is not valid");
    }
}
```

The code in checkReadablePosition() was compiled to two tests and jumps. Applying this to every row has a negative impact on performance. By removing this boundary check the performance of the getXXX() loop is as fast as accessing the raw arrays!

In fact, for some operators like the PartitionedOutputOperator, the positions for a given batch of rows are known in advance and this range check can be hoisted out and performed only once per batch. We introduced UncheckedBlock with getXxxUnchecked methods that don’t include the boundary checks to allow this approach to be used.

There were no virtual function dispatch costs, and the generated assembly from the two tests are the same, both in  a tight loop, inlined,  and unrolled. This is because Java uses JIT compilation and has complete information about the classes loaded that implement an interface. So for a given call site, if only one class implements a given interface (monomorphic), then the calls can be de-virtualized to direct calls, and inlined if the function is small enough.

We also expect most calls to be monomorphic for this operator because we copy the values one block at a time in a tight loop and there is only one implementation invoked at each call site.

Next, we verified that the addition of arrayOffset in the getLong call didn’t incur additional cost. We checked how it was compiled. Instead of a standalone add instruction, It was a mov instruction with indirect addressing with displacement and scaled-index as follows:

```text
getByteUnchecked(position + *arrayOffset*) -> mov 0x20(%r8,%r10,8),%rax  ;*laload
```

On Intel and AMD CPUs the different varieties of mov instructions have similar cost in terms of CPU cycles. It seems the JVM did an awesome job in optimizing this loop so we decided to go through the UncheckedBlock getters.


### Experiment 2: Writing to buffers

Our next experiment helped us decide between a few different ways of *writing*:

1. Raw byte array
2. SliceOutput in Airlift (BasicSliceOutput or DynamicSliceOutput)
3. A custom SliceOutput that wraps a raw byte array

We tried 3 different ways of writing buffers: A byte array, basic slice, and dynamic slice. (All were patched with the "cmov" fix we'll talk about later).

Long story short, all SliceOutput implementations were much slower than raw byte arrays. That is because SliceOutput contains lots of sanity checks like boundary checks and null checks. If we used byte arrays to avoid those checks, we could get a 1.5x to 3x win on writes.

### Experiment 3: Partitions first or columns first?

We also studied the performance for two different ways to add values to the buffer:

1. Loop over columns, and then partitions
2. Loop over partitions, and then columns.

For 1) the reads are local i.e. reading from the same array/block over and over while the writes are scattered. For 2) the reads are scattered but the writes are local. We didn't see enough difference to make us favor one over another.

After all that impact scoping, we were ready to make the changes.

## Our 5 design choices (and 1 weird trick) that got this working:

1. Process data column-by-column, not row-by-row
2. Use unchecked blocks and unchecked getters (for speed)
3. Avoid SliceOutput, use byte arrays as destination buffers
4. Avoid branches and jumps by optimizing the if checks for the null case
5. Avoid copying in page serialization / deserialization

### 1. Read columns, not rows

You can think of the operator as a pipeline that takes in pages of input, does a hash on each row of input, and then writes to output.

In the legacy implementation, the input was read row by row. Kind of like this:

```text
for each row
    for each column
        call the type.appendTo to write the value into a BlockBuilder
```

This is inefficient for a few reasons:

1. Type is megamorphic. That means that the Type.appendTo() call and Block.getLong(), getDouble(), etc could be implemented by many different subclasses. (RowBlock, IntArrayBlock, MapBlock, etc). So each time we call getXXX the JVM has to search for the right method.
2. You can't unroll this loop. Relatedly, since each column in a row might be different, the compiler can't unroll or parallelize this loop.


In our new implementation, we do something like this:

```text
for each column
    cast to the correct subclass of block
    for each row
        call XXXBlock.getYYY
```

Winning!

 ### 2. Arrays are better than SliceOutput

*See the discussion around [Opportunity Sizing: How we decided to make these changes](http://localhost:3000/blog/2019/12/20/repartition#opportunity-sizing-how-we-decided-to-make-these-changes)*.

We need a thing we'll call buffers. These will be used to, well, buffer the data after we calculate its destination partition. We used to use SliceOutput. But now, we use a thin wrapper around byte arrays instead. This wrapper has fewer checks. But with careful coding, we don't need them.

Here's an example: We have to check the buffer's size ourselves, and deal with problems if the data we write is too large for the buffer. There're two ways for checking the buffer size and make sure they're not over the limit. One way is to calculate the row sizes in advance, and add to the buffer only for the rows that fit. The other way is to check if the buffers need to be flushed for every row it adds. We chose the first method because 1) the second way requires us to do a size check for every value added inside of the loop. 2) calculating row sizes can be done fairly fast. For fixed length types this can be simplified to a simple division. If all columns are fixed length, we can get the size really fast. For variable width columns, we need to calculate the row sizes. To do this efficiently, we pass in an int array to the block in recursive manner, so that no new memory is allocated in each nested block.


### 3. UncheckedBlock is best block

Reading blocks is slow. Why? Because of all those pesky checks. Null checks. Boundary checks. etc.

UncheckedBlock is a new superclass of Block. It gives us a set of getXXXUnchecked methods. (Like getLongUnchecked()). These methods don't check to see if you're writing to an index outside the size of the array. That small change gives us an ~10% speed boost -- comparable to raw array handling.

UncheckedBlock exists right now, and Presto developers can feel free to use it in the future for their code.

### 4. Rewrite if statements to avoid jumps/branches

Look at this code:

```java
for (int j = 0; j < positionCount; j++) {
    int position = positions[j];
        if (!block.isNull(position)) {
               long longValue = block.getLong(position);
               ByteArrayUtils.setLong(longValueBuffer, longBufferIndex, longValue);
               longBufferIndex += ARRAY_LONG_INDEX_SCALE;
        }
    }
```

There's a problem here. Can you see it? That if statement is pretty hefty, and that means that it compiles down to a `jump` or `jmp` command. The condition contains several statements, and it's necessary for the complier to create different branches. This forces the CPU to speculate and potentially throw away work if the branch is mispredicted.

If only we could do an atomic if statement. This would allow us to avoid the whole mess of a jump and branch. Could such a thing be possible?

Yes! The assembly call we want is cmov or cmovne. We can induce it through careful rewriting:

```java
for (int j = 0; j < positionCount; j++) {
    int position = positions[j];
    long longValue = block.getLong(position);
    ByteArrayUtils.setLong(longValueBuffer, longBufferIndex, longValue);
    if (!block.isNull(position)) {
           longBufferIndex += ARRAY_LONG_INDEX_SCALE;
    }
```

That gives us an up to 2.6x performance improvement. Nice!


### 5. Avoid unnecessary copying in PagesSerde

Context: PagesSerde stands for Pages Serialization / Deserialization. The method wrapSlice is what we care about right now.

We did the following things to make the wrapSlice method better:

1. Avoid copying a buffer when the slice is already compact. Added a check -- If the slice you're using as input is already compact, don't bother compacting/copying it.
2. Materialize a compression buffer in this class instead of creating it every time.

Our version of a Slice is always compact, so that's nice. (We skip the copy!). How?

1. We estimate the size of the buffer beforehand, and we only write that much for each batch
2. We only allocate that number of bytes. How can we estimate the size of a slice? Type size * num rows.
3. Bonus -- we don't need to check that the buffer is full after adding data to it!

### Bonus: One weird trick — bitshift for range reduction when calculating partitions

This part is really good. Think about the basic concept of the operator: we take pages of data, look at the hash of the partitioning columns of that data, and then output data to different places depending on the modulus of that hash.

Modulus, the method, is pretty expensive. Luckily, there's a faster way.

We can use bitwise arithmetic to quickly implement the method that takes a hash and outputs a destination. This, by itself, improves CPU by 35% for the operator from end to end. And it can be easily used in other parts of the code.

Curious? Here’s all it takes:

```java
// This function reduces the 64 bit hashcode to [0, hashTableSize) uniformly. It first reduces the hashcode to 32 bit
// integer x then normalize it to x / 2^32 * hashSize to reduce the range of x from [0, 2^32) to [0, hashTableSize)
static int computePosition(long hashcode, int hashTableSize)
{
    return (int) ((Integer.toUnsignedLong(Long.hashCode(hashcode)) * hashTableSize) >> 32);
}
```

Note that the >> operator can be replaced by direct division of 2^32, the JVM would optimize it to bit shifting anyways.

See this PR for details: https://github.com/prestodb/presto/pull/11832

## Try Optimized Repartitioning

The optimization is available in mainline Presto and can be enabled using the `optimized_repartitioning` session property or the `experimental.optimized-repartitioning` configuration property. You are welcome to try it out and give us feedback.

## Further reading

* Here is the original issue explaining the plan https://github.com/prestodb/presto/issues/13015
* Here is an (internal) note going into benchmarking and wins https://fb.workplace.com/notes/ying-su/how-fast-can-we-serialize-blocks/471975263562084/
* Here is the main pull request that made it all happen https://github.com/prestodb/presto/pull/13183
* Here’s the commit for huge improvements in hashing dispatch by using modular arithmetic. https://github.com/prestodb/presto/pull/11832



