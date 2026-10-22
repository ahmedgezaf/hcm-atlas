---
id: costing
num: 21
domain: hcm
track: functional
title: Payroll Costing
subtitle: Where the payroll lands in Finance, and how Oracle decides which account
hue: 315
minutes: 12
labs: cost-hierarchy
terms: cost-allocation-key-flexfield, cost-hierarchy, costing-type, distributed-costing, offset-account, suspense-and-default-account, priority-account, transfer-to-subledger-accounting
---

Chapter 5 ends the payroll cycle at the bank file, and for the payroll team that is the end. For Finance it is the start. Every amount the run calculated — each earning, each deduction, each employer contribution — has to land in a general-ledger account, against the right company, cost centre and natural account, so that the month-end close shows what people cost and where. That is **costing**, and it is the part of a payroll design that the payroll team does not see until Finance rejects the journal.

Costing is set up inside payroll configuration, but it is a joint design. The account structure belongs to Finance; which salary goes where belongs to HR and the business; how the two meet is the payroll consultant's to configure. A costing workshop without the finance consultant in the room produces a design that has to be rebuilt.

## The account structure: the cost allocation key flexfield

Finance already has a chart of accounts: a string of segments such as company, cost centre, natural account and sometimes project or intercompany. Payroll does not invent its own. It mirrors that structure in the **cost allocation key flexfield**, which Oracle describes as the structure for the financial accounting of payroll costs. Each segment of the flexfield represents a part of the account number and is validated by a value set, and there is one flexfield per legislative data group — so an Egyptian and a Saudi payroll can cost against different ledgers.

The rule that matters most is alignment. The natural account segment in payroll must hold the same values as the natural accounts in the general ledger, or the journal that payroll sends is meaningless to the ledger that receives it. This is why the flexfield is designed against the finance team's chart of accounts, segment by segment, rather than drafted by HR and handed over.

## Where a value can come from: the cost hierarchy

A payroll result needs a value for every segment, and Oracle lets those values be set at many levels: the payroll as a whole, the element eligibility, the department, the location, the job, the position, the person, and the individual element entry. The engine resolves them through the **cost hierarchy**. It starts at the lowest level, the element entry, and works up towards the payroll, checking each level until it finds a value — and it does this separately for each segment.

That last point is the one most people get wrong. Costing is not "pick the most specific level and take its account". It is "for each segment, take the most specific level that has a value for that segment". A department can supply the cost centre while the element eligibility supplies the natural account and the payroll supplies the company, and the result is one account string assembled from three places.

Oracle's documented order for standard run results, from lowest to highest, is: element entry; person element at assignment level; person element at payroll-relationship level; person at assignment level; person at payroll-relationship level; position; job; location; department; costing eligibility on assignment attributes, which applies to distributed costing only; element eligibility; and payroll. The person-level settings follow the element: earnings are usually costed at the assignment level and most deductions at the payroll-relationship level, so which person level is consulted depends on how the element was defined.

[[lab:cost-hierarchy]]

Not every account type walks the whole ladder. Fixed-cost accounts look only at the element entry, the element eligibility and the payroll. Suspense and default accounts look only at the department and the payroll, the department taking precedence. Priority accounts are set on element eligibility. The offset account is set there too and is documented as not following a hierarchy at all — with one exception worth knowing, because the documentation carries both statements: costing eligibility rules on assignment attributes can supply an offset account for payroll-relationship-level elements, and that one sits above the element eligibility offset. Knowing which levels an account type reads is most of the skill in explaining a costing result.

## Costing types and accounts

Each element's eligibility carries a **costing type** that decides how its results are costed. A costed element follows the hierarchy above. A fixed-costed element takes its account from the short list of levels just described, which is how an amount that must always land in one place — a statutory accrual, say — is kept out of the department-driven logic. **Distributed costing** is for amounts that should follow other amounts: an employer liability is spread across the same accounts, in the same proportions, as a set of earnings elements. An employer social-insurance contribution (Chapter 9) distributed over the salary elements lands in each department in proportion to the salary charged there, which is what Finance means when it asks for "fully loaded" cost per department.

