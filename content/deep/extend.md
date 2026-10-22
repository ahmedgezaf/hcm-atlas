---
id: extend
minutes: 32
---

Every client needs a field Oracle did not ship, an option Oracle did not put in a dropdown, and a screen that behaves slightly differently for one group of users. In a SaaS product none of that can be done by changing code. Oracle's answer is a set of configuration tools that survive upgrades, and the correct response to most "can you add…" requests is one of them — said with the name of the tool, which is what separates a consultant from a note-taker.

There is a second, less obvious reason to know this chapter well. The tools form a ladder, and where a request lands on that ladder determines what it costs — not just to build, but to own, forever, through four updates a year. A consultant who reaches for the right rung saves the client more money than one who builds the thing quickly on the wrong one.

## Descriptive flexfields, and the two cousins

A **descriptive flexfield (DFF)** is a configurable extra field added to a standard object without customization: an equipment number, a badge colour, a union membership number. Because it is configuration rather than code, it survives every quarterly update.

An **extensible flexfield (EFF)** holds more than one row of extra data against a record — several certifications against one worker, say — where a DFF holds a single set of values. And a **key flexfield (KFF)** is the structure of a code made of segments, the cost allocation key used by payroll costing (Chapter 5) being the one a functional consultant meets.

The question that picks between them is how many of the thing there can be. One value per record is a DFF; many is an EFF; a structured code whose segments mean something to Finance is a KFF.

## How a DFF is actually put together

Three pieces, and knowing them makes the configuration screen legible.

A **segment** is one field. A DFF can have several, and they come in two kinds: **global** segments, which appear for every record, and **context-sensitive** segments, which appear only when a particular context value is selected. The context is itself a segment, which is how one flexfield serves several populations — a context of "Company Car" revealing registration and model, a context of "Union Member" revealing a membership number, on the same underlying flexfield.

Each segment has properties that do the quiet work: whether a value is required, whether it is read-only, whether it is displayed at all, and the order it appears in. These are the difference between an extra field and a controlled one.

And a segment is validated by a **value set**, which is the next section.

The step that catches people: a flexfield is configured and then **deployed**, and until it is deployed it does not appear. A consultant who has configured a flexfield, cannot see it, and starts re-checking the configuration has usually just not deployed it. The same is true after a change.

## Value sets, properly

A **value set** constrains what a flexfield segment can accept — free-text fields become dirty data, so value sets enforce validity and are used together with DFFs to control input.

There are five kinds and they are worth knowing apart.

An **independent** value set is a list of values maintained in the application — the ordinary dropdown.

A **table** value set draws its values from a query against application data, which is how a segment offers a list that is already maintained somewhere else rather than a copy of it.

A **dependent** value set narrows its options according to another segment's value — country, then city — and it has to name the independent set it depends on.

A **subset** value set is a restricted slice of an independent one, which is how two populations share a list and see different parts of it. It too names the independent set behind it.

And a **format-only** value set validates shape rather than membership: a number within a range, a date, text of a certain length. This is the one to reach for when the data is genuinely free but should not be arbitrary.

Two constraints are worth carrying. The value set behind a *context* segment has to be independent or table-validated, because the context is what drives everything else. And where a table-validated set is used for a context, its query cannot reference other segments, which rules out some clever ideas before they are attempted.

The design advice is simple: free text is the last resort, not the default. A flexfield with a format-only value set that at least enforces a shape is better than a text box, and an independent value set that enforces a list is better again. The cost of the difference is ten minutes at build time and a reporting capability forever — a controlled value can be grouped and counted; a typed one cannot.

## Lookups

**Lookup types** and **lookup codes** are configurable lists of values powering dropdowns across the application: contract types, reasons for leaving, nationality lists. They are usually the right answer to "can we add an option to this dropdown?"

Lookups have an access level — user, extensible or system — which decides how much of a delivered list may be changed. A client can add their own leaving reasons to an extensible lookup; they cannot remove Oracle's, and the attempt to tidy a delivered list is a reliable way to spend an afternoon. A system lookup cannot be touched at all, and a user lookup is fully the client's.

Lookups are also the quiet backbone of reporting: a leaving reason that exists as a code can be grouped and counted, where the same reason typed into a comment cannot.

Two practical notes. Where a delivered code cannot be removed but should not be offered, the usual approach is to end-date or disable it rather than to fight the access level. And lookup codes carry a meaning and a description as well as a code, so the code can be stable and technical while the meaning is what the user reads — which means a label can be changed later without invalidating every record that used it.

## The three-thought habit

