---
id: egypt-leave
minutes: 35
---

Labour Law No. 14 of 2025 replaced the 2003 law and took effect on 1 September 2025. Its leave provisions are the direct input to absence-plan design (Chapter 6). This chapter states the entitlements and the design implications; the exit and probation rules live in Chapter 8.

> **Every figure in this chapter moves.** The entitlements were checked in 2026 against the EY, Andersen and Amereller summaries below, and the executive regulations and ministerial decisions implementing the law continue to appear. Professional summaries also disagree with each other on several points, which are flagged where they arise. Re-verify against the Arabic text of the statute, or the client's legal counsel, before configuring an entitlement.

A word about how to use a chapter like this. Statutory content ages, and the honest way to present it is with every claim attached to a source and every disagreement visible. What does *not* age is the method: which entitlement becomes which kind of plan, which rules are eligibility and which are limits, which requirements are not leave at all, and how to pin a disputed figure down before building on it. The figures below will need re-checking. The mapping will not.

## What changed, and why older material misleads

The 2003 law governed Egyptian employment for two decades, which means most of the written material a consultant will find — training notes, blog posts, a previous implementation's design document — describes it rather than the current statute. Several of the changes are small enough to pass unnoticed and large enough to produce a wrong configuration.

Casual leave moved from six days to seven. The withdrawal window for a resignation moved from seven days to ten (Chapter 8). Maternity leave's qualifying-service requirement was removed, so the entitlement applies from the first day. Paternity leave is new. Probation can no longer be extended, and a worker can be placed on it only once with the same employer. And fixed-term contracts now convert to indefinite ones on renewal or continuation.

The practical instruction: when a client hands over a leave policy document, check its date before reading it. A policy written against the 2003 law is not a statement of what the client must do; it is a statement of what they used to do, and part of the consultant's job is to say so.

## Working hours and rest, which is the frame leave sits in

Leave is measured against working time, so the working-time rules decide what a day of leave is worth (Chapter 6).

The official translation of the law caps actual work at eight hours a day or forty-eight a week, excluding meal and rest breaks; requires breaks totalling at least an hour, with no more than five consecutive hours worked; caps total daily presence at the workplace at ten hours; and requires a weekly rest of at least twenty-four continuous hours after no more than six consecutive working days, fully paid.

Two notes belong with that. The ten-hour presence cap and the twelve-hour figure that appears in overtime discussions are different limits described in different places, and a consultant quoting either should know which they mean. And secondary guides disagree with the official translation on article numbering, which is a reliable sign that a guide has been written from another guide rather than from the statute.

For configuration, these rules land in the work schedule rather than in an absence plan, and the schedule is what converts a leave request into a number of days (Chapter 6). A client whose schedules do not reflect the actual pattern of work will have leave balances that are wrong in a consistent direction, and the diagnosis will look like an absence problem.

## Annual leave: a ladder by service and age

The statutory ladder is 15 days during the first year of service (pro-rated where service exceeds six months but is under a year); 21 days from the second year; 30 days for workers with ten years of service or aged over 50; 45 days for persons with disabilities; plus 7 additional days for hazardous, arduous or remote-area work. Annual leave excludes official and weekly holidays.

The two upper tiers are worth reading carefully, because they are *alternatives*, not a sequence: thirty days is reached either by ten years of service **or** by age, whichever arrives first. A plan built only on service length under-pays an employee who joined at forty-eight, and that employee is exactly the one who knows the law.

Two of the tiers also depend on facts the HR system may not hold. "Persons with disabilities" is a status that has to exist on the record, with whatever documentation the client's policy requires, before a plan can band on it — and it is personal data that deserves thought about who can see it (Chapter 15). "Hazardous, arduous or remote-area work" is an attribute of the job or the location rather than of the person, which means it is a job classification or a location flag (Chapters 1 and 2) feeding an eligibility profile. Neither is difficult; both are forgotten until the band does not fire.

The best practice exercise for accrual bands is to build this ladder and then test the two boundary cases: the person crossing ten years mid-year and the person turning fifty mid-year. Add a third: the person who moves into a hazardous role in June.

## The two rules that shape carryover

Two further rules shape the plan, and they are limits on the employer rather than entitlements for the employee.

