# TCC Command Guide

## What is TCC?

`tcc` (Task Create with Comments) lets you create a task and immediately add multiple comments without repeating commands.

## How It Works

1. **Create task with `tcc:`** - Enters comment mode
2. **Send messages** - Each message becomes a comment
3. **Send any command** - Exits comment mode

## Example

```
You: tcc: Grocery shopping

Bot: ✅ Task created: "Grocery shopping"

     💬 Now send messages to add comments.
     Any command will exit comment mode.

You: Milk
Bot: ✅ Comment added

You: Eggs
Bot: ✅ Comment added

You: Bread
Bot: ✅ Comment added

You: tl
Bot: *Today's Tasks* (1) 📅

     1. ☐ Grocery shopping 📅 Today

     (Comment mode ended)
```

## Result in Org File

```org
** TODO Grocery shopping
SCHEDULED: <2026-02-15>
- [2026-02-15 15:30:00] Milk
- [2026-02-15 15:30:05] Eggs
- [2026-02-15 15:30:10] Bread
:PROPERTIES:
:CREATED: [2026-02-15 15:29:50]
:SOURCE: WhatsApp
:END:
```

## Use Cases

### Shopping List
```
tcc: Weekly groceries
Milk
Eggs
Bread
Butter
Cheese
tl
```

### Project Tasks
```
tcc: Prepare presentation
Research topic
Create slides
Practice delivery
tst 1: STARTED
```

### Meeting Notes
```
tcc: Team meeting notes
Discussed Q1 goals
John raised concerns about timeline
Need to schedule follow-up
tst 1: DONE
```

## Special Syntax Works Too

```
tcc: ! Urgent project @2026-02-20
Step 1: Requirements
Step 2: Design
Step 3: Implementation
tl
```

Creates high-priority task scheduled for Feb 20 with 3 comments.

## Exiting Comment Mode

Any command ends comment mode:
- `tl`, `tlt`, `tlw`, etc. (list commands)
- `tc:` (create new task)
- `tu`, `tst`, `td` (update/delete)
- `cc`, `cu`, `cd` (comment commands)
- `th`, `help`

## Tips

1. **Quick capture**: Perfect for brainstorming or lists
2. **Natural flow**: Type thoughts as they come
3. **No repetition**: No need to type `cc 1:` for each comment
4. **Auto-exit**: Just use any command when done
5. **One hour timeout**: Session auto-clears after 1 hour

## Comparison

### Without TCC
```
tc: Shopping
tl
cc 1: Milk
cc 1: Eggs
cc 1: Bread
```

### With TCC
```
tcc: Shopping
Milk
Eggs
Bread
tl
```

**Result**: Same task, fewer characters, more natural flow.
