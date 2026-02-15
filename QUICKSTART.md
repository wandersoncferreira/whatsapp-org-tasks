# WhatsApp Org Tasks - Quick Start Guide

## ⚙️ First Time Setup

1. **Configure your phone number** in `config.js`:
   ```javascript
   myPhoneNumber: '5511966428772'  // Your number (no spaces, +, or dashes)
   ```

2. **Start the service:**
   ```bash
   cd ~/Documents/code/whatsapp-org-tasks
   npm start
   ```

3. **Scan the QR code** with WhatsApp (only needed once)

The app will verify your configured number matches the authenticated account.

## 📱 WhatsApp Commands

### Create Tasks

You must explicitly create tasks:
- `ant: Buy groceries` → Regular TODO
- `ant: ! Call dentist` → High priority
- `ant: Meeting @2026-02-20` → Custom date
- `ant: ! Submit report @2026-02-25` → Priority + date
- `add new task: Title here` → Long form

### Query Tasks

Send these commands to yourself (tasks get numbered):
- `wan help` → Show help
- `wan list today` → Today's tasks
- `wan list tomorrow` → Tomorrow's tasks
- `wan list week` → This week's tasks
- `wan list overdue` → Overdue tasks
- `wan list all` → All open tasks
- `wan stats` → Statistics

### Edit Tasks

After listing tasks (they get numbers):
- `edt 2: New title` → Edit task 2 title
- `act 2: My comment` → Add comment to task 2
- `cst 2: DONE` → Change task 2 status to DONE
- `del 2` → Delete task 2

**Long form:**
- `edit title of task 2: New title`
- `add comment to task 2: My comment`
- `change status of task 2: DONE`
- `delete task 2`

## 💻 Emacs Integration

### Keybindings (`SPC a w`)

| Key | Command |
|-----|---------|
| `s` | Send message |
| `t` | List today |
| `T` | List tomorrow |
| `w` | List week |
| `o` | List overdue |
| `a` | List all |
| `S` | Stats |
| `h` | Help |
| `c` | Check server |
| `r` | Create from region |

### Examples

1. **Check if server is running:**
   ```
   SPC a w c
   ```

2. **Query today's tasks:**
   ```
   SPC a w t
   ```
   (Response appears in WhatsApp)

3. **Create task from selected text:**
   - Select text
   - Press `SPC a w r`
   - With prefix: `SPC u SPC a w r` (high priority)

4. **Send custom message:**
   ```
   SPC a w s
   ```
   Type message and press Enter

## 🔧 Management

```bash
# Start in background
./manage.sh start

# Stop
./manage.sh stop

# Check status
./manage.sh status

# View logs
./manage.sh logs

# Test without WhatsApp
node test.js "Test message"
node test-commands.js
```

## 🎯 Workflow Examples

### Complete Task Management Flow
```
You: ant: Buy groceries
Bot: ✅ Task created: "Buy groceries"

You: wan list today
Bot: *Today's Tasks* (1) 📅
     1. ☐ Buy groceries 📅 Today

You: edt 1: Buy groceries and milk
Bot: ✅ Updated task 1 title to: "Buy groceries and milk"

You: act 1: Get organic milk from Whole Foods
Bot: ✅ Added comment to task 1

You: cst 1: DONE
Bot: ✅ Changed task 1 status to: DONE
```

### Morning Routine
```
SPC a w t          # Check today's tasks (Emacs)
wan list overdue   # Check overdue (WhatsApp)
```

### Quick Task Capture
1. See something you need to do
2. Open WhatsApp
3. Message yourself: `ant: ! Buy milk`
4. Done! Task is in your org file

### From Emacs
1. Reading documentation
2. Select important text
3. Press `SPC a w r`
4. Task created in org file

## 📊 Task Format in Org File

Created tasks look like:
```org
* TODO Buy groceries
SCHEDULED: <2026-02-15>
:PROPERTIES:
:CREATED: [2026-02-15 19:22:41]
:SOURCE: WhatsApp
:END:
```

With priority:
```org
* TODO [#A] Important meeting
SCHEDULED: <2026-02-15>
:PROPERTIES:
:CREATED: [2026-02-15 19:22:41]
:SOURCE: WhatsApp
:END:
```

## 🐛 Troubleshooting

**Server not running:**
```bash
cd ~/Documents/code/whatsapp-org-tasks
npm start
```

**Emacs can't connect:**
```elisp
M-x whatsapp-check-server
```

**Need to re-authenticate WhatsApp:**
```bash
rm -rf .wwebjs_auth
npm start
# Scan QR code again
```

**Check logs:**
```bash
./manage.sh logs
```
