---
id: ff
minutes: 32
---

Statutory rules vary too much across countries to hard-code, so Oracle exposes a rule layer. **Fast Formula** is a simple expression language for calculations, validations and rules, written in near-English rather than a full programming language. In payroll it computes rates and amounts; in absence it drives accrual rules; elsewhere it handles eligibility and defaulting. Because Oracle ships no maintained Egyptian localization, Egyptian social-insurance and tax calculations are built here — and it may be the functional consultant who writes them.

The language itself is small. What takes time is not the grammar but the surroundings: knowing which values are available where, what the formula is expected to hand back, and how to find out why a number is wrong when there is no debugger. This chapter covers the grammar quickly and the surroundings slowly, because that is the proportion in which they cause trouble.

## The four sections

Most formulas follow one shape: declare inputs, set defaults, run the logic, return a value. Oracle does not strictly enforce the order, but following it avoids errors.

```
INPUTS ARE BASIC_SALARY
DEFAULT FOR BASIC_SALARY IS 0
IF BASIC_SALARY > 35000 THEN
  SPECIAL_ALLOWANCE = 2500
ELSE
  SPECIAL_ALLOWANCE = 0
RETURN SPECIAL_ALLOWANCE
```

If a consultant can read this, they can read most delivered formulas.

## The language itself, in one page

Three data types: number, text and date. Variables are not declared — assigning to a name creates it — and a name's type is fixed by what is first assigned to it, which is why mixing a number and a text value into the same variable is a compile error rather than a coercion.

Control flow is `IF … THEN … ELSE`, with `ELSE IF` for a ladder, and `WHILE … LOOP` where iteration is genuinely needed, which in payroll is rarely. Conditions combine with `AND`, `OR` and `NOT`. Comments sit inside `/* */`.

`RETURN` ends the formula and hands back one or more named values. A formula can return several, and in payroll it usually does — the return list is how the element receives both an amount and whatever else the calculation decided.

There is a function library for the ordinary needs: rounding and truncation, greatest and least, conversions between the types, date arithmetic and text manipulation. The two worth knowing on sight are the ones that clamp a value, because a statutory floor and ceiling is exactly a greatest-and-least pair, and the rounding functions, because rounding policy is a client decision that someone has to implement consistently.

That is most of the language. What remains is where values come from and where results go.

## Where values come from

Values reach a formula three ways: as inputs passed at runtime, as database items read from the database, or as global values. Inputs are declared with `INPUTS ARE`, and the name must match the element input value exactly, with words joined by underscores. Database items are referenced by name, and the system supplies most of the ones needed. Oracle's own guidance is to prefer `INPUTS` over database items where possible, because inputs do not require a database read and therefore speed up the payroll run — a detail worth saying in an interview.

`DEFAULT FOR` is not optional decoration. A database item or an input that has no value at runtime makes the formula fail for that person, and the population it fails for is precisely the population with no entry that month — which is to say, the people whose payslips nobody is watching. Defaulting every input and every database item that could be empty is the single cheapest habit in this chapter.

## Static and dynamic database items

Database items come in two kinds and the distinction explains why some of them exist and others have to be created.

**Static** database items are predefined by Oracle — a person's date of birth, their work location, the start and end dates of the payroll period. They are there because the product knows about those things.

**Dynamic** database items are generated from definitions the implementation makes: elements, balances, absence types, grade rates, flexfield segments. Creating a balance creates database items for reading it; creating an element creates database items for its input values. This is why the answer to "how do I read the year-to-date insurable wage in a formula" is "create the balance, and the database item appears", rather than "write a query".

One behaviour is worth knowing because it surprises people. Where an element allows multiple entries, the database item for an entry value holds the **sum of all the entries**, including entries created as indirect results during the run itself. That is usually exactly what is wanted and occasionally not, and a formula that assumed it was reading one entry will be quietly wrong for the people who have two.

Finding the right database item is a practical skill rather than a conceptual one. The names follow conventions, the availability depends on the formula type, and the fastest route is to look at a delivered formula of the same type and see what it reads.

