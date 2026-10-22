---
id: security
num: 15
domain: hcm
track: technical
title: The Security Model
subtitle: What you can do versus whose data you can see
hue: 300
minutes: 11
labs: security
terms: job-role, abstract-role, duty-role, data-role-and-security-profile, area-of-responsibility-aor, role-provisioning-rule, security-console, ldap-synchronization
---

Security determines who can see and do what. A consultant needs conceptual fluency rather than deep architecture skill, but the vocabulary appears in almost every requirements workshop, and one distinction carries most of it: function versus data scope. The second half of this chapter is the part that earns its keep on a live project — how a role actually reaches a user, and what to check when someone opens a page and finds it empty.

## Role types

Oracle's documentation defines five role types. A **job role** represents the specific job a worker does in the enterprise — Human Resource Analyst, Payroll Manager — and is the most-discussed role type in requirements sessions. An **abstract role** represents a worker's role independently of any job: the predefined Employee, Contingent Worker and Line Manager roles, which grant baseline self-service access to everyone in the system. They are what light up Me and My Team for an ordinary user (Chapter 22). A **duty role** is a logical grouping of function privileges — the granular building block from which job and abstract roles are composed; duty roles are never assigned directly to users. Aggregate privileges combine a task's function privilege with its data-security policy and are predefined and non-editable.

## Data scope: security profiles and data roles

Where a job role says what a user can do, a **security profile** says which records they can do it to. Profiles scope data by person, organization, position, legislative data group, payroll and other criteria. A **data role** combines a job role with the security profiles that define its scope — Oracle's example is "Country Human Resource Specialist": the HR specialist job plus a country's data. An HR specialist in Egypt and one in Saudi Arabia hold the same job role and see the same screens; their security profiles differ, so neither sees the other country's records. Same function, different scope.

[[fig:function-vs-data]]

## Areas of responsibility

An **area of responsibility (AOR)** assigns responsibility for a defined population — "this HR representative is responsible for the Alexandria plant" — and is used to drive both access and routing without building a custom role for every combination. It is increasingly the preferred mechanism for scoping HR representative access, and it is what stops a client with thirty departments acquiring thirty data roles that each have to be maintained separately.

[[lab:security]]

## How a role actually reaches a user

None of the above matters until a role is provisioned, and that happens in one of three ways. Knowing which one a client uses is the difference between a five-minute fix and an afternoon.

**Automatic provisioning** is the normal path. A **role provisioning rule** maps a role to a condition on the worker's record — legal employer, business unit, job, grade, department, worker type, assignment status — so a new hire in that population receives the role when the record is created and loses it when the condition stops being true. A rule is why the Employee abstract role appears on every hire without anyone doing anything.

**Manual provisioning** assigns a role to one named person. It is right for genuine exceptions and corrosive as a habit: manually assigned roles are invisible to the rules, survive transfers, and accumulate until an audit finds them.

**Role delegation** lets a user hand their access to someone else for a defined period — the HR manager covering for a colleague on leave. It is time-bound by design, which is the whole point of it.

Two scheduled processes sit underneath all of this. *Autoprovision Roles for All Users* re-evaluates the rules across the population, which is what to run after changing a rule rather than waiting for each person's next transaction. And **LDAP synchronization** — *Retrieve Latest LDAP Changes* and *Send Pending LDAP Requests* — moves account and role changes between HCM and the identity store. A role that is configured correctly and still has not appeared is very often waiting on one of those two jobs.

## The Security Console

The **Security Console** is where roles are built, copied and inspected, and three things in it are worth knowing by name. Copying a delivered role is the supported way to create a custom one, because Oracle's own roles must not be edited and an edit is overwritten by a quarterly update (Chapter 14). The role hierarchy view shows what a role actually contains, several levels down, which answers "why can this user do that?" without guessing. And the simulation view shows what a named user can see and do, which is the fastest way to confirm a change before telling a client it is done.

## When somebody cannot see what they should

This is the most common security ticket on a live system, and it has an order worth working through rather than jumping around in.

Start by separating the two questions. If the page does not open at all, it is a function problem: the user lacks the role, or the role lacks the privilege. If the page opens and is empty, it is a data problem, and the role is almost certainly fine.

For a data problem, check four things in this order. Does the user hold the data role or AOR you think they do — the data role, not the job role. Does its security profile actually cover that population: a profile scoped by department does not cover someone whose department changed last week. Is the underlying hierarchy true: a line manager sees nothing when the manager relationship on the assignment is missing, which is a data error wearing a security costume. And has LDAP synchronization run since the change.

Nine times out of ten the answer is in that list, and all four are things a functional consultant can check without a technical colleague — which is exactly why the chapter is worth knowing at this depth.

## Common mistakes

- Answering a data-visibility question with a job role.
- Assigning duty roles to users. They are components, not assignments.
- Building one custom role per department when an AOR would do.
- Editing a delivered role instead of copying it, and losing the change in a quarterly update.
- Provisioning roles by hand until nobody can say why a user holds what they hold.
- Reporting a security change as done before LDAP synchronization has run.

## Sources

- Oracle, *Securing HCM* — the role types, security profiles, data roles and the role-provisioning chapters. https://docs.oracle.com/en/cloud/saas/human-resources/ochus/index.html
- Oracle, *Securing HCM Questions and Answers* — "Which are the role types in HCM Cloud?". https://docs.oracle.com/en/cloud/saas/human-resources/faqas/which-are-the-role-types-in-hcm-cloud.html
- Oracle, *Using Common Features for HCM* — the Security Console, copying a delivered role, and the simulation view. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/index.html
