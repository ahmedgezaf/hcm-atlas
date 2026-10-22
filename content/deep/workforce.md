---
id: workforce
minutes: 30
---

If Chapter 1 is the compliance skeleton, this is the work skeleton: how an organization defines what work exists, at what level, and in which seat. One distinction in this chapter — job versus position — is the most frequently tested concept in Oracle HCM interviews, and the fastest way to look unprepared in front of a trainer is to treat the two as synonyms.

It is also a chapter where the configuration decision and the client's operating reality have to be matched honestly. Positions are more powerful than jobs and considerably more work to keep true. Most of the trouble on position-based implementations is not technical: it is that the structure was designed for an organization that approves headcount by seat, and handed to one that does not.

## Job: what the work is

A **job** is a generic definition of a role, independent of the organization chart. It carries attributes such as a grade range, required qualifications and a job family. Most roles repeat across an organization, so defining "Accountant" once and reusing it everywhere avoids duplicating the same definition dozens of times. The Finance department in Cairo, the plant in 10th of Ramadan City and the Alexandria branch can all use the same job. In a job-based (non-position) organization, the assignment carries job, department and location as separate fields; this is the common pattern in Egyptian private companies.

Jobs are set-enabled (Chapter 1), which means the jobs a transaction can select depend on the reference data sets assigned to its business unit. A client who wants one job catalogue across the group puts jobs in the Common Set; a client whose divisions genuinely use different catalogues accepts duplicate maintenance in exchange for separation. That choice is made once and lived with.

Jobs are date-effective like everything else, which has a consequence worth knowing: a job can be valid from a date and not before, and an assignment cannot name a job that is not valid on its own effective date. The error this produces during a migration — a perfectly reasonable job, rejected on a record dated two years before anyone created it — is confusing until you remember that reference data has dates too.

## Designing the job catalogue

The question nobody asks early enough is **how many jobs there should be**, and it has a large effect on how useful the system is three years later.

Too few, and the catalogue stops meaning anything: an organization with "Manager", "Officer" and "Specialist" as its three jobs cannot report on what anybody does, cannot build a career path, and cannot attach qualifications to a role. Too many, and the catalogue becomes a list of individuals — a job per person, named after the person's exact title, which is the failure mode when a catalogue is built by asking everybody what their title is.

The useful test for whether two titles should be one job: would the organization recruit for them with the same advert and the same requirements? If yes, they are one job with two people in it, and whatever distinguishes them is a grade, a department or a position. The client's titles can still live on the assignment or the position; they do not need to become the catalogue.

Three further design habits earn their keep. Give jobs stable codes that are not the title, because the title will change and the code should not. Decide whether the catalogue is global or per country before building it, because merging two catalogues afterwards is a data migration. And agree who owns it — the catalogue decays immediately if nobody has to approve a new job.

## Position: a specific seat

A **position** is a specific, individual seat: a job tied to a particular department and location, which exists whether or not anyone currently fills it. "Accountant #3, Finance Department, Alexandria Plant" carries its own headcount budget, reporting line and FTE. When the incumbent leaves, the position remains and becomes vacant — and a vacancy is a real, reportable thing.

Organizations that budget headcount need to track seats independently of people. Position management is therefore standard in government, oil and gas, banking and most Gulf entities. It brings vacancy reporting and stricter headcount control, at the cost of more setup and maintenance. A consultant aiming at the Gulf market should learn position management properly rather than treating it as an optional extra.

[[lab:jobpos]]

## What a position actually carries

A position is not just a job with a department attached. The attributes that matter are the ones that make it a budgeted seat.

**Headcount and FTE** are the control. A position configured for a single incumbent takes an FTE of 1 or less — 0.5 meaning half-time — and a headcount of 1. A shared position can hold several incumbents up to its FTE limit, which is how a client models three people job-sharing two full-time seats. The hierarchy view shows, for each position, how many incumbents it has and how much FTE is still open, and that open-FTE figure is the thing recruitment and finance actually look at.

**Incumbent validation**, where it is switched on, warns when a position's open FTE or headcount would be exceeded. It is a warning rather than a block in the general case, which is deliberate: real organizations overfill a seat during a handover, and a hard stop would make a normal event impossible. A client who wants it to be a hard stop is asking for a different conversation about approvals rather than about position setup.

The other attributes — job, department, location, grade, manager, working hours — are the ones that can flow down to the assignment, which is the next section.

## Choosing between them, out loud

The decision is not about tidiness, and a consultant who can run it as four questions will sound like someone who has made it before.

Does the client budget and approve headcount by seat? Positions carry that; jobs do not. Do they need to see that a seat exists while it is empty — for recruitment, for a vacancy report, for a finance review? Only positions make a vacancy visible. Do approvals or succession depend on the seat rather than the person (Chapters 19 and 20)? A position hierarchy and a succession plan are both plans for seats. And is there an owner for the maintenance, because every reorganization becomes position work?

