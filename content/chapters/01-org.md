---
id: org
num: 1
domain: hcm
track: functional
title: Enterprise & Organizational Structures
subtitle: The compliance skeleton — legal view versus operational view
hue: 214
minutes: 36
labs: org
terms: enterprise, legal-entity, legal-employer, payroll-statutory-unit-psu, tax-reporting-unit-tru, legislative-data-group-ldg, business-unit-bu, department, division, location, legal-jurisdiction, reference-data-set, organization-tree, employment-model, enterprise-structures-configurator
---

Every Oracle HCM implementation starts here, because nothing else can be configured until these objects exist. No worker can be hired, no element defined, no payroll run, no report filtered, until the structures in this chapter are in place. That order is not a preference — the application enforces it, and a project that rushes this stage pays for it for years.

The single hardest idea in this chapter is also the most important one: Oracle deliberately keeps two pictures of the same company. The **legal** picture answers the questions a government asks — who is registered, who employs, who pays, who reports. The **operational** picture answers the questions a manager asks — who runs what, who sits where, who may see whose data. In real companies the two rarely line up, and Oracle's structure exists precisely so they don't have to.

A consultant who holds those two pictures apart can run a requirements workshop. One who does not will keep asking a client "is that a company or a department?" and getting an answer that means neither.

[[fig:legal-vs-operational]]

## One enterprise, many legal entities

The **enterprise** is the single top node of the whole structure. There is exactly one per implementation, and it is not a legal concept. It never appears on a government form, never signs a contract, never files a return. It is a container for settings that apply to everybody regardless of which company employs them.

What actually lives on it is worth knowing, because these are decisions a consultant is asked about in the first week. The Manage Enterprise HCM Information task holds person-number generation, which has three methods: Manual, where the number is typed in; Automatic prior to submission, the delivered default, which issues the number as the record is created and therefore leaves a gap in the sequence when a transaction is cancelled; and Automatic upon final save, which issues it only once the transaction is approved, so the sequence has no gaps and no number is visible during entry. Both automatic methods draw from the same enterprise sequence, whose starting number is itself a setting. The same task holds worker-number settings, the default enterprise-wide **employment model**, position synchronization defaults, and global behaviours such as how a person's name is displayed.

The employment-model setting deserves a paragraph of its own. It decides whether a worker in this enterprise can hold one assignment or several at the same time, and whether contracts are tracked as separate objects. The two-tier single-assignment model — one work relationship, one assignment — covers the overwhelming majority of implementations and is what to assume unless a client says otherwise. Two-tier multiple-assignment is for organizations where one person genuinely does two jobs concurrently under the same employer: a nurse who also teaches, a plant worker who covers a second line. The setting is made at the enterprise but can be overridden on an individual legal employer, which is how a group runs a simple model everywhere and a multiple-assignment model in the one subsidiary that needs it. Changing it later, after workers exist, is painful. Asking the question early is free.

For a holding company with a factory and a trading arm, the enterprise is the group. The registered companies underneath are something else.

Those registered companies are **legal entities**: organizations recognized by law that can own assets, sign contracts, incur liabilities, employ people and be sued. In Egypt each one has its own commercial register number and tax card. In Saudi Arabia each has its own commercial registration. Oracle creates them through the Legal Entity Configurator, a set of tasks shared with Financials rather than owned by HCM, which is why the task list sits under Define Common Applications Configuration rather than a purely HR menu.

The first real job on any project is to work out how many legal entities there actually are. The commercial registers give the definitive answer. The org chart does not, the letterhead does not, and the client's own finance team frequently does not either — groups acquire companies and keep running them as one business long after the paperwork says otherwise. Ask for the register documents, count them, and build from that.

## What makes a legal entity real

A legal entity in Oracle is not just a name. Three other objects have to exist first, and a consultant who does not know them will be blocked on day one of configuration.

A **legal address** is the registered address of an organizational unit. Oracle requires legal addresses to exist before legal entities, because the entity is registered *somewhere* and the application will not let that be blank. These are maintained separately from the ordinary work **location** records used for employees, and the two are easy to confuse: one is where the company is registered, the other is where people physically work. They may be the same building. They are not the same object.

A **legal jurisdiction** is the combination of a geographic area and a law that applies within it — Egypt income tax, Saudi social insurance, a specific municipal levy. Oracle ships predefined jurisdictions for the legislations it supports and lets you create more. Every legal entity is registered against an *identifying jurisdiction*, and the registration number entered there is the one that appears on statutory output. In Egypt that is the tax registration; in Saudi Arabia it is the commercial registration number.

