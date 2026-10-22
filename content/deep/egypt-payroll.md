---
id: egypt-payroll
minutes: 36
---

Oracle does not deliver a pre-built, maintained Egyptian payroll localization the way it does for some markets. The implementation partner builds the statutory rules — in elements, balances and Fast Formulas (Chapter 12). A consultant who knows the Egyptian mechanics is therefore useful on day one in a way that one who only knows the product is not.

> **Every figure in this chapter moves.** Insurable-wage limits rise each January under a fixed schedule; tax law changes by decree. The figures below were checked against PwC Worldwide Tax Summaries and statutory alerts in 2026. Re-verify against NOSI or the Egyptian Tax Authority before quoting them to a client.

This chapter goes further than the figures, because the figures are the easy part. The hard part is knowing which wage each rule applies to, in what order the deductions are taken, how the monthly number relates to the annual one, and which of the published summaries disagree with each other. A consultant who can hold all of that is the person a client keeps.

## What Oracle ships, and what the partner builds

It is worth being precise about the boundary, because clients ask and partners sometimes blur it.

What the product gives you is the machinery: elements and their classifications, balances and dimensions, element eligibility, the formula language, the calculation and payment processes, and the costing and accounting chain. That machinery is country-agnostic and it is genuinely substantial.

What it does not give you, for Egypt, is the statutory content — the insurable-wage bounds and their annual schedule, the contribution rates and their split, the tax brackets, the personal exemption, the bracket-elimination rule, the forms the authorities expect and the files they accept. Each of those is something the partner configures, usually as a Fast Formula over a set of calculation values, and each of them is something the client will have to maintain as the law changes.

The consulting consequence is worth saying out loud in a sales conversation rather than discovering in year two: an Egyptian payroll build creates a maintenance obligation. Somebody has to update the insurable-wage limits every January and the tax ladder whenever a law changes. Designing the configuration so that those are *values* in one place rather than numbers scattered through formulas is the difference between a half-day update and a small project.

## Social insurance: the system behind the number

Egyptian social insurance is administered by **NOSI**, the National Organization for Social Insurance, under Law 148 of 2019 — the law that replaced and consolidated the earlier regime, and the reason older material about a split between basic and variable wage no longer describes current practice.

The system is not one benefit but several branches, and knowing what the contribution buys explains why it is split the way it is: old-age, disability and death; an end-of-service bonus; sickness; unemployment; and work injury. That list is also why Egypt does not have Gulf-style gratuity — the protection the Gulf delivers as an employer-paid lump sum is delivered here through the insurance system, which is the point Chapter 8 makes from the other direction.

## The insurable wage

Contributions are not calculated on gross salary. They apply to the **insurable wage**: the portion of pay bounded by a statutory floor and ceiling.

From 1 January 2026 the minimum is EGP 2,700 per month and the maximum EGP 16,700, up from EGP 2,300 and 14,500 in 2025. The limits rise 15% each January under a schedule that began in 2021, after which they are indexed to inflation.

Three consequences follow, and all three show up in a build.

The bounds are **per month and per person**, so a part-month, a mid-month joiner or an unpaid period raises the question of whether the floor and ceiling are prorated. That is a question for the client's statutory adviser, and the answer has to be written down because the formula has to implement one of them.

The bounds **change on a fixed date**, which makes January a retro month in Egypt almost every year (Chapter 4). Any design that cannot absorb a statutory change announced close to or after its effective date will struggle here.

And because the ceiling exists, **a raise above it changes nothing** for the contribution. Explaining that to an employee who has just been promoted, and to a finance director modelling employer cost, is a recurring conversation. The employer cost curve is flat above the ceiling, which is a planning fact as much as a payroll one.

## The contribution rates, and where they go

The **contribution rates** are fixed by law: employee 11%, employer 18.75%, total 29.75% of the insurable wage. At the 2026 ceiling the employee share caps at EGP 1,837.00 per month and the employer share at EGP 3,131.25 — whether the person earns EGP 20,000 or 200,000. Being able to compute a capped contribution in a workshop builds credibility fast, and "contributions apply to full gross" is the most common calculation error in Egyptian payroll.

Published breakdowns of how those headline rates divide between branches are broadly consistent. The employer's 18.75% is generally given as 12% for old-age, disability and death, 1% for the end-of-service bonus, 3.25% for sickness, 1% for unemployment and 1.5% for work injury; the employee's 11% as 9% for old-age, disability and death, 1% for the end-of-service bonus and 1% for sickness. Both add up correctly, which is a reassuring sign. One calculator further states that the employer's 1.5% work-injury share is itself divided, with 1% going to the Universal Health Insurance Authority and 0.5% to NOSI.

