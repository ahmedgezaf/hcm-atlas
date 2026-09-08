---
id: reporting
num: 13
track: technical
title: Reporting & Integration
subtitle: OTBI, BI Publisher, HCM Extract, REST — four ways out, and when each is right
hue: 186
minutes: 9
labs: reporting
terms: otbi, subject-area, bi-publisher-bip, bursting, hcm-extract, rest-api
---

There is no SQL Developer connection to a SaaS pod. When someone asks how to get data out of Oracle HCM, the complete answer names four paths and a reason for each: OTBI for ad-hoc analysis, BI Publisher for formatted output and complex SQL, HCM Extract for scheduled or large-volume outbound files, and REST for real-time integration.

## OTBI: self-service against live data

**Oracle Transactional Business Intelligence (OTBI)** is ad-hoc reporting and analysis directly against live HCM data, built by dragging fields rather than writing SQL. It works through **subject areas**: pre-built, governed logical data models — think of them as pre-joined tables exposed as folders and columns — each covering a business domain at a fixed grain. Names follow a pattern of functional area, then grain, then "Real Time": *Workforce Management — Worker Assignment Real Time*, *Workforce Management — Person Real Time*, *Payroll — Payroll Run Results Real Time*. Reading the name tells you the grain before you open it, and "Real Time" areas give a current snapshot while "Trend" areas give data across periods.

Choosing the right subject area is most of the work, and choosing wrong is the number-one cause of reports that return wrong numbers rather than errors. Date-effective tables multiply rows; multiple assignments double-count people unless filtered to the primary, latest record.

Three constraints catch people. Two subject areas cannot be joined in a single analysis. There is a default row limit — commonly cited around 65,000 — past which OTBI can truncate silently. And subject areas are predefined; their grain cannot be changed. When one subject area is not enough there are three workarounds: a Combined Analysis joining two analyses on a shared key such as person number; moving to BI Publisher and writing the SQL; or an HCM Extract for genuinely large volumes.

## BI Publisher: pixel-controlled documents

**BI Publisher (BIP)** has two pieces: a data model, which is genuinely SQL against the reporting schema, and a template, which controls layout. Together they produce documents with exact formatting — payslips, salary certificates, statutory forms, letters — and they can be scheduled and delivered. **Bursting** splits one report run into many individual outputs, each delivered separately; it is the mechanism by which thousands of payslips from one payroll run are emailed to the right people, and it is the standard follow-up question after any BIP question.

BIP is more flexible than OTBI and slower to build: it demands stronger SQL, an understanding of entity relationships, manual data-security setup and template development. Reach for it when OTBI genuinely cannot do the job, not by default.

The decision rule, memorized: ad-hoc analysis, dashboards and quick operational lists go to OTBI; formatted, printable, per-employee and statutory documents go to BI Publisher. Using OTBI for a payslip or BIP for a quick headcount list are both wrong answers in an interview.

## Extract and REST: the integration boundary

**HCM Extract** pulls HCM data on a schedule and delivers it to an external system — banks, benefits providers, government portals. It supports changes-only extracts, sending only what has changed since the last run, and it is the right tool when a data volume is too large for OTBI. The **REST API** is Oracle's web-service interface for programmatic read and write access, used where a scheduled file would be too slow: recruitment platforms, identity systems, custom applications.

The honest boundary for a functional consultant: HDL, simple formulas, OTBI and basic BIP are routinely expected. Oracle Integration Cloud (OIC) integrations and complex BIP development are where the genuine hand-off to a technical team happens.

[[lab:reporting]]

## Common mistakes

- Using OTBI for a payslip, or BIP for a quick list.
- Trusting a large OTBI result without checking the row limit.
- Picking a subject area by name without checking its grain.
- Assuming direct database access exists.

## Sources

- Oracle, *Creating and Administering Analytics and Reports for HCM* — "HCM Subject Areas for Transactional Business Intelligence". https://docs.oracle.com/en/cloud/saas/human-resources/fahca/hcm-subject-areas-for-transactional-business-intelligence.html
- HCM Tables, "Oracle Fusion HCM OTBI Subject Areas — Complete Guide with Decision Tree". https://www.hcm-tables.com/blog/otbi-subject-area-guide
- Hexstream, "Oracle Fusion OTBI vs BI Publisher". https://www.hexstream.com/tech-corner/oracle-fusion-otbi-vs-bi-publisher
- SplashBI, "How To Join Two Subject Areas in OTBI". https://splashbi.com/blog/cross-subject-area-otbi-reporting/
