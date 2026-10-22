---
id: approvals
minutes: 32
---

Every chapter before this one ends at submit. This one covers what happens next, which is where a surprising share of a project's first live month actually goes. Approval routing is named in requirements workshops constantly, configured late, tested by the person who built it, and then found to be wrong by a manager who never received a notification. "How would you configure approvals for a promotion?" is also a standard interview question, and a candidate who can name where the rules live and what an approver type needs in order to resolve sounds like someone who has shipped one.

The reason approvals go wrong so reliably is that they sit at the junction of three things a project keeps in different places: the organisation's hierarchy data, its control policy, and its notification behaviour. Each is owned by somebody different, each is usually fine on its own, and the failure appears only when all three are exercised together — which is to say, in production.

## Where the rules live

Approval rules for HCM transactions are configured through the **Manage Approval Transactions for HCM** task in Setup and Maintenance, which lists every approval-enabled transaction — hire, promotion, transfer, termination, absence, salary change — and lets each one carry its own rules. Underneath it is the same workflow engine that drives the BPM Worklist, and the older path of editing rules directly in BPM still exists, but the HCM task is the supported route for HCM transactions and the one to use.

One rule set belongs to one transaction. That is worth saying plainly, because clients describe approvals as a single policy ("everything goes to the line manager, then HR") and then list four exceptions, each of which is a condition inside one transaction's rule set rather than a new policy. Pinning down which transactions are in scope is the first thing to do, and the list is usually longer than the workshop assumes.

A transaction's rules are made of **conditions** and **participants**. A condition tests attributes of the transaction — the type of change, the amount, the reason, the legal employer, the worker's grade — and decides whether a participant applies. A participant says who is asked and how many of them. A rule set can contain several of each, which is how one transaction routes four different ways depending on what it contains.

## Approver types, and what each one needs to exist

A rule says who approves, as an **approver type** plus a depth. The common ones:

- **Supervisory hierarchy** — the manager chain from the worker, up as many levels as the rule asks for. It needs manager relationships to be complete; a gap stops the chain.
- **Position hierarchy** — the chain of positions rather than people. It needs positions, and a position hierarchy that is actually maintained.
- **Job level** — climbs the management chain until it reaches someone at or above a stated level. It needs job levels populated on jobs.
- **Representative** — the area of responsibility from Chapter 15: the HR representative or other named responsibility for that worker's population.
- **Approval group** — a named set of people, approving in serial or in parallel.
- **Application role or named user** — a backstop, and the one to be most careful with, because it hard-codes a person into a process they will eventually leave.

The failure that follows from this list is the common one: routing a promotion up a **position hierarchy** at a client who never built positions leaves the transaction with no path to follow. It does not error in the way a missing element errors. It sits there. Chapter 7's distinction between the solid and the dotted line matters here too — approvals follow the solid line, and a matrix organization that routes to the functional manager has to say so explicitly.

Each approver type is really a **dependency on data somebody else maintains**, and that is the useful way to think about the choice. Supervisory routing depends on the manager field being right on every assignment. Job-level routing depends on job levels being populated across the catalogue — which, at a client who built the catalogue without them, means they are all empty and the rule climbs forever or not at all. Representative routing depends on areas of responsibility being kept current as people move.

Before choosing a type, ask who maintains the data it rests on and whether they know they are now in the approval path. That question has prevented more go-live incidents than any amount of rule testing.

## Serial, parallel, and what "approved" means

Participants run in **serial** — each approver in turn, any rejection ending it — or in **parallel**, where several are asked at once. For a parallel group the question to settle with the client is whether every member must approve or whether the first response decides, because "the finance team approves" means one of those two things and they behave differently when somebody is on leave.

The same question applies to rejection in a parallel group: does one rejection end the transaction, or is it decided by the majority or by a specific person. Clients rarely volunteer an answer and always have an opinion once asked.

Rules can also carry conditions, and this is where a functional consultant spends their configuration time: route to one more level when the salary increase exceeds a threshold, skip HR for a reason code that means a correction, require the compensation team only for off-cycle changes. The ceiling where it stops being a functional job is roughly where the condition stops being expressible in the rule editor and starts needing custom logic — at which point it belongs with a technical colleague rather than in a workbook.

## The approval matrix, as a deliverable

The way to get this right is to produce one artefact early and have the client sign it: a matrix with one row per transaction and columns for who may initiate it, who approves and in what order, what conditions change the route, who is notified without approving, and who may act on behalf (Chapter 22).

That document does three things. It forces the client to decide, in a room, questions they would otherwise answer one at a time over six months. It surfaces the disagreements inside their own organisation — typically about whether a manager's manager really needs to see a routine transfer. And it becomes the test plan, because every row is a case.

The second effect of writing it down is usually a shorter list of approvals than the client first described. Asked transaction by transaction who genuinely needs to approve, organisations frequently discover that two of the four levels they were about to configure exist because of a paper form that no longer exists. Removing those is a real contribution; a four-step approval on a routine change is a design that users will work around.

## Notifications, reminders and the quiet failure