The worker must take at least 15 days a year, **including six consecutive days**. That is a minimum consumption rule, and it has no natural home in a leave plan — it is a reporting and management obligation. The useful implementation is a report of who has not met it with enough of the year left to fix it, rather than a system block nobody can override.

And the employer must settle the leave balance or pay its cash equivalent **at least every three years**. This is the carryover and expiry rule in disguise, and it sets an outer bound: a design that lets a balance accumulate for five years is not compliant however generous it looks. Translating it into configuration means a carryover cap, an expiry, or a periodic encashment — and the client's choice between those three should be made with their counsel, because it is a legal position rather than a preference.

[[fig:egypt-leave-ladder]]

## Casual leave

**Casual leave** covers unforeseen circumstances: a maximum of 7 days per year (up from 6 under the old law), no more than 2 consecutive days at a time, and — the detail that gets missed in design and surfaces in UAT — counted within the annual-leave entitlement rather than on top of it.

In configuration that makes casual leave an absence *type* drawing on the annual plan with its own rules, not a second plan with its own balance. Build it as a separate accrual and the employee's entitlement is overstated by seven days, the liability reported to Finance is wrong by the same amount, and nothing in the system objects.

The two-consecutive-day limit is an entry rule on the type rather than a plan rule, and it is the kind of constraint that is much better enforced than remembered — a client whose casual leave is taken in week-long blocks has, in effect, no casual leave policy.

## Sick leave

**Sick leave** is paid at rates that vary by duration and is governed by the social-insurance law: for generally insured workers, 75% of the insurable wage for the first 90 days and 85% thereafter, up to 180 days in the same calendar year, subject to medical certification. Industrial establishments have a stronger schedule under labour law, and employers offset amounts already paid by NOSI. In Oracle this is a textbook qualification plan with payment bands.

Three details decide whether the plan behaves: the percentages attach to the **insurable wage** (Chapter 9), not to gross pay, so the plan needs a rate definition pointing at the right base; the 180-day cap is per calendar year rather than per occurrence, so a worker with three separate absences shares one ceiling; and the certification requirement is a document the absence record should carry, because the payment is defensible only if the certificate exists.

A fourth detail decides whether it is *defensible*: the bands are read by cumulative days within the window, not by days within the current absence. A worker who takes 80 days, returns, and takes another 30 later in the same calendar year has crossed the 90-day boundary during the second absence, and the plan has to know that. Testing this requires two absences in one year rather than one long one, which is why it is so often missed.

## The offset against what the insurance pays

The employer offsets amounts already paid by NOSI, and that offset is where the design gets practical rather than statutory.

What it means operationally is that the employee's sick pay has two sources — the insurance and the employer — and the employer's payroll has to account for both so that the employee receives the right total and the company is not paying twice. How the client handles it today is the thing to establish: some employers pay in full and reclaim, some pay only their share, some pay in full and never reclaim because nobody has the time.

Each of those is a different element design. Paying in full and reclaiming needs an element for the gross payment and a receivable tracked outside payroll. Paying only the employer share needs the insurance portion computed and excluded. And the third needs somebody to tell the finance director what it is costing, which is a conversation the consultant can start by producing the number.

## Maternity, nursing and the pay nobody agrees on

**Maternity leave** is four months, covering the period before and after the birth, with no less than 45 days falling after it. It is capped at three occurrences during the employee's service, and the old requirement of ten months' service before qualifying has gone — the entitlement applies from the first day.

How it is *paid* is where the sources genuinely disagree. Some summaries describe full pay from the employer; others describe payment at a percentage of the insurable wage through social insurance, with the employer topping up or offsetting what NOSI pays. The two readings produce different elements and different costs, so this is a question for the client's counsel and their insurance office rather than one to settle from a summary — and it belongs in the configuration workbook with the answer attributed.

The occurrence cap deserves its own note because it is the kind of rule that is documented and not enforced. Three occurrences across an entire period of service is not something a leave balance tracks naturally; it needs a counter that persists across years and survives a rehire, and the design has to say what happens on the fourth request — blocked, warned, or routed to HR. Leaving it as a policy sentence means it will be exceeded, quietly, and discovered during an audit.

