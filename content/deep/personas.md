---
id: personas
minutes: 28
---

Most of this atlas describes records: the person, the assignment, the absence, the element entry. Real projects are judged on something else — who touches those records, from which screen, and what happens next. A leave request that is configured perfectly but can only be entered by HR is a design that has quietly moved the HR team's workload in the wrong direction. Self-service is the part of Global HR that decides this, and it is where most of a client's users will ever meet the system.

The useful frame is three seats around one record. The **employee** acts on their own data. The **manager** acts on their team's. **HR** — HR specialists, absence and payroll administrators — acts on whole populations. Every transaction in Fusion can be described by which of the three seats starts it, which approves it, and which can correct it afterwards.

## Me, My Team, My Client Groups

Fusion's home page reflects the three seats directly. **Me** holds what a person does for themselves: personal details, contacts, bank accounts for pay, absences, payslips, goals. **My Team** holds what a manager does for their reports: approve, promote, transfer, change working hours, view the team's absences. **My Client Groups** holds what HR does for the populations they are responsible for: hire, terminate, correct, run processes, maintain balances.

Inside each area the work is launched through **quick actions** — a named task such as Request Absence, Change Manager or Promote, opening a guided flow. Quick actions are not a separate permission system. Whether one appears for a user is decided by their roles (Chapter 15): the employee abstract role gives the Me actions, the line manager role the My Team actions, and an HR job role the My Client Groups actions, each scoped by the data security that says over whom. "The button is missing" is therefore almost always a role question, and checking the user's roles and data scope comes before anything else.

The three areas are labels for audiences, not separate data. A manager changing a report's working hours in My Team and an HR specialist doing the same in My Client Groups write to the same assignment, with the same effective dating (Chapter 4). What differs is what each is allowed to see, which fields the flow shows them, and what approval the change triggers.

[[fig:three-doors]]

## The seats a three-seat model leaves out

The frame is a good one and it is a simplification, so it is worth naming what sits outside it before designing from it.

**The approver** is often not the line manager — a finance approver on a salary change, a compliance approver on a contract (Chapter 19). They act on the record without owning it.

**The administrator** is a different seat from the HR business partner even though both live in My Client Groups: an absence administrator or payroll administrator runs processes and fixes data for a population they have no relationship with, which is a different scope and a different risk profile.

**The person acting on behalf of somebody else** is a seat the record does not naturally show, and it is covered below.

**And the reader** — an auditor, a finance analyst, an executive — needs to see without touching, which is a role with data access and almost no function privileges, and which is reliably forgotten until somebody asks for it.

A design that has thought about six seats rather than three produces a role catalogue (Chapter 15) that survives contact with the organisation.

## One absence, three seats

Absence shows the pattern most clearly, because every seat has a distinct job. The employee requests time off, sees their balance and its projection, and can withdraw a request that has not been taken. The manager approves or rejects it — through the approval rules of Chapter 19 — and sees it on the team calendar alongside everyone else's. HR, or an absence administrator, can record an absence on a worker's behalf, enrol or adjust plans, correct a balance with a reason, and run the accrual processes of Chapter 6 that keep every balance true.

[[lab:three-seats]]

The handover to payroll is where the seats meet the run. An approved, paid absence becomes an absence element in the next payroll (Chapter 6); an unpaid one becomes a deduction. Neither the employee nor the manager sees that step, and neither should have to — but it means an approval that arrives after the payroll cutoff is paid a period late, which is a self-service design question about cutoffs and reminders rather than a payroll defect.

## Designing per seat, not per feature

The practical method is to take each transaction in scope and answer five questions about it, in order.

Which seat **initiates** it. Which seat **approves** it, and under what conditions. Which seats can **see** it, during and after. Which seat can **correct** it once it has happened. And what each seat is **shown** — because the same flow can present different fields to different audiences through the design studio (Chapter 14).

That last question is the one that is usually skipped and the one that produces the most user complaints. A transfer flow that asks a line manager for a cost centre, a payroll, and a statutory classification is a flow that line managers will not complete. The same flow with four fields, for the same transaction, completes. The information that was removed has not gone anywhere — HR supplies it, which is the right division of labour.

Running those five questions over every transaction produces the same artefact as Chapter 19's approval matrix, from a different angle, and the two should be built together.

## Acting on someone's behalf

Every self-service design needs an answer for the people who cannot or will not use it. A worker with no system account, a manager on leave, a request made by phone — each ends with somebody **acting on behalf** of someone else. Fusion supports this directly: HR can submit most employee and manager transactions from My Client Groups, and an approval waiting on someone who is away can be reassigned or delegated through the approval tooling rather than left to expire (Chapter 19).

