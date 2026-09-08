---
id: model
num: 3
track: functional
title: The Employment Data Model
subtitle: Person → work relationship → assignment. There is no employee table.
hue: 246
minutes: 10
labs: model
terms: person, work-relationship, work-terms, assignment, payroll-relationship, concurrent-employment, global-transfer, worker-types
---

This is the single most important structure in the product. Payroll, absence, security and reporting all read from it. If a new consultant learns only one chapter cold, it should be this one. The core insight: there is no employee table. A human being, that human's relationship to an employer, and the details of the job they do are three separate objects. Knowing which attribute lives on which object is the actual skill.

## Person: the human, held once

The **person** record represents a human being and is held once, globally, across the entire enterprise. It carries what is true of the human regardless of any employer: name, date of birth, national identifier, personal contact details, nationality. A person may work for one company, leave, and return years later, or work for two group companies at once; their date of birth does not change with any of that. Storing it once avoids contradictions. One person record exists per human, no matter how many employments they have had.

## Work relationship: the legal link

A **work relationship** is the link between a person and one legal employer. Oracle describes it as the legal connection between a person and a legal employer, carrying the worker type and the start date of that employment. Terminating employment end-dates the work relationship; it does not delete the person. A person can hold more than one work relationship — for example a contingent-worker relationship with one group company and an employee relationship with another.

The **worker type** recorded on the work relationship is one of employee, contingent worker, pending worker or non-worker. A pending worker is someone hired but not yet started, so that onboarding can begin before day one. A non-worker might be a retiree or a board member. Worker type maps to a payroll relationship type, which decides whether the person is included in payroll runs at all; a contingent worker may be excluded from payroll entirely.

## Assignment: the job details

The **assignment** carries the actual job details: business unit, department, job, position, grade, location, manager, working hours, assignment status, and the standing data payroll reads. Job details change often — promotions, transfers, hours changes — while the person and the employer stay the same, so isolating them in their own date-effective object keeps the history clean. Almost every lifecycle transaction is a dated change against the assignment, which is why a consultant spends most of their configuration life here.

Oracle offers two shapes for the hierarchy. In the **two-tier** model, the default, a work relationship holds assignments directly. In the **three-tier** model an optional layer called **employment terms** (also called work terms) sits between them to group contractual attributes — working hours, grade, collective agreement, contract details — across several assignments. Two-tier is the more common choice in new implementations; the three-tier model exists for organizations that need one set of contractual terms covering multiple assignments. "What is the difference between employment terms and an assignment?" is a standard question: terms group contractual and compensation attributes; the assignment holds the actual job details.

## Payroll relationship: where payroll actually runs

Parallel to this hierarchy sits the **payroll relationship**, which links the person to a payroll statutory unit. It is the highest level of the payroll employment model and groups a person's assignments for statutory calculation and reporting. Tax and social insurance must be calculated on a person's total earnings within a statutory unit, not per assignment — if someone holds two assignments, their social insurance cannot be calculated twice in isolation. Oracle creates the payroll relationship automatically on hire. Payroll processing always occurs at the payroll relationship level, balances aggregate there, and — critically — **balances do not span payroll relationships**.

**Concurrent employment** means one person holding several simultaneous assignments under one work relationship, or several work relationships across different legal employers: a lecturer who also runs a research lab, a doctor employed by a hospital who also works clinic hours. Assignments grouped in one payroll relationship must share the same PSU and person type.

## The canonical worked example: a global transfer

A **global transfer** moves a worker from one legal employer to another, typically across countries. Legally that is a new employment, not an edit to an existing one — different country, different legislation, different statutory registration. The source work relationship is terminated and a new one is created under the destination legal employer; a new payroll relationship is created under the destination PSU, in a different LDG. The person record is unchanged throughout. Because balances never span payroll relationships, year-to-date figures start fresh in the new country.

Be able to narrate this end to end and give the counts at the end: one person record, two work relationships (one ended), two payroll relationships (one ended).

[[lab:model]]

## Common mistakes

- Believing there is an employee table. There is a person, a work relationship and an assignment.
- Confusing termination of a work relationship with deletion of the person. The person survives.
- Assuming every implementation has employment terms. Two-tier omits that layer entirely.
- Thinking payroll runs against the assignment. It runs against the payroll relationship.
- Expecting balances to carry across a global transfer. They do not.

## Sources

- Oracle, *Implementing Global Human Resources* — "Employment Model". https://docs.oracle.com/en/cloud/saas/human-resources/24a/faigh/employment-model.html
- Oracle, *Administering Global Payroll* — "Overview of Administering Payroll Relationships". https://docs.oracle.com/en/cloud/saas/human-resources/23d/faapq/overview-of-administering-payroll-relationships.html
- Future Proof Technologies, "HCM Employment Model in Oracle Fusion HCM Cloud". https://medium.com/@futureprooftrainings/hcm-employment-model-in-oracle-fusion-hcm-cloud-0ec24a4e638a
