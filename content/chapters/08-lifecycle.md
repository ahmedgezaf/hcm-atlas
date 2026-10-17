---
id: lifecycle
num: 8
domain: hcm
track: functional
title: The Employment Lifecycle
subtitle: Hire to exit — every event is a dated transaction with a payroll consequence
hue: 26
minutes: 13
labs: lifecycle
terms: probation, notice-period, resignation, termination, end-of-contract, final-settlement, end-of-service-benefit-eosb-gratuity, action-and-action-reason
---

Every event in an employee's working life is, in Oracle, a dated transaction against the assignment, with an approver and a downstream payroll consequence. Thinking in those terms is the consultant's default mental mode. This chapter follows a worker from hire to exit and, because the rules are statutory, uses Egypt's Labour Law No. 14 of 2025 (in force since 1 September 2025) as the worked example; Chapter 10 has the fuller statutory detail and Chapter 17 the Gulf equivalents.

> **Every period in this chapter is statutory, and they move.** The figures are Law 14/2025 as summarised by EY, Andersen and Amereller, checked in 2026, and the executive regulations implementing the law are still appearing. Verify against the current statute or the client's legal counsel before configuring probation, notice or settlement rules.

## The hire, and the three ways it happens

The lifecycle starts before the first day. Oracle offers three entry points, and choosing between them is a design decision rather than a preference.

*Hire an Employee* creates the person, the work relationship and the assignment in one transaction, effective on the start date. *Add a Pending Worker* creates the same records ahead of the start date for someone who has accepted but not started, so onboarding can run — equipment, accounts, documents — and converts to an employee on the day. *Add a Contingent Worker* creates a work relationship of a different worker type for someone engaged but not employed (Chapter 3), which keeps them off the payroll while still giving them a record, a manager and an org-chart position.

In Egypt the pending worker is more useful than most implementations make it, because the statutory onboarding — the social-insurance registration and the labour-office file of Chapter 9 — has to happen around the start date rather than after it, and a record that exists beforehand is what lets that work be tracked instead of remembered.

## Everything in between is a dated change

Between the hire and the exit, almost every event is the same shape: a dated change to the assignment, carrying an **action** and an **action reason** (Chapter 3). A promotion, a transfer, a manager change, a move to part-time, a suspension — each is an update with an effective date, an approver, and usually a payroll consequence.

The action is what the system does; the reason is why, and the reason is what makes analysis possible afterwards. "Why did attrition rise in the third quarter" can only be answered if terminations carry reasons, and reasons exist only because somebody configured them during implementation. A client who accepts the delivered list without reading it has quietly decided not to answer that question.

Two of those middle events deserve naming because they are routinely underestimated. A transfer between legal employers is not a transfer at all — it is an ending and a beginning, with the consequences Chapter 3 sets out for balances and service. And a change in working hours is a change to FTE, which flows into headcount reporting, leave accrual and any pay that is pro-rated, so the "small change to someone's days" is rarely small.

## Probation

**Probation** is an initial period during which either party may end the employment with lighter obligations than after confirmation. Under Law 14/2025 it is capped at three months, cannot be extended, and a worker may be placed on probation only once with the same employer; the clause must be written into the contract or it has no legal effect. In the system, probation end dates drive alerts and confirmation workflows. Where a client's contracts specify a longer probation, flag it — the clause may be invalid.

## Notice

A **notice period** is the advance written warning either party must give before terminating an indefinite-term contract. The 2025 law makes written notice mandatory, counts the notice period as service, and requires full wage during it. Several law-firm summaries state a flat three months regardless of service; earlier commentary described two months under ten years and three above. This is exactly the kind of point to verify against the Arabic text of the statute or the client's legal counsel before configuring, and saying so is a strong professional answer, not a weak one.

## Three exit routes that are not the same

