---
id: org
minutes: 62
---

Every Oracle HCM implementation starts here, because nothing else can be configured until these objects exist. No worker can be hired, no element defined, no payroll run, no report filtered, until the structures in this chapter are in place. That order is not a preference — the application enforces it, and a project that rushes this stage pays for it for years.

The single hardest idea in this chapter is also the most important one: Oracle deliberately keeps two pictures of the same company. The **legal** picture answers the questions a government asks — who is registered, who employs, who pays, who reports. The **operational** picture answers the questions a manager asks — who runs what, who sits where, who may see whose data. In real companies the two rarely line up, and Oracle's structure exists precisely so they don't have to.

A consultant who holds those two pictures apart can run a requirements workshop. One who does not will keep asking a client "is that a company or a department?" and getting an answer that means neither.

[[fig:legal-vs-operational]]

## How to run the discovery, before any of this is configured

The configuration in this chapter is a day's work for someone who knows it. The discovery that tells you what to configure takes two weeks and is the part that goes wrong.

Ask for documents rather than diagrams. The commercial registers, the tax cards, the social-insurance registration certificates, the trade licences, and — in the Gulf — the establishment registrations the labour ministry holds. Each of those pieces of paper corresponds to an object in this chapter, and the pile of paper is the only authoritative statement of how many of each there are. An org chart is a statement about management, which is the other picture entirely.

Then ask four questions, in this order, and write the answers down.

**Who signs the employment contracts?** That is the list of legal employers, and it is frequently shorter than the list of companies.

**Who files with the tax authority and the social-insurance authority, and under which number?** That is the list of payroll statutory units and, through the registration numbers, the tax reporting units. It is frequently different from the list of employers.

**Who shares a job catalogue, a grade structure and an approval chain?** That is the business unit design, and it is a question about operations rather than registration.

**Who needs to see whose data?** That is what the trees will have to support, and it is the question that is never asked until the security phase, by which point the structure is built.

The deliverable from all of this is a one-page map: every legal entity, its classifications, its parent where it has one, the LDG it sits in, and the business units beside it. If that page cannot be drawn, the configuration is not ready to start — and drawing it is a far cheaper way to discover a disagreement between the finance director and the HR director than finding it in week nine.

## One enterprise, many legal entities

The **enterprise** is the single top node of the whole structure. There is exactly one per implementation, and it is not a legal concept. It never appears on a government form, never signs a contract, never files a return. It is a container for settings that apply to everybody regardless of which company employs them.

What actually lives on it is worth knowing, because these are decisions a consultant is asked about in the first week. The Manage Enterprise HCM Information task holds person-number generation, which has three methods: Manual, where the number is typed in; Automatic prior to submission, the delivered default, which issues the number as the record is created and therefore leaves a gap in the sequence when a transaction is cancelled; and Automatic upon final save, which issues it only once the transaction is approved, so the sequence has no gaps and no number is visible during entry. Both automatic methods draw from the same enterprise sequence, whose starting number is itself a setting. The same task holds worker-number settings, the default enterprise-wide **employment model**, position synchronization defaults, and global behaviours such as how a person's name is displayed.

The person-number choice is worth one more sentence of advice, because clients ask which to pick and the trade-off is real. Gapless sequences look tidy and matter to auditors in some jurisdictions; the cost is that nobody sees the number while the transaction is in flight, which recruiters and onboarding teams find awkward. Gaps in a sequence are harmless and occasionally have to be explained. Where a client is migrating and wants to keep legacy employee numbers, the answer is usually manual numbering for the migrated population and automatic afterwards, with the sequence started above the highest legacy number.

The employment-model setting deserves a paragraph of its own. It decides whether a worker in this enterprise can hold one assignment or several at the same time, and whether contracts are tracked as separate objects. The two-tier single-assignment model — one work relationship, one assignment — covers the overwhelming majority of implementations and is what to assume unless a client says otherwise. Two-tier multiple-assignment is for organizations where one person genuinely does two jobs concurrently under the same employer: a nurse who also teaches, a plant worker who covers a second line. The setting is made at the enterprise but can be overridden on an individual legal employer, which is how a group runs a simple model everywhere and a multiple-assignment model in the one subsidiary that needs it. Changing it later, after workers exist, is painful. Asking the question early is free.