The design question is whose name the transaction carries and whether it still routes for approval. An absence that HR records for an employee who phoned in sick may reasonably skip the manager's approval; a salary change that HR keys for a manager should not skip the approvals that would have applied had the manager keyed it. Settling which transactions bypass approval when HR acts, and agreeing it in writing, avoids a control finding in the first audit.

The second question is **traceability**. A transaction entered by HR on a manager's instruction should be identifiable as such afterwards, because the question "who decided this" will be asked. Where the product records the submitter, that is the answer; where a process relies on an instruction given by phone, the control is a note in the transaction rather than a memory.

## Adoption is part of the design

Many workforces in Egypt and the wider region include factory floors, field crews and retail staff who work without a corporate login, and a self-service design that assumes everybody has one fails on day one. The options are known: shared kiosks, mobile access, HR or a team leader acting on behalf, or a hybrid in which office staff self-serve and everyone else goes through HR. None is wrong, but the choice changes the approval rules, the security design and the training plan, so it belongs in the first workshop rather than in hypercare.

The opposite failure is self-service switched on everywhere with no change plan. Managers who were never told they now approve leave do not approve leave, the requests sit in the Transaction Console, and HR is blamed for a system that is working exactly as configured.

Three things make the difference between adoption and a backlog.

**Tell people what changed, in the terms of their own job.** "You now approve leave for your team, and here is what happens if you do not" is a message; a system training deck is not.

**Make the first thing they do easy.** The transactions a manager meets most often should be the ones with the fewest fields and the clearest notifications. Optimising the rare transaction and leaving the common one cluttered is the wrong way round.

**Measure it.** The share of absence requests entered by employees rather than by HR, the median time an approval waits, the number of transactions sitting in the console — three numbers, available from the system, that say whether the design is working. A client who watches them for the first quarter fixes the problems while anyone still cares.

## Privacy between the seats

One design question deserves separating from the rest because it is a legal matter as much as a usability one: what a manager should be able to see.

A line manager needs enough to run their team — absence, working hours, the structure of their reports' assignments. They do not automatically need a report's national identifier, their home address, their bank details, their medical certificates or, in many organisations, their salary history. Those are decisions to make deliberately, with the client's own data-protection position behind them, and to implement through the combination of data security (Chapter 15) and what the flow displays (Chapter 14).

The default to be careful about is the cheerful one: granting managers broad visibility because it is easier than designing it. The grant is invisible until it is a complaint, and by then it is in production.

A related case in this region: sick-leave certificates and the reasons attached to them are medical information. Where a qualification plan requires certification (Chapter 6), the design has to say who can see the document, which is usually a smaller group than the people who can see that an absence occurred.

## What the seats mean for training and support

The three-seat frame is also the right shape for the client's training and their support model, which is a contribution a consultant can make for nothing.

Employees need one short thing, delivered once, about the four tasks they will ever do. Managers need a slightly longer thing about approving and about the handful of transactions they initiate, delivered close enough to go-live to be remembered. HR needs real training, repeatedly, and will still have questions in month six.

The support model follows the same shape: employee questions are a help-desk script, manager questions are usually "where is the button" and answered by the same script, and HR questions are the ones that need somebody who knows the configuration. Planning support as one queue means the HR questions wait behind the password resets.

## Common mistakes

- Treating Me, My Team and My Client Groups as separate data rather than three views of the same records.
- Debugging a missing quick action before checking the user's roles and data scope.
- Designing for three seats and forgetting the approver, the administrator and the read-only reader.
- Showing a line manager every field the transaction supports, and getting no completed transactions.
- Designing self-service for a workforce that mostly has no system access.
- Letting HR act on behalf without deciding which transactions still route for approval.
- Leaving no trace of who instructed a transaction somebody else keyed.
- Switching on manager approvals without telling the managers, then reading the backlog as a defect.
- Optimising the rare transaction and leaving the common one cluttered.
- Never measuring adoption, so nobody knows whether the design worked.
- Granting managers broad visibility because it is easier than designing it.
- Letting medical certification be visible to everyone who can see the absence.
- Ignoring the payroll cutoff when designing absence approvals.
- Planning one support queue for three audiences with completely different questions.

## Sources

- Oracle, *Securing HCM* — "Overview of Quick Actions". https://docs.oracle.com/en/cloud/saas/human-resources/ochus/overview-of-quick-actions.html
- Oracle, *Using Global Human Resources* — "Quick Actions". https://docs.oracle.com/en/cloud/saas/human-resources/fawhr/quick-actions.html
- Oracle, *Using Absence Management* — "Overview of Absence Processes". https://docs.oracle.com/en/cloud/saas/human-resources/faiam/overview-of-absence-processes.html
- Oracle, *Securing HCM* — role types and the abstract employee and line manager roles. https://docs.oracle.com/en/cloud/saas/human-resources/ochus/index.html
