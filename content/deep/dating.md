---
id: dating
minutes: 30
---

Oracle HCM is a date-effective system. Almost nothing is ever deleted; changes are recorded with the date on which they become true in the real world. People coming from transactional systems trip over this more than anything else, and it has direct payroll consequences — which is why this short chapter sits underneath every record in the atlas.

The chapter is short in its standard form because the idea is short. The idea being short does not make it easy. Effective dating is responsible for a disproportionate share of production incidents, and almost all of them come from four situations: a change entered on the wrong date, a correction used where an update was meant, a future-dated record nobody can see, and a retroactive change that did not happen because nothing was watching for it. This version goes through each of those properly, and through the machinery behind the last one, because "retro did not pick it up" is a sentence a consultant will hear many times.

## The effective date is not the entry date

The **effective date** is the date on which a change becomes true — not the date it was typed into the system. HR reality and data entry rarely happen on the same day: a promotion effective 1 January may be entered on 15 January, and the system must know the person was at the new grade from the first. Every date-effective record has a start date and an end date. Setting the effective date correctly is the difference between a correct payslip and a retroactive correction, and most "the system calculated it wrong" tickets turn out to be effective-date errors. The system tracks the entry date separately, for audit.

Screens carry the same idea. A person search run as of a past date returns the organization as it was then, not as it is now — which is how a consultant answers "who reported to her in March" without a report. It is also the first thing to check when a user insists a record is missing: they may be looking at it on the wrong day.

The habit worth building, and worth teaching to every key user during training, is to read the date on the page before reading anything else on it. Most of the confusion people report is not confusion about the data. It is confusion about which day they are standing on while they look at it.

## How a dated record is actually stored

The mechanism is simpler than the vocabulary suggests, and seeing it once makes the rest of the chapter obvious.

A date-effective object is not one row. It is a chain of rows for the same logical record, each with an effective start date and an effective end date, laid end to end with no gaps. A person who was hired on grade 3 in 2019 and promoted to grade 4 on 1 July 2022 has two assignment rows: one running from the hire date to 30 June 2022, and one running from 1 July 2022 to `4712/12/31` — Oracle's conventional end of time, which means "and still true".

Everything else follows from that picture. Looking at a record "as of" a date means selecting the row whose range contains that date. An update means closing the current row the day before the change and opening a new one. A correction means editing a row in place without changing where it starts or ends. A future-dated change means inserting a row whose range has not started yet. And the reason history survives is simply that nothing is overwritten unless somebody explicitly asks for a correction.

The chain has no gaps by design, and that rule is enforced rather than assumed: a bulk load that supplies a dated history with a hole in it is rejected (Chapter 11). A record cannot be true, then undefined, then true again.

## Which objects are dated, and which are not

Not everything in the system keeps history, and knowing the difference saves an afternoon. The person, the work relationship, work terms, the assignment, salary and element entries are all date-effective: each change writes a new row with its own window. Reference data such as jobs, grades and locations is date-effective too, which is why a grade can be valid from one date and not before.

Transaction records are not. A payroll run, a flow, an approval — these happen once, at a point in time, and are not re-dated afterwards. When a client asks to "change the date" of something, the first question is which of the two kinds it is, because for the first the answer is an update and for the second it is a reversal and a re-run.

The distinction has a consequence worth stating plainly, because clients find it counter-intuitive. Dated objects are forgiving: a mistake is correctable and the correction leaves a trail. Transactions are not forgiving in the same way: a payroll run calculated on wrong data has to be rolled back and re-run, and a payment already made has to be recovered rather than un-made. This is why the pressure in a payroll cycle is all before the run and not after it, and why the calendar in Chapter 5 matters as much as the configuration does.

## Update versus correction

An **update** creates a new dated record and preserves history. A **correction** overwrites the existing record as if the previous value was never true. Some changes are real events — a promotion — and some are data-entry mistakes — a typo in a grade. The system needs to tell real history from erroneous history.

Promoting someone on 1 July is an update: both the old and the new grade belong in history because both were true. Fixing a misspelled surname is a correction: the old spelling was never true and should not be preserved. Using a correction to record a real-world change destroys legitimate history and can trigger incorrect retroactive payroll; it is the one habit that corrupts an audit trail silently.

