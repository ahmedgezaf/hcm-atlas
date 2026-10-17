---
id: absence
num: 6
domain: hcm
track: functional
title: Absence Management
subtitle: Where labour law becomes configuration
hue: 98
minutes: 13
labs: leave
terms: absence-type, absence-plan, accrual-plan, qualification-plan, no-entitlement-plan, compensatory-plan, eligibility-profile, accrual-band, carryover, leave-encashment, work-schedule, absence-certification, accrual-processing
---

Absence is the module where a country's labour law turns into configuration. Every leave entitlement in the statute becomes an absence plan with rules, and every rule becomes a test script. The Egyptian annual-leave ladder is the classic accrual exercise; Egyptian sick leave is the classic qualification plan.

> **The Egyptian figures quoted here are statutory.** They are the entitlements under Labour Law No. 14 of 2025, stated in full with their sources in Chapter 10, and checked in 2026. Re-verify against the current text of the statute before configuring any of them.

## Types are what people see; plans are the rules

An **absence type** is what the worker actually selects when requesting leave — "Annual Leave", "Sick Leave", "Maternity Leave". It controls display and entry behaviour: whether half days are allowed, whether an end date is required, what documentation is needed. Every type must be associated with at least one plan. Clients describe requirements in terms of types ("we need a Hajj leave"); the consultant translates that into a type plus the plan behind it.

An **absence plan** is the rules engine behind the type: who is eligible, how entitlement is earned or granted, and how it is paid. Oracle defines six plan types, and naming all six is a small, cheap differentiator, because most beginners know only two:

- **Accrual** — workers accumulate time over a period for paid leave, such as a vacation plan.
- **Qualification** — workers qualify for an entitlement on an event and receive payments during the absence, with payment percentages that can vary by band.
- **No entitlement** — tracks absences without maintaining a balance or providing entitlement, typically unpaid leave.
- **Compensatory** — tracks earned compensatory time that can be taken as time off, instead of overtime pay.
- **Agreement** — plans built under statutory or collective-agreement rules.
- **Donation** — tracks donated time that a worker receives.

## Accrual plans and bands

An **accrual plan** accumulates leave over time, with rules for accrual rate, ceilings and carryover. Oracle supports front-loaded accrual (the whole year's entitlement granted at the start of the plan term) and incremental accrual (earned period by period). **Accrual bands** grant different rates to different populations, usually by length of service, because almost every real leave policy is tiered. Egyptian annual leave — 15 days in the first year, 21 from the second, 30 for workers with ten years of service or aged over 50, with higher entitlements again for persons with disabilities and for hazardous or remote work (Chapter 10) — is implemented directly as accrual bands. The boundary cases are the test cases: the person who crosses ten years mid-year and the person who turns fifty mid-year.

**Carryover** rules govern how much unused leave transfers into the next plan term and when it expires. Employers cap carryover to control liability and to encourage people to take leave, and carryover and expiry rules are a frequent source of client disagreement — pin them down in writing early. Egyptian law also imposes its own constraints (Chapter 10).

## Qualification plans

A **qualification plan** is used where entitlement is not earned day by day but triggered by an event and paid at rates that vary over the absence. Egyptian sick leave is the textbook case: 75% of the insurable wage for the first 90 days and 85% thereafter, up to 180 days in a calendar year, subject to medical certification. Those percentages are configured as qualification bands. Maternity leave is the other standard example, with its own cap on occurrences.

A **no-entitlement plan** exists because unpaid absence still needs to be recorded — for attendance, payroll deduction and reporting — even though nothing is earned or granted. A **compensatory plan** comes up whenever a client asks about time off in lieu.

## How an absence is actually recorded

A plan is only half the design. The other half is what happens when somebody asks for a day off.

An absence record carries a type, dates, a duration and a status, and it moves through approval like any other transaction (Chapter 19). The duration is where the configuration shows: it is calculated against the worker's **work schedule**, so a five-day absence spanning a weekend is not five days of leave, and a public holiday inside a leave period is not deducted from the balance — provided the calendar is configured (Chapter 10). A client whose schedules are wrong will report leave balances that are wrong in the same direction every time.

Two further settings matter in practice. Certification requirements hold an absence — or its payment — until a document is supplied, which is how Egyptian sick leave's medical certificate is enforced rather than hoped for. And the entry rules on the type decide whether half days are allowed, whether an end date is mandatory, and how far in the past or future a request can be made, which is the quiet cause of most "the system let them do that" tickets.

## The processes that keep balances true

Accrual balances are not recalculated continuously; they are maintained by processes, and knowing which ones exist is the difference between explaining a balance and guessing at it.

*Calculate Accruals and Balances* runs on a schedule and grants the period's entitlement to each enrolled worker. Carryover is applied at the plan's term end, with its own expiry rules. The absence liability and accrual balances can be valued for Finance, which is how the leave the company owes becomes a number on a balance sheet rather than an estimate.

The practical consequence is that a balance a user disputes has a history: the plan's enrolment date, the accrual runs since, the carryover event at the term end, and any manual adjustment. Checking those four in order answers the question. Adjusting the balance to the number the user expected, without reading them, hides the defect and guarantees its return next year.

## Where absence meets payroll

Absence is not a closed system: entitlement that is paid, unpaid or encashed has to reach payroll, and the connection is deliberate configuration rather than a side effect.

Absence elements carry the payment into the run — full pay, a reduced percentage for a qualification band, or an unpaid deduction — and a **rate definition** (Chapter 5) supplies the money the percentage applies to. Getting that base wrong is the most common absence-payroll defect in the region: Egyptian sick leave is paid on the insurable wage, not on gross, so a plan pointed at the wrong rate pays the right percentage of the wrong number and reconciles to nothing.

The other direction matters at exit. The balance at the termination date becomes the leave payout in the final settlement (Chapter 8), which is why an absence design that leaves balances approximate produces a settlement that is disputed.

## Eligibility profiles and encashment

An **eligibility profile** is a reusable set of criteria — grade, job, department, location, length of service — that decides whether a person qualifies for a plan: "employees in the Egypt legal employer with more than ten years of service" as the criterion for the 30-day band. Eligibility profiles appear in absence, benefits and compensation, so learning them once pays off three times.

**Leave encashment** pays out unused leave in cash instead of time off. It occurs at termination as part of the final settlement and periodically where policy or law allows. It is the link between absence and payroll: an absence balance becomes a payroll element on termination.

[[lab:leave]]

## Common mistakes

- Knowing only accrual and qualification plans. There are six.
- Building a flat annual entitlement when the law is tiered by service.
- Leaving carryover and expiry rules undocumented.
- Forgetting that casual leave in Egypt is counted within annual leave, not on top of it.
- Designing plans without configuring work schedules, so every duration is wrong by the same amount.
- Adjusting a disputed balance instead of reading how it was built.
- Pointing an absence payment at gross pay where the statute says insurable wage.
- Leaving balances approximate, then defending them in a final settlement.

## Sources

- Oracle, *Implementing Absence Management* — "Types of Absence Plans". https://docs.oracle.com/en/cloud/saas/human-resources/faiam/types-of-absence-plans.html
- Oracle, *Implementing Absence Management* — the "Accrual Absence Plans" chapter. https://docs.oracle.com/en/cloud/saas/human-resources/faiam/index.html
- Oracle, *Absence Management* datasheet. https://www.oracle.com/a/ocom/docs/applications/human-capital-management/absence-management-ds.pdf
