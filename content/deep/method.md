---
id: method
minutes: 30
---

This is the vocabulary of how projects are delivered. Trainers and interviewers use it constantly, and using it correctly makes a consultant sound like someone who has been on a project rather than someone who has read about one. Oracle's current methodology for Fusion Cloud projects is the **Oracle True Cloud Method**, successor to older methodologies such as AIM — whose document codes still appear in conversation: BR100 for setup documents, MD050 for functional designs, TE040 for test scripts.

Methodology chapters are easy to write and easy to ignore, so this one is organised around what actually goes wrong. Projects rarely fail on configuration. They fail on decisions nobody made, data nobody checked, testing nobody owned, and a go-live date that was a commitment before it was a plan.

## The shape of a project

Names differ between methodologies, but the sequence does not: understand what is needed, design it, build it, prove it, move to it, support it.

What changes in a SaaS implementation is the proportions. The product exists on day one, so there is no long build phase in the traditional sense — a great deal of the configuration is done in weeks. What expands instead is everything around it: deciding what the client actually wants, migrating their data, proving the result, and preparing their people. A plan that allocates time as though the configuration were the hard part is a plan that will be late, and it will be late at the end, where it is most expensive.

The practical implication for a consultant is that the valuable skills are not the ones that look technical. Running a workshop that produces decisions, writing a test script somebody can execute, and reconciling two sets of numbers are worth more to a project than knowing one more screen.

## From requirements to design

A **fit-gap analysis** compares client requirements against delivered functionality and documents where the product fits, where it does not, and what will be done about each gap: configure, work around, extend, or descope. It is the foundation of scope and the reference point for every later argument about what was agreed.

The five labels are not interchangeable, and choosing between them is the first real judgement a consultant makes on a project. *Fit* and *configure* sit inside the estimate already agreed. *Extend* — a Fast Formula, a BI Publisher report, an integration — adds design, testing and, more easily forgotten, an owner for the day the statutory figure inside it changes. *Work around* costs no build at all and changes how people work, so it needs the process owner's agreement rather than the project manager's. *Descope* is a decision someone has to sign, not a request quietly dropped; dropped requests come back during user acceptance testing, labelled as defects.

[[lab:fit-gap]]

The **configuration workbook** — usually a large structured spreadsheet — records every configuration decision and its agreed values; it is the record of what was built and why, and the basis for rebuilding it in the next environment.

Two things make the difference between a workbook that is used and one that is archived. It has to record the *why* as well as the *what*, because the next person's question is never "what is this set to" but "why is it set to that". And for anything statutory it has to record the source and the date it was checked (Chapters 9 and 10), because that is what makes re-verification possible rather than a fresh research project.

Clients cannot validate a design from a document. A **conference room pilot (CRP)** is a structured demonstration of the configured system to the client, using their own data and scenarios, usually run in iterations — CRP1, CRP2 — with feedback incorporated between them.

The detail that makes a CRP work is *their own data and their own scenarios*. A demonstration with sample data proves the software works, which nobody doubted. A demonstration that hires one of their real job titles, into one of their real departments, on their real grade structure, and runs their real payroll elements, is the thing that surfaces the requirement nobody mentioned.

## Environments, and moving configuration between them

A project runs across several environments and the movement between them is a workstream of its own that is routinely under-planned.

There is typically a development or configuration environment, a test environment, one for user acceptance testing, and production. They are refreshed from production periodically, which is how a test environment gets realistic data — and which also *overwrites* whatever was configured there, so the refresh calendar and the configuration calendar have to be agreed rather than assumed.

Configuration moves through the Functional Setup Manager as setup packages: an export from one environment and an import into another. What that carries is the setup data the implementation project includes, which means the discipline is in curating the project rather than in the export itself.

What does *not* travel in the same way is the part that catches people. Security roles, sandbox-published changes, BI catalog content, flexfield deployments and integration configuration each have their own route, and a cutover plan that assumes one export does everything will find the gaps on the worst night of the project. The defence is a migration checklist built early and exercised at every environment move, so that the final one is the fourth rehearsal rather than the first attempt.

## Data migration as its own project