The reverse mistake costs as much. Recording a typo as an update leaves the system believing an incorrect value was genuinely true for a period, which means anything reading history — a service calculation, an accrual, a retro run — will act on it. Correct the wrong record rather than stacking a new one on top of it.

The test that settles it in a workshop is one question: **was the old value ever true?** If yes, it is an update, because the past deserves to keep it. If no, it is a correction, because the past never had it. Nothing about how recently the mistake was made, how embarrassing it is, or whether payroll has run changes the answer — those things change how much work the fix is, not which operation it is.

[[lab:dating]]

## The other date-effective operations, and the vocabulary around them

Update and correction are the two a user meets. There are a few more at the edges, and the vocabulary is muddled by history, so it is worth separating what the product does from what people say.

**End-dating** closes a record as of a date. This is the ordinary way to stop something being true without pretending it never was.

**Deleting** exists and is unusual. Where it is offered, it purges the object's physical records and is not reversible — which is why Oracle's own guidance is to end-date the object or change its status to take it out of use instead. In a date-effective system, deletion is not a stronger form of end-dating; it is a different thing, and it is almost never the one that was wanted.

Then there is the older vocabulary that still circulates in interviews and in training material: *ZAP*, *delete next change*, *future change (all)*. These come from the earlier generation of Oracle HR, where they were the named options on a date-tracked delete. They are worth recognising because people still say them, and because the concepts survive in places — the extract layer, for instance, distinguishes an operation type that identifies the deletion of individual date-effective changes from one that identifies the deletion of an object together with all of its dated changes. What a consultant should not do is use that vocabulary with a client as if it described buttons on their screen.

The integration surfaces express the same choice in their own way. A bulk load decides between correction and update by whether the effective start date supplied matches an existing row, and controls what happens to later rows with an instruction and two tokens (Chapter 11). The REST interface carries the choice in a header, with a correction requiring the range mode and the exact start and end dates of the row being corrected. Three surfaces, one idea: say which row you mean, and say whether the past keeps what was there.

## Future-dated changes

A change may also be dated forward. A **future-dated change** — next month's promotion, a transfer agreed in advance, a termination with notice — is entered now and becomes effective later, and until that date the current record is what every process sees.

Two consequences are worth holding. The screen shows the record as of the date being viewed, so a user who enters a future promotion and then looks at today's record sees the old grade and assumes the change was lost. And a future-dated termination is visible to HR while payroll still pays the person, correctly, until the date arrives — which is the intended behaviour and a reliable source of worried emails. The useful habit is to ask, every time, "as of what date are we looking at this?"

There is a third consequence that shows up during cutover and catches experienced teams. Future-dated rows are real rows, and anything that rewrites a record's future can destroy them. A bulk update loaded without the instruction that retains future changes will purge the future-dated promotions somebody entered last week, silently and across the whole population — the load succeeds, the data looks right today, and three weeks later a hundred promotions do not happen. That single setting is covered in Chapter 11; the reason it belongs in this chapter too is that the damage it does is a dating problem, not a loading problem.

The operational answer is a convention rather than a control: before any mass update, produce the list of future-dated changes that already exist for the affected population, and decide explicitly whether they survive. The list is usually short. The conversation is always shorter than the recovery.

## More than one change on the same day

Occasionally two things genuinely happen to the same record on the same date — a transfer and a salary change on 1 January, or a promotion entered on top of a correction. The model allows it for employment terms and assignments, and it describes the ordering with two attributes: a sequence number within the day that starts at 1 and increases without gaps, and a flag marking which of them is the last change of that date. On every record that is not the last change of its date, the effective end date equals the effective start date — the version lasts for part of a day as far as the model is concerned.

A consultant mostly meets this through bulk loading, where it has to be supplied explicitly and is easy to get wrong, and through reporting, where a query that does not account for it returns two rows for one person on one day and inflates whatever is being counted. The safe reporting habit is to filter to the latest change of each date unless there is a reason not to.

