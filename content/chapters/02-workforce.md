---
id: workforce
num: 2
domain: hcm
track: functional
title: Workforce Structures
subtitle: Jobs, positions, grades — what work exists and at what level
hue: 200
minutes: 6
labs: jobpos
terms: job, position, grade, grade-step, job-family
---

If Chapter 1 is the compliance skeleton, this is the work skeleton: how an organization defines what work exists, at what level, and in which seat. One distinction in this chapter — job versus position — is the most frequently tested concept in Oracle HCM interviews, and the fastest way to look unprepared in front of a trainer is to treat the two as synonyms.

## Job: what the work is

A **job** is a generic definition of a role, independent of the organization chart. It carries attributes such as a grade range, required qualifications and a job family. Most roles repeat across an organization, so defining "Accountant" once and reusing it everywhere avoids duplicating the same definition dozens of times. The Finance department in Cairo, the plant in 10th of Ramadan City and the Alexandria branch can all use the same job. In a job-based (non-position) organization, the assignment carries job, department and location as separate fields; this is the common pattern in Egyptian private companies.

## Position: a specific seat

A **position** is a specific, individual seat: a job tied to a particular department and location, which exists whether or not anyone currently fills it. "Accountant #3, Finance Department, Alexandria Plant" carries its own headcount budget, reporting line and FTE. When the incumbent leaves, the position remains and becomes vacant — and a vacancy is a real, reportable thing.

Organizations that budget headcount need to track seats independently of people. Position management is therefore standard in government, oil and gas, banking and most Gulf entities. It brings vacancy reporting and stricter headcount control, at the cost of more setup and maintenance. A consultant aiming at the Gulf market should learn position management properly rather than treating it as an optional extra.

[[lab:jobpos]]

## Grades and steps

A **grade** is a level in the hierarchy, used to control compensation ranges and eligibility for benefits or allowances — "G1" through "G12", or "Junior / Senior / Lead / Principal". Grades carry rate ranges (minimum, midpoint, maximum). They drive eligibility constantly: "only G7 and above get the car allowance" is a sentence a consultant hears and then configures. Grade is not the same as salary. Grade is a level; money attaches to it through rate ranges and the salary basis (Chapter 5), and the two are linked but distinct objects.

A **grade step** is an increment within a single grade, used where progression happens in defined steps rather than across a continuous range. Steps are grouped into grade ladders. Grade G5 might have steps 1 through 8, each with a defined rate; an annual increment moves a person from step 3 to step 4 without changing their grade. Government and unionized pay scales work this way, which makes steps highly relevant in the Gulf public sector and in Egyptian government-linked entities. If a client has a step-based scale and the design uses a plain grade rate range, the design is wrong.

A **job family** groups related jobs — all finance jobs, all engineering jobs — for career-path design, reporting and shared eligibility rules. It is recognition-level for Core HR and becomes more important in Talent Management.

## Common mistakes

- Defining a job as a specific seat. That is a position.
- Saying "grade equals salary". Grade is a level; rate ranges and the salary basis carry the money.
- Designing a continuous rate range for a client whose scale is actually step-based.

## Sources

- Oracle, *Implementing Global Human Resources* — the Jobs and Positions and the Grades, Grade Rates and Grade Ladders chapters. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
- Oracle, *Implementing Global Human Resources* — "Employment Model", for positions and assignments in the employment hierarchy. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/employment-model.html