Chapter 11 covers the mechanics. What belongs here is that data migration is a workstream with its own plan, its own owner and its own deadlines, and the most common project failure in this region is treating it as a task.

Three dates matter more than the rest: when the extract specification is agreed with whoever owns the legacy system, when the first full-volume load runs in a real environment, and when reconciliation is signed. Projects that put the first of those three in month one tend to be fine. Projects that discover in month five that the legacy vendor charges for extracts, or cannot produce history, or has no key that is stable, tend not to be.

## Testing

**System integration testing (SIT)** checks that the configured system works end to end, including integrations with other systems; individual pieces working does not mean the chain works. It is executed by the project team before handing over to the client for **user acceptance testing (UAT)**, in which the client executes agreed **test scripts** — step-by-step documents defining what to do, what data to use and what result to expect. Each requirement should be traceable to at least one script; testing without scripts is clicking, not testing. On functional projects the consultant writes the scripts and often helps execute them, and UAT failures land on the configuration.

Beyond those two sit three more that are easy to leave out of a plan and expensive to leave out of a project. **Regression testing** proves that today's change did not break last week's — and becomes a standing obligation after go-live, because of the quarterly cycle (Chapter 14). **Payroll parallel runs** (Chapter 5) are a form of testing with their own calendar and their own sign-off. And **security testing** has to be done as the actual audiences (Chapter 15), not as an administrator.

A test script is worth writing properly because it is the artefact that makes testing repeatable. The expected result is the part that gets skipped and the part that matters: a script that says "check the payslip is correct" tests nothing, because correctness is exactly what is in question. A script that says "basic salary 10,000, insurable wage capped at the ceiling, employee contribution 1,837.00, net pay 8,163.00 less tax" is a test.

## Defects, and how they are triaged

A defect log without severities is a list. With them it is a plan.

The useful sort is by consequence rather than by component: does this stop a payroll running, does it produce a wrong number, does it make somebody's job harder, or is it cosmetic. The first two block go-live; the third is a judgement; the fourth is a backlog. Clients and consultants argue about severity, and the argument is worth having, because it is really an argument about what the go-live criteria are.

The sentence to have ready: "we can go live with this open, and here is the workaround and the date it is fixed" — or "we cannot". Both are legitimate answers. "It is a low priority" is not, because it does not say which.

## Cutover and go-live

**Cutover** is the sequenced set of activities moving the client from the legacy system to the new one: final data loads, reconciliation, a **freeze period** during which no changes are permitted in the legacy system so that migration runs against a stable base, and go/no-go decisions. Go-live is not a moment but an ordered plan with dependencies and rollback points.

A cutover plan worth the name has, for every task, an owner, a duration, a predecessor and a way of knowing it worked. It is rehearsed at least once end to end, timed, in a real environment — and the rehearsal is where the plan's errors are found, which is the entire point of doing it. A team that has rehearsed cutover twice goes live calmly; one that has not goes live on adrenaline and hope.

Two things belong in every plan and are often missing. A **rollback point**: the moment after which going back is no longer possible, agreed in advance, so that the go/no-go decision is made before it rather than after. And a **communications plan**: who tells the business the system is live, who answers the phone on the first morning, and what employees are told about what has changed.

**Reconciliation** — comparing outputs between two systems or two runs and explaining every difference — is central to both data migration and the parallel payroll run; an unexplained difference is a defect until proven otherwise.

## Hypercare, and the real finish line

**Hypercare** is the intensive support period immediately after go-live, with heightened staffing and response times, typically covering the first one or two live payroll runs. The first live cycles surface problems no amount of testing catches. Hypercare and the first live payroll — not the go-live date — are the actual finish line.

Hypercare needs an exit, and the exit needs criteria agreed before it starts: a number of clean payroll runs, a defect backlog below a threshold, the client's own team running the cycle without help, and the handover documentation accepted. Without those, hypercare either ends arbitrarily or never ends, and both are bad — the first for the client, the second for the consultancy.

