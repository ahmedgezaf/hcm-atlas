---
id: sql-joins
num: 3
domain: analytics
track: technical
title: Joins, and the Rows You Did Not Expect
subtitle: Where totals quietly double — and why the join type is only half the story
hue: 236
minutes: 8
labs: joins
terms: inner-join, left-join, full-outer-join, cross-join, fan-out, anti-join, join-key-mismatch
---

A join answers one question: for each row on the left, which rows on the right match? Everything else — the join type, the direction, the surprises — follows from what you decide to do when the answer is *none*, or *more than one*.

## The four you will actually use

An **inner join** keeps only rows that matched on both sides. A **left join** keeps every row from the left table and fills the right-hand columns with NULL where nothing matched. A **full outer join** keeps unmatched rows from both sides. A **cross join** matches every row with every row, producing the product of the two row counts — rarely what anyone wants by accident, occasionally exactly what you want for building a date scaffold.

Right joins exist and are almost never written deliberately; a left join with the tables swapped reads better and everyone understands it immediately.

[[lab:joins]]

## The mistake that turns a left join into an inner join

This one catches everybody once.

```sql
SELECT c.name, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'shipped'
```

That is not a left join any more. Customers with no orders get NULL for `o.status`, `NULL = 'shipped'` is unknown, and `WHERE` discards them — so the query returns exactly what an inner join would. The fix is to move the condition into the `ON` clause, where it filters what counts as a match rather than filtering the result:

```sql
LEFT JOIN orders o
  ON o.customer_id = c.id AND o.status = 'shipped'
```

The rule generalises: a condition on the *right* table of a left join belongs in `ON`; a condition on the left table belongs in `WHERE`. Filtering `IS NULL` on a right-hand column in `WHERE` is the deliberate exception — that is an **anti-join**, the idiom for "customers who have never ordered".

## Fan-out

Join type is the half everyone learns. The half that breaks reports is **fan-out**: when one left row matches several right rows, the left row is repeated once per match. That is correct join behaviour. It is also how a total doubles.

Join orders to order lines and every order-level value — the order total, the shipping fee, the customer's name — now appears once per line. `SUM(o.total)` is no longer the sum of order totals; it is the sum of order totals weighted by line count. The result looks like a plausible revenue figure and is inflated by a factor nobody can see.

The defences, in order of preference: aggregate the many side to the grain you want *before* joining, usually in a subquery or CTE; or, if you must aggregate after the join, collapse back to one row per key first — a subquery that selects the key and one value per key, then sum that — rather than reaching for `SUM(DISTINCT …)`, which deduplicates by *value* and will quietly merge two different orders that happen to share a total; or count rows before and after the join and notice when the number changes. That last one is a habit worth building — if a join changed your row count and you did not expect it to, stop.

## When keys do not match

Joins silently return fewer rows than expected for dull reasons. Trailing whitespace on a text key. One side stored as text and the other as integer, so the implicit cast fails or, worse, succeeds inconsistently. Case sensitivity, which differs by database and by collation. Leading zeros stripped by a spreadsheet somewhere upstream.

When a join returns fewer rows than it should, check the keys before you check the logic. Count distinct values on both sides, and look at a handful that failed to match. It is nearly always the data, not the SQL.

## Common mistakes

- Filtering the right table in `WHERE` and collapsing a left join to an inner one.
- Summing a column after a one-to-many join.
- Not noticing the row count changed.
- Joining on a key with different types or invisible whitespace on the two sides.
- Reaching for `SELECT DISTINCT` to hide duplication rather than fixing the grain.

## Sources

- PostgreSQL documentation, "Table Expressions" — join types and the meaning of `ON` versus `WHERE`. https://www.postgresql.org/docs/current/queries-table-expressions.html
- Microsoft Learn, "FROM clause plus JOIN, APPLY, PIVOT (Transact-SQL)". https://learn.microsoft.com/en-us/sql/t-sql/queries/from-transact-sql
- Microsoft Learn, "Understand star schema and the importance for Power BI" — why grain and cardinality decide whether a total is right. https://learn.microsoft.com/en-us/power-bi/guidance/star-schema
