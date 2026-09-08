---
id: extend
num: 14
track: technical
title: Extending Without Customizing
subtitle: Flexfields, lookups, value sets, sandboxes — the answer to "can you add a field?"
hue: 262
minutes: 6
labs: 
terms: dff-descriptive-flexfield, lookup-type-and-lookup-code, value-set, sandbox, journey, redwood, quarterly-update-26a-26d
---

Every client needs a field Oracle did not ship, an option Oracle did not put in a dropdown, and a screen that behaves slightly differently for one group of users. In a SaaS product none of that can be done by changing code. Oracle's answer is a set of configuration tools that survive upgrades, and the correct response to most "can you add…" requests is one of them.

## Descriptive flexfields

A **descriptive flexfield (DFF)** is a configurable extra field added to a standard object without customization: an equipment number, a badge colour, a union membership number. Because it is configuration rather than code, it survives every quarterly update. A **value set** constrains what a flexfield segment can accept — free-text fields become dirty data, so value sets enforce validity and are used together with DFFs to control input.

## Lookups

**Lookup types** and **lookup codes** are configurable lists of values powering dropdowns across the application: contract types, reasons for leaving, nationality lists. They are usually the right answer to "can we add an option to this dropdown?"

## The three-thought habit

When a client says "we need an extra field for X", the first three thoughts should be: DFF (where does the data live), lookup (should it be a controlled list), and approvals (what should the workflow do about it). Saying that sequence aloud in a workshop or interview is a strong signal. For example: recording which company car each manager has is a DFF on the assignment with a value set; a new resignation reason called "Further Study" is a lookup code; hiding the grade field on the transfer form for non-managers is a page-level change made in a sandbox.

[[fig:extension-ladder]]

## Sandboxes and publishing

A **sandbox** is an isolated workspace for making and testing configuration changes — page layouts, flexfields — before publishing them to the live environment. Publishing a sandbox is the moment a change becomes real for every user: a controlled, deliberate step, not an autosave.

## Journeys, Redwood and the quarterly cycle

A **journey** is a configurable checklist of tasks assigned to a person around an event — onboarding, transfer, offboarding — covering the many small tasks across several people that otherwise get missed: equipment, badge, policy acknowledgements, document uploads. It is a visible, client-pleasing feature and a good thing to demonstrate.

**Redwood** is Oracle's current user-experience design system, progressively replacing older pages; a large and growing share of new capability, including Oracle's AI features, is built on it. Recognition-level awareness is enough, but describing the product only in terms of the classic interface sounds a release behind.

Fusion applications update on a fixed **quarterly cycle**, named by year and letter — 26A, 26B, 26C, 26D. Updates are mandatory and scheduled; each brings features that are enabled by default or require opt-in, and regression testing around updates is a standing client obligation. Handling a quarterly update well after go-live is where consultants build reputations.

## Common mistakes

- Promising a "customization". In SaaS, it is a DFF, a lookup, or a page change.
- Adding a free-text field without a value set.
- Forgetting that nothing in a sandbox is real until it is published.

## Sources

- Oracle, *Configuring and Extending Applications* — flexfields, lookups, value sets, sandboxes. https://docs.oracle.com/en/cloud/saas/applications-common/
- Oracle, *Implementing Global Human Resources* — journeys. https://docs.oracle.com/en/cloud/saas/human-resources/faigh/
- Oracle Cloud Applications readiness site — quarterly update naming and opt-in features. https://www.oracle.com/readiness/