## Formula types and contexts

Every formula has a type that determines which inputs and contexts are available to it, and a formula written for one context will not work in another. This is why the language cannot be learned in the abstract: the same syntax behaves differently depending on where it runs. The practical approach is to read delivered formulas of the type being built and adapt them.

A **context** is a value the calling process supplies to the formula implicitly — the effective date, the payroll relationship, the assignment, the payroll, the legislative data group. Contexts are what let a database item resolve: reading a person's grade means nothing without knowing which person and as of when, and the context supplies both without the formula asking.

Two consequences follow. A database item is only available in formula types whose contexts can resolve it, which is the real reason a formula copied from one type to another fails to compile — not the syntax, but the missing context. And if a formula refers to a context that is not in its list, that is an error rather than an empty value, which is a good thing: it fails at compile rather than returning a wrong number.

The types a functional consultant meets most are the payroll calculation formulas, element input validation, absence accrual and entitlement formulas, rate conversion formulas, and the person-selection formulas used by extracts (Chapter 13). Each has its own available contexts and its own expectations about what is returned.

Statements worth recognizing on sight: `DEFAULT FOR` sets a fallback where a value could be null; `ALIAS` shortens an unwieldy database-item name; and formulas call other formulas with `SET_INPUT`, `EXECUTE` and `GET_OUTPUT`.

## Calling one formula from another

Factoring logic out matters more here than in most languages, because the alternative is copying a statutory rule into several places and then having to find all of them next January.

The pattern is three statements: set each input, execute the called formula, then get each output.

```
SET_INPUT('WAGE', GROSS_WAGE)
EXECUTE('EG_INSURABLE_WAGE')
INSURABLE = GET_OUTPUT('INSURABLE_WAGE', 0)
```

The second argument to `GET_OUTPUT` is the default where the called formula did not return that name, which is the same defaulting discipline as everywhere else in the language.

The case for using this is concrete. The Egyptian insurable wage — floor, ceiling, and the clamp between them — is needed by the employee contribution, the employer contribution, the sick-pay rate, the annual increment base and anything else that reads it. Written once and called five times, a change to the ceiling is one edit. Written five times, it is five edits and a fair chance of finding only four.

## A real rule, written out

The Egyptian employee social-insurance contribution (Chapter 9) makes a good first formula: take the wage as an input, cap it at the ceiling, floor it at the minimum, and return 11% of the result. The order matters — cap and floor first, then the rate.

[[lab:ff]]

[[lab:ff-run]]

## What a payroll formula hands back

A formula does not simply return a number into the void: in payroll it returns **formula results**, and the element's configuration says what each one is for.

A **direct result** becomes the element's own run result, or updates one of the element's own input values. An **indirect result** passes as an element entry to another nonrecurring element that has not yet been processed — which is how one calculation creates an entry on a second element without anybody keying it. An **order indirect** does the same with control over processing order. A **target indirect** directs the result at a named target. A **message** returns text to the run, and is the closest thing the language has to a debugger. A **stop** ends the element entry, which is how a loan deduction stops itself when the balance reaches zero.

The rule that ties them together: for every result type except a direct result and a message, the element configuration has to name the target element the result is passed to. A formula returning an indirect result with no target configured is a formula whose output goes nowhere, and the symptom is an element that simply does not appear.

The stop result is worth a sentence in an interview, because it is where a consultant stops describing syntax and starts describing behaviour: the formula that recovers a salary advance does not need anyone to remember to end it, provided the stop result was configured.

## Where the numbers that move belong

Statutory figures change — Egyptian insurable-wage limits every January, Saudi contribution rates on a published schedule — and a formula with those numbers typed into it is a time bomb with no alarm attached. **Global values** exist for exactly this: a named, dated value the formula reads, so January's change is a data change on a known date rather than an edit to logic that then needs retesting.

The same reasoning covers rates that differ by population. A formula that branches on legislation or on legal employer, reading a global value for each, stays one formula; one copied per country becomes five formulas that drift apart, and nobody can later say which is authoritative.

