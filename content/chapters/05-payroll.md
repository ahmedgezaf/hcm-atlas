---
id: payroll
num: 5
track: functional
title: The Payroll Object Chain
subtitle: Element → eligibility → entry → run → balance → prepayment → payment → costing
hue: 152
minutes: 11
labs: payroll
terms: element, element-classification, element-eligibility-element-link, element-entry, input-value, balance, salary-basis, payroll-definition, payroll-run, quickpay, prepayments, payment-process-bank-file, costing, parallel-run
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

## Running it

A **payroll definition** is the calendar: frequency, period start and end dates, cut-off dates and payment date — "Egypt Monthly Payroll, calendar months, cut-off on the 25th, paid on the last working day." A person must be assigned to a payroll, on the assignment, before they can be processed.

The **payroll run** (Calculate Payroll) is the engine that calculates gross-to-net for a population for a period: it evaluates elements, applies formulas, and produces run results and balances, held against the payroll relationship. Errors at this stage typically point to missing entries, missing eligibility or formula problems. **QuickPay** runs the same calculation for a single person outside the main run — the primary testing tool during configuration (change an element, QuickPay one employee, check the result) and the mechanism for off-cycle payments such as a final settlement.

A **balance** is an accumulated total of element results over a period and dimension: gross pay year-to-date, taxable earnings month-to-date. Balances have dimensions (period-, month-, quarter-, year-to-date) and scope (assignment or relationship level). Statutory calculations, payslips and reports all depend on them, and when a report shows a wrong total the balance feed is usually where the problem lives. Balances do not span payroll relationships — which is why year-to-date figures reset on a global transfer.

## After the run

Calculation and payment are separate steps. **Prepayments** takes the run results and distributes them across each person's payment methods — someone may split their salary across two bank accounts. It runs after the payroll run and before the payment process, and it is the step people forget exists until a payment fails. Oracle's standard flow then archives the results, generates payslips, and produces the payments: the **payment process** creates the bank file. In Saudi Arabia and the UAE, the file must follow the Wage Protection System SIF format (Chapter 17), and a Gulf go-live always includes a bank-file test with the actual bank. The bank file is a common cause of go-live delay; never treat it as an afterthought.

**Costing** allocates payroll results to accounting segments so the cost lands in the right place in the general ledger, broken down by department, project or cost centre. It is the bridge between HCM and Finance and is often owned jointly with a finance consultant.

[[lab:payroll]]

## Proving it works: the parallel run

A **parallel run** executes the new system's payroll alongside the legacy payroll for the same period and reconciles the two line by line. It is the only reliable proof that the new payroll is correct before the old one is switched off, and it typically runs for two or three consecutive months before go-live. Differences must be explained, not just noted. It is also the highest-stakes activity before go-live, and the point where a consultant with analytical instincts is visibly useful.

## Common mistakes

- Creating an element and expecting it to appear on payslips. Nothing happens until eligibility exists and an entry is made.
- Confusing eligibility (who could) with entry (who does).
- Forgetting prepayments sits between calculation and payment.
- Treating the bank file as a formality.
- Believing go-live means done. Hypercare and the first live payroll are the finish line.

## Sources

- Oracle, *Administering Payroll* — "Payroll Processes" (calculate, prepayments, archive, payments). https://docs.oracle.com/en/cloud/saas/human-resources/21a/faaus/payroll-processes.html
- Oracle, *Implementing Global Payroll* — "Overview of Payroll Costing". https://docs.oracle.com/en/cloud/saas/human-resources/faigp/overview-of-payroll-costing.html
- Oracle, *Administering Global Payroll* — "Overview of Administering Payroll Relationships". https://docs.oracle.com/en/cloud/saas/human-resources/23d/faapq/overview-of-administering-payroll-relationships.html
