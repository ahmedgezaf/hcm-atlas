---
id: lifecycle
minutes: 34
---

Every event in an employee's working life is, in Oracle, a dated transaction against the assignment, with an approver and a downstream payroll consequence. Thinking in those terms is the consultant's default mental mode. This chapter follows a worker from hire to exit and, because the rules are statutory, uses Egypt's Labour Law No. 14 of 2025 (in force since 1 September 2025) as the worked example; Chapter 10 has the fuller statutory detail and Chapter 17 the Gulf equivalents.

> **Every period in this chapter is statutory, and they move.** The figures are Law 14/2025 as summarised by EY, Andersen and Amereller, checked in 2026, and the executive regulations implementing the law are still appearing. Verify against the current statute or the client's legal counsel before configuring probation, notice or settlement rules.

The reason the lifecycle deserves a chapter of its own, rather than being left as a list of transactions, is that it is where the model, the law and the money meet. Each event has a record consequence (which object changes, and how), a legal consequence (what the statute requires around it), and a payroll consequence (what gets paid, and when it stops). A consultant who can state all three for any event in the list is doing the job; one who can state only the first is doing data entry.

## The hire, and the three ways it happens

The lifecycle starts before the first day. Oracle offers three entry points, and choosing between them is a design decision rather than a preference.

*Hire an Employee* creates the person, the work relationship and the assignment in one transaction, effective on the start date. *Add a Pending Worker* creates the same records ahead of the start date for someone who has accepted but not started, so onboarding can run — equipment, accounts, documents — and converts to an employee on the day. *Add a Contingent Worker* creates a work relationship of a different worker type for someone engaged but not employed (Chapter 3), which keeps them off the payroll while still giving them a record, a manager and an org-chart position.

In Egypt the pending worker is more useful than most implementations make it, because the statutory onboarding — the social-insurance registration and the labour-office file of Chapter 9 — has to happen around the start date rather than after it, and a record that exists beforehand is what lets that work be tracked instead of remembered.

The argument against pending workers, which clients make, is that it is one more status to explain. The argument for it is that the alternative is one of two worse things: hiring people early, which puts them in a payroll run before they have started, or holding them entirely outside the system, which means onboarding is tracked in a spreadsheet and nobody knows on Monday morning whether the laptop was ordered.

## What must exist before the first payslip

A hire that creates a person, a work relationship and an assignment is not a hire that can be paid. The gap between the two is a checklist, and it is worth building into the hire journey rather than discovering it in the first run.

The person needs their identifiers — the national ID or Iqama, in the right identifier type, because the statutory files read it. The assignment needs a **payroll** assigned, or the run skips the person silently. The payroll relationship needs a **tax reporting unit** on the statutory deductions card, or the person calculates correctly and is missing from the statutory report. There has to be a **personal payment method**, or the calculation succeeds and the prepayment fails. Salary has to exist as a salary record rather than as an element entry. Any standing allowance needs its element entry, and anything automatic needs eligibility that actually covers the person. And absence enrolment has to have happened, or the first leave request meets an empty balance.

Eight things, none of them difficult, each of which produces a different and initially confusing symptom when missing. A client whose first payroll goes smoothly is almost always a client whose hire flow collects all eight.

## Everything in between is a dated change

Between the hire and the exit, almost every event is the same shape: a dated change to the assignment, carrying an **action** and an **action reason** (Chapter 3). A promotion, a transfer, a manager change, a move to part-time, a suspension — each is an update with an effective date, an approver, and usually a payroll consequence.

The action is what the system does; the reason is why, and the reason is what makes analysis possible afterwards. "Why did attrition rise in the third quarter" can only be answered if terminations carry reasons, and reasons exist only because somebody configured them during implementation. A client who accepts the delivered list without reading it has quietly decided not to answer that question.

Two of those middle events deserve naming because they are routinely underestimated. A transfer between legal employers is not a transfer at all — it is an ending and a beginning, with the consequences Chapter 3 sets out for balances and service. And a change in working hours is a change to FTE, which flows into headcount reporting, leave accrual and any pay that is pro-rated, so the "small change to someone's days" is rarely small.

