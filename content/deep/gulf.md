---
id: gulf
minutes: 36
---

A Saudi implementation runs on government platforms that have no Egyptian equivalent, and Oracle's generic Gulf localization does not reach them. This chapter covers the systems, the numbers that matter, and the ways a Saudi implementation differs structurally from an Egyptian one.

> **Figures move here too.** Saudi social-insurance rates are being phased up under the 2024 reform, and platform rules change by ministerial decision. Verify against GOSI and the Ministry of Human Resources and Social Development before configuring.

This chapter is unusually full of flagged disagreements, and that is deliberate rather than apologetic. Saudi employment rules have been amended repeatedly in recent years, the authoritative texts are in Arabic, and the English material available is largely written by payroll vendors and calculator sites that copy one another. Where the sources consulted for this chapter disagree, both readings are given and the arbiter is named. A consultant who presents a disputed figure as settled is the one who gets a client's payroll wrong.

## How a Saudi implementation differs structurally

Before the detail, the shape, because it is what changes a project plan.

An Egyptian implementation is largely self-contained: configure the product, produce the forms, file them. A Saudi implementation is **integrated with government platforms** that hold their own copy of the employment relationship, and those copies have to agree with each other and with the payroll. That makes several things that are HR data in Egypt into compliance data in Saudi Arabia — nationality, basic salary, contract terms, residency documents — and it adds a class of defect that does not exist elsewhere: the system is internally correct and disagrees with a platform.

Three design consequences follow and belong in the first workshop. Nationality drives payroll, not just reporting. Basic salary is a number several external systems hold, so changing it is a multi-system event. And documents — iqama, visa, contract — have expiry dates that have operational consequences, which means document tracking is a requirement rather than a nice-to-have.

## GOSI: social insurance with two populations

The **General Organization for Social Insurance (GOSI)** is the Saudi counterpart to Egypt's NOSI. The structural difference from Egypt is that contribution treatment depends on nationality.

For Saudi nationals registered before the new Social Insurance Law took effect on 3 July 2024, the combined rate is 21.5% of the contributable wage — employee 9.75% (9% pension plus 0.75% SANED unemployment insurance), employer 11.75% (9% pension, 2% occupational hazards, 0.75% SANED). Nationals registered on or after that date fall under a phased schedule that rises from 22.5% to 23.5% combined from 1 July 2026, with further annual steps and a retirement age of 65. Expatriates carry only the employer-paid 2% occupational-hazards contribution — no pension, no SANED.

[[fig:gosi-populations]]

The two-schedule split among nationals is the part that catches people, and it is worth being precise about what it means for a build. The determinant is **when the person was first registered with GOSI**, not when they joined this employer and not their age. That is a fact about the person's history, it has to be captured and migrated, and there is no way to derive it from anything else in the record. A design that assumes one national rate will be wrong for a growing share of the workforce every year, and will drift further wrong with each annual step in the schedule.

For an Oracle design this means nationality is a payroll-driving attribute, GOSI registration dates matter, and the element inventory needs separate treatment for the two populations.

## The contributable wage

The contributable wage is basic salary plus housing allowance, capped at SAR 45,000 per month; transport, commission and bonuses are excluded.

[[fig:contributable-wage]]

That definition is why Chapter 5 insists on salary components rather than a single salary figure. If basic and housing are not held as distinct, identifiable components, the contributable wage cannot be computed without guessing — and the guess will be wrong for exactly the employees whose packages are structured unusually, who are generally the senior ones.

Two practical notes. The cap is monthly, so the same proration question arises as in Egypt for part months, and it needs an answer in writing. And because the base excludes several allowances, the employer's contribution as a share of total payroll cost is lower than the headline rate suggests — a figure worth computing honestly for a finance director rather than quoting the rate.

## Registration, and the monthly rhythm

GOSI is not only a calculation; it is a registration and a monthly submission.

Each employee is registered, joiners and leavers are reported, and contributions are submitted against the establishment. The employee's GOSI identifier and registration date are data the HR system has to hold, for the reason given above, and the joiner and leaver events have to reach the platform within the timeframes the authority sets.

The design question is the same one Egypt raises about Forms 1 and 6: does the output come from the system, from an integration, or from a person working on the platform directly. All three are used in practice. What matters is that somebody decides, and that the decision is visible — because the failure mode is a go-live where the payroll is perfect and nobody has been registered.

## Qiwa, Mudad and the Wage Protection System

