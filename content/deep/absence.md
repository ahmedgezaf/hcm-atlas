---
id: absence
minutes: 35
---

Absence is the module where a country's labour law turns into configuration. Every leave entitlement in the statute becomes an absence plan with rules, and every rule becomes a test script. The Egyptian annual-leave ladder is the classic accrual exercise; Egyptian sick leave is the classic qualification plan.

> **The Egyptian figures quoted here are statutory.** They are the entitlements under Labour Law No. 14 of 2025, stated in full with their sources in Chapter 10, and checked in 2026. Re-verify against the current text of the statute before configuring any of them.

Absence is also the module where a consultant's work is most visible to ordinary employees. Payroll is judged once a month by whether the number is right; leave is judged every time somebody looks at their balance. A balance that is wrong by half a day is noticed by everyone who has it, and the ticket that follows is rarely about half a day — it is about whether the system can be trusted.

## Types are what people see; plans are the rules

An **absence type** is what the worker actually selects when requesting leave — "Annual Leave", "Sick Leave", "Maternity Leave". It controls display and entry behaviour: whether half days are allowed, whether an end date is required, what documentation is needed. Every type must be associated with at least one plan. Clients describe requirements in terms of types ("we need a Hajj leave"); the consultant translates that into a type plus the plan behind it.

The relationship is not one to one, and that is the point of separating them. One type can draw on more than one plan, which is how an entitlement that comes from two sources — a statutory minimum plus a company supplement — appears to the employee as a single kind of leave. And one plan can sit behind several types where the rules are genuinely the same.

Above types sit **absence categories**, which group them for reporting, and beside them sit **absence reasons**, which record why. Both are cheap to configure during the build and expensive to add afterwards, and both are what make absence analysis possible later: "sick leave is up 12%" is an observation, while "sick leave with reason *work-related injury* is up 12% in one plant" is something a client can act on.

## The six plan types

An **absence plan** is the rules engine behind the type: who is eligible, how entitlement is earned or granted, and how it is paid. Oracle defines six plan types, and naming all six is a small, cheap differentiator, because most beginners know only two:

- **Accrual** — workers accumulate time over a period for paid leave, such as a vacation plan.
- **Qualification** — workers qualify for an entitlement on an event and receive payments during the absence, with payment percentages that can vary by band.
- **No entitlement** — tracks absences without maintaining a balance or providing entitlement, typically unpaid leave.
- **Compensatory** — tracks earned compensatory time that can be taken as time off, instead of overtime pay.
- **Agreement** — plans built under statutory or collective-agreement rules.
- **Donation** — tracks donated time that a worker receives.

The practical skill is mapping a client's sentence to the right one quickly. "They build up twenty-one days a year" is accrual. "They get ninety days at 75% when they are ill" is qualification. "They can take it unpaid, we just need it recorded" is no entitlement. "They work a public holiday and get a day back" is compensatory. Getting this right in the first workshop saves rebuilding a plan later, because the plan type is not something that can be changed once a plan is populated.

## Accrual plans: the term and the method

An **accrual plan** accumulates leave over time, with rules for accrual rate, ceilings and carryover. Two decisions shape everything else.

The **accrual term** is the period over which entitlement accumulates and at the end of which carryover happens. The delivered choices are a calendar year, an anniversary year — running from each worker's own hire or adjusted date — and a rolling term, which has no fixed start and instead calculates over the previous twelve months. Calendar year is the simplest to explain and to reconcile; anniversary year matches how many Gulf policies are actually written; rolling is what a client means when they say "in any twelve-month period", which is a phrase worth listening for because it changes the plan type of answer.

The **accrual method** is front-loaded or incremental. Front-loaded grants the whole term's entitlement at the start; incremental earns it period by period. The difference is invisible to a worker who stays all year and very visible to one who leaves in March — front-loaded means they have already been granted days they have not earned, and the policy has to say whether those are recovered at termination. That is a client decision with a money consequence, and it belongs in writing before the plan is built.

**Accrual bands** grant different rates to different populations, usually by length of service, because almost every real leave policy is tiered. Egyptian annual leave — 15 days in the first year, 21 from the second, 30 for workers with ten years of service or aged over 50, with higher entitlements again for persons with disabilities and for hazardous or remote work (Chapter 10) — is implemented directly as accrual bands.

