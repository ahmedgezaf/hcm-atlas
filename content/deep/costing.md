---
id: costing
minutes: 34
---

Chapter 5 ends the payroll cycle at the bank file, and for the payroll team that is the end. For Finance it is the start. Every amount the run calculated — each earning, each deduction, each employer contribution — has to land in a general-ledger account, against the right company, cost centre and natural account, so that the month-end close shows what people cost and where. That is **costing**, and it is the part of a payroll design that the payroll team does not see until Finance rejects the journal.

Costing is set up inside payroll configuration, but it is a joint design. The account structure belongs to Finance; which salary goes where belongs to HR and the business; how the two meet is the payroll consultant's to configure. A costing workshop without the finance consultant in the room produces a design that has to be rebuilt.

## Who owns what

It is worth stating the ownership explicitly at the start of a project, because the confusion is structural rather than personal.

Finance owns the **chart of accounts** and the accounting rules that turn payroll's output into journal entries. HR and the business own **where people sit** — the departments, positions and cost centres that decide whose cost lands where. The payroll consultant owns the **mapping** between them, and owns nothing on either side of it.

That means a costing design has three sign-offs and a single point of failure: a department created in HR with no cost centre breaks a Finance process that HR will never see. The control that prevents it belongs to neither party alone, which is why it tends not to exist.

## The account structure: the cost allocation key flexfield

Finance already has a chart of accounts: a string of segments such as company, cost centre, natural account and sometimes project or intercompany. Payroll does not invent its own. It mirrors that structure in the **cost allocation key flexfield**, which Oracle describes as the structure for the financial accounting of payroll costs. Each segment of the flexfield represents a part of the account number and is validated by a value set, and there is one flexfield per legislative data group — so an Egyptian and a Saudi payroll can cost against different ledgers.

The rule that matters most is alignment. The natural account segment in payroll must hold the same values as the natural accounts in the general ledger, or the journal that payroll sends is meaningless to the ledger that receives it. This is why the flexfield is designed against the finance team's chart of accounts, segment by segment, rather than drafted by HR and handed over.

Two design questions sit inside that alignment and are worth asking explicitly.

**Which segments does payroll actually need to supply?** Not every segment of the chart is payroll's business. Some are derived by Subledger Accounting from rules Finance owns, some are constant for payroll, and some genuinely vary per employee. Establishing which is which early reduces the flexfield to the segments that matter and reduces the number of places a value can go missing.

**Where do the values come from, and who keeps them current?** A segment validated against a value set that Finance maintains stays aligned; one validated against a copy of Finance's values drifts. Drift here does not produce an error — it produces an account combination the ledger rejects, a month after somebody restructured the chart.

## Where a value can come from: the cost hierarchy

A payroll result needs a value for every segment, and Oracle lets those values be set at many levels: the payroll as a whole, the element eligibility, the department, the location, the job, the position, the person, and the individual element entry. The engine resolves them through the **cost hierarchy**. It starts at the lowest level, the element entry, and works up towards the payroll, checking each level until it finds a value — and it does this separately for each segment.

That last point is the one most people get wrong. Costing is not "pick the most specific level and take its account". It is "for each segment, take the most specific level that has a value for that segment". A department can supply the cost centre while the element eligibility supplies the natural account and the payroll supplies the company, and the result is one account string assembled from three places.

Oracle's documented order for standard run results, from lowest to highest, is: element entry; person element at assignment level; person element at payroll-relationship level; person at assignment level; person at payroll-relationship level; position; job; location; department; costing eligibility on assignment attributes, which applies to distributed costing only; element eligibility; and payroll. The person-level settings follow the element: earnings are usually costed at the assignment level and most deductions at the payroll-relationship level, so which person level is consulted depends on how the element was defined.

[[lab:cost-hierarchy]]

The design instinct that follows is to **set each segment at the level where it is actually true**, and nowhere else. The company is true for the whole payroll, so set it there. The cost centre is true of the department, so set it there. The natural account is true of the element, so set it at element eligibility. Values set redundantly at several levels are not harmful in themselves, but they mean a change made at one level has no effect because a lower one is answering — which is the most confusing costing symptom there is.

## Which account types read which levels

