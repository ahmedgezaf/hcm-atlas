---
id: sql-shape
num: 2
domain: analytics
track: technical
title: The Shape of a SQL Query
subtitle: Why the clauses run in a different order from the one you write them in
hue: 212
minutes: 8
labs: query-order
terms: logical-processing-order, where-vs-having, group-by, aggregate-function, distinct, alias-scope, three-valued-logic, count-star-vs-column
---

SQL is written in one order and executed in another. Almost every beginner error — the alias that will not work in `WHERE`, the filter that belongs in `HAVING`, the `COUNT` that returns a number nobody expected — comes from not knowing the second order.

## The order the database actually uses

You write `SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY`. The engine resolves it as:

```
FROM        which tables, and how they join
WHERE       throw away rows
GROUP BY    collapse the survivors into groups
HAVING      throw away groups
SELECT      work out the output columns
DISTINCT    remove duplicate output rows
ORDER BY    sort
LIMIT       cut
```

This is the *logical* processing order — the engine is free to optimise the physical execution however it likes, as long as the result matches what this order would produce. Two consequences follow immediately, and they explain most of the confusion.

[[lab:query-order]]

**An alias defined in `SELECT` cannot be used in `WHERE`.** `WHERE` runs first; at that point the alias does not exist yet. Write the expression out again in `WHERE`, or wrap the query. The same alias *does* usually work in `ORDER BY`, because `ORDER BY` runs last — one of the few places SQL bends its own rule for convenience, and a genuine dialect difference worth checking.

**`WHERE` filters rows, `HAVING` filters groups.** "Only orders over 100" is a row condition and belongs in `WHERE`. "Only customers whose total is over 1,000" is a condition on an aggregate and belongs in `HAVING`, because the total does not exist until `GROUP BY` has run. Putting an aggregate in `WHERE` is an error; putting a plain row filter in `HAVING` usually works but is slower, because you have grouped rows you were always going to discard.

## Grouping

`GROUP BY` collapses rows into one row per distinct combination of the grouping columns. Every column in `SELECT` must then either appear in `GROUP BY` or be wrapped in an **aggregate function** — `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`. The reason is arithmetic, not pedantry: if you have collapsed fifty rows into one, the engine has no way to choose which of the fifty values of `customer_name` to show unless you tell it.

Aggregates ignore NULLs. `AVG(discount)` over ten rows where four are NULL divides by six, not ten. That is often what you want and occasionally a serious bug, and the only way to know is to have decided what the NULLs mean.

## The two counts

`COUNT(*)` counts rows. `COUNT(column)` counts rows where that column is not NULL. `COUNT(DISTINCT column)` counts distinct non-NULL values. Three different questions, and interviewers ask the difference because it is a fast test of whether someone has thought about NULLs at all.

## Three-valued logic

SQL does not have true and false. It has true, false and **unknown**, and NULL is what produces unknown. `NULL = NULL` is not true — it is unknown, because two unrecorded values cannot be shown to be equal. That is why you write `IS NULL`, never `= NULL`.

The trap this creates is `NOT IN` against a list containing a NULL. `x NOT IN (1, 2, NULL)` evaluates to unknown for every `x`, so the condition is never true and the query returns nothing at all. Nothing errors; the result set is simply empty, and people rewrite the query three times before spotting it. `NOT EXISTS` does not have this behaviour and is the safer habit.

## Writing it so someone can read it

Beyond correctness: put each clause on its own line, uppercase the keywords or lowercase them but do not mix, and alias tables with something meaningful rather than `a` and `b`. A query is read far more often than it is written, usually by you, months later, trying to work out why a number moved.

## Common mistakes

- Using a `SELECT` alias in `WHERE` and being told the column does not exist.
- Putting an aggregate condition in `WHERE` instead of `HAVING`.
- Assuming `COUNT(column)` and `COUNT(*)` are the same.
- `NOT IN` against a subquery that can return NULL.
- Comparing to NULL with `=` instead of `IS NULL`.

## Sources

- Microsoft Learn, "SELECT (Transact-SQL)" — logical processing order of the SELECT statement. https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql
- PostgreSQL documentation, "Queries" and "Functions and Operators: Comparison". https://www.postgresql.org/docs/current/queries.html
- PostgreSQL documentation, "Aggregate Functions" — NULL handling in aggregates. https://www.postgresql.org/docs/current/functions-aggregate.html
