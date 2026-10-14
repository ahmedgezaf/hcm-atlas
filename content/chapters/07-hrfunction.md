---
id: hrfunction
num: 7
domain: hcm
track: functional
title: Headcount, Metrics & the HR Function
subtitle: The vocabulary HR directors use — speak it fluently
hue: 46
minutes: 9
labs: fte, ulrich, who-decides
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

Most large HR functions use the vocabulary of what everyone calls the **Ulrich model**, which splits HR into three parts. Strictly it is the three-legged delivery structure that was built on Ulrich's work rather than the four roles he actually wrote about, and knowing that distinction is worth a sentence in front of an HR director. **HR business partners (HRBPs)** are embedded with a business division as its strategic HR contact; they bring requirements framed as business problems rather than system specifications, and translating those into configuration is the consultant's job. **Centers of excellence (CoEs)** are specialist teams owning policy in a domain — compensation and benefits, talent acquisition, learning, organization development. The CoE typically signs off design in its domain: if the consultant designs a grade structure, C&B approves it. **Shared services**, or HR Operations, is the centralized team doing transactional work — payroll processing, data entry, first-line queries — for the whole organization.

In Egypt, shared services usually means the classic Personnel and Payroll team (شؤون العاملين): the people who handle social-insurance forms, labour-office files and attendance. They know the statutory reality better than anyone else in the building. Their daily work is what the configuration automates, they are the consultant's main day-to-day counterparts, and treating them as low-level administrators is a serious mistake — they hold operational knowledge no document captures.

[[lab:ulrich]]

Outside the large multinationals the three groups are usually merged rather than missing. One HR manager plays business partner and centre of excellence at once, payroll may report to Finance instead of to HR, and in the Gulf the teams that file on the government platforms — Qiwa, Mudad, Muqeem — are stakeholders in the design whether or not they appear on the HR organization chart. The model is therefore a checklist of questions rather than a prediction about the org chart, and the question it produces is worth asking by name in the first week: who signs this off, and who will run it every month?

## Who decides is not who knows

Two different questions get asked in every workshop, and confusing them is expensive. *Who decides* is a question about authority: pay and grades belong to compensation and benefits, hiring process to talent acquisition, structure to organization development. *Who knows* is a question about operational fact: how the insurable wage is really calculated, what the actual payroll cut-off is, which steps are done by hand in a spreadsheet today. Authority sits with the policy owners; the facts sit with the people running the process every month.

Routing a question to the wrong group produces one of two failures. Design approved by someone without the authority to approve it gets reversed in testing, usually after the build. Design based on policy documents alone, without the operational detail, passes testing and then fails in the first live run.

[[lab:who-decides]]

## Common mistakes

- Conflating headcount and FTE.
- Building a turnover report before agreeing the definition.
- Redrawing the org chart instead of fixing manager data.
- Routing approvals along the dotted line.

## Sources

- Dave Ulrich, *Human Resource Champions* (Harvard Business School Press, 1997) — the four-role argument (strategic partner, administrative expert, employee champion, change agent) that the three-part delivery structure was later built on.
- Oracle, *Using Global Human Resources* — manager hierarchies and organization charts. https://docs.oracle.com/en/cloud/saas/human-resources/