Two cautions belong with that breakdown rather than after it. The branch split is reported by professional and vendor summaries rather than quoted here from the statute, and at least one widely-read payroll vendor page contradicts itself on the employer headline rate — stating 10.75% in one place and 18.75% in another, where every other source says 18.75%. And the ISSA country profile describes a long-term schedule under which the rates rise periodically and are expected to return gradually to a higher combined level over decades, which most other summaries do not mention at all. Where the branch split matters to a build — and it does, because the branches are often separate elements for reporting — confirm it against the law and its executive regulations rather than against a summary.

[[lab:insurance]]

## Working a capped contribution by hand

The arithmetic is worth being able to do in a meeting, because it ends an argument faster than a spreadsheet.

Take the person's wage. Compare it to the floor and the ceiling and take whichever applies: below 2,700 you use 2,700, above 16,700 you use 16,700, in between you use the wage itself. Multiply the result by 11% for the employee and 18.75% for the employer. That is the whole calculation, and the part people get wrong is the first step rather than the second.

A worked case makes the ceiling vivid. Somebody earning EGP 16,700 and somebody earning EGP 60,000 pay exactly the same contribution — EGP 1,837.00 each — and cost their employer exactly the same EGP 3,131.25. The entire difference between the two salaries is outside the insurance system, which is why the employer's social-insurance cost as a percentage of payroll falls as salaries rise, and why that percentage is not a number anybody should budget with.

## Registration, forms and the insurance file

Registration is form-driven. **Form 1** is filed with social insurance on hiring and **Form 6** on termination; the Personnel team handles them, and a standard Oracle implementation does not generate them unless someone builds the output.

The practical shape of this on a project is worth planning for. The forms are the legal record of who is insured and from when, they are filed by a Personnel team that has been doing it for years, and they do not come out of the system by default. There are three honest options: leave the forms as a manual process and have the system prompt for them through a checklist on the hire and exit journeys (Chapter 14); build the output as a report or extract (Chapter 13); or buy a partner localization that includes it. Each is defensible. What is not defensible is assuming the first and never telling the client, which is how a go-live arrives with nobody responsible for the statutory filing.

The same goes for the insurance number itself. Each insured person has one, it is a national identifier type rather than an Oracle construct, and it has to be held on the person record (Chapter 3) because every statutory output keys on it. If the migration does not bring it across, it has to be collected, and collecting a number for ten thousand people after go-live is a project in itself.

## The two smaller statutory lines

Two smaller statutory items belong in every Egyptian element inventory, and both are routinely missed until parallel run.

The **Martyrs and Victims Fund** deduction is 0.05% of gross pay — note that this one is on gross, not on the insurable wage, which is exactly the kind of inconsistency that makes a build error easy.

**Universal health insurance** (employer 3.25%, employee 1%) applies only in governorates where the scheme has been rolled out, under the phased implementation of the universal health insurance law. Confirm the client's governorate rather than assuming, and confirm it per site rather than per company — a group with a Cairo head office and an Upper Egypt plant may be in the scheme for one and not the other, which makes it a location-driven rule (Chapter 1) rather than a company-wide one.

## The minimum wage and the mandatory increment

The private-sector **minimum wage** is EGP 7,000 per month, and it is defined to include the employer's social-insurance share rather than sit beneath it. Law 14/2025 also requires an **annual increment** of at least 3% of the social-insurance wage.

Because the base is the insurable wage, not total salary, the increment is effectively capped at 3% of the ceiling for higher earners. Calculating it on full gross is the classic error — and it is an expensive one in both directions, since over-calculating it inflates the payroll permanently and under-calculating it is a statutory breach.

The design question this raises is where the increment lives. It is a salary change rather than a payroll element, which means it belongs on the salary record (Chapter 5) and flows through to the entry from there. Running it as a mass salary update each year, with the 3%-of-insurable-wage figure computed per person, is the clean implementation. Adding an "annual increment" allowance element is the implementation that looks easier in year one and is unexplainable by year three.

## Salary tax: annual, progressive, exemption-adjusted

Salary tax is calculated annually and then divided across the year — the monthly figure is a derived slice, not an independent calculation. The formula: gross, less the **personal exemption**, less the employee's social-insurance contribution, equals net taxable income.

Law No. 7 of 2024 raised the personal exemption from EGP 15,000 to **EGP 20,000** a year, for residents and non-residents alike, widened the zero-rated band to EGP 40,000, and introduced a top rate of 27.5%. Older summaries still quote the EGP 15,000 figure, and some still circulate, so a figure found online needs its date checked before it is believed.

The **progressive brackets** on annual net taxable income are: 0% to EGP 40,000; 10% to 55,000; 15% to 70,000; 20% to 200,000; 22.5% to 400,000; 25% to 1,200,000; and 27.5% above that.