## Retroactive changes: what the machinery actually is

A **retroactive change** ("retro") is a change entered with an effective date in the past, after payroll has already been processed for that period. Backdated promotions and late salary approvals are normal. A raise effective 1 May and approved in July means the May and June payrolls already ran at the old rate; the July run must calculate the arrears for both months and pay them.

The mechanism has four moving parts, and knowing all four is what turns retro from mysterious into diagnosable.

**The event group** is the list of changes the system is watching for. It is an event group of type Retroactive, and Oracle's recommended starting point is the predefined group that tracks changes to element entries and to assignment details such as location. A change to something in the group raises an event; a change to something outside it raises nothing, however obviously retrospective it looks to a human.

**The notification** is what an event produces for a person. Each notification carries a process date, and the behaviour when several events arrive is the part worth knowing: if an unprocessed notification already exists, a new event with an earlier date moves the process date earlier rather than creating a second notification. A salary award effective 5 March raises a notification dated 5 March; a job change effective 1 February then pulls that same notification back to 1 February, and the recalculation will start from February. Notifications sit in an awaiting-processing state until retro runs, and they can also be created by hand to force somebody into the next retro run.

**The recalculation process** — *Recalculate Payroll for Retroactive Changes* — picks up the notifications awaiting processing and recalculates each affected prior period. The critical property is that it **does not touch the original results**. It builds a parallel set of results, compares them with what was originally calculated, and where the two differ it writes the difference as a retroactive entry in the *current* period. There is a single-employee variant for the inevitable one-person emergency, and a separate flow that raises retro notifications for late hires automatically.

**The element setup** decides whether any of this applies to a given element at all. An element is only processed retroactively if it has been set up for it, which is the single most common reason retro "does not work".

Recalculation always covers **whole pay periods**, never part of one. A notification with a process date of 10 September recalculates the entire September period and every period after it. The start can be moved with an override date entered against the notification, and that override takes precedence over the two parameters that otherwise limit how far back retro will reach — an earliest processing date, and a rolling number of months.

## Setting an element up for retro

The configuration is short, and a consultant should be able to do it from memory.

On the element's additional details, answer yes to both of the questions that matter: whether the element is subject to proration, and whether it is subject to retroactive changes. Attach the retroactive event group to the element — a template that already includes the group does this for you. Then, on the element's retroactive components, create a full retroactive calculation with a reprocess type of reprocess and mark it as the default component.

There is one optional piece that clients ask for more often than consultants expect: the retroactive adjustment can be paid through a *different* element from the one that changed. That is what the retroactive pay elements section is for — an entry with its dates, an adjustment type of standard, and the element the results should land in. The reason to want it is visibility on the payslip: "Basic Salary Arrears" as its own line is a great deal easier to explain to an employee than an unexplained increase in basic salary.

Taking an element back out of retro is the same list in reverse: remove the retroactive component rows and remove the event group.

## Running retro in the right order

Retro is a sequence, not a button, and the order is load-bearing.

Start with the *Retroactive Notifications Report*, which lists the notifications outstanding before anything is processed. This is the step teams skip and the step that prevents surprises: it is the only moment at which somebody can look at who is about to receive arrears and ask whether that list is plausible.

Then run *Recalculate Payroll for Retroactive Changes*. Then run the *Retroactive Entries Report*, which shows each retroactive entry beside the original result it was compared against — and read it, because this is where a wrong answer is visible before it is paid rather than after.

Only then run *Calculate Payroll*.

The timing rule is that the recalculation belongs as close to the cut-off as possible and **before** the payroll calculation. Running it afterwards is not an error, but the adjustments it creates will sit until the next period, which turns a one-month delay into a two-month one and produces a conversation nobody enjoys.

Costing has its own step. Retroactive costing is recalculated by a separate process rather than falling out of the payroll run, which is one of the ways a month's costing can balance in HR and not in Finance (Chapter 21).

## Reading a retro that did not happen

When a client reports that "retro did not pick it up", there is a fixed list to walk, in order, and it almost always ends before the fifth item.

