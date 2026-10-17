---
id: workforce
num: 2
domain: hcm
track: functional
title: Workforce Structures
subtitle: Jobs, positions, grades — what work exists and at what level
hue: 200
minutes: 12
labs: jobpos
terms: job, position, grade, grade-step, job-family, position-synchronization, grade-rate, job-profile
---

If Chapter 1 is the compliance skeleton, this is the work skeleton: how an organization defines what work exists, at what level, and in which seat. One distinction in this chapter — job versus position — is the most frequently tested concept in Oracle HCM interviews, and the fastest way to look unprepared in front of a trainer is to treat the two as synonyms.

## Job: what the work is

A **job** is a generic definition of a role, independent of the organization chart. It carries attributes such as a grade range, required qualifications and a job family. Most roles repeat across an organization, so defining "Accountant" once and reusing it everywhere avoids duplicating the same definition dozens of times. The Finance department in Cairo, the plant in 10th of Ramadan City and the Alexandria branch can all use the same job. In a job-based (non-position) organization, the assignment carries job, department and location as separate fields; this is the common pattern in Egyptian private companies.

Jobs are set-enabled (Chapter 1), which means the jobs a transaction can select depend on the reference data sets assigned to its business unit. A client who wants one job catalogue across the group puts jobs in the Common Set; a client whose divisions genuinely use different catalogues accepts duplicate maintenance in exchange for separation. That choice is made once and lived with.

## Position: a specific seat

A **position** is a specific, individual seat: a job tied to a particular department and location, which exists whether or not anyone currently fills it. "Accountant #3, Finance Department, Alexandria Plant" carries its own headcount budget, reporting line and FTE. When the incumbent leaves, the position remains and becomes vacant — and a vacancy is a real, reportable thing.

Organizations that budget headcount need to track seats independently of people. Position management is therefore standard in government, oil and gas, banking and most Gulf entities. It brings vacancy reporting and stricter headcount control, at the cost of more setup and maintenance. A consultant aiming at the Gulf market should learn position management properly rather than treating it as an optional extra.

[[lab:jobpos]]

## Choosing between them, out loud

The decision is not about tidiness, and a consultant who can run it as four questions will sound like someone who has made it before.

Does the client budget and approve headcount by seat? Positions carry that; jobs do not. Do they need to see that a seat exists while it is empty — for recruitment, for a vacancy report, for a finance review? Only positions make a vacancy visible. Do approvals or succession depend on the seat rather than the person (Chapters 19 and 20)? A position hierarchy and a succession plan are both plans for seats. And is there an owner for the maintenance, because every reorganization becomes position work?

Three yeses and an owner mean positions. One yes and no owner means jobs, and the client is better served by a clear job catalogue than by a position structure that decays within a year.

## Position synchronization

Where positions are used, **position synchronization** decides how much of the position flows down to the assignment: job, department, location, grade, manager, FTE. With it on, the position is the master — changing the position updates every assignment attached to it — and the configuration question is which attributes are synchronized and whether an individual assignment may override them.

This is where position-based clients get into trouble. Synchronization turned on with no override produces a reorganization that rewrites a thousand assignments correctly and instantly; the same setting makes a one-off exception impossible without changing the position. Turned off, the position becomes decorative and the two structures drift apart until nobody trusts either. The question to settle in design is which attributes are the position's and which belong to the person in it.

## Grades, steps and rates

A **grade** is a level in the hierarchy, used to control compensation ranges and eligibility for benefits or allowances — "G1" through "G12", or "Junior / Senior / Lead / Principal". They drive eligibility constantly: "only G7 and above get the car allowance" is a sentence a consultant hears and then configures. Grade is not the same as salary. Grade is a level; money attaches to it through **grade rates** and the salary basis (Chapter 5), and the two are linked but distinct objects.

A **grade step** is an increment within a single grade, used where progression happens in defined steps rather than across a continuous range. Steps are grouped into grade ladders. Grade G5 might have steps 1 through 8, each with a defined rate; an annual increment moves a person from step 3 to step 4 without changing their grade. Government and unionized pay scales work this way, which makes steps highly relevant in the Gulf public sector and in Egyptian government-linked entities. If a client has a step-based scale and the design uses a plain grade rate range, the design is wrong.

Rates carry a currency and a date, and both matter in the region. A Gulf group paying in several currencies needs rates per legislative data group rather than one global ladder, and a client whose scale is revised annually needs dated rates rather than overwritten ones — otherwise last year's salary review can no longer be explained.

## Job families and profiles

A **job family** groups related jobs — all finance jobs, all engineering jobs — for career-path design, reporting and shared eligibility rules. A **job profile** is the content side of a job: the competencies, qualifications and responsibilities attached to it, which Talent and Recruiting read (Chapter 20). Both are recognition-level for a Core HR build and become central the moment a client adds those modules, which is a good reason to create them deliberately rather than leaving the catalogue flat.

One regional note makes them more than theory. Nationalization reporting in Saudi Arabia and the UAE counts nationals in *skilled* roles, and what counts as skilled is read from the job's classification. A job catalogue built without that in mind produces a compliance report that has to be rebuilt later, person by person.

## Common mistakes

- Defining a job as a specific seat. That is a position.
- Choosing positions for tidiness, with nobody owning the maintenance.
- Turning position synchronization on without deciding what an assignment may override.
- Saying "grade equals salary". Grade is a level; rate ranges and the salary basis carry the money.
- Designing a continuous rate range for a client whose scale is actually step-based.
- Overwriting grade rates each year, so last year's review cannot be explained.
- Leaving job classification vague where nationalization reporting depends on it.

## Sources

- Oracle, *Implementing Global Human Resources* — the Jobs and Positions and the Grades, Grade Rates and Grade Ladders chapters. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
- Oracle, *Implementing Global Human Resources* — "Employment Model", for positions and assignments in the employment hierarchy. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/employment-model.html
- Oracle, *Using Common Features for HCM* — reference data sets and how set-enabled objects are shared. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/index.html
