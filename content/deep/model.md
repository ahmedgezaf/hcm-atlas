---
id: model
minutes: 74
---

This is the single most important structure in the product. Payroll, absence, security and reporting all read from it. If a new consultant learns only one chapter cold, it should be this one.

The core insight: there is no employee table. A human being, that human's relationship to an employer, and the details of the job they do are three separate objects, each dated independently. Knowing which attribute lives on which object is the actual skill, and it is the skill that shows in an interview within about ninety seconds. Someone who says "we'll update the employee record" has not learned the model. Someone who asks "is that a change to the assignment or to the work relationship?" has.

The reason for the split is history. HR systems have to answer questions about the past — what grade was this person on in March, who employed them in 2019, how many people were in this department a year ago — and they have to answer them without losing the fact that it is the same human throughout. Splitting the human from the employment from the job is what makes all three answerable at once.

[[fig:employment-stack]]

## Why the model is split the way it is

It is worth spending a moment on the alternative, because understanding what the design avoids is what makes it memorable.

A single employee table has to choose one grain. If one row is one person, the table cannot hold two jobs, and it cannot hold the history of either. If one row is one job, the person's date of birth is repeated on every row and will eventually disagree with itself. If one row is one dated version of one job, the table can hold history, but there is nowhere to record anything true of the human rather than the job, and nowhere to record the fact that two of those rows belong to the same employment and a third belongs to a different one.

Every HR system that started with an employee table eventually bolted the other grains onto the side of it. Oracle started from the grains. The cost is that a consultant has to learn four objects instead of one; the benefit is that every question has exactly one place to be answered, and no fact is stored twice.

There is a second reason, and it is legal rather than structural. Employment is a relationship between a person and a *legal entity*, not between a person and a brand. A group with eleven subsidiaries has eleven employers, and a person's move between two of them is a resignation and a hire in the eyes of the labour authority even though nobody changes desk. A model that keeps the human separate from the employment can represent that honestly. A model that does not has to fake it.

## Person: the human, held once

The **person** record represents a human being and is held once, globally, across the entire enterprise. It carries what is true of the human regardless of any employer: name, date of birth, national identifier, personal contact details, nationality, and personal documents such as a passport or an Iqama.

A person may work for one company, leave, and return years later, or work for two group companies at once. Their date of birth does not change with any of that. Storing it once avoids contradictions, and it is why a rehire six years later still shows the same person number.

Several things on the person record are themselves dated, which surprises people who expect "person" to mean "static". A name is date-effective, because people change their names and a payslip reissued for a prior period should carry the name that was correct then. Addresses are dated. National identifiers are held as a list rather than a field, each with its own type and issuing country, which is what allows an expatriate in Riyadh to carry both a home-country national ID and an Iqama without either overwriting the other. In the Gulf this is not an edge case: it is most of the workforce.

What does *not* belong on the person is anything an employer decides. Job, grade, department, salary, manager, cost centre, union membership, probation end — none of them are facts about the human, and all of them are things a person can have two of at the same time if they hold two jobs. The moment one of them appears on a person record in a design, the design has started to drift back towards the employee table.

## Person numbers, duplicates and the matching problem

Person numbers follow the enterprise setting described in Chapter 1 — Manual, Automatic prior to submission, or Automatic upon final save. The number identifies the human, not the employment, which is why it does not change on rehire or transfer.

The guarantee that one human has one record is only as good as the hire process. Before creating a person, the hire flow looks for someone already in the system with a matching name, date of birth or national identifier. Skipping that check — or bulk-loading people without a reliable key — is how duplicate person records appear.

Duplicates deserve more than a warning, because the cleanup is genuinely bad. Once two person records exist, each accumulates its own work relationships, its own assignments, its own absence balances and its own payroll balances. There is no supported "merge two people" button that reconciles payroll history; the practical remedy is to end one record's employment, load the history onto the other, and leave the orphan behind as a tombstone, which means the year-to-date figures and the absence accruals have to be rebuilt by hand. A duplicate found in week two of a migration costs an hour. The same duplicate found after the first live payroll run costs a week and an apology.

