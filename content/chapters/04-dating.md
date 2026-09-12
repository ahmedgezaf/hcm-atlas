---
id: dating
num: 4
domain: hcm
track: functional
title: Effective Dating
subtitle: Nothing is deleted. Everything has the date it became true.
hue: 278
minutes: 6
labs: dating
terms: effective-date, update-vs-correction, retroactive-change-retro, end-dating
---

Oracle HCM is a date-effective system. Almost nothing is ever deleted; changes are recorded with the date on which they become true in the real world. People coming from transactional systems trip over this more than anything else, and it has direct payroll consequences.

## The effective date is not the entry date

The **effective date** is the date on which a change becomes true — not the date it was typed into the system. HR reality and data entry rarely happen on the same day: a promotion effective 1 January may be entered on 15 January, and the system must know the person was at the new grade from the first. Every date-effective record has a start date and an end date. Setting the effective date correctly is the difference between a correct payslip and a retroactive correction, and most "the system calculated it wrong" tickets turn out to be effective-date errors. The system tracks the entry date separately, for audit.

## Update versus correction

An **update** creates a new dated record and preserves history. A **correction** overwrites the existing record as if the previous value was never true. Some changes are real events — a promotion — and some are data-entry mistakes — a typo in a grade. The system needs to tell real history from erroneous history.

Promoting someone on 1 July is an update: both the old and the new grade belong in history because both were true. Fixing a misspelled surname is a correction: the old spelling was never true and should not be preserved. Using a correction to record a real-world change destroys legitimate history and can trigger incorrect retroactive payroll; it is the one habit that corrupts an audit trail silently.

[[lab:dating]]

## Retroactive changes

A **retroactive change** ("retro") is a change entered with an effective date in the past, after payroll has already been processed for that period. Backdated promotions and late salary approvals are normal. A raise effective 1 May and approved in July means the May and June payrolls already ran at the old rate; the July run must calculate the arrears for both months and pay them. Oracle handles this through retroactive events and the *Recalculate Payroll for Retroactive Changes* process, which runs before the main calculation and creates retro entries the payroll run then picks up.

Two things matter for a consultant explaining retro to a client. First, retro affects balances, not just the current payslip: it re-states social insurance and tax for the prior periods too. Second, retro is not always money in — a change that reduces pay creates a recovery.

## End-dating instead of deleting

**End-dating** closes a record as of a date rather than deleting it, so that history is preserved. Terminating employment end-dates the work relationship; removing an allowance end-dates the element entry. When a client asks "can you just delete this record?", the correct consulting answer is almost always "we end-date it, and here is why that is better for you." In a date-effective SaaS system the tools are end-date, correct, or reverse. Deletion is rare, restricted, and usually the wrong instinct.

## Common mistakes

- "The effective date is when I entered it." The system tracks the two dates separately for a reason.
- Using correction for a real event, wiping the history.
- Assuming retro only adds money. It can recover money too.
- Reaching for delete. End-date instead.

## Sources

- Oracle, *Implementing Global Payroll* — "How Retroactive Pay Is Calculated". https://docs.oracle.com/en/cloud/saas/human-resources/22a/faigp/how-retroactive-pay-is-calculated.html
- Oracle, *Implementing Global Payroll* — "Events, Retroactive Pay and Proration". https://docs.oracle.com/en/cloud/saas/human-resources/21b/faigp/events-retroactive-pay-and-proration.html
