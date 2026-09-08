---
id: egypt-payroll
num: 9
track: functional
title: Egypt: Social Insurance & Salary Tax
subtitle: The mechanics Oracle does not ship — and the consultant's biggest differentiator
hue: 4
minutes: 11
labs: insurance, tax
terms: insurable-wage, social-insurance-contribution-rates, nosi, form-1-and-form-6, personal-exemption, progressive-tax-brackets, bracket-elimination-for-high-earners, martyrs-victims-fund-contribution, universal-health-insurance, minimum-wage-and-mandatory-annual-increment
---

Oracle does not deliver a pre-built, maintained Egyptian payroll localization the way it does for some markets. The implementation partner builds the statutory rules — in elements, balances and Fast Formulas (Chapter 12). A consultant who knows the Egyptian mechanics is therefore useful on day one in a way that one who only knows the product is not.

> **Every figure in this chapter moves.** Insurable-wage limits rise each January under a fixed schedule; tax law changes by decree. The figures below were checked against PwC Worldwide Tax Summaries and statutory alerts in 2026. Re-verify against NOSI or the Egyptian Tax Authority before quoting them to a client.

## Social insurance: the insurable wage

Egyptian social insurance is administered by **NOSI**, the National Organization for Social Insurance, under Law 148 of 2019. Contributions are not calculated on gross salary. They apply to the **insurable wage**: the portion of pay bounded by a statutory floor and ceiling. From 1 January 2026 the minimum is EGP 2,700 per month and the maximum EGP 16,700, up from EGP 2,300 and 14,500 in 2025. The limits rise 15% each January under a schedule that began in 2021, after which they are indexed to inflation.

The **contribution rates** are fixed by law: employee 11%, employer 18.75%, total 29.75% of the insurable wage. At the 2026 ceiling the employee share caps at EGP 1,837.00 per month and the employer share at EGP 3,131.25 — whether the person earns EGP 20,000 or 200,000. Being able to compute a capped contribution in a workshop builds credibility fast, and "contributions apply to full gross" is the most common calculation error in Egyptian payroll.

[[lab:insurance]]

Registration is form-driven. **Form 1** is filed with social insurance on hiring and **Form 6** on termination; the Personnel team handles them, and a standard Oracle implementation does not generate them unless someone builds the output. Two smaller statutory items belong in every Egyptian element inventory: the **Martyrs and Victims Fund** deduction of 0.05% of gross pay, and **universal health insurance** (employer 3.25%, employee 1%), which applies only in governorates where the scheme has been rolled out — confirm the client's governorate rather than assuming.

## The minimum wage and the mandatory increment

The private-sector **minimum wage** is EGP 7,000 per month, and it is defined to include the employer's social-insurance share rather than sit beneath it. Law 14/2025 also requires an **annual increment** of at least 3% of the social-insurance wage. Because the base is the insurable wage, not total salary, the increment is effectively capped at 3% of the ceiling for higher earners. Calculating it on full gross is the classic error.

## Salary tax: annual, progressive, exemption-adjusted

Salary tax is calculated annually and then divided across the year — the monthly figure is a derived slice, not an independent calculation. The formula: gross, less the **personal exemption**, less the employee's social-insurance contribution, equals net taxable income. Law No. 7 of 2024 raised the personal exemption from EGP 15,000 to **EGP 20,000** a year, for residents and non-residents alike, widened the zero-rated band to EGP 40,000, and introduced a top rate of 27.5%.

The **progressive brackets** on annual net taxable income are: 0% to EGP 40,000; 10% to 55,000; 15% to 70,000; 20% to 200,000; 22.5% to 400,000; 25% to 1,200,000; and 27.5% above that.

## Bracket elimination for high earners

Egypt adds a rule most payroll calculators ignore. As net taxable income rises past defined thresholds, access to the lower bands is progressively removed, so that the income which would have been taxed at 0% or 10% is taxed at the next surviving rate instead. Above EGP 600,000 the zero band disappears; above 700,000 the 10% band also goes; the pattern continues through 800,000 and 900,000 until, above EGP 1,200,000, only the 25% and 27.5% bands remain. Deloitte's summary of Law 7/2024 presents exactly this as a table of bracket applications by total-income level.

A naive progressive calculation that applies every band to every employee is wrong for senior staff — precisely the people who notice. If a consultant builds or validates an Egyptian tax formula, this rule is a correctness requirement.

[[lab:tax]]

## Common mistakes

- Applying contributions to gross instead of the capped insurable wage.
- Quoting last year's limits. They change every January.
- Calculating the 3% increment on total salary.
- Treating tax as a flat monthly percentage.
- Omitting the Martyrs Fund and health-insurance lines, then finding the gap in parallel run.
- Ignoring bracket elimination.

## Sources

- PwC Worldwide Tax Summaries, Egypt — "Taxes on personal income" and "Other taxes". https://taxsummaries.pwc.com/egypt/individual/taxes-on-personal-income · https://taxsummaries.pwc.com/egypt/individual/other-taxes
- Mercans statutory alert, "Egypt: Minimum and Maximum Insurable Wage Limits Increase for Social Insurance from 2026". https://mercans.com/resources/statutory-alerts/egypt-minimum-and-maximum-insurable-wage-limits-increase-for-social-insurance-from-2026/
- Deloitte Middle East, "Amendment to tax brackets and annual personal exemption" (Law 7/2024). https://www.deloitte.com/middle-east/en/services/tax/perspectives/amendment-to-tax-brackets-and-annual-personal-exemption.html
- EY, "Egypt enacts new labor law affecting employers from 1 September 2025" (annual increment). https://www.ey.com/en_gl/technical/tax-alerts/egypt-enacts-new-labor-law-with-changes-affecting-employers-beginning-1-september-2025
