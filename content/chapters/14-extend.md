---
id: extend
num: 14
domain: hcm
track: technical
title: Extending Without Customizing
subtitle: Flexfields, lookups, design studio, sandboxes — the answer to "can you add a field?"
hue: 262
minutes: 12
labs: 
terms: dff-descriptive-flexfield, lookup-type-and-lookup-code, value-set, sandbox, journey, redwood, quarterly-update-26a-26d, transaction-design-studio, autocomplete-rule, alerts-composer
---

Every client needs a field Oracle did not ship, an option Oracle did not put in a dropdown, and a screen that behaves slightly differently for one group of users. In a SaaS product none of that can be done by changing code. Oracle's answer is a set of configuration tools that survive upgrades, and the correct response to most "can you add…" requests is one of them — said with the name of the tool, which is what separates a consultant from a note-taker.

## Descriptive flexfields, and the two cousins

A **descriptive flexfield (DFF)** is a configurable extra field added to a standard object without customization: an equipment number, a badge colour, a union membership number. Because it is configuration rather than code, it survives every quarterly update. A **value set** constrains what a flexfield segment can accept — free-text fields become dirty data, so value sets enforce validity and are used together with DFFs to control input.

Two relatives come up often enough to recognise. An **extensible flexfield (EFF)** holds more than one row of extra data against a record — several certifications against one worker, say — where a DFF holds a single set of values. And a **key flexfield (KFF)** is the structure of a code made of segments, the cost allocation key used by payroll costing (Chapter 5) being the one a functional consultant meets.

The question that picks between them is how many of the thing there can be. One value per record is a DFF; many is an EFF; a structured code whose segments mean something to Finance is a KFF.

## Lookups

**Lookup types** and **lookup codes** are configurable lists of values powering dropdowns across the application: contract types, reasons for leaving, nationality lists. They are usually the right answer to "can we add an option to this dropdown?"

Lookups have an access level — user, extensible or system — which decides how much of a delivered list may be changed. A client can add their own leaving reasons to an extensible lookup; they cannot remove Oracle's, and the attempt to tidy a delivered list is a reliable way to spend an afternoon. Lookups are also the quiet backbone of reporting: a leaving reason that exists as a code can be grouped and counted, where the same reason typed into a comment cannot.

## The three-thought habit

When a client says "we need an extra field for X", the first three thoughts should be: DFF (where does the data live), lookup (should it be a controlled list), and approvals (what should the workflow do about it). Saying that sequence aloud in a workshop or interview is a strong signal. For example: recording which company car each manager has is a DFF on the assignment with a value set; a new resignation reason called "Further Study" is a lookup code; hiding the grade field on the transfer form for non-managers is a page-level change made in a sandbox.

[[fig:extension-ladder]]

## The design studio: changing what a page asks for

The tool most often missing from a junior's vocabulary is the **HCM Experience Design Studio**, and it answers the most common request of all: not "add a field" but "stop asking for this one".

**Transaction Design Studio** controls, per transaction and per role, which fields and sections appear — hiding salary on a transfer for line managers, making a reason mandatory on termination, showing a region-specific section only to the people who need it. It is configuration, it survives updates, and it is where a surprising share of "the screen is confusing" feedback from user acceptance testing is resolved.

**Autocomplete rules** sit beside it and handle defaulting and validation without a formula: default the business unit from the legal employer, block a hire date more than a year ahead, derive one field from another as the user types. They cover the ground that used to need a technical change, which makes them worth knowing by name even before knowing how to write one.

**Alerts Composer** is the third member of the family: configurable notifications on events — a contract approaching expiry, a probation ending, a document expiring — which is how the UAE's contract-expiry requirement in Chapter 18 and Egyptian document tracking are met without building anything.

## Sandboxes and publishing

A **sandbox** is an isolated workspace for making and testing configuration changes — page layouts, flexfields, design studio rules — before publishing them to the live environment. Publishing a sandbox is the moment a change becomes real for every user: a controlled, deliberate step, not an autosave.

Two habits keep sandboxes from becoming a problem. Keep them short-lived and single-purpose, because two sandboxes that touch the same page will conflict and the second publish wins in ways nobody intended. And publish in the order the changes depend on each other: a design studio rule that references a flexfield needs the flexfield published first, or it quietly refers to nothing.

## Journeys, Redwood and the quarterly cycle

A **journey** is a configurable checklist of tasks assigned to a person around an event — onboarding, transfer, offboarding — covering the many small tasks across several people that otherwise get missed: equipment, badge, policy acknowledgements, document uploads. It is a visible, client-pleasing feature and a good thing to demonstrate.

**Redwood** is Oracle's current user-experience design system, progressively replacing older pages; a large and growing share of new capability, including Oracle's AI features, is built on it. Recognition-level awareness is enough, but describing the product only in terms of the classic interface sounds a release behind. What matters practically is that a Redwood page and a classic page are not configured the same way, so "can you hide that field?" has two different answers depending on which one the client is looking at.

Fusion applications update on a fixed **quarterly cycle**, named by year and letter — 26A, 26B, 26C, 26D. Updates are mandatory and scheduled; each brings features that are enabled by default or require opt-in, and regression testing around updates is a standing client obligation. The readiness material Oracle publishes before each release is the input to that testing, and the work is to read it for the features that touch what you built rather than all of it. Handling a quarterly update well after go-live is where consultants build reputations.

## Where the line actually is

Three words get used interchangeably in workshops and mean different things to a project. **Configuration** is setup the product expects — plans, elements, roles, flexfields, design studio rules — and it is the answer to most requests. **Extension** is building something new within the supported tools: a Fast Formula, a BI Publisher report, an integration. **Customization**, in the on-premise sense of changing delivered code, does not exist here at all.

The useful sentence in a workshop is that nothing is impossible and everything has an owner: a configuration change costs a conversation, an extension costs design, testing and someone to maintain it through quarterly updates, and the third option is not available. Saying that early is what prevents a client hearing "no" and a project hearing "yes" to the same request.

## Common mistakes

- Promising a "customization". In SaaS, it is configuration, an extension, or a conversation about scope.
- Adding a free-text field without a value set.
- Reaching for a flexfield when the request was really "stop showing me this field" — that is the design studio.
- Trying to delete Oracle's delivered lookup codes instead of adding your own.
- Letting a sandbox live for weeks, then publishing it over someone else's work.
- Publishing a design studio rule before the flexfield it refers to.
- Treating a quarterly update as an IT event with no functional testing attached.

## Sources

- Oracle, *Configuring and Extending Applications* — flexfields, value sets, lookups and sandboxes. https://docs.oracle.com/en/cloud/saas/applications-common/
- Oracle, *Implementing Global Human Resources* — journeys, and the HCM Experience Design Studio. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/index.html
- Oracle, *Using Common Features for HCM* — Alerts Composer and the common configuration tools. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/index.html
- Oracle Cloud Applications readiness site — quarterly update naming, new features and opt-in behaviour. https://www.oracle.com/readiness/
