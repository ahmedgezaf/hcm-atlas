---
id: method
num: 16
title: Implementation Methodology
subtitle: How projects actually run — and where the real finish line is
hue: 62
minutes: 8
labs: method
terms: fit-gap-analysis, crp-conference-room-pilot, sit-system-integration-testing, uat-user-acceptance-testing, cutover, freeze-period, hypercare, reconciliation, configuration-workbook, test-script, raid-log, change-request, oracle-true-cloud-method
---

This is the vocabulary of how projects are delivered. Trainers and interviewers use it constantly, and using it correctly makes a consultant sound like someone who has been on a project rather than someone who has read about one. Oracle's current methodology for Fusion Cloud projects is the **Oracle True Cloud Method**, successor to older methodologies such as AIM — whose document codes still appear in conversation: BR100 for setup documents, MD050 for functional designs, TE040 for test scripts.

## From requirements to design

A **fit-gap analysis** compares client requirements against delivered functionality and documents where the product fits, where it does not, and what will be done about each gap: configure, work around, extend, or descope. It is the foundation of scope and the reference point for every later argument about what was agreed. The **configuration workbook** — usually a large structured spreadsheet — records every configuration decision and its agreed values; it is the record of what was built and why, and the basis for rebuilding it in the next environment.

Clients cannot validate a design from a document. A **conference room pilot (CRP)** is a structured demonstration of the configured system to the client, using their own data and scenarios, usually run in iterations — CRP1, CRP2 — with feedback incorporated between them.

## Testing

**System integration testing (SIT)** checks that the configured system works end to end, including integrations with other systems; individual pieces working does not mean the chain works. It is executed by the project team before handing over to the client for **user acceptance testing (UAT)**, in which the client executes agreed **test scripts** — step-by-step documents defining what to do, what data to use and what result to expect. Each requirement should be traceable to at least one script; testing without scripts is clicking, not testing. On functional projects the consultant writes the scripts and often helps execute them, and UAT failures land on the configuration.

## Cutover and go-live

**Cutover** is the sequenced set of activities moving the client from the legacy system to the new one: final data loads, reconciliation, a **freeze period** during which no changes are permitted in the legacy system so that migration runs against a stable base, and go/no-go decisions. Go-live is not a moment but an ordered plan with dependencies and rollback points. **Reconciliation** — comparing outputs between two systems or two runs and explaining every difference — is central to both data migration and the parallel payroll run; an unexplained difference is a defect until proven otherwise.

**Hypercare** is the intensive support period immediately after go-live, with heightened staffing and response times, typically covering the first one or two live payroll runs. The first live cycles surface problems no amount of testing catches. Hypercare and the first live payroll — not the go-live date — are the actual finish line.

[[lab:method]]

## Governance

Running alongside all of it: the **RAID log**, a single visible home for risks, assumptions, issues and dependencies, reviewed in regular governance meetings; and the **change request**, the formal mechanism by which "can you just add…" becomes a managed decision with its impact on time and cost assessed. Learning to recognize a change request when it is spoken in a workshop — before agreeing to it — protects both the project and the consultant.

One principle underlies the whole method: consultants do not design the best system; they get decisions made and documented. The client owns the design.

## Common mistakes

- Treating testing as the QA team's job.
- Skipping the freeze and migrating a moving target.
- Calling go-live the finish.
- Agreeing to scope changes in a workshop without a change request.

## Sources

- Oracle, *Oracle True Cloud Method* overview (Oracle Consulting). https://www.oracle.com/consulting/
- Intellicept, "Oracle ERP Cloud Implementation Phases | Detailed Explanation". https://intellicept.com/oracle-erp-cloud-implementation-phases-explained
- Jade Global, "Oracle Cloud Implementation Methodology". https://www.jadeglobal.com/oracle/methodology/jadecloud-implementation-methodology
