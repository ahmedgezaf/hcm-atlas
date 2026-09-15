---
id: model
num: 3
domain: hcm
track: functional
title: The Employment Data Model
subtitle: Person → work relationship → assignment. There is no employee table.
hue: 246
minutes: 17
labs: model
terms: person, work-relationship, work-terms, assignment, payroll-relationship, concurrent-employment, global-transfer, worker-types, seniority-date, assignment-status, action-and-action-reason, primary-assignment, last-standard-process-date
---

This is the single most important structure in the product. Payroll, absence, security and reporting all read from it. If a new consultant learns only one chapter cold, it should be this one.

The core insight: there is no employee table. A human being, that human's relationship to an employer, and the details of the job they do are three separate objects, each dated independently. Knowing which attribute lives on which object is the actual skill, and it is the skill that shows in an interview within about ninety seconds. Someone who says "we'll update the employee record" has not learned the model. Someone who asks "is that a change to the assignment or to the work relationship?" has.

The reason for the split is history. HR systems have to answer questions about the past — what grade was this person on in March, who employed them in 2019, how many people were in this department a year ago — and they have to answer them without losing the fact that it is the same human throughout. Splitting the human from the employment from the job is what makes all three answerable at once.

[[fig:employment-stack]]

## Person: the human, held once

The **person** record represents a human being and is held once, globally, across the entire enterprise. It carries what is true of the human regardless of any employer: name, date of birth, national identifier, personal contact details, nationality, and personal documents such as a passport or an Iqama.

A person may work for one company, leave, and return years later, or work for two group companies at once. Their date of birth does not change with any of that. Storing it once avoids contradictions, and it is why a rehire six years later still shows the same person number.

That guarantee is only as good as the hire process. Before creating a person, the hire flow looks for someone already in the system with a matching name, date of birth or national identifier. Skipping that check — or bulk-loading people without a reliable key — is how duplicate person records appear, and duplicates are unpleasant to clean up once payroll and absence data hang off both of them. In Egypt and the Gulf the national identifier is the natural key and should be treated as one: the Egyptian national ID, the Saudi national ID or Iqama number. Migration plans that key on employee number instead will merge the wrong people or split the right one.

Person numbers themselves are generated according to the enterprise setting described in Chapter 1 — manual entry, automatic on save, or drawn from a sequence. The number identifies the human, not the employment, which is why it does not change on rehire or transfer.

## Which attribute lives where

Before the objects are described one by one, it is worth seeing them as a lookup table, because this is the question that comes up twenty times a day on a live project.

[[fig:attribute-home]]

The test to apply when a client asks for a new field: does this change when the person changes employer? Then it belongs on the work relationship. Does it change when they change job? Assignment. Is it true of the human regardless of who employs them? Person. Does payroll need to accumulate it across the year? Payroll relationship. Getting this wrong is the single most common data-migration defect, and it usually surfaces months later as a history that cannot be explained.

## Work relationship: the legal link

A **work relationship** is the link between a person and one legal employer. Oracle describes it as the legal connection between a person and a legal employer, carrying the worker type and the start date of that employment.

Terminating employment end-dates the work relationship. It does not delete the person, and it does not delete the history. A person can hold more than one work relationship at once — a contingent-worker relationship with one group company and an employee relationship with another — and can hold several over time as they leave and return.

The dates on the work relationship are where service is decided, and service is money. Oracle distinguishes several: the date the person first joined the enterprise, the date they joined this legal employer, and one or more **seniority dates** which can be configured to accumulate service across breaks or across employers within the group. This matters enormously in the region, because end-of-service gratuity in the Gulf and the Egyptian end-of-service settlement are both calculated on continuous service. A rehire that starts a fresh service clock when the client's policy bridges the break will under-pay every affected leaver, and nobody notices until somebody resigns.

Ask, in the requirements workshop, exactly what the client means by "years of service" — and then ask which of those dates it maps to. The answer is rarely the one written on the offer letter.

## Worker types, and what each is for

The **worker type** recorded on the work relationship is one of four: employee, contingent worker, pending worker or non-worker. They are not cosmetic. Worker type maps to a payroll relationship type, which decides whether the person is included in payroll runs at all.

An **employee** is the ordinary case: employed by the legal employer, on the payroll.

A **contingent worker** is engaged but not employed — an agency worker, a contractor on a supplier's books. They occupy a position, appear on the org chart and consume security and absence configuration, but a contingent worker may be excluded from payroll entirely. Clients ask for them constantly and then describe them as employees, so the question worth asking is "who pays them?"

A **pending worker** is someone hired but not yet started. The record exists so onboarding — equipment, accounts, documents, the joining checklist — can begin before day one, and it converts to an employee on the actual start date. It is a genuinely useful feature that most implementations under-use.

A **non-worker** is a person the enterprise needs to hold without an employment: a retiree drawing a pension, a board member, a beneficiary, a volunteer. They exist so that people who must appear in the system are not forced into an employee shape that would put them in a payroll run.

