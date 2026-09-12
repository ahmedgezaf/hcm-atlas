---
id: dax
num: 7
domain: analytics
track: technical
title: DAX and Filter Context
subtitle: Why the same measure returns a different number in every cell
hue: 20
minutes: 8
labs: dax-context
terms: measure-vs-calculated-column, filter-context, row-context, calculate, context-transition, iterator-functions, time-intelligence, divide-function
---

DAX looks like Excel formulas and is not. An Excel formula computes one cell from other cells. A DAX measure is a rule that gets evaluated again in every cell of every visual, under whatever filters that cell happens to sit in. Once that clicks, most of the language follows. Until it does, nothing does.

## Measures and calculated columns

A **calculated column** is computed row by row when the data refreshes, and the result is stored in the model. It knows about the current row and nothing about the report. Use it when you need a value to slice, group or filter by — a category band, a flag, a key to relate on.

A **measure** is computed at query time, once per cell of the visual, in whatever filter context that cell sits in. It knows nothing about "the current row" and everything about what the user has selected. Use it for anything you aggregate.

The default should be a measure. A calculated column that holds `Quantity * Price` on every one of ten million rows costs memory in the model and cannot respond to a slicer; the measure `SUMX(Sales, Sales[Quantity] * Sales[Price])` costs nothing at rest and answers correctly whatever the user clicks. Writing calculated columns where measures belong is the single most common beginner pattern, and it is what produces models that are inexplicably large and reports that do not react.

[[lab:dax-context]]

## Filter context

**Filter context** is the set of filters in force when a measure is evaluated: the row and column a cell sits in, the slicers on the page, the page and report filters, anything a visual contributes.

`Total Sales = SUM(Sales[Amount])` is one expression. Put it in a matrix by product and month and it evaluates once per cell — for that product, in that month — and returns a different number each time. The measure does not know or care; the context is supplied to it. This is why "the measure is wrong in the total row" is almost never the measure and almost always the context: the total row is a genuinely different filter context, not the sum of the rows above it.

**Row context** is the other kind, and it is what a calculated column and an iterator have: a current row to read columns from. Row context does not filter anything by itself — which is why referencing a column inside a measure without wrapping it in an aggregation is an error.

## CALCULATE

`CALCULATE` is the function that modifies filter context, and it is the centre of the language. It takes an expression and any number of filter arguments, and evaluates the expression in a context it has changed:

```
Sales LY = CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
Sales Cairo = CALCULATE ( [Total Sales], 'Store'[City] = "Cairo" )
```

Its filter arguments *replace* existing filters on the same column rather than adding to them, which is the behaviour to internalise — `CALCULATE([Total Sales], 'Store'[City] = "Cairo")` returns Cairo even in a cell already filtered to Alexandria. Wrap the filter in `KEEPFILTERS` when you want to intersect with what is already there instead.

`CALCULATE` also performs **context transition**: when it is evaluated in a row context, it converts that row into an equivalent filter context. This is why a measure called from inside a calculated column or an iterator suddenly sees only the current row, and it is the mechanism behind most DAX behaviour that looks like magic.

## Iterators

Functions ending in X — `SUMX`, `AVERAGEX`, `MAXX`, `RANKX` — take a table, evaluate an expression once per row of it, and aggregate the results. `SUM` adds up a column that already exists; `SUMX` computes something per row and then adds it up. When a calculation multiplies two columns together, or depends on anything more than a single stored column, it is an iterator you want.

## Two small ones that matter

Divide with `DIVIDE(numerator, denominator)` rather than `/`. It returns blank instead of an error when the denominator is zero, which is exactly what a visual should show.

Time intelligence — `SAMEPERIODLASTYEAR`, `DATEADD`, `TOTALYTD` — requires the marked date table from Chapter 6, with contiguous dates. Without one these functions fail quietly at period boundaries rather than loudly, which is the worst way for anything to fail.

## Common mistakes

- Writing a calculated column where a measure belongs, then wondering why slicers do nothing.
- Expecting `CALCULATE`'s filters to add to the existing context rather than replace it.
- Reading a column inside a measure without an aggregation around it.
- Using `SUM` where the calculation needs a row-by-row `SUMX`.
- Time intelligence on a model with no marked, gapless date table.
- Dividing with `/` and shipping a visual full of errors.

## Sources

- Microsoft Learn, "DAX overview" and the function reference. https://learn.microsoft.com/en-us/dax/
- Microsoft Learn, "CALCULATE function (DAX)". https://learn.microsoft.com/en-us/dax/calculate-function-dax
- Microsoft Learn, "Tutorial: Create calculated columns in Power BI Desktop" and "Create measures" — the difference and when each applies. https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-calculated-columns
- Microsoft Learn, "DAX: DIVIDE function vs divide operator (/)". https://learn.microsoft.com/en-us/dax/divide-function-dax
- SQLBI (Marco Russo and Alberto Ferrari), "Introducing CONTEXT TRANSITION in DAX". https://www.sqlbi.com/articles/understanding-context-transition/
