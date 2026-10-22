---
id: modules
minutes: 36
---

This atlas teaches three modules: core HR, absence and payroll. They are what a junior functional consultant in Egypt is hired to do, and depth in them is worth more than breadth across the suite. But a client's HR director will list Recruiting, Benefits and Goals in the same sentence as payroll, a screening call will ask which modules you have worked with, and a workshop will reach a point where somebody says "that comes from Recruiting" and the room moves on.

This chapter is the map: how Oracle packages the suite, where the three modules sit inside that package, and enough vocabulary and seams for everything else to follow the conversation, know what to ask, and know where the handover sits. It is not depth, and it should not be presented as depth. Saying plainly, when asked, that you have not configured a module is the answer that survives an interview; claiming otherwise is the one that ends it.

That warning is worth repeating at greater length in a longer chapter, because a longer chapter invites the opposite conclusion. Everything below is **recognition-level** knowledge: enough to follow a conversation, ask the right question, and know whose problem something is. It is not enough to configure any of these modules, and a consultant who reads it twice and says they know Recruiting will be found out in the second question of a technical interview. The value of the chapter is the seams — what core HR owes each module and what each writes back — because those are the parts a core HR consultant is genuinely responsible for.

## Three offerings, one suite

Oracle does not sell or configure Fusion HCM as one block. In Setup and Maintenance the suite is divided into **offerings** — the unit a client opts into — and each offering is subdivided into **functional areas** and features that can be switched on or left off. Opting into an offering is what generates the setup task list, so the offering decides which configuration tasks a project even sees.

Oracle's own implementation guide draws the HCM core as three offerings. **Workforce Deployment** holds the employment record and everything that pays and schedules people: global HR, payroll and payroll interfaces, time and labor, and absence management. **Workforce Development** holds what grows people: performance, goals, career development, succession and talent review. **Compensation Management** holds what rewards them: compensation cycles, incentive compensation, benefits and the total compensation statement. A small set of features — Fast Formula, profile management and the workforce directory — is drawn across all three rather than inside any one, because every offering reads them.

Recruiting and Learning are configured as offerings of their own, outside that three-part figure, and the names in the Offerings page change between releases often enough that the training or client instance is the source to check against rather than a slide.

[[lab:offering-map]]

## What opting in actually does

The offering mechanism is worth understanding beyond the vocabulary, because it has consequences a consultant meets in week one and again at every environment move.

Opting into an offering and its functional areas is what **generates the setup task list**. A task that does not appear is usually not missing; the feature it belongs to has not been opted into. That is the first thing to check when a documented setup task cannot be found, before searching for it by name.

Opting in also **changes what appears to users** — a feature switched on adds pages, fields and processes, and one switched off removes them. This is why two instances of the same product can look different, and why "it works in the demo pod" is not evidence about the client's environment.

And the opt-in configuration is itself **setup data that has to travel between environments** (Chapter 16). A migration that carries the configuration but not the opt-ins produces a target environment where half the configuration has nowhere to display.

The practical consequence for a junior is that "which modules do you know?" is really "which offerings, and which functional areas inside them?" — and the honest answer for most new consultants in the region is one offering, Workforce Deployment, and three functional areas inside it.

## Inside Workforce Deployment

Global HR is the part of Workforce Deployment everything else reads from, and it is easier to hold if it is grouped by the job each part does rather than by menu. Managing the workforce record — hire, transfer, promotion, termination, and the person, work relationship and assignment underneath them — is Chapters 3, 4 and 8. Security, deciding who can see and change which records, is Chapter 15. The self-service layer, where employees and managers act on their own records instead of asking HR, is Chapter 22. Bulk loading through HCM Data Loader and its spreadsheet cousin is Chapter 11, and reporting is Chapter 13.

One phrase causes more confusion than it should. Trainers and clients say **workforce management** to mean managing worker records, which is the Global HR sense. Oracle also uses Workforce Management as the name of a feature area covering time, scheduling and absence. In a workshop the two meanings can sit in the same sentence; asking which one is meant costs a second and saves a requirement being written against the wrong module.

Payroll and absence are the other two functional areas a junior is hired for, and their seams with each other are covered where they meet: absence elements carrying leave payment into the run (Chapter 6), and the costing that carries the run into Finance (Chapter 21).

