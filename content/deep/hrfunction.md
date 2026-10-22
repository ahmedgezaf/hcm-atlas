---
id: hrfunction
minutes: 28
---

A consultant does not need HR theory, but does need to speak HR's language fluently enough that an HR director never has to slow down. This chapter covers the metrics that appear in every reporting conversation and the way large HR functions are organized, which explains who owns which decision.

There is a second reason this chapter earns its place in a technical atlas. Nearly every reporting dispute on an implementation is a definition dispute wearing a technical costume. The number is not wrong; the number answers a question nobody agreed on. A consultant who can run the definition conversation — numerator, denominator, date basis, population — resolves in twenty minutes what otherwise becomes three weeks of report revisions.

## Headcount is not FTE

**Headcount** is a raw count of people, regardless of how much each one works. One person equals one headcount. **FTE** — full-time equivalent — is a measure of workload rather than of people: an employee working half time is 0.5 FTE but still one headcount. A department with ten people, four of them half-time, has a headcount of ten and an FTE of eight. FTE is stored on the assignment.

Both numbers are "correct", and they answer different questions: legal thresholds, facilities and org design care about humans; budgeting and capacity planning care about work. Reporting FTE when the client asked for headcount, or the reverse, is a reliable source of reporting disputes. Ask which one they mean.

[[lab:fte]]

Underneath the simple definition sit three complications that decide whether two reports agree.

The first is **which records are counted**. Because FTE lives on the assignment, a person with two concurrent assignments has two FTE values and one person. A count of assignments is not a count of people, and in an organisation with any concurrent employment the two differ. The honest headcount is a distinct count of person identifiers, or a count filtered to primary assignments — and which of those two is used needs stating, because they differ again for anybody whose primary flag is wrong (Chapter 3).

The second is **who is in scope**. Contingent workers, pending workers and non-workers all have records. Whether they belong in headcount depends entirely on what the number is for: a facilities planner wants everybody who needs a desk, a finance director wants everybody on the payroll, and a labour-law threshold wants whatever the statute says. There is no default answer, only a stated one.

The third is **when**. A point-in-time headcount is the people active on a date. An average headcount over a period is a different calculation and is the right denominator for most rates. A client who compares a point-in-time figure with a period average and finds they disagree has not found a bug.

## Attrition, and why the first question is about arithmetic

**Attrition** or turnover is the rate at which people leave over a period, usually expressed annually as a percentage. Definitions vary — voluntary versus involuntary, whether to include probation leavers, what goes in the denominator — so the first question when a client asks for a turnover report is how they define the numerator and the denominator. That question alone marks a consultant as experienced.

Four decisions make a turnover figure, and the same raw data produces visibly different percentages depending on how they are made.

**The numerator.** All leavers, or only voluntary ones? Most organisations want both, separately, because they mean different things — voluntary attrition is a retention problem and involuntary attrition is a performance or restructuring story. Some go further and distinguish *regrettable* from *non-regrettable* leavers, which is a judgement the business makes rather than a field the system fills in, and therefore needs somewhere to be recorded. The action reason is that somewhere.

**The denominator.** Opening headcount, closing headcount, or the average of the two. Average is the most defensible and the least used, because it is the hardest to compute by hand — which is a good reason to build it once in the system rather than leaving it to a spreadsheet.

**The period and the annualisation.** A monthly rate multiplied by twelve is not an annual rate, and a rolling twelve-month figure is not the same as a calendar-year one. Whichever is chosen, the same one has to be used every time or the trend is meaningless.

**The population.** Does it include probation leavers, fixed-term contracts reaching their end date, retirements, deaths, transfers between group companies? Each of those is a leaver in the data and arguably not a leaver in the sense the business means.

The useful deliverable from this conversation is not a report. It is a one-page **metric definition** for turnover, signed by whoever will quote the number, stating all four decisions. Every subsequent dispute is then settled by reading the page.

## The metrics beyond headcount and turnover

A handful more come up often enough to recognise on sight.

**Span of control** is the average number of direct reports per manager, read from the manager hierarchy. It is the standard input to an organisational-design conversation, and it is only as good as the manager data.

