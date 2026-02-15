# Changelog

## Version 2.0 - Task Editing and Index-Based Management

### Major Changes

#### 1. Explicit Task Creation
- **Breaking Change**: Tasks are NO LONGER created from arbitrary messages
- Must use `ant:` (add new task) prefix or `add new task:` to create tasks
- Examples:
  - `ant: Buy groceries`
  - `add new task: Call dentist`
  - `ant: ! Important @2026-02-20`

#### 2. Indexed Task Management
- All list commands now show numbered tasks
- Tasks are cached when listed
- Cache persists per user for task editing

**Example:**
```
wan list today

*Today's Tasks* (3) 📅

1. ☐ Buy groceries 📅 Today
2. ⚡ ☐ Important meeting 📅 Today 🏷️ work
3. ☐ Call dentist 📅 Today
```

#### 3. Task Editing Commands

**New Short Commands:**
- `edt N: New title` - Edit task N title
- `act N: Comment` - Add comment to task N
- `cst N: STATE` - Change task N status
- `del N` - Delete task N

**Long Form Commands:**
- `edit title of task N: New title`
- `add comment to task N: Comment`
- `change status of task N: STATE`
- `delete task N`

**Valid States:** TODO, DONE, HOLD, STARTED, CANCELED, SOMEDAY, CHECK

### Complete Workflow Example

```
# Create task
ant: Buy groceries
✅ Task created: "Buy groceries"

# List tasks
wan list today
*Today's Tasks* (1) 📅
1. ☐ Buy groceries 📅 Today

# Edit title
edt 1: Buy groceries and milk
✅ Updated task 1 title to: "Buy groceries and milk"

# Add note
act 1: Get organic milk from Whole Foods
✅ Added comment to task 1

# Mark done
cst 1: DONE
✅ Changed task 1 status to: DONE
```

### Technical Changes

#### New Files
- `task-cache.js` - Task caching system for index-based editing
- `org-editor.js` - Org file editing functions
- `test-editing.js` - Test script for editing functionality

#### Updated Files
- `index.js` - Added userId tracking and explicit task creation check
- `commands.js` - Added editing commands, indexed output
- `org-parser.js` - Enhanced task parsing
- `README.md` - Updated documentation
- `QUICKSTART.md` - Updated quick reference

#### API Changes
- `processCommand(messageText, userId)` - Now requires userId parameter
- All list functions now accept userId and cache results
- Task listings include index numbers

### Backward Compatibility

#### Removed Features
- ❌ Creating tasks from arbitrary messages (was too noisy)
- ❌ Automatic task creation without explicit command

#### Still Supported
- ✅ Priority syntax: `! Task`
- ✅ Date syntax: `@YYYY-MM-DD`
- ✅ All query commands: `wan list`, `wan stats`, etc.
- ✅ Emacs integration
- ✅ HTTP server for programmatic access

### Migration Guide

**Before (v1.0):**
```
Buy groceries              # Created task
! Important task          # Created priority task
```

**After (v2.0):**
```
ant: Buy groceries        # Creates task
ant: ! Important task     # Creates priority task
```

**Reason for change:** Prevents accidental task creation from casual messages to yourself.

### Benefits

1. **More Control**: Explicit task creation prevents noise
2. **Task Management**: Edit, comment, and change status from WhatsApp
3. **Better UX**: Numbered lists make task reference easy
4. **Efficiency**: Quick edits without opening Emacs

### Future Enhancements

Potential features for v3.0:
- Search tasks by keyword
- Bulk operations (e.g., `cst 1,2,3: DONE`)
- Task dependencies
- Reminders and notifications
- Task templates
- Natural language date parsing ("tomorrow", "next week")
