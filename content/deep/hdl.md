---
id: hdl
minutes: 46
---

In Oracle HCM, "functional" consultants are expected to be mildly technical. On real projects, bulk data loads land on strong functional people, and many avoid them. **HCM Data Loader (HDL)** is Oracle's bulk loading tool: nobody hand-enters ten thousand employees, so data migration and mass updates run through it. Comfort with HDL makes a consultant useful immediately.

It is worth being precise about why. A migration is not really a technical problem. The technical part — write a pipe-delimited file, zip it, press a button — can be taught in a morning. The hard part is knowing what the business means by an employee, which of the legacy system's four date columns is the one Oracle calls the hire date, what to do with the three hundred people whose records disagree with themselves, and how to prove to a finance director that the headcount in the new system is the same headcount as in the old one. That is functional work. HDL is simply the place where the functional decisions stop being opinions and start being rows that either load or do not.

This chapter goes through the tool in the order a project meets it: the shape of a load, what is in a file, how a load is actually run, what happens when it fails, and the two areas — keys and date effectivity — where most of the real difficulty lives.

## What the tool actually is

HDL is a staged, file-based loader that sits in front of the same application logic the user interface uses. That last point matters more than anything else in this chapter: HDL is not a back door into the database. A record loaded through HDL is validated by the same rules that would have rejected it on screen. If a grade is not valid for a job on a given date, the screen will not let a user save it and HDL will not load it either. Consultants who expect HDL to be a way around configuration are reliably disappointed, and the disappointment usually arrives on the worst possible day.

The tool lives in the **Data Exchange** work area. That is where files are uploaded, where loads are started, where the results of a load are read, and where the configuration that governs every load is set. A consultant who knows only one navigation path in the technical half of the product should know this one.

The work is done in three stages, and keeping them separate in your head is the single most useful habit the chapter can give you. First the file is **uploaded** — a zip arrives on the server and nothing has been inspected. Then it is **imported** — the lines are read, checked for shape, and written into staging tables that are not HR data. Then it is **loaded** — the staged lines are assembled into whole business objects and offered to the application, which accepts or rejects each one on its merits.

## The shape of a load

A load is one or more `.dat` files, zipped flat with no folders, and uploaded. Each file holds data for a single business object and is named for it: `Worker.dat`, `Job.dat`, `Grade.dat`, `ElementEntry.dat`. The name is not decoration. HDL reads the file name to decide which business object it is looking at, so `workers.dat` or `Worker (1).dat` is not a Worker file and will not be treated as one.

A **business object** in HDL's sense is a tree, not a table. `Worker` is the root, and underneath it sit components: PersonName, PersonNationalIdentifier, PersonEmail, PersonAddress, WorkRelationship, WorkTerms, Assignment and more. All of them live in the one `Worker.dat` file, because they are parts of the same object. This is why a worker file is long and why a single bad line in it can sink a whole person: HDL assembles the components into one object and loads that object, so a rejected child can take its parent down with it.

The components are what the `.dat` file's second column names. Oracle calls that column the **discriminator**, and it is how one file can carry several different shapes of line.

## Inside a .dat file

Every line in the file is pipe-delimited and begins with a keyword.

A **METADATA** line declares the columns for one component: the keyword, then the discriminator, then the attribute names in the order the data lines will supply them. **MERGE** lines carry the data in that same order; MERGE creates the record if it does not exist and updates it if it does. **DELETE** removes a record. **SET** lines, which come before everything else, change how the file is processed.

```
METADATA|JobFamily|JobFamilyCode|JobFamilyName|EffectiveStartDate|EffectiveEndDate
MERGE|JobFamily|SALES|Sales|2000/01/01|4712/12/31
```

That creates a job family coded SALES, effective from 1 January 2000. The end date `4712/12/31` is Oracle's conventional "end of time"; it appears everywhere in the product, in HDL files, in extracts and in the database itself, and it is worth recognising on sight. Dates use `YYYY/MM/DD`.