Around the birth the law also constrains the working day rather than granting leave. A pregnant employee's daily hours must be reduced by at least an hour from the sixth month, and overtime may not be required during pregnancy or for six months after the birth. For two years after the birth, **nursing breaks** of two periods of at least thirty minutes a day are paid and counted as working time.

None of those three is an absence plan. The hour reduction and the nursing breaks are working-time rules, which means a work schedule change or an information element rather than a leave balance, and the overtime prohibition is a validation on the overtime element. Clients routinely ask for all three as "leave types", and building them that way produces balances that mean nothing.

It is worth having the alternative ready when the request comes, because "no" on its own is unhelpful. The pregnancy hour is a dated change to the work schedule with an end date. The nursing breaks are the same, for two years. The overtime prohibition is a rule on the element or a validation at entry. All three are then visible, enforceable and reportable — which is what the client actually wanted when they asked for a leave type.

## Paternity and childcare

**Paternity leave** is new: one paid day on the date of the birth, outside the annual balance, available up to three times. Sources differ on whether the limit counts births or occasions; the practical configuration is an absence type with an occurrence cap, and the cap value confirmed in writing.

Unpaid **childcare leave** of up to two years is available in establishments of fifty or more employees, after a year of service, up to three times, with at least two years between the first and the second. Every one of those four conditions is an eligibility rule, and a plan that enforces the duration but not the spacing will approve leave the law does not grant.

The establishment-size condition is the interesting one, because it is a property of the employer rather than of the employee, and it can change. A client who grows past fifty employees in one entity acquires the obligation; one who shrinks below it does not automatically lose it for people already on leave. The configuration answer is an eligibility criterion at legal-employer level that somebody reviews, rather than a hard-coded assumption made on the day the plan was built.

## Pilgrimage leave

Pilgrimage leave is the entitlement most often asked about in the region and the one this atlas could least confirm from the statute.

Secondary sources describe a once-in-service, fully paid leave to perform the Hajj — but they disagree on the terms. One describes up to one month after five years of continuous service; another describes it with no service threshold at all. The provision could not be confirmed in the official translation consulted for this chapter.

That is not a reason to leave it out of a design; it is a reason to pin it down before building. The configuration shape is clear whichever way the terms fall: a plan with a once-in-service occurrence cap and, if there is a threshold, an eligibility profile on length of service. What has to come from the client's counsel is the duration and the threshold, in writing, in the configuration workbook.

The once-in-service shape is worth noting as a pattern because it recurs. Like the maternity occurrence cap, it is not a per-year balance; it is a fact about the person's whole employment, and it has to survive a rehire or it is not the rule the statute describes.

## Public holidays, and the premium for working one

Official holidays and the weekly rest do not count against annual leave. Where a worker is required to work on one, the law provides a premium — commonly summarised as double pay plus a compensating day off — and the number of official holidays itself varies between summaries, which is a reason to take the client's published calendar as the source rather than a secondary list.

In Oracle the calendar is not an absence plan either. Holidays belong to the work schedule and the calendar event, which is what keeps them out of leave balances automatically, and the premium is an earnings element driven from the time card (Chapter 5).

The calendar needs an owner, because Egyptian and regional public holidays are confirmed by decision rather than being fixed years in advance, and some move with the lunar calendar. A holiday announced a week ahead and not entered produces leave durations that are wrong for everybody who takes leave that week. The operational answer is a named person, a documented procedure, and a check at the start of each year plus a standing item whenever an announcement is made.

## Overtime, and the two ways the premium is quoted

A point of confusion worth settling, because both versions appear in writing and a consultant who does not notice will build the wrong element.

The official translation describes the overtime premium as 35% of the normal hourly wage for daytime hours and 70% for night hours — that is, an *addition* to the normal rate. Several guides instead quote 135% and 170%, which is the same thing expressed as a *total* rate including the base hour.

They are almost certainly the same rule stated two ways, and that is the likeliest reading. But "almost certainly" is not a basis for a payroll element, and the consequence of picking the wrong interpretation is a 35% error on every overtime hour. The resolution is to confirm against the statute or counsel, and then to write the chosen interpretation into the configuration workbook in a form that cannot be misread — for example as a worked example with real numbers rather than as a percentage.

Chapter 5 covers the element design and the rate definition behind it, and flags the related open question of how rest-day work is compensated.

## What each entitlement becomes in configuration