Three yeses and an owner mean positions. One yes and no owner means jobs, and the client is better served by a clear job catalogue than by a position structure that decays within a year.

The decision is not all-or-nothing across a group, either. Position management is enabled at enterprise level and can be set differently per legal employer, with the legal employer's setting taking precedence. A group whose Saudi entity is position-managed because the regulator and the budget require it, and whose Egyptian trading arm is job-based because it is thirty people and reorganises constantly, is a perfectly coherent design — and a much better one than forcing both into the same shape.

## Position synchronization

Where positions are used, **position synchronization** decides how much of the position flows down to the assignment: job, department, location, grade, manager, FTE, working hours, and mapped flexfields. With it on, the position is the master — changing the position updates every assignment attached to it — and the configuration question is which attributes are synchronized and whether an individual assignment may override them.

This is where position-based clients get into trouble. Synchronization turned on with no override produces a reorganization that rewrites a thousand assignments correctly and instantly; the same setting makes a one-off exception impossible without changing the position. Turned off, the position becomes decorative and the two structures drift apart until nobody trusts either. The question to settle in design is which attributes are the position's and which belong to the person in it.

There is a delivered middle path, and most clients want it once it is explained: an option that allows an individual assignment to be excluded from synchronization. The useful way to frame it in a workshop is to go attribute by attribute and ask whether an exception is conceivable. Department and location almost never need an exception — the seat is where it is. Grade and working hours frequently do, because a particular person negotiated something. Manager usually follows the hierarchy. Walking that list takes twenty minutes and prevents a year of argument.

One operational detail: changes made in bulk do not synchronize by themselves. After positions or the hierarchy are loaded or changed through HCM Data Loader, the *Synchronize Person Assignments from Position* process has to be run for assignments to pick the changes up. A reorganization loaded on a Friday and not synchronized is a reorganization that has not happened yet, and the symptom — the position says one thing, the assignment says another — reads like a bug.

## The position hierarchy, and how a manager is found

A position hierarchy is a reporting structure made of seats rather than people, and where it is used to derive the line manager the resolution rule is worth knowing precisely, because it explains some odd results.

The application looks at the parent position for an incumbent to use as the manager. If the parent position is vacant, it looks at the grandparent, and keeps climbing until it finds somebody. If a parent position has several incumbents, the one with the longest tenure in that position becomes the manager.

Both rules produce surprises in practice. A vacancy two levels up silently reassigns a team to a director they have never met, which is correct behaviour and still worth warning the client about. And the longest-tenure rule means that a shared position with two co-heads picks one of them deterministically but not necessarily the one the organization considers senior.

Hierarchy edits have their own rule: removing a position moves its children up a level rather than orphaning them. That is usually what is wanted during a restructure and occasionally not, so the safer habit during a large reorganization is to build the new hierarchy, check it, and move people — rather than deleting from the middle of the old one and letting the tree re-form.

Chapter 15 covers what this means for security, which is the other reason the hierarchy matters: a manager-based security profile grants access through exactly these resolved relationships, so a hierarchy nobody maintains becomes an access problem rather than a reporting one.

## Maintaining positions through a reorganization

The thing that kills position implementations is not the initial build. It is the third reorganization, eighteen months later, done by a team that was not on the project.

Three habits make that survivable. Keep position codes meaningful and stable, so a seat can be recognised across a restructure rather than being deleted and recreated — a recreated position loses its history and its vacancy becomes invisible. Make dated position changes rather than corrections, for the same reason every other object in this system prefers them: a department that moved on 1 April should show as having moved on 1 April, not as always having been where it is now. And write down the operating procedure: who creates a position, who approves it, what happens when a seat is abolished while somebody is sitting in it.

That last case is the one with no clean answer and it is worth settling in advance. The options are to end-date the position and move the person to another one, to keep the position open until the person leaves, or to allow the overfill and accept the warning. Each is defensible; what is not defensible is deciding it differently every time, which is how a position structure stops reconciling to the budget it exists to control.

## Grades, steps and rates

A **grade** is a level in the hierarchy, used to control compensation ranges and eligibility for benefits or allowances — "G1" through "G12", or "Junior / Senior / Lead / Principal". They drive eligibility constantly: "only G7 and above get the car allowance" is a sentence a consultant hears and then configures. Grade is not the same as salary. Grade is a level; money attaches to it through **grade rates** and the salary basis (Chapter 5), and the two are linked but distinct objects.

A **grade step** is an increment within a single grade, used where progression happens in defined steps rather than across a continuous range. Steps are grouped into grade ladders. Grade G5 might have steps 1 through 8, each with a defined rate; an annual increment moves a person from step 3 to step 4 without changing their grade. Government and unionized pay scales work this way, which makes steps highly relevant in the Gulf public sector and in Egyptian government-linked entities. If a client has a step-based scale and the design uses a plain grade rate range, the design is wrong.