Not every account type walks the whole ladder. Fixed-cost accounts look only at the element entry, the element eligibility and the payroll. Suspense and default accounts look only at the department and the payroll, the department taking precedence. Priority accounts are set on element eligibility. The offset account is set there too and is documented as not following a hierarchy at all — with one exception worth knowing, because the documentation carries both statements: costing eligibility rules on assignment attributes can supply an offset account for payroll-relationship-level elements, and that one sits above the element eligibility offset. Knowing which levels an account type reads is most of the skill in explaining a costing result.

The practical use of that list is diagnostic. When a costed amount has gone somewhere unexpected, the first question is what *type* of account it is, because that decides which levels were even consulted. Looking for a missing department value on a fixed-costed element is looking in a place the engine never read.

## Costing types

Each element's eligibility carries a **costing type** that decides how its results are costed.

A **costed** element follows the hierarchy above — the ordinary case, and the one that lets a department drive the cost centre.

A **fixed costed** element takes its account from the short list of levels just described, which is how an amount that must always land in one place — a statutory accrual, say — is kept out of the department-driven logic.

**Distributed costing** is for amounts that should follow other amounts: an employer liability is spread across the same accounts, in the same proportions, as a set of earnings elements.

The choice is not cosmetic and is hard to change late, because it determines which configuration levels matter for that element. Making it deliberately, element by element, during design is the work; discovering it from a suspense balance is the alternative.

## Distributed costing, worked

Distributed costing deserves a worked explanation because it is the mechanism behind the single most common request Finance makes, and because the request is usually phrased in a way that hides what it asks for.

An employer social-insurance contribution (Chapter 9) is one amount for one person. Finance does not want it in a single central account; they want it charged to the departments that employ the people, in proportion to the salary charged there. That is "fully loaded cost per department", and it is exactly what distribution does: the liability is spread across the same accounts, in the same proportions, as the earnings elements it is distributed over.

The configuration therefore needs two things rather than one: the element marked as distributed, and a **distribution group** naming which earnings it follows. Getting the group wrong is the error that is hardest to see, because the total is always right — the full liability is always allocated — and only the split is wrong. A liability distributed over basic salary only, where the client intended basic plus allowances, produces departmental costs that are plausible, consistent and incorrect.

The test that catches it: take one person whose earnings are split across two cost centres and check that their employer contribution splits in the same ratio. One person, two numbers, five minutes.

## The accounts that catch what the design misses

Every costed amount needs both sides of the entry. The **cost account** carries the expense or liability; the **offset account** carries the balancing entry, because the ledger is double-entry and a debit with no credit is not a journal.

Two safety nets catch what the design misses. A **suspense account** receives results whose required segments are missing or whose account combination is invalid, and a **default account** receives what is left over when percentage splits do not add up to a hundred. A **priority account**, at the top, overrides the hierarchy entirely for an element and must have every segment populated; anything it does not cover is then built through the hierarchy as normal.

The right attitude to the safety nets is that they exist so that a payroll can complete, not so that a design can be incomplete. A suspense account is a diagnostic, and a non-empty one is a defect report (below). A client whose suspense account carries a balance every month has a configuration gap they have learned to live with, and the cost of living with it is that nobody can trust the departmental numbers.

## Payment costing

Payment costing has its own accounts — a payroll liability account per payment source, and cash and cash-clearing accounts tied to bank accounts — because the moment money leaves the bank is a separate accounting event from the moment it was earned.

The accounting shape is worth holding, because it explains why there are two processes and three accounts. When payroll calculates, the cost is recognised as an expense and a liability. When the payment is made, the liability is cleared and cash leaves. The cash-clearing account sits between the two for the period where the payment has been issued but not yet reconciled against the bank statement. Each of those is a real accounting state, which is why Finance asks for all three.

## Partial period accruals

A payroll period that straddles a month end creates a problem Finance cares about and payroll does not: part of the cost belongs to the closing month, and the run that will calculate it has not happened yet.

*Calculate Partial Period Accruals* estimates it. It uses the costs from a previous payroll period as the basis for the estimate, and prorates on calendar days — the proportion from the start of the payroll period to the process date supplied. Its two date parameters do the work: a previous period date selects the reference period, and the process date is the accounting date of the estimate, which should be the end date of the accounting period being closed.

The estimate is then unwound rather than left in place. The transfer to Subledger Accounting creates an accrual event at the process date and a matching reversal event, and when the real costs are calculated the payroll run's costing creates the actual entries and reverses the accrual. The accounting date used for the reversal is governed by a payroll process configuration setting that selects between the date earned and the process date, falling back to the payroll period end date where a date earned is not defined.