**Qiwa** is the Ministry of Human Resources' digital labour platform: employment contracts are authenticated through it, and it handles work permits and establishment services. **Mudad** is the platform supporting wage protection and payroll compliance. The **Wage Protection System (WPS)** requires employers to pay salaries through official banking channels and to upload monthly payroll documentation — the **SIF** (Salary Information File) — containing each employee's ID or iqama number, basic salary, allowances, deductions and net pay. The system matches the file against actual bank transfers; when they match, the employee is legally considered paid.

Compliance is enforced through consequences: late files escalate from a minor violation to a partial freeze of Qiwa services, and after three months to the employee's right to transfer sponsorship without consent.

That escalation is worth stating plainly to a client, because it reframes the WPS file from an administrative task to a business risk. A frozen Qiwa account means no new work permits and no new visas, which for a growing Gulf business is an immediate operational problem; and a workforce that can transfer sponsorship without consent is a retention problem. "The payroll file was late" sounds minor. Its consequences are not.

In Oracle terms, the payment process (Chapter 5) produces the WPS file, an eText template is the delivered mechanism for a fixed-format file (Chapter 13), and a Gulf go-live always includes a bank-file test with the actual bank. Plan that test early: the bank's own cycle for validating a new employer file is measured in weeks, not days, and it is one of the most reliable causes of a delayed Gulf go-live.

## The three platforms must agree

The basic salary in the Qiwa contract must equal the basic salary in Mudad and in GOSI, so salary changes have to land on all three at once.

[[fig:wps-agreement]]

This is the single most important operational fact in the chapter, and it is a *process* requirement rather than a configuration one. A salary change entered in Oracle is not finished when the payroll is right; it is finished when the contract on Qiwa, the GOSI registration and the WPS file all carry the same number.

The design response is a documented procedure with an owner — which, in most Saudi clients, is the government-relations or PRO function rather than HR (Chapter 7). A journey (Chapter 14) is the right place to hang it, so that a salary change creates the platform tasks and somebody has to mark them done.

The reconciliation that catches the drift is worth building once and running monthly: the basic salary in the payroll against the basic salary filed, per employee. The differences will not be many. They will be the ones that matter.

## Nitaqat and nationality as compliance data

**Nitaqat**, or Saudization, is the quota system requiring employers to maintain minimum percentages of Saudi national employees, with a colour-banded compliance rating that directly affects the ability to obtain visas and government services. WPS compliance feeds the rating. As a result, nationality reporting and workforce-composition analytics take on compliance significance in Saudi implementations that they do not have in Egypt: nationality is a compliance-reportable attribute, not merely demographic data.

## How the ratio is computed, and what the sources disagree about

The structure of the calculation is consistent across the sources consulted. A **weighted** count of Saudi employees is divided by the total workforce, with certain categories excluded from the denominator, and the result places the establishment in a colour band whose threshold depends on the establishment's economic activity and size. Bands in the current cycle are described as Platinum, High Green, Medium Green, Low Green and Red, with the former Yellow band reported as retired — though sources differ on when.

The **weights** are where the available material stops agreeing, and a consultant should not present any of them as settled.

A Saudi employee with a documented disability is widely described as counting as four, subject to conditions — registration in social insurance, a minimum monthly salary, actively working — and with the benefit capped at a share of the establishment's Saudi workforce. One calculator instead uses a weight of two, and another describes the multiplier as "up to" four.

Part-time Saudi employees are described as counting as a fraction, commonly half, in line with ministry rules.

Saudi women are described in one source as carrying a bonus weight commonly cited at 1.5, and in another only as one of the categories that may count fractionally when part-time. The "commonly cited" phrasing is itself a warning.

Two further points appear consistently enough to plan around. Only Saudi employees whose contracts are documented on Qiwa count, which closes the loop back to the platform agreement above. And the classification is recalculated frequently from Qiwa and GOSI data rather than annually, with sources variously describing near-daily recalculation and a rolling average over some number of weeks.

The consulting position to take: the formula's *structure* is something to design for — the system must be able to produce an accurate, classified headcount by nationality, employment type and job classification (Chapter 2) — and the *weights* are the ministry's, to be read from Qiwa and the ministerial decisions for the client's own activity and size. Building a Nitaqat calculator into a client's reporting using numbers from a vendor blog is how a client is told they are Green when they are not.

## Iqama, visas and document-driven employment

Employment legality in the Gulf is document-dependent in a way it is not in Egypt. **Iqama** (residency permit) numbers, visa details, expiry dates and renewal alerts become genuine HR requirements for every expatriate, and they combine with contract-expiry alerting (Chapter 8). Egyptian implementations mostly do not carry this; every Gulf one does.