Look at the transaction that was supposed to cause the event — was the change actually saved, on the date claimed, as an update rather than a correction? Look at the element setup — are both the proration and retroactive questions answered yes, and does the element have its retroactive components? Look at the person's element eligibility, because an element the person is not eligible for cannot produce a retro entry for them. Look at the retroactive event group's entities and attributes, which is where a change to a field nobody added to the group goes to die. And look at the proration event group too, since the two interact.

That order is roughly the order of likelihood, and it has the useful property that each step is cheap. The temptation — opening the payroll run results first — is the expensive one, and it is usually looking at the consequence rather than the cause.

## Retro is not always money in

Two further things matter for a consultant explaining retro to a client.

First, retro affects **balances**, not just the current payslip: it re-states social insurance and tax for the prior periods too. An arrears payment in July for May and June is not simply added to July's gross — it changes what May and June's insurable earnings should have been, which changes the contributions and the tax that should have been deducted then, and the correction to all of that flows through the current period.

Second, retro is not always money in. A change that reduces pay creates a **recovery**, and a client who has never considered negative retro will want to decide its policy before the first one appears. The questions to force into the open are whether an overpayment is recovered in one period or spread, whether there is a floor below which net pay cannot fall, and who signs off a recovery from somebody who has already left. In several jurisdictions the answer to the first two is constrained by law rather than by policy, which makes this a question for the client's counsel rather than for the consultant — but it is the consultant's job to ask it before the first negative retro, not after.

## Proration

Retro answers what happens when a change arrives late. **Proration** answers what happens when a change takes effect mid-period: a raise effective on the 16th means the period has to be paid partly at each rate. Oracle prorates using a proration event group and a proration formula on the element, and the design question — calendar days, working days, or a fixed divisor — is a client decision with a visible effect on money.

The two are often confused in a workshop. The test is when the change was entered relative to the payroll run: before it, and the period is prorated; after it, and the period is retro.

The divisor question deserves more attention than it usually gets, because it is small, dull and worth real money across a year. Thirty days, actual calendar days, working days and a fixed annual divisor all produce different answers for the same half-month, and they differ systematically rather than randomly — a February joiner and an August joiner are affected in opposite directions by a calendar-days rule. The client's existing practice is the right starting point, their legal adviser is the right arbiter where a labour code speaks to it, and the decision belongs in writing in the design document, because it is the first thing queried when somebody compares a prorated month with their own arithmetic.

## Dating and the Egyptian statutory calendar

In Egypt this is not an edge case. Insurable-wage limits move every January, minimum-wage decrees and the commencement of Labour Law 14/2025 both landed mid-cycle, and statutory changes of that kind are routinely announced after the period they apply to. Retro is how the payroll absorbs them, which makes the event group a piece of statutory configuration rather than a technical nicety.

The practical shape of that is worth planning for rather than reacting to. A statutory change announced in March and effective from January is a retro event for the entire population at once — not a handful of people, all of them. That is a different operational problem from a backdated promotion: the recalculation is long, the arrears appear on every payslip in the same period, and the employee communication matters more than the configuration. Teams that have been through one of these keep two things ready — a dry-run environment where the recalculation can be timed and checked before it touches production, and a short standard explanation of the arrears line that payroll can send out on the day.

## End-dating instead of deleting

**End-dating** closes a record as of a date rather than deleting it, so that history is preserved. Terminating employment end-dates the work relationship; removing an allowance end-dates the element entry. When a client asks "can you just delete this record?", the correct consulting answer is almost always "we end-date it, and here is why that is better for you." In a date-effective SaaS system the tools are end-date, correct, or reverse. Deletion is rare, restricted, and usually the wrong instinct.

The conversation goes better with a concrete reason rather than a principle. An allowance that is deleted did not exist, so the payslips that paid it are unexplainable and the year-to-date figures do not reconcile to anything. An allowance that is end-dated stopped on a date, which is a sentence the employee, the auditor and the finance director can all accept. The client is not asking for destruction; they are asking for the thing to stop appearing. End-dating is what they actually want.

## Dating in a data migration

The same principle governs migration. History loaded as a single current row is history destroyed; loading dated records in date order is what produces a readable past (Chapter 11), and it is the part of a data migration that cannot be fixed afterwards without doing it again.