A file may contain several METADATA lines, but each must be for a different component. Two `Job` METADATA lines in one file is invalid. The METADATA line must appear before the MERGE or DELETE lines it relates to, and every data line must carry exactly the attributes its METADATA line declared, in the same order — so a pipe-count mismatch fails the line even when a human can see what was meant. Attribute names are case-sensitive, and HDL validates every attribute name in the METADATA line rather than quietly ignoring one it does not recognise. Files should be UTF-8 without a byte-order mark; a BOM lands in the first attribute name of the first line and produces an error message that looks like nonsense.

The pipe is the default delimiter rather than a law. `SET FILE_DELIMITER` changes it, and the escape character and the newline marker can be changed the same way. In practice almost nobody changes them, and the one time it is genuinely useful is a free-text field — an address line, a comment — that contains the delimiter itself. The alternative is escaping, which is what the escape character exists for.

## The SET instructions, and why they are a migration lead's business

SET lines are optional, carry no discriminator, and must all appear before the first METADATA line. Each one applies to the file it is in and overrides the enterprise default for that file, so a SET line is a per-file decision rather than a per-record one. There is no object-level scope.

The one that matters most is `SET PURGE_FUTURE_CHANGES`, which is covered under date effectivity below because that is what it governs.

Several others are worth knowing by name. `SET DISABLE_POST_PROCESS_TASKS` stops a named post-load process from running automatically — `RefreshManagerHierarchy` and `UpdatePersonSearchKeywords` in a worker file, `FlattenPositionHierarchy` in a position hierarchy file. `SET INVOKE_POST_PROCESS N` prevents the post-load processes from running at all. `SET ENABLE_AUDIT_DATA` and `SET PURGE_AUDIT_DATA` turn auditing on or off for the file's objects and, in the second case, remove audit records — which exists mainly so that audit trails of personal data can be cleared. The two cannot both be set to `Y` in the same file; to purge audit data while enterprise auditing is on, the documented combination is `ENABLE_AUDIT_DATA N` with `PURGE_AUDIT_DATA Y`.

Two are specific to worker files and save a surprising amount of work: `SET CALCULATE_FTE Y` calculates FTE for every assignment in the file, and `SET CREATE_DEFAULT_WORKING_HOUR_PATTERN Y` creates a default working-hour pattern for them. A migration that does not know about these two tends to discover them after writing a spreadsheet formula to do the same job less well.

`SET ENABLE_INCREMENTAL_LOAD_EVENTS Y` fires the atom feeds and events that the file's changes would otherwise raise. The default is off, and the default is usually right during a migration: a conversion load that fires an event per worker can flood every downstream integration listening to the environment. It is also slower, which Oracle says plainly.

`SET EXTEND_DATA_SET_RETENTION Y` keeps a data set available beyond the default thirty days after its last update, so that it can still be validated or rolled back. It costs processing time, and when several business object files support validate or roll back the instruction only needs to be supplied once.

```
SET PURGE_FUTURE_CHANGES N
SET DISABLE_POST_PROCESS_TASKS UpdatePersonSearchKeywords
METADATA|Worker|PersonNumber|StartDate|...
MERGE|Worker|...
```

One caution. Oracle's own SET reference is internally inconsistent in places — the table lists `SET FILE_NEWLINE` while the example on the same page uses `SET FILE_NEW_LINE`, and the table lists `SET ORACLE_SEARCH_UPDATE_MODE` while the surrounding text uses `SET ORA_UPDATE_ORACLE_SEARCH`. The table also gives `SET ENABLE_AUDIT_DATA` a default of `N` while the text says the enterprise-level setting decides it. Where the documentation disagrees with itself, test the spelling in a development environment before putting it in a cutover script, and keep the tested spelling in the runbook.

## Import and load are two different inspections

Those are two separate inspections, and knowing which one rejected a file tells you where to look.

**Import** reads the file and checks its shape — pipe counts, attribute spelling, date format, whether the discriminator is a real component of that object — and puts well-formed lines into staging tables, which are a holding area rather than HR data. **Load** then assembles staged lines into whole business objects and checks what they mean: does the job exist, is the grade valid on that date, does the parent this record points at exist, is this person already employed on that date.