**Absence rate** is time lost as a proportion of time available, and it inherits every complication of the absence chapter — whose schedule, which absence types, paid or unpaid.

**Internal mobility** is the share of roles filled from inside, which requires that moves carry the right action and reason or they cannot be distinguished from ordinary data corrections.

**Compa-ratio** is pay relative to the midpoint of a range, which only exists where grade rates exist (Chapter 2) and is the standard way a compensation team talks about whether people are paid correctly within a band.

**Time to fill** and **cost per hire** belong to recruiting and arrive with that module.

And in this region, the metric an executive asks about most often is the **nationalization ratio** — Saudization, Emiratisation — which is not an HR metric at all but a compliance one, assessed by the authority against its own definition of who counts and which establishment they belong to. The system's job is to produce the inputs accurately; the ratio itself is the regulator's arithmetic. Chapters 17 and 18 cover what each country counts. The mistake to avoid here is treating it as a report the client can define, when in fact the definition belongs to the ministry.

## The org chart is data, not a drawing

In Oracle the **org chart** is generated from manager relationships on assignments; it is not drawn separately. If the chart looks wrong, the underlying manager data is wrong — fix the data, not the picture.

Matrix organizations have two kinds of manager. **Solid-line** reporting is the formal line manager who owns performance and compensation decisions; **dotted-line** reporting is a secondary, functional relationship without that authority. A regional finance analyst may report solid-line to the country manager and dotted-line to the regional finance head. Approval routing usually follows the solid line, and getting it wrong sends approvals to the wrong person — which surfaces immediately in user acceptance testing.

The thing worth understanding properly is that the product holds **three different hierarchies**, and people conflate them constantly.

The **manager hierarchy** is built from the manager named on each assignment. It is the one the org chart draws, the one manager self-service reads, and the one most approval routing follows.

The **position hierarchy** is built from parent–child relationships between seats (Chapter 2), and in a position-managed organisation it can be what derives the manager in the first place.

The **department tree** is built from parent–child relationships between departments (Chapter 1), and it is what most data security profiles scope against (Chapter 15).

They are three different structures over the same organisation, they are maintained separately, and they drift apart unless somebody owns keeping them aligned. A very common incident — "my manager cannot see my absence request" — is one of these three being right and another being wrong.

## How HR is organized: the Ulrich model

Most large HR functions use the vocabulary of what everyone calls the **Ulrich model**, which splits HR into three parts. Strictly it is the three-legged delivery structure that was built on Ulrich's work rather than the four roles he actually wrote about, and knowing that distinction is worth a sentence in front of an HR director.

**HR business partners (HRBPs)** are embedded with a business division as its strategic HR contact; they bring requirements framed as business problems rather than system specifications, and translating those into configuration is the consultant's job. **Centers of excellence (CoEs)** are specialist teams owning policy in a domain — compensation and benefits, talent acquisition, learning, organization development. The CoE typically signs off design in its domain: if the consultant designs a grade structure, C&B approves it. **Shared services**, or HR Operations, is the centralized team doing transactional work — payroll processing, data entry, first-line queries — for the whole organization.

In Egypt, shared services usually means the classic Personnel and Payroll team (شؤون العاملين): the people who handle social-insurance forms, labour-office files and attendance. They know the statutory reality better than anyone else in the building. Their daily work is what the configuration automates, they are the consultant's main day-to-day counterparts, and treating them as low-level administrators is a serious mistake — they hold operational knowledge no document captures.

[[lab:ulrich]]

Outside the large multinationals the three groups are usually merged rather than missing. One HR manager plays business partner and centre of excellence at once, payroll may report to Finance instead of to HR, and in the Gulf the teams that file on the government platforms — Qiwa, Mudad, Muqeem — are stakeholders in the design whether or not they appear on the HR organization chart. The model is therefore a checklist of questions rather than a prediction about the org chart, and the question it produces is worth asking by name in the first week: who signs this off, and who will run it every month?

## What the model means for an implementation

The reason a technical consultant should care about an HR operating model is that it predicts, fairly reliably, where a project's friction will come from.

