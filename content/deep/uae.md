---
id: uae
minutes: 31
---

The UAE employs more Oracle HCM consultants than anywhere else in the region, and almost nothing in a Saudi implementation transfers to it unchanged. The gratuity formula is different, the wage-protection file is different, the pension covers a different population under a different authority, and the nationalization programme counts differently. A consultant who has done one Gulf country and assumes the second is a variation of it will design the wrong thing twice before anyone notices. This chapter is the UAE half of Chapter 17.

> **Every figure here moves, and the sources disagree more than usual.** The rules below were checked in 2026 against PwC, Mercans and law-firm summaries; the authorities are MOHRE for labour matters, GPSSA for pensions and Nafis for Emiratisation, and the official Arabic text governs. Free zones — the DIFC and ADGM especially — run their own employment regimes, which this chapter only sketches. Verify before configuring anything.

## Every contract is fixed-term now

Federal Decree-Law No. 33 of 2021 replaced the 1980 labour law and removed the distinction a generation of HR managers grew up with: there is no unlimited contract in the private sector any more. Every contract is fixed-term, renewable, and the renewals are where the administrative work lives.

That is a configuration statement, not a legal footnote. Contract end dates become data the system has to hold and act on, which means contract-expiry alerting is not an optional extra in a UAE implementation the way it is in an Egyptian one, and the lifecycle events of Chapter 8 acquire a route that Egypt does not have: expiry without termination. A client still using "limited" and "unlimited" in a requirements workshop is describing the superseded law, and the useful response is to ask when their contracts were last reissued rather than to configure the vocabulary they used.

The operational shape this creates is a renewal cycle running permanently in the background. Every employee has a date; every date needs a decision in advance; every decision produces either a renewal or an exit. The system's contribution is the alert and the task (Chapter 14), and the design question is the lead time — long enough for a manager to decide and for the paperwork to be done, which in practice is measured in months rather than weeks because the visa and permit renewal runs alongside it.

## Work models, probation and notice

The 2021 law also recognised a wider set of working arrangements than the one it replaced — alongside full-time employment, arrangements such as part-time, temporary and flexible work are contemplated, which is why a UAE implementation meets more assignment categories than an Egyptian one. For configuration this lands on the assignment category and the work schedule (Chapters 3 and 6) rather than on anything exotic.

Probation is capped at six months. The notice rules around it are reported inconsistently in the English-language material: a law-firm alert from the time of the reform describes a minimum notice during probation measured in days, while later guides quote a post-probation range measured in months. Those are most likely different situations rather than a contradiction — notice during probation and notice after it — but a consultant configuring a termination flow should take the figures from MOHRE or the client's counsel rather than from a guide, and should establish which period each number applies to.

What the system needs out of this is modest and specific: a probation end date that drives an alert and a confirmation transaction (Chapter 8), and notice periods held in a form that the termination transaction and the final settlement can read.

## The leave entitlements

The statutory floor is worth knowing because it sets the plan design (Chapter 6), and because UAE company policies frequently exceed it in ways that have to be configured deliberately rather than assumed.

**Annual leave** is 30 calendar days a year once a year of service is complete, with an accrual of two days a month for an employee who has between six and twelve months of service. Public holidays sit outside the balance, which is the same work-schedule and calendar-event design as everywhere else.

The phrase to notice is *calendar days*. A 30-calendar-day entitlement is not a 30-working-day entitlement, and a plan built in working days will be generous by roughly the number of weekends in the leave taken. This is one of the most common UAE absence defects and it is invisible until somebody compares a balance against the contract.

**Sick leave** is up to 90 days a year, paid on a tier: full pay for the first 15 days, half pay for the next 30, and unpaid for the remaining 45. The entitlement begins after probation. Notification within a short window and a medical report from the treating facility are part of the obligation, which makes this a qualification plan with certification requirements (Chapter 6) rather than a simple band plan.

