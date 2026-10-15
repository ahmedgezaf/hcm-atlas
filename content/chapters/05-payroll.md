---
id: payroll
num: 5
domain: hcm
track: functional
title: The Payroll Object Chain
subtitle: Element → eligibility → entry → run → balance → prepayment → payment → costing
hue: 152
minutes: 18
labs: payroll, payslip, balances, parallel-run
terms: element, element-classification, element-eligibility-element-link, element-entry, input-value, balance, salary-basis, payroll-definition, payroll-run, quickpay, prepayments, payment-process-bank-file, costing, parallel-run, salary-record, salary-component, rate-definition, time-card, payroll-flow, mark-for-retry-and-roll-back
---

Payroll in Oracle is a chain of objects, each depending on the one before it. A consultant who can recite the chain and explain what breaks when a link is missing can debug most payroll problems without opening a log. The chain runs: element → element eligibility → element entry → payroll run → balance → prepayment → payment → costing.

## Defining what can be paid

An **element** is the definition of a single thing that can appear on a payslip: a salary, an allowance, a deduction or an informational item. Payroll is built from named, individually configured components — "Basic Salary", "Transport Allowance", "Social Insurance Employee Contribution", "Loan Deduction" — rather than one monolithic calculation, so that each can carry its own rules, taxability and reporting treatment. Elements live inside one LDG and must be rebuilt per country. Every payslip line traces back to an element, and reading a client's element list is one of the first tasks on a project.

Each element has a **classification** — earnings, deduction, information — which controls processing order and how the element feeds balances. Payroll must process earnings before it can calculate deductions based on them, so classification drives sequencing: standard earnings, supplemental earnings, pre-statutory deductions, statutory deductions, voluntary deductions. When a calculation runs in the wrong order, classification and processing priority are the first things to check.

An element's **input values** are the fields that hold the data the calculation needs — amount, rate, percentage, units. A "Loan Deduction" element might carry input values for total loan amount, monthly instalment and remaining balance. Deciding an element's input values is a core design decision recorded in the configuration workbook.

## Who can get it, and who does

Creating an element does nothing on its own. **Element eligibility** (historically "element link") defines which population the element applies to, by criteria such as payroll, legal employer, grade, job or department: "Car Allowance is eligible for grade G7 and above in the Cairo business unit." Without eligibility, an element cannot be given to anyone. This is the most common cause of "why can't I add this allowance to this employee?" — the answer is almost always that eligibility does not cover them. Eligibility defined too narrowly at build time is considerably messier to widen once entries exist.

An **element entry** is the actual attachment of an element to a specific person, with values and dates: a transport allowance of EGP 800 per month effective 1 March. Eligibility says who *could* receive something; the entry says who *does*, and how much. Entries can be created manually, loaded in bulk with HCM Data Loader (Chapter 11), or generated automatically.

The **salary basis** decides how salary is stored, quoted and paid — annual, monthly or hourly — and which element it feeds. An annual basis stores EGP 240,000 and pays EGP 20,000 monthly. Getting the basis wrong multiplies or divides everyone's pay by twelve, so always confirm how the client quotes salary in offer letters before configuring it.

## Salary, and where it actually lives

Salary is held as a dated **salary record** on the assignment, and Oracle derives the element entry from it through the salary basis. That direction matters: a raise is entered on the salary page and the entry follows, never the other way round. Editing the derived entry directly leaves the salary page and the payslip telling different stories about the same person, and nothing in the system flags the disagreement — it surfaces when somebody compares a letter to a payslip.

Most Gulf offers are not quoted as one number. They are quoted as basic plus housing plus transport, and that split is what **salary components** are for: an itemised breakdown held against the salary record rather than as separate manual entries. The split is a statutory question, not a presentational one, because the contributable wage in Chapter 17 and the UAE gratuity base in Chapter 18 are both computed from particular components. Designing the components to match how the client's offer letters are written is therefore part of getting end-of-service right, and it is much harder to change afterwards than before.

**Rate definitions** convert between the stored figure and the figure a process needs — an annual salary into an hourly rate for overtime, a daily rate for an absence payment, a monthly rate for a liability accrual. Grade rates, promised in Chapter 2, attach ranges or step values to grades so that pay governed by grade is validated against the band rather than typed in free. A client whose pay is individually negotiated rarely needs them; one in the public sector or a large Gulf group almost always does.

## The hours side of pay

The functional track promises money, time and law, and time so far has meant leave. Hours are the other half, and they reach payroll in one of three ways: a time card in Oracle Time and Labor, an interface from a biometric or shift system, or a bulk load (Chapter 11). Choosing between them is a design decision with an owner and a cost, and it is worth making explicitly rather than discovering in the first run that attendance arrives as a spreadsheet somebody emails.

An overtime element needs two things: a rate source, which is a rate definition, and a multiplier, which is statutory rather than negotiable. Under Egypt's Labour Law 14/2025 overtime is paid at no less than 35% above the normal hourly wage for daytime hours and 70% for night hours, with total presence at the workplace capped at twelve hours a day. Saudi Arabia's Article 107 sets overtime at 150% of the hourly wage. Sources disagree on two points worth flagging rather than resolving: whether the Saudi calculation runs on basic or total wage, and whether Egyptian rest-day work is compensated as an extra day's wage plus a substitute day off or as double pay. Both were checked in 2026 and both belong in a client's written legal position before an element is built.

The design question that settles the shape is whether the client pays by the hour or by the month. An hourly salary basis fed by time cards computes pay from hours every period; a monthly salary with an overtime element computes a fixed amount plus exceptions. They produce the same payslip in an ordinary month and behave completely differently in a month with unpaid leave, a mid-month joiner or a strike of overtime claims.