The distinction has a practical consequence. A file that fails import has a formatting problem and has written nothing anywhere. A file that passes import and fails load is well-formed and refers to something that is not there yet, which is almost always a load-order problem — or it is well-formed, refers to real things, and is being refused by a business rule, which is a configuration conversation rather than a data one.

[[fig:import-vs-load]]

[[lab:import-load]]

Staging is not free. The staging tables accumulate, and Oracle's own best-practice advice is to purge stage table data regularly, particularly after large volumes and for data sets nobody intends to look at again. On a long migration with weekly rehearsals, this is a standing item rather than an afterthought.

## Keys: what makes a migration reconcilable

HDL identifies records three ways.

**Source keys** use `SourceSystemOwner` plus `SourceSystemId` to identify a record by its origin in the legacy system; if they are used, both must appear in the METADATA line. The owner value is not free text — it is checked against the `HRC_SOURCE_SYSTEM_OWNER` lookup, so the source system's name has to be added to that lookup, through Manage Common Lookups in Setup and Maintenance, before any file referencing it will load. A file that names an unregistered owner fails, and the error does not say "add a lookup value", so the first encounter with it costs an afternoon. Where no source key is supplied, the default owner is `FUSION`.

**User keys** identify by natural business keys such as `JobFamilyCode` — the values a person would use to describe the record out loud. **Surrogate IDs** are the internal identifiers Oracle generates for itself. A person's Oracle-facing identifier is the **person number**; the source system key is what links that record back to the legacy one.

Oracle's own recommendation is to use source keys for every implementation, and there is a harder reason than tidiness: some objects cannot be updated with a user key at all. Most Worker components are in that category. The clearest illustration is a person's address, where `AddressLine1` is both part of what identifies the record and the thing being changed — so an update by user key has no stable way to say which record it means. Source keys avoid the whole class of problem. They can also be updated later, which rescues the case where a key was auto-generated and the team wants a better one.

The choice matters after the load, not during it. Source keys are what let a team trace every Oracle record to its legacy origin and explain every variance in reconciliation. Getting them right makes reconciliation possible; getting them wrong makes it nearly impossible, and data conversion is routinely the thing that delays a go-live.

The cost of having no stable key shows up the first time a load partially fails. Forty records rejected out of twelve hundred is an ordinary morning; matching those forty back to the rows that produced them is only trivial if every record carries an identifier that is unique in the source and unchanged by the load. Names are not that identifier — two employees share one often enough to break a reconciliation, and names get re-spelled and change with marriage. Employee numbers are not reliably that identifier either, because legacy systems reissue them.

[[lab:source-keys]]

The practical shape of this on a project is a mapping sheet that nobody enjoys maintaining: one row per legacy record, carrying the legacy identifier, the value that went into `SourceSystemId`, and eventually the Oracle person number that came back. It is the artefact that answers "where did this person come from" for the next three years, and the team that keeps it honestly is the team whose month-end reconciles.

## Date-effective loading, which is where most of the difficulty lives

Most HCM objects are date-effective — the same record exists as a chain of dated versions, each valid for a range. Loading them is where HDL stops being a file format and starts requiring thought.

A MERGE line on a date-effective object carries an `EffectiveStartDate` and usually an `EffectiveEndDate`. The start date is the date the change takes effect, and it is also what decides the kind of change being made. If the start date **matches an existing record**, that record is changed in place: a **correction**, with no new version created, and only the attributes supplied are changed. If the start date **does not match** an existing record, a new version is created and the previous one is end-dated to the day before: an **update**. The file does not say which of the two it wants. The dates say it.

That is worth reading twice, because it is the mechanism behind a whole family of migration accidents. A correction that was meant to be an update silently rewrites history. An update that was meant to be a correction leaves a one-day version of the old values sitting in the record, which is invisible on screen until somebody runs a report that happens to be effective on that day.

