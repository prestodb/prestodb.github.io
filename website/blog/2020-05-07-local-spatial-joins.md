---
title: Spatial Joins 1: Local Spatial Joins
author: James Gill
authorURL: https://www.linkedin.com/in/jagill/
---

A common type of spatial query involves relating one table of geometric
objects (e.g., a table `population_centers` with columns
`population, latitude, longitude`) with another such table (e.g., a table
`counties` with columns `county_name, boundary_wkt`), such as calculating
for each county the population sum of all population centers contained
within it. These kinds of calculations are called _spatial joins_. While
doing it for a single row each from `population_centers` and `counties` is
manageable, doing it efficiently for two large tables is challenging. In this
post, we'll talk about the machinery that Presto has built to make these
queries blazingly fast.

<!-- truncate -->

## Prologue: Point in Polygon

How do you test if a point is inside a polygon? A classic algorithm is the
[winding-number test][winding-number-rule] which tests if a ray from the
point to `x = +infinity` intersects the polygon an even or odd number of
times. For example, the ray from a point inside a circle would intersect a
circle once, while a ray from a point outside would intersect either 0 or 2
times. The even-odd rule holds for more complex polygons as
well.[^even-odd-rule]

![Winding number rule][winding-number-rule-image]

We'll skip the details of the algorithm, but the runtime complexity is
important. Without a preprocessing step, we need to check if each side of the
polygon intersects the ray. Since the number of sides is equal to the number
of vertices, the algorithm runs in `O(V)` time where `V` is the number of
vertices in the polygon.

[^even-odd-rule]: There are many edge cases -- such as a ray that's tangent to
  a polygon -- as well as important concepts of validity and simplicity in
  polygons, as well as more robust algorithms, that we are omitting for
  brevity.

## Take 1: Double Loop

A correct but very inefficient way of calculating a spatial join is a nested
`for` loop, checking each row of `population_centers` if it is contained
in each row of `county`. The algorithm will look something like this:

```python
def spatial_join(population_centers, counties):
  results = {}
  for pop in population_centers:
    for county in counties:
      if not county.boundary.contains(pop.latitude, pop.longitude):
        continue
      if county.county_name not in results:
        results[county.county_name] = 0.0
      results[county.county_name] += p.population
  return results
```

If `P` is the number of points, and `C` is the number of counties, then this
algorithm will run in `O(P * C * V)` time, where `V` is the maximum number of
vertices of any polygon. This is very expensive! Detailed polygons can easily
contain millions of vertices, some polygon sets (e.g., neighborhoods) can have
millions of entries, and some geospatial datasets have billions of points.

Below are the polygons for all 3108 counties in the continental United States.
They are comprised of almost 70k vertices.

![US Counties][us-counties]

Running this on [some test data][github-repo]
takes 652.1 seconds to check ~1.5 million points against 3481 county polygons
(some counties have multiple polygons).

## Take 2: Envelopes

As humans, often we can quickly look at a point and see it is outside a
polygon. For example, consider this point and the polygon of Beaverhead County:

![Point and County][point-and-county]

It is far outside the polygon, so we don't have to check each side of the
polygon. In fact, the polygon can be arbitrarily complex: as long as the
point is far away from the polygon, we can discard it as a possibility
quickly. We can teach the computer to do this by using an _envelope_, which
is an axis-oriented rectangle specified by minimum and maximum `x` and `y`
values:

![Point and County with envelope][point-and-county-envelope]

The envelope can be calculated in `O(V)` time, and can be done almost for
free when you are deserializing a geometry. Checking if a point is in an
envelope is `O(1)`:

```
envelope.contains(point) ==
                envelope.min_x <= point.x <= envelope.max_x
                and envelope.min_y <= point.y <= envelope.max_y
```

We can modify our algorithm above to take advantage of this fact:

```python
def spatial_join(population_centers, counties):
  results = {}
  for pop in population_centers:
    for county in counties:
      if not county.envelope.contains(pop.latitude, pop.longitude):
        # Bail quickly!
        continue
      if not county.boundary.contains(pop.latitude, pop.longitude):
        continue
      if county.county_name not in results:
        results[county.county_name] = 0.0
      results[county.county_name] += p.population
  return results
```

While this does not change our worst-case runtime, it drastically reduces the
average runtime (since it removes the dependence on `V` for most checks).
Using county envelopes for our test data reduces the time to 13.8 seconds, an
almost 50x improvement!

Using an envelope is so cheap and effective that almost all geometric
libraries do an envelope pre-check before any relation check (containment,
intersection, etc).

## Take 3: Hierarchical Envelopes

Using envelopes makes the check for a given polygon cheaper on average, but
we still need to check each polygon. We can do better.

As humans, if we have polygons for each county, and a point in Massachusetts,
we know immediately that the point won't be in any county in California,
Ohio, or Florida. A computer version of this is to have a super-envelope for
each of the states: for each state, find the maximum and minimum `x` and `y`.
Since each county already has its envelope, the super-envelope can just be
the envelope of the envelopes. For our point in Massachusetts, we can first
check the envelope for each state. If only the Massachusetts envelope
contains the point, we can then do an envelope check for each county in
Massachusetts. Only for those counties that pass their envelope check do we
need to do the full containment check. This reduces our total envelope checks
from 3108 (counties in the continental US) to 50 (states) plus 14 (counties
in Massachusetts).

![US States and Counties with Envelope][us-counties-and-states-with-boxes]

Adding a check for states improves our performance to 3.4 seconds, about
4x better than using county envelopes alone (and ~200x better than the
brute force calculation).