The order of the subtractions matters and is the second most common error after the insurable wage. The social-insurance contribution is deducted *before* the brackets are applied, which means the employee's 11% reduces taxable income as well as net pay. A calculation that applies tax to gross less exemption only will over-deduct for everybody below the ceiling, and will do so by a consistent amount — which makes it easy to spot in a parallel run if anyone is comparing by element rather than by total.

## How the monthly figure is actually derived

Because the tax is annual, the monthly deduction is an estimate that converges.

The ordinary approach is to annualise the person's current monthly pay, compute the annual tax on it, divide by twelve, and deduct that. As long as pay does not change, the twelve monthly slices add up to the annual liability and nothing needs correcting.

Pay does change, and that is where the design decisions appear. A mid-year raise changes the annual projection, which changes the remaining monthly deductions — and whether it also corrects the months already deducted is a choice between a cumulative method, which recalculates the year to date and squares it up in the current month, and a non-cumulative one, which simply adjusts going forward and leaves the reconciliation to the annual settlement. Both are used in practice. The client's existing payroll does one of them, and matching it is a parallel-run requirement rather than a preference.

Three cases need an explicit answer in the design: the **mid-year joiner**, whose annual projection covers only part of the year; the **one-off payment** such as a bonus, where annualising it as though it recurred every month would massively over-deduct; and the **mid-year leaver**, whose actual annual income turns out lower than projected. Each needs its own treatment, each is testable, and each produces an angry employee if it is wrong.

## Bracket elimination for high earners

Egypt adds a rule most payroll calculators ignore. As net taxable income rises past defined thresholds, access to the lower bands is progressively removed, so that the income which would have been taxed at 0% or 10% is taxed at the next surviving rate instead.

Above EGP 600,000 the zero band disappears; above 700,000 the 10% band also goes; the pattern continues through 800,000 and 900,000 until, above EGP 1,200,000, only the 25% and 27.5% bands remain. Deloitte's summary of Law 7/2024 presents this as a table of bracket applications by total-income level, stating the 600,000 and 700,000 steps explicitly and that the pattern continues to 1,200,000. The 800,000 and 900,000 steps above follow that stated pattern rather than a separately cited figure, so confirm the exact ladder against the Egyptian Tax Authority before building it.

A naive progressive calculation that applies every band to every employee is wrong for senior staff — precisely the people who notice. If a consultant builds or validates an Egyptian tax formula, this rule is a correctness requirement.

Two things make it harder to implement than it first looks. The thresholds are **cliffs rather than tapers**, so a person just above one pays noticeably more than a person just below it, and the jump is real rather than a rounding artefact — which means it has to survive testing rather than being smoothed away by somebody who assumes it is a bug. And the rule operates on total income, so for an employee with income the employer does not see, the employer's withholding is an approximation that the annual settlement corrects.

[[lab:tax]]

## Filing: monthly, quarterly, annual

The payroll calculation is only half the obligation. The filing calendar is the other half, and it belongs in the design because it determines what the system has to produce and when.

Published guidance is consistent on two points. Tax withheld is **remitted monthly**, with the deadline generally given as the 15th of the following month, and social insurance follows the same monthly rhythm. **Quarterly returns** are filed one month after each quarter closes.

Published guidance is *not* consistent on the annual reconciliation. Different professional and vendor summaries give the deadline as 1 January of the following year, as 31 January, and as some point in April. The form designation commonly quoted for the monthly declaration is not something this atlas could confirm against an Egyptian Tax Authority publication either. Both of those are reasons to get the calendar from the client's own tax adviser or from the Authority directly rather than from a summary — and to put the agreed dates in the design document, because the payroll team will work to whatever is written there.

What this means for the build is a short list of required outputs: a monthly tax remittance figure reconciled to the payroll, a quarterly return with per-employee detail, an annual reconciliation, and the social-insurance monthly submission. None of these is a delivered Egyptian report. Each is either an extract, a BI Publisher report (Chapter 13) or a manual process with the data pulled from the system — and the choice should be made deliberately for each.

## Building this in Oracle

The configuration shape that works, in the order it is built.

Start with **calculation values rather than numbers in formulas**: the insurable-wage floor and ceiling, the contribution percentages, the exemption, the bracket boundaries and rates. Held as dated values, they make the January update a data change rather than a code change, and they make it possible for a client to maintain them.

Then the **balances**: insurable wage, employee contribution, employer contribution, taxable income, tax withheld — each with the dimensions the statutory outputs need, which in practice means both month-to-date and year-to-date at payroll relationship level (Chapter 5).