**Time and Labor** sits in the same offering and is the one a payroll consultant meets most often without configuring. The vocabulary is time card, time entry rule, and the layouts that decide what a worker is asked to enter. The seam is the hours side of pay from Chapter 5: overtime, shift premiums and anything paid by the hour arrive from here or from an interface, and the design question of whether the client pays by the hour or by the month is settled on this boundary.

## Profile management: the spine of the talent side

Nearly every Workforce Development module reads the same underlying data, which is why Oracle draws profile management across the offerings rather than inside one. A **talent profile** holds what a person has — competencies, skills, languages, degrees, certifications — and a model profile holds what a job or position needs.

The building blocks are a **content library**, which holds the content types (competencies, languages and degrees are delivered; a client adds its own), and the content items inside each type. A **profile type** is the template a profile is built from, and there are two kinds: a person profile type for workers, and a **model profile** type for workforce structures such as jobs and positions, which records the targeted and required skills and the work requirements of the role. Each content section on a profile carries its own role access, so whether an employee can edit their own languages but only view their competency ratings is a configuration decision rather than a given.

The seam into core HR is the job and position of Chapter 2. A model profile hangs off the job, so a client with a clean job catalogue gets meaningful gap comparisons and best-fit searches, and a client whose jobs are an inherited spreadsheet of titles gets noise. Profile data can be loaded with HCM Data Loader, which matters because no client wants to key in a competency framework by hand.

The core HR consequence is worth stating as an instruction rather than an observation: **a job catalogue built badly in month two limits every talent module the client buys afterwards**, and the limitation is invisible until they buy one. That is a reason to raise the catalogue design properly in Chapter 2's workshop even for a client whose scope is core HR and payroll only.

## Performance and goals

Performance manages the review cycle through a **performance document** — a template, a period, a set of competencies and ratings, and a workflow between worker and manager. Goals manages objectives, aligned up a hierarchy and often cascaded.

The seam into core HR is thinner than people expect: ratings mostly stay in the module, feeding compensation and talent review rather than the employment record. The connection worth naming is the review period against the probation period of Chapter 8 — clients frequently want the probation decision to come out of a performance document.

The other core HR dependency is the **manager hierarchy** (Chapter 7). A review cycle routes between a worker and their manager, so every problem the hierarchy has becomes a problem the review cycle has, at scale, in a single week of the year. Clients who run their first review cycle on a hierarchy nobody has cleaned discover the state of their manager data very publicly.

## Career development

Career development is where an employee and their manager plan growth, and its working unit is the **development goal**: a goal about the person rather than the business. A development goal can carry target outcomes drawn from the talent profile's catalogues — a competency, a certification, a language — and when the goal is completed the outcome is written back to the person's talent profile, rated by the manager when approvals are on.

That write-back is the seam. Career development is the module that keeps talent profiles current without HR keying them, which makes it quietly important to talent review and succession, both of which read the profile. A client that buys succession and skips career development usually finds its profiles a year out of date by the first succession meeting.

## Talent review and succession

A talent review is a meeting, and the module is built around it: a business leader, facilitators who run the meeting, and reviewers who submit ratings before a deadline. The meeting's template decides which ratings are shown, what the potential assessment looks like, and whether succession plans and talent pools can be worked on in the room.

The screen people remember is the **box chart** — the review population plotted on one rating against another, most often performance against potential, which is the nine-box grid HR textbooks describe. During the meeting participants move people between boxes, which is the calibration the meeting exists for.

**Succession plans** name candidates for a critical role, each with a readiness rating, and can be built around an incumbent, a job or a position. A **talent pool** is the looser cousin — a group being developed for a kind of role rather than a named seat.

The seam is positions, from Chapter 2. Succession is one of the few genuine arguments for managing by position rather than by job, because a succession plan is a plan for a seat. A client who wants position-based succession and has no positions is asking for two things.

## Learning

Oracle Learning delivers and tracks courses: catalogue, learning item, assignment, completion. It is configured as its own offering. The seam is compliance — mandatory training with a completion deadline, which in practice means a report that proves it, and sometimes a journey task that will not close until the course is done. Completed learning can also feed the talent profile, which is the second way profiles stay current.