A **legal authority** is the government body that governs a jurisdiction — the Egyptian Tax Authority, NOSI, GOSI, the Ministry of Human Resources. Authorities are what registrations point at.

The practical sequence is therefore: addresses, then jurisdictions and authorities, then the legal entity, then its registrations, then its HCM-specific information. Skipping ahead produces a validation error rather than a broken configuration, which is a mercy — but it also means a consultant who does not know the order spends an afternoon guessing.

## Legal employer: the classification that lets you hire

A legal entity on its own employs nobody. To hire anyone into it, the entity must be classified as a **legal employer**. Oracle makes "employer" a classification you switch on rather than something every legal entity is assumed to be, because some entities exist only to hold property, own a licence or issue invoices. A property-holding company in a group has a commercial register and a tax card and has never had a payslip run against it.

Every worker belongs to exactly one legal employer at a time, through their work relationship (Chapter 3). This is the most consequential link in the employment data model. Change the legal employer and you have changed who legally employs the person — the old employment ends and a new one begins, which in Egypt means a settlement, a new social-insurance registration and a fresh service date unless service is explicitly bridged. Change their department and nothing legal has happened at all. The system treats these as completely different events, and it is right to.

> **Interview classic.** "What is the difference between a legal entity and a legal employer?" A legal employer is a classification applied to a legal entity that enables it to employ workers. Not every legal entity is a legal employer. Treating the two as synonyms is the most common miss in this whole area.

There is a second, quieter consequence. Because the legal employer can override enterprise-level settings — the employment model, and a set of localization defaults — it is also the level at which a group with genuinely different operating companies expresses that difference. A consultant who reaches for a new business unit when the answer is a new legal employer has usually misread the requirement.

## Who pays, and who reports

Two more classifications sit on the legal entity, and both are about payroll.

A **payroll statutory unit (PSU)** is a legal entity responsible for paying workers and remitting payroll tax and social insurance to the authorities. It is the level at which a person's payroll records are grouped for statutory calculation and reporting — in Egypt, the entity that files with NOSI and the Egyptian Tax Authority; in Saudi Arabia, the entity that files with GOSI. Oracle's guidance is to create at least one legal entity designated as a PSU for every legislative data group, which is another way of saying: for each country you pay people in, somebody has to be the filer.

Oracle's documentation puts the parent relationship plainly. When a legal entity is identified as a legal employer but *not* as a PSU, it must be given a parent PSU, and its legal reporting units are then created as tax reporting units under that parent rather than under itself. This is how a group centralises statutory filing: several employers, one filer.

[[fig:parent-psu]]

Beneath the PSU sits the **tax reporting unit (TRU)**, the reporting face of the PSU toward tax and social-insurance authorities. Oracle describes the TRU as the HCM form of a legal reporting unit, existing to group workers for tax and social-insurance reporting. When a legal entity is identified as a PSU, its legal reporting unit is carried across into HCM as a TRU automatically — which is why consultants often find a TRU they did not consciously create.

A single PSU may need to report under more than one registration number, and the TRU is the level that hangs on. This is not a theoretical case in the region. An Egyptian company with branches registered at different social-insurance offices files separately for each; a Saudi group with several commercial registrations is assessed for Saudization against each registered establishment rather than against the group as a whole. Each of those registration numbers is a candidate TRU. The design question is answered by collecting registration certificates, not by drawing boxes.

A worker is linked to a TRU through their statutory deductions calculation card (Chapter 5), not directly on the assignment. That indirection catches people out: a worker can be in the right legal employer, the right payroll and the right department, and still be missing from a statutory report because the card carries no TRU.

The practical design question on a multi-company client is therefore: which legal entities are PSUs, and which are legal employers reporting under a parent PSU? A group with three registered companies in Egypt may well have three PSUs. Do not assume one per country.

## The hard boundary: legislative data groups

A **legislative data group (LDG)** is a partition that isolates payroll and related legislative data. Each LDG belongs to exactly one legislation and carries one currency, and Oracle's instruction is to create one for each country the enterprise operates in, then associate each PSU with it.

All payroll configuration lives inside exactly one LDG: elements, balances, balance dimensions, fast formulas, element eligibility, payroll definitions, rate definitions, calculation value definitions, organization payment methods. Egyptian payroll rules cannot leak into Saudi payroll rules, because as far as the application is concerned the Egyptian objects do not exist in the Saudi world. An element defined in the Egypt LDG is not hidden from the Saudi LDG. It is absent from it. It must be built again.