Attributes that are not supplied are not blanked. They roll forward from the previously dated record, or are inherited from whichever record was active on the effective start date. This is why a correction can be a two-attribute line and still be safe.

`SET PURGE_FUTURE_CHANGES` decides what happens to versions that already exist *after* the one being loaded. The default is `Y`, which replaces any date-effective records falling inside the range given by the start and end dates on the line — later splits are deleted and the record is rebuilt from the file. Oracle's best-practice advice for updates is to include `SET PURGE_FUTURE_CHANGES N` explicitly, which retains existing future-dated changes. The two settings answer genuinely different questions: `Y` means "this file is the truth for this period", and `N` means "insert this change and leave everything after it alone".

With `N`, the `EffectiveEndDate` then carries one of two tokens that say what should happen to those surviving future records. `#RETAIN` keeps their attribute values as they are — the change is inserted historically and the future is untouched. `#ALL` rolls the supplied values forward across every later record — the change applies from here on.

```
SET PURGE_FUTURE_CHANGES N
METADATA|Job|JobCode|SetCode|EffectiveStartDate|EffectiveEndDate|Name
MERGE|Job|SALES|COMMON|2015/01/01|#RETAIN|Sales Consultant
```

That line inserts a historic name without disturbing a later rename. Swapping `#RETAIN` for `#ALL` would push the new name forward across every later version instead. There is one documented restriction worth carrying: on an object that is already end-dated — one whose last version does not run to `4712/12/31` — an update using `#ALL` together with an end date will fail.

When a whole dated history is being loaded at once, the rules tighten. The records may appear in any order in the file, but the date ranges must be consecutive with no gaps. HDL groups them and loads them as a single object, which means an error on any one record fails the entire object rather than leaving a partial history behind. Only the first dated record is processed as a creation; every later one is treated as an update to it. And where the very first start date itself has to change, `ReplaceFirstEffectiveStartDate` set to `Y` is the documented way to do it, with translated attributes such as `Name` supplied again so that the first-date record is adjusted with it.

Deleting a dated version uses the two dates as a range rather than as a target: the start date names the last record to keep and the end date names the last record to delete. Because the start date given is one that already exists, no new split is created by the deletion itself.

## Multiple changes on one day

Worker employment terms and assignments allow more than one change on the same date, and the file has to describe them unambiguously. Three attributes do that work.

`EffectiveSequence` numbers the changes within a day. It must start at 1 and increase without gaps, a value cannot repeat for the same logical object on the same date, and where there is only one change on a date the sequence is 1. `EffectiveLatestChange` is `Y` on the last change of that date and `N` on the others. And on every record where `EffectiveLatestChange` is `N`, the `EffectiveEndDate` matches the `EffectiveStartDate` — the version lasts for part of a day in the model's eyes, not until the next change.

The trap sits one level up. Assignment and WorkTerms are separate components of the same worker, and when dated splits are supplied for an assignment the same splits have to exist on its work terms record. A file that splits one and not the other is well-formed, imports cleanly, and fails at load with a message about the parent.

## Referencing other objects and ordering the load

To point at a foreign object, the attribute is named with the key type in brackets — `JobFamilyId(SourceSystemId)`, `PersonId(SourceSystemId)`. The bracket is not optional decoration; it tells HDL which of the three identification schemes the value in that column belongs to. That is how child components attach to their parents, and how an assignment finds its job.

Several `.dat` files can go in one zip. HDL imports them in parallel but loads them sequentially, so referenced data must exist before it is referenced: job families before jobs, grades and jobs before assignments, people before work relationships.

Oracle's advice splits by situation, and the split is worth respecting. For a **migration**, put one object type in each zip — jobs in one, grades in another, workers in a third — and load the zips in order, fixing every error in one before starting the next. For an **update** to data that already exists, put all the business object files in the same zip and let HDL process them in dependency order, which it will do without being told.

The reason for the difference is error management rather than mechanics. During a migration the errors are the work, and one object type per file keeps them legible. During an update the volumes are small and the dependencies are the risk.

