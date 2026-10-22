---
id: reporting
minutes: 32
---

There is no SQL Developer connection to a SaaS pod. When someone asks how to get data out of Oracle HCM, the complete answer names four paths and a reason for each: OTBI for ad-hoc analysis, BI Publisher for formatted output and complex SQL, HCM Extract for scheduled or large-volume outbound files, and REST for real-time integration.

Naming the four is the interview answer. Knowing which to reach for, and what each one does to data security on the way out, is the job.

## OTBI: self-service against live data

**Oracle Transactional Business Intelligence (OTBI)** is ad-hoc reporting and analysis directly against live HCM data, built by dragging fields rather than writing SQL. It works through **subject areas**: pre-built, governed logical data models — think of them as pre-joined tables exposed as folders and columns — each covering a business domain at a fixed grain. Names follow a pattern of functional area, then grain, then "Real Time": *Workforce Management — Worker Assignment Real Time*, *Workforce Management — Person Real Time*, *Payroll — Payroll Run Results Real Time*. Reading the name tells you the grain before you open it, and "Real Time" areas give a current snapshot while "Trend" areas give data across periods.

Inside a subject area, columns divide into dimensions — the things you group and filter by, such as department, job, legal employer — and facts, the things that are counted or summed. A report is a choice of dimensions, a choice of facts, and a set of filters, and most of the craft is in the first choice rather than the last.

## Grain is the whole game

Choosing the right subject area is most of the work, and choosing wrong is the number-one cause of reports that return wrong numbers rather than errors. Date-effective tables multiply rows; multiple assignments double-count people unless filtered to the primary, latest record.

The discipline that prevents it is one sentence long: say what a single row means before trusting any number built on it. In *Worker Assignment Real Time* a row is one dated version of one assignment, so a person promoted twice appears three times and a person holding two jobs appears twice again. Neither is a data error — the history is correct and the second assignment is real — but a row count answers "how many assignment versions", not "how many people". Filtering to the current dated row and to the primary assignment turns one into the other, at the cost of hiding the second job, which is why headcount and workload have to be asked for separately.

[[lab:grain-trap]]

The habit that catches this before a client does: build every new analysis with a count of distinct person numbers beside the count of rows. If the two agree, the grain is one row per person. If they do not, something is multiplying, and the question is whether that something is wanted. It takes thirty seconds and it has saved more reputations than any amount of SQL.

A second habit, for anything that will be quoted to management: reconcile the number to something the business already believes. A headcount that cannot be tied to a figure the HR director already uses will not be trusted whatever its provenance, and the reconciliation usually surfaces a definition disagreement (Chapter 7) rather than a technical error.

## The three constraints, and the workarounds

Three constraints catch people.

Two subject areas cannot be joined in a single analysis. There is a default row limit — commonly cited around 65,000 — past which OTBI can truncate silently, which is the worst failure mode available: a plausible answer that is simply short. And subject areas are predefined; their grain cannot be changed.

When one subject area is not enough there are three workarounds: a Combined Analysis joining two analyses on a shared key such as person number; moving to BI Publisher and writing the SQL; or an HCM Extract for genuinely large volumes.

Combined analysis deserves a caution. It stitches result sets rather than joining tables, which means both halves must return compatible columns in compatible order, and the join key has to be genuinely unique on both sides. It is the right tool for "headcount from one area beside absence days from another", and the wrong tool for anything where the two halves have different grains — in which case the combination multiplies in a way that is hard to see.

The row limit is worth building a habit around too: for any analysis that might approach it, check the row count against the same filters in a second, smaller analysis, or add a total that would obviously be wrong if rows were missing. Silent truncation is only silent if nobody listens for it.

## OTBI and security

A property of OTBI that is easy to take for granted and important to be able to state: an analysis returns only the data the person running it is allowed to see. The subject areas respect HCM data security, so the same report run by a line manager and by an HR director returns different populations without either of them doing anything.

That is both a feature and a source of support tickets. "The report is wrong, it only shows twelve people" is usually a correct report run by somebody whose security profile covers twelve people (Chapter 15). The diagnostic question is not about the report at all: it is who ran it, and what their roles grant.

It also means a report cannot be fully tested by the person who built it, because that person is usually an administrator who can see everything. Testing a report means running it as a representative of each audience, which is a step teams skip and then discover in production.

## BI Publisher: pixel-controlled documents

**BI Publisher (BIP)** has two pieces: a data model, which is genuinely SQL against the reporting schema, and a template, which controls layout. Together they produce documents with exact formatting — payslips, salary certificates, statutory forms, letters — and they can be scheduled and delivered.

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

Two more habits belong in any data model that will be run more than once. Parameterise the date rather than using the system date, so the report can be re-run for a past period and produce what it produced then. And expose the filters the business will ask for — legal employer, department, payroll — as parameters rather than hard-coding them, because the alternative is five copies of the same report.