For a holding company with a factory and a trading arm, the enterprise is the group. The registered companies underneath are something else.

Those registered companies are **legal entities**: organizations recognized by law that can own assets, sign contracts, incur liabilities, employ people and be sued. In Egypt each one has its own commercial register number and tax card. In Saudi Arabia each has its own commercial registration. Oracle creates them through the Legal Entity Configurator, a set of tasks shared with Financials rather than owned by HCM, which is why the task list sits under Define Common Applications Configuration rather than a purely HR menu.

That shared ownership has a project consequence worth planning for. If Financials is being implemented at the same time, these objects have two sets of stakeholders and one set of values, and the two streams must agree. If Financials is already live, the legal entities already exist and the HCM work is to classify them rather than to create them — which is faster, and which means any disagreement about the structure is a conversation with Finance rather than a decision HR can make alone.

The first real job on any project is to work out how many legal entities there actually are. The commercial registers give the definitive answer. The org chart does not, the letterhead does not, and the client's own finance team frequently does not either — groups acquire companies and keep running them as one business long after the paperwork says otherwise. Ask for the register documents, count them, and build from that.

## Geographies: the dependency nobody plans for

Before an address can be entered reliably, the application needs to know what a valid address in that country looks like, and that is a separate piece of setup that regularly surprises teams in week one.

Geography setup has three layers and they are strictly ordered: a country's **structure** defines the levels an address has, the **hierarchy** holds the actual values at those levels, and **validation** says which levels are checked and how hard. The structure must exist before the hierarchy, and the hierarchy before validation. Validation requires at least one level to be enabled, and the strictness is a choice — at the error level, only a fully valid address with all mandatory elements can be saved at all.

Three practical points follow. Oracle-licensed reference data can be imported for supported countries, but the import is disabled once any geography data exists for that country, which means a team that hand-built a hierarchy has closed off the easier route. A list of values should only be enabled for a level where there is actually enough data behind it, or users are offered an empty picker. And where addresses were created before validation was configured, there is a task to validate existing addresses against the master geographies after the fact — which is the right thing to run after a migration rather than discovering the mismatches one ticket at a time.

The regional note: coverage and quality vary by country, and Egyptian and Gulf address structures are not the ones the defaults were designed around. Decide early how strict validation should be. Erroring on invalid addresses sounds right and produces a help desk full of people who cannot save a record because their village is not in the hierarchy.

## What makes a legal entity real

A legal entity in Oracle is not just a name. Three other objects have to exist first, and a consultant who does not know them will be blocked on day one of configuration.

A **legal address** is the registered address of an organizational unit. Oracle requires legal addresses to exist before legal entities, because the entity is registered *somewhere* and the application will not let that be blank. These are maintained separately from the ordinary work **location** records used for employees, and the two are easy to confuse: one is where the company is registered, the other is where people physically work. They may be the same building. They are not the same object.

A **legal jurisdiction** is the combination of a geographic area and a law that applies within it — Egypt income tax, Saudi social insurance, a specific municipal levy. Oracle ships predefined jurisdictions for the legislations it supports and lets you create more. Every legal entity is registered against an *identifying jurisdiction*, and the registration number entered there is the one that appears on statutory output. In Egypt that is the tax registration; in Saudi Arabia it is the commercial registration number.

A **legal authority** is the government body that governs a jurisdiction — the Egyptian Tax Authority, NOSI, GOSI, the Ministry of Human Resources. Authorities are what registrations point at.

The practical sequence is therefore: addresses, then jurisdictions and authorities, then the legal entity, then its registrations, then its HCM-specific information. Skipping ahead produces a validation error rather than a broken configuration, which is a mercy — but it also means a consultant who does not know the order spends an afternoon guessing.

Registrations are worth dwelling on because they are what statutory output reads. A legal entity has an identifying registration against its identifying jurisdiction, and it may have further registrations against other jurisdictions — one company, registered for tax with one authority and for social insurance with another, under two different numbers. Collecting those numbers accurately, from the certificates rather than from a spreadsheet, is unglamorous and is the difference between a statutory file the authority accepts and one it rejects for a reason nobody can diagnose.

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