The boundary cases are the test cases, and they are where a plan is proved or found wanting: the person who crosses ten years mid-year and the person who turns fifty mid-year. Both need an answer to the same question — does the higher band apply from the date they cross it, from the start of the term, or from the next term — and the answer is a policy reading of the statute rather than a system default. Write the three test cases before building the plan, and have the client confirm the expected number for each.

## Ceiling, carryover, expiry and vesting

Four limits shape what a balance is allowed to do, and they are frequently confused with one another.

A **ceiling** is the maximum a worker can hold. On an incremental plan the limit is applied in each accrual period, which means a worker at the ceiling simply stops accruing until they take leave — not that the excess is removed later.

**Carryover** is the maximum unused time that moves into the next accrual term. It is calculated by its own process at the end of the term, which works out how much is carried, when it is effective from and when it expires.

**Expiry** is what happens to carried time that is not used in time: it is forfeited. The arithmetic is worth stating because it is the one employees dispute. If ten days are carried with an expiry date, and the worker takes six days of leave before that date, six of the carried days are treated as used and the remaining four are lost. The rule is not "oldest first across the whole year" unless the plan is built to be, and a client who assumes one behaviour and gets the other has a balance they cannot explain to their own staff.

**Vesting** is a waiting period during which time accrues but cannot yet be used. It is how a probation rule is expressed properly — the entitlement builds from day one but cannot be taken until the period is served — rather than by delaying enrolment, which would quietly lose the entitlement.

Employers cap carryover to control liability and to encourage people to take leave, and carryover and expiry rules are a frequent source of client disagreement — pin them down in writing early. Egyptian law also imposes its own constraints (Chapter 10), and where a company policy is less generous than the statute, the statute wins and the plan has to reflect it.

## Part-time, joiners and the other proportions

Three populations break a plan that was designed only for a full-year, full-time employee.

A **part-time** worker's entitlement is usually proportionate, and the proportion comes from FTE or from the work schedule. The design question is whether the entitlement is expressed in days or in hours, and for a workforce with varied schedules, hours are almost always the honest unit — five "days" means something different to someone working three days a week, and a plan in days will be argued about forever.

A **mid-year joiner** needs a pro-rated first term, and a front-loaded plan needs an explicit rule for what they get on arrival. A **mid-year leaver** is the mirror image and the one with money attached, because the balance at termination becomes cash (below).

And **unpaid leave** inside a term raises the question of whether accrual continues during it. Statutes differ, company policies differ, and the two frequently disagree. This is one to ask rather than assume.

## Qualification plans

A **qualification plan** is used where entitlement is not earned day by day but triggered by an event and paid at rates that vary over the absence. Egyptian sick leave is the textbook case: 75% of the insurable wage for the first 90 days and 85% thereafter, up to 180 days in a calendar year, subject to medical certification. Those percentages are configured as qualification bands. Maternity leave is the other standard example, with its own cap on occurrences.

Two mechanics distinguish a qualification plan from an accrual one and are worth being precise about. The entitlement is measured against a **window** — a calendar year, a rolling period, or the life of the employment — and the window is what makes "180 days in a calendar year" enforceable. And the **bands** are read by duration into the absence rather than by service, so a single long absence can move through two or three payment rates while it is happening.

The thing that goes wrong is the interaction between the two. A worker who takes 100 days of sick leave, returns for a month and then takes another 100 within the same window is a case the configuration has to answer: do the bands restart, and does the window cap apply across both absences? The statute has a view; the client's HR policy may have a different one; and the plan will implement whichever one it is told to. Asking the question at design time is the whole job.

## The plans nobody configures until they are asked for

A **no-entitlement plan** exists because unpaid absence still needs to be recorded — for attendance, payroll deduction and reporting — even though nothing is earned or granted. It is the right home for unpaid leave, unauthorised absence, and anything the business wants to see on a calendar without attaching a balance to it.

A **compensatory plan** comes up whenever a client asks about time off in lieu. The design question is the expiry: compensatory time with no expiry is a liability that grows forever, and clients almost always intend an expiry without having written one down.

**Agreement** and **donation** plans are rarer in this region, but knowing they exist is what lets a consultant answer a collective-agreement question or a leave-donation request with "that is a plan type" rather than a flexfield.

