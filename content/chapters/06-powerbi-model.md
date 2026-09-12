---
id: powerbi-model
num: 6
domain: analytics
track: technical
title: Power BI: The Model Is the Product
subtitle: Star schema, relationships, and why the transformation belongs upstream
hue: 45
minutes: 8
labs: 
terms: fact-table, dimension-table, star-schema, relationship-cardinality, cross-filter-direction, date-table, import-vs-directquery, roches-maxim
---

People learn Power BI by dragging fields onto a canvas and are surprised when the numbers misbehave. The visuals are the last five per cent. The model underneath — which tables exist, at what grain, joined how — decides whether every number in the report is right, and it is where the work actually is.

## Facts and dimensions

A **fact table** holds the events you measure: one row per sale, per click, per ticket. It is long, it grows, and its columns are mostly numbers you will aggregate plus the keys that point outward.

A **dimension table** holds the things you slice by: products, customers, stores, dates. It is short, it changes slowly, and its columns are the descriptive attributes you want on an axis or in a slicer.

Arrange one fact table in the middle with dimensions around it, each joined by a single key, and you have a **star schema**. It is the shape Power BI is built for, and Microsoft's own guidance says so plainly. It is not an academic preference: the engine's compression and its filter propagation are both designed around it, and a model in this shape is faster, smaller and easier to reason about than the same data flattened into one wide table or normalised into a snowflake.

[[fig:star-schema]]

The practical rule when you are handed a flat export: split it. Pull the product attributes into a product table, the customer attributes into a customer table, keep the measures and the keys in the fact table.

## Relationships

A relationship has a **cardinality** — usually one-to-many, from the dimension's one row to the fact's many — and a **cross-filter direction**, which decides which way a filter travels. In a star schema, filters flow from the one side to the many side: select a product, and the sales rows filter. That single direction is what you want almost always.

Setting a relationship to filter **both** ways is the tempting fix when a slicer does not affect a visual, and it is usually the wrong one. Bidirectional filters can create ambiguous paths through the model, make results depend on evaluation order, and slow queries down. Reach for them last, deliberately, and only when you can say which problem they solve.

A **many-to-many** relationship is a signal that a bridge table is missing — the intermediate table that resolves the two sides into two one-to-many relationships.

Every model that reports over time needs a dedicated **date table** with one row per date, no gaps, marked as the date table. Without one, Power BI's time-intelligence functions either refuse to work or quietly give the wrong answer at the boundaries of a period.

## Where transformation belongs

Power Query (Chapter 5) and DAX (Chapter 7) can both do many of the same jobs, which invites doing them in the wrong place. The guidance usually quoted here is **Roche's Maxim**: *data should be transformed as far upstream as possible, and as far downstream as necessary.*

In practice that means: rename, reshape, split, filter and type your columns in the source or in Power Query, where the work happens once at refresh and every report downstream benefits. Leave to DAX only what genuinely depends on what the user has selected. A calculation that gives the same answer regardless of the slicers is a transformation, and it belongs upstream.

The cost of ignoring this is a model where nobody can find where a number is defined, and where the same fix has to be made in four reports.

## Import or DirectQuery

**Import** loads a compressed copy of the data into the model. It is fast, it supports the whole of DAX, and it is the default answer. The data is as current as the last refresh.

**DirectQuery** leaves the data in the source and sends a query for every visual. You get current data and no size limit, and you pay for it with latency, a restricted set of DAX, and load on the source system that will eventually become somebody else's problem. Choose it when the freshness requirement is genuinely real-time or the volume genuinely will not import — not because it sounds more modern.

## Common mistakes

- Loading one flat wide table and calling it a model.
- Turning on bidirectional filtering to fix a slicer, without knowing why it worked.
- Reporting over dates without a marked date table.
- Doing transformation work in DAX that Power Query should have done at refresh.
- Choosing DirectQuery by default and discovering the report is slow after it is published.

## Sources

- Microsoft Learn, "Understand star schema and the importance for Power BI". https://learn.microsoft.com/en-us/power-bi/guidance/star-schema
- Microsoft Learn, "Model relationships in Power BI Desktop" — cardinality and cross-filter direction. https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-relationships-understand
- Microsoft Learn, "Bi-directional relationship guidance". https://learn.microsoft.com/en-us/power-bi/guidance/relationships-bidirectional-filtering
- Matthew Roche, "Roche's Maxim of Data Transformation". https://ssbipolar.com/2021/05/31/roches-maxim/
- Microsoft Learn, "Choose a Power BI model framework" — Import versus DirectQuery. https://learn.microsoft.com/en-us/power-bi/guidance/powerbi-implementation-planning-model-framework