The configuration is not difficult and is frequently done badly. Documents belong in the delivered document-records structure rather than in flexfields, because that is what carries a type, an issue and expiry date, an attachment and its own security. Expiry alerts belong in Alerts Composer (Chapter 14), with lead times agreed per document type — a visa renewal needs more notice than a safety certificate. And the renewal itself is a task for the government-relations function, which means a journey rather than a notification into a void.

The design test is whether the system can answer, in one report, "whose documents expire in the next ninety days, and who is chasing each one". A client who cannot answer that has the data and no process.

## End-of-service benefit

Gulf labour law provides an **end-of-service benefit (EOSB)** in place of a state pension for expatriates: a statutory lump sum on departure, calculated on length of service and final wage, with country-specific formulas and reductions for resignation before a service threshold. It is a central component of the final settlement in any Gulf payroll and has no Egyptian equivalent.

The Saudi award under Articles 84 and 85 of the Labour Law is the pattern to know: half a month's wage for each of the first five years and a full month for each year after that, calculated on the last wage and pro-rated for part years, then reduced where the worker resigns — nothing below two years of service, a third from two to five, two thirds from five to ten, and the full award at ten years or more. Figures checked in 2026; Saudi labour law has been amended repeatedly in recent years, so verify against the current text and the client's own contracts, which may be more generous than the statutory floor.

Two cases sit outside the reduction and are worth knowing because they come up. Where the employment ends for reasons genuinely beyond the worker's control, the full award is due despite the departure being worker-initiated. And a female worker who ends her contract within a defined period after marriage or after giving birth is likewise entitled to the full award. Both are exceptions written into the statute rather than employer policy, which means a configuration that applies the reduction mechanically will under-pay them.

## The resignation reductions, and the open question since 2025

Here the sources genuinely diverge, and the divergence is material to money.

Amendments in force since February 2025 introduced a definition of resignation that refers to a fixed-term contract. Some practitioners read that as confining the Article 85 reductions to fixed-term contracts, so that an employee giving notice under an **indefinite** contract would keep the full award. Others continue to apply the reductions to any employee-initiated departure. At least one source states that Articles 84 to 88 themselves were left unchanged by the amendments, which does not settle the question, because the definition sits elsewhere.

Separately, the end of a fixed-term contract by non-renewal is generally described as attracting the full award rather than the resignation reduction, on the basis that declining to renew is not a resignation — a position attributed to the ministry but which this atlas could not confirm against an official source.

And the boundary of the two-thirds band is reported inconsistently: some sources say five to ten years, others "more than five and under ten", which is the same thing stated carelessly but is the kind of carelessness that produces an off-by-one at exactly five years.

None of this is a reason to refuse to build. It is a reason to put the question in writing to the client's Saudi employment counsel, to record the answer and its date in the configuration workbook (Chapter 16), and to implement the client's legal position rather than a consultant's reading of a calculator website. It is also a genuinely strong thing to say in an interview: the honest answer to "how does Saudi EOSB work on resignation" in 2026 includes the sentence that the 2025 amendments left practitioners reading it two ways.

## What decides the money is the service, not the formula

What decides the money is not the formula but the service length fed into it, and that is a configuration question. A worker who left and returned, or who moved between group companies, has a new work relationship and a new legal employer start date; whether the earlier service still counts is a policy decision the client has to state, and it is expressed through a seniority date rather than by back-dating the new employment (Chapter 3). A rehire configured with a fresh service clock under a policy that bridges the break under-pays every affected leaver, and no payroll report flags it, because both figures are arithmetically correct.

The second input is the **wage** the award is calculated on, which is the salary-component question from Chapter 5 again. The last wage is not necessarily basic salary alone, and the client's contracts may define it differently from the statutory floor. Both inputs have to be agreed and documented before the formula is built, and both are where disputes come from.

[[lab:gratuity]]

## Payment timing

One operational rule worth building into the exit process: the settlement is due quickly, and how quickly depends on who ended the relationship — within about a week where the employer ended it, and about two where the employee did.

That turns the final-settlement sequence of Chapter 8 into a timed process rather than an administrative one. The accrual run, the loan clearance, the gratuity calculation and the payment all have to happen inside a window measured in days. A client whose settlement process currently takes a month has a compliance problem they may not know about, and surfacing it is part of the job.

## The rest of the Gulf, briefly

