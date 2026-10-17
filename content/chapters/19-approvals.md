---
id: approvals
num: 19
domain: hcm
track: technical
title: Approvals & the Transaction Console
subtitle: Where a transaction goes after someone presses submit
hue: 80
minutes: 11
labs: 
terms: approval-rule, approver-type, serial-vs-parallel-approval, transaction-console, auto-approval
---

Every chapter before this one ends at submit. This one covers what happens next, which is where a surprising share of a project's first live month actually goes. Approval routing is named in requirements workshops constantly, configured late, tested by the person who built it, and then found to be wrong by a manager who never received a notification. "How would you configure approvals for a promotion?" is also a standard interview question, and a candidate who can name where the rules live and what an approver type needs in order to resolve sounds like someone who has shipped one.

## Where the rules live

Approval rules for HCM transactions are configured through the **Manage Approval Transactions for HCM** task in Setup and Maintenance, which lists every approval-enabled transaction — hire, promotion, transfer, termination, absence, salary change — and lets each one carry its own rules. Underneath it is the same workflow engine that drives the BPM Worklist, and the older path of editing rules directly in BPM still exists, but the HCM task is the supported route for HCM transactions and the one to use.

One rule set belongs to one transaction. That is worth saying plainly, because clients describe approvals as a single policy ("everything goes to the line manager, then HR") and then list four exceptions, each of which is a condition inside one transaction's rule set rather than a new policy. Pinning down which transactions are in scope is the first thing to do, and the list is usually longer than the workshop assumes.

## Approver types, and what each one needs to exist

A rule says who approves, as an **approver type** plus a depth. The common ones:

- **Supervisory hierarchy** — the manager chain from the worker, up as many levels as the rule asks for. It needs manager relationships to be complete; a gap stops the chain.
- **Position hierarchy** — the chain of positions rather than people. It needs positions, and a position hierarchy that is actually maintained.
- **Job level** — climbs the management chain until it reaches someone at or above a stated level. It needs job levels populated on jobs.
- **Representative** — the area of responsibility from Chapter 15: the HR representative or other named responsibility for that worker's population.
- **Approval group** — a named set of people, approving in serial or in parallel.
- **Application role or named user** — a backstop, and the one to be most careful with, because it hard-codes a person into a process they will eventually leave.

The failure that follows from this list is the common one: routing a promotion up a **position hierarchy** at a client who never built positions leaves the transaction with no path to follow. It does not error in the way a missing element errors. It sits there. Chapter 7's distinction between the solid and the dotted line matters here too — approvals follow the solid line, and a matrix organization that routes to the functional manager has to say so explicitly.

## Serial, parallel, and what "approved" means

Participants run in **serial** — each approver in turn, any rejection ending it — or in **parallel**, where several are asked at once. For a parallel group the question to settle with the client is whether every member must approve or whether the first response decides, because "the finance team approves" means one of those two things and they behave differently when somebody is on leave.

Rules can also carry conditions, and this is where a functional consultant spends their configuration time: route to one more level when the salary increase exceeds a threshold, skip HR for a reason code that means a correction, require the compensation team only for off-cycle changes. The ceiling where it stops being a functional job is roughly where the condition stops being expressible in the rule editor and starts needing custom logic — at which point it belongs with a technical colleague rather than in a workbook.

## Auto-approval is still a configuration

Clients ask for "no approvals" more often than consultants expect, usually for data-migration cutover or for a transaction type they consider administrative. That is **auto-approval**, and it is configured — a rule that approves automatically — rather than an absence of rules. Deleting the rule set instead produces transactions with nowhere to go. It is also worth asking whether they mean no approvals forever or none during cutover, because the second is a temporary rule that somebody must remember to put back.

## The Transaction Console

The **Transaction Console** is where a transaction that has not landed is found. It lists in-flight, errored and completed transactions, shows where each one is waiting, and allows a privileged user to withdraw a transaction, force it through, or see the error behind a failure. In hypercare it is the first screen to open when someone says a change "did not happen": nine times out of ten the change exists and is sitting in an approval that never reached anybody.

Access to it is itself a design decision. It can withdraw and force-approve transactions, so it belongs with a small, named group — and that group should be agreed before go-live rather than during the first incident.

## Testing approvals properly

An approval path cannot be tested by the person who configured it, because the one thing being tested is whether it reaches somebody else. Real testing needs the actual approver accounts, in the right hierarchy, with notifications switched on, and it needs the negative cases: an approver on leave, an approver who has left the company, a worker whose manager position is vacant. Those are the cases that fail in production, and they are cheap to script in user acceptance testing and expensive to meet in week one.

## Common mistakes

- Routing up a position hierarchy at a client who manages by job.
- Treating "no approvals" as deleting the rules rather than configuring auto-approval.
- Hard-coding a named user as approver, who then leaves.
- Agreeing "the team approves" without settling whether the first response decides.
- Testing approvals single-handed, so nothing proves a notification ever arrived.
- Leaving Transaction Console access unassigned until the first stuck transaction.

## Sources

- Oracle, *Implementing Global Human Resources* — the approvals chapters, covering the Manage Approval Transactions for HCM task, approver types and rule conditions. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
- Oracle, *Using Common Features for HCM* — the Transaction Console, and what withdrawing or forcing a transaction does. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/index.html