In Egypt and the Gulf the national identifier is the natural key and should be treated as one: the Egyptian national ID, the Saudi national ID or Iqama number. Migration plans that key on employee number instead will merge the wrong people or split the right one. Three regional complications are worth planning for. An expatriate's Iqama number can change on renewal in some circumstances, so it is a strong key but not an eternal one. Arabic names transliterate inconsistently — the same person is Mohamed, Mohammed, Muhammad and Mohammad across four legacy systems — so name matching is close to useless as a deduplication strategy without the identifier beside it. And a legacy system that stored the national ID as a number rather than a string will have dropped leading zeros, which turns an exact-match key into a near-match one.

## Which attribute lives where

Before the objects are described one by one, it is worth seeing them as a lookup table, because this is the question that comes up twenty times a day on a live project.

[[fig:attribute-home]]

The test to apply when a client asks for a new field: does this change when the person changes employer? Then it belongs on the work relationship. Does it change when they change job? Assignment. Is it true of the human regardless of who employs them? Person. Does payroll need to accumulate it across the year? Payroll relationship. Getting this wrong is the single most common data-migration defect, and it usually surfaces months later as a history that cannot be explained.

There is a sharper version of the test for the cases where the first one is ambiguous. Ask how many of this thing the person can have at once. If the answer is "one, ever" it is on the person. If it is "one per employer" it is on the work relationship. If it is "one per job" it is on the assignment. A client who asks for "an employee's cost centre" is describing something a person with two jobs has two of — so it is an assignment attribute, and the requirement as stated is slightly wrong in a way that is much cheaper to correct in a workshop than in production.

## Work relationship: the legal link

A **work relationship** is the link between a person and one legal employer. Oracle describes it as the legal connection between a person and a legal employer, carrying the worker type and the start date of that employment. It is sometimes called a period of service, and that name is the more descriptive of the two: it is a period during which this person served this employer.

Terminating employment end-dates the work relationship. It does not delete the person, and it does not delete the history. A person can hold more than one work relationship at once — a contingent-worker relationship with one group company and an employee relationship with another — and can hold several over time as they leave and return.

A termination entered in error is reversible, and knowing that early saves a lot of panic. The correction is to reverse the termination rather than to re-hire the person, because a re-hire creates a second work relationship and leaves the first one closed, which is a true record of something that did not happen. The distinction between "this employment ended and another began" and "we made a mistake on Tuesday" is exactly the kind of thing the model is good at representing, provided somebody chooses the right transaction.

## Worker types, and what each is for

The **worker type** recorded on the work relationship is one of four: employee, contingent worker, pending worker or non-worker. They are not cosmetic. Worker type maps to a payroll relationship type, which decides whether the person is included in payroll runs at all.

An **employee** is the ordinary case: employed by the legal employer, on the payroll.

A **contingent worker** is engaged but not employed — an agency worker, a contractor on a supplier's books. They occupy a position, appear on the org chart and consume security and absence configuration, but a contingent worker may be excluded from payroll entirely. Clients ask for them constantly and then describe them as employees, so the question worth asking is "who pays them?"

A **pending worker** is someone hired but not yet started. The record exists so onboarding — equipment, accounts, documents, the joining checklist — can begin before day one, and it converts to an employee on the actual start date. It is a genuinely useful feature that most implementations under-use, usually because nobody realised the alternative to it is hiring people early and then explaining why payroll picked them up.

A **non-worker** is a person the enterprise needs to hold without an employment: a retiree drawing a pension, a board member, a beneficiary, a volunteer. They exist so that people who must appear in the system are not forced into an employee shape that would put them in a payroll run.

The regional shape worth anticipating is the Gulf group that employs a large population through a manpower supplier. The business calls them staff, the finance system calls them a vendor invoice, and the labour file calls them someone else's employees. Contingent worker is usually the honest answer, and the test is the one above: who pays them, and whose name is on the work permit.

## The dates on a work relationship, which are the ones that cost money

The dates on the work relationship are where service is decided, and service is money. A single employment carries more dates than most clients realise, and they are not synonyms.

There is the date the person first joined the **enterprise** — their first day in the group, across every employer in it. There is the date they joined **this legal employer**, which is the start of this particular work relationship. There is the **original date of hire**, which matters when a rehire should be treated as continuous. And there are one or more **seniority dates**, which are configured values rather than events, and which exist precisely because none of the other three answers every question a policy asks.

This matters enormously in the region, because end-of-service gratuity in the Gulf and the Egyptian end-of-service settlement are both calculated on continuous service. A rehire that starts a fresh service clock when the client's policy bridges the break will under-pay every affected leaver, and nobody notices until somebody resigns.