In this region there is a second seam worth knowing about: training is frequently a condition attached to a role, a site or a permit — safety certification for a plant, a licence renewal — which makes the expiry tracking of Chapters 14 and 18 relevant here too. A client whose compliance training is tracked in a spreadsheet and whose document expiries are tracked in another has two problems with one shape.

## Recruiting

Oracle Recruiting — still widely called **ORC**, Oracle Recruiting Cloud — handles hiring up to the point someone becomes an employee, and it is configured as its own offering. The words in the room are **requisition** (the approved vacancy), candidate, and **job offer** — and offers have their own approval rules, separate from the HR approvals in Chapter 19, because an offer is a commercial commitment rather than a record change.

The seam matters more than the module. When an offer is accepted, the candidate becomes a **pending worker** or an employee, and that act creates the work relationship and assignment of Chapter 3 — so the data quality in a requisition becomes the data quality in your core HR record. Job, grade, department, legal employer and start date are all chosen in Recruiting by people who are not thinking about payroll. In Egypt this is where the national identifier should be captured, because the alternative is chasing it after the hire.

What Core HR owes Recruiting: the structures to pick from, and the model profiles a requisition can match candidates against. What Recruiting writes back: the person, and the first version of almost every attribute.

That second sentence is the one to act on. A core HR consultant on a project where Recruiting is in scope — or will be in a later phase — should write down the list of attributes that arrive from a requisition, and make sure each one is validated at the point it is chosen rather than corrected afterwards. The candidates for that list are predictable: legal employer, business unit, department, job, grade, location, payroll, start date, worker type, and in this region the national identifier and the visa or permit details that the onboarding will need.

Where positions are used, add the position — because an offer against a position that is already full, or that does not exist on the start date, is a problem discovered at the hire rather than at the offer.

## Onboarding

Onboarding is the checklist between offer and first day, delivered as a **journey** — the task-list feature introduced in Chapter 14. Tasks can be assigned to the new hire, the manager, IT and HR, with due dates relative to the start date.

The seam is the pending worker: the record exists before day one so documents can be collected, equipment ordered and accounts created, and it converts to an employee on the start date. Egyptian onboarding usually has a statutory tail — the social-insurance registration and the labour-office file of Chapter 9 — which is a good use of a journey precisely because it is a checklist somebody currently keeps on paper.

The Gulf version of that tail is longer and more time-critical: visa, work permit, residency, medical, and the platform registrations of Chapters 17 and 18, several of which have to happen in a particular order and some of which must precede the start date. A journey is the right shape for it, and getting the dependencies and lead times right is a conversation with the government-relations function rather than with HR.

## Compensation

Compensation Management is the third offering, and its first module covers how pay changes, as distinct from how it is paid. The vocabulary: **compensation plan**, the annual cycle or off-cycle event; budgets pushed down a management hierarchy; eligibility; worksheets that managers complete; and approvals before anything reaches the record. Oracle separates the cycle-based work of a whole workforce from one-off awards to an individual, and a client asking for "compensation" usually means one of the two.

The seam is the salary record of Chapter 5. A compensation cycle writes salary, and payroll reads it — which is why a client who runs annual increases in a spreadsheet and loads the results is doing with HDL what this module exists to do. Worth knowing when the question is whether to buy it.

Two further core HR dependencies decide whether a compensation cycle is usable. **Grade rates** (Chapter 2) are what a worksheet compares a proposed salary against, so a client with no rates gets a worksheet with no guidance. And the **manager hierarchy** again, because budgets are pushed down it and worksheets are assigned along it.

The regional note: Egypt's mandatory annual increment (Chapter 9) is a statutory minimum rather than a merit cycle, and a client may run both. Which one the module manages, and how the statutory floor is enforced against a merit outcome below it, is a design question worth asking early.

## Benefits

Benefits manages plans people enrol in: medical cover, life insurance, allowances structured as plans. The vocabulary: plan, option, **enrolment**, life events — the triggers (new hire, marriage, a new child) that open an enrolment window.

The seam is payroll. An enrolment produces an element entry for the employee contribution and often an employer cost, so the plan design decides what appears on the payslip. In Egypt private medical cover sits alongside the statutory universal health insurance of Chapter 9 rather than replacing it, and clients routinely conflate the two in a workshop.