Oracle's own documentation is not entirely consistent on which end date the reversal lands on — some pages describe the process end date and others the payroll period end date — so the configuration setting should be checked in the client's own environment rather than assumed. That check is a ten-minute job and it is the difference between a clean close and an accrual that reverses in the wrong month.

The month-end shape Oracle suggests is a flow of its own: calculate the partial period accruals, cost the payments that have reconciled by month end, and distribute the accounting for the results. Building that as a named flow (Chapter 5) rather than a list of processes somebody remembers is the same argument as for the payroll cycle itself.

## From the run to the ledger

Costing results are calculated by payroll, but they become accounting only when they leave it. Calculate Payroll costs its own run results as it calculates them; **Calculate Costing of Payments** is a separate process that costs prepayments and payments, because money leaving the bank is a separate accounting event from the amount being earned. Those transactions, with any partial-period accruals and retroactive costing, are sent on by **Transfer to Subledger Accounting**, which creates the accounting events. Subledger Accounting builds journal entries from them using rules the finance team owns, and **Create Final Accounting** posts those journals to the general ledger — there is a draft run first, which validates without posting. Only after the final run does Finance see payroll at all.

[[fig:cost-flow]]

The draft run is the step teams skip and the one worth insisting on. It validates the accounting without posting it, which means a wrong account combination or a missing segment surfaces while it can still be fixed quietly — rather than as a reversal in a closed period, which is a conversation with the financial controller.

The flow runs backwards too. If a run has been transferred but has to be corrected, the transfer is reversed before the run is touched — the same reverse-order unwinding as rolling back prepayments in Chapter 5.

## Retro costing and adjustments

Two things generate costing results outside the ordinary run, and both are easy to leave out of a month-end design.

**Retroactive costing** is calculated by its own process rather than falling out of the payroll run (Chapter 4). A month in which retro was processed and retro costing was not is a month where HR's figures and Finance's disagree by exactly the arrears.

**Balance adjustments** are costed too, which matters because an adjustment made to fix a balance is also an accounting event. A correction keyed quietly at month end and not costed is a reconciliation difference the following month.

Both belong on the month-end checklist rather than in anybody's memory.

## Reading a suspense balance

A suspense account with money in it is the costing design reporting its own gaps. The question is never "which account should this have gone to" in the abstract; it is which segment had no value, at which level the engine stopped looking, and which level should have supplied it. A new department created in core HR without its cost centre is the classic case: everybody hired into it is paid correctly and costed to suspense, and nobody notices until month end. Fixing the department fixes the next run. The results already in suspense are corrected by the transfer and accounting route above, not by editing the department and hoping.

The preventive control is better than the diagnostic one and costs almost nothing: a check, run after every payroll and before the transfer, that the suspense account is empty — and a check on the HR side that every department, position and job carries the costing it needs before anybody is hired into it. The second one is really a data-quality rule on Chapter 1's objects, and it is the kind of thing a journey or an alert can enforce (Chapter 14).

## Reconciling payroll to the ledger

The reconciliation that proves costing works has three layers, and a month-end that checks all three never produces a surprise.

**Payroll to costing**: the total of the run results equals the total of the costing results. If these disagree, something was not costed.

**Costing to the transfer**: everything costed was transferred. If these disagree, a process did not run or ran for the wrong population.

**The transfer to the ledger**: everything transferred was accounted and posted. If these disagree, the accounting rules rejected something, and the draft run should have caught it.

Each is a total compared with a total, each is available from the delivered reports, and each isolates a different failure. A client whose month-end consists of "the number looks about right" has none of them, and the first time it is materially wrong nobody will be able to say where.

## Designing costing: the method

The workshop that produces a costing design has a shape, and it is not the one people expect.

Start from the **chart of accounts**, with Finance in the room, and establish which segments payroll must supply. Then take the **element list** (Chapter 5) and, for each element, ask three questions: what natural account does this belong to, does it follow the person's department or land somewhere fixed, and does it need to be distributed over other elements. Most elements answer in seconds; the interesting ones are the employer liabilities and anything statutory.

Then decide **where each segment is set** — the level-of-truth principle above — and write that down as a short table of segment against level. That table is the design.