Ask, in the requirements workshop, exactly what the client means by "years of service" — and then ask which of those dates it maps to. The answer is rarely the one written on the offer letter, and it is frequently different for different purposes within the same company: gratuity may count from the original hire date, annual leave entitlement from the current legal employer's start date, and the long-service award from a date that excludes unpaid sabbaticals. One company, three answers, and a system that can hold all three only if somebody configures three seniority dates.

## Seniority dates in practice

Seniority dates are configured with the Configure Seniority Dates task, where each rule names a date and decides how it behaves. There are two generations of the feature and it is worth knowing which one an environment is on: the original version manages enterprise and legal employer dates only, while the later version supports seniority at person, work relationship and assignment level and requires a migration process to be run before it can be used. A consultant who promises assignment-level seniority on an environment that has not been migrated has promised something that is not there yet.

Two mechanical facts shape how the feature behaves day to day.

The first is that seniority is **not calculated in real time**. A scheduled process refreshes the dates, so a change made this morning is not reflected until that process has run. Clients report this as a bug roughly once per implementation. It is not a bug, but it does mean the process belongs in the scheduled job list from day one, and it means any report reading seniority is reading a figure that is as fresh as the last run.

The second is that adjustments are expressed in units rather than by overwriting the date. An adjustment of a positive number moves the date backwards and so increases seniority; a negative number moves it forward. Adjustments carry a comment, they can be loaded in bulk — the loader attributes are the manual adjustment days and the comment that goes with them — and they bypass approval. That last point is worth a control: a field that silently increases an entitlement and needs no approval is one an auditor will eventually ask about, and the comment is the only thing standing between the client and an unexplained three-month gift.

The design instinct to carry away is that seniority is where policy lives, and the hire date is where fact lives. Keep the fact true and express the policy beside it.

## Assignment: the job details

The **assignment** carries the actual job details: business unit, department, job, position, grade, location, manager, working hours, assignment category, assignment status, and the standing data payroll reads.

Job details change often — promotions, transfers, hours changes, a new manager — while the person and the employer stay the same. Isolating them in their own date-effective object keeps the history clean. Almost every lifecycle transaction is a dated change against the assignment, which is why a consultant spends most of their configuration life here, and why Chapter 4 on effective dating matters as much as it does.

The assignment also carries its own number and its own name, which exist because a person can hold several and reports have to tell them apart. Working hours and FTE sit here, and they are the input to a surprising amount of downstream arithmetic: part-time absence accrual, salary proration, headcount expressed as FTE rather than as bodies. The manager relationship is held here too, and it is a list rather than a field — line manager is one type among several, which is how a matrix organisation records a project manager alongside the person who signs the leave request.

## Assignment status, and the twelve combinations behind it

The **assignment status** is the attribute that generates the most support tickets in the model, and it does so because it looks like one value and is actually three.

Underneath the status a consultant picks sit an **HR status**, a **payroll status**, and optionally a **user status** — a client-defined name for a situation, created with the assignment status setup task. The HR status is one of Active, Suspended or Inactive. The payroll status is one of four: Process, Do not process, Process when earning, or Process nonrecurring element entry. The application sets the HR and payroll values automatically from the assignment status chosen, and the delivered statuses are the twelve combinations of the three HR values with the four payroll values — Active - payroll eligible, Active - no payroll, Suspended - process when earning, and so on through the grid. A new assignment is created as **Active - payroll eligible**, which is Active with a payroll status of Process.

The two unusual payroll statuses are the useful ones and almost nobody knows what they are for. **Process when earning** means payroll processes the assignment only in periods where there are earnings, and it exists for countries with cumulative tax rules, where running an empty period would otherwise generate a tax refund the employee is not owed. **Process nonrecurring element entry** processes only the active entry for a nonrecurring element, and it exists for paying a one-off amount to someone who has already left.

The distinction that catches people is between the HR half and the payroll half. A status can be Active for HR purposes while excluding the person from payroll, which is exactly what is wanted for unpaid leave and exactly what is not wanted when somebody has set it by accident. "The employee is active but did not get paid" is almost always this, and the five-second diagnosis is to look at the payroll status rather than at the status label.

User statuses are worth a recommendation. Clients want to distinguish "suspended — unpaid study leave" from "suspended — secondment" from "suspended — disciplinary", and the user status is the delivered way to do it without inventing a flexfield. Where several user statuses exist for one HR status, one of them has to be designated the default.

## The primary flags, and what reads them