When a client says "we need an extra field for X", the first three thoughts should be: DFF (where does the data live), lookup (should it be a controlled list), and approvals (what should the workflow do about it). Saying that sequence aloud in a workshop or interview is a strong signal. For example: recording which company car each manager has is a DFF on the assignment with a value set; a new resignation reason called "Further Study" is a lookup code; hiding the grade field on the transfer form for non-managers is a page-level change made in a sandbox.

A fourth thought is worth adding once the first three are habit: **where does this need to come out?** A flexfield that nobody can report on is a field that will be filled in for two years and never used. Flexfield segments generate database items for formulas (Chapter 12), are available to extracts and data models (Chapter 13), and can be loaded in bulk (Chapter 11) — but only if somebody checks, at design time, that the specific one is reachable from the specific place it is needed.

[[fig:extension-ladder]]

## The design studio: changing what a page asks for

The tool most often missing from a junior's vocabulary is the **HCM Experience Design Studio**, and it answers the most common request of all: not "add a field" but "stop asking for this one".

**Transaction Design Studio** controls, per transaction and per role, which fields and sections appear — hiding salary on a transfer for line managers, making a reason mandatory on termination, showing a region-specific section only to the people who need it. It is configuration, it survives updates, and it is where a surprising share of "the screen is confusing" feedback from user acceptance testing is resolved.

The shape of a rule is worth knowing. A rule names the transaction it applies to, the audience it applies to — typically by role, and often narrowed further by the part of the organisation — and then, field by field and section by section, whether the item is shown, whether it is required and whether it can be edited. Several rules can exist for one transaction, which means order and specificity matter, and a client who ends up with a dozen rules on the hire flow has a maintenance problem rather than a configured one.

Two pieces of advice follow from experience rather than documentation. Use it to *reduce* far more often than to *require*: the common complaint is that a page asks for twenty things when six are needed, and removing fourteen is both the quickest win in the whole product and the most appreciated. And keep a written record of which rules exist and why, because a hidden field is invisible by definition and the next consultant will spend an hour looking for it.

**Autocomplete rules** sit beside it and handle defaulting and validation without a formula: default the business unit from the legal employer, block a hire date more than a year ahead, derive one field from another as the user types. They cover the ground that used to need a technical change, which makes them worth knowing by name even before knowing how to write one.

The judgement to apply with them is restraint. A validation that prevents a genuine error is valuable; one that encodes a policy somebody might legitimately override is a support ticket generator. The test is whether there is any circumstance in which the blocked thing is correct — and if there is, the rule should warn rather than block, or the exception needs a route.

**Alerts Composer** is the third member of the family: configurable notifications on events — a contract approaching expiry, a probation ending, a document expiring — which is how the UAE's contract-expiry requirement in Chapter 18 and Egyptian document tracking are met without building anything.

Alerts are cheap to create and easy to over-create. An alert that fires for everything is an alert everybody filters into a folder, after which none of them work. The discipline is to ask, for each one, who acts on it and what they do — and if there is no answer, it is a report, not an alert.

## Sandboxes and publishing

A **sandbox** is an isolated workspace for making and testing configuration changes — page layouts, flexfields, design studio rules — before publishing them to the live environment. Publishing a sandbox is the moment a change becomes real for every user: a controlled, deliberate step, not an autosave.

Two habits keep sandboxes from becoming a problem. Keep them short-lived and single-purpose, because two sandboxes that touch the same page will conflict and the second publish wins in ways nobody intended. And publish in the order the changes depend on each other: a design studio rule that references a flexfield needs the flexfield published first, or it quietly refers to nothing.

Two more, for a team rather than an individual. Name sandboxes so that the owner and the purpose are obvious, because an abandoned sandbox called "test2" is one nobody dares publish or delete. And test *inside* the sandbox before publishing — that is what it is for, and the number of teams who publish in order to test is larger than it should be.

## Journeys

A **journey** is a configurable checklist of tasks assigned to a person around an event — onboarding, transfer, offboarding — covering the many small tasks across several people that otherwise get missed: equipment, badge, policy acknowledgements, document uploads. It is a visible, client-pleasing feature and a good thing to demonstrate.

It is also the correct home for everything in this atlas that happens *outside* the system. The Egyptian social-insurance Form 1 on hire and Form 6 on exit (Chapter 9), the labour-office steps around a resignation (Chapter 8), the Gulf visa and permit tasks (Chapters 17 and 18) — none of those are Oracle transactions, and all of them are tasks with an owner, a due date and a document. A journey makes them visible and trackable without pretending the system performs them.

That reframing is worth offering to clients explicitly, because it changes what they expect. The system does not file the form. The system makes sure somebody does, on time, and records that they did.

