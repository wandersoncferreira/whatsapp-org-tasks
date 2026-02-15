# Examples

## Basic Workflow

```
tc: Buy groceries
tl
tu 1: Buy groceries and milk
cc 1: Get organic
tst 1: DONE
```

## Create with Comments

```
tcc: Grocery shopping list
Milk
Eggs
Bread
Butter
tl
```

## Priority Task

```
tc: ! Fix production bug
tl
tst 1: STARTED
cc 1: Found the issue in auth.js
tst 1: DONE
```

## Scheduled Task

```
tc: Team meeting @2026-03-20
tlw
tsd 1: 2026-03-21
tu 1: Team meeting - RESCHEDULED
```

## Comment Management

```
tc: Research new feature
cc 1: Check competitor X
cc 1: Review docs
tr 1
cu 1 1: Competitor X has better UX
cd 1 2
tst 1: DONE
```

## Weekly Review

```
tlo                    # Check overdue
tl                     # Check today
tlt                    # Plan tomorrow
tlw                    # Review week
ts                     # Stats
```

## Multiple Tasks

```
tc: Call dentist
tc: ! Pay rent @2026-02-28
tc: Update resume
tla
tst 1: DONE
tst 2: DONE
td 3
```
