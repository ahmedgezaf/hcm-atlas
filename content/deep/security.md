---
id: security
minutes: 30
---

Security determines who can see and do what. A consultant needs conceptual fluency rather than deep architecture skill, but the vocabulary appears in almost every requirements workshop, and one distinction carries most of it: function versus data scope. The second half of this chapter is the part that earns its keep on a live project — how a role actually reaches a user, and what to check when someone opens a page and finds it empty.

## Two questions, never one

Every security requirement is two questions wearing one sentence.

"The HR team in Egypt should be able to manage their people" contains *what may they do* — hire, terminate, change salary, run payroll — and *whose records* — the people in the Egyptian legal employer. The product answers those with two different mechanisms, and almost every confusion in this area comes from answering one when the question was the other.

The habit worth building is to split every requirement into those two halves on the whiteboard, out loud, before touching the Security Console. Clients do not naturally express them separately, and a requirement written down as one sentence will be built as one thing.

## Role types

Oracle's documentation defines five role types.

A **job role** represents the specific job a worker does in the enterprise — Human Resource Analyst, Payroll Manager — and is the most-discussed role type in requirements sessions.

An **abstract role** represents a worker's role independently of any job: the predefined Employee, Contingent Worker and Line Manager roles, which grant baseline self-service access to everyone in the system. They are what light up Me and My Team for an ordinary user (Chapter 22).

A **duty role** is a logical grouping of function privileges — the granular building block from which job and abstract roles are composed; duty roles are never assigned directly to users.

An **aggregate privilege** combines a task's function privilege with its data-security policy, and is predefined and non-editable. These are the smallest sensible unit, and because they cannot be edited they are also the stable part of the hierarchy.

And a **data role** combines a job role with the security profiles that scope it, which is the subject of the next few sections.

## Function security underneath

Below the roles sit **privileges** — the permission to invoke a particular action or open a particular page. Roles inherit other roles, which inherit aggregate privileges, which carry privileges. A user's effective access is the union of everything reachable from the roles they hold.

Two consequences are worth holding. The hierarchy is usually several levels deep, which is why "why can this user do that" is not answerable by looking at the role's name — it needs the hierarchy view described below. And because access is a union, removing a privilege from one role does not remove it from a user who also holds another role that grants it, which is the usual reason a restriction "did not work".

## Data scope: security profiles

Where a job role says what a user can do, a **security profile** says which records they can do it to. Profiles scope data by person, organization, position, legislative data group, payroll and other criteria.

A **data role** combines a job role with the security profiles that define its scope — Oracle's example is "Country Human Resource Specialist": the HR specialist job plus a country's data. An HR specialist in Egypt and one in Saudi Arabia hold the same job role and see the same screens; their security profiles differ, so neither sees the other country's records. Same function, different scope.

[[fig:function-vs-data]]

For roles that everybody holds — the abstract roles — the scope is not per person, so the profiles are attached to the role itself rather than through a separate data role. That is why Employee and Line Manager work out of the box: each carries a scope that resolves relative to whoever is signed in.

## Managed person versus public person

A distinction that explains a lot of apparently odd behaviour, and that consultants frequently meet without a name for it.

A **managed person** profile defines whose records a user can *act on* — view in full, update, transact against. A **public person** profile defines whose basic details a user can see in the sense that a directory is public: name, work contact details, position in the organisation.

They are deliberately different sizes. An HR representative for one plant manages a few hundred people and can look up anybody in the company in the directory. Without the second profile, the directory is empty and the client reports that search is broken.

The practical rule: when a requirement says "they should be able to find anyone but only change their own group", that is two profiles, not one, and forgetting the public one is a far more common error than getting the managed one wrong.

## One profile per object type

A data role can carry one profile of each object type — an organization profile, a managed person profile, a public person profile, and so on for the other secured objects. Only one per object type.

That constraint shapes design more than it first appears. A requirement that an HR representative should cover "the Alexandria plant and also the three people in the Cairo liaison office" cannot be met by attaching two organization profiles; it needs one profile that covers both, or a different scoping mechanism. The usual answers are a profile built on a tree node that contains both, a profile with custom criteria, or an area of responsibility.

## The ways a profile can be scoped

A person security profile is built by choosing what it is secured by, and the options are the vocabulary of most security design conversations.

By **manager hierarchy** — the people reporting to the signed-in user, directly or down the chain. The predefined profile that covers the line manager hierarchy is what makes My Team work.

By **area of responsibility** — the population a user has been made responsible for, described below.

By **workforce structure** — legal employer, business unit, department, position, and the trees over them (Chapter 1). This is the ordinary route for "HR for the manufacturing division".

By **custom criteria** — a SQL predicate, for the cases the delivered options do not cover. It is powerful and it is the one to avoid where anything else will do: it is code inside a security object, it has to be maintained, and Oracle's own note is that where such a profile is delegated, the predicate itself has to handle the delegation logic. A custom criterion written by somebody who has left is the least pleasant object in this chapter.