**Maternity leave** is 45 days at full pay and 15 at half pay, with further unpaid leave available, and protections around dismissal in the period following. **Paternity leave** is five days.

The design mapping is the same exercise as Chapter 10 performs for Egypt: annual leave is an accrual plan in calendar days with a pro-rated first year, sick leave is a qualification plan with three payment bands and a certification requirement, maternity and paternity are qualification plans with occurrence handling, and the unpaid portions need somewhere to be recorded.

## The gratuity is not the Saudi one

The end-of-service gratuity under Article 51 is **21 days of basic wage for each of the first five years of service, and 30 days for each year after that**, payable to anyone with at least one year of continuous service and capped at two years' total wage. Unpaid absence does not count toward service, and the settlement falls due within fourteen days of the contract ending.

Three of those details differ from Saudi Arabia in ways that change the calculation, not just the number. The UAE accrues on **basic wage**, where the Saudi award in Chapter 17 is computed on the last wage as defined by that law — so the component split of the salary (Chapter 5) decides the UAE liability directly. The UAE applies a **cap** of two years' pay, which Saudi Arabia does not. And the UAE pays the full award on resignation after one year, where the Saudi scale reduces it below ten years of service. An EOSB element built for one country and reused in the other is wrong in at least three places.

Two further details decide whether a UAE gratuity calculation is right in practice.

**Unpaid absence does not count toward service**, which means the service figure fed into the formula is not simply the difference between two dates. Unpaid leave has to be tracked in a way the calculation can read and subtract — which is an argument for recording it properly in a no-entitlement plan (Chapter 6) rather than as an informal arrangement between a manager and an employee.

And the **basic wage** the accrual runs on is the basic at the relevant time, which makes the salary component design the single most consequential piece of configuration for this number. A client who holds one salary figure can produce a plausible gratuity and cannot defend it.

[[lab:gratuity]]

## The alternative savings scheme

Since 2023 employers may also join a voluntary **alternative end-of-service savings scheme**, paying monthly contributions into a regulated fund instead of accruing a lump sum on their own books. Where a client has joined it, the payroll design changes shape entirely: a monthly contribution element replaces an accrual and liability calculation, and the final settlement no longer carries the gratuity at all. Ask which model the client is on before designing either.

The question is not only "which model" but "from when, and for whom". A client who joins part-way through has employees with accrued entitlement under the old arrangement and contributions under the new one, which means both designs have to exist and the boundary date has to be held. And a scheme that applies to some categories of employee and not others makes it an eligibility question as well.

The reason this matters more than it first appears is that it changes what the final settlement contains, what the liability report says, and what the finance team expects to see every month. All three are things the consultant builds.

## GPSSA covers nationals; expatriates have the gratuity instead

Pension contributions through the General Pension and Social Security Authority apply to UAE nationals, and to other GCC nationals under the Gulf insurance-protection extension that Chapter 17 describes from the Saudi side. Expatriates are not in the pension system at all — the gratuity is their end-of-service provision, which is why the two subjects sit in one chapter here and in two places in a European implementation.

There are two contribution regimes, split by when the worker was first registered. Workers registered before November 2023 sit on the older scheme; those entering the workforce from the end of October 2023 fall under Federal Decree-Law No. 57 of 2023, whose total contribution is higher and whose split between employee and employer differs. Published summaries disagree on both the exact cutoff date and the current percentages, and a government subsidy can reduce the employer share at lower salaries, so the rates belong in a dated global value read from GPSSA's own published schedule rather than hard-coded into a formula — the mistake Chapter 12's lab is built around.

What matters structurally is the same point Chapter 17 makes about Saudi Arabia: nationality and registration date are payroll-driving attributes, not demographics. They decide which schedule applies, and a person record missing either produces a contribution that is quietly wrong rather than an error.

The government subsidy deserves one more sentence because it is unusual and easy to miss: where it applies, the employer's share is reduced at lower salary levels, which means the employer contribution is not a flat percentage of the wage across the whole population. A formula written as a single rate will be wrong for the people it is meant to help.