## Running it

A **payroll definition** is the calendar: frequency, period start and end dates, cut-off dates and payment date — "Egypt Monthly Payroll, calendar months, cut-off on the 25th, paid on the last working day." A person must be assigned to a payroll, on the assignment, before they can be processed.

The **payroll run** (Calculate Payroll) is the engine that calculates gross-to-net for a population for a period: it evaluates elements, applies formulas, and produces run results and balances, held against the payroll relationship. Errors at this stage typically point to missing entries, missing eligibility or formula problems. **QuickPay** runs the same calculation for a single person outside the main run — the primary testing tool during configuration (change an element, QuickPay one employee, check the result) and the mechanism for off-cycle payments such as a final settlement.

A **balance** is an accumulated total of element results over a period and dimension: gross pay year-to-date, taxable earnings month-to-date. Balances have dimensions (period-, month-, quarter-, year-to-date) and scope (assignment or relationship level). Statutory calculations, payslips and reports all depend on them, and when a report shows a wrong total the balance feed is usually where the problem lives. Balances do not span payroll relationships — which is why year-to-date figures reset on a global transfer.

## After the run

Calculation and payment are separate steps. **Prepayments** takes the run results and distributes them across each person's payment methods — someone may split their salary across two bank accounts. It runs after the payroll run and before the payment process, and it is the step people forget exists until a payment fails. Oracle's standard flow then archives the results, generates payslips, and produces the payments: the **payment process** creates the bank file. In Saudi Arabia and the UAE, the file must follow the Wage Protection System SIF format (Chapter 17), and a Gulf go-live always includes a bank-file test with the actual bank. The bank file is a common cause of go-live delay; never treat it as an afterthought.

**Costing** allocates payroll results to accounting segments so the cost lands in the right place in the general ledger, broken down by department, project or cost centre. It is the bridge between HCM and Finance and is often owned jointly with a finance consultant.

## Running it is a flow, not a button

Calculate Payroll is not a button; it is a **payroll flow** — a sequenced set of tasks with a checklist, owners and a status for each step. Submitting the flow starts it, and the checklist is where a stuck task is seen. On a real cycle the flow is what the payroll team watches, and the consultant's job in hypercare is usually reading it rather than reading a log.

When something is wrong, three corrections do different things. **Mark for retry** flags the records that failed so the next retry picks up only those. **Retry** re-processes them after the cause is fixed. **Roll back** removes the results entirely, as though the process had not run. The order constraint is the part to know: once prepayments have locked a run's results, the run cannot be rolled back until the prepayments are rolled back first. Corrections therefore unwind in the reverse of the order they were made, and a team that tries to roll back a run with prepayments sitting on top of it gets an error that reads like a bug and is not.

Where the cost lands is the other half of finishing a cycle. Costing allocates results to accounting segments through the cost allocation flexfield, with values held at several levels — the payroll, the department, the element eligibility — and the most specific one winning. The results then move to the general ledger through Transfer to Subledger Accounting and Create Accounting, which is the point at which Finance sees payroll at all. A costing design that is merely plausible produces a month-end reconciliation that nobody can explain, which is why the finance consultant belongs in that conversation from the start rather than at the end.

[[lab:payroll]]

The failures worth rehearsing are the quiet ones. A person not assigned to a payroll is skipped by the run without an error. A salary basis that says monthly while the annual figure was loaded against it pays twelve times the intended salary, and the run reports nothing, because it calculated exactly what it was given. A deduction classified as an earning is added to gross instead of taken off it. None of these produce a failure message; all of them produce a payslip.

[[lab:payslip]]

[[lab:balances]]

## Proving it works: the parallel run

A **parallel run** executes the new system's payroll alongside the legacy payroll for the same period and reconciles the two line by line. It is the only reliable proof that the new payroll is correct before the old one is switched off, and it typically runs for two or three consecutive months before go-live. Differences must be explained, not just noted. It is also the highest-stakes activity before go-live, and the point where a consultant with analytical instincts is visibly useful.

Two habits separate a reconciliation that proves something from one that merely documents. The first is reading every line rather than the exceptions someone has already flagged, because a difference nobody noticed is exactly the one that reaches hypercare. The second is remembering what the exercise can and cannot prove: a matching line proves the new system agrees with the old one, not that either agrees with the client's policy. Where legacy is wrong — an out-of-date insurable-wage ceiling, an allowance paid flat that policy says is a percentage — the correct outcome is a difference, raised with the client rather than configured away.

[[lab:parallel-run]]

## Common mistakes

- Creating an element and expecting it to appear on payslips. Nothing happens until eligibility exists and an entry is made.
- Confusing eligibility (who could) with entry (who does).
- Forgetting prepayments sits between calculation and payment.
- Treating the bank file as a formality.
- Believing go-live means done. Hypercare and the first live payroll are the finish line.

## Sources

- Oracle, *Administering Payroll for the United States* — the "Payroll Processes" chapter, for the calculate, prepayments, archive and payment sequence, which is the same in every localization. https://docs.oracle.com/en/cloud/saas/human-resources/faaus/index.html
- Oracle, *Implementing Global Payroll* — "Overview of Payroll Costing". https://docs.oracle.com/en/cloud/saas/human-resources/faigp/overview-of-payroll-costing.html
- Oracle, *Implementing Global Payroll* — "Payroll Relationship Rules". https://docs.oracle.com/en/cloud/saas/human-resources/faigp/payroll-relationship-rules.html