The PSU choice has a consequence that reaches all the way into Chapter 3 and is worth connecting here. The payroll relationship is keyed on the payroll statutory unit, so whether two employments share a PSU decides whether they share one set of payroll balances and one statutory ceiling. A group that centralises filing under one PSU has, without necessarily intending to, decided that somebody employed by two of its companies has a single social-insurance ceiling across both. That may be exactly right legally, or exactly wrong. It is a question for the client's statutory adviser, and it is decided here rather than in the payroll chapter.

Beneath the PSU sits the **tax reporting unit (TRU)**, the reporting face of the PSU toward tax and social-insurance authorities. Oracle describes the TRU as the HCM form of a legal reporting unit, existing to group workers for tax and social-insurance reporting. When a legal entity is identified as a PSU, its legal reporting unit is carried across into HCM as a TRU automatically — which is why consultants often find a TRU they did not consciously create.

A single PSU may need to report under more than one registration number, and the TRU is the level that hangs on. This is not a theoretical case in the region. An Egyptian company with branches registered at different social-insurance offices files separately for each; a Saudi group with several commercial registrations is assessed for Saudization against each registered establishment rather than against the group as a whole. Each of those registration numbers is a candidate TRU. The design question is answered by collecting registration certificates, not by drawing boxes.

A worker is linked to a TRU through their statutory deductions calculation card (Chapter 5), not directly on the assignment. That indirection catches people out: a worker can be in the right legal employer, the right payroll and the right department, and still be missing from a statutory report because the card carries no TRU.

Because that link is per person rather than structural, it is also a migration deliverable. The TRU association for every employee is a column in the conversion file, derived from which branch or establishment each person is registered at — a fact that usually lives in the client's social-insurance filings rather than in their HR system. Finding the owner of that mapping early is worth doing; it is the single most common reason a first statutory report comes out with the wrong population.

The practical design question on a multi-company client is therefore: which legal entities are PSUs, and which are legal employers reporting under a parent PSU? A group with three registered companies in Egypt may well have three PSUs. Do not assume one per country.

## The hard boundary: legislative data groups

A **legislative data group (LDG)** is a partition that isolates payroll and related legislative data. Each LDG belongs to exactly one legislation and carries one currency, and Oracle's instruction is to create one for each country the enterprise operates in, then associate each PSU with it.

All payroll configuration lives inside exactly one LDG: elements, balances, balance dimensions, fast formulas, element eligibility, payroll definitions, rate definitions, calculation value definitions, organization payment methods. Egyptian payroll rules cannot leak into Saudi payroll rules, because as far as the application is concerned the Egyptian objects do not exist in the Saudi world. An element defined in the Egypt LDG is not hidden from the Saudi LDG. It is absent from it. It must be built again.

This produces the most common support question in the first month of a multi-country project: "why can't I see my element?" The answer is almost always the LDG context selected at the top of the page.

The partition is a feature, not a limitation. It is what makes it safe for one instance to run Egyptian and Saudi payroll side by side, with completely different statutory logic, without any possibility of one country's rule firing against the other's population. The cost is duplication: two countries means two element libraries, two sets of formulas, two balance structures. Estimating a multi-country payroll project as though configuration is reused once is the classic way to lose money on it.

The honest estimating rule is that the second country costs perhaps 60–70% of the first and the third rather less, because the design thinking is reused even though the objects are not. What is never reused is the testing: every country's payroll has to be parallel-run on its own, against its own legacy, by people who understand its statute.

One more consequence, and it is the expensive one: an LDG cannot be meaningfully changed once payroll data exists inside it. The currency and legislation chosen at the start are effectively permanent. Getting the country list right before configuration starts is worth an extra workshop.

[[fig:ldg-wall]]

The country list is also a commercial question, not only a technical one. "We might open in Qatar next year" is a sentence that should produce a plan for adding an LDG later, not an LDG created speculatively now — an empty LDG costs nothing to carry and nothing to create later, and creating one for a country the client never enters leaves a confusing artefact behind.

## The operational picture: business units

The **business unit (BU)** is an operational grouping used for processing transactions, sharing reference data such as jobs and grades, and controlling data access. It is not a legal registration and carries no statutory meaning whatever.