While this is a great improvement, it leads to more questions. Since
Massachussetts is in the far northeast of the USA, so why do we have to check
each western and southern state? Why not also have envelopes for southern,
western, central, eastern, and northern USA? Why stop at three levels? Maybe
we can even make envelopes for regions in Massachussetts. What about other
data sets without concepts like states and countries? Is there a programmatic
way to generate the groups and levels?

R-trees provide an answer for these questions.

## Take 4: R-trees

Given a set of geometries, R-trees (Rectangle Trees) provide a programmatic
way to construct an efficient set of hierarchical envelopes. R-trees start
with an envelope for each polygon in the data set. It groups sets of
neighboring polygons, constructing an envelope for each group. The original
polygons are leaf nodes in the tree, and the groups are their parent nodes.
The maximum group size depends on a parameter called the _branching factor_.
The grouping algorithm then recurses, making parent groups of child groups,
constructing an envelope for each, and so on until there is only one node,
which encompasses all of our original geometries.

In the case of our counties, first we group them into groups of 9,
calculating the bounding box:

![US Counties with level 1 Rtree boxes][usCountiesWithRtreeBoxes1]

Then we group each of these level 1 boxes into groups of 9, calculating
_their_ bounding box:

![US Counties with level 2 Rtree boxes][usCountiesWithRtreeBoxes12]

Finally, we repeat this again to create the level 3 boxes:

![US Counties with level 3 Rtree boxes][usCountiesWithRtreeBoxes23]

The final node contains the bounding box for the whole continental USA.

In the example above, if we make an R-tree of the counties of the USA, we'd
first check if the point is in the envelope of the root node. If not, the
point can't possibly be in any county, and we're done. If it is contained, we
can iterate through that node's children, recursing into any whose envelope
contains the point. Eventually we will have a (perhaps empty) subset of leaf
nodes whose envelopes contain the point, and we can check those counties for
proper containment.

While the worst-case time complexity is actually worse than a linear scan
through the geometries' envelopes, average complexity is `O(log C + M)`,
where `C` is again the number of counties and `M` is the number of matching
counties (ie, counties whose envelopes contain the point). Then the time
complexity for all `P` points is `O(P * log C + M * V)`, where `M` is total
number of point-envelope matches, and `V` is the maximum number of vertices
per polygon. This is a significant improvement when `C` is large.

Using an R-tree on the counties in our test data reduces the calculation to
just 1.3s, which is ~2.5x better than the state envelopes, and about 500x
faster than the brute force calculation!

R-trees can also help many other spatial queries about proximity. For example,
if you want to check which polygons are within a certain distance of a point,
instead of querying the R-tree with a point, you can expand the point to an
envelope of the appropriate radius, and query the R-tree for envelope-envelope
intersections, instead of point-envelope containment.

## Local Spatial Joins

When Presto executes a query like

```sql
SELECT county_name, SUM(population) AS total_population
FROM population_centers
JOIN counties
ON ST_Contains(ST_GeometryFromWkt(boundary_wkt), ST_Point(longitude, latitude))
GROUP BY county_name
```

it will create an R-tree of the `counties` boundary geometries, and stream
the rows from `population_center`. For each row, it will query the R-tree for
counties whose envelopes contain the row's point, and for those candidates
it will do a proper containment check against the boundary geometries. It
will then emit a row `county_name, population` for each match, to be later
aggregated over `county_name`.

This procedure works on a single machine, but how do we parallelize spatial
joins? We'll examine that in a separate post on distributed spatial joins.

## Acknowledgements

These visualizations were done in collaboration with
[Jason Sundram](https://about.me/jsundram) in Facebook Boston's World AI team.
The starting point for our visualizations was
[Mike Bostock](https://bost.ocks.org/mike/)'s
[D3 US map](https://observablehq.com/@d3/u-s-map).
For the R-tree visualizations, I used
[Vladimir Agafonkin](https://agafonkin.com/)'s 
[RBush](https://github.com/mourner/rbush),
using colors from [Carto](https://carto.com/carto-colors/).
Spatial joins in Presto were primarily implemented by
[Maria Basmanova](https://github.com/mbasmanova).

Code for the performance profiling can be [found on GitHub][github-repo].

<!-- Links -->

[spatial-joins-distributed]: spatial-joins-distributed.html
[winding-number-rule]: https://en.wikipedia.org/wiki/Point_in_polygon
[github-repo]: https://github.com/jagill/presto_spatial_join_blog

<!-- Images -->

[winding-number-rule-image]: /img/blog/2020-05-07-local-spatial-joins/windingNumberTest.svg "Illustration of winding number rule"
[point-and-county]: /img/blog/2020-05-07-local-spatial-joins/complexCountyMap.svg "Beaverhead County"
[point-and-county-envelope]: /img/blog/2020-05-07-local-spatial-joins/complexCountyMapWithBox.svg "Beaverhead County with Envelope"
[us-counties]: /img/blog/2020-05-07-local-spatial-joins/usCounties.svg "US Counties"
[us-counties-with-boxes]: /img/blog/2020-05-07-local-spatial-joins/usCountiesWithBoxes.svg "US Counties with Envelopes"
[us-counties-and-states-with-boxes]: /img/blog/2020-05-07-local-spatial-joins/usCountiesAndStatesWithBoxes.svg "US Counties and States with Envelopes"
[usCountiesWithRtreeBoxes1]: /img/blog/2020-05-07-local-spatial-joins/usCountiesWithRtreeBoxes1.svg "US Counties with level 1 Rtree boxes"
[usCountiesWithRtreeBoxes12]: /img/blog/2020-05-07-local-spatial-joins/usCountiesWithRtreeBoxes12.svg "US Counties with level 2 Rtree boxes"
[usCountiesWithRtreeBoxes23]: /img/blog/2020-05-07-local-spatial-joins/usCountiesWithRtreeBoxes23.svg "US Counties with level 3 Rtree boxes"

