---
id: hrfunction
num: 7
track: functional
title: Headcount, Metrics & the HR Function
subtitle: The vocabulary HR directors use — speak it fluently
hue: 46
minutes: 7
labs: fte
terms: headcount, fte-full-time-equivalent, attrition-turnover, org-chart, solid-line-vs-dotted-line-reporting, hrbp-hr-business-partner, centers-of-excellence-coe, shared-services-hr-operations, ulrich-model
---

A consultant does not need HR theory, but does need to speak HR's language fluently enough that an HR director never has to slow down. This chapter covers the metrics that appear in every reporting conversation and the way large HR functions are organized, which explains who owns which decision.

## Headcount is not FTE

**Headcount** is a raw count of people, regardless of how much each one works. One person equals one headcount. **FTE** — full-time equivalent — is a measure of workload rather than of people: an employee working half time is 0.5 FTE but still one headcount. A department with ten people, four of them half-time, has a headcount of ten and an FTE of eight. FTE is stored on the assignment.

Both numbers are "correct", and they answer different questions: legal thresholds, facilities and org design care about humans; budgeting and capacity planning care about work. Reporting FTE when the client asked for headcount, or the reverse, is a reliable source of reporting disputes. Ask which one they mean.

[[lab:fte]]

**Attrition** or turnover is the rate at which people leave over a period, usually expressed annually as a percentage. Definitions vary — voluntary versus involuntary, whether to include probation leavers, what goes in the denominator — so the first question when a client asks for a turnover report is how they define the numerator and the denominator. That question alone marks a consultant as experienced.

## The org chart is data, not a drawing

In Oracle the **org chart** is generated from manager relationships on assignments; it is not drawn separately. If the chart looks wrong, the underlying manager data is wrong — fix the data, not the picture. Matrix organizations have two kinds of manager. **Solid-line** reporting is the formal line manager who owns performance and compensation decisions; **dotted-line** reporting is a secondary, functional relationship without that authority. A regional finance analyst may report solid-line to the country manager and dotted-line to the regional finance head. Approval routing usually follows the solid line, and getting it wrong sends approvals to the wrong person — which surfaces immediately in user acceptance testing.

## How HR is organized: the Ulrich model

Most large HR functions use the vocabulary of the **Ulrich model**, which splits HR into three parts. **HR business partners (HRBPs)** are embedded with a business division as its strategic HR contact; they bring requirements framed as business problems rather than system specifications, and translating those into configuration is the consultant's job. **Centers of excellence (CoEs)** are specialist teams owning policy in a domain — compensation and benefits, talent acquisition, learning, organization development. The CoE typically signs off design in its domain: if the consultant designs a grade structure, C&B approves it. **Shared services**, or HR Operations, is the centralized team doing transactional work — payroll processing, data entry, first-line queries — for the whole organization.

In Egypt, shared services usually means the classic Personnel and Payroll team (شؤون العاملين): the people who handle social-insurance forms, labour-office files and attendance. They know the statutory reality better than anyone else in the building. Their daily work is what the configuration automates, they are the consultant's main day-to-day counterparts, and treating them as low-level administrators is a serious mistake — they hold operational knowledge no document captures.

Knowing the model lets a consultant work out who owns a decision and who merely has an opinion about it.

## Common mistakes

- Conflating headcount and FTE.
- Building a turnover report before agreeing the definition.
- Redrawing the org chart instead of fixing manager data.
- Routing approvals along the dotted line.

## Sources

- Dave Ulrich, *Human Resource Champions* (1997) — the original three-part model.
- Oracle, *Using Global Human Resources* — manager hierarchies and organization charts. https://docs.oracle.com/en/cloud/saas/human-resources/