## The Wage Protection System, UAE edition

The UAE runs its own Wage Protection System through MOHRE and the Central Bank. Salaries are paid through approved agents and reported in a Salary Information File whose layout is a UAE layout — it is not the file Saudi Arabia's Mudad platform accepts, and the two countries' records are not interchangeable.

This is the single most common cross-Gulf mistake in a payroll design: treating "the Gulf WPS" as one requirement. It is one idea implemented separately per country, with its own file, its own agent, its own identifiers and its own rejection behaviour. A multi-country Gulf go-live needs one bank-file build and test cycle per country, with the real bank, every time (Chapter 5).

The identifiers are where the file most often fails, and they are worth checking during design rather than during testing. The file keys on employer and employee identifiers issued by the labour authority, not on the employee number the HR system uses, which means those identifiers have to be held on the record and migrated — the same lesson the Egyptian social-insurance number teaches in Chapter 9, in a different alphabet.

## Emiratisation, and what it asks of the data

**Emiratisation** is the UAE's nationalization programme, administered with the Nafis platform. Private-sector companies above the size threshold must raise the share of UAE nationals in skilled roles by a set amount each year, with monthly financial penalties for each unfilled position, escalating annually. Penalties for artificially satisfying the quota — hiring a national who does not genuinely work — are heavier again and sit under a separate decision.

For the consultant the mechanics matter less than what they require of the record: a trustworthy national identifier, an accurate nationality, a job that is correctly classified as skilled, and a reporting line that can produce the ratio on demand. Those are Chapter 2 and Chapter 13 problems wearing a compliance hat, and they are the ones to raise in design rather than in the month the first report is due.

Three structural points are consistent across the material and safe to design around. The target is measured on **skilled roles** rather than on total headcount, which makes job classification a compliance input. Progress is measured against **half-year milestones** rather than annually, so a client has two deadlines a year rather than one. And there are separate, smaller obligations for companies below the main size threshold in designated sectors, expressed as a required number of nationals rather than a percentage.

## What the published Emiratisation figures disagree about

Almost every specific number in the English-language guidance differs between sources, and a consultant should treat all of them as needing confirmation from MOHRE or Nafis.

The **annual increase** is described both as two percentage points a year split into two half-year steps, and as a target expressed as a cumulative percentage by a year end. The **mid-year milestone** is given as a specific percentage in one source and as "one percentage point of increase" in another. The **penalty** per unfilled position is most commonly reported at one figure rising by a fixed amount each year, but at least one source gives a different figure and a different start date. The **salary floor** for a national to count toward the quota is reported at two different levels. And the **Nafis support** available — salary top-ups and pension support — is quoted with different caps.

The reason to list the disagreements rather than pick one is practical as well as editorial. A client who is told they are compliant on the basis of a blog figure and is not compliant faces a monthly penalty per position; the cost of being wrong is immediate and recurring. The correct deliverable from the consultant is a system that produces the inputs accurately and a clear statement that the thresholds come from the authority.

## Free zones: a different employment law in the same city

The chapter's caveat says free zones run their own regimes; it is worth saying what that means for a design, because clients rarely raise it and it changes the answer.

Several free zones — the DIFC and ADGM most prominently — operate their own employment law, their own regulator and their own end-of-service arrangements, separate from the federal regime that governs mainland employment. In at least one of them the end-of-service gratuity has been replaced by a funded workplace savings arrangement into which employers contribute monthly, which is a different payroll design in the same way the federal alternative scheme is.

For the structures of Chapter 1 this means a free-zone entity is a separate legal employer with its own registrations, and for payroll it may mean separate elements, separate plans and separate calendars for its population. The question to ask in the first workshop is which law governs each entity's employment contracts, and the person who knows is the client's legal counsel rather than their HR manager.

The specifics of each free zone's regime are beyond this chapter and change; what a consultant needs is the instinct to ask, and the knowledge that "we are in the DIFC" is an answer with configuration consequences rather than an address.