A third is worth adding, because it is the one that generates the most support tickets per occurrence: the **suspension**, or unpaid leave of absence. It is an assignment status change rather than a termination, the person remains employed, and the configuration question is whether they continue to accrue leave, whether their allowances continue, and whether they are excluded from payroll or paid zero. Those are four separate decisions and clients usually have an opinion about only the last. Chapter 3 covers the status mechanics; what belongs here is the instruction to ask all four questions when designing the transaction.

## Probation

**Probation** is an initial period during which either party may end the employment with lighter obligations than after confirmation. Under Law 14/2025 it is capped at three months, cannot be extended, and a worker may be placed on probation only once with the same employer; the clause must be written into the contract or it has no legal effect. In the system, probation end dates drive alerts and confirmation workflows. Where a client's contracts specify a longer probation, flag it — the clause may be invalid.

The design that makes probation useful rather than decorative has three parts: the end date held on the record, an alert that fires far enough ahead for a manager to act, and a confirmation transaction that records the outcome. Without the third, the probation period simply lapses and nobody can say afterwards whether the person was confirmed — which matters when a dismissal is later contested.

## Notice

A **notice period** is the advance written warning either party must give before terminating an indefinite-term contract. The 2025 law makes written notice mandatory, counts the notice period as service, and requires full wage during it. Several law-firm summaries state a flat three months regardless of service; earlier commentary described two months under ten years and three above. This is exactly the kind of point to verify against the Arabic text of the statute or the client's legal counsel before configuring, and saying so is a strong professional answer, not a weak one.

Two operational variants need a design answer even where the statute is settled. **Payment in lieu of notice** replaces the worked period with a payment, which means an element, a rate and a decision about whether the period still counts as service for gratuity and leave. **Garden leave** keeps the person employed and paid but not working, which means they remain active, continue to accrue, and keep system access unless somebody removes it deliberately — a case where the record and the reality diverge on purpose, and where the access question has to be answered explicitly.

## Three exit routes that are not the same

**Resignation** is employee-initiated. Under the 2025 law the resignation must be validated at the competent labour office, the employer must respond within a set period, and the employee may withdraw the resignation within ten days of being notified that the employer accepted it — seven days under the superseded 2003 law, which is the figure still quoted in a good deal of older material. Resignation carries no severance, but unused annual leave is paid out. A process design that makes reversal impossible fails the withdrawal requirement.

**Termination** is employer-initiated, with or without cause. The distinction determines severance exposure. Egyptian law lists specific grounds permitting immediate dismissal, places the burden of proving misconduct on the employer, and imposes strict procedural requirements. Termination is a heavily approval-gated transaction in any implementation.

**End of contract** is a fixed-term contract reaching its expiry date — nobody terminates it; it lapses. Under Law 14/2025, if a fixed-term contract is renewed or the employee simply continues working after expiry, it converts automatically into an indefinite-term contract, which ends the old practice of rolling short renewals indefinitely. Contract-expiry alerts are a real client requirement, especially in the Gulf, where they combine with visa and permit expiry.

Treating the three as one "termination" transaction is a design error: they have different downstream calculations.

Three more routes exist and are worth configuring rather than improvising. **Retirement** has its own settlement treatment and, in Egypt, its own interaction with the insurance system. **Death in service** is the one nobody designs and everybody eventually needs: the settlement is paid to beneficiaries rather than to the employee, there may be an insurance benefit, and the transaction is handled by HR with no self-service involvement at all. And **abandonment** — the person who stops attending — has a statutory procedure in most of the region before the employment can be ended, which means the record sits in a particular state for a defined period rather than being terminated on the day somebody notices.

[[lab:lifecycle]]

## The dates a termination actually carries

The termination transaction takes several dates and they are not synonyms. Knowing which is which is what lets a consultant answer "can we still pay him" without guessing.

The **notification date** is the day the termination was communicated. The **last working date** is the person's final day actually worked. The **termination date** is the last date of employment for that period of service — and these three are frequently different, which is exactly why there are three of them. Someone who resigns on 1 March, works until 15 March and remains employed through a paid notice period ending 31 March has all three dates filled in differently, and every one of them is used by something.

