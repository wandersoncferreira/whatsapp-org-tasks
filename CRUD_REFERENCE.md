# WhatsApp Org Tasks - CRUD Command Reference

## Overview

Complete CRUD (Create, Read, Update, Delete) operations for tasks and comments using short, case-insensitive acronyms.

**All commands are case insensitive** - `tl`, `TL`, `Tl` all work the same way.

---

## Quick Reference Table

| Category | Command | Syntax | Description |
|----------|---------|--------|-------------|
| **HELP** | `th` / `help` | `th` | Show help message |
| **CREATE** | `tc` | `tc: Task title` | Create new task |
| | | `tc: ! Priority task` | Create with priority [#A] |
| | | `tc: Task @2026-02-20` | Create with scheduled date |
| | `cc` | `cc 2: Comment text` | Add comment to task 2 |
| **READ** | `tl` | `tl` | List today's tasks |
| | `tlt` | `tlt` | List tomorrow's tasks |
| | `tlw` | `tlw` | List this week's tasks |
| | `tlo` | `tlo` | List overdue tasks |
| | `tla` | `tla` | List all open tasks |
| | `ts` | `ts` | Show task statistics |
| | `tr` | `tr 2` | Read full details of task 2 |
| **UPDATE** | `tu` | `tu 2: New title` | Update task 2 title |
| | `tst` | `tst 2: DONE` | Change task 2 state |
| | `tsd` | `tsd 2: 2026-02-20` | Change task 2 scheduled date |
| | `cu` | `cu 2 1: Updated text` | Update comment 1 of task 2 |
| **DELETE** | `td` | `td 2` | Delete task 2 |
| | `cd` | `cd 2 1` | Delete comment 1 from task 2 |

---

## Complete Command Guide

### HELP Commands

#### `th` or `help`
Show the help message with all available commands.

**Examples:**
```
th
help
TH
HELP
```

---

### CREATE Commands

#### `tc: Task title` - Task Create
Create a new task. Supports special syntax for priority and scheduled date.

**Basic Examples:**
```
tc: Buy groceries
tc: Call mom
tc: Review pull request
```

**Priority Tasks (! prefix):**
```
tc: ! Urgent meeting
tc: ! Fix production bug
```
Creates task with `[#A]` priority.

**Scheduled Date (@ suffix):**
```
tc: Submit report @2026-02-20
tc: Team meeting @2026-03-15
```
Schedules task for specific date (format: YYYY-MM-DD).

**Combined (Priority + Date):**
```
tc: ! Important deadline @2026-02-25
tc: ! Client presentation @2026-03-01
```

#### `cc N: Comment text` - Comment Create
Add a comment/note to an existing task. Task must be listed first to get its number.

**Examples:**
```
tl                              # List tasks to get numbers
cc 1: Remember to bring charger
cc 2: Meeting at 3pm in room B
cc 3: Check with John first
```

---

### READ Commands

#### `tl` - Task List Today
List all tasks scheduled for today.

**Example:**
```
tl
```

**Output:**
```
*Today's Tasks* (3) 📅

1. TODO Buy groceries
2. TODO [#A] Call client
3. TODO Review code
```

#### `tlt` - Task List Tomorrow
List tasks scheduled for tomorrow.

#### `tlw` - Task List Week
List tasks scheduled for this week (next 7 days).

#### `tlo` - Task List Overdue
List all overdue tasks (scheduled before today).

#### `tla` - Task List All
List all open TODO tasks (limited to 20 for performance).

#### `ts` - Task Stats
Show task statistics and summary.

**Example Output:**
```
*Task Statistics* 📊

Total: 45
Open (TODO): 12
Done: 30
Today: 3
Overdue: 2
```

#### `tr N` - Task Read
Show complete details of task N including all comments.

**Example:**
```
tl      # List tasks
tr 1    # Read task 1 details
```

**Output:**
```
*Task 1 Details:*

*Title:* Buy groceries
*State:* TODO
*Priority:* [#A]
*Scheduled:* 2026-02-15
*Tags:* shopping, urgent

*Comments (2):*
1. [2026-02-14 10:30:00] Get organic milk
2. [2026-02-14 11:45:00] Also buy bread
```

---

### UPDATE Commands

#### `tu N: New title` - Task Update
Update the title of task N. Preserves state, priority, tags, and comments.

**Examples:**
```
tl                                    # List tasks
tu 1: Buy groceries and cleaning supplies
tu 2: Call mom about birthday plans
```

#### `tst N: STATE` - Task STate
Change the state of task N.

**Valid States:**
- `TODO` - Open task
- `DONE` - Completed task (adds CLOSED timestamp)
- `HOLD` - On hold
- `STARTED` - In progress
- `CANCELED` - Canceled
- `SOMEDAY` - Maybe someday
- `CHECK` - Needs checking

**Examples:**
```
tl                  # List tasks
tst 1: DONE         # Mark task 1 as done
tst 2: STARTED      # Mark task 2 as in progress
tst 3: HOLD         # Put task 3 on hold
```

States are case insensitive: `done`, `DONE`, `Done` all work.

#### `tsd N: YYYY-MM-DD` - Task Scheduled Date
Change the scheduled date of task N.

**Examples:**
```
tl                          # List tasks
tsd 1: 2026-02-20          # Reschedule to Feb 20
tsd 2: 2026-03-15          # Reschedule to Mar 15
```

Date format must be: YYYY-MM-DD (ISO format).

#### `cu N M: New comment text` - Comment Update
Update comment M of task N. Preserves the original timestamp.

**Examples:**
```
tr 1                                # Read task 1 to see comments
cu 1 1: Updated comment text        # Update comment 1 of task 1
cu 2 3: Corrected information       # Update comment 3 of task 2
```

---

### DELETE Commands

#### `td N` - Task Delete
Permanently delete task N from the org file. This removes the task heading, all metadata, and all comments.

**Examples:**
```
tl          # List tasks
td 1        # Delete task 1
td 3        # Delete task 3
```

**⚠️ Warning:** This is permanent! The task will be removed from your org file.

#### `cd N M` - Comment Delete
Delete comment M from task N.

**Examples:**
```
tr 1        # Read task 1 to see comments with numbers
cd 1 1      # Delete comment 1 from task 1
cd 2 2      # Delete comment 2 from task 2
```

---

## Complete Workflow Examples

### Example 1: Simple Task Management
```
# Create a task
tc: Buy groceries

# List today's tasks
tl

# Add more details
cc 1: Get milk, eggs, bread

# Mark as done
tst 1: DONE
```

### Example 2: Priority Task with Date
```
# Create urgent task for specific date
tc: ! Submit quarterly report @2026-02-28

# List all tasks
tla

# Add progress notes
cc 1: Started draft
cc 1: Reviewed by manager
cc 1: Final version ready

# Complete
tst 1: DONE
```

### Example 3: Task Rescheduling
```
# List overdue tasks
tlo

# Reschedule task 1
tsd 1: 2026-02-20

# Update title
tu 1: Review Q1 budget - revised deadline

# Check details
tr 1
```

### Example 4: Comment Management
```
# List today's tasks
tl

# Read task details
tr 2

# Update an incorrect comment
cu 2 1: Corrected meeting time - 3pm not 2pm

# Delete outdated comment
cd 2 3

# Verify changes
tr 2
```

### Example 5: Task State Management
```
# Start working on task
tl
tst 1: STARTED

# Put on hold
tst 1: HOLD

# Add reason
cc 1: Waiting for client feedback

# Resume and complete
tst 1: STARTED
tst 1: DONE
```

---

## Tips & Best Practices

1. **Always list tasks first** before editing (tl, tlt, tlw, etc.) to get current task numbers
2. **Use descriptive titles** when creating tasks - you can always update with `tu` later
3. **Add comments for context** using `cc` - future you will thank you
4. **Use `tr` before complex updates** to see all task details and comment numbers
5. **States are case insensitive** - type however is comfortable
6. **Date format is strict** - always use YYYY-MM-DD for `tsd` command
7. **Task numbers are temporary** - they're assigned when you list tasks and cached for that session

---

## Command Acronym Legend

- **t** = Task
- **c** = Create / Comment
- **l** = List
- **r** = Read
- **u** = Update
- **s** = State / Stats
- **d** = Delete / Date
- **h** = Help

Combined:
- **tc** = Task Create
- **tl** = Task List
- **tr** = Task Read
- **tu** = Task Update
- **tst** = Task STate
- **tsd** = Task Scheduled Date
- **td** = Task Delete
- **ts** = Task Stats
- **th** = Task Help
- **cc** = Comment Create
- **cu** = Comment Update
- **cd** = Comment Delete

---

## Valid Task States

| State | Description |
|-------|-------------|
| TODO | Open task (default) |
| DONE | Completed task |
| HOLD | On hold / paused |
| STARTED | In progress |
| CANCELED | Canceled |
| SOMEDAY | Maybe someday |
| CHECK | Needs verification |

---

## Org File Format

Tasks are stored in standard org-mode format. By default, tasks are created at heading level 2 (`**`):

```org
** TODO [#A] Task title
SCHEDULED: <2026-02-15>
- [2026-02-14 10:30:00] First comment
- [2026-02-14 11:45:00] Second comment
:PROPERTIES:
:CREATED: [2026-02-14 09:00:00]
:SOURCE: WhatsApp
:END:
```

When marked DONE:
```org
** DONE Task title
CLOSED: [2026-02-15 14:20:00]
SCHEDULED: <2026-02-15>
:PROPERTIES:
:CREATED: [2026-02-14 09:00:00]
:SOURCE: WhatsApp
:END:
```

**Note:** The heading level is configurable in `config.js` via the `headingLevel` option (default: 2).

---

## Troubleshooting

**"Task N not found"**
- List tasks first (tl, tlt, etc.) to cache current tasks
- Task numbers are assigned when you list, not permanent IDs

**"Invalid date format"**
- Use YYYY-MM-DD format (e.g., 2026-02-20)
- Must be valid calendar date

**"Comment N not found"**
- Use `tr` command to see how many comments exist
- Comment numbers start at 1

**Command not recognized**
- Check you're in your self-chat
- Commands are case insensitive but syntax must match
- Use `th` or `help` to see all commands

---

## Integration

### Emacs Integration
The app runs an HTTP server on port 3042. You can send commands from Emacs:

```elisp
(defun my-whatsapp-send (message)
  "Send MESSAGE to WhatsApp"
  (let ((url-request-method "POST")
        (url-request-data (json-encode `((message . ,message)))))
    (url-retrieve "http://localhost:3042/send-message" ...)))
