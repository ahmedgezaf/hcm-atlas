---
id: question-to-chart
num: 8
domain: analytics
track: functional
title: From Question to Chart
subtitle: The part of the job that is not a tool — and the small number of ways to mislead
hue: 310
minutes: 9
labs: 
terms: business-question, chart-choice, truncated-axis, dual-axis, data-ink, dashboard-vs-report, sanity-check
---

The tools are the easy half. The half that decides whether anyone uses your work is turning a vague request into a specific question, answering it in a form a human reads correctly, and being able to say how confident you are.

## Make the question answerable

"Can you look at our sales?" is not a question. The job is to turn it into one that has a single defensible answer, and that takes three or four sentences of conversation rather than three hours of dashboard building.

Ask what decision the answer feeds. Ask over what period, and compared with what — a number with nothing to compare it to is not information. Ask which population counts: does "customer" include the ones who churned, the internal test accounts, the trial users? Ask what would count as a surprising answer, which is the fastest way to surface the assumption the requester has not said out loud.

Then repeat the question back as one sentence and get agreement before building anything. "Revenue from new customers, by month, for the last twelve months, excluding trials, compared with the same months last year." That sentence is the specification, and it is also the title of the chart.

## Choosing the form

The choice is narrower than the chart menu suggests.

Comparing a value across categories is a **bar chart**, sorted by value rather than alphabetically unless the categories have a natural order, with the axis starting at zero. Change over time is a **line chart**, with time on the horizontal axis. The relationship between two measures is a **scatter plot**. Part of a whole is a bar chart too — a pie is readable only at two or three slices, and a stacked bar with more than about four series stops being comparable because only the bottom segment shares a baseline.

A single important number is just the number, large, with its comparison next to it. A table is the right answer more often than people admit: when the reader needs exact values, or will look up one row rather than scan a pattern, a table beats every chart.

Sort order, axis range and colour are decisions, not defaults. Colour especially should mean something — a category, a threshold, a direction — and if it means nothing it should not vary.

## The ways charts mislead

A **truncated axis** on a bar chart is the classic one. Bars encode value by length, so cutting the axis at 90 makes a 2% difference look like a doubling. Bars must start at zero. Line charts are different — they encode change by slope, and a zero baseline often flattens the very thing you are showing — so truncation is acceptable there if the axis is labelled honestly.

**Dual axes** let you place two unrelated scales on one chart and imply a relationship that the data does not contain; the apparent correlation is entirely a function of where you set the two ranges. Two charts stacked with a shared time axis say the same thing without the implication.

Beyond that: do not use area or volume to encode a single value, because people read those badly. Do not use a rainbow of colours for an ordered quantity. And keep the non-data material — gridlines, borders, shadows, legends that repeat the labels — light enough that the data is the loudest thing on the page.

## Dashboards are not reports

A **dashboard** is monitored: a few numbers somebody looks at regularly to decide whether anything needs attention. It should fit on one screen, lead with the summary, and make what is wrong visible without reading. If everything on it is fine, the reader should be able to tell in three seconds.

A **report** is read once and answers a question, at whatever length that takes. Requests for a dashboard are frequently requests for a report, and building the wrong one is a week wasted. The question that separates them: how often will you look at this, and what will you do differently as a result?

## Before you send it

Sanity-check it, every time. Does the total match a number the business already trusts — last month's close, the finance figure, the count in the source system? If it does not, find out why *before* you present, because someone else will. Spot-check a handful of individual rows against the source. Check the boundaries: the first period, the last period, the nulls, the categories with one row.

And say what you are not sure about. "Revenue is up 4%, but two large orders moved in from March, so the underlying trend is closer to flat" is a better answer than a clean number that is technically correct and practically misleading. Nobody loses trust for flagging a caveat; they lose it for a number that quietly turns out to be wrong.

## Common mistakes

- Building before the question has been agreed in one sentence.
- Bar charts with a truncated axis.
- Dual axes implying a correlation the data does not show.
- A pie chart with seven slices.
- Presenting a total without checking it against a number the business already believes.
- Building a dashboard when what was wanted was an answer.

## Sources

- Edward Tufte, *The Visual Display of Quantitative Information*, 2nd ed. — data-ink, graphical integrity and the axis rules. https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/
- Financial Times, *Visual Vocabulary* — which chart form suits which relationship. https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary
- Microsoft Learn, "Visualization types in Power BI" and the report design guidance. https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-types-for-reports-and-q-and-a