An approval that nobody sees is an approval that does not happen, so the notification design is part of the approval design.

Approvers are reached in two places: the notification list inside the application, and email. Both matter, and in a workforce of managers who live in their inbox the second is the one that works. The content of those notifications is configurable, and the default text is rarely as useful as it could be — an approval request that says what is being asked, for whom, with the before and after values, is approved faster and more accurately than one that says a transaction awaits action.

Two further behaviours belong in the design conversation. **Reminders** for a request that has sat too long, and an **expiry or escalation** path for one that is never answered. Without them, a manager on extended leave is a permanent stop, and the transaction sits in the console until somebody goes looking for it.

And every approver needs a **delegation** route — a way to hand their approvals to a colleague while they are away, which is the same mechanism Chapter 15 describes for role delegation. Clients consistently forget this until the first holiday season.

## Auto-approval is still a configuration

Clients ask for "no approvals" more often than consultants expect, usually for data-migration cutover or for a transaction type they consider administrative. That is **auto-approval**, and it is configured — a rule that approves automatically — rather than an absence of rules. Deleting the rule set instead produces transactions with nowhere to go. It is also worth asking whether they mean no approvals forever or none during cutover, because the second is a temporary rule that somebody must remember to put back.

"Somebody must remember" is doing a lot of work in that sentence, so make it an item on the cutover plan (Chapter 16) with an owner and a date, rather than a note. A system that went live with approvals switched off for migration and never had them switched on is a control finding waiting for an auditor.

## The Transaction Console

The **Transaction Console** is where a transaction that has not landed is found. It lists in-flight, errored and completed transactions, shows where each one is waiting, and allows a privileged user to withdraw a transaction, force it through, or see the error behind a failure. In hypercare it is the first screen to open when someone says a change "did not happen": nine times out of ten the change exists and is sitting in an approval that never reached anybody.

The three things it can do are worth distinguishing, because they are not equivalent. **Withdrawing** removes the transaction, so the change does not happen and the initiator has to start again. **Forcing it through** approves it without the approver, which gets the change made and leaves a record that it bypassed the control — acceptable occasionally, corrosive as a habit. And **reading the error** is what should happen first, because a transaction that failed for a data reason will fail again the next time somebody submits it.

Access to it is itself a design decision. It can withdraw and force-approve transactions, so it belongs with a small, named group — and that group should be agreed before go-live rather than during the first incident.

## Testing approvals properly

An approval path cannot be tested by the person who configured it, because the one thing being tested is whether it reaches somebody else. Real testing needs the actual approver accounts, in the right hierarchy, with notifications switched on, and it needs the negative cases: an approver on leave, an approver who has left the company, a worker whose manager position is vacant. Those are the cases that fail in production, and they are cheap to script in user acceptance testing and expensive to meet in week one.

A fuller negative list, from the ones that actually occur: the worker whose manager is themselves, which happens after a bad data load and makes a chain loop; the worker at the top of the hierarchy, whose manager chain has nowhere to go; the transaction initiated *by* the person who would approve it; the approver whose own record is the subject of the transaction; and the transaction submitted on the day somebody's manager changes.

Each has a right answer and none of them have a default one. Settling them during design takes an hour. Meeting them in production takes a week and a difficult conversation.

## A catalogue of patterns worth recognising

Most client requirements are one of a small number of shapes. Recognising the shape is faster than designing from scratch, and naming it in a workshop is a sign of experience.