The distinction to hold is that a **grade ladder** sequences grades or steps for progression, while a **grade rate** attaches money to them. A ladder without rates describes a career path with no pay attached; rates without a ladder describe pay with no progression. Step-based public sector clients need both, and they need the progression to be something the system can run rather than something HR does in a spreadsheet each January.

Rates carry a currency and a date, and both matter in the region. A Gulf group paying in several currencies needs rates per legislative data group rather than one global ladder, and a client whose scale is revised annually needs dated rates rather than overwritten ones — otherwise last year's salary review can no longer be explained.

That dating point deserves emphasis because it is cheap to get right and expensive to fix. A client who overwrites the grade rate table every January has, by the third year, a system that cannot answer "what was the band for G7 in 2024" — which is exactly the question an auditor, a tribunal or a disgruntled employee eventually asks. Dated rates cost nothing extra at build time.

## Job families and profiles

A **job family** groups related jobs — all finance jobs, all engineering jobs — for career-path design, reporting and shared eligibility rules. A **job profile** is the content side of a job: the competencies, qualifications and responsibilities attached to it, which Talent and Recruiting read (Chapter 20). Both are recognition-level for a Core HR build and become central the moment a client adds those modules, which is a good reason to create them deliberately rather than leaving the catalogue flat.

The argument for doing this during a Core HR implementation, when the client sees no immediate benefit, is that the alternative is doing it later across a populated system. Attaching a family to four hundred existing jobs is a bulk update; creating four hundred jobs with families already on them is free. The same is true of job classifications and of anything else the later modules will read.

## Nationalization and the job catalogue

One regional note makes them more than theory. Nationalization reporting in Saudi Arabia and the UAE counts nationals in *skilled* roles, and what counts as skilled is read from the job's classification. A job catalogue built without that in mind produces a compliance report that has to be rebuilt later, person by person.

The practical instruction is to raise this in the job catalogue workshop, not in the reporting workshop, and to get the client's own compliance or government-relations function to confirm how each job family maps to the classifications the regulator uses. That function exists in every Gulf group of any size, it is rarely invited to an HR system workshop, and it is the only part of the business that knows the answer.

## What this costs to maintain

A closing honesty, because it is the part a client is least often told.

A job catalogue needs an owner and perhaps an hour a month. A position structure needs an owner, a documented procedure, a place in the approval chain for new seats, and real attention at every reorganization — which in a Gulf group of size is several times a year. It repays that with vacancy reporting, budget control and a succession structure that survives people leaving.

Clients who are told this and choose positions do well. Clients who are sold positions as a feature and discover the maintenance afterwards end up with a structure that is wrong within a year, and then with reports nobody believes. Saying it out loud during design is the consulting part of the job.

## Common mistakes

- Defining a job as a specific seat. That is a position.
- Building a job catalogue out of people's titles, and ending up with one job per person.
- Letting the job catalogue have no owner, so it grows by accident.
- Choosing positions for tidiness, with nobody owning the maintenance.
- Forcing one answer across a group when position management can be set per legal employer.
- Turning position synchronization on without deciding what an assignment may override.
- Loading positions in bulk and not running the synchronization process afterwards.
- Being surprised that a vacancy two levels up changed who a team reports to.
- Deleting and recreating a position during a restructure, and losing its history and its vacancy.
- Saying "grade equals salary". Grade is a level; rate ranges and the salary basis carry the money.
- Designing a continuous rate range for a client whose scale is actually step-based.
- Overwriting grade rates each year, so last year's review cannot be explained.
- Leaving job classification vague where nationalization reporting depends on it.

## Sources

- Oracle, *Implementing Global Human Resources* — the Jobs and Positions and the Grades, Grade Rates and Grade Ladders chapters. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
- Oracle, *Using Global Human Resources* — "How Position Synchronization Impacts Assignments", for the synchronized attributes, the assignment override and the process to run after a bulk change. https://docs.oracle.com/en/cloud/saas/human-resources/fawhr/how-position-synchronization-impacts-assignments.html
- Oracle, *Using Common Features for HCM* — "Considerations for Using Position or Position Hierarchy for Synchronizing Assignment Manager", for how a manager is resolved up the hierarchy. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/considerations-for-using-position-or-position-hierarchy-for.html
- Oracle, *HCM Data Loading Business Objects* — "Guidelines for Loading Positions", for headcount, FTE and incumbent rules. https://docs.oracle.com/en/cloud/saas/human-resources/fahbo/guidelines-for-loading-positions.html
- Oracle, *Implementing Global Human Resources* — "Employment Model", for positions and assignments in the employment hierarchy. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/employment-model.html
- Oracle, *Using Common Features for HCM* — reference data sets and how set-enabled objects are shared. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/index.html