Then the **elements**: the employee contribution as a pre-statutory deduction so it reduces taxable income, the employer contribution as an employer charge that costs but does not affect net pay, the tax as a statutory deduction, and the two small lines. Classification here is not cosmetic — it is what makes the order of calculation correct.

Then the **formulas** (Chapter 12), which should be short because the values live outside them. A formula that contains the number 16,700 is a formula somebody will have to find and edit next January.

And then the **outputs**, which is the part most likely to be under-estimated.

## The test cases that prove it

An Egyptian statutory build is provable, and the test pack is short enough to write in an afternoon.

Somebody below the insurable-wage floor. Somebody between the floor and the ceiling. Somebody above the ceiling — the capped case. Somebody who crosses the ceiling because of a raise mid-year. A mid-month joiner and a mid-month leaver, to prove the proration decision. Somebody with a bonus, to prove the one-off treatment. A high earner in each bracket-elimination step. Somebody in a governorate with universal health insurance and somebody in one without. And a January run, to prove the limits changed and the retro absorbed it.

Each case gets an expected number agreed with the client *before* the run. That is the difference between testing and looking.

## Parallel run in Egypt

The general method is in Chapter 5; two things are specific to Egypt and worth anticipating.

The first is that legacy Egyptian payrolls are frequently spreadsheets, and a spreadsheet is not wrong merely because it is a spreadsheet — it often encodes years of correct statutory practice that nobody has written down. Reconciling against it is therefore a knowledge-transfer exercise as much as a verification one, and the person who maintains it is the most valuable interview on the project.

The second is that legacy payrolls in any country drift from the statute, and in a market where limits move every January the drift is usually in the same direction: last year's ceiling, still in use. When the new system and the old one disagree because the new one is right, that is a finding for the client's management rather than a defect to configure away — and it may have a back-dated cost the client needs to know about before go-live rather than after.

## Common mistakes

- Applying contributions to gross instead of the capped insurable wage.
- Quoting last year's limits. They change every January.
- Putting the limits inside a formula instead of holding them as dated values.
- Taking a branch-by-branch rate split from a summary without confirming it against the law.
- Forgetting that the Martyrs Fund is on gross while the contributions are on the insurable wage.
- Applying universal health insurance everywhere, or nowhere, instead of by governorate.
- Calculating the 3% increment on total salary.
- Implementing the annual increment as an allowance element rather than a salary change.
- Deducting tax before the social-insurance contribution instead of after it.
- Treating tax as a flat monthly percentage.
- Annualising a one-off bonus as though it recurred every month.
- Having no agreed treatment for a mid-year joiner, a mid-year leaver or a mid-year raise.
- Ignoring bracket elimination.
- Smoothing out a bracket-elimination cliff because it looks like a bug.
- Omitting the Martyrs Fund and health-insurance lines, then finding the gap in parallel run.
- Assuming Form 1 and Form 6 come out of the system.
- Not migrating the social-insurance number, then having to collect it for the whole population.
- Taking the annual reconciliation deadline from a vendor summary rather than from the Authority.
- Configuring away a parallel-run difference where the legacy payroll is the one that is wrong.

## Sources

- PwC Worldwide Tax Summaries, Egypt — "Taxes on personal income" and "Other taxes". https://taxsummaries.pwc.com/egypt/individual/taxes-on-personal-income · https://taxsummaries.pwc.com/egypt/individual/other-taxes
- Mercans statutory alert, "Egypt: Minimum and Maximum Insurable Wage Limits Increase for Social Insurance from 2026". https://mercans.com/resources/statutory-alerts/egypt-minimum-and-maximum-insurable-wage-limits-increase-for-social-insurance-from-2026/
- Deloitte Middle East, "Amendment to tax brackets and annual personal exemption" (Law 7/2024). https://www.deloitte.com/middle-east/en/services/tax/perspectives/amendment-to-tax-brackets-and-annual-personal-exemption.html
- Andersen Egypt, Law No. 148 of 2019 and its executive regulation. https://eg.andersen.com/wp-content/uploads/2025/06/Law-No.-148-of-the-Year-2019-and-its-executive-regulation.pdf
- Legal 500, "Social Insurance in Egypt", for the headline employer and employee rates. https://www.legal500.com/intelligence/egypt/employment-and-hr/social-insurance-in-egypt
- ISSA, Egypt country profile, for the long-term rate schedule that other summaries do not mention. https://www.issa.int/sites/default/files/documents/2024-07/Egypt.pdf
- EY, "Egypt enacts new labor law affecting employers from 1 September 2025" (annual increment). https://www.ey.com/en_gl/technical/tax-alerts/egypt-enacts-new-labor-law-with-changes-affecting-employers-beginning-1-september-2025