## Where the structure differs

Mainland and free-zone entities answer to different regulators, which usually means separate legal employers, separate registrations and separate wage-protection arrangements, even when the group presents itself as one business. The parent-PSU shape from Chapter 1 is common here: several legal employers, one filing entity, one payroll relationship across them where the statutory unit is shared.

The practical question in the first workshop is therefore not "how many companies do you have" but "how many registrations do you file under, and with whom" — and the answer frequently surprises the client.

## A UAE configuration checklist

Pulling the chapter into the list a consultant would actually work through.

Hold the **contract end date** and alert on it, with a lead time that accommodates the visa renewal running alongside. Hold **nationality** and the **pension registration date** as payroll-driving attributes. Hold the **labour-authority identifiers** for employer and employee, because the wage file keys on them. Split **salary into components** so that basic wage is identifiable, because the gratuity runs on it. Record **unpaid absence** properly, because it reduces gratuity service. Classify **jobs as skilled or otherwise**, because Emiratisation is measured on them. Build **annual leave in calendar days**, sick leave as a three-band qualification plan with certification, and maternity and paternity with their own treatment. Decide which **end-of-service model** the client is on, and whether there is a boundary date between two of them. Build the **wage file** per country with the real bank, early. And establish, per entity, **which law governs** — federal or a free zone's.

Ten items, each of which is cheap to do at design time and expensive to retrofit.

## Common mistakes

- Reusing a Saudi end-of-service element in the UAE. Different accrual, different base, different cap, different resignation treatment.
- Building annual leave in working days when the entitlement is in calendar days.
- Ignoring that unpaid absence does not count toward gratuity service.
- Holding one salary figure, so the gratuity base cannot be identified.
- Assuming one Gulf WPS file. The UAE and Saudi Arabia have separate systems, formats and agents.
- Not migrating the labour-authority identifiers the wage file keys on.
- Treating "limited and unlimited contracts" as current. Every private-sector contract is fixed-term under the 2021 law.
- Alerting on contract expiry too late for the visa renewal to run alongside it.
- Putting expatriates into the pension scheme. GPSSA covers nationals; expatriates have the gratuity.
- Hard-coding pension percentages that change by registration date and by government subsidy.
- Writing the employer pension contribution as a flat rate where a subsidy reduces it at lower salaries.
- Designing one end-of-service model without asking whether the client has joined the savings scheme, or when.
- Quoting Emiratisation targets, penalties or salary floors from a guide rather than from MOHRE or Nafis.
- Treating Emiratisation as a reporting problem at go-live rather than a data-quality problem in design.
- Assuming a free-zone entity is governed by the federal labour law.

## Sources

- PwC Worldwide Tax Summaries, United Arab Emirates — "Other taxes", for social-security contributions and the national and GCC populations they cover. https://taxsummaries.pwc.com/united-arab-emirates/individual/other-taxes
- Mercans, "End of Service Gratuity (EOSG) in the UAE" — the Article 51 accrual, the one-year threshold and the two-year cap. https://mercans.com/glossary/uae-end-of-service-gratuity/
- Morgan Lewis, "United Arab Emirates Updates Federal Labour Law", for the 2021 reform including maternity leave and the probation notice position at the time. https://www.morganlewis.com/pubs/2021/12/united-arab-emirates-updates-federal-labour-law
- Zoho, "UAE Leave Entitlements", for the annual-leave accrual before one year and the statutory leave list. https://www.zoho.com/en-ae/payroll/academy/compliance/uae-leave-entitlements.html
- Federal Decree-Law No. 33 of 2021 on the Regulation of Employment Relationships, and Federal Decree-Law No. 57 of 2023 on pensions — the governing texts, published by the UAE government; the Arabic text governs.
- MOHRE for labour and wage protection, GPSSA for pension contribution schedules, and Nafis for current Emiratisation targets and penalties — the authorities to verify against before configuring.