A shared-services centre may serve three legal entities. A single legal entity may contain several business units. Neither arrangement is unusual and neither is wrong. Clients decide based on how they actually run the business, and they conflate "how are we registered" with "how do we operate" constantly. Keeping the two apart is the consultant's job, and the useful question in a workshop is not "is this a business unit?" but "does this group of people need its own set of jobs, its own approvals, and its own view of the data?"

## Reference data sets, and why the BU matters more than it looks

The business unit's real power is reference data sharing, and this is the part of Chapter 1 most often skipped in training.

Oracle lets you group set-enabled configuration data — jobs, grades, locations, departments — into **reference data sets**, then assign those sets to business units. At transaction time the application filters what can be selected based on the business unit involved. Assign a job to the Common Set and every business unit can use it. Assign it to a specific set attached to one business unit, and only that unit sees it.

The consequence is that business unit design silently decides how much duplication the client will live with. A global group that wants one job catalogue everywhere puts jobs in the Common Set and is done. A group whose manufacturing arm and consulting arm share nothing puts them in separate sets and accepts that "Manager" now exists twice. Getting this wrong in either direction is painful: over-sharing produces a job list of four hundred entries where a hiring manager needs six, and under-sharing produces four hundred entries that are the same six repeated.

The mechanism underneath is worth one sentence because it demystifies the behaviour. A set assignment is made per *object type* per business unit — jobs, grades, locations and departments are assigned separately — so a client can share one catalogue and partition another. That flexibility is the reason the design question has to be asked object by object rather than answered once.

Positions are the exception worth remembering. They attach to a business unit directly rather than through a set. If a client asks why their position list does not behave like their job list, that is why.

[[fig:reference-data-sets]]

## Divisions, departments and locations

A **division** is the top of the management hierarchy — above the business unit, not below it — aligned to a product line or a geography and used for management reporting rather than transaction processing. One division can span several business units and several legal entities, which is how a group answers "how did the Middle East business perform" when the Middle East is not a legal entity and never will be. Oracle's own worked example builds divisions for the US, Europe and the Middle East across five countries and several legal entities, a shape that maps neatly onto how regional groups in Cairo and Riyadh describe themselves. Oracle treats division → business unit → department as recommended practice rather than something the application enforces, so it is worth confirming which way a client's existing structure actually runs before assuming it.

Below the business unit, the **department** is the box on the org chart that a worker actually sits in. It is the natural unit for headcount reporting and manager hierarchies, and it exists independently of whoever currently manages it — which is why a manager change never requires a new department. Departments can carry a cost centre, which is the hook payroll costing later uses to send an employee's cost to the right place in the general ledger.

That cost centre link is worth treating as a joint deliverable with Finance rather than as an HR field. The value entered has to be a real segment value in the chart of accounts, it has to stay in step as Finance restructures, and when it is wrong the symptom appears a month later as a costing exception nobody in HR can interpret (Chapter 21). The useful discipline is a single mapping document, owned jointly, reconciled whenever either side changes.

A **location** is a physical work site with an address. It matters more than it looks, because statutory jurisdiction, working-time rules, allowance eligibility and public-holiday calendars are frequently driven by where the person physically works rather than by who employs them. In the Gulf especially, location often decides allowance eligibility — a site allowance for a remote plant, a housing differential between cities. Locations are set-enabled like jobs and grades, so the same sharing rules apply.

Two habits keep locations useful. Create them at the granularity the business actually distinguishes — one per building where allowances or calendars differ, not one per floor — and inactivate rather than delete the ones that close, so that history still resolves. A location list that has grown to several hundred entries, most of them dead, is a reliable sign that nobody owns it.

## Trees: how the structure becomes security and org charts

The objects above are a list until something arranges them into a shape. That something is an **organization tree**.

Oracle supports department trees, organization trees and position trees. A tree takes the flat set of departments (or organizations, or positions) and expresses the parent–child relationships between them, in versions that carry their own effective dates. Two things consume them. The org chart the business sees is drawn from a tree. More importantly, security profiles scope data by tree node: "this HR specialist can see everyone in the Manufacturing department and everything below it" is a statement about a tree, not about a list of departments.

