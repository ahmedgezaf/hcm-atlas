---
id: org
num: 1
track: functional
title: Enterprise & Organizational Structures
subtitle: The compliance skeleton — legal view versus operational view
hue: 214
minutes: 9
labs: org
terms: enterprise, legal-entity, legal-employer, payroll-statutory-unit-psu, tax-reporting-unit-tru, legislative-data-group-ldg, business-unit-bu, department, division, location
---

Every Oracle HCM implementation starts here, because nothing else can be configured until these objects exist. The single hardest idea in this chapter is also the most important one: Oracle deliberately keeps two pictures of the same company. The **legal** picture answers the questions a government asks — who is registered, who employs, who pays, who reports. The **operational** picture answers the questions a manager asks — who runs what, who sits where, who may see whose data. In real companies the two rarely line up, and Oracle's structure exists precisely so they don't have to.

[[fig:legal-vs-operational]]

## One enterprise, many legal entities

The **enterprise** is the single top node of the whole structure. There is exactly one per implementation. It is a container for enterprise-wide settings — person-number generation, worker-number sequencing, global defaults — and it is not a legal concept. It never appears on a government form. For a holding company with a factory and a trading arm, the enterprise is the group; the registered companies underneath are something else.

Those registered companies are **legal entities**: organizations recognized by law that can own assets, sign contracts, incur liabilities and be sued. In Egypt each one has its own commercial register number and tax card. Oracle creates them through the Legal Entity Configurator, and the first job on any project is to work out how many there really are. The commercial registers give the definitive answer; the org chart does not.

A legal entity on its own employs nobody. To hire anyone into it, the entity must be classified as a **legal employer**. Oracle makes "employer" a classification you switch on rather than something every legal entity is assumed to be, because some entities exist only to hold property or issue invoices. Every worker belongs to exactly one legal employer at a time, through their work relationship (Chapter 3). Change the legal employer and you have changed who legally employs the person — a materially different event from changing their department.

> **Interview classic.** "What is the difference between a legal entity and a legal employer?" A legal employer is a classification applied to a legal entity that enables it to employ workers. Not every legal entity is a legal employer. Treating the two as synonyms is the most common miss in this whole area.

## Who pays, and who reports

Two more classifications sit on the legal entity, both about payroll. A **payroll statutory unit (PSU)** is a legal entity responsible for paying workers and remitting payroll tax and social insurance to the authorities. It is the level at which a person's payroll records are grouped for statutory calculation and reporting — in Egypt, the entity that files with NOSI and the Egyptian Tax Authority. Oracle's documentation puts the relationship plainly: when a legal entity is identified as a legal employer but not as a PSU, it must be given a parent PSU, and its reporting units are created as children of that parent.

Beneath the PSU sits the **tax reporting unit (TRU)**: the reporting face of the PSU toward tax and social-insurance authorities. Oracle describes the TRU as the HCM version of a "legal reporting unit" and says it exists "to group workers for the purpose of tax and social insurance reporting." A single PSU may need to report under more than one registration number, and the TRU gives it a level to hang that on. Statutory reports are typically run per TRU, and a person is linked to a TRU through their calculation cards.

The practical design question on a multi-company client is therefore: which legal entities are PSUs, and which are legal employers reporting under a parent PSU? A group with three registered companies in Egypt may well have three PSUs. Do not assume one per country.

## The hard boundary: legislative data groups

A **legislative data group (LDG)** is a partition that isolates payroll and related legislative data by country. All payroll configuration — elements, balances, formulas — lives inside exactly one LDG. Egyptian payroll rules must never leak into Saudi payroll rules, and the LDG is the boundary that guarantees it. An element defined in the Egypt LDG simply does not exist in the Saudi LDG; it must be built again. When someone asks "why can't I see my element?", the first thing to check is which LDG they are in.

[[fig:ldg-wall]]

## The operational picture

The **business unit (BU)** is an operational grouping used for processing transactions, sharing reference data such as jobs and grades, and controlling data access. It is not a legal registration. A shared-services centre may serve three legal entities; a single legal entity may contain several business units. Clients decide based on how they actually run the business, and they conflate "how are we registered" with "how do we operate" constantly. Keeping the two apart is the consultant's job.

Below the BU, the **department** is the box on the org chart that a worker actually sits in — the natural unit for headcount reporting and manager hierarchies. It exists independently of whoever currently manages it, which is why manager changes never require a new department. A **division** is a broader management-reporting layer above departments, aligned to a product line or geography, and is used for analytics rather than transaction processing. A **location** is a physical work site with an address; it matters because statutory jurisdiction, working-time rules, allowances and public-holiday calendars are frequently driven by where the person physically works. In the Gulf especially, location often decides allowance eligibility.

[[lab:org]]

## Common mistakes

- Describing the enterprise as "the company". The company is a legal entity; the enterprise is the whole group.
- Assuming a legal entity can hire. It cannot until it is classified as a legal employer.
- Assuming one PSU per country. Map legal entities to PSUs deliberately.
- Expecting to reuse one element library across countries. Each LDG is its own world.
- Calling a business unit "just another word for department". A BU is a processing and access construct; departments sit below it.

## Sources

- Oracle, *Implementing Payroll* — "What's a tax reporting unit?" and related legal-entity classification topics. https://docs.oracle.com/en/cloud/saas/human-resources/fapcd/what-s-a-tax-reporting-unit.html
- Maverick Solutions, "Effectively using legislations and legislative data groups in Oracle Cloud HCM Payroll". https://mavericksolutions.com/2021/06/15/legislations-and-legislative-data-groups-in-oracle-cloud-hcm-payroll/
- Apps2Fusion, "Legal Entity and Legal Employer in Fusion Application". https://apps2fusion.com/old/oracle-fusion-online-training/1519-legal-entity-and-legal-employer-in-fusion-application