[[lab:hdl]]

## Running the load, and the parameters worth knowing

A load is submitted from the Data Exchange work area, and its parameters are worth understanding because two of them decide whether a bad file stops early or ploughs on.

The error limits are **percentages, not counts**. The maximum percentage of import errors is the share of a business object's file lines that may be in error before import stops for that object, and the load-side equivalent works the same way for business object instances. Both default to 100 — which is to say, by default nothing stops. On a rehearsal load that is often what you want, because one run then yields the complete list of what is wrong. On a cutover load it is emphatically not what you want, and a lower limit turns "the file was wrong" into a fast failure instead of a long one.

The concurrency parameters are the maximum concurrent threads for import and for load, each defaulting to 8, and the **load group size**, which is how many business objects a single thread takes as one unit of work, defaulting to 100. Only as many threads are created as the group size actually requires, so raising the thread count alone does not necessarily do anything. The ceiling on threads is not unlimited: it is capped by an environment configuration value that Oracle Support supplies, a value above the calculated maximum raises an error, and where the value is left blank the calculated maximum defaults to 1000.

The enterprise defaults behind all of this are set once, in **Configure HCM Data Loader** in Setup and Maintenance, and a load that does not specify a parameter inherits them. The same parameters appear again outside the user interface: the SOAP `importAndLoadData` operation accepts `LoadConcurrentThreads`, `LoadGroupSize`, `ImportMaximumErrors` and `LoadMaximumErrors` as optional name-value pairs, and the REST API exposes `loadConcurrentThreads`, defaulted from the configured maximum. That is how a scheduled integration runs the same load a consultant runs by hand, and it is usually where an integration team takes over.

## Reading a failure

The discipline that separates people who are quick at this from people who are slow at it is simple and unnatural: **read the first error, not the last one, and fix one thing at a time.**

A worker file with a misspelled attribute in the Assignment METADATA line will produce an error for every assignment in the file. The temptation is to read the count — four thousand errors — and conclude that something enormous is wrong. The count is one error, repeated. Sorting the messages and looking at the distinct ones first turns a crisis into a typo.

The second habit is to ask which inspection rejected the file before asking anything else, because the two failure modes have different fixes and the question takes five seconds. Import failures are about shape: a pipe count, a date format, an attribute that does not exist on that component, a file whose name does not match a business object. Load failures are about meaning: a reference to something that has not been loaded yet, a value that fails a business rule, a date that collides with an existing version, a parent whose child could not be built.

The third is to keep a rejected set rather than a rejected count. Every rehearsal should end with a file of the rows that did not load, keyed back to the source. That file, not the success rate, is what gets shorter each week, and it is the only honest answer to "are we ready".

## Post-load processes, and when to switch them off

Loading people does not finish when the rows land. The manager hierarchy has to be refreshed so that the organisation chart and every manager-based security rule see the new reporting lines. Person search keywords have to be rebuilt so that people can be found by name. A position hierarchy has to be flattened so the structure can be queried. Those run automatically after a load.

During a migration this is mostly waste. Loading workers in six tranches and refreshing the manager hierarchy after each one does the same expensive work six times, and the first five results are thrown away by the sixth. The documented way to prevent it is `SET DISABLE_POST_PROCESS_TASKS` naming the process to skip, with the process then run deliberately once at the end. The thing to be careful about is the ending: a migration that disables the refresh and then forgets to run it produces an environment where hierarchy-based security quietly does not work, and that gets diagnosed as a security problem by someone who was not in the room.

## Planning a migration around it

Volume is less of a constraint than people expect — HDL will load very large files — but Oracle's advice is still to split a large load into logical groups, and the reason is human rather than technical. Former employees separate from current ones is the canonical example: the two populations have different data quality, different rules about what is mandatory, and different people who care about them. If a group is still very large, split it again on something that means something.

Around the loading itself, three things decide whether a conversion goes well.

