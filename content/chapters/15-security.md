---
id: security
num: 15
domain: hcm
track: technical
title: The Security Model
subtitle: What you can do versus whose data you can see
hue: 300
minutes: 6
labs: security
terms: job-role, abstract-role, duty-role, data-role-and-security-profile, area-of-responsibility-aor
---

Security determines who can see and do what. A consultant needs conceptual fluency rather than deep architecture skill, but the vocabulary appears in almost every requirements workshop, and one distinction carries most of it: function versus data scope.

## Role types

Oracle's documentation defines five role types. A **job role** represents the specific job a worker does in the enterprise — Human Resource Analyst, Payroll Manager — and is the most-discussed role type in requirements sessions. An **abstract role** represents a worker's role independently of any job: the predefined Employee, Contingent Worker and Line Manager roles, which grant baseline self-service access to everyone in the system. A **duty role** is a logical grouping of function privileges — the granular building block from which job and abstract roles are composed; duty roles are never assigned directly to users. Aggregate privileges combine a task's function privilege with its data-security policy and are predefined and non-editable.

## Data scope: security profiles and data roles

Where a job role says what a user can do, a **security profile** says which records they can do it to. Profiles scope data by person, organization, position, legislative data group, payroll and other criteria. A **data role** combines a job role with the security profiles that define its scope — Oracle's example is "Country Human Resource Specialist": the HR specialist job plus a country's data. An HR specialist in Egypt and one in Saudi Arabia hold the same job role and see the same screens; their security profiles differ, so neither sees the other country's records. Same function, different scope.

## Areas of responsibility

An **area of responsibility (AOR)** assigns responsibility for a defined population — "this HR representative is responsible for the Alexandria plant" — and is used to drive both access and routing without building a custom role for every combination. It is increasingly the preferred mechanism for scoping HR representative access.

[[lab:security]]

## Common mistakes

- Answering a data-visibility question with a job role.
- Assigning duty roles to users. They are components, not assignments.
- Building one custom role per department when an AOR would do.

## Sources

- Oracle, *Securing HCM* — "Which are the role types in HCM Cloud?". https://docs.oracle.com/en/cloud/saas/human-resources/faqas/which-are-the-role-types-in-hcm-cloud.html
- Oracle, *Securing HCM* — the "HCM Data Roles and Security Profiles" chapter. https://docs.oracle.com/en/cloud/saas/human-resources/ochus/index.html