## The security hole in a BI Publisher data model

This is the most important paragraph in the chapter, and it is the one most often missed.

**A data model that selects directly from a table returns data without HCM data security applied.** OTBI inherits the running user's security; a BIP SQL query, by default, does not. A payslip report written as a straightforward select will happily return every employee's pay to whoever can run it.

The supported way to get the security back is to **join to a secured list view** rather than to the base table, so that the rows returned are determined by the security profiles of the roles of the user running the report. Oracle documents views for this purpose — a person-secured list view and a payroll-secured list view among them — and the names should be confirmed against the current documentation for the release, because much of the available material on this topic is old.

Two further protections are worth knowing. Tables holding personal identifying information — addresses, national identifiers, passports, visas and permits — carry a database-level policy, so only authorised users can report on them, and that applies to BI Publisher as much as to anything else. And the privilege that allows somebody to write and run SQL in a data model is itself a substantial grant: Oracle's own guidance is to treat it as a development privilege, to restrict it to trusted individuals in test environments, and to think hard before granting it in production at all.

The consulting takeaway: when a client asks for a BI Publisher report, the data-security design is part of the requirement, not an afterthought. "Who may run this, and whose data should it return" has to be answered before the SQL is written, and the answer has to be implemented in the query.

Report access itself is secured separately again — catalog folders through roles, individual reports through function privileges — which means a complete answer has three parts: who can open the report, what the query returns, and which fields are personal data.

## Templates, and the one that makes bank files

The template half of BI Publisher decides the output, and the formats are worth knowing by name because they map to different requirements.

An **RTF template** is the usual one: built in a word processor, with placeholders, producing PDF, HTML, Word or Excel. This is what a payslip, a salary certificate or an employment letter is built from.

An **Excel template** produces a spreadsheet with controlled layout, which is what to reach for when the recipient's next action is to work with the numbers rather than read them.

And an **eText template** is the one most consultants have never used and most Gulf projects need. It is an RTF-based template that produces a structured *text* file to a fixed specification, built for electronic funds transfer and electronic data interchange — which is to say, for bank files. When Chapter 5 says the Wage Protection System file has to match the bank's specification exactly, an eText template is the delivered mechanism for producing it.

That connection is worth making explicitly during design, because the alternative that teams reach for — generating a file some other way and formatting it by hand — is how a go-live gets delayed by a rejected file.

## Bursting and delivery

**Bursting** splits one report run into many individual outputs, each delivered separately; it is the mechanism by which thousands of payslips from one payroll run are emailed to the right people, and it is the standard follow-up question after any BIP question.

The mechanics are worth one level of detail. Bursting is driven by a query that returns, for each output, the key to split on and the delivery instructions — who it goes to, by what channel, with which template. That means the email address, the delivery method and even the template can vary per employee, which is how one payslip report serves a population split between email and print.

Delivery channels beyond email include file transfer to a server, which is the usual route for a bank file or a statutory submission, and printing. Scheduling turns the whole thing into an unattended job, which is what moves a payslip run from a task somebody remembers to a step in the payroll flow (Chapter 5).

## HCM Extract: the scheduled outbound file

**HCM Extract** pulls HCM data on a schedule and delivers it to an external system — banks, benefits providers, government portals. It supports changes-only extracts, sending only what has changed since the last run, and it is the right tool when a data volume is too large for OTBI.

The structure of an extract is worth knowing because it is unlike the other three. An extract is defined as a set of **blocks** and **records** describing the data to be pulled, with **criteria** deciding which people are included — and the criteria can be a Fast Formula (Chapter 12), which is how an arbitrary population rule gets expressed. The output is structured data that a template then formats, so an extract and a BI Publisher template are frequently used together: the extract decides *what*, the template decides *how it looks*.

Two capabilities make it the right answer for integrations rather than reports. **Changes-only** mode sends what has changed since the last successful run, which is what a downstream system usually wants and what keeps file sizes sane. And the run is archived, so what was sent on a given date can be inspected later — which matters enormously when a third party disputes what they received.

The cost is build time. An extract is a real piece of configuration with a design, a test cycle and a delivery mechanism, and it is not something to reach for when somebody wants a list.

## REST: real time, record by record

The **REST API** is Oracle's web-service interface for programmatic read and write access, used where a scheduled file would be too slow: recruitment platforms, identity systems, custom applications.

The shape of it is conventional: resources for workers, assignments, absences and the rest, with query parameters to filter, to choose which fields come back, and to page through results. Two details are specific enough to be worth knowing. Date-effective resources take a header that says *as of when* and, for a correction, the exact range being corrected — the same update-versus-correction choice as everywhere else in the product (Chapter 4). And responses carry links to related resources, so a client application can traverse from a worker to their assignments without constructing URLs by hand.