The **primary assignment** flag matters when a person holds more than one. Reports, the org chart and many downstream integrations read the primary assignment, so a person with two jobs whose primary flag sits on the minor one will be reported under the wrong department indefinitely.

There is a primary flag on the work relationship as well, for the person who holds employments with two legal employers, and it answers the same question one level up: which of these employments is the one to show when something can only show one. Both flags are quiet failures rather than loud ones. Nothing breaks, no error appears, and the headcount for two departments is simply wrong until somebody reconciles it against a list the business already trusted.

A useful habit on any migration: produce a report of people with more than one assignment and have the business confirm the primary on each, before go-live rather than after. The list is always shorter than the client expects and always contains two surprises.

## Actions and action reasons

Every change to an assignment is recorded with an **action and action reason** — Hire, Promotion, Transfer, Termination as the action, and a client-defined reason underneath it. The action drives which flow runs and which fields appear; the reason is what makes analytics possible later.

"Why did attrition rise in Q3" can only be answered if terminations carry reasons, and reasons only exist if someone insisted on configuring them during implementation. That someone is the consultant.

The design advice is to keep the reason list short enough that people use it honestly. A list of forty termination reasons produces data in which thirty of them have never been used and the other ten are chosen at random by whoever is clicking. A list of eight, agreed with the HR director, each of which answers a question the business actually asks, produces an attrition analysis that somebody will act on. The same applies to transfers and promotions: the reason is the field that turns a record of what happened into evidence about why.

## Work terms: the layer that is not on the configuration screen

Older material, and a good deal of interview folklore, describes a **three-tier** model in which a layer of **employment terms** — also called work terms — sits between the relationship and the assignment to group contractual attributes across several assignments. It is worth recognizing the term, because it is still said out loud and it still appears in training decks. It is not on the configuration screen.

What does survive is the object. A work terms record exists under every work relationship whether or not anyone calls the model three-tier, and HCM Data Loader expects it as a component of the Worker file — `PeriodOfServiceId` points a work terms record at its work relationship, and the assignment points at the work terms record (Chapter 11). A consultant meets the layer on the first data migration regardless of what the enterprise option says, which is the real reason to know the word.

The practical consequence is a rule that costs an afternoon the first time it is met: where dated splits are created on an assignment, the same dated splits have to exist on its work terms record. A file that splits one and not the other is perfectly well-formed, imports without complaint, and fails at load with a message about the parent. The model is consistent here even though the configuration screen has stopped mentioning it.

## The employment model option

The **employment model** is set on the enterprise and can be overridden per legal employer, and it has four values: single assignment, single assignment with contract, multiple assignments, and multiple contracts with single assignment. All four are two-tier — the work relationship holds assignments directly. Where a legislation needs contract detail inside the employment record, Oracle's answer is the contract variants rather than an extra layer.

The choice that actually matters is single versus multiple assignment, and it is worth making deliberately rather than by default. Single assignment is simpler and closes off concurrent employment; multiple assignment opens it and brings with it the primary flag, the question of which assignment a report means, and a set of absence and payroll behaviours that only appear when somebody holds two jobs. A client who is certain they will never have concurrent employment is usually a client who has not yet asked the medical division or the university faculty.

## Payroll relationship: where payroll actually runs

Parallel to this hierarchy sits the **payroll relationship**, which links the person to a payroll statutory unit. It is the highest level of the payroll employment model and groups a person's assignments for statutory calculation and reporting. Oracle creates it automatically on hire, which is why most consultants meet it for the first time when something goes wrong.

The reason it exists is statutory arithmetic. Tax and social insurance must be calculated on a person's total earnings within a statutory unit, not per assignment. If someone holds two assignments, their social insurance cannot be calculated twice in isolation — that would apply the ceiling twice and under-deduct. Grouping the assignments under one payroll relationship is what makes the ceiling, the bracket and the annual accumulation apply once to the whole person.

Three consequences follow, and all three appear in interviews.

Payroll processing always occurs at the payroll relationship level. Elements are entered against assignments, but the run is against the relationship.

Balances aggregate at the payroll relationship, and — critically — **balances do not span payroll relationships**. Year-to-date tax, year-to-date insurable earnings, accumulated employer contributions: all of it belongs to one relationship and stops at its edge.

Assignments grouped in one payroll relationship must share the same payroll statutory unit and person type. That is why a person who is an employee of one company and a contingent worker at another has two payroll relationships, not one.