There is a second home for values worth knowing about: a user-defined table, which holds a set of values that can be looked up by a key and a date — a bracket ladder, a band table, a rate by grade. Where a rule is a *table* rather than a *number*, that is usually the better fit, because it can be read and maintained by someone who is not a developer. The Egyptian tax ladder is the obvious candidate: seven brackets, each with a boundary and a rate, every one of which could change by decree.

The design instinct to carry away is that a formula should contain **logic that rarely changes** and read **values that change often**. A formula edited every January is a formula that will eventually be edited wrongly.

## The bugs that compile

Fast Formula bugs divide into two kinds, and only one of them is cheap. A formula that does not compile — a misspelt input name, a name with a space in it where the element's input value has an underscore — is caught the moment it is saved, and costs an hour. A formula that compiles and returns the wrong number is caught by a person, if it is caught at all.

Four failures account for most of the second kind. Applying a rate before capping the wage, which inverts the whole point of a clamp. Returning the wrong variable, so the element pays something plausible and entirely wrong. Omitting a default on an input that is usually empty, so the formula errors for exactly the employees who have no entry that month. And hard-coding a statutory limit that changes every January, which under-deducts quietly until a statutory return is reconciled — limits belong in a dated global value, not in the formula text.

Three more are worth adding once a consultant is past the first few formulas. Reading a balance with the wrong dimension, which returns a real number for a different period or scope (Chapter 5). Assuming an entry-value database item holds one entry when the element allows several. And rounding at the wrong point — rounding each component and then summing produces a different total from summing and then rounding, and over a year and a population the difference is visible.

None of these announce themselves. The only reliable defence is a QuickPay against a real person, with the expected number worked out by hand first.

[[lab:ff-bugs]]

## Testing, without a debugger

There is no step-through debugger. What exists is a compile, a message result and a QuickPay, and a working routine out of those three.

Compile first: the compiler catches a misspelt input, an unbalanced condition, a name with a space in it. Then run a QuickPay against one real person whose expected answer has been worked out by hand, on paper, before the run. Compare. Where the number disagrees and the logic looks right, add a message result that returns an intermediate value, run again, and read it in the run results — crude, effective, and the normal way this is done.

Then test the edges on purpose: the empty input, the value exactly on a threshold, the person with no entry at all, and a mid-period change so proration is exercised (Chapter 4). Those four are where the defects are, and all four are cheap to script in user acceptance testing.

Two refinements make the message technique much more useful. Return several intermediate values at once rather than one per run, because each run costs a cycle of attention. And leave the message results in place behind a switch — a global value that turns diagnostics on — rather than deleting them, so the next person debugging the same formula does not start from nothing.

The threshold test deserves emphasis because statutory rules are made of thresholds. A person exactly on the insurable-wage ceiling, exactly on a tax bracket boundary, exactly at ten years of service: each of those is where an inequality is written as greater-than when it should be greater-than-or-equal, and each produces an error of exactly one band for exactly the people sitting on the line.

## Compiling, dates and moving formulas between environments

A formula is a dated object like everything else, and it compiles into something the processes execute. Three operational facts follow.

A change takes effect from the date it is effective, which means a corrected formula does not automatically fix a period already calculated — that is a retro question (Chapter 4), not a formula one.

Formulas belong to a legislative data group where they are payroll-related, which means a multi-country implementation has the same logic compiled separately per country (Chapter 1), and a fix applied in one is not applied in the others.

And formulas move between environments as configuration rather than as code. However the client's release process works, the formula, the global values it reads, the user-defined tables it looks up, the elements that call it and the results configuration on those elements all have to travel together — and the formula compiled in the target environment. A formula migrated without its global values compiles and returns zero, which is the most confusing possible outcome.

## Performance

For a payroll of a few thousand, performance is rarely the problem. For a payroll of fifty thousand, it is, and the costs are predictable.

A database item is a read, and a read inside a loop is many reads. An input is free by comparison, which is the real reason Oracle's guidance prefers them. A formula called from another formula is an additional call per person per run. And a balance read is more expensive than an input value, because the balance has to be assembled.