Two decisions sit behind that and both belong to the functional team. How far back does history need to go — and the honest answer is usually "as far as the entitlements reach" rather than "everything", because service dates, accrual history and statutory year-to-date figures are what later processes actually read. And what is the source of truth where the legacy system holds two dates that disagree, which it will.

The migration-specific trap is the one described above in the other direction: a load that corrects where it should update flattens a history into a single value, and because the load reported success nobody looks again. The defence is to reconcile a sample of records' *history*, not only their current state, in every rehearsal.

## Dating in reporting

Every report over a date-effective object is implicitly asking "as of when", and a report that does not say so is answering a question nobody asked.

Three patterns cover most of it. A point-in-time report takes a date and returns the rows valid on it — headcount as of 31 December. A period report takes a range and has to decide what to do with somebody who was only there for part of it — which is why joiners and leavers make headcount reports disagree. And a change report looks for rows that start or end inside the range, which is how movement is counted rather than stock.

Most arguments about numbers between HR and Finance are one of these three being compared with another of these three. Chapter 7 goes further into the metric definitions, and the analytics collection further still, but the dating root is here: the same table answers all three questions and gives three different numbers, all correct.

## How to investigate "the system calculated it wrong"

A single habit resolves most of these tickets, and it is worth writing into a support runbook.

Ask what the correct answer is and where it comes from, because about a third of the time the client's number is the one that is wrong. Then open the record *as of the date in question*, not as of today — this alone resolves another large fraction. Then look at the chain of dated rows for the period, and ask whether the change that should be there is there, whether it is on the right date, and whether it was entered as an update or a correction. Then, if the value is right in the record and wrong in the pay, move to element eligibility, the event group, and the order in which the processes were run.

What this amounts to is: the data, as of the date; then the configuration that reads it; then the process that ran. Problems are found far faster going in that direction than in the reverse one, and the reverse one is what people do under pressure.

## Common mistakes

- "The effective date is when I entered it." The system tracks the two dates separately for a reason.
- Using correction for a real event, wiping the history — or an update for a typo, enshrining it.
- Looking at today's record and concluding a future-dated change was lost.
- Running a mass update that purges everybody's future-dated changes, and finding out three weeks later.
- Treating a transaction as if it were a dated record, and asking for its date to be changed instead of reversing it.
- Reaching for delete. End-date instead.
- Blaming retro when the change was never in the retroactive event group.
- Assuming retro works on an element that was never set up for it.
- Running the retro recalculation after the payroll calculation, and wondering where the arrears went.
- Skipping the notifications report, and discovering who was in the retro run by reading payslips.
- Forgetting that retro re-states prior-period tax and insurance, not just gross pay.
- Assuming retro only adds money. It can recover money too.
- Confusing proration with retro. One is a mid-period change, the other is a late one.
- Leaving the proration divisor undocumented, then being unable to explain a part-month to the person who received it.
- Counting a period report and a point-in-time report as if they should agree.

## Sources

- Oracle, *Administering Global Payroll* — "Overview of Retroactive Pay", for event groups, notifications, the recalculation process and the period rules. https://docs.oracle.com/en/cloud/saas/human-resources/faagp/overview-of-retroactive-pay.html
- Oracle, *Implementing Global Payroll* — "How Retroactive Pay Is Calculated", for the element setup, the retroactive components and the order the processes run in. https://docs.oracle.com/en/cloud/saas/human-resources/faigp/how-retroactive-pay-is-calculated.html
- Oracle, *Implementing Global Payroll* — the "Events, Retroactive Pay and Proration" chapter, for event groups and proration formulas. https://docs.oracle.com/en/cloud/saas/human-resources/faigp/index.html
- Oracle, *HCM Data Loader* — "Overview of Loading Date-Effective Objects", for how a load chooses between a correction and an update and what it does to future rows. https://docs.oracle.com/en/cloud/saas/human-resources/fahdl/overview-of-loading-date-effective-objects.html
- Oracle, *Implementing Global Human Resources* — date-effective objects and the history they keep. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
