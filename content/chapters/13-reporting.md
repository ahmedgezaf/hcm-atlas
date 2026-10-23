---
id: reporting
num: 13
domain: hcm
track: technical
title: Reporting & Integration
subtitle: OTBI, BI Publisher, HCM Extract, REST — four ways out, and when each is right
hue: 186
minutes: 10
labs: reporting, grain-trap, which-door
terms: otbi, subject-area, bi-publisher-bip, bursting, hcm-extract, rest-api
---

There is no SQL Developer connection to a SaaS pod. When someone asks how to get data out of Oracle HCM, the complete answer names four paths and a reason for each: OTBI for ad-hoc analysis, BI Publisher for formatted output and complex SQL, HCM Extract for scheduled or large-volume outbound files, and REST for real-time integration.

## OTBI: self-service against live data

**Oracle Transactional Business Intelligence (OTBI)** is ad-hoc reporting and analysis directly against live HCM data, built by dragging fields rather than writing SQL. It works through **subject areas**: pre-built, governed logical data models — think of them as pre-joined tables exposed as folders and columns — each covering a business domain at a fixed grain. Names follow a pattern of functional area, then grain, then "Real Time": *Workforce Management — Worker Assignment Real Time*, *Workforce Management — Person Real Time*, *Payroll — Payroll Run Results Real Time*. Reading the name tells you the grain before you open it, and "Real Time" areas give a current snapshot while "Trend" areas give data across periods.

Choosing the right subject area is most of the work, and choosing wrong is the number-one cause of reports that return wrong numbers rather than errors. Date-effective tables multiply rows; multiple assignments double-count people unless filtered to the primary, latest record.

The discipline that prevents it is one sentence long: say what a single row means before trusting any number built on it. In *Worker Assignment Real Time* a row is one dated version of one assignment, so a person promoted twice appears three times and a person holding two jobs appears twice again. Neither is a data error — the history is correct and the second assignment is real — but a row count answers "how many assignment versions", not "how many people". Filtering to the current dated row and to the primary assignment turns one into the other, at the cost of hiding the second job, which is why headcount and workload have to be asked for separately.

[[lab:grain-trap]]

Three constraints catch people. Subject areas can be combined in one analysis, but only on a dimension they share — so the link people most often want, an attribute one side does not carry, is the one that is not available. There is a default row limit — commonly cited around 65,000 — past which OTBI can truncate silently. And subject areas are predefined; their grain cannot be changed. When the areas share nothing that answers the question there are three routes: a combined analysis, which stacks result sets rather than joining them; moving to BI Publisher and writing the SQL; or an HCM Extract for genuinely large volumes.

## BI Publisher: pixel-controlled documents

**BI Publisher (BIP)** has two pieces: a data model, which is genuinely SQL against the reporting schema, and a template, which controls layout. Together they produce documents with exact formatting — payslips, salary certificates, statutory forms, letters — and they can be scheduled and delivered. **Bursting** splits one report run into many individual outputs, each delivered separately; it is the mechanism by which thousands of payslips from one payroll run are emailed to the right people, and it is the standard follow-up question after any BIP question.

BIP is more flexible than OTBI and slower to build: it demands stronger SQL, an understanding of entity relationships, manual data-security setup and template development. Reach for it when OTBI genuinely cannot do the job, not by default.

The decision rule, memorized: ad-hoc analysis, dashboards and quick operational lists go to OTBI; formatted, printable, per-employee and statutory documents go to BI Publisher. Using OTBI for a payslip or BIP for a quick headcount list are both wrong answers in an interview.

## What a data model actually looks like

The SQL half of BI Publisher is where the shape of Oracle's tables stops being an abstraction. Almost everything is date-effective, and a query that forgets it returns history as if it were the present.

```
SELECT p.person_number, n.full_name, s.salary_amount
FROM   per_all_people_f      p                                -- _f: date-effective
JOIN   per_person_names_f    n ON n.person_id = p.person_id
JOIN   per_all_assignments_m a ON a.person_id = p.person_id   -- _m: can change twice in a day
JOIN   cmp_salary            s ON s.assignment_id = a.assignment_id
WHERE  n.name_type = 'GLOBAL'
AND    a.primary_flag = 'Y'
AND    a.assignment_type = 'E'
AND    a.effective_latest_change = 'Y'
AND    TRUNC(SYSDATE) BETWEEN p.effective_start_date AND p.effective_end_date
AND    TRUNC(SYSDATE) BETWEEN n.effective_start_date AND n.effective_end_date
AND    TRUNC(SYSDATE) BETWEEN a.effective_start_date AND a.effective_end_date
AND    TRUNC(SYSDATE) BETWEEN s.date_from AND s.date_to
```

Four things in it are worth carrying into every data model. The `_f` suffix marks a date-effective table and `_m` one that can change several times in a single day, so each needs its own "valid today" filter — put the filter on only one of them and two name versions multiplied by three salary versions returns six rows for one person. Salary joins to the assignment rather than to the person, because that is where pay lives, which is also why someone with two assignments has two salaries. `primary_flag = 'Y'` is the same filter the subject-area grain needed, one level lower down. And every `JOIN` here is an inner join, so a new hire whose salary has not been entered yet vanishes from the report entirely rather than appearing with a blank — the failure mode to look for when a count comes back slightly short.

## Extract and REST: the integration boundary

**HCM Extract** pulls HCM data on a schedule and delivers it to an external system — banks, benefits providers, government portals. It supports changes-only extracts, sending only what has changed since the last run, and it is the right tool when a data volume is too large for OTBI. The **REST API** is Oracle's web-service interface for programmatic read and write access, used where a scheduled file would be too slow: recruitment platforms, identity systems, custom applications.

The honest boundary for a functional consultant: HDL, simple formulas, OTBI and basic BIP are routinely expected. Oracle Integration Cloud (OIC) integrations and complex BIP development are where the genuine hand-off to a technical team happens.

[[lab:reporting]]

Two requests that sound like reporting questions are not. Anything coming *into* Oracle in bulk — ten thousand workers for go-live, a mass update of grades — is HCM Data Loader, not a report; the four paths are all exits. And a request to connect a SQL client directly to the database has no answer at all, because a SaaS pod exposes no database connection to anyone. Where the requirement genuinely needs SQL, the SQL lives inside a BI Publisher data model.

[[lab:which-door]]

## Common mistakes

- Using OTBI for a payslip, or BIP for a quick list.
- Trusting a large OTBI result without checking the row limit.
- Picking a subject area by name without checking its grain.
- Assuming direct database access exists.

## Sources

- Oracle, *Creating and Administering Analytics and Reports for HCM* — "HCM Subject Areas for Transactional Business Intelligence". https://docs.oracle.com/en/cloud/saas/human-resources/fahca/hcm-subject-areas-for-transactional-business-intelligence.html
- Oracle, *Creating Analyses and Dashboards in OTBI* — "Combine Subject Areas in Analyses". https://docs.oracle.com/en/cloud/saas/otbi/otbi-user/combine-subject-areas-analyses.html
- HCM Tables, "Oracle Fusion HCM OTBI Subject Areas — Complete Guide with Decision Tree". https://www.hcm-tables.com/blog/otbi-subject-area-guide
- Hexstream, "Oracle Fusion OTBI vs BI Publisher". https://www.hexstream.com/tech-corner/oracle-fusion-otbi-vs-bi-publisher
- SplashBI, "How To Join Two Subject Areas in OTBI". https://splashbi.com/blog/cross-subject-area-otbi-reporting/