**Resignation** is employee-initiated. Under the 2025 law the resignation must be validated at the competent labour office, the employer must respond within a set period, and the employee may withdraw the resignation within ten days of being notified that the employer accepted it — seven days under the superseded 2003 law, which is the figure still quoted in a good deal of older material. Resignation carries no severance, but unused annual leave is paid out. A process design that makes reversal impossible fails the withdrawal requirement.

**Termination** is employer-initiated, with or without cause. The distinction determines severance exposure. Egyptian law lists specific grounds permitting immediate dismissal, places the burden of proving misconduct on the employer, and imposes strict procedural requirements. Termination is a heavily approval-gated transaction in any implementation.

**End of contract** is a fixed-term contract reaching its expiry date — nobody terminates it; it lapses. Under Law 14/2025, if a fixed-term contract is renewed or the employee simply continues working after expiry, it converts automatically into an indefinite-term contract, which ends the old practice of rolling short renewals indefinitely. Contract-expiry alerts are a real client requirement, especially in the Gulf, where they combine with visa and permit expiry.

Treating the three as one "termination" transaction is a design error: they have different downstream calculations.

[[lab:lifecycle]]

## What the exit actually does in the system

Terminating is a transaction with a reach beyond the record. It end-dates the work relationship, closes the assignment, and sets the payroll dates that decide what can still be paid — the last standard process date, after which no ordinary run picks the person up, and the final close date, after which nothing at all can (Chapter 3). Setting the final close date too tightly is the most common way a legitimate late payment becomes impossible without reopening the record.

It also has to take access away. Role provisioning rules (Chapter 15) remove what they granted when the condition stops being true, which is why a termination that is entered late leaves someone with live access after they have gone — a finding that turns up in audits far more often than it should.

In Egypt the procedural side runs in parallel and is not optional: the labour office is involved in validating a resignation, dismissal grounds must be documented and provable, and the insurance file has to be closed with the Form 6 of Chapter 9. None of that lives in Oracle, and all of it belongs on the exit checklist a journey can carry (Chapter 14), because the consequence of missing it lands on the employer rather than on the system.

## The final settlement

The **final settlement** calculates everything owed to a leaver: final salary, unused leave payout, any severance or end-of-service benefit, minus outstanding deductions such as loans. It is the last payroll event for that person and the one most likely to be disputed. It is usually run as an off-cycle QuickPay and requires the absence balance, the loan balance and the termination date all to be right at the same time — a good practice exercise because it touches absence, payroll and lifecycle at once.

The **end-of-service benefit (EOSB)**, or gratuity, is a statutory lump sum payable to departing employees in Gulf countries, calculated on length of service and final wage. Gulf labour law provides it in place of a state pension for expatriate workers, with country-specific formulas. Egypt does not have gratuity in the Gulf sense; its equivalent protection comes through the social-insurance system. Importing EOSB logic into an Egyptian design, or assuming Egypt has gratuity, is a classic cross-market error.

## Common mistakes

- Extending probation "by agreement". Under the 2025 law it cannot be extended.
- Configuring notice rules from an English summary without verification.
- Designing a resignation process with no withdrawal path.
- Merging the three exit routes into one transaction.
- Building EOSB into an Egyptian payroll.
- Hiring everyone on the start date, so onboarding has no record to hang on.
- Accepting the delivered action reasons unread, then being unable to explain attrition.
- Treating a change in working hours as small. It is an FTE change, and it moves pay and accrual.
- Setting the final close date tightly, so a legitimate late payment cannot be made.
- Entering a termination late and leaving system access live behind it.

## Sources

- EY, "Egypt enacts new labor law affecting employers from 1 September 2025". https://www.ey.com/en_gl/technical/tax-alerts/egypt-enacts-new-labor-law-with-changes-affecting-employers-beginning-1-september-2025
- Andersen Egypt, "Egypt's New Labour Law No. 14 of 2025". https://eg.andersen.com/egypts-labour-law-14-2025/
- Amereller, "Egypt: New Labor Law No. 14 of 2025". https://amereller.com/publication/egypt-new-labor-law-no-14-of-2025/
