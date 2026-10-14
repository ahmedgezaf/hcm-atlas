---
id: tables
num: 1
domain: analytics
track: functional
title: Thinking in Tables
subtitle: What one row means — the question that prevents most analysis errors
hue: 188
minutes: 7
labs: 
terms: grain, primary-key, foreign-key, surrogate-key, cardinality, tidy-data, long-and-wide, null-in-data
---

Before any tool, one habit. When a table lands in front of you, ask what a single row represents, and do not start work until you can say it in one sentence. Almost every wrong number in analytics traces back to someone who never asked — who summed a column without noticing the rows had been duplicated, or averaged an average, or joined two tables whose rows meant different things.

## The grain

The **grain** of a table is what one row is. "One row is one order." "One row is one order line." "One row is one product, per store, per day." Those are three different tables, and the same column called `revenue` means something different in each.

The grain is the first thing to establish and the last thing to lose track of. A table at order grain can be summed safely for total revenue. The same query joined to order *lines* is no longer at order grain — each order now appears once per line — and summing the order-level revenue column will overstate the total, silently, by the average number of lines per order weighted by order value — which is more than the plain average whenever the larger orders carry more lines, as they usually do. Nothing errors. The number is simply wrong, and it looks plausible, which is worse.

State the grain out loud in a handover or an interview and you sound like someone who has been burned. That is the point.

[[fig:grain]]

## Keys

A **primary key** is the column, or set of columns, that uniquely identifies a row. It is how you know the grain is what you think it is: if `order_id` is the primary key, there is exactly one row per order, and a count of rows equals a count of orders. When a supposed primary key turns out to have duplicates, the grain was never what the documentation claimed.

A **foreign key** is a column that points at another table's primary key — `customer_id` on the orders table pointing at the customers table. Foreign keys are how tables connect, and they are the reason joins work at all.

Keys come in two flavours. A **natural key** is something meaningful from the business: an email address, an ISBN, a national ID. A **surrogate key** is a meaningless number the system generates, usually auto-incrementing. Surrogate keys are preferred in analytics because natural keys change — people change email addresses, companies get reassigned codes — and a key that changes breaks every row that referenced it. The rule of thumb: join on surrogate keys, report on natural ones.

**Cardinality** describes how two tables relate: one-to-one, one-to-many, many-to-many. One customer has many orders, so customers-to-orders is one-to-many. Getting cardinality wrong is what produces duplicated rows, and it is the single most common cause of an inflated total.

## Tidy data

A table is **tidy** when each column is one variable, each row is one observation, and each cell is one value. It sounds obvious and it is routinely violated: a column called `Q1 Q2 Q3 Q4` holding four numbers, a cell containing "Cairo, Egypt", a column whose header is itself a data value.

The last of those is the most common, and it has a name. A table with columns `Jan`, `Feb`, `Mar` is in **wide** form — the month is encoded in the column header rather than stored as a value. The **long** form has one row per month with a `month` column and a `value` column. Wide is easier for a human to read across; long is what every tool wants to compute on. Pivot tables, Power BI and most charting libraries all expect long, and most of the reshaping work in a real project is turning wide data that came out of a spreadsheet into long data a tool can use.

## Missing values

**NULL** is not zero and not an empty string. It means "no value recorded", and it behaves differently from both. Zero is a measurement; NULL is the absence of one. An average over a column with NULLs ignores them, so the denominator is smaller than the row count — which is usually right for "average order value" and badly wrong for "average daily sales" when the missing days genuinely were zero.

The distinction matters most when deciding what to do with it. Filling NULLs with zero is a modelling decision, not a cleanup step, and it should be a deliberate one you can defend.

## Common mistakes

- Summing a column after a join that changed the grain.
- Treating a column labelled "ID" as unique without checking.
- Joining on a natural key that the business quietly reassigns.
- Reshaping wide to long by hand instead of with the tool's unpivot.
- Replacing NULLs with zero without deciding whether zero is true.

## Sources

- Hadley Wickham, "Tidy Data", *Journal of Statistical Software* 59(10). https://www.jstatsoft.org/article/view/v059i10
- Microsoft Learn, "Understand star schema and the importance for Power BI" — grain and dimension modelling. https://learn.microsoft.com/en-us/power-bi/guidance/star-schema
- PostgreSQL documentation, "Constraints" — primary and foreign keys. https://www.postgresql.org/docs/current/ddl-constraints.html
