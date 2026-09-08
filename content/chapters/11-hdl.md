---
id: hdl
num: 11
title: Loading Data: HCM Data Loader
subtitle: The highest-value technical skill a functional consultant can arrive with
hue: 198
minutes: 9
labs: hdl
terms: hdl-hcm-data-loader, hsdl-hcm-spreadsheet-data-loader, source-system-key-vs-person-number
---

In Oracle HCM, "functional" consultants are expected to be mildly technical. On real projects, bulk data loads land on strong functional people, and many avoid them. **HCM Data Loader (HDL)** is Oracle's bulk loading tool: nobody hand-enters ten thousand employees, so data migration and mass updates run through it. Comfort with HDL makes a consultant useful immediately.

## The shape of a load

A load is one or more `.dat` files, zipped flat (no folders) and uploaded. Each file holds data for a single business object and is named for it: `Worker.dat`, `Job.dat`, `Grade.dat`, `ElementEntry.dat`. HDL decompresses the zip, imports the data lines into staging tables, groups them into business objects, and then loads them.

Inside a file there are two kinds of instruction line, both pipe-delimited. A **METADATA** line declares the columns for a component: the keyword, then the discriminator (which component the line describes), then the attribute names. **MERGE** lines carry the data in the same order; MERGE creates the record if it does not exist and updates it if it does. **DELETE** removes a record.

```
METADATA|JobFamily|JobFamilyCode|JobFamilyName|EffectiveStartDate|EffectiveEndDate
MERGE|JobFamily|SALES|Sales|2000/01/01|4712/12/31
```

That creates a job family coded SALES, effective from 1 January 2000. The end date `4712/12/31` is Oracle's conventional "end of time"; it appears everywhere. Dates use `YYYY/MM/DD`. A `Worker.dat` continues with further METADATA and MERGE pairs for PersonName, PersonNationalIdentifier, PersonEmail, WorkRelationship and Assignment — all components of the same worker hierarchy, in one file.

## The rules that get files rejected

The METADATA line must appear before the MERGE or DELETE lines it relates to. A file may contain several METADATA lines, but each must be for a different component — two Job METADATA lines in one file is invalid. Each MERGE line must contain the same attributes as its METADATA line, in the same order, so a pipe-count mismatch fails the line. Attribute names are case-sensitive. Files should be UTF-8 without a byte-order mark.

## Keys: what makes a migration reconcilable

HDL identifies records three ways. **Source keys** use `SourceSystemOwner` plus `SourceSystemId` to identify a record by its origin in the legacy system; if used, both must appear in the METADATA line. **User keys** identify by natural business keys such as `JobFamilyCode`. Oracle also generates its own surrogate IDs internally. A person's Oracle identifier is the **person number**; the source system key is what links that record back to the legacy one.

The choice matters after the load, not during it. Source keys are what let a team trace every Oracle record to its legacy origin and explain every variance in reconciliation. Getting them right makes reconciliation possible; getting them wrong makes it nearly impossible, and data conversion is routinely the thing that delays a go-live.

## Referencing other objects and ordering the load

To point at a foreign object, the attribute is named with the key type in brackets — `JobFamilyId(SourceSystemId)`, `PersonId(SourceSystemId)`. That is how child components attach to their parents. Several `.dat` files can go in one zip; HDL imports them in parallel but loads them sequentially, so referenced data must exist before it is referenced: job families before jobs, grades and jobs before assignments, people before work relationships.

[[lab:hdl]]

## HSDL: the spreadsheet cousin

**HCM Spreadsheet Data Loader (HSDL)** is a spreadsheet interface over the same loading framework, aimed at business users. HDL is for bulk migration by the project team; HSDL is for ongoing, business-user-facing mass updates after go-live.

## Common mistakes

- Two METADATA lines for the same component in one file.
- MERGE attributes out of order relative to METADATA.
- Wrong date format (`MM/DD/YYYY` corrupts silently).
- Loading children before parents.
- Choosing user keys for a migration that will need reconciling.

## Sources

- Oracle, *HCM Data Loading Business Objects* — "Data File Instructions and Delivery". https://docs.oracle.com/en/cloud/saas/human-resources/21b/faihm/data-file-instructions-and-delivery.html
- Oracle tutorial, "Create and Maintain Data with HCM Data Loader". https://docs.oracle.com/en/cloud/saas/tutorial-hdl-load-files/
- HCM Tables, "HCM Data Loader (HDL) Complete Guide — .dat File Format, Templates & Troubleshooting". https://hcm-tables.com/blog/hdl-data-loader-guide