## Payroll relationship types, and the mapping you cannot undo

Behind the worker type sits a **payroll relationship type**, and the mapping between them is a piece of setup with unusually long consequences.

The two that matter are **Standard**, which puts the person into payroll runs, and **Element Entries Only**, which lets element entries exist against the person but leaves them out of payroll processing. Some releases add further variants for pending workers and candidates. The types themselves are delivered and cannot be invented: a client who wants a third behaviour is going to get one of these two.

Three rules around the mapping are worth carrying.

It is defined **per legislation**, so the same person type can map differently in two countries within one enterprise, and a behaviour verified in the Egyptian legislative data group proves nothing about the Saudi one.

A person type with **no mapping produces no payroll relationship at all**, which means no salary, no payment method, nothing payroll-shaped can be recorded. This is occasionally what is wanted and much more often a configuration gap discovered when someone tries to record a bank account.

And the choice is effectively **irreversible**: Oracle says the mapping cannot be undone, and a person type mapped to Element Entries Only will produce no results from a gross-earnings calculation later. A change to the mapping affects only person records created afterwards, so the population already loaded keeps the old behaviour. Standard is the more flexible choice, and where a client is undecided, that is the one to take.

## Payroll relationship rules, and what a rehire does

When a new assignment or a new employment appears, something has to decide whether it joins an existing payroll relationship or starts a new one. That decision is the **payroll relationship rule**, and it belongs to the legislation rather than to the client.

Three rules exist, and the difference between the first two is one word. **Lifetime Record** looks for any payroll relationship of the same person type and payroll statutory unit — and if it finds a terminated one, it removes the end date and reuses it. **Last Record** looks for an **active** one, and creates a new relationship when none is active. **New Record** creates a relationship per assignment regardless.

That word decides what a rehire does to the balances. Under Lifetime Record the old relationship comes back to life and its year-to-date figures continue; under Last Record the terminated one is left closed and a fresh relationship starts from zero. The two rules sound almost identical and produce opposite answers to the question clients actually ask.

This is the mechanism behind one of the most common interview questions and one of the most common client surprises: does a rehire continue the old balances or start fresh? The honest answer is that it depends on the rule the legislative data group runs, and on the dates. Under the rule Oracle ships for Saudi Arabia, the application compares the new assignment's start date with the last standard earnings date of the existing payroll relationship and reuses that relationship when the start date falls before it — which is what makes back-to-back fixed-term contracts continuous. Only where a new relationship is created do balances start again.

Before promising a client either behaviour, find out which rule their legislative data group runs. "It depends on the payroll relationship rule, and here is how I would check it for your legislation" is a better answer in an interview than either of the two confident ones.

## Termination dates on the payroll relationship

When employment ends, the payroll relationship carries dates of its own, and two of them decide whether the person can still be paid.

The **last standard process date** is the point after which no ordinary payroll run will pick the person up; it defaults to the period end of the payroll the termination falls in, and can be set later when the termination is entered. The **final close date** is the point after which nothing at all will — no supplementary run, no late correction, no final settlement — and its default is the end of time, so the person's payroll records only actually close once somebody sets it.

That default matters, because it means the damage is done by setting the date rather than by leaving it. Setting the final close date too early is how a legitimate late payment becomes impossible to pay without reopening the record. In the Gulf this is not hypothetical: gratuity calculations get revised, a final leave balance is recalculated after the leaver has gone, an annual bonus is declared in March for people who left in February. Leave room, and make it a standing instruction to whoever processes terminations rather than a decision taken per leaver.

## Concurrent employment

**Concurrent employment** means one person holding several simultaneous assignments under one work relationship, or several work relationships across different legal employers. A lecturer who also runs a research lab. A doctor employed by a hospital who also works clinic hours. A group finance manager who formally holds a role in two subsidiaries.

The two cases behave differently and the difference is the whole point. Two assignments under one work relationship means one employer, one payroll relationship, one set of balances and one statutory ceiling applied across both jobs.

Two work relationships means two employers — but not, automatically, two payroll relationships. The relationship is keyed on the payroll statutory unit and the person type, exactly as stated above, so two employers that are separate PSUs produce two relationships calculating independently, while two employers sharing one parent PSU produce a single relationship, with one set of balances and one ceiling across both jobs. The shared-services shape in Chapter 1, where several legal employers name one parent PSU, is precisely that second case. Which of the two happens is also legislation-dependent, through the payroll relationship rules above.