Where there are strong CoEs, design decisions are made well but slowly, and the risk is a sign-off chain with four links. The mitigation is to get the sign-off map agreed in week one and to put a decision log in front of it.

Where HR is one merged team, decisions are fast and the risk is the opposite: a decision made by someone who will not have to live with it, or a policy question answered by whoever happened to be in the room. The mitigation is to write decisions down and read them back.

Where payroll reports to Finance rather than HR — common in the region — the risk is that payroll requirements arrive late, because the HR stakeholders running the project do not own them. The mitigation is to invite the payroll manager to the structures workshop in Chapter 1, not to the payroll workshop in month three.

And where the client has a shared-services centre serving several countries, the operational design matters as much as the configuration: who can act on whose records is a security question (Chapter 15) and a personas question (Chapter 22), and it has to be answered per country because the statutory work differs.

## Who decides is not who knows

Two different questions get asked in every workshop, and confusing them is expensive. *Who decides* is a question about authority: pay and grades belong to compensation and benefits, hiring process to talent acquisition, structure to organization development. *Who knows* is a question about operational fact: how the insurable wage is really calculated, what the actual payroll cut-off is, which steps are done by hand in a spreadsheet today. Authority sits with the policy owners; the facts sit with the people running the process every month.

Routing a question to the wrong group produces one of two failures. Design approved by someone without the authority to approve it gets reversed in testing, usually after the build. Design based on policy documents alone, without the operational detail, passes testing and then fails in the first live run.

[[lab:who-decides]]

The practical form of this is a stakeholder map made in the first fortnight, with two columns rather than one. For each area of the design — structures, payroll, absence, security, reporting — name the person who signs it off and the person who does it today. They are rarely the same person, and the second name is usually missing from the project plan.

A third column is worth adding in this region: who files with the authority. The person who actually submits the social-insurance forms, uploads the WPS file or answers the labour inspector is a stakeholder in the design, is almost never invited, and is the one who will find the gap.

## Running a metrics workshop

Since this chapter is mostly about definitions, here is the method, because it is reusable and clients notice when it is used.

Start from the question rather than the report. "How many people do we have" is not a question; "how many people do we have for the purposes of the annual budget" is. The purpose determines the definition.

For each metric, settle four things and write them down: the **numerator** (which events or people count), the **denominator** (against what), the **date basis** (point in time, period average, rolling window), and the **population** (which worker types, which entities, which countries). Four lines per metric.

Then produce the number for a period the client already has an answer for, and reconcile. A metric that cannot be reconciled against something the business already believes is a metric nobody will trust, however correct it is.

And finally, agree where the number lives. A definition that exists only in a consultant's document is a definition that will be relitigated the first time somebody builds a different report. A definition built into a shared subject area, a published report or a dashboard is one the organisation keeps.

## Common mistakes

- Conflating headcount and FTE.
- Counting assignment rows and calling the answer headcount.
- Not saying which worker types are in scope, and producing two correct numbers that disagree.
- Comparing a point-in-time headcount with a period average and reporting a discrepancy.
- Building a turnover report before agreeing the numerator, the denominator, the date basis and the population.
- Multiplying a monthly turnover rate by twelve and calling it annual.
- Having no field in which a leaver can be recorded as regrettable, then being asked for the split.
- Treating a nationalization ratio as a metric the client can define, when the regulator defines it.
- Redrawing the org chart instead of fixing manager data.
- Confusing the manager hierarchy, the position hierarchy and the department tree, and never checking that they agree.
- Routing approvals along the dotted line.
- Writing a stakeholder map with one column, so the person who does the work every month is never asked.
- Leaving a metric definition in a project document rather than in the system that produces it.

## Sources

- Dave Ulrich, *Human Resource Champions* (Harvard Business School Press, 1997) — the four-role argument (strategic partner, administrative expert, employee champion, change agent) that the three-part delivery structure was later built on.
- Oracle, *Using Global Human Resources* — manager hierarchies and organization charts. https://docs.oracle.com/en/cloud/saas/human-resources/
- Oracle, *Implementing Global Human Resources* — department trees and position hierarchies, for the two structures that are not the manager hierarchy. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