And profiles can be composed from other profiles, which is how a scope is assembled from pieces rather than written once per combination.

## Areas of responsibility

An **area of responsibility (AOR)** assigns responsibility for a defined population — "this HR representative is responsible for the Alexandria plant" — and is used to drive both access and routing without building a custom role for every combination. It is increasingly the preferred mechanism for scoping HR representative access, and it is what stops a client with thirty departments acquiring thirty data roles that each have to be maintained separately.

The mechanism is worth understanding because it inverts where the information lives. Instead of the scope being written into a security profile, the profile says "secure by area of responsibility" with a responsibility *type* and a *scope* — for instance, the HR representative type scoped by legal employer. The actual population then comes from the responsibility records attached to each person, which HR maintains as ordinary data rather than as security configuration.

That is the whole argument for it. One role, one profile, and a data record per representative that an HR administrator can change without a security specialist. When a representative moves from the Alexandria plant to the Cairo office, somebody edits their responsibility; nothing in the security configuration changes.

The same responsibility records are also readable by approval routing (Chapter 19), which means "route this to the HR representative for that person's legal employer" becomes expressible without a hard-coded list of names.

[[lab:security]]

## How a role actually reaches a user

None of the above matters until a role is provisioned, and that happens in one of three ways. Knowing which one a client uses is the difference between a five-minute fix and an afternoon.

**Automatic provisioning** is the normal path. A **role provisioning rule** — held in a role mapping — maps a role to a condition on the worker's record: legal employer, business unit, job, grade, department, worker type, assignment status. A new hire in that population receives the role when the record is created and loses it when the condition stops being true. A rule is why the Employee abstract role appears on every hire without anyone doing anything.

**Manual provisioning** assigns a role to one named person. It is right for genuine exceptions and corrosive as a habit: manually assigned roles are invisible to the rules, survive transfers, and accumulate until an audit finds them.

**Role delegation** lets a user hand their access to someone else for a defined period — the HR manager covering for a colleague on leave. It is time-bound by design, which is the whole point of it.

## Role mappings and their three flags

A role mapping is the object that carries the conditions, and each role inside it has three independent flags that decide how it can be obtained. Knowing all three by name is a small thing that marks out somebody who has configured this.

**Autoprovision** means qualifying users acquire the role automatically. It is selected by default, which is the detail to remember: a role added to a mapping for the purpose of making it requestable will also be given to everybody who qualifies unless the flag is deselected.

**Requestable** means qualifying users can provision the role *to other users* — the mechanism behind a manager being able to grant something to their team.

**Self-requestable** means qualifying users can request the role *for themselves*, which is how a client offers an opt-in access without an administrator in the loop.

The same mapping can carry several roles with different flags, which is how one set of conditions serves several purposes.

## The processes underneath

Automatic provisioning happens as soon as a user is confirmed to satisfy a mapping's conditions, and an assignment-level change is enough to trigger the evaluation. The same process also *removes* automatically provisioned roles from users who no longer qualify, which is the mechanism behind access disappearing on termination (Chapter 8) — and the reason a late-entered termination leaves access live.

*Autoprovision Roles for All Users* re-evaluates every user against every mapping. It is the right thing to run after creating or editing a mapping, and after a bulk load that changed the attributes mappings test. It is also expensive, and Oracle's guidance is explicitly not to schedule it regularly — a point worth making to a client who wants it running nightly "just to be safe".

**LDAP synchronization** — *Retrieve Latest LDAP Changes* and *Send Pending LDAP Requests* — moves account and role changes between HCM and the identity store. A role that is configured correctly and still has not appeared is very often waiting on one of those two jobs.

## The Security Console

The **Security Console** is where roles are built, copied and inspected, and three things in it are worth knowing by name.

Copying a delivered role is the supported way to create a custom one, because Oracle's own roles must not be edited and an edit is overwritten by a quarterly update (Chapter 14). The copy offers a choice between copying the top role only — reusing the delivered roles beneath it — and copying the top role with everything it inherits. The first keeps the custom role riding along with Oracle's updates to the lower levels; the second freezes a complete snapshot that will not change and will not improve. The first is usually right, and knowing why is the point.

The role hierarchy view shows what a role actually contains, several levels down, which answers "why can this user do that?" without guessing.

And the simulation view shows what a named user can see and do, which is the fastest way to confirm a change before telling a client it is done.

## Designing a role catalogue

Security design goes wrong in a predictable way: it is done last, from a list of complaints, one role at a time. The alternative is to design it from personas (Chapter 22), early.

List the kinds of user: employee, line manager, HR representative, HR specialist, payroll administrator, payroll manager, compensation analyst, auditor, systems administrator. For each one, write the two halves — what they do, and whose records. Then look for the scope patterns rather than the people: how many distinct *scopes* are there, really? Usually far fewer than the number of job titles, which is the insight that keeps a catalogue small.