When a client describes somebody who "works for both companies", the useful follow-up is: which PSU files for this person, and is it the same one for both companies? The answer decides the shape, and it decides whether a statutory ceiling applies once or twice.

The arithmetic is worth making concrete, because it is where the money is. Under one payroll relationship with a social insurance ceiling, the two salaries are added, the ceiling is applied once, and contributions stop at it. Under two relationships, each salary meets its own ceiling, and the employer pays more and the employee pays more than either party expects. Neither outcome is a bug; they are two different legal situations. The error is in assuming which one applies.

## The canonical worked example: a global transfer

A **global transfer** moves a worker from one legal employer to another, typically across countries. Legally that is a new employment, not an edit to an existing one — different country, different legislation, different statutory registration.

Oracle handles this through a single Local and Global Transfer flow that covers both a move within the same legal employer and a move to a different one, with options for what happens to the existing assignments and whether the move is permanent or temporary. The underlying record changes are the part to be able to narrate.

The source work relationship is terminated and a new one is created under the destination legal employer. The status chosen for the source applies to every assignment on that work relationship, not only to the one the transfer was started from. A new payroll relationship is created under the destination payroll statutory unit, which sits in a different legislative data group. The person record is unchanged throughout. Because balances never span payroll relationships, year-to-date figures start fresh in the new country — which is correct, since the new country's authorities have no interest in earnings taxed elsewhere, but which surprises clients who expected a single annual figure.

What carries across is worth knowing in detail, because it is the part clients ask about. By default the new primary assignment is populated from the source assignment and can then be edited; non-flexfield attributes and descriptive flexfields on the assignment and work relationship copy by default and can be changed. Payroll information copies **only when the source and destination legal employers share a legislative data group** — which is to say, within a country. Element entries copy subject to eligibility, and the way to stop particular elements from travelling is an element group with the global transfer usage. There is a profile option governing whether source assignment data is copied at all; it defaults to copying, and setting it off is the switch for a client who wants every transfer entered from scratch.

[[fig:global-transfer-count]]

Be able to narrate this end to end and give the counts at the end: one person record, two work relationships (one ended), two payroll relationships (one ended). Then add the consequence nobody asks for but everybody wants: accrued leave and end-of-service liability do not move by themselves, and whether service bridges across the transfer is a policy decision expressed through seniority dates.

## Global temporary assignment, and the difference that matters

A **global temporary assignment** is the secondment case, and it differs from a transfer in exactly the way the names suggest: the source employment is not ended.

The source work relationship stays in place. Only the assignment the flow was started from is affected, rather than every assignment on the relationship, and by default that assignment moves to Suspended - payroll eligible, which can be changed to any other status. The person picks up an assignment in the destination legal employer while remaining employed by the source.

This is the shape a Gulf group needs when it sends somebody from the Dubai entity to the Riyadh entity for eighteen months and intends them to come back. The choice between transfer and temporary assignment is not a system preference — it follows the employment contract and the work permit, and getting it wrong produces a record that contradicts the documents in the employee's file. The useful question in the workshop is whether the person's original employment is suspended or ended, and the person who knows the answer is usually in legal rather than in HR.

## Rehire: the case everyone gets wrong

A rehire is a global transfer's quieter cousin and it trips up more projects.

The person record is reused — same human, same person number, same date of birth — and a new work relationship is created for the new employment. What happens to the payroll relationship depends on the payroll relationship rule described above, and that is the whole of the technical answer.

What is controversial is service. Whether the earlier employment counts toward gratuity, leave entitlement bands and notice periods is a policy question the client must answer, and the answer is expressed through seniority dates rather than by faking the hire date. Consultants who solve it by back-dating the new work relationship to the original hire date create a record that says the person was employed during a period when they were not, which corrupts headcount history, absence accruals and any report that counts service in a given year.

The correct instinct: never lie to the dates. Configure the seniority date that means what the client means.

It is worth rehearsing the conversation, because it recurs. The client says "she has been with us for twelve years". The record says she was employed for seven years, absent for two, and employed again for three. Both are true, and the second one is what the system should hold. The twelve is a policy figure computed from the first number plus a bridging rule, and the place for it is a seniority date with a comment explaining the bridge — not a hire date that makes the two missing years disappear from every headcount report the company has.

## What this model looks like to a data migration

The model is abstract until somebody has to load ten thousand people into it, at which point it becomes very concrete.