The second seam is **eligibility profiles** (Chapter 6), which benefits shares with absence and compensation — the same object, learned once, used three times.

And the one that catches payroll consultants: a benefits design made without payroll in the room produces elements that nobody has classified, costed or tested, discovered in parallel run. The rule is that any benefit with a money consequence is a payroll requirement with a benefits front end.

## When a module appears in a workshop

A practical routine, for the moment somebody says "that comes from Recruiting" and looks at you.

Ask **which direction the data flows**: does core HR supply it, receive it, or both. That sorts the question into one you own, one you do not, or one that needs both parties.

Ask **what the seam object is** — person, assignment, job, position, salary, element entry. Every inter-module seam in this chapter lands on one of six objects, and naming it converts a module question into a chapter of this atlas.

Ask **when it happens relative to the payroll cycle**, because anything that writes to a salary or an element entry has a cut-off (Chapter 5).

And say plainly what you do not know. "I own the assignment it writes into; I have not configured Recruiting, and the person who has should answer the rest" is a complete, professional answer that costs nothing.

## Learning a new module, quickly

Since the realistic career path is to pick up a second module on a project rather than in a classroom, the method is worth writing down.

Start with the **objects**, not the screens. Every module in this suite is a handful of objects with relationships, exactly as Chapter 3 is for core HR. Find them and draw them, and the screens stop being arbitrary.

Then find the **seams** into what you already know, because that is where your existing knowledge is leverage and where you will be most useful on the project immediately.

Then read the **delivered configuration** rather than the documentation — the delivered plans, templates and rules are the clearest statement of how the module expects to be used, exactly as Chapter 12 advises for formulas.

Then configure one **end-to-end case** in a sandbox or a test environment: one plan, one person, one cycle, from setup to result. One complete case teaches more than ten partial ones.

And only then read the guide, which will now make sense.

## What a junior is most likely to be put on next

In Egypt and the Gulf, after core HR, absence and payroll, the usual next step is Recruiting or Benefits — Recruiting because almost every client buys it and it touches the hire, Benefits because medical cover is close to payroll and the questions arrive through the payroll team anyway. Compensation tends to follow once the core is stable, and the Workforce Development modules are often a later phase or never.

The honest version of this chapter in an interview is one sentence: these are the offerings, this is where each module touches what I have built, and I have not configured them.

## Common mistakes

- Claiming module experience from vocabulary. An interviewer's second question settles it.
- Reading a map chapter twice and mistaking it for depth.
- Answering "which modules?" with a list of menu names instead of the offering and the functional areas inside it.
- Hunting for a setup task that is absent because its feature was never opted into.
- Migrating configuration between environments without the opt-ins behind it.
- Hearing "workforce management" and assuming which of its two meanings the speaker had in mind.
- Building a job catalogue badly on a core HR project, and limiting every talent module the client buys later.
- Running a first performance or compensation cycle on a manager hierarchy nobody has cleaned.
- Treating offer approvals as the same rule set as HR approvals.
- Designing core HR without asking what Recruiting will write into it.
- Letting a benefits plan be designed without payroll in the room, then discovering the element.
- Buying succession without career development, then reviewing talent against profiles nobody has updated.
- Promising position-based succession planning to a client who manages by job and has no positions.
- Assuming private medical cover replaces Egypt's statutory health insurance.

## Sources

- Oracle, *Implementing Global Human Resources* — "Generate the Setup Task List for HCM" (the figure of offerings and their features). https://docs.oracle.com/en/cloud/saas/human-resources/fapus/generate-the-setup-task-list-for-hcm.html
- Oracle, *Implementing Global Human Resources* — "Overview of Global Human Resources" (Workforce Deployment functional areas). https://docs.oracle.com/en/cloud/saas/human-resources/faitl/overview-of-global-human-resources.html
- Oracle, *Using Global Human Resources* — the self-service areas the quick actions sit in. https://docs.oracle.com/en/cloud/saas/human-resources/fawhr/index.html
- Oracle, *Using Functional Setup Manager* — offerings, functional areas, feature opt-in and moving setup data between environments. https://docs.oracle.com/en/cloud/saas/applications-common/