This is the quiet link between Chapter 1 and Chapter 15. A structure that is correct but flat gives the security model nothing to grip. When a client asks for departmental HR access and the department tree has never been built, the request cannot be satisfied no matter how the roles are configured.

Trees are versioned and must be published before use, which is a recurring source of "I made the change and nothing happened". The sequence to remember is that a new version is created, edited, audited and then published — and that the audit step is doing real work, because a tree with a cycle or an orphan is exactly the kind of structure that produces strange security results rather than an honest failure.

Plan tree maintenance as an operational procedure, not a one-off build. Every reorganization is a new tree version, and the question of who creates it, who checks it and when it is published belongs in the client's runbook beside the payroll calendar.

## Loading the structure rather than typing it

On a group of any size, these objects arrive by bulk load rather than by hand, and the dependency order in this chapter becomes a file order (Chapter 11).

The sequence is the same as the build order: addresses and geographies first, then legal entities and their registrations, then the HCM classifications, then business units, then departments and locations, then the trees. Loading a department that names a business unit which does not exist yet fails at load rather than at import, which is the usual experience of getting the order wrong.

The thing worth saying to a project manager is that these loads are small and fiddly rather than large and slow — a few hundred rows, each of which has to be exactly right, with a dependency chain that punishes guessing. Budget care rather than hours.

## What the structure does to every report afterwards

A last reason to get this right: these objects are the filters on nearly every report the business will ever run.

Legal employer, business unit, division, department and location are the dimensions a headcount report is sliced by, and a structure that does not match how the business thinks produces reports nobody uses. If the client describes performance by region and there is no division for region, every report will be assembled by hand. If departments are too coarse, no manager can see their own team; if they are too fine, the chart is unreadable.

The test to apply at the end of the design workshop is simple and rarely done: take the five reports the client says they look at monthly, and check that each one can be produced by filtering on objects that exist in the design. Where one cannot, the structure is missing something, and it is cheaper to find that out now.

## Three shapes you will actually meet

**The single-entity Egyptian company.** One commercial register, one tax card, one legal entity that is both legal employer and PSU, one Egypt LDG, one TRU, one business unit, departments under it. Most of this chapter collapses to a single line each. The work is in the department tree and the locations.

**The Egypt-plus-Saudi group.** Two LDGs, and everything payroll-shaped doubles. Legal entities in each country, each a legal employer; whether each is also a PSU depends on who files. Saudization is assessed per Saudi establishment, so the number of Saudi TRUs follows the number of registrations rather than the number of companies. Divisions give the group a "Middle East" view that no legal entity provides. This is the shape most regional implementations take.

**The shared-services group.** Several legal employers, one PSU doing the filing, one business unit running transactions for all of them. This is where the legal and operational pictures separate most visibly, and where a consultant who has only seen the first shape gets confused: the same person is employed by company A, paid by filer B, and processed by service centre C, and all three are correct at once.

And a fourth that regional consultants meet often enough to prepare for: **the group with an entity in a free zone**. Several Gulf jurisdictions have financial or economic free zones whose employment rules are not the same as the surrounding country's — different labour law, different end-of-service arrangements, sometimes a different authority to register with. The structural answer is a separate legal entity with its own registrations, and the configuration answer may be separate plans, elements and calendars for its population. The question to ask early is which law governs the employment contract, and the person who knows is the client's legal counsel. Chapter 18 picks this up for the UAE specifically.

## What is expensive to change later

Not every decision in this chapter carries the same weight, and knowing which ones bind is what separates a consultant from someone reading a setup guide.

[[fig:change-cost]]

Cheap to change: departments, divisions, locations, tree structure, most reference data. These move with ordinary effective-dated updates.

Expensive: the business unit design, because reference data sets attach to it and moving them means re-pointing every job, grade and location.

Effectively permanent: the legislative data group's legislation and currency, and the legal employer a worker sits in. The first cannot be altered once payroll data exists. The second changes only by ending one employment and starting another — a global transfer, which is the worked example Chapter 3 walks through, and which has real consequences for service dates, accrued leave and end-of-service liability.

The way to use this list in practice is to spend the design time in proportion to it. A day arguing about department naming is a day wasted; an hour too few on the PSU and TRU map is an hour that costs a quarter.

## The configurator, and when to use it

