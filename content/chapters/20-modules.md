---
id: modules
num: 20
domain: hcm
track: functional
title: The Modules Next Door
subtitle: Enough of the rest of the suite to follow the conversation
hue: 170
minutes: 11
labs: 
terms: requisition-and-job-offer, onboarding-journey, compensation-plan, benefits-enrolment, goal-and-performance-document, talent-review-and-succession
---

This atlas teaches three modules: core HR, absence and payroll. They are what a junior functional consultant in Egypt is hired to do, and depth in them is worth more than breadth across the suite. But a client's HR director will list Recruiting, Benefits and Goals in the same sentence as payroll, a screening call will ask which modules you have worked with, and a workshop will reach a point where somebody says "that comes from Recruiting" and the room moves on.

This chapter is vocabulary and seams, not depth. The aim is to follow the conversation, know what to ask, and know where the handover sits — and to say plainly, when asked, that you have not configured these. Claiming otherwise is the one thing that ends an interview badly.

## Recruiting

Oracle Recruiting Cloud handles hiring up to the point someone becomes an employee. The words in the room are **requisition** (the approved vacancy), candidate, and **job offer** — and offers have their own approval rules, separate from the HR approvals in Chapter 19, because an offer is a commercial commitment rather than a record change.

The seam matters more than the module. When an offer is accepted, the candidate becomes a **pending worker** or an employee, and that act creates the work relationship and assignment of Chapter 3 — so the data quality in a requisition becomes the data quality in your core HR record. Job, grade, department, legal employer and start date are all chosen in Recruiting by people who are not thinking about payroll. In Egypt this is where the national identifier should be captured, because the alternative is chasing it after the hire.

What Core HR owes Recruiting: the structures to pick from. What Recruiting writes back: the person, and the first version of almost every attribute.

## Onboarding

Onboarding is the checklist between offer and first day, delivered as a **journey** — the task-list feature introduced in Chapter 14. Tasks can be assigned to the new hire, the manager, IT and HR, with due dates relative to the start date.

The seam is the pending worker: the record exists before day one so documents can be collected, equipment ordered and accounts created, and it converts to an employee on the start date. Egyptian onboarding usually has a statutory tail — the social-insurance registration and the labour-office file of Chapter 9 — which is a good use of a journey precisely because it is a checklist somebody currently keeps on paper.

## Compensation

Oracle Compensation covers how pay changes, as distinct from how it is paid. The vocabulary: **compensation plan**, the annual cycle or off-cycle event; budgets pushed down a management hierarchy; eligibility; worksheets that managers complete; and approvals before anything reaches the record.

The seam is the salary record of Chapter 5. A compensation cycle writes salary, and payroll reads it — which is why a client who runs annual increases in a spreadsheet and loads the results is doing with HDL what this module exists to do. Worth knowing when the question is whether to buy it.

## Benefits

Benefits manages plans people enrol in: medical cover, life insurance, allowances structured as plans. The vocabulary: plan, option, **enrolment**, life events — the triggers (new hire, marriage, a new child) that open an enrolment window.

The seam is payroll. An enrolment produces an element entry for the employee contribution and often an employer cost, so the plan design decides what appears on the payslip. In Egypt private medical cover sits alongside the statutory universal health insurance of Chapter 9 rather than replacing it, and clients routinely conflate the two in a workshop.

## Performance and goals

Performance manages the review cycle through a **performance document** — a template, a period, a set of competencies and ratings, and a workflow between worker and manager. Goals manages objectives, aligned up a hierarchy and often cascaded.

The seam into core HR is thinner than people expect: ratings mostly stay in the module, feeding compensation and talent rather than the employment record. The connection worth naming is the review period against the probation period of Chapter 8 — clients frequently want the probation decision to come out of a performance document.

## Talent review and succession

Talent management covers the review meeting itself — the nine-box grid of performance against potential — and **succession plans** that name candidates for critical positions.

The seam is positions, from Chapter 2. Succession is one of the few genuine arguments for managing by position rather than by job, because a succession plan is a plan for a seat. A client who wants succession and has no positions is asking for two things.

## Learning

Oracle Learning delivers and tracks courses: catalogue, learning item, assignment, completion. The seam is compliance — mandatory training with a completion deadline, which in practice means a report that proves it, and sometimes a journey task that will not close until the course is done.

## What a junior is most likely to be put on next

In Egypt and the Gulf, after core HR, absence and payroll, the usual next step is Recruiting or Benefits — Recruiting because almost every client buys it and it touches the hire, Benefits because medical cover is close to payroll and the questions arrive through the payroll team anyway. Compensation tends to follow once the core is stable, and Learning and Talent are often a later phase or never.

The honest version of this chapter in an interview is one sentence: these are the modules, this is where each one touches what I have built, and I have not configured them.

## Common mistakes

- Claiming module experience from vocabulary. An interviewer's second question settles it.
- Treating offer approvals as the same rule set as HR approvals.
- Designing core HR without asking what Recruiting will write into it.
- Letting a benefits plan be designed without payroll in the room, then discovering the element.
- Promising succession planning to a client who manages by job and has no positions.
- Assuming private medical cover replaces Egypt's statutory health insurance.

## Sources

- Oracle, *Oracle Fusion Cloud HCM* documentation library — the module guides named in this chapter. https://docs.oracle.com/en/cloud/saas/human-resources/index.html
- Oracle, *Implementing Global Human Resources* — pending workers, and the point at which a candidate becomes a worker. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
