# Usage Examples

## Complete Workflow Examples

### Example 1: Morning Task Check

**From WhatsApp:**
```
You: wan list today

Bot: *Today's Tasks* (3) 📅

☐ Buy groceries 📅 Today
⚡ ☐ Important meeting 📅 Today 🏷️ work
☐ Call dentist 📅 Today
```

**From Emacs:**
```elisp
;; Press: SPC a w t
;; WhatsApp receives the same response
```

### Example 2: Quick Task Capture

**Scenario:** You're reading an article and need to remember something.

**From WhatsApp:**
```
You: ! Read article about async Rust

Bot: (Creates TODO)
```

**From Emacs:**
```elisp
;; Select the text "Read article about async Rust"
;; Press: SPC u SPC a w r  (u for high priority)
;; Task created with priority
```

### Example 3: Check Overdue Tasks

**From WhatsApp:**
```
You: wan list overdue

Bot: *Overdue Tasks* (2) ⚠️

☐ Submit tax documents 📅 2026-02-10 🏷️ finance
☐ Renew passport 📅 2026-02-13 🏷️ personal
```

**From Emacs:**
```elisp
;; Press: SPC a w o
;; Response in WhatsApp
```

### Example 4: Weekly Planning

**Sunday evening - Review upcoming week:**

```
You: wan list week

Bot: *This Week's Tasks* (7) 📅

☐ Team meeting 📅 2026-02-17 🏷️ work
☐ Dentist appointment 📅 2026-02-18 🏷️ health
⚡ ☐ Project deadline 📅 2026-02-19 🏷️ work
☐ Grocery shopping 📅 2026-02-20
☐ Gym 📅 2026-02-21 🏷️ health
☐ Date night 📅 2026-02-22 🏷️ personal
☐ Meal prep 📅 2026-02-23
```

### Example 5: Creating Scheduled Tasks

**Different date formats:**

```
You: Dentist appointment @2026-03-15
Bot: (Creates TODO scheduled for March 15)

You: ! Tax deadline @2026-04-15
Bot: (Creates high priority TODO for April 15)

You: Call mom
Bot: (Creates TODO for today)
```

### Example 6: Stats Review

**End of day review:**

```
You: wan stats

Bot: *Task Statistics* 📊

Total: 156
Open (TODO): 12
Done: 130
Today: 3
Overdue: 2

On Hold: 4
In Progress: 2
Someday: 6
```

### Example 7: Integration with Other Apps

**From any app with text selection → Emacs → WhatsApp:**

1. Reading email in Mail.app
2. See: "Review contract by Feb 20"
3. Copy text
4. Switch to Emacs
5. Paste in scratch buffer
6. Select text
7. Press `SPC a w r`
8. Task created!

### Example 8: Voice-to-Task

**Using WhatsApp voice messages:**

1. Hold voice message button
2. Say: "Exclamation mark, buy birthday gift at 2026 dash 02 dash 25"
3. WhatsApp transcribes to: "! Buy birthday gift @2026-02-25"
4. Send
5. High priority task created for Feb 25!

### Example 9: Batch Task Review from Emacs

**Check multiple lists quickly:**

```elisp
;; Morning routine:
SPC a w t    ; Today's tasks
SPC a w o    ; Overdue (if any)

;; Weekly planning:
SPC a w w    ; This week

;; Monthly review:
SPC a w S    ; Statistics
```

All responses appear in WhatsApp for reference throughout the day.

### Example 10: Emergency Task

**Need to remember something RIGHT NOW:**

1. Pull out phone
2. Open WhatsApp
3. Message yourself: `! Fix production bug`
4. Done in 3 seconds

No need to:
- Open Emacs
- Navigate to org file
- Find the right heading
- Format the entry
- Save and sync

The task is captured and will be there when you open Emacs.

## Tips and Tricks

### Tip 1: Use Descriptive Task Names

**Good:**
```
! Review PR #1234 for auth changes @2026-02-20
```

**Better for context:**
```
! Review John's auth PR (#1234) - security concerns @2026-02-20
```

### Tip 2: Morning/Evening Routines

**Morning (from Emacs):**
```
SPC a w o    ; Check overdue
SPC a w t    ; Check today
```

**Evening (from WhatsApp):**
```
wan stats    ; How did I do today?
```

### Tip 3: Quick Reference

Save the help message:
```
wan help
```
Screenshot the response for offline reference.

### Tip 4: Bulk Capture

When brainstorming, send multiple messages:
```
Research competitors
! Draft proposal
Email client
Update docs
Schedule meeting @2026-02-25
```

All become separate TODOs instantly.

### Tip 5: Use Tags Implicitly

While creating tasks, mention context:
```
Buy groceries for dinner party
Call dentist about teeth cleaning
Email boss about vacation
```

Later, you can search in Emacs by keyword.
