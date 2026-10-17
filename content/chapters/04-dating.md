---
id: dating
num: 4
domain: hcm
track: functional
title: Effective Dating
subtitle: Nothing is deleted. Everything has the date it became true.
hue: 278
minutes: 12
labs: dating
terms: effective-date, update-vs-correction, retroactive-change-retro, end-dating, future-dated-change, retroactive-event-group, proration
---

Oracle HCM is a date-effective system. Almost nothing is ever deleted; changes are recorded with the date on which they become true in the real world. People coming from transactional systems trip over this more than anything else, and it has direct payroll consequences — which is why this short chapter sits underneath every record in the atlas.

## The effective date is not the entry date

The **effective date** is the date on which a change becomes true — not the date it was typed into the system. HR reality and data entry rarely happen on the same day: a promotion effective 1 January may be entered on 15 January, and the system must know the person was at the new grade from the first. Every date-effective record has a start date and an end date. Setting the effective date correctly is the difference between a correct payslip and a retroactive correction, and most "the system calculated it wrong" tickets turn out to be effective-date errors. The system tracks the entry date separately, for audit.

Screens carry the same idea. A person search run as of a past date returns the organization as it was then, not as it is now — which is how a consultant answers "who reported to her in March" without a report. It is also the first thing to check when a user insists a record is missing: they may be looking at it on the wrong day.

## Which objects are dated, and which are not

Not everything in the system keeps history, and knowing the difference saves an afternoon. The person, the work relationship, work terms, the assignment, salary and element entries are all date-effective: each change writes a new row with its own window. Reference data such as jobs, grades and locations is date-effective too, which is why a grade can be valid from one date and not before.

Transaction records are not. A payroll run, a flow, an approval — these happen once, at a point in time, and are not re-dated afterwards. When a client asks to "change the date" of something, the first question is which of the two kinds it is, because for the first the answer is an update and for the second it is a reversal and a re-run.

## Update versus correction

An **update** creates a new dated record and preserves history. A **correction** overwrites the existing record as if the previous value was never true. Some changes are real events — a promotion — and some are data-entry mistakes — a typo in a grade. The system needs to tell real history from erroneous history.

Promoting someone on 1 July is an update: both the old and the new grade belong in history because both were true. Fixing a misspelled surname is a correction: the old spelling was never true and should not be preserved. Using a correction to record a real-world change destroys legitimate history and can trigger incorrect retroactive payroll; it is the one habit that corrupts an audit trail silently.

The reverse mistake costs as much. Recording a typo as an update leaves the system believing an incorrect value was genuinely true for a period, which means anything reading history — a service calculation, an accrual, a retro run — will act on it. Correct the wrong record rather than stacking a new one on top of it.

[[lab:dating]]

## Future-dated changes

A change may also be dated forward. A **future-dated change** — next month's promotion, a transfer agreed in advance, a termination with notice — is entered now and becomes effective later, and until that date the current record is what every process sees.

Two consequences are worth holding. The screen shows the record as of the date being viewed, so a user who enters a future promotion and then looks at today's record sees the old grade and assumes the change was lost. And a future-dated termination is visible to HR while payroll still pays the person, correctly, until the date arrives — which is the intended behaviour and a reliable source of worried emails. The useful habit is to ask, every time, "as of what date are we looking at this?"

## Retroactive changes

A **retroactive change** ("retro") is a change entered with an effective date in the past, after payroll has already been processed for that period. Backdated promotions and late salary approvals are normal. A raise effective 1 May and approved in July means the May and June payrolls already ran at the old rate; the July run must calculate the arrears for both months and pay them. Oracle handles this through retroactive events and the *Recalculate Payroll for Retroactive Changes* process, which runs before the main calculation and creates retro entries the payroll run then picks up.

What makes retro predictable rather than mysterious is the **retroactive event group**: the list of changes the system is watching for. A change to something in the group raises an event and will be reprocessed; a change to something outside it will not, however obviously retrospective it looks to a human. When a client reports that "retro did not pick it up", the event group is where to look before anything else, and the *Retroactive Notification* report is what shows which events are waiting.

Two further things matter for a consultant explaining retro to a client. First, retro affects balances, not just the current payslip: it re-states social insurance and tax for the prior periods too. Second, retro is not always money in — a change that reduces pay creates a recovery, and a client who has never considered negative retro will want to decide its policy before the first one appears.

In Egypt this is not an edge case. Insurable-wage limits move every January, minimum-wage decrees and the commencement of Labour Law 14/2025 both landed mid-cycle, and statutory changes of that kind are routinely announced after the period they apply to. Retro is how the payroll absorbs them, which makes the event group a piece of statutory configuration rather than a technical nicety.

## Proration

Retro answers what happens when a change arrives late. **Proration** answers what happens when a change takes effect mid-period: a raise effective on the 16th means the period has to be paid partly at each rate. Oracle prorates using a proration event group and a proration formula on the element, and the design question — calendar days, working days, or a fixed divisor — is a client decision with a visible effect on money.

The two are often confused in a workshop. The test is when the change was entered relative to the payroll run: before it, and the period is prorated; after it, and the period is retro.

## End-dating instead of deleting

**End-dating** closes a record as of a date rather than deleting it, so that history is preserved. Terminating employment end-dates the work relationship; removing an allowance end-dates the element entry. When a client asks "can you just delete this record?", the correct consulting answer is almost always "we end-date it, and here is why that is better for you." In a date-effective SaaS system the tools are end-date, correct, or reverse. Deletion is rare, restricted, and usually the wrong instinct.

The same principle governs migration. History loaded as a single current row is history destroyed; loading dated records in date order is what produces a readable past (Chapter 11), and it is the part of a data migration that cannot be fixed afterwards without doing it again.

## Common mistakes

- "The effective date is when I entered it." The system tracks the two dates separately for a reason.
- Using correction for a real event, wiping the history — or an update for a typo, enshrining it.
- Looking at today's record and concluding a future-dated change was lost.
- Blaming retro when the change was never in the retroactive event group.
- Assuming retro only adds money. It can recover money too.
- Confusing proration with retro. One is a mid-period change, the other is a late one.
- Reaching for delete. End-date instead.

## Sources

- Oracle, *Implementing Global Payroll* — "How Retroactive Pay Is Calculated". https://docs.oracle.com/en/cloud/saas/human-resources/faigp/how-retroactive-pay-is-calculated.html
- Oracle, *Implementing Global Payroll* — the "Events, Retroactive Pay and Proration" chapter, for event groups and proration formulas. https://docs.oracle.com/en/cloud/saas/human-resources/faigp/index.html
- Oracle, *Implementing Global Human Resources* — date-effective objects and the history they keep. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