```

### Configuration
Edit `config.js` to customize:
- `orgFile`: Path to your org-mode file
- `myPhoneNumber`: Your WhatsApp number
- `defaultScheduledDays`: Default schedule offset (0 = today)
- `parseSpecialSyntax`: Enable/disable ! and @ parsing
- `headingLevel`: Org heading level for new tasks (1 = `*`, 2 = `**`, default: 2)

---

## Changes from Previous Version

### Old Commands → New Commands

| Old | New | Notes |
|-----|-----|-------|
| `ant: Task` | `tc: Task` | Task create |
| `wan list today` | `tl` | Shorter acronym |
| `wan list tomorrow` | `tlt` | Shorter acronym |
| `wan list week` | `tlw` | Shorter acronym |
| `wan list overdue` | `tlo` | Shorter acronym |
| `wan list all` | `tla` | Shorter acronym |
| `wan stats` | `ts` | Shorter acronym |
| `wan help` | `th` | Shorter acronym |
| `edt N: Title` | `tu N: Title` | Task update |
| `act N: Comment` | `cc N: Comment` | Comment create |
| `cst N: STATE` | `tst N: STATE` | Task state |
| `del N` | `td N` | Task delete |
| - | `tr N` | NEW: Task read (show details) |
| - | `tsd N: DATE` | NEW: Change scheduled date |
| - | `cu N M: Text` | NEW: Comment update |
| - | `cd N M` | NEW: Comment delete |

---

**Made with ❤️ for efficient task management via WhatsApp**