On the payroll side, three more dates follow from it. The **last standard earnings date** is the termination date — the point at which regular earnings stop accumulating. The **last standard process date** defaults to the period-end date of the payroll in which the termination falls, and can be set to a later period when the termination is entered. The **final close date** is the last date on which a supplemental run can include entries for the person, and its default is the end of time; payroll records for the person end only once it is actually set.

That default is worth noticing, because it changes the shape of the usual warning. Left alone, the record stays open for late payments indefinitely. The problem arises when somebody sets the final close date deliberately — tidying up, closing records, following a procedure from another system — and sets it too soon. In the Gulf, where a gratuity recalculation or a bonus declared months later is ordinary, that tidying costs a reopened record. The advice to a client is not "set it carefully" but "do not set it until there is a reason to".

## Correcting, reversing and the difference between them

A termination entered wrongly has two different remedies and they do different things.

**Correcting** a termination changes its dates or details while leaving it a termination. This is the remedy when the person really did leave and somebody typed 31 March instead of 30 March.

**Reversing** a termination removes it, so the employment continues as though it had never ended. This is the remedy when the person did not leave — the resignation was withdrawn within the statutory window, the dismissal was overturned, the wrong person was selected. There is a matching action on the payroll side to reactivate a terminated payroll association.

Choosing between them is the same instinct as update versus correction in Chapter 4: ask whether the thing being removed was ever true. And the thing not to do is to re-hire someone whose termination was a mistake, because that leaves a closed employment in the record describing an event that did not happen, and starts a second one with the service and balance consequences that follow.

## What the exit actually does in the system

Terminating is a transaction with a reach beyond the record. It end-dates the work relationship, closes the assignment, and sets the payroll dates above.

It also has to take access away, and the default behaviour is worth knowing precisely: user access is removed one day after the termination date, and immediate removal can be requested instead. That one-day default is sensible for an ordinary leaver and wrong for a dismissal, which is the case where somebody should lose access as they are told rather than the following morning. Build the distinction into the process rather than leaving it to whoever is entering the transaction.

Role provisioning rules (Chapter 15) remove what they granted when the condition stops being true, which is why a termination that is entered late leaves someone with live access after they have gone — a finding that turns up in audits far more often than it should. The fix is procedural rather than technical: the termination has to be entered on time, which means HR has to hear about it on time, which means the exit process has to start with the manager rather than with the paperwork.

In Egypt the procedural side runs in parallel and is not optional: the labour office is involved in validating a resignation, dismissal grounds must be documented and provable, and the insurance file has to be closed with the Form 6 of Chapter 9. None of that lives in Oracle, and all of it belongs on the exit checklist a journey can carry (Chapter 14), because the consequence of missing it lands on the employer rather than on the system.

## The final settlement

The **final settlement** calculates everything owed to a leaver: final salary, unused leave payout, any severance or end-of-service benefit, minus outstanding deductions such as loans. It is the last payroll event for that person and the one most likely to be disputed. It is usually run as an off-cycle QuickPay and requires the absence balance, the loan balance and the termination date all to be right at the same time — a good practice exercise because it touches absence, payroll and lifecycle at once.

The order matters and is the part that goes wrong. The termination has to be entered with its correct dates first, because everything downstream reads them. The final accrual run has to happen before the leave balance is read, or the payout is short by the last period's accrual (Chapter 6). Outstanding deductions have to be settled or explicitly written off, which is a policy decision rather than a payroll one. Only then is the settlement calculated, and it should be reviewed by a human against a hand calculation before it is paid, because this is the single payment most likely to be examined line by line by the person receiving it.

A practical habit: produce a settlement statement that shows the components and the arithmetic, not just a net figure. Most settlement disputes are not disagreements about the amount; they are disagreements about what was included, and a statement that shows service dates, the rate used, the leave balance and each deduction resolves most of them before they start.

The **end-of-service benefit (EOSB)**, or gratuity, is a statutory lump sum payable to departing employees in Gulf countries, calculated on length of service and final wage. Gulf labour law provides it in place of a state pension for expatriate workers, with country-specific formulas. Egypt does not have gratuity in the Gulf sense; its equivalent protection comes through the social-insurance system. Importing EOSB logic into an Egyptian design, or assuming Egypt has gratuity, is a classic cross-market error.

