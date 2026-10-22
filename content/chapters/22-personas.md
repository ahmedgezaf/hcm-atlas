---
id: personas
num: 22
domain: hcm
track: functional
title: Self-Service and the Three Seats
subtitle: Employee, manager, HR — one record, three doors into it
hue: 347
minutes: 10
labs: three-seats
terms: self-service, me-my-team-my-client-groups, quick-action, acting-on-behalf
---

Most of this atlas describes records: the person, the assignment, the absence, the element entry. Real projects are judged on something else — who touches those records, from which screen, and what happens next. A leave request that is configured perfectly but can only be entered by HR is a design that has quietly moved the HR team's workload in the wrong direction. Self-service is the part of Global HR that decides this, and it is where most of a client's users will ever meet the system.

The useful frame is three seats around one record. The **employee** acts on their own data. The **manager** acts on their team's. **HR** — HR specialists, absence and payroll administrators — acts on whole populations. Every transaction in Fusion can be described by which of the three seats starts it, which approves it, and which can correct it afterwards.

## Me, My Team, My Client Groups

Fusion's home page reflects the three seats directly. **Me** holds what a person does for themselves: personal details, contacts, bank accounts for pay, absences, payslips, goals. **My Team** holds what a manager does for their reports: approve, promote, transfer, change working hours, view the team's absences. **My Client Groups** holds what HR does for the populations they are responsible for: hire, terminate, correct, run processes, maintain balances.

Inside each area the work is launched through **quick actions** — a named task such as Request Absence, Change Manager or Promote, opening a guided flow. Quick actions are not a separate permission system. Whether one appears for a user is decided by their roles (Chapter 15): the employee abstract role gives the Me actions, the line manager role the My Team actions, and an HR job role the My Client Groups actions, each scoped by the data security that says over whom. "The button is missing" is therefore almost always a role question, and checking the user's roles and data scope comes before anything else.

The three areas are labels for audiences, not separate data. A manager changing a report's working hours in My Team and an HR specialist doing the same in My Client Groups write to the same assignment, with the same effective dating (Chapter 4). What differs is what each is allowed to see, which fields the flow shows them, and what approval the change triggers.

[[fig:three-doors]]

## One absence, three seats

Absence shows the pattern most clearly, because every seat has a distinct job. The employee requests time off, sees their balance and its projection, and can withdraw a request that has not been taken. The manager approves or rejects it — through the approval rules of Chapter 19 — and sees it on the team calendar alongside everyone else's. HR, or an absence administrator, can record an absence on a worker's behalf, enrol or adjust plans, correct a balance with a reason, and run the accrual processes of Chapter 6 that keep every balance true.

[[lab:three-seats]]

The handover to payroll is where the seats meet the run. An approved, paid absence becomes an absence element in the next payroll (Chapter 6); an unpaid one becomes a deduction. Neither the employee nor the manager sees that step, and neither should have to — but it means an approval that arrives after the payroll cutoff is paid a period late, which is a self-service design question about cutoffs and reminders rather than a payroll defect.

## Acting on someone's behalf

Every self-service design needs an answer for the people who cannot or will not use it. A worker with no system account, a manager on leave, a request made by phone — each ends with somebody **acting on behalf** of someone else. Fusion supports this directly: HR can submit most employee and manager transactions from My Client Groups, and an approval waiting on someone who is away can be reassigned or delegated through the approval tooling rather than left to expire (Chapter 19).

The design question is whose name the transaction carries and whether it still routes for approval. An absence that HR records for an employee who phoned in sick may reasonably skip the manager's approval; a salary change that HR keys for a manager should not skip the approvals that would have applied had the manager keyed it. Settling which transactions bypass approval when HR acts, and agreeing it in writing, avoids a control finding in the first audit.

## Adoption is part of the design

Many workforces in Egypt and the wider region include factory floors, field crews and retail staff who work without a corporate login, and a self-service design that assumes everybody has one fails on day one. The options are known: shared kiosks, mobile access, HR or a team leader acting on behalf, or a hybrid in which office staff self-serve and everyone else goes through HR. None is wrong, but the choice changes the approval rules, the security design and the training plan, so it belongs in the first workshop rather than in hypercare.

The opposite failure is self-service switched on everywhere with no change plan. Managers who were never told they now approve leave do not approve leave, the requests sit in the Transaction Console, and HR is blamed for a system that is working exactly as configured.

## Common mistakes

- Treating Me, My Team and My Client Groups as separate data rather than three views of the same records.
- Debugging a missing quick action before checking the user's roles and data scope.
- Designing self-service for a workforce that mostly has no system access.
- Letting HR act on behalf without deciding which transactions still route for approval.
- Switching on manager approvals without telling the managers, then reading the backlog as a defect.
- Ignoring the payroll cutoff when designing absence approvals.

## Sources

- Oracle, *Securing HCM* — "Overview of Quick Actions". https://docs.oracle.com/en/cloud/saas/human-resources/ochus/overview-of-quick-actions.html
- Oracle, *Using Global Human Resources* — "Quick Actions". https://docs.oracle.com/en/cloud/saas/human-resources/fawhr/quick-actions.html
- Oracle, *Using Absence Management* — "Overview of Absence Processes". https://docs.oracle.com/en/cloud/saas/human-resources/faiam/overview-of-absence-processes.html
- Oracle, *Securing HCM* — role types and the abstract employee and line manager roles. https://docs.oracle.com/en/cloud/saas/human-resources/ochus/index.html