## Assignment: the job details

The **assignment** carries the actual job details: business unit, department, job, position, grade, location, manager, working hours, assignment category, assignment status, and the standing data payroll reads.

Job details change often — promotions, transfers, hours changes, a new manager — while the person and the employer stay the same. Isolating them in their own date-effective object keeps the history clean. Almost every lifecycle transaction is a dated change against the assignment, which is why a consultant spends most of their configuration life here, and why Chapter 4 on effective dating matters as much as it does.

Three attributes on the assignment deserve naming, because they cause more support tickets than the rest combined.

The **assignment status** controls whether the assignment is active, suspended or inactive, and — separately — whether it is eligible for payroll processing. The distinction is the part that catches people: a status can be active for HR purposes while excluding the person from payroll, which is exactly what is wanted for unpaid leave and exactly what is not wanted when somebody has set it by accident. "The employee is active but did not get paid" is almost always this.

The **primary assignment** flag matters when a person holds more than one. Reports, the org chart and many downstream integrations read the primary assignment, so a person with two jobs whose primary flag sits on the minor one will be reported under the wrong department indefinitely.

Every change to an assignment is recorded with an **action and action reason** — Hire, Promotion, Transfer, Termination as the action, and a client-defined reason underneath it. The action drives which flow runs and which fields appear; the reason is what makes analytics possible later. "Why did attrition rise in Q3" can only be answered if terminations carry reasons, and reasons only exist if someone insisted on configuring them during implementation. That someone is the consultant.

## Two-tier and three-tier

Oracle offers two shapes for the hierarchy. In the **two-tier** model, the default, a work relationship holds assignments directly. In the **three-tier** model an optional layer called **employment terms** — also called work terms — sits between them to group contractual attributes such as working hours, grade, collective agreement and contract details across several assignments.

Two-tier is the more common choice in new implementations, and is what to assume. The three-tier model exists for organizations that genuinely need one set of contractual terms covering multiple assignments, which in practice means European employers with collective agreements more often than employers in Egypt or the Gulf.

"What is the difference between employment terms and an assignment?" is a standard interview question. Terms group contractual and compensation attributes; the assignment holds the actual job details. The answer is short, and the follow-up — "which would you recommend?" — is where a candidate shows judgment: two-tier, unless the client has a contractual layer that genuinely spans assignments, because the third tier is an extra object to date-track, migrate and explain for the rest of the system's life.

## Payroll relationship: where payroll actually runs

Parallel to this hierarchy sits the **payroll relationship**, which links the person to a payroll statutory unit. It is the highest level of the payroll employment model and groups a person's assignments for statutory calculation and reporting. Oracle creates it automatically on hire, which is why most consultants meet it for the first time when something goes wrong.

The reason it exists is statutory arithmetic. Tax and social insurance must be calculated on a person's total earnings within a statutory unit, not per assignment. If someone holds two assignments, their social insurance cannot be calculated twice in isolation — that would apply the ceiling twice and under-deduct. Grouping the assignments under one payroll relationship is what makes the ceiling, the bracket and the annual accumulation apply once to the whole person.

Three consequences follow, and all three appear in interviews.

Payroll processing always occurs at the payroll relationship level. Elements are entered against assignments, but the run is against the relationship.

Balances aggregate at the payroll relationship, and — critically — **balances do not span payroll relationships**. Year-to-date tax, year-to-date insurable earnings, accumulated employer contributions: all of it belongs to one relationship and stops at its edge.

Termination dates live here too. When employment ends, the payroll relationship carries a **last standard process date**, after which no ordinary payroll run will pick the person up, and a final close date, after which nothing at all will. Setting the final close date too early is how a legitimate late payment — a final bonus, a corrected settlement — becomes impossible to pay without reopening the record. Leave room.

Assignments grouped in one payroll relationship must share the same payroll statutory unit and person type. That is why a person who is an employee of one company and a contingent worker at another has two payroll relationships, not one.

## Concurrent employment

**Concurrent employment** means one person holding several simultaneous assignments under one work relationship, or several work relationships across different legal employers. A lecturer who also runs a research lab. A doctor employed by a hospital who also works clinic hours. A group finance manager who formally holds a role in two subsidiaries.

The two cases behave differently and the difference is the whole point. Two assignments under one work relationship means one employer, one payroll relationship, one set of balances and one statutory ceiling applied across both jobs. Two work relationships means two employers, two payroll relationships, and each employer calculating independently — which is correct, because each is separately registered and separately liable.

When a client describes somebody who "works for both companies", the useful follow-up is: which company's payroll pays them, and do both of them file for this person? The answer decides the shape.

## The canonical worked example: a global transfer

A **global transfer** moves a worker from one legal employer to another, typically across countries. Legally that is a new employment, not an edit to an existing one — different country, different legislation, different statutory registration.

Oracle handles this through a single Local and Global Transfer flow that covers both a move within the same legal employer and a move to a different one, with options for what happens to the existing assignments and whether the move is permanent or temporary. The underlying record changes are the part to be able to narrate.