The chapter is titled for the region and has so far described one country, so it is worth stating the pattern — and being clear that each country's specifics must be verified separately rather than assumed from Saudi Arabia.

Every Gulf state shares the same four structural features. **Social insurance splits by nationality**, with nationals covered by a pension system and expatriates covered for much less or not at all. **Wages are protected** through a system that requires payment through banks and a file matching the payroll, under various names. **End of service** is an employer-paid statutory benefit rather than a state pension, with its own formula. And **employment is document-driven**, tied to residency and work permits, with a nationalization quota attached.

What differs, and differs enough that nothing should be carried across without checking: the contribution rates and the wage base they apply to, the cap, the file format, the gratuity formula and its reductions, the quota system's mechanics, and the authority a file goes to. A group operating in three Gulf states has three legislative data groups (Chapter 1), three element libraries, three statutory test packs and three sets of filings — and the only thing that genuinely transfers is the project's experience of doing it once.

Chapter 18 does the UAE in detail, including the ways it is *not* like Saudi Arabia.

## Designing for a multi-country Gulf group

Three decisions recur on regional projects and are worth settling early.

**One instance or several.** One instance with several LDGs is almost always right, and it means one person record for somebody who moves between countries (Chapter 3), one set of structures, and one reporting layer. The cost is that every country's configuration lives beside every other's, so naming conventions and ownership matter more.

**Where the shared services sit.** A group running payroll for several countries from one centre needs security scoped per country (Chapter 15) and personas designed per country (Chapter 22), because the statutory work is different even where the process is the same.

**Who owns the platform relationships.** The government-relations function is a stakeholder in the HR system design in a way that has no Egyptian or European equivalent, and it is almost never invited to the workshops. Inviting it is one of the cheapest risk reductions available on a Gulf project.

## Common mistakes

- Treating GOSI as one rate. Nationals and expatriates differ, and the 2024 reform split nationals into two schedules.
- Failing to capture and migrate each national's GOSI registration date, which is what selects the schedule.
- Ignoring the SAR 45,000 wage ceiling and the basic-plus-housing base.
- Holding salary as one figure, so the contributable wage cannot be derived.
- Forgetting that Qiwa, Mudad and GOSI must show the same basic salary.
- Treating a salary change as finished when the payroll is right.
- Leaving the WPS file to the end of the project, and discovering the bank's test cycle.
- Describing a late WPS file as administrative rather than as a visa and retention risk.
- Treating nationality as demographic data rather than compliance data.
- Building a Nitaqat calculator from weights found on a vendor blog.
- Keeping residency documents in flexfields instead of document records, and having no expiry process.
- Applying the EOSB resignation reduction mechanically, over the statutory exceptions.
- Presenting the post-2025 resignation position as settled when practitioners read it two ways.
- Getting the gratuity formula right and the service date or the wage base wrong.
- Running a settlement process that takes longer than the statutory payment window.
- Assuming one Gulf country's rules carry across to the next.

## Sources

- Mercans, "GOSI Contributions in Saudi Arabia: 2026 Rates, Rules & Compliance Guide". https://mercans.com/glossary/gosi-contributions/
- Mercans statutory alert, "Saudi Arabia: GOSI Contribution Rates & Saned Unemployment Fund 2026". https://mercans.com/resources/statutory-alerts/saudi-arabia-gosi-contribution-rates-saned-unemployment-fund-2026/
- Mercans, "Saudization (Nitaqat): 2026 Quotas, Bands, Compliance Rules & Penalties", for the band structure and the Qiwa documentation requirement. https://mercans.com/glossary/saudization-nitaqat/
- Snad, "Mudad and the Wage Protection System (WPS): 2026 Employer Guide". https://www.snad.io/en/blog/mudad-wps-hamayat-ujur-saudi
- Ministry of Human Resources and Social Development (Saudi Arabia), *Labor Law* (Royal Decree M/51), official English translation — Articles 84 to 88. https://www.hrsd.gov.sa/sites/default/files/2023-02/Labor.pdf
- Ministry of Human Resources and Social Development, "Calculating End-of-Service Award" and "End-of-Service Award Regulations", for the pro-rating of part years and what counts as wage. https://www.hrsd.gov.sa/en/knowledge-centre/articles/316
- Teamed, "End-of-service award in Saudi Arabia: Articles 84 to 88 explained", for the post-2025 reading that practitioners differ on. https://www.teamed.global/gulf-employment-law/saudi-end-of-service-award
- Qiwa (Ministry of Human Resources and Social Development) — the platform itself, for what employers file. https://qiwa.sa
