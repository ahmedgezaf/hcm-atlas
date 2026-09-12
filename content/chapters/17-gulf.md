---
id: gulf
num: 17
domain: hcm
track: functional
title: Saudi Arabia & the Gulf
subtitle: The systems named in every Saudi job posting
hue: 130
minutes: 8
labs: 
terms: gosi, qiwa, mudad, nitaqat-saudization, wps-and-sif-file, iqama-and-visa-linked-employment-data, end-of-service-benefit-eosb-gratuity
---

Saudi job postings name specific government platforms, and knowing them separates a candidate from those who only know Oracle's generic Gulf localization. This chapter covers the systems, the numbers that matter, and the ways a Saudi implementation differs structurally from an Egyptian one.

> **Figures move here too.** Saudi social-insurance rates are being phased up under the 2024 reform, and platform rules change by ministerial decision. Verify against GOSI and the Ministry of Human Resources and Social Development before configuring.

## GOSI: social insurance with two populations

The **General Organization for Social Insurance (GOSI)** is the Saudi counterpart to Egypt's NOSI. The structural difference from Egypt is that contribution treatment depends on nationality. For Saudi nationals registered before the new Social Insurance Law took effect on 3 July 2024, the combined rate is 21.5% of the contributable wage — employee 9.75% (9% pension plus 0.75% SANED unemployment insurance), employer 11.75% (9% pension, 2% occupational hazards, 0.75% SANED). Nationals registered on or after that date fall under a phased schedule that rises from 22.5% to 23.5% combined from 1 July 2026, with further annual steps and a retirement age of 65. Expatriates carry only the employer-paid 2% occupational-hazards contribution — no pension, no SANED. The contributable wage is basic salary plus housing allowance, capped at SAR 45,000 per month; transport, commission and bonuses are excluded.

[[fig:gosi-populations]]

For an Oracle design this means nationality is a payroll-driving attribute, GOSI registration dates matter, and the element inventory needs separate treatment for the two populations.

[[fig:contributable-wage]]

## Qiwa, Mudad and the Wage Protection System

**Qiwa** is the Ministry of Human Resources' digital labour platform: employment contracts are authenticated through it, and it handles work permits and establishment services. **Mudad** is the platform supporting wage protection and payroll compliance. The **Wage Protection System (WPS)** requires employers to pay salaries through official banking channels and to upload monthly payroll documentation — the **SIF** (Salary Information File) — containing each employee's ID or iqama number, basic salary, allowances, deductions and net pay. The system matches the file against actual bank transfers; when they match, the employee is legally considered paid.

Compliance is enforced through consequences: late files escalate from a minor violation to a partial freeze of Qiwa services, and after three months to the employee's right to transfer sponsorship without consent. The three platforms must agree: the basic salary in the Qiwa contract must equal the basic salary in Mudad and in GOSI, so salary changes have to land on all three at once. In Oracle terms, the payment process (Chapter 5) produces the WPS file, and a Gulf go-live always includes a bank-file test with the actual bank.

[[fig:wps-agreement]]

## Nitaqat and nationality as compliance data

**Nitaqat**, or Saudization, is the quota system requiring employers to maintain minimum percentages of Saudi national employees, with a colour-banded compliance rating that directly affects the ability to obtain visas and government services. WPS compliance feeds the rating. As a result, nationality reporting and workforce-composition analytics take on compliance significance in Saudi implementations that they do not have in Egypt: nationality is a compliance-reportable attribute, not merely demographic data.

## Iqama, visas and document-driven employment

Employment legality in the Gulf is document-dependent in a way it is not in Egypt. **Iqama** (residency permit) numbers, visa details, expiry dates and renewal alerts become genuine HR requirements for every expatriate, and they combine with contract-expiry alerting (Chapter 8). Egyptian implementations mostly do not carry this; every Gulf one does.

## End-of-service benefit

Gulf labour law provides an **end-of-service benefit (EOSB)** in place of a state pension for expatriates: a statutory lump sum on departure, calculated on length of service and final wage, with country-specific formulas and reductions for resignation before a service threshold. It is a central component of the final settlement in any Gulf payroll and has no Egyptian equivalent.

## Common mistakes

- Treating GOSI as one rate. Nationals and expatriates differ, and the 2024 reform split nationals into two schedules.
- Ignoring the SAR 45,000 wage ceiling and the basic-plus-housing base.
- Forgetting that Qiwa, Mudad and GOSI must show the same basic salary.
- Treating nationality as demographic data rather than compliance data.
- Leaving the WPS file to the end of the project.

## Sources

- Mercans, "GOSI Contributions in Saudi Arabia: 2026 Rates, Rules & Compliance Guide". https://mercans.com/glossary/gosi-contributions/
- Mercans statutory alert, "Saudi Arabia: GOSI Contribution Rates & Saned Unemployment Fund 2026". https://mercans.com/resources/statutory-alerts/saudi-arabia-gosi-contribution-rates-saned-unemployment-fund-2026/
- Snad, "Mudad and the Wage Protection System (WPS): 2026 Employer Guide". https://www.snad.io/en/blog/mudad-wps-hamayat-ujur-saudi
- Qiwa (Ministry of Human Resources and Social Development). https://qiwa.sa