Oracle's bulk loader (Chapter 11) treats the person, the work relationship and the assignment as components of a single Worker object rather than as three separate loads. That is deliberate and it is a mercy: the three have to be created in one transaction, with consistent dates, or the result is a person with no employment or an assignment pointing at a work relationship that does not exist. It also means the file is wide, the ordering inside it matters, and a single malformed row can fail a block of records rather than one.

Three rules follow, and they are worth knowing before the first load rather than after it.

Dates must agree across the components. An assignment cannot start before its work relationship does, and a work relationship cannot start before the person exists. Source systems routinely hold a hire date on the employee record and a different one on the contract, and somebody has to decide which is true.

The keys must be stable. Loads reference objects by a source key or by a user key, and the person's national identifier is usually the only value in a legacy HR system that is both unique and unchanged across the whole history. Employee numbers get reissued; names get re-spelled.

History is loaded as history, not as today. If the client wants the last five years of job changes, those are dated assignment records, not a single current row — and loading them in date order is what produces a readable history afterwards rather than a stack of corrections.

There is a fourth rule that only appears on the second migration. Decide, before loading, how much history the client actually needs, and get that decision signed. Five years of dated assignment history multiplies the file size, the load time and the error surface by a large factor, and much of it is history nobody will ever query. A common and defensible answer is to load current state plus the dates that drive entitlements — hire, original hire, seniority — and to keep the full history in the legacy system or a reporting archive. That is a functional decision with a large technical consequence, which is precisely the kind of decision a consultant is being paid to surface early.

## What the model does to reporting and security

Two downstream areas read this structure constantly, and both of them punish a misunderstanding of it.

Reporting reads the grain. A subject area built on assignments returns one row per assignment, so a count of rows is a count of jobs rather than a count of people, and an enterprise with concurrent employment will see a headcount that is quietly too high. A subject area built on work relationships counts employments, which double-counts the person employed by two group companies. The count the business means is almost always people, and getting it requires either a distinct count of person identifiers or a filter to primary assignments. Chapter 7 goes further into this, and the analytics collection goes further still, but the root of it is here: the model has three grains and a report has to pick one on purpose.

Security reads the assignment. Data security profiles scope who can see whom by attributes that live on the assignment — department, business unit, legal employer, position hierarchy, manager hierarchy. That is why a manager who cannot see one of their people is almost always looking at an assignment whose manager or department is not what everybody assumed, and why the first diagnostic step is to open the assignment rather than to open the role. Chapter 15 takes this apart properly.

## Reading the model on screen

Knowing where each object surfaces in the interface saves an embarrassing pause in a demo.

The person attributes sit under the personal details area: name, national identifier, date of birth, contact details, documents. The work relationship and the assignment share the employment information page, with the work relationship's dates and worker type at the top and the assignment's job, grade, department, manager and status beneath — which is a UI convenience, not evidence that they are the same object. The payroll relationship has its own page, reached from the payroll area rather than from the person's employment record, and that separation on screen is a useful reminder of the separation underneath.

When something cannot be found, the question to ask is not "where is this field" but "which object owns it", and then go to that object's page.

## A worked life, end to end

It helps to run one person through the whole model once.

A woman is hired by the Cairo entity in 2016. One person record is created, carrying her name, date of birth and national ID. One work relationship is created against the Cairo legal employer with a worker type of employee and a start date. One assignment is created under it, carrying her job, grade, department and manager, with a status of Active - payroll eligible. One payroll relationship is created against the Egyptian payroll statutory unit, and her balances begin there.

In 2018 she is promoted. Nothing happens to the person, nothing happens to the work relationship, and a new dated version of the assignment is created with the new job and grade, carrying the action Promotion and a reason.

In 2019 she takes unpaid study leave for four months. The assignment status moves to a suspended value with a payroll status that excludes her from the run, and moves back afterwards. Her work relationship is untouched throughout, because she never stopped being employed.

In 2021 she resigns. The work relationship is end-dated with an action of Termination and a reason. The payroll relationship gets a last standard process date and a final close date far enough out that her final settlement and a later bonus correction can both be paid. The person record is untouched.

In 2023 she is rehired by the same entity. The same person record is reused, with the same person number. A second work relationship is created. Whether the old payroll relationship is reused depends on the legislation's rule and on the dates. Her gratuity policy bridges the break, so a seniority date is configured and adjusted to carry the five years she had already served into the new employment, while her hire dates continue to say exactly what happened — employed 2016 to 2021, absent for two years, employed again from 2023.