## Eligibility profiles

An **eligibility profile** is a reusable set of criteria — grade, job, department, location, length of service — that decides whether a person qualifies for a plan: "employees in the Egypt legal employer with more than ten years of service" as the criterion for the 30-day band. Eligibility profiles appear in absence, benefits and compensation, so learning them once pays off three times.

The design advice is to keep them few and name them for what they mean rather than for where they are used. A profile called "Egypt employees over ten years' service" can be reused by the next plan that needs it; one called "Annual leave band 3" cannot, because nobody will trust that it means what it says.

## How an absence is actually recorded

A plan is only half the design. The other half is what happens when somebody asks for a day off.

An absence record carries a type, dates, a duration and a status, and it moves through approval like any other transaction (Chapter 19). Who may request it, who approves it and who can record or correct one on a worker's behalf is the three-seats question of Chapter 22. The duration is where the configuration shows: it is calculated against the worker's **work schedule**, so a five-day absence spanning a weekend is not five days of leave, and a public holiday inside a leave period is not deducted from the balance — provided the calendar is configured (Chapter 10). A client whose schedules are wrong will report leave balances that are wrong in the same direction every time.

Work schedules deserve more attention than they get on a regional project, for two reasons. The Gulf weekend has moved within living memory and is not the same across the region, so one group can need several schedules for what the business thinks of as "normal hours". And shift workers, rotations and compressed weeks each change what a day of leave costs, which means the schedule is part of the absence design rather than a piece of setup somebody does later.

Two further settings matter in practice. Certification requirements hold an absence — or its payment — until a document is supplied, which is how Egyptian sick leave's medical certificate is enforced rather than hoped for. And the entry rules on the type decide whether half days are allowed, whether an end date is mandatory, and how far in the past or future a request can be made, which is the quiet cause of most "the system let them do that" tickets.

Certification is worth one more sentence because clients under-use it. The configuration decides not only that a document is required but what happens when it does not arrive — the absence can be left pending, or its payment reduced or stopped. A client who has been chasing sick notes by email for years is usually delighted to discover the second option exists, and it changes the behaviour of the workforce within a quarter.

## The processes that keep balances true

Accrual balances are not recalculated continuously; they are maintained by processes, and knowing which ones exist is the difference between explaining a balance and guessing at it.

*Calculate Accruals and Balances* runs on a schedule and grants the period's entitlement to each enrolled worker. The carryover calculation runs at the plan's term end and works out what is carried, from when, and when it expires. The absence liability and accrual balances can be valued for Finance, which is how the leave the company owes becomes a number on a balance sheet rather than an estimate.

Two operational points follow. These processes belong on a schedule from day one, not run by hand, because a missed run shows up as a balance that stopped moving — which users report as a bug. And the term-end run is the busiest moment in the absence year: carryover, expiry and the new term's accrual all land together, and it is worth rehearsing once in a test environment before it happens for real.

## Reading a disputed balance

The practical consequence is that a balance a user disputes has a history: the plan's enrolment date, the accrual runs since, the carryover event at the term end, and any manual adjustment. Checking those four in order answers the question. Adjusting the balance to the number the user expected, without reading them, hides the defect and guarantees its return next year.

Add two more checks for the cases those four do not explain. Look at the work schedule, because a balance that is wrong by exactly the number of weekends in a period is a schedule problem. And look at the band the person is on, because a balance that is wrong by exactly the difference between two bands is a service-date problem — which is really a Chapter 3 problem wearing an absence costume.

## Where absence meets payroll

Absence is not a closed system: entitlement that is paid, unpaid or encashed has to reach payroll, and the connection is deliberate configuration rather than a side effect.

Absence elements carry the payment into the run — full pay, a reduced percentage for a qualification band, or an unpaid deduction — and a **rate definition** (Chapter 5) supplies the money the percentage applies to. Getting that base wrong is the most common absence-payroll defect in the region: Egyptian sick leave is paid on the insurable wage, not on gross, so a plan pointed at the wrong rate pays the right percentage of the wrong number and reconciles to nothing.

The integration is worth testing end to end rather than in halves. The test that proves it is a single worker, a single absence that crosses a band boundary, taken through a payroll run, with the payslip compared against a hand calculation the client agrees with in advance. If that one case is right, the configuration is right; if it is tested only as "the absence recorded correctly" and "payroll ran", nothing has been proved.

