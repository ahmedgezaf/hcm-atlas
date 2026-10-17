---
id: egypt-leave
num: 10
domain: hcm
track: functional
title: Egypt: Leave Under Labour Law 14/2025
subtitle: The statutory entitlements that become absence plans
hue: 16
minutes: 12
labs: leave
terms: egyptian-annual-leave-entitlement, casual-leave, sick-leave, maternity-leave, pilgrimage-leave, nursing-breaks, childcare-leave, public-holiday-premium
---

Labour Law No. 14 of 2025 replaced the 2003 law and took effect on 1 September 2025. Its leave provisions are the direct input to absence-plan design (Chapter 6). This chapter states the entitlements and the design implications; the exit and probation rules live in Chapter 8.

> **Every figure in this chapter moves.** The entitlements were checked in 2026 against the EY, Andersen and Amereller summaries below, and the executive regulations and ministerial decisions implementing the law continue to appear. Professional summaries also disagree with each other on several points, which are flagged where they arise. Re-verify against the Arabic text of the statute, or the client's legal counsel, before configuring an entitlement.

## Annual leave: a ladder by service and age

The statutory ladder is 15 days during the first year of service (pro-rated where service exceeds six months but is under a year); 21 days from the second year; 30 days for workers with ten years of service or aged over 50; 45 days for persons with disabilities; plus 7 additional days for hazardous, arduous or remote-area work. Annual leave excludes official and weekly holidays.

Two further rules shape the plan. The worker must take at least 15 days a year, including six consecutive days, and the employer must settle the leave balance or pay its cash equivalent at least every three years. These translate into carryover and expiry configuration and into leave-encashment logic on exit. The best practice exercise for accrual bands is to build this ladder and then test the two boundary cases: the person crossing ten years mid-year and the person turning fifty mid-year.

The two upper tiers are worth reading carefully, because they are *alternatives*, not a sequence: thirty days is reached either by ten years of service **or** by age, whichever arrives first. A plan built only on service length under-pays an employee who joined at forty-eight, and that employee is exactly the one who knows the law.

## Casual leave

**Casual leave** covers unforeseen circumstances: a maximum of 7 days per year (up from 6 under the old law), no more than 2 consecutive days at a time, and — the detail that gets missed in design and surfaces in UAT — counted within the annual-leave entitlement rather than on top of it.

In configuration that makes casual leave an absence *type* drawing on the annual plan with its own rules, not a second plan with its own balance. Build it as a separate accrual and the employee's entitlement is overstated by seven days, the liability reported to Finance is wrong by the same amount, and nothing in the system objects.

[[fig:egypt-leave-ladder]]

## Sick leave

**Sick leave** is paid at rates that vary by duration and is governed by the social-insurance law: for generally insured workers, 75% of the insurable wage for the first 90 days and 85% thereafter, up to 180 days in the same calendar year, subject to medical certification. Industrial establishments have a stronger schedule under labour law, and employers offset amounts already paid by NOSI. In Oracle this is a textbook qualification plan with payment bands.

Three details decide whether the plan behaves: the percentages attach to the **insurable wage** (Chapter 9), not to gross pay, so the plan needs a rate definition pointing at the right base; the 180-day cap is per calendar year rather than per occurrence, so a worker with three separate absences shares one ceiling; and the certification requirement is a document the absence record should carry, because the payment is defensible only if the certificate exists.

## Maternity, nursing and the pay nobody agrees on

**Maternity leave** is four months, covering the period before and after the birth, with no less than 45 days falling after it. It is capped at three occurrences during the employee's service, and the old requirement of ten months' service before qualifying has gone — the entitlement applies from the first day.

How it is *paid* is where the sources genuinely disagree. Some summaries describe full pay from the employer; others describe payment at a percentage of the insurable wage through social insurance, with the employer topping up or offsetting what NOSI pays. The two readings produce different elements and different costs, so this is a question for the client's counsel and their insurance office rather than one to settle from a summary — and it belongs in the configuration workbook with the answer attributed.

Around the birth the law also constrains the working day rather than granting leave. A pregnant employee's daily hours must be reduced by at least an hour from the sixth month, and overtime may not be required during pregnancy or for six months after the birth. For two years after the birth, **nursing breaks** of two periods of at least thirty minutes a day are paid and counted as working time.

None of those three is an absence plan. The hour reduction and the nursing breaks are working-time rules, which means a work schedule change or an information element rather than a leave balance, and the overtime prohibition is a validation on the overtime element. Clients routinely ask for all three as "leave types", and building them that way produces balances that mean nothing.

**Paternity leave** is new: one paid day on the date of the birth, outside the annual balance, available up to three times. Sources differ on whether the limit counts births or occasions; the practical configuration is an absence type with an occurrence cap, and the cap value confirmed in writing.

Unpaid **childcare leave** of up to two years is available in establishments of fifty or more employees, after a year of service, up to three times, with at least two years between the first and the second. Every one of those four conditions is an eligibility rule, and a plan that enforces the duration but not the spacing will approve leave the law does not grant.

## Public holidays, and the premium for working one

Official holidays and the weekly rest do not count against annual leave. Where a worker is required to work on one, the law provides a premium — commonly summarised as double pay plus a compensating day off — and the number of official holidays itself varies between summaries, which is a reason to take the client's published calendar as the source rather than a secondary list.

In Oracle the calendar is not an absence plan either. Holidays belong to the work schedule and the calendar event, which is what keeps them out of leave balances automatically, and the premium is an earnings element driven from the time card (Chapter 5).

## What each entitlement becomes in configuration

The mapping is the useful part of this chapter in a workshop. Annual leave is an accrual plan with service and age bands. Casual leave is an absence type on that plan with its own limits. Sick leave and maternity are qualification plans with payment percentages and occurrence caps. Paternity is a short qualification plan with a cap. Childcare leave is an unpaid plan with four eligibility conditions. Nursing breaks, the pregnancy hour and the overtime prohibition are work-schedule and validation rules. Public holidays are calendar events.

Being able to say that list out loud, in that order, is the difference between a consultant who has read the law and one who has configured it.

[[lab:leave]]

## Common mistakes

- Building annual leave as a flat 21 days.
- Reading the thirty-day tier as service only, when age alone also reaches it.
- Putting casual leave on top of annual leave.
- Treating sick leave as an accrual plan, or attaching its percentages to gross pay instead of the insurable wage.
- Documenting the maternity cap without enforcing it.
- Modelling nursing breaks and the pregnancy hour as leave types rather than working-time rules.
- Enforcing childcare leave's duration but not the two-year spacing between occurrences.
- Letting public holidays consume annual leave because the calendar was never configured.

## Sources

- EY, "Egypt enacts new labor law affecting employers from 1 September 2025". https://www.ey.com/en_gl/technical/tax-alerts/egypt-enacts-new-labor-law-with-changes-affecting-employers-beginning-1-september-2025
- Andersen Egypt, "Egypt's New Labour Law No. 14 of 2025". https://eg.andersen.com/egypts-labour-law-14-2025/
- Amereller, "Egypt: New Labor Law No. 14 of 2025". https://amereller.com/publication/egypt-new-labor-law-no-14-of-2025/
- Andersen Egypt, English translation of Labor Law No. 14 of 2025 — the article text behind the entitlements above. https://eg.andersen.com/wp-content/uploads/2025/05/Translation-of-Labor-law-No.-14-of-2025.pdf
- PwC Worldwide Tax Summaries, Egypt — "Other taxes" (sick-leave compensation under the social-insurance law). https://taxsummaries.pwc.com/egypt/individual/other-taxes