Then agree the **safety nets**: the suspense and default accounts, who watches them, and what happens when they are not empty.

And finally agree the **month-end sequence**, with owners: the payroll processes, the partial period accrual if the calendar needs one, the transfer, the draft accounting, the checks, and the final accounting.

## Testing costing

Costing is testable and is routinely untested, because it sits downstream of the thing everybody is watching.

The minimum pack: one employee in a department with a cost centre; one in a department without, to prove suspense behaves; one element that is fixed costed; one employer liability that is distributed, checked against a person whose earnings split across two cost centres; a retro case; and a period that straddles a month end if the client's calendar does that. Each with the expected account string worked out in advance with Finance.

And then the reconciliation above, run on the test data, because the reconciliation is itself a deliverable that has to work.

## Multi-country and project costing

Two extensions come up often enough to anticipate.

A **multi-country group** has a cost allocation flexfield per legislative data group, which means the design in this chapter is repeated per country. Where the countries post to different ledgers that is straightforward; where they post to one, the company segment and the currency treatment become a Finance design question rather than a payroll one, and it needs answering before the second country is configured.

**Project costing**, where a client uses Oracle Project Costing, imports payroll costs only after they have been transferred and accounted — which is why a project manager asking for "this month's labour cost" before the payroll close is asking for a number that does not exist yet. That timing is worth stating to the project team early, because the expectation it sets is otherwise set by somebody's spreadsheet.

## Common mistakes

- Designing the cost allocation flexfield without the finance consultant and the chart of accounts.
- Validating a segment against a copy of Finance's values rather than Finance's own.
- Assuming the most specific level supplies the whole account, when the hierarchy is resolved segment by segment.
- Setting the same segment at several levels, so a change at one of them does nothing.
- Looking for a missing department value on a fixed-costed element, which never reads it.
- Distributing a liability over the wrong element group, so the total is right and every department is wrong.
- Creating departments, jobs or positions in core HR with no costing, then discovering the gap in suspense at month end.
- Configuring a cost account with no offset, as if the ledger were single-entry.
- Expecting employer contributions to follow salary by department without setting them up as distributed.
- Treating the suspense account as a feature rather than a diagnostic.
- Skipping the draft accounting run, and finding the bad account combination after posting.
- Forgetting retroactive costing and the costing of balance adjustments at month end.
- Assuming which date a partial period accrual reverses on, rather than checking the configuration.
- Correcting a costed run without reversing its transfer to Subledger Accounting first.
- Reconciling with one total instead of three, so a difference cannot be located.
- Treating a non-empty suspense account as Finance's problem rather than a configuration defect.

## Sources

- Oracle, *Administering Global Payroll Costing* — "Cost Hierarchy". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/cost-hierarchy.html
- Oracle, *Administering Global Payroll Costing* — "Payroll Setup for Costing Accounts". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/payroll-setup-for-costing-accounts.html
- Oracle, *Administering Global Payroll Costing* — "Payroll Cost Allocation Key Flexfield Structure". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/payroll-cost-allocation-key-flexfield-structure.html
- Oracle, *Administering Global Payroll Costing* — "Partial Period Accruals", for the estimate, its date parameters and the reversal. https://docs.oracle.com/en/cloud/saas/human-resources/faipc/partial-period-accruals.html
- Oracle, *Administering Global Payroll Costing* — "How Payroll Costing Components Integrate with Other Applications". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/how-payroll-costing-components-integrate-with-other-applications.html
- Oracle, *Administering Global Payroll Costing* — "Set Up Distributed Costing". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/set-up-distributed-costing.html
- Oracle, *Administering Global Payroll Costing* — "Payroll Processes that Generate Costing Results", for which process produces which costing result. https://docs.oracle.com/en/cloud/saas/human-resources/faipc/payroll-processes-that-generate-costing-results.html
- Oracle, *Payroll Reports* — "Payroll Costing Results Report". https://docs.oracle.com/en/cloud/saas/human-resources/faprr/payroll-costing-results-report.html
- Oracle, *Using Common Features for HCM* — "Payroll Process Configuration Parameters", for the accounting date used when accruals reverse. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/payroll-process-configuration-parameters.html
- Oracle, *Administering Global Payroll Costing* (full guide, PDF). https://docs.oracle.com/en/cloud/saas/human-resources/faipc/administering-global-payroll-costing.pdf
