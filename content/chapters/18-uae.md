---
id: uae
num: 18
domain: hcm
track: functional
title: The UAE
subtitle: A second Gulf country that configures nothing like the first
hue: 118
minutes: 14
labs: gratuity
terms: mohre, uae-fixed-term-contract, gpssa, alternative-end-of-service-savings-scheme, emiratisation-and-nafis
---

The UAE employs more Oracle HCM consultants than anywhere else in the region, and almost nothing in a Saudi implementation transfers to it unchanged. The gratuity formula is different, the wage-protection file is different, the pension covers a different population under a different authority, and the nationalization programme counts differently. A consultant who has done one Gulf country and assumes the second is a variation of it will design the wrong thing twice before anyone notices. This chapter is the UAE half of Chapter 17.

> **Every figure here moves, and the sources disagree more than usual.** The rules below were checked in 2026 against PwC and Mercans summaries; the authorities are MOHRE for labour matters, GPSSA for pensions and Nafis for Emiratisation, and the official Arabic text governs. Free zones — the DIFC and ADGM especially — run their own employment regimes that this chapter does not cover. Verify before configuring anything.

## Every contract is fixed-term now

Federal Decree-Law No. 33 of 2021 replaced the 1980 labour law and removed the distinction a generation of HR managers grew up with: there is no unlimited contract in the private sector any more. Every contract is fixed-term, renewable, and the renewals are where the administrative work lives.

That is a configuration statement, not a legal footnote. Contract end dates become data the system has to hold and act on, which means contract-expiry alerting is not an optional extra in a UAE implementation the way it is in an Egyptian one, and the lifecycle events of Chapter 8 acquire a route that Egypt does not have: expiry without termination. A client still using "limited" and "unlimited" in a requirements workshop is describing the superseded law, and the useful response is to ask when their contracts were last reissued rather than to configure the vocabulary they used.

## The gratuity is not the Saudi one

The end-of-service gratuity under Article 51 is **21 days of basic wage for each of the first five years of service, and 30 days for each year after that**, payable to anyone with at least one year of continuous service and capped at two years' total wage. Unpaid absence does not count toward service, and the settlement falls due within fourteen days of the contract ending.

Three of those details differ from Saudi Arabia in ways that change the calculation, not just the number. The UAE accrues on **basic wage**, where the Saudi award in Chapter 17 is computed on the last wage as defined by that law — so the component split of the salary (Chapter 5) decides the UAE liability directly. The UAE applies a **cap** of two years' pay, which Saudi Arabia does not. And the UAE pays the full award on resignation after one year, where the Saudi scale reduces it below ten years of service. An EOSB element built for one country and reused in the other is wrong in at least three places.

[[lab:gratuity]]

Since 2023 employers may also join a voluntary **alternative end-of-service savings scheme**, paying monthly contributions into a regulated fund instead of accruing a lump sum on their own books. Where a client has joined it, the payroll design changes shape entirely: a monthly contribution element replaces an accrual and liability calculation, and the final settlement no longer carries the gratuity at all. Ask which model the client is on before designing either.

## GPSSA covers nationals; expatriates have the gratuity instead

Pension contributions through the General Pension and Social Security Authority apply to UAE nationals, and to other GCC nationals under the Gulf insurance-protection extension that Chapter 17 describes from the Saudi side. Expatriates are not in the pension system at all — the gratuity is their end-of-service provision, which is why the two subjects sit in one chapter here and in two places in a European implementation.

There are two contribution regimes, split by when the worker was first registered. Workers registered before November 2023 sit on the older scheme; those entering the workforce from the end of October 2023 fall under Federal Decree-Law No. 57 of 2023, whose total contribution is higher and whose split between employee and employer differs. Published summaries disagree on both the exact cutoff date and the current percentages, and a government subsidy can reduce the employer share at lower salaries, so the rates belong in a dated global value read from GPSSA's own published schedule rather than hard-coded into a formula — the mistake Chapter 12's lab is built around.

What matters structurally is the same point Chapter 17 makes about Saudi Arabia: nationality and registration date are payroll-driving attributes, not demographics. They decide which schedule applies, and a person record missing either produces a contribution that is quietly wrong rather than an error.

## The Wage Protection System, UAE edition

The UAE runs its own Wage Protection System through MOHRE and the Central Bank. Salaries are paid through approved agents and reported in a Salary Information File whose layout is a UAE layout — it is not the file Saudi Arabia's Mudad platform accepts, and the two countries' records are not interchangeable.

This is the single most common cross-Gulf mistake in a payroll design: treating "the Gulf WPS" as one requirement. It is one idea implemented separately per country, with its own file, its own agent, its own identifiers and its own rejection behaviour. A multi-country Gulf go-live needs one bank-file build and test cycle per country, with the real bank, every time (Chapter 5).

## Emiratisation, and what it asks of the data

**Emiratisation** is the UAE's nationalization programme, administered with the Nafis platform. Private-sector companies above the size threshold must raise the share of UAE nationals in skilled roles by a set percentage each year, with monthly financial penalties per unfilled position, escalating annually. Penalties for artificially satisfying the quota — hiring a national who does not genuinely work — are heavier again and sit under a separate decision.

For the consultant the mechanics matter less than what they require of the record: a trustworthy national identifier, an accurate nationality, a job that is correctly classified as skilled, and a reporting line that can produce the ratio on demand. Those are Chapter 2 and Chapter 13 problems wearing a compliance hat, and they are the ones to raise in design rather than in the month the first report is due.

## Where the structure differs

Mainland and free-zone entities answer to different regulators, which usually means separate legal employers, separate registrations and separate wage-protection arrangements, even when the group presents itself as one business. The parent-PSU shape from Chapter 1 is common here: several legal employers, one filing entity, one payroll relationship across them where the statutory unit is shared.

The practical question in the first workshop is therefore not "how many companies do you have" but "how many registrations do you file under, and with whom" — and the answer frequently surprises the client.

## Common mistakes

- Reusing a Saudi end-of-service element in the UAE. Different accrual, different base, different cap, different resignation treatment.
- Assuming one Gulf WPS file. The UAE and Saudi Arabia have separate systems, formats and agents.
- Treating "limited and unlimited contracts" as current. Every private-sector contract is fixed-term under the 2021 law.
- Putting expatriates into the pension scheme. GPSSA covers nationals; expatriates have the gratuity.
- Hard-coding pension percentages that change by registration date and by government subsidy.
- Treating Emiratisation as a reporting problem at go-live rather than a data-quality problem in design.

## Sources

- PwC Worldwide Tax Summaries, United Arab Emirates — "Other taxes", for social-security contributions and the national and GCC populations they cover. https://taxsummaries.pwc.com/united-arab-emirates/individual/other-taxes
- Mercans, "End of Service Gratuity (EOSG) in the UAE" — the Article 51 accrual, the one-year threshold and the two-year cap. https://mercans.com/glossary/uae-end-of-service-gratuity/
- Federal Decree-Law No. 33 of 2021 on the Regulation of Employment Relationships, and Federal Decree-Law No. 57 of 2023 on pensions — the governing texts, published by the UAE government; the Arabic text governs.
- MOHRE for labour and wage protection, GPSSA for pension contribution schedules, and Nafis for current Emiratisation targets and penalties — the authorities to verify against before configuring.