The handover set is a small list and it is the difference between a client who can operate their system and one who calls every month: the configuration workbook, the role catalogue (Chapter 15), the report catalogue (Chapter 13), the payroll cycle runbook (Chapter 5), the metric definitions (Chapter 7), the statutory maintenance list with its dates, and the quarterly update routine (Chapter 14).

[[lab:method]]

## Governance

Running alongside all of it: the **RAID log**, a single visible home for risks, assumptions, issues and dependencies, reviewed in regular governance meetings; and the **change request**, the formal mechanism by which "can you just add…" becomes a managed decision with its impact on time and cost assessed. Learning to recognize a change request when it is spoken in a workshop — before agreeing to it — protects both the project and the consultant.

The assumptions half of the RAID log is the one nobody maintains and the one that causes the arguments. "We assumed the client's legacy system can produce five years of dated history" is an assumption; written down in week two, it is checked in week three. Unwritten, it becomes a dispute in month five about what was reasonable to expect.

The everyday version of that discipline is a three-way sort, usually made standing in a testing room. Something agreed, documented and not working is a **defect**: fix it. Something never agreed, however small it sounds, is a change request: log it, price it, let someone with authority accept it. Something that asks for nothing at all is a question: answer it, and keep answering them, because questions are where unstated requirements surface. Filing change requests as defects is the most common way a project absorbs work nobody agreed to, and the reason it runs late is then impossible to explain.

[[lab:cr-or-defect]]

## Where projects in this region go wrong

A short list, offered as pattern recognition rather than as pessimism.

**Statutory requirements arrive late**, because the people who know them — the Personnel team, the payroll officer, the government-relations function (Chapter 7) — were not in the early workshops. The fix is to invite them to the structures workshop, not to the payroll workshop.

**The second country is estimated as a copy of the first.** It is not, because the legislative data group isolates everything payroll-shaped (Chapter 1), and because the testing cannot be reused at all.

**Data migration starts late** and the legacy extract turns out to be a negotiation with a third party.

**The bank file is left to the end**, and the bank's test cycle is measured in weeks (Chapter 5).

**Nobody owns the statutory maintenance** after go-live, so the January limits do not change and nobody notices until a return is reconciled.

And **training is treated as a document**. The population that has to change its behaviour is not the project team; it is several hundred managers who will each use the system twice a year, and a system they cannot use is a failed implementation however correct the configuration.

## The principle underneath

One principle underlies the whole method: consultants do not design the best system; they get decisions made and documented. The client owns the design.

That is not modesty. It is the only arrangement that survives the consultant leaving. A decision the client made, wrote down and understands can be revisited by them later. A decision the consultant made on their behalf becomes an unexplainable setting that nobody dares change, and there are systems full of them.

## Common mistakes

- Treating testing as the QA team's job.
- Planning as though configuration is the long pole.
- Demonstrating with sample data instead of the client's own.
- Writing a configuration workbook that records values but not reasons.
- Letting an environment refresh overwrite configuration nobody had migrated.
- Assuming one setup export carries security, reports, sandboxes and integrations.
- Treating data migration as a task rather than a workstream with its own dates.
- Writing test scripts with no expected result.
- Leaving regression, security and parallel-run testing out of the test plan.
- Logging defects with no severity, so go-live criteria cannot be applied.
- Skipping the freeze and migrating a moving target.
- Never rehearsing cutover end to end, with a clock.
- Having no agreed rollback point.
- Starting hypercare with no exit criteria.
- Leaving without a handover set the client can operate from.
- Calling go-live the finish.
- Agreeing to scope changes in a workshop without a change request.
- Leaving assumptions out of the RAID log until they become disputes.

## Sources

- Oracle, *Oracle True Cloud Method* overview (Oracle Consulting). https://www.oracle.com/consulting/
- Oracle, *Using Functional Setup Manager* — implementation projects and exporting and importing setup data between environments. https://docs.oracle.com/en/cloud/saas/applications-common/
- Intellicept, "Oracle ERP Cloud Implementation Phases | Detailed Explanation". https://intellicept.com/oracle-erp-cloud-implementation-phases-explained
- Jade Global, "Oracle Cloud Implementation Methodology". https://www.jadeglobal.com/oracle/methodology/jadecloud-implementation-methodology