The source work relationship is terminated and a new one is created under the destination legal employer. A new payroll relationship is created under the destination payroll statutory unit, which sits in a different legislative data group. The person record is unchanged throughout. Because balances never span payroll relationships, year-to-date figures start fresh in the new country — which is correct, since the new country's authorities have no interest in earnings taxed elsewhere, but which surprises clients who expected a single annual figure.

[[fig:global-transfer-count]]

Be able to narrate this end to end and give the counts at the end: one person record, two work relationships (one ended), two payroll relationships (one ended). Then add the consequence nobody asks for but everybody wants: accrued leave and end-of-service liability do not move by themselves, and whether service bridges across the transfer is a policy decision expressed through seniority dates.

## Rehire: the case everyone gets wrong

A rehire is a global transfer's quieter cousin and it trips up more projects.

The person record is reused — same human, same person number, same date of birth. A new work relationship is created for the new employment. A new payroll relationship is created, so balances start again. None of that is controversial.

What is controversial is service. Whether the earlier employment counts toward gratuity, leave entitlement bands and notice periods is a policy question the client must answer, and the answer is expressed through seniority dates rather than by faking the hire date. Consultants who solve it by back-dating the new work relationship to the original hire date create a record that says the person was employed during a period when they were not, which corrupts headcount history, absence accruals and any report that counts service in a given year.

The correct instinct: never lie to the dates. Configure the seniority date that means what the client means.

## What this model looks like to a data migration

The model is abstract until somebody has to load ten thousand people into it, at which point it becomes very concrete.

Oracle's bulk loader (Chapter 11) treats the person, the work relationship and the assignment as components of a single Worker object rather than as three separate loads. That is deliberate and it is a mercy: the three have to be created in one transaction, with consistent dates, or the result is a person with no employment or an assignment pointing at a work relationship that does not exist. It also means the file is wide, the ordering inside it matters, and a single malformed row can fail a block of records rather than one.

Three rules follow, and they are worth knowing before the first load rather than after it.

Dates must agree across the components. An assignment cannot start before its work relationship does, and a work relationship cannot start before the person exists. Source systems routinely hold a hire date on the employee record and a different one on the contract, and somebody has to decide which is true.

The keys must be stable. Loads reference objects by a source key or by a user key, and the person's national identifier is usually the only value in a legacy HR system that is both unique and unchanged across the whole history. Employee numbers get reissued; names get re-spelled.

History is loaded as history, not as today. If the client wants the last five years of job changes, those are dated assignment records, not a single current row — and loading them in date order is what produces a readable history afterwards rather than a stack of corrections.

## Reading the model on screen

Knowing where each object surfaces in the interface saves an embarrassing pause in a demo.

The person attributes sit under the personal details area: name, national identifier, date of birth, contact details, documents. The work relationship and the assignment share the employment information page, with the work relationship's dates and worker type at the top and the assignment's job, grade, department, manager and status beneath — which is a UI convenience, not evidence that they are the same object. The payroll relationship has its own page, reached from the payroll area rather than from the person's employment record, and that separation on screen is a useful reminder of the separation underneath.

When something cannot be found, the question to ask is not "where is this field" but "which object owns it", and then go to that object's page.

[[lab:model]]

## Common mistakes

- Believing there is an employee table. There is a person, a work relationship and an assignment.
- Confusing termination of a work relationship with deletion of the person. The person survives, and should.
- Keying a data migration on employee number rather than national identifier, and producing duplicate people.
- Assuming every implementation has employment terms. Two-tier omits that layer entirely.
- Thinking payroll runs against the assignment. It runs against the payroll relationship.
- Expecting balances to carry across a global transfer or a rehire. They do not.
- Treating "years of service" as one number. Ask which date the client means before configuring anything that depends on it.
- Back-dating a rehire's work relationship to the original hire date instead of using a seniority date.
- Leaving the primary assignment flag on the minor of two concurrent jobs, then wondering why reporting is wrong.
- Setting the final close date on termination too early, so a legitimate late payment cannot be made.
- Configuring actions without action reasons, then being unable to answer any question about why people left.

## Sources

- Oracle, *Implementing Global Human Resources* — "Employment Model". https://docs.oracle.com/en/cloud/saas/human-resources/24a/faigh/employment-model.html
- Oracle, *Administering Global Payroll* — "Overview of Administering Payroll Relationships". https://docs.oracle.com/en/cloud/saas/human-resources/23d/faapq/overview-of-administering-payroll-relationships.html
- Oracle, *Implementing Global Human Resources* — "Enterprise Structures: Initial Configuration", for the legal employer relationship the work relationship points at. https://docs.oracle.com/en/cloud/saas/human-resources/21a/faigh/enterprise-structures-initial-configuration.html
- Future Proof Technologies, "HCM Employment Model in Oracle Fusion HCM Cloud". https://medium.com/@futureprooftrainings/hcm-employment-model-in-oracle-fusion-hcm-cloud-0ec24a4e638a