In 2025 she moves to the Riyadh entity permanently. The Cairo work relationship is ended and a Saudi one begins; a new payroll relationship is created in the Saudi legislative data group; her Egyptian year-to-date balances stay in Egypt where they belong; her leave balance and end-of-service liability are settled or transferred by an explicit decision rather than automatically.

One person record. Three work relationships over nine years, two of them closed. Several payroll relationships. Dozens of dated assignment versions. Not one employee table, and not one fact stored twice.

[[lab:model]]

## Common mistakes

- Believing there is an employee table. There is a person, a work relationship and an assignment.
- Confusing termination of a work relationship with deletion of the person. The person survives, and should.
- Re-hiring somebody to fix a termination entered in error, instead of reversing the termination.
- Keying a data migration on employee number rather than national identifier, and producing duplicate people.
- Matching people by name in a region where one name transliterates four ways.
- Putting an employer's decision — grade, cost centre, probation end — on the person record.
- Believing the work terms layer does not exist because the enterprise is two-tier. It is created for every assignment, and HCM Data Loader expects the component in the file.
- Splitting an assignment by date without splitting its work terms record the same way.
- Thinking payroll runs against the assignment. It runs against the payroll relationship.
- Mapping a person type to Element Entries Only to "keep them out of payroll", then discovering the mapping cannot be undone.
- Expecting balances to carry across a global transfer. They do not — a new legislative data group means a new payroll relationship.
- Assuming a rehire always restarts balances, or always continues them. It depends on the legislation's payroll relationship rule and on the dates.
- Treating "years of service" as one number. Ask which date the client means before configuring anything that depends on it.
- Back-dating a rehire's work relationship to the original hire date instead of using a seniority date.
- Expecting a seniority date to update the moment something changes, rather than when the calculation process next runs.
- Reading the status label instead of the payroll status when somebody active was not paid.
- Using a transfer where the contract describes a secondment, or the reverse.
- Leaving the primary assignment flag on the minor of two concurrent jobs, then wondering why reporting is wrong.
- Setting the final close date on termination too early, so a legitimate late payment cannot be made.
- Configuring actions without action reasons, then being unable to answer any question about why people left.
- Counting rows in an assignment-grained report and calling the answer headcount.

## Sources

- Oracle, *Implementing Global Human Resources* — "Employment Model", for the four employment model options. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/employment-model.html
- Oracle, *Implementing Global Human Resources* — "Assignment Status", for the HR, payroll and user statuses and the twelve delivered combinations. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/assignment-status.html
- Oracle, *Implementing Global Human Resources* — "Overview of Seniority Dates" and "How You Configure Seniority Dates", for the two versions, the calculation process and adjustments. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/overview-of-seniority-dates.html
- Oracle, *Using Global Human Resources* — "Data Copy and Display Options for Local and Global Transfer", for what copies on a transfer and what does not. https://docs.oracle.com/en/cloud/saas/human-resources/fawhr/data-copy-and-display-options-for-local-and-global-transfer.html
- Oracle, *Using Global Human Resources* — "Transfer Actions", for how a transfer and a global temporary assignment differ in what they touch. https://docs.oracle.com/en/cloud/saas/human-resources/fawhr/transfer-actions.html
- Oracle, *Implementing Global Payroll* — "Payroll Relationship Type Mappings", for Standard versus Element Entries Only and the consequences of the mapping. https://docs.oracle.com/en/cloud/saas/human-resources/faigp/payroll-relationship-type-mappings.html
- Oracle, *Implementing Global Payroll* — "Payroll Relationship Rules", for how a new assignment is grouped under an existing payroll relationship. https://docs.oracle.com/en/cloud/saas/human-resources/faigp/payroll-relationship-rules.html
- Oracle, *Implementing Payroll for Saudi Arabia* — "Continuous Period of Service Payroll Relationship Rule for Saudi Arabia", for what a rehire does to the relationship in the region. https://docs.oracle.com/en/cloud/saas/human-resources/faisa/continuous-period-of-service-payroll-relationship-rule-for-saudi-arabia.html
- Future Proof Technologies, "HCM Employment Model in Oracle Fusion HCM Cloud". https://medium.com/@futureprooftrainings/hcm-employment-model-in-oracle-fusion-hcm-cloud-0ec24a4e638a