## Encashment and the final settlement

**Leave encashment** pays out unused leave in cash instead of time off. It occurs at termination as part of the final settlement and periodically where policy or law allows. It is the link between absence and payroll: an absence balance becomes a payroll element on termination.

The other direction matters at exit. The balance at the termination date becomes the leave payout in the final settlement (Chapter 8), which is why an absence design that leaves balances approximate produces a settlement that is disputed.

Two details decide whether that settlement is calm. The **rate** the balance is cashed at is a policy question — basic only, or basic plus allowances — and in the Gulf it frequently differs from the rate used for gratuity, which surprises people. And the **timing** matters: the balance has to be final before the settlement is calculated, which means the accrual run for the final period has to happen first. A settlement calculated before the last accrual is short by a few days, every time, for everybody.

## The liability number Finance wants

Unused leave is money the company owes, and at some point the finance director will ask what it is worth.

The valuation is a rate times a balance, and both halves are arguable: which rate, and whether the balance includes carried time that is about to expire. The useful thing a consultant can do is make the calculation explicit and repeatable rather than letting it become a spreadsheet somebody maintains privately. It is also an argument for keeping carryover and expiry rules tight, because a liability that grows every year is usually a sign that leave is not actually being taken — which is a workforce problem the number is quietly reporting.

## Regional shapes worth anticipating

A few requirements come up on nearly every Egyptian or Gulf project and are easier to plan for than to retrofit.

**Hajj leave** is a once-in-service entitlement, which means the plan has to track whether it has ever been taken rather than a per-year balance — a different shape from anything else in the design.

**Ramadan hours** reduce the working day for part of the year in much of the Gulf, which is a work schedule question rather than an absence one, but it lands on absence because it changes what a day of leave is worth during that period.

**Public holidays** are declared, sometimes at short notice, and sometimes differently for public and private sectors. The calendar needs an owner and a procedure for updating it mid-year, and a client without one will have leave durations that are wrong for the weeks around every announcement.

And across the Gulf, **annual leave entitlements and sick leave bands differ per country** while the company policy is often written once for the group. Where the two disagree, the statute of the country of employment governs, and the plan design has to be per legislation even when the policy document is not.

[[lab:leave]]

## Common mistakes

- Knowing only accrual and qualification plans. There are six.
- Choosing the wrong plan type for a requirement, and finding it cannot be changed once the plan is in use.
- Building a flat annual entitlement when the law is tiered by service.
- Not writing the band-boundary test cases before building the plan.
- Front-loading entitlement without deciding what happens when somebody leaves in March.
- Leaving carryover and expiry rules undocumented.
- Assuming carried days are used in a different order from the way the plan actually consumes them.
- Expressing part-time entitlement in days when the workforce works varied schedules.
- Delaying enrolment to model a probation rule, instead of using a vesting period.
- Forgetting that casual leave in Egypt is counted within annual leave, not on top of it.
- Designing plans without configuring work schedules, so every duration is wrong by the same amount.
- Leaving the holiday calendar without an owner in a region where holidays are announced at short notice.
- Requiring certification without configuring what happens when it never arrives.
- Running the accrual processes by hand, and reporting a stalled balance as a bug.
- Adjusting a disputed balance instead of reading how it was built.
- Pointing an absence payment at gross pay where the statute says insurable wage.
- Calculating a final settlement before the last accrual run.
- Leaving balances approximate, then defending them in a final settlement.

## Sources

- Oracle, *Implementing Absence Management* — "Types of Absence Plans". https://docs.oracle.com/en/cloud/saas/human-resources/faiam/types-of-absence-plans.html
- Oracle, *Implementing Absence Management* — the "Accrual Absence Plans" chapter, for accrual terms, methods, ceilings, carryover, expiry and vesting. https://docs.oracle.com/en/cloud/saas/human-resources/faiam/index.html
- Oracle, *Fast Formula* — the "Formulas for Absence Management" chapter, for what the carryover calculation returns. https://docs.oracle.com/en/cloud/saas/human-resources/oapff/index.html
- Oracle, *Absence Management* datasheet. https://www.oracle.com/a/ocom/docs/applications/human-capital-management/absence-management-ds.pdf