Two principles keep it maintainable. Prefer one role with a data-driven scope — an area of responsibility — over many roles with hard-coded scopes. And separate duties where the client's own controls require it: the person who can change a bank account should not be the person who can approve a payment, and a client's auditors will eventually ask whether that is true in the system.

The deliverable at the end is a role catalogue: each role, who holds it, what it permits, how it is scoped, and how it is provisioned. That document is what makes an access review possible later, and almost nobody produces it unless the consultant does.

## When somebody cannot see what they should

This is the most common security ticket on a live system, and it has an order worth working through rather than jumping around in.

Start by separating the two questions. If the page does not open at all, it is a function problem: the user lacks the role, or the role lacks the privilege. If the page opens and is empty, it is a data problem, and the role is almost certainly fine.

For a data problem, check four things in this order. Does the user hold the data role or AOR you think they do — the data role, not the job role. Does its security profile actually cover that population: a profile scoped by department does not cover someone whose department changed last week. Is the underlying hierarchy true: a line manager sees nothing when the manager relationship on the assignment is missing, which is a data error wearing a security costume. And has LDAP synchronization run since the change.

Nine times out of ten the answer is in that list, and all four are things a functional consultant can check without a technical colleague — which is exactly why the chapter is worth knowing at this depth.

Two refinements for the cases that survive the list. If the user can see *some* of the population but not all, the profile is right and its criteria are too narrow — compare a visible record against an invisible one and the difference will be the criterion. And if the user can find somebody in search but not open them, that is the managed-versus-public distinction: the public profile covers them, the managed one does not.

## Testing and auditing security

Security is the area most likely to be declared finished without being tested, because the person testing it is usually an administrator who can see everything.

Test it as the user. Use the simulation view for a quick confirmation, and for anything important, have a real representative of that audience open the real page. A security model signed off by the project team and never exercised by a line manager will be exercised by line managers on day one of go-live.

Test the negative case too. "The Egypt HR representative can see Egyptian employees" is half a test; the other half is "and cannot see Saudi employees", and that half is the one an auditor will ask about.

And plan for the periodic review. Who holds what drifts — manual provisioning, delegations that outlive their reason, people who moved. An access review is a standing obligation in most clients' own control frameworks, and it is far easier if the role catalogue exists and if manual provisioning has been kept rare.

## Common mistakes

- Answering a data-visibility question with a job role.
- Writing a requirement down as one sentence and building it as one thing.
- Assigning duty roles to users. They are components, not assignments.
- Forgetting the public person profile, and reporting that directory search is broken.
- Trying to attach two profiles of the same object type to one data role.
- Reaching for custom criteria where a tree node or an area of responsibility would do.
- Building one custom role per department when an AOR would do.
- Adding a role to a mapping to make it requestable, and giving it to everybody because autoprovision was left on.
- Scheduling Autoprovision Roles for All Users nightly.
- Editing a delivered role instead of copying it, and losing the change in a quarterly update.
- Copying a delivered role with everything beneath it, and freezing a snapshot that never improves.
- Provisioning roles by hand until nobody can say why a user holds what they hold.
- Expecting a removed privilege to take effect when another role still grants it.
- Reporting a security change as done before LDAP synchronization has run.
- Testing security only as an administrator, and only in the positive direction.
- Finishing an implementation with no role catalogue, so no access review is possible.

## Sources

- Oracle, *Securing HCM* — the role types, security profiles, data roles and the role-provisioning chapters. https://docs.oracle.com/en/cloud/saas/human-resources/ochus/index.html
- Oracle, *Securing HCM* — "Create a Role Mapping", for the autoprovision, requestable and self-requestable options and the default. https://docs.oracle.com/en/cloud/saas/human-resources/ochus/create-a-role-mapping.html
- Oracle, *Securing HCM* — "Autoprovisioning", for what triggers it, what it removes, and the guidance on the Autoprovision Roles for All Users process. https://docs.oracle.com/en/cloud/saas/human-resources/ochus/autoprovisioning.html
- Oracle, *Securing HCM* — "HCM Data Roles and Security Profiles", for securing by area of responsibility, the one-profile-per-object-type rule and custom criteria. https://docs.oracle.com/en/cloud/saas/human-resources/ochus/index.html
- Oracle, *Securing HCM* — "Best Practices for User and Role Provisioning in HCM". https://docs.oracle.com/en/cloud/saas/human-resources/ochus/best-practices-for-user-and-role-provisioning-in-hcm.html
- Oracle, *Securing HCM Questions and Answers* — "Which are the role types in HCM Cloud?". https://docs.oracle.com/en/cloud/saas/human-resources/faqas/which-are-the-role-types-in-hcm-cloud.html
- Oracle, *Using Common Features for HCM* — the Security Console, copying a delivered role, and the simulation view. https://docs.oracle.com/en/cloud/saas/human-resources/faucf/index.html
