---
id: people-data
num: 9
domain: analytics
track: technical
title: Reporting on People
subtitle: Why a headcount query is harder than a revenue query
hue: 92
minutes: 9
labs: 
terms: slowly-changing-dimension, as-of-date-join, point-in-time-snapshot, headcount-grain
---

Everything so far in this collection has been taught on orders, order lines and products, because that is where the mechanics are clearest. People data breaks one assumption those examples quietly rely on: that a row describes something that is true now. An HR record describes something that was true between two dates, and every other row for the same person describes a different window. A query written as if the table held one row per person returns a number that looks plausible and is wrong — and this is the single most common way a report built by someone competent at SQL still misreports headcount.

This chapter is the bridge to the Oracle HCM collection. Chapter 4 there calls it effective dating; the modelling world calls it a slowly changing dimension. They are the same idea, and a consultant who works across both is expected to speak either.

## The same idea, two vocabularies

A **slowly changing dimension** is a dimension whose attributes change over time, and the question is what the warehouse does about it. Type 1 overwrites: the old value is gone, which is right for a corrected typo and wrong for anything else. **Type 2** keeps history by adding a row — the old row is closed with an end date and a new one opened — so the dimension holds one row per version of the entity, each valid for a period.

That is exactly what an HR system does natively. A promotion does not update the assignment; it end-dates the current record and inserts a new one. So an HCM source is already type 2, which has two consequences for anyone reporting on it. There is no transformation step to build the history, because it is there. And there is no way to avoid dealing with it, because every query touches it.

## The predicate that makes a query mean something

The whole of the difference is one pair of conditions:

```
SELECT ...
FROM   assignments a
WHERE  DATE '2026-06-30' BETWEEN a.effective_start_date AND a.effective_end_date
```

Without it, a person promoted twice returns three rows; with it, one. Written as a join between a person dimension and a fact, the same predicate has to appear for every date-effective table in the query, not just the one the author was thinking about — two name versions joined to three assignment versions produce six rows for one human, and nothing in the result says so.

Oracle's own tables carry the warning in their names: a `_f` suffix marks a date-effective table, and `_m` marks one that can change more than once in a single day, which needs a further filter to keep the last change of each day. The HCM collection's Chapter 13 has the query written out; the point to carry here is that the filter is per table, and missing one is silent.

## What one row means, again

Chapter 1 of this collection said the grain is the first thing to establish. In people data the grain has a second axis: not just *what* a row describes, but *when* it was true.

**Headcount** counts humans at a moment. **FTE** sums the share of a full workload each one works, so a department of ten with four half-timers is a headcount of ten and an FTE of eight — two correct answers to two different questions, which the HCM collection's Chapter 7 covers from the configuration side. Both still need the as-of date, because both are a count of rows that were valid on a given day.

And a person with two concurrent assignments is one human with two rows that are both current, which no date filter will collapse. That is what the primary-assignment flag is for, and it is the reason a headcount query filters on it while a workload query does not.

## Point in time, period end, and the trend that always under-reports

A number for a single day is a **point-in-time snapshot**. A trend is a series of them, and how the series is built decides whether it is honest.

The tempting shortcut is to take today's rows and group them by hire date and termination date. It produces a smooth curve and it is wrong, because it reports today's attributes — today's department, today's grade — as if they had always applied, and it silently loses anyone whose record was later corrected. The reorganization that moved 200 people into a new department last month appears, in that curve, to have happened three years ago.

The honest alternative is to evaluate the as-of predicate once per period and keep the answer: one row per person per month, built deliberately and stored, rather than recomputed from live history every time someone opens the report. It is more work on the way in and it is the only version that reconciles with what the HR team reported at the time.

## What a reportable people dataset looks like

For a BI tool, the shape worth building is a fact of one row per person per period, carrying the attributes as they were in that period — department, grade, location, FTE, status — plus the keys to join the dimensions. It is deliberately denormalized and deliberately snapshotted, and it makes every subsequent question cheap: headcount by month, attrition by department as it stood then, FTE against budget, a starters-and-leavers reconciliation that adds up.

Building it is where the two halves of this atlas meet. The HCM side knows which object holds which attribute and when it changed; the analytics side knows what grain to land it at and why a star schema wants it that way. Neither half alone produces a number anyone should sign.

## Common mistakes

- Treating an HR table as one row per person. It is one row per version.
- Filtering one date-effective table in a multi-table join and not the others.
- Reporting a trend from current rows, so history is restated with today's attributes.
- Counting rows for headcount when a person can hold two concurrent assignments.
- Using headcount and FTE interchangeably because they are close in most months.
- Rebuilding history live on every refresh instead of snapshotting it once per period.

## Sources

- Kimball Group, "Slowly Changing Dimensions" — the type 1, 2 and 3 definitions this chapter uses. https://www.kimballgroup.com/2008/08/slowly-changing-dimensions/
- Kimball Group, "Slowly Changing Dimensions, Part 2". https://www.kimballgroup.com/2008/09/slowly-changing-dimensions-part-2/
- Oracle, *Implementing Global Human Resources* — date-effective objects and the history they keep. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