Every costed amount needs both sides of the entry. The **cost account** carries the expense or liability; the **offset account** carries the balancing entry, because the ledger is double-entry and a debit with no credit is not a journal. Two safety nets catch what the design misses. A **suspense account** receives results whose required segments are missing or whose account combination is invalid, and a **default account** receives what is left over when percentage splits do not add up to a hundred. A **priority account**, at the top, overrides the hierarchy entirely for an element and must have every segment populated; anything it does not cover is then built through the hierarchy as normal.

Payment costing has its own accounts — a payroll liability account per payment source, and cash and cash-clearing accounts tied to bank accounts — because the moment money leaves the bank is a separate accounting event from the moment it was earned.

## From the run to the ledger

Costing results are calculated by payroll, but they become accounting only when they leave it. Calculate Payroll costs its own run results as it calculates them; **Calculate Costing of Payments** is a separate process that costs prepayments and payments, because money leaving the bank is a separate accounting event from the amount being earned. Those transactions, with any partial-period accruals and retroactive costing, are sent on by **Transfer to Subledger Accounting**, which creates the accounting events. Subledger Accounting builds journal entries from them using rules the finance team owns, and **Create Final Accounting** posts those journals to the general ledger — there is a draft run first, which validates without posting. Only after the final run does Finance see payroll at all.

[[fig:cost-flow]]

The flow runs backwards too. If a run has been transferred but has to be corrected, the transfer is reversed before the run is touched — the same reverse-order unwinding as rolling back prepayments in Chapter 5. And labour distribution to projects, where a client uses Oracle Project Costing, imports payroll costs only after they have been transferred and accounted, which is why a project manager asking for "this month's labour cost" before the payroll close is asking for a number that does not exist yet.

## Reading a suspense balance

A suspense account with money in it is the costing design reporting its own gaps. The question is never "which account should this have gone to" in the abstract; it is which segment had no value, at which level the engine stopped looking, and which level should have supplied it. A new department created in core HR without its cost centre is the classic case: everybody hired into it is paid correctly and costed to suspense, and nobody notices until month end. Fixing the department fixes the next run. The results already in suspense are corrected by the transfer and accounting route above, not by editing the department and hoping.

## Common mistakes

- Designing the cost allocation flexfield without the finance consultant and the chart of accounts.
- Assuming the most specific level supplies the whole account, when the hierarchy is resolved segment by segment.
- Creating departments, jobs or positions in core HR with no costing, then discovering the gap in suspense at month end.
- Configuring a cost account with no offset, as if the ledger were single-entry.
- Expecting employer contributions to follow salary by department without setting them up as distributed.
- Correcting a costed run without reversing its transfer to Subledger Accounting first.
- Treating a non-empty suspense account as Finance's problem rather than a configuration defect.

## Sources

- Oracle, *Administering Global Payroll Costing* — "Cost Hierarchy". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/cost-hierarchy.html
- Oracle, *Administering Global Payroll Costing* — "Payroll Setup for Costing Accounts". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/payroll-setup-for-costing-accounts.html
- Oracle, *Administering Global Payroll Costing* — "Payroll Cost Allocation Key Flexfield Structure". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/payroll-cost-allocation-key-flexfield-structure.html
- Oracle, *Administering Global Payroll Costing* — "How Payroll Costing Components Integrate with Other Applications". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/how-payroll-costing-components-integrate-with-other-applications.html
- Oracle, *Administering Global Payroll Costing* — "Set Up Distributed Costing". https://docs.oracle.com/en/cloud/saas/human-resources/faipc/set-up-distributed-costing.html
- Oracle, *Administering Global Payroll Costing* — "Payroll Processes that Generate Costing Results", for which process produces which costing result. https://docs.oracle.com/en/cloud/saas/human-resources/faipc/payroll-processes-that-generate-costing-results.html
- Oracle, *Administering Global Payroll Costing* (full guide, PDF). https://docs.oracle.com/en/cloud/saas/human-resources/faipc/administering-global-payroll-costing.pdf