The mapping is the useful part of this chapter in a workshop. Annual leave is an accrual plan with service and age bands. Casual leave is an absence type on that plan with its own limits. Sick leave and maternity are qualification plans with payment percentages and occurrence caps. Paternity is a short qualification plan with a cap. Childcare leave is an unpaid plan with four eligibility conditions. Pilgrimage leave is a plan with a once-in-service cap. Nursing breaks, the pregnancy hour and the overtime prohibition are work-schedule and validation rules. Public holidays are calendar events.

Being able to say that list out loud, in that order, is the difference between a consultant who has read the law and one who has configured it.

## The test pack

A statutory leave design is provable, and the cases are specific enough to write down before building.

Someone in their first year, at seven months, to prove the pro-rated 15 days. Someone crossing ten years mid-year. Someone turning fifty mid-year who has not reached ten years. Someone with a disability status. Someone who moves into a hazardous role mid-year. Someone taking casual leave, to prove it comes out of the annual balance rather than beside it. Two separate sick absences in one calendar year totalling more than ninety days, to prove the bands read cumulatively and the 180-day cap holds across both. A maternity absence, with the payment treatment the client's counsel confirmed. A fourth maternity request, to prove the cap. A childcare request eighteen months after the previous one, to prove the spacing rule. And a leave request spanning a public holiday and a weekend, to prove the schedule.

Each with an expected number agreed in advance, as always.

## Documenting it so it survives the regulations

The executive regulations implementing this law are still appearing, which means parts of this chapter will change after it is read. That is a reason to document in a particular way rather than a reason to wait.

For each entitlement, record three things: the rule as configured, the source it came from, and the date it was checked. Where sources disagree, record both readings and whose decision selected one. Where a figure came from the client's counsel rather than from a public summary, say so and name the advice.

A configuration workbook written like that can be re-verified in an afternoon when the regulations land. One that simply states the rules cannot, because nobody can tell which numbers were a legal reading and which were a guess.

[[lab:leave]]

## Common mistakes

- Reading a client's leave policy without checking whether it predates the 2025 law.
- Building annual leave as a flat 21 days.
- Reading the thirty-day tier as service only, when age alone also reaches it.
- Banding on disability or hazardous work without the status or the job classification that the band needs.
- Putting casual leave on top of annual leave.
- Treating the minimum-consumption rule as a system block rather than as a report.
- Letting a balance accumulate past the three-year settlement obligation.
- Treating sick leave as an accrual plan, or attaching its percentages to gross pay instead of the insurable wage.
- Testing sick leave with one long absence, so the cumulative band boundary is never crossed.
- Leaving the insurance offset undesigned, and paying the employee twice or the company twice.
- Documenting the maternity cap without enforcing it.
- Modelling nursing breaks and the pregnancy hour as leave types rather than working-time rules.
- Enforcing childcare leave's duration but not the two-year spacing between occurrences.
- Hard-coding the fifty-employee establishment condition on the day the plan is built.
- Building pilgrimage leave to terms taken from a secondary source.
- Reading an overtime premium of 35% as a total rate, or 135% as an addition.
- Letting public holidays consume annual leave because the calendar was never configured.
- Leaving the holiday calendar without an owner in a country where holidays are announced at short notice.
- Writing a configuration workbook that states rules without their sources and dates.

## Sources

- EY, "Egypt enacts new labor law affecting employers from 1 September 2025". https://www.ey.com/en_gl/technical/tax-alerts/egypt-enacts-new-labor-law-with-changes-affecting-employers-beginning-1-september-2025
- Andersen Egypt, "Egypt's New Labour Law No. 14 of 2025". https://eg.andersen.com/egypts-labour-law-14-2025/
- Amereller, "Egypt: New Labor Law No. 14 of 2025". https://amereller.com/publication/egypt-new-labor-law-no-14-of-2025/
- Andersen Egypt, English translation of Labor Law No. 14 of 2025 — the article text behind the entitlements above, including the working-hours and overtime provisions. https://eg.andersen.com/wp-content/uploads/2025/05/Translation-of-Labor-law-No.-14-of-2025.pdf
- PwC Worldwide Tax Summaries, Egypt — "Other taxes" (sick-leave compensation under the social-insurance law). https://taxsummaries.pwc.com/egypt/individual/other-taxes
