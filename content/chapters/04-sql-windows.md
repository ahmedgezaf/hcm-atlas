---
id: sql-windows
num: 4
domain: analytics
track: technical
title: Windows, CTEs and the Second Half of SQL
subtitle: Ranking, running totals and period-on-period — without collapsing the rows
hue: 262
minutes: 8
labs: windows
terms: window-function, partition-by, row-number-rank-dense-rank, lag-and-lead, frame-clause, cte, recursive-cte, qualify
---

Everything up to here collapses rows. `GROUP BY` takes fifty rows and gives you one. Window functions are the other half of SQL: they compute across a set of rows and give the answer back *on every row*, keeping the detail. Ranking, running totals, month-on-month change and "each row's share of its group" all live here, and an analyst who cannot write them is limited to reports that only ever show totals.

## The anatomy

```sql
SELECT
  order_date,
  customer_id,
  total,
  SUM(total) OVER (PARTITION BY customer_id ORDER BY order_date) AS running_total
FROM orders
```

`OVER` is what makes it a **window function**. `PARTITION BY` splits the rows into independent groups — the calculation restarts for each customer — and is the window equivalent of `GROUP BY`, except the rows survive. `ORDER BY` inside `OVER` defines the sequence the function walks in, which is what makes "running" mean anything.

[[lab:windows]]

## Ranking, and the three that differ

`ROW_NUMBER()` numbers rows 1, 2, 3 with no ties ever — two identical values still get different numbers, chosen arbitrarily unless you break the tie yourself. `RANK()` gives ties the same number and then skips: 1, 2, 2, 4. `DENSE_RANK()` gives ties the same number and does not skip: 1, 2, 2, 3.

Which you want depends on the question. "The top 3 by revenue" with ties probably wants `DENSE_RANK`. "Pick exactly one row per customer" wants `ROW_NUMBER` with a deliberate tiebreaker in the `ORDER BY`, because otherwise the row you get is not stable between runs.

Note that you cannot filter on a window function in `WHERE` or `HAVING` — both run before `SELECT`, where the window is computed. Wrap it in a CTE or subquery and filter outside. Some warehouses add a `QUALIFY` clause that filters window results directly; it is not standard SQL, and it is worth knowing whether your engine has it before you write it.

## Looking at the row before

`LAG(total) OVER (ORDER BY order_date)` returns the previous row's value; `LEAD` returns the next one's. This is how period-on-period change is written, and it replaces the self-join that beginners reach for:

```sql
total - LAG(total) OVER (PARTITION BY customer_id ORDER BY order_date) AS change
```

Both take an optional offset and default — `LAG(total, 1, 0)` returns 0 rather than NULL for the first row, which is often what a chart wants.

## The frame, and the trap inside it

There is a third part to a window nobody mentions until it bites: the **frame**, which decides how much of the partition the function sees for the current row. Written out it looks like `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.

Here is the part to remember. When you supply an `ORDER BY` and no frame, the default is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — and `RANGE` treats all rows with the *same ordering value* as one unit. If two orders share a date, a running total defaulting to `RANGE` gives both rows the total including both, not a stepped total. With `ROWS` it steps one row at a time. On data with no ties the two are identical, which is exactly why this bug survives testing and appears in production.

If you mean row-by-row, write `ROWS` explicitly.

## CTEs

A **common table expression** names a query so the next one can use it:

```sql
WITH monthly AS (
  SELECT customer_id, date_trunc('month', order_date) AS m, SUM(total) AS revenue
  FROM orders GROUP BY 1, 2
)
SELECT *, revenue - LAG(revenue) OVER (PARTITION BY customer_id ORDER BY m) AS mom
FROM monthly
```

CTEs are the main tool for keeping long queries readable: each step is named, testable on its own, and chainable. Prefer several small ones to a single nested subquery three levels deep. A **recursive CTE** additionally references itself, which is how you walk a hierarchy — an org chart, a bill of materials, a category tree — in one query.

Two cautions. A CTE is not automatically materialised: some engines inline it and evaluate it once per reference, so a CTE used three times may run three times. And readability is not free performance — a tidy chain of CTEs can still be slow, and the execution plan is the only thing that will tell you.

## Common mistakes

- Filtering a window function in `WHERE` instead of wrapping it.
- `ROW_NUMBER` with no tiebreaker, then wondering why results change between runs.
- Taking the default frame on data that has ties in the `ORDER BY`.
- Reaching for a self-join where `LAG` is one line.
- Assuming a CTE is computed once when it is referenced several times.

## Sources

- PostgreSQL documentation, "Window Functions" and "Window Function Calls" — frames and the `RANGE` default. https://www.postgresql.org/docs/current/tutorial-window.html
- Microsoft Learn, "OVER Clause (Transact-SQL)" — partitioning, ordering and `ROWS`/`RANGE`. https://learn.microsoft.com/en-us/sql/t-sql/queries/select-over-clause-transact-sql
- PostgreSQL documentation, "WITH Queries (Common Table Expressions)", including recursive CTEs. https://www.postgresql.org/docs/current/queries-with.html