The practical advice is not to optimise early but to notice shape. A formula that reads twenty database items for every person in a fifty-thousand-person payroll is doing a million reads; the same formula with the values passed in as inputs is not. Where a run is slow, the elements with the most complex formulas are the first place to look, and the fix is usually to move a value from a read to an input or to stop recomputing something that could be computed once.

## Conventions that keep a formula maintainable

Three habits, each of which costs a minute and saves an afternoon. Name formulas so that the type and the purpose are visible in the name, because the list a consultant inherits is long and unsorted. Comment the first line with the law or policy the rule implements and the date it was checked — the next person needs to know what the formula is supposed to be, not only what it does. And factor shared logic out with `SET_INPUT`, `EXECUTE` and `GET_OUTPUT` rather than copying it, so that a statutory change is made once.

A fourth, for statutory work specifically: write the worked example into the comment. A formula that says, in a comment, "for a wage of 20,000 this returns 1,837.00 because the ceiling is 16,700 and the rate is 11%" is a formula whose next reader can verify it in ten seconds without reconstructing the law.

A formula is configuration like any other: it belongs in the configuration workbook with its own entry, and it has an owner for the day its numbers change.

## When not to write a formula

The last piece of judgement, because the language is enjoyable and that is a hazard.

If the requirement is a value that varies by a key — a rate per grade, a bracket per income band, an allowance per location — the answer is a table the business can maintain, read by a small formula, rather than a large formula full of conditions.

If the requirement is "only some people get this", that is element eligibility or an eligibility profile (Chapters 5 and 6), not a formula that returns zero for everybody else. A formula that returns zero still runs for everybody, still appears in the results, and still has to be explained.

And if the requirement is a calculation the product already performs, the delivered behaviour is maintained by Oracle and the formula is maintained by the client. Reaching for the rule layer where configuration would do is the Chapter 14 argument in a different setting, and it has the same answer.

## Common mistakes

- Treating Fast Formula as a programming language to master up front. Approach it through examples.
- Reading database items when an input would do.
- Leaving an input or database item without a default, so the formula fails for everyone with no entry.
- Copying a formula across types and expecting it to run, when it is the contexts that differ.
- Assuming an entry-value database item holds one entry on an element that allows several.
- Reading a balance with the wrong dimension and getting a real number for the wrong period.
- Rounding each component rather than the total, or the other way round, without deciding which.
- Typing a statutory limit into the logic instead of reading a dated global value.
- Writing a bracket ladder as nested conditions instead of as a table.
- Writing a deduction that has to be stopped by hand, when a stop result would end it.
- Returning an indirect result with no target element configured, so nothing appears.
- Declaring a formula finished at compile. Compiling proves the grammar, not the amount.
- Testing every case except the one exactly on the threshold.
- Migrating a formula without its global values and tables, and getting a clean compile and a zero.
- Copying one formula per country until nobody can say which is authoritative.
- Using a formula where eligibility would do, so it runs for everybody and returns zero.

## Sources

- Oracle, *Administering Fast Formulas* — the current Cloud guide, including the formula result rules and the function reference. https://docs.oracle.com/en/cloud/saas/human-resources/oapff/index.html
- Oracle, *Administering Fast Formulas* — "Overview of Fast Formula Functions". https://docs.oracle.com/en/cloud/saas/human-resources/oapff/overview-of-fast-formula-functions.html
- Oracle, *Administering Fast Formulas* — the "Formulas for Absence Management" chapter. https://docs.oracle.com/en/cloud/saas/human-resources/oapff/index.html
- Oracle, *Implementing Global Payroll* — "Payroll Relationship Rules" and the formula-driven payroll topics around it. https://docs.oracle.com/en/cloud/saas/human-resources/faigp/payroll-relationship-rules.html
- "Understanding Fast Formulas in Oracle HCM: A Guide with Examples", Medium. https://medium.com/@islamrwashdeh/understanding-fast-formulas-in-oracle-hcm-a-guide-with-examples-e54e452501cc