The first is that the extract, the transform and the load are usually owned by different parties — the legacy vendor extracts, the implementation team transforms, HDL loads — and the handover points are where data quality disappears. A dated, versioned extract that can be re-run on demand is worth insisting on early.

The second is rehearsal. A migration that has been loaded once into a test environment has been tested; a migration that has been loaded three times, timed, and reconciled each time has been rehearsed, and cutover is a rehearsal with the clock running. The timing matters as much as the correctness: the cutover window is a fixed number of hours, and a load nobody has timed is a load nobody can schedule.

The third is reconciliation, which is a functional deliverable and not a technical one. Headcount by legal employer, payroll gross by element for the last period, leave balances by plan, active assignments by business unit. Each one agreed with the person who will sign it off *before* the load, so that the number produced afterwards is an answer rather than an argument.

## HSDL: the spreadsheet cousin

**HCM Spreadsheet Data Loader (HSDL)** is a spreadsheet interface over the same loading framework, aimed at business users. A template is defined once by someone who understands the business object, and from then on the people who own the data work in a spreadsheet and press a button, rather than assembling pipe-delimited files.

The division of labour is the point of it. HDL is for bulk migration by the project team; HSDL is for the ongoing, business-user-facing mass updates that follow go-live — the annual salary review, a restructure that moves two hundred people between departments, a batch of new absence entitlements. Handing those to HSDL is also how a project stops being asked to do data entry a year after it finished.

## When not to use HDL

Three situations call for something else. A handful of records is faster to correct on screen, and doing it on screen leaves a normal audit trail rather than a data set. A genuinely continuous feed from another system — a joiner every day from a recruitment platform — belongs in an integration built on the REST or SOAP interfaces rather than in a file somebody has to remember to upload. And anything the business will need to repeat monthly, by themselves, without the project team, is an HSDL template waiting to be written.

## Common mistakes

- Two METADATA lines for the same component in one file.
- MERGE attributes out of order relative to METADATA.
- Wrong date format (`MM/DD/YYYY` corrupts silently).
- Loading children before parents.
- Choosing user keys for a migration that will need reconciling.
- Referencing a source system owner that was never added to the `HRC_SOURCE_SYSTEM_OWNER` lookup.
- Leaving `PURGE_FUTURE_CHANGES` at its default on an update, and deleting the future-dated changes somebody made last week.
- Supplying a dated split on an assignment without the matching split on its work terms.
- Reading the error count instead of the distinct errors.
- Disabling the post-load processes for a migration and never running them at the end.
- Loading the whole file into production having never timed it.

## Sources

- Oracle, *HCM Integrations* — the "Data File Instructions and Delivery" chapter. https://docs.oracle.com/en/cloud/saas/human-resources/faihm/index.html
- Oracle, *HCM Data Loader* — "The SET Instruction". https://docs.oracle.com/en/cloud/saas/human-resources/fahdl/the-set-instruction.html
- Oracle, *HCM Data Loader* — "HCM Data Loader Best Practices". https://docs.oracle.com/en/cloud/saas/human-resources/fahdl/hcm-data-loader-best-practices.html
- Oracle tutorial, "Making Date-Effective Changes with HCM Data Loader". https://docs.oracle.com/en/cloud/saas/human-resources/tutorial-hdl-date-effective-updates/index.html
- Oracle, *HCM Data Loader* — "Preparing to Use HCM Data Loader", for the import and load parameters and their defaults. https://docs.oracle.com/en/cloud/saas/human-resources/fahdl/preparing-to-use-hcm-data-loader.html
- Oracle tutorial, "Create and Maintain Data with HCM Data Loader". https://docs.oracle.com/en/cloud/saas/tutorial-hdl-load-files/
- Oracle tutorial, "Using the HCM Data Loader REST API". https://docs.oracle.com/en/cloud/saas/human-resources/tutorial-hdl-rest/index.html
- HCM Tables, "HCM Data Loader (HDL) Complete Guide — .dat File Format, Templates & Troubleshooting". https://hcm-tables.com/blog/hdl-data-loader-guide