**The threshold.** Route to one extra level when an amount exceeds a figure — a salary increase above a percentage, a bonus above a value. The design questions are whose figure it is compared against (the individual's salary, the budget, an absolute amount) and whether the threshold is per transaction or cumulative over a period, because clients usually mean the second and say the first.

**The correction bypass.** A transaction entered with a reason code meaning "fixing a mistake" skips the approvals that the original change already went through. Sensible, and it needs a control: if the bypass reason is available to everybody, it is the route every transaction will take.

**The self-approval block.** A transaction about the approver, or raised by them, must route somewhere else. Every client wants this once it is pointed out, and almost none state it as a requirement.

**The dual control.** Two people must approve, and they must be different people — the shape behind bank-detail changes and anything with a fraud exposure. It is a parallel participant with an additional rule rather than a serial chain.

**The notify-only.** Somebody needs to know and does not decide. Routing them as an approver to achieve this is the most common design error in this chapter: it puts a decision in the hands of someone who has none, and stops the transaction when they are on holiday.

**The gate.** A transaction cannot proceed until something outside the system has happened — a signed document, a completed check. The honest implementation is usually a journey task (Chapter 14) that the process waits on, rather than an approver standing in for a condition.

**The regional variant.** The same transaction approves differently per country, because the statutory or cultural expectation differs. Expressed as a condition on legal employer rather than as a separate transaction.

## Transactions that never pass through approvals at all

A point that reliably surprises a client in testing: changes made in **bulk** do not route the way a screen transaction does.

A mass update loaded through HCM Data Loader (Chapter 11) writes directly, and that is the whole point of it — nobody wants ten thousand records sitting in an approval queue. So does a change made by an integration through REST, and so does a correction made by a privileged user through an administrative route.

That is correct behaviour and it is a control gap the client should know about rather than discover. Two things make it manageable: restrict who can load, and make loads visible — a log of what was loaded, by whom, when and why, kept outside the system if necessary, because this is the route by which a salary can change without an approval and the auditor will ask about it.

The design conversation worth having is which of the client's routine processes are bulk by nature — an annual increase, a restructure, a mass transfer — and what the governance around each is, since the approval rules will not be providing it.

## Reading the history

Every completed transaction carries its approval history: who was asked, when, what they did, and any comment they left. That record is the answer to "who approved this", which is one of the two questions an auditor asks about any change — the other being "should they have".

Two practical uses beyond audit. It is the fastest way to understand a rule that is behaving unexpectedly, because the history shows the path actually taken rather than the path the configuration implies. And it is how a dispute about a change is settled, which matters most for exactly the transactions people dispute: salary, termination, and anything with money attached.

Comments are worth encouraging in the notification design, because an approval with a reason is worth considerably more than an approval without one, and the cost of asking is a single field.

## When approvals are the performance problem

Long approval chains have costs beyond the waiting.

Each level adds a notification, a wait, and a chance of the transaction stalling. A five-level chain where each approver takes two days is a two-week transaction, which for a hire means a start date missed. Clients who complain that the system is slow are frequently describing a process that is slow, and the remedy is a shorter chain rather than a faster server.

There is also a real processing cost at volume: a bulk-initiated set of transactions that each spawn an approval chain is a large amount of workflow, and that is another argument for loading rather than transacting where the change is genuinely administrative.

The design heuristic: every approval level should be able to answer "what would this person reject, and how often do they?" If the answer is "nothing" and "never", the level is a notification pretending to be a control, and removing it makes the process faster and the remaining approvals more meaningful.

## Moving approval rules between environments

Approval configuration is setup data and has to travel with everything else (Chapter 16), and it is one of the pieces that is routinely forgotten at the first environment move — with a characteristic symptom: transactions in the target environment approve instantly, or not at all, and the configuration looks correct because people are reading the HCM side rather than the rules.

Add approval rules to the migration checklist explicitly, test one transaction end to end in every environment after a move, and remember that an approval path depends on *data* as well as configuration: a rule that routes up a manager hierarchy behaves differently in an environment whose hierarchy is a refreshed copy of production.

## Where approvals meet the rest of the system

Three connections are worth making explicitly, because they are where approval problems are actually caused.

**Hierarchy data** (Chapters 2, 3 and 7). Most approval failures are manager data failures. A routing design is only as good as the structure beneath it, and improving the structure fixes more approval tickets than editing rules does.

**Security** (Chapter 15). An approver who cannot see the worker's record may be unable to act on the notification meaningfully. Approval routing and data security are designed together or they disagree.

**The payroll calendar** (Chapters 5 and 22). An approval that completes after the cut-off is a change that lands a period late. Where that matters — a salary change, a termination, a paid absence — the approval design needs either a short path or a reminder tied to the cut-off date.

## Common mistakes

- Routing up a position hierarchy at a client who manages by job.
- Choosing an approver type without asking who maintains the data it depends on.
- Routing by job level at a client whose job levels were never populated.
- Treating "no approvals" as deleting the rules rather than configuring auto-approval.
- Switching approvals off for cutover with no owner and no date for switching them back on.
- Hard-coding a named user as approver, who then leaves.
- Agreeing "the team approves" without settling whether the first response decides.
- Leaving rejection behaviour in a parallel group undefined.
- Configuring four approval levels because a paper form once had four signatures.
- Leaving the notification text as delivered, so approvers cannot tell what they are approving.
- Designing no reminders and no escalation, so one person's holiday stops a process.
- Forgetting delegation until the first holiday season.
- Testing approvals single-handed, so nothing proves a notification ever arrived.
- Never testing the loop, the top of the hierarchy, or the self-approval case.
- Using force-approve as a routine remedy rather than an exception.
- Leaving Transaction Console access unassigned until the first stuck transaction.
- Reading a threshold as per transaction when the client meant cumulative.
- Making a correction-bypass reason available to everybody.
- Routing a notify-only stakeholder as an approver, and stopping the process when they travel.
- Standing an approver in for a condition that a journey task should carry.
- Not telling the client that bulk loads bypass approvals entirely.
- Keeping no record of who loaded what, when and why.
- Keeping an approval level that has never rejected anything.
- Leaving approval rules off the environment migration checklist.

## Sources

- Oracle, *Implementing Global Human Resources* — the approvals chapters, covering the Manage Approval Transactions for HCM task, approver types and rule conditions. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
- Oracle, *Using Common Features for HCM* — the Transaction Console, and what withdrawing or forcing a transaction does. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/index.html
- Oracle, *Securing HCM* — role delegation, which is the same mechanism approvers use when they are away. https://docs.oracle.com/en/cloud/saas/human-resources/ochus/index.html