Oracle ships the **Enterprise Structures Configurator**, an interview-style wizard that asks about the enterprise, its countries and its operating shape, then creates legal entities, classifies them as legal employers and PSUs, and creates a legislative data group for each country in one pass. It produces a technical summary of what it intends to do before committing, and the structure can be reviewed and rolled back before it is loaded.

It is genuinely useful for a greenfield build and genuinely dangerous as a substitute for understanding, because it makes defensible default choices that a consultant then has to explain — or unpick — six months later.

The sensible way to use it is as a fast first draft on a simple structure, with the technical summary read line by line before anything is committed, and the result compared against the one-page map from the discovery. Where the two disagree, the map is right and the wizard's assumption has to be changed. Where there is no map, the wizard has just made the client's structural decisions for them.

## The order you build it in

Stated as a sequence, because the dependencies are real and the application enforces most of them:

- Geography structures, hierarchies and validation for each country.
- Legal addresses, jurisdictions and authorities.
- Legislative data groups, one per country.
- Legal entities, with their registrations.
- Legal entity HCM information: legal employer, PSU, parent PSU where the entity is an employer only.
- Tax reporting units, beyond those created automatically with the PSU.
- Divisions, then business units and the reference data sets assigned to them.
- Departments and locations.
- Trees, then published.

[[lab:org]]

## Common mistakes

- Describing the enterprise as "the company". The company is a legal entity; the enterprise is the whole group.
- Drawing the structure from an org chart instead of from the registration certificates.
- Starting configuration before the one-page map of entities, classifications and LDGs exists.
- Leaving geography setup until addresses are needed, then discovering the import route is already closed.
- Setting address validation to error in a country whose reference data is thin.
- Assuming a legal entity can hire. It cannot until it is classified as a legal employer.
- Assuming one PSU per country. Map legal entities to PSUs deliberately, from the registration certificates.
- Centralising filing under one PSU without noticing it also merged two employments' statutory ceilings.
- Forgetting that the TRU association is per person, on the calculation card, and therefore a migration column.
- Expecting to reuse one element library across countries. Each LDG is its own world, and the duplication has to be estimated for.
- Creating an LDG for a country the client has not entered yet.
- Calling a business unit "just another word for department". A BU is a processing and access construct; departments sit below it.
- Designing business units without deciding the reference data sets, then discovering the job list cannot be shared.
- Treating the department's cost centre as an HR field rather than a joint mapping with Finance.
- Confusing a legal address with a work location. One is where the company is registered, the other is where people sit.
- Building the structure and never building the trees, then being unable to scope security to a department.
- Editing a tree and never publishing it.
- Letting the Enterprise Structures Configurator make the design decisions, then having to defend them.

## Sources

- Oracle, *Implementing Global Human Resources* — the "Enterprise Structures: Initial Configuration" chapter. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
- Oracle, *Implementing Global Human Resources* — "Person Number Generation Methods". https://docs.oracle.com/en/cloud/saas/human-resources/faigh/person-number-generation-methods.html
- Oracle, *Using Common Features for HCM* — "How do I manage geography validation?", for the structure, hierarchy and validation order and what each validation level does. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/geography-validation.html
- Oracle, *Using Common Features for HCM* — "What are the best practices for managing geography mismatches?", for validating addresses created before validation was configured. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/best-practices-for-managing-geography-mismatches.html
- Oracle, *Implementing Payroll for Canada* — "What's a tax reporting unit?"; the classification topic is written once and applies to every localization. https://docs.oracle.com/en/cloud/saas/human-resources/fapcd/what-s-a-tax-reporting-unit.html
- Oracle, *Using Common Features* — "How Business Units Work with Reference Data Sets". https://docs.oracle.com/en/cloud/saas/human-resources/faucf/how-business-units-work-with-reference-data-sets.html
- Maverick Solutions, "Effectively using legislations and legislative data groups in Oracle Cloud HCM Payroll". https://mavericksolutions.com/2021/06/15/legislations-and-legislative-data-groups-in-oracle-cloud-hcm-payroll/
- Apps2Fusion, "Legal Entity and Legal Employer in Fusion Application". https://apps2fusion.com/old/oracle-fusion-online-training/1519-legal-entity-and-legal-employer-in-fusion-application