Where gratuity does apply, two inputs decide the number and both come from earlier chapters: the **service** that counts, which is a seniority-date question (Chapter 3), and the **wage** it is calculated on, which is a salary-component question (Chapter 5). Getting the formula right while getting either of those wrong produces a confidently wrong settlement, and it is always one of those two rather than the formula that causes a dispute.

## Designing the lifecycle as a whole

A good lifecycle design is not a set of transactions; it is a set of answers to questions that recur.

Which events need approval, and from whom (Chapter 19). Which events the employee may initiate, which the manager, and which only HR (Chapter 22). Which events trigger a checklist of tasks that live outside the system (Chapter 14). Which events change pay, and whether that change is prorated or retro (Chapter 4). Which events change access. And which events have a statutory procedure attached that the system can prompt for but not perform.

Working through that grid once, with the client, produces a design document that answers the questions support will otherwise ask one at a time for two years. It is also the artefact that reveals disagreements inside the client's own organisation — about who may approve a promotion, about whether a manager can see a resignation before HR does — which is a better thing to surface in a workshop than in production.

## Common mistakes

- Extending probation "by agreement". Under the 2025 law it cannot be extended.
- Recording a probation period with no confirmation transaction, so nobody can say later whether the person was confirmed.
- Configuring notice rules from an English summary without verification.
- Leaving payment in lieu of notice and garden leave undesigned, including what each does to service and to access.
- Designing a resignation process with no withdrawal path.
- Merging the three exit routes into one transaction, and never configuring retirement, death in service or abandonment at all.
- Building EOSB into an Egyptian payroll.
- Getting a gratuity formula right while reading the wrong service date or the wrong wage base.
- Hiring everyone on the start date, so onboarding has no record to hang on.
- Creating a hire that cannot be paid, because one of the eight things the first payslip needs is missing.
- Accepting the delivered action reasons unread, then being unable to explain attrition.
- Treating a change in working hours as small. It is an FTE change, and it moves pay and accrual.
- Designing a suspension without answering all four questions — accrual, allowances, payroll exclusion, access.
- Confusing the notification date, the last working date and the termination date.
- Setting the final close date when nothing required it, instead of leaving it open.
- Re-hiring somebody whose termination was a mistake, rather than reversing it.
- Letting a dismissal keep system access until the following day because nobody asked for immediate removal.
- Entering a termination late and leaving system access live behind it.
- Calculating a settlement before the final accrual run.
- Paying a settlement as a single net figure with no statement behind it.

## Sources

- Oracle, *REST API for Oracle Fusion Cloud HCM* — "Terminate a worker", for the notification, last working and termination dates and the user-access timing. https://docs.oracle.com/en/cloud/saas/human-resources/farws/op-workers-workersuniqid-child-workrelationships-periodofserviceid-action-terminate-post.html
- Oracle, *Administering Global Payroll* — "Payroll Relationship and Termination Dates", for the last standard earnings date, the last standard process date and the final close date and its default. https://docs.oracle.com/en/cloud/saas/human-resources/faagp/payroll-relationship-and-termination-dates.html
- Oracle, *REST API for Oracle Fusion Cloud HCM* — "Correct a worker termination", which is a different operation from reversing one. https://docs.oracle.com/en/cloud/saas/human-resources/farws/op-workers-workersuniqid-child-workrelationships-periodofserviceid-action-correcttermination-post.html
- EY, "Egypt enacts new labor law affecting employers from 1 September 2025". https://www.ey.com/en_gl/technical/tax-alerts/egypt-enacts-new-labor-law-with-changes-affecting-employers-beginning-1-september-2025
- Andersen Egypt, "Egypt's New Labour Law No. 14 of 2025". https://eg.andersen.com/egypts-labour-law-14-2025/
- Amereller, "Egypt: New Labor Law No. 14 of 2025". https://amereller.com/publication/egypt-new-labor-law-no-14-of-2025/