This produces the most common support question in the first month of a multi-country project: "why can't I see my element?" The answer is almost always the LDG context selected at the top of the page.

The partition is a feature, not a limitation. It is what makes it safe for one instance to run Egyptian and Saudi payroll side by side, with completely different statutory logic, without any possibility of one country's rule firing against the other's population. The cost is duplication: two countries means two element libraries, two sets of formulas, two balance structures. Estimating a multi-country payroll project as though configuration is reused once is the classic way to lose money on it.

One more consequence, and it is the expensive one: an LDG cannot be meaningfully changed once payroll data exists inside it. The currency and legislation chosen at the start are effectively permanent. Getting the country list right before configuration starts is worth an extra workshop.

[[fig:ldg-wall]]

## The operational picture: business units

The **business unit (BU)** is an operational grouping used for processing transactions, sharing reference data such as jobs and grades, and controlling data access. It is not a legal registration and carries no statutory meaning whatever.

A shared-services centre may serve three legal entities. A single legal entity may contain several business units. Neither arrangement is unusual and neither is wrong. Clients decide based on how they actually run the business, and they conflate "how are we registered" with "how do we operate" constantly. Keeping the two apart is the consultant's job, and the useful question in a workshop is not "is this a business unit?" but "does this group of people need its own set of jobs, its own approvals, and its own view of the data?"

## Reference data sets, and why the BU matters more than it looks

The business unit's real power is reference data sharing, and this is the part of Chapter 1 most often skipped in training.

Oracle lets you group set-enabled configuration data — jobs, grades, locations, departments — into **reference data sets**, then assign those sets to business units. At transaction time the application filters what can be selected based on the business unit involved. Assign a job to the Common Set and every business unit can use it. Assign it to a specific set attached to one business unit, and only that unit sees it.

The consequence is that business unit design silently decides how much duplication the client will live with. A global group that wants one job catalogue everywhere puts jobs in the Common Set and is done. A group whose manufacturing arm and consulting arm share nothing puts them in separate sets and accepts that "Manager" now exists twice. Getting this wrong in either direction is painful: over-sharing produces a job list of four hundred entries where a hiring manager needs six, and under-sharing produces four hundred entries that are the same six repeated.

Positions are the exception worth remembering. They attach to a business unit directly rather than through a set. If a client asks why their position list does not behave like their job list, that is why.

[[fig:reference-data-sets]]

## Divisions, departments and locations

A **division** is the top of the management hierarchy — above the business unit, not below it — aligned to a product line or a geography and used for management reporting rather than transaction processing. One division can span several business units and several legal entities, which is how a group answers "how did the Middle East business perform" when the Middle East is not a legal entity and never will be. Oracle's own worked example builds divisions for the US, Europe and the Middle East across five countries and several legal entities, a shape that maps neatly onto how regional groups in Cairo and Riyadh describe themselves. Oracle treats division → business unit → department as recommended practice rather than something the application enforces, so it is worth confirming which way a client's existing structure actually runs before assuming it.

Below the business unit, the **department** is the box on the org chart that a worker actually sits in. It is the natural unit for headcount reporting and manager hierarchies, and it exists independently of whoever currently manages it — which is why a manager change never requires a new department. Departments can carry a cost centre, which is the hook payroll costing later uses to send an employee's cost to the right place in the general ledger.

A **location** is a physical work site with an address. It matters more than it looks, because statutory jurisdiction, working-time rules, allowance eligibility and public-holiday calendars are frequently driven by where the person physically works rather than by who employs them. In the Gulf especially, location often decides allowance eligibility — a site allowance for a remote plant, a housing differential between cities. Locations are set-enabled like jobs and grades, so the same sharing rules apply.

## Trees: how the structure becomes security and org charts

The objects above are a list until something arranges them into a shape. That something is an **organization tree**.

Oracle supports department trees, organization trees and position trees. A tree takes the flat set of departments (or organizations, or positions) and expresses the parent–child relationships between them, in versions that carry their own effective dates. Two things consume them. The org chart the business sees is drawn from a tree. More importantly, security profiles scope data by tree node: "this HR specialist can see everyone in the Manufacturing department and everything below it" is a statement about a tree, not about a list of departments.

This is the quiet link between Chapter 1 and Chapter 15. A structure that is correct but flat gives the security model nothing to grip. When a client asks for departmental HR access and the department tree has never been built, the request cannot be satisfied no matter how the roles are configured.

Trees are versioned and must be published before use, which is a recurring source of "I made the change and nothing happened".

## The order you build it in

Stated as a sequence, because the dependencies are real and the application enforces most of them:

- Legal addresses, jurisdictions and authorities.
- Legislative data groups, one per country.
- Legal entities, with their registrations.
- Legal entity HCM information: legal employer, PSU, parent PSU where the entity is an employer only.
- Tax reporting units, beyond those created automatically with the PSU.
- Divisions, then business units and the reference data sets assigned to them.
- Departments and locations.
- Trees, then published.

Oracle also ships the **Enterprise Structures Configurator**, an interview-style wizard that asks about the enterprise, its countries and its operating shape, then creates legal entities, classifies them as legal employers and PSUs, and creates a legislative data group for each country in one pass. It produces a technical summary of what it intends to do before committing, and the structure can be reviewed and rolled back before it is loaded. It is genuinely useful for a greenfield build and genuinely dangerous as a substitute for understanding, because it makes defensible default choices that a consultant then has to explain — or unpick — six months later.

## Three shapes you will actually meet

**The single-entity Egyptian company.** One commercial register, one tax card, one legal entity that is both legal employer and PSU, one Egypt LDG, one TRU, one business unit, departments under it. Most of this chapter collapses to a single line each. The work is in the department tree and the locations.

**The Egypt-plus-Saudi group.** Two LDGs, and everything payroll-shaped doubles. Legal entities in each country, each a legal employer; whether each is also a PSU depends on who files. Saudization is assessed per Saudi establishment, so the number of Saudi TRUs follows the number of registrations rather than the number of companies. Divisions give the group a "Middle East" view that no legal entity provides. This is the shape most regional implementations take.

**The shared-services group.** Several legal employers, one PSU doing the filing, one business unit running transactions for all of them. This is where the legal and operational pictures separate most visibly, and where a consultant who has only seen the first shape gets confused: the same person is employed by company A, paid by filer B, and processed by service centre C, and all three are correct at once.

## What is expensive to change later

Not every decision in this chapter carries the same weight, and knowing which ones bind is what separates a consultant from someone reading a setup guide.

[[fig:change-cost]]

Cheap to change: departments, divisions, locations, tree structure, most reference data. These move with ordinary effective-dated updates.

Expensive: the business unit design, because reference data sets attach to it and moving them means re-pointing every job, grade and location.

Effectively permanent: the legislative data group's legislation and currency, and the legal employer a worker sits in. The first cannot be altered once payroll data exists. The second changes only by ending one employment and starting another — a global transfer, which is the worked example Chapter 3 walks through, and which has real consequences for service dates, accrued leave and end-of-service liability.

[[lab:org]]

## Common mistakes

- Describing the enterprise as "the company". The company is a legal entity; the enterprise is the whole group.
- Assuming a legal entity can hire. It cannot until it is classified as a legal employer.
- Assuming one PSU per country. Map legal entities to PSUs deliberately, from the registration certificates.
- Counting legal entities from the org chart instead of the commercial registers.
- Expecting to reuse one element library across countries. Each LDG is its own world, and the duplication has to be estimated for.
- Calling a business unit "just another word for department". A BU is a processing and access construct; departments sit below it.
- Designing business units without deciding the reference data sets, then discovering the job list cannot be shared.
- Confusing a legal address with a work location. One is where the company is registered, the other is where people sit.
- Building the structure and never building the trees, then being unable to scope security to a department.
- Letting the Enterprise Structures Configurator make the design decisions, then having to defend them.

## Sources

- Oracle, *Implementing Global Human Resources* — the "Enterprise Structures: Initial Configuration" chapter. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
- Oracle, *Implementing Global Human Resources* — "Person Number Generation Methods". https://docs.oracle.com/en/cloud/saas/human-resources/faigh/person-number-generation-methods.html
- Oracle, *Implementing Payroll for Canada* — "What's a tax reporting unit?"; the classification topic is written once and applies to every localization. https://docs.oracle.com/en/cloud/saas/human-resources/fapcd/what-s-a-tax-reporting-unit.html
- Oracle, *Using Common Features* — "How Business Units Work with Reference Data Sets". https://docs.oracle.com/en/cloud/saas/human-resources/faucf/how-business-units-work-with-reference-data-sets.html
- Maverick Solutions, "Effectively using legislations and legislative data groups in Oracle Cloud HCM Payroll". https://mavericksolutions.com/2021/06/15/legislations-and-legislative-data-groups-in-oracle-cloud-hcm-payroll/
- Apps2Fusion, "Legal Entity and Legal Employer in Fusion Application". https://apps2fusion.com/old/oracle-fusion-online-training/1519-legal-entity-and-legal-employer-in-fusion-application
