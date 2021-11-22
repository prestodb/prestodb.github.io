---
author: Rongrong Zhong
authorURL: https://www.linkedin.com/in/rongrong-zhong-31aa8a8/
title: Common Sub-Expression optimization
---

## The problem

One common pattern we see in some analytical workloads is the repeated use of the same, often times expensive expression. Look at the following query plan for example:

![Query Plan](/img/blog/2021-11-22-common-sub-expression-optimization/query-plan.png)

The expression `JSON_PARSE(features)` is used 6 times, and casted to different `ROW` structures for further processing. Traditionally, Presto would just execute the expression 6 times, in 6 separate projections. Since Presto would generate efficient bytecode for each projection, this would not be a problem as long as the expression itself is not expensive. For example, executing `x+y` 6 times in a cache efficient way would not necessarily incur a big performance overhead. However, running expensive string manipulations like `JSON_PARSE` or `REGEX` operations multiple times could quickly add up.
<!--truncate-->

## Common sub-expression optimization

*Common Sub-Expression (CSE) optimization* is a common optimization technique in query execution optimization. The idea is to extract the sub-expressions that are commonly used in all expressions, compute them only once, and rewrite the projections to use these results instead.

### How does it work?

Let’s use projection as an example to explain how CSE optimization works. First let’s take a look at how projection worked before we introduced CSE optimization. In the query plan above, you can see that the project operator has 6 *assignments* (e.g., `expr := TRY_CAST(json_parse(features))` is one *assignment*). For each assignment in the project operator, Presto would generate a java class `PageProjection` for the projection expression. This happens on *presto worker* when worker plans local execution. The expression evaluation logic is wrapped in `PageProjection.project`, which takes in a page, and produces a block as the output. In this model, there is one `PageProjection` class generated for each assignment. Since they are separate classes, no intermediate results can be shared among different assignments.

![Original PageProjection](/img/blog/2021-11-22-common-sub-expression-optimization/page-projection.png)

One way to allow different assignment to share intermediate result (CSE result) is to generate a single `PageProjection` class for assignments that are sharing CSEs, turning the above model to the one below:

![New Grouped PageProjection](/img/blog/2021-11-22-common-sub-expression-optimization/new-page-projection.png)

The code that generates `PageProjection` is in `PageFunctionCompiler`. In this class, we first extract all CSEs, in the above example, there is only one CSE, which is `json_parse(features)`. We create a new assignment for the CSE, then rewrite each assignment using this newly introduced variable. So the assignments become:

```
cse := json_parse(features)
expr := TRY_CAST(cse)
expr_0 := TRY_CAST(cse)
...
expr_4 := TRY_CAST(cse)
```

Since all assignments depend on this CSE, we will wrap them in a single `PageProjection` class. We generate a function for cse that computes its value on first invocation and stores it, and on later invocation will just return the result directly.

![PageFunctionCompiler](/img/blog/2021-11-22-common-sub-expression-optimization/page-function-compiler.png)

In this way, the expensive `json_parse` will only need to be executed once.

Let’s look at another example to get a better understanding of what counts as CSEs. In the following query:

```
SELECT
    x + y + z,                        -- exp0
    x + y * z,                        -- exp1
    (x + y + z) * 2,                  -- exp2
    cast(x + y + z as VARCHAR),       -- exp3
    (x + y + z) * 2 * z               -- exp4
FROM 
    (VALUES (1, 2, 4), (3, 5, 7), (2, 4, 5)) t(x, y, z);
```

There are 5 assignments in the projection, with 2 CSEs: `x + y + z` and `(x + y + z) * 2` (`x + y` is also a CSE but all expressions using this also uses `x + y + z` so we do not generate a separate function for it). We can rewrite this projection into:

```
cse1 := x + y + z
cse2 := cse1 * 2
expr0 := cse1
expr1 := x + y * z
expr2 := cse2
expr3 := CAST(cse1 as VARCHAR)
expr4 := cse2 * z
```

From the rewritten assignments, we can see that expr1 does not share any CSEs with other expressions, and the rest do. We will generate 2 `PageProjection` classes, one for expr1, another one for the rest of the assignments.

### Performance benefit

Microbenchmark (`CommonSubExpessionBenchmark`) has shown that even for simple expressions like `x + y`, there could be a 10% performance improvement. For queries using complex expressions like `JSON_PARSE`, we’ve seen 3x performance improvements in production.

![Benchmark](/img/blog/2021-11-22-common-sub-expression-optimization/benchmark.png)

## How to use it?

This optimization was first introduced in Presto release 0.235. There were subsequent improvements and bug fixes in the releases after that, but it is considered stable since release 0.245. The optimization is on by default. You can turn it off by setting session property `SET SESSION optimize_common_sub_expressions = false` to see the performance difference.
