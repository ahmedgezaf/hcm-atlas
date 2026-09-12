---
id: lifecycle
num: 8
domain: hcm
track: functional
title: The Employment Lifecycle
subtitle: Hire to exit — every event is a dated transaction with a payroll consequence
hue: 26
minutes: 8
labs: lifecycle
terms: probation, notice-period, resignation, termination, end-of-contract, final-settlement, end-of-service-benefit-eosb-gratuity
---

Every event in an employee's working life is, in Oracle, a dated transaction against the assignment, with an approver and a downstream payroll consequence. Thinking in those terms is the consultant's default mental mode. This chapter follows a worker from hire to exit and, because the rules are statutory, uses Egypt's Labour Law No. 14 of 2025 (in force since 1 September 2025) as the worked example; Chapter 10 has the fuller statutory detail and Chapter 17 the Gulf equivalents.

## Probation

**Probation** is an initial period during which either party may end the employment with lighter obligations than after confirmation. Under Law 14/2025 it is capped at three months, cannot be extended, and a worker may be placed on probation only once with the same employer; the clause must be written into the contract or it has no legal effect. In the system, probation end dates drive alerts and confirmation workflows. Where a client's contracts specify a longer probation, flag it — the clause may be invalid.

## Notice

A **notice period** is the advance written warning either party must give before terminating an indefinite-term contract. The 2025 law makes written notice mandatory, counts the notice period as service, and requires full wage during it. Several law-firm summaries state a flat three months regardless of service; earlier commentary described two months under ten years and three above. This is exactly the kind of point to verify against the Arabic text of the statute or the client's legal counsel before configuring, and saying so is a strong professional answer, not a weak one.

## Three exit routes that are not the same

**Resignation** is employee-initiated. Under the 2025 law the resignation must be validated at the competent labour office, the employer must respond within a set period, and the employee may withdraw the resignation within a short window after acceptance. Resignation carries no severance, but unused annual leave is paid out. A process design that makes reversal impossible fails the withdrawal requirement.

**Termination** is employer-initiated, with or without cause. The distinction determines severance exposure. Egyptian law lists specific grounds permitting immediate dismissal, places the burden of proving misconduct on the employer, and imposes strict procedural requirements. Termination is a heavily approval-gated transaction in any implementation.

**End of contract** is a fixed-term contract reaching its expiry date — nobody terminates it; it lapses. Under Law 14/2025, if a fixed-term contract is renewed or the employee simply continues working after expiry, it converts automatically into an indefinite-term contract, which ends the old practice of rolling short renewals indefinitely. Contract-expiry alerts are a real client requirement, especially in the Gulf, where they combine with visa and permit expiry.

Treating the three as one "termination" transaction is a design error: they have different downstream calculations.

[[lab:lifecycle]]

## The final settlement

The **final settlement** calculates everything owed to a leaver: final salary, unused leave payout, any severance or end-of-service benefit, minus outstanding deductions such as loans. It is the last payroll event for that person and the one most likely to be disputed. It is usually run as an off-cycle QuickPay and requires the absence balance, the loan balance and the termination date all to be right at the same time — a good practice exercise because it touches absence, payroll and lifecycle at once.

The **end-of-service benefit (EOSB)**, or gratuity, is a statutory lump sum payable to departing employees in Gulf countries, calculated on length of service and final wage. Gulf labour law provides it in place of a state pension for expatriate workers, with country-specific formulas. Egypt does not have gratuity in the Gulf sense; its equivalent protection comes through the social-insurance system. Importing EOSB logic into an Egyptian design, or assuming Egypt has gratuity, is a classic cross-market error.

## Common mistakes

- Extending probation "by agreement". Under the 2025 law it cannot be extended.
- Configuring notice rules from an English summary without verification.
- Designing a resignation process with no withdrawal path.
- Merging the three exit routes into one transaction.
- Building EOSB into an Egyptian payroll.

## Sources

- EY, "Egypt enacts new labor law affecting employers from 1 September 2025". https://www.ey.com/en_gl/technical/tax-alerts/egypt-enacts-new-labor-law-with-changes-affecting-employers-beginning-1-september-2025
- Andersen Egypt, "Egypt's New Labour Law No. 14 of 2025". https://eg.andersen.com/egypts-labour-law-14-2025/
- Amereller, "Egypt: New Labor Law No. 14 of 2025". https://amereller.com/publication/egypt-new-labor-law-no-14-of-2025/