## Redwood, and the tier above configuration

**Redwood** is Oracle's current user-experience design system, progressively replacing older pages; a large and growing share of new capability, including Oracle's AI features, is built on it. Recognition-level awareness is enough, but describing the product only in terms of the classic interface sounds a release behind. What matters practically is that a Redwood page and a classic page are not configured the same way, so "can you hide that field?" has two different answers depending on which one the client is looking at.

Beyond the configuration tools there is a development tier for extending Redwood pages, and the thing a functional consultant needs is the judgement about when to cross into it rather than the skill to do it. Crossing that line turns a configuration item into a development item: it needs a developer, a source-controlled artefact, a test cycle and an owner through every quarterly update. That is sometimes exactly right, and it should always be a decision somebody made on purpose.

## The quarterly cycle

Fusion applications update on a fixed **quarterly cycle**, named by year and letter — 26A, 26B, 26C, 26D. Updates are mandatory and scheduled; each brings features that are enabled by default or require opt-in, and regression testing around updates is a standing client obligation. The readiness material Oracle publishes before each release is the input to that testing, and the work is to read it for the features that touch what you built rather than all of it. Handling a quarterly update well after go-live is where consultants build reputations.

The routine that makes it manageable, and that a consultant should hand over at the end of an implementation:

Read the readiness material when it is published, filtering for the modules in use. Separate the features that are on by default — which will change behaviour whether anybody acts or not — from the opt-ins, which are an opportunity rather than a risk. The update lands in the non-production environment first, which is the window for testing. Run a regression pack over the things that matter most: a payroll run, a hire, a termination, the reports people actually use, and anything built with the tools in this chapter. Then look at the opt-ins deliberately, once a quarter, as a small improvement cycle rather than as a backlog.

A client who does this has four small events a year. A client who does not has four surprises.

## Where the line actually is

Three words get used interchangeably in workshops and mean different things to a project. **Configuration** is setup the product expects — plans, elements, roles, flexfields, design studio rules — and it is the answer to most requests. **Extension** is building something new within the supported tools: a Fast Formula, a BI Publisher report, an integration. **Customization**, in the on-premise sense of changing delivered code, does not exist here at all.

The useful sentence in a workshop is that nothing is impossible and everything has an owner: a configuration change costs a conversation, an extension costs design, testing and someone to maintain it through quarterly updates, and the third option is not available. Saying that early is what prevents a client hearing "no" and a project hearing "yes" to the same request.

The ladder, from cheapest to most expensive to own: change a lookup; add or hide a field with a flexfield or the design studio; add a rule with an autocomplete rule or an alert; write a formula; build a report or an extract; build an integration; extend a page with development tooling. The instruction is to start at the top of that list for every request and stop at the first rung that genuinely meets it — and to notice when a request has been pushed two rungs down because the first answer was easier to build than to design.

## Common mistakes

- Promising a "customization". In SaaS, it is configuration, an extension, or a conversation about scope.
- Adding a free-text field without a value set.
- Configuring a flexfield and not deploying it, then debugging the configuration.
- Using a dependent or subset value set without the independent set it has to name.
- Reaching for a flexfield when the request was really "stop showing me this field" — that is the design studio.
- Adding a field nobody checked was reachable from the report, formula or load that needs it.
- Trying to delete Oracle's delivered lookup codes instead of adding your own.
- Accumulating a dozen design studio rules on one transaction with no record of why.
- Writing a validation that blocks a case that is sometimes legitimate.
- Creating alerts nobody acts on, until all of them are ignored.
- Letting a sandbox live for weeks, then publishing it over someone else's work.
- Publishing in order to test, rather than testing in the sandbox.
- Publishing a design studio rule before the flexfield it refers to.
- Treating a quarterly update as an IT event with no functional testing attached.
- Crossing into the development tier without anybody deciding to.

## Sources

- Oracle, *Configuring and Extending Applications* — "Considerations for Managing Descriptive Flexfields", for segments, contexts and the value set types. https://docs.oracle.com/en/cloud/saas/applications-common/26a/oaext/considerations-for-managing-descriptive-flexfields.html
- Oracle, *Configuring and Extending Applications* — flexfields, value sets, lookups and sandboxes. https://docs.oracle.com/en/cloud/saas/applications-common/
- Oracle, *Implementing Global Human Resources* — journeys, and the HCM Experience Design Studio. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
- Oracle, *Using Common Features for HCM* — Alerts Composer and the common configuration tools. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/index.html
- Oracle Cloud Applications readiness site — quarterly update naming, new features and opt-in behaviour. https://www.oracle.com/readiness/