REST is the right answer for real-time, low-volume, record-at-a-time integration: create a worker when a candidate is hired, read a person's details when an identity system provisions an account, update an absence from a mobile app. It is the wrong answer for bulk: ten thousand records through a record-at-a-time API is slow, fragile and hard to restart, which is what HDL and Extract exist for.

For change-driven integration without polling, there are also atom feeds, which publish events — a hire, a termination, an assignment change — that a subscriber can consume. Where a client asks "how does the identity system know somebody left", that is usually the better answer than a nightly extract.

## Choosing, as a decision tree

The question to ask first is not which tool but **which direction and what shape**.

Data coming *in*, in bulk, is HCM Data Loader (Chapter 11) and not a reporting question at all.

Data going *out*: is it a document for a human, formatted exactly? BI Publisher. Is it a file for a machine, on a schedule, possibly large, possibly changes-only? HCM Extract — with an eText or other template if the format is fixed. Is it a record-at-a-time exchange that has to happen now? REST, or an atom feed if it is event-driven. Is it a person asking a question of the data? OTBI.

And one more branch that saves a great deal of work: is it a question somebody already answered? A catalogue of existing reports, checked first, is faster than any of the four.

[[lab:reporting]]

## Two requests that are not reporting questions

Anything coming *into* Oracle in bulk — ten thousand workers for go-live, a mass update of grades — is HCM Data Loader, not a report; the four paths are all exits.

And a request to connect a SQL client directly to the database has no answer at all, because a SaaS pod exposes no database connection to anyone. Where the requirement genuinely needs SQL, the SQL lives inside a BI Publisher data model.

A third is worth adding, because clients ask for it in good faith: a request to "just give us a copy of the database" for the client's own warehouse. The supported shapes for that are a scheduled extract, or one of Oracle's own analytics products that maintain a warehouse from the application. What it is not is a database export, and saying so early is kinder than saying it late.

[[lab:which-door]]

## Governance: the catalogue nobody owns

A year after go-live, every implementation has more reports than it needs, several of which disagree.

Three practices prevent most of it. Name reports so that the owner, the audience and the purpose are visible, because an unlabelled report is a report nobody dares delete. Keep a short list of *official* numbers — headcount, turnover, payroll cost — with one report each, blessed and documented (Chapter 7), so that a disagreement has an arbiter. And give somebody the job of pruning, with the authority to do it.

The consulting contribution here is small and disproportionately valuable: at the end of an implementation, hand over a catalogue of what was built, what each report is for, who may run it and what its numbers mean. That document is what stops the client from rebuilding everything in year two.

## Common mistakes

- Using OTBI for a payslip, or BIP for a quick list.
- Trusting a large OTBI result without checking the row limit.
- Picking a subject area by name without checking its grain.
- Counting rows where distinct people were meant.
- Combining two analyses with different grains and multiplying the result.
- Testing a report only as an administrator, so its security is never exercised.
- Writing a BI Publisher data model straight against base tables and shipping a report with no data security at all.
- Treating the privilege to write SQL in a data model as an ordinary report-building grant.
- Hard-coding the effective date in a data model, so the report cannot be re-run for a past period.
- Building a bank file by hand when an eText template is the delivered mechanism.
- Reaching for REST to move ten thousand records.
- Polling for changes on a schedule where an event feed exists.
- Assuming direct database access exists.
- Leaving behind a report catalogue with no owner, no naming and no blessed numbers.

## Sources

- Oracle, *Creating and Administering Analytics and Reports for HCM* — "HCM Subject Areas for Transactional Business Intelligence". https://docs.oracle.com/en/cloud/saas/human-resources/fahca/hcm-subject-areas-for-transactional-business-intelligence.html
- Oracle, *Creating and Administering Analytics and Reports for HCM* — data model security, secured list views and the PII tables protected at database level. https://docs.oracle.com/en/cloud/saas/human-resources/fahca/index.html
- Oracle, *Data Modeling Guide for Oracle Business Intelligence Publisher* — data models, bursting and delivery. https://docs.oracle.com/middleware/12211/bip/BIPDM/BIPDM.pdf
- Oracle, BI Publisher — "Creating an eText Template", for the template type used to produce EFT and EDI files. https://docs.oracle.com/cd/E10091_01/doc/bip.1013/b40017/T421739T481436.htm
- HCM Tables, "Oracle Fusion HCM OTBI Subject Areas — Complete Guide with Decision Tree". https://www.hcm-tables.com/blog/otbi-subject-area-guide
- Hexstream, "Oracle Fusion OTBI vs BI Publisher". https://www.hexstream.com/tech-corner/oracle-fusion-otbi-vs-bi-publisher
- SplashBI, "How To Join Two Subject Areas in OTBI". https://splashbi.com/blog/cross-subject-area-otbi-reporting/
