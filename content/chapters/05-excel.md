---
id: excel
num: 5
domain: analytics
track: functional
title: Excel, Honestly
subtitle: What a spreadsheet is still the fastest answer to, and the point where it stops
hue: 145
minutes: 7
labs: 
terms: xlookup, index-match, excel-table, pivot-table, power-query, volatile-function, excel-limits, spill-and-dynamic-arrays
---

Analysts are quietly embarrassed about Excel and should not be. It is the fastest tool in existence for a question you have not asked before, on data you have just been handed, when the answer is needed in ten minutes and will never be needed again. Knowing where that stops is the actual skill.

## Lookups

**XLOOKUP** replaced VLOOKUP and should be the default in any version that has it. It takes a lookup value, the array to search, and the array to return, and it fixes three things that made VLOOKUP dangerous: it defaults to **exact match** rather than approximate; it can look left as well as right; and it references arrays rather than a column *number*, so inserting a column does not silently break it.

VLOOKUP's fourth argument is the one to know about even if you never write another. Omitted, it defaults to `TRUE` — approximate match — which assumes the lookup column is sorted ascending and returns the largest value less than or equal to the one asked for. On unsorted data Microsoft's own documentation promises nothing: the value returned may simply be wrong. Either way it is a confidently wrong answer rather than an error, which is why nobody notices. Every legacy VLOOKUP you inherit should be checked for a missing `FALSE`.

**INDEX/MATCH** is the older pairing that did what XLOOKUP does — `INDEX` returns the value at a position, `MATCH` finds the position. It is still worth reading fluently, because the spreadsheets you inherit are full of it.

## Tables, not ranges

Formatting a range as an **Excel Table** changes it from a rectangle of cells into a named object with typed columns. Formulas gain **structured references** — `=SUM(Sales[Revenue])` instead of `=SUM(D2:D5000)` — which describe intent rather than coordinates, extend automatically when rows are added, and do not silently exclude the row someone appended at the bottom.

That last failure is the most common serious error in spreadsheet work: a formula whose range stopped short. Tables remove the whole class of it, and the cost is one keyboard shortcut.

## Pivot tables

A **pivot table** is a grouped aggregation with a drag-and-drop interface, and it is genuinely the fastest way to explore an unfamiliar dataset. Fields go to rows, columns, values and filters; the default aggregation is `SUM` for numbers and `COUNT` for anything else, which is the source of the perennial "why is my pivot counting instead of summing" — there is a non-numeric value, often a stray text cell or a blank, in a column you believed was numeric.

Pivot tables want long data (Chapter 1). A wide table with a column per month cannot be pivoted by month until it is unpivoted, which is what Power Query is for.

## Power Query is the part worth learning properly

**Power Query** is the transformation engine built into Excel and Power BI alike, and it is the single highest-return thing an Excel user can learn. It imports, cleans, reshapes, unpivots, splits columns and joins tables — and it records every step, so the whole thing re-runs on next month's file with one click.

The difference from doing it by hand is not speed, it is that the work is *repeatable and inspectable*. A colleague can read the applied steps and see what you did. A folder of manually cleaned spreadsheets contains no such record, and nobody — including you — can reconstruct what happened three months later.

Because it is the same engine in Power BI, time spent here is not Excel-specific. It transfers directly.

## Where Excel stops

The hard limit is 1,048,576 rows by 16,384 columns per worksheet. In practice things get unpleasant well before that: file sizes in the tens of megabytes, recalculation pauses, and **volatile functions** — `NOW`, `TODAY`, `RAND`, `OFFSET`, `INDIRECT` — which recalculate on every change anywhere in the workbook and are a common reason a file becomes slow for no visible reason.

The softer limits matter more. A spreadsheet has no audit trail, no access control worth the name, and no way to tell whether the copy someone emailed you is the current one. The moment a number matters to more than one person, or has to be reproduced next month, the answer stops being a spreadsheet — it becomes a query against the source and a model somebody can refresh.

Modern Excel has also quietly become more capable: **dynamic arrays** mean a formula can **spill** into neighbouring cells, and `FILTER`, `SORT`, `UNIQUE` and `SEQUENCE` remove most of the reasons people used to need array formulas or helper columns.

## Common mistakes

- A VLOOKUP with the fourth argument omitted, matching approximately by default.
- Hard-coded ranges that stop short of new rows.
- Pivoting data that is still in wide form.
- Cleaning by hand, repeatedly, instead of recording the steps in Power Query.
- Keeping a number that several people depend on in a file that has no version history.

## Sources

- Microsoft Support, "XLOOKUP function". https://support.microsoft.com/en-us/office/xlookup-function-b7fd680e-6d10-43e6-84f9-88eae8bf5929
- Microsoft Support, "Excel specifications and limits". https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3
- Microsoft Learn, "Power Query documentation" — the transformation engine shared with Power BI. https://learn.microsoft.com/en-us/power-query/
- Microsoft Support, "Dynamic arrays and spilled array behavior". https://support.microsoft.com/en-us/office/dynamic-arrays-and-spilled-array-behavior-205c6b06-03ba-4151-89a1-87a7eb36e531
