# WhatsApp to Org-Mode Tasks

Create Emacs org-mode TODO tasks by sending WhatsApp messages to yourself.

## Features

- 🔄 Automatically monitors WhatsApp self-messages
- 📝 Appends TODO entries directly to your org file
- ⚡ Persistent session (no repeated QR scanning)
- 🎯 Optional priority and scheduled date parsing
- 🏷️ Adds metadata (timestamp, source) to entries
- 💬 **Bidirectional chat**: Query tasks from WhatsApp with commands
- 🔌 **Emacs integration**: Send messages and queries from Emacs
- 📊 Task statistics and list filtering

## Prerequisites

- Node.js (v18 or later)
- An active WhatsApp account
- Emacs with org-mode

## Quick Start

```bash
cd ~/Documents/code/whatsapp-org-tasks
npm start
```

When the QR code appears:
1. Open WhatsApp on your phone
2. Tap the three dots (⋮) → Linked Devices → Link a Device
3. Scan the QR code in your terminal
4. Done! Send yourself a message to create a TODO

**Note**: After first authentication, the session persists. You won't need to scan the QR code again.

## Setup

1. **Install dependencies:**
   ```bash
   cd ~/Documents/code/whatsapp-org-tasks
   npm install
   ```

2. **Configure:**
   Edit `config.js` to set your phone number and customize options:

   **Required:**
   - `myPhoneNumber`: Your WhatsApp number (country code + number, no spaces or +)
     - Example: `'5511966428772'` for +55 11 96642-8772
     - This ensures only messages TO YOURSELF create tasks

   **Optional:**
   - Org file path (default: `~/Documents/notes/notes/20251028165605-tasks.org`)
   - TODO state, scheduling behavior
   - Special syntax parsing

3. **Run the application:**
   ```bash
   npm start
   ```

4. **Authenticate:**
   - A QR code will appear in your terminal
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices → Link a Device
   - Scan the QR code
   - Authentication is saved; you won't need to scan again

## Usage

### Commands (Query and Edit Tasks)

#### Listing Commands

Send commands to yourself on WhatsApp to query your tasks (tasks get numbered):

| Command | Description |
|---------|-------------|
| `wan help` | Show help message |
| `wan list today` | List today's tasks |
| `wan list tomorrow` | List tomorrow's tasks |
| `wan list week` | List this week's tasks |
| `wan list overdue` | List overdue tasks |
| `wan list all` | List all open tasks |
| `wan stats` | Show task statistics |

**Example conversation:**
```
You: wan list today

Bot: *Today's Tasks* (3) 📅

1. ☐ Buy groceries 📅 Today
2. ⚡ ☐ Important meeting 📅 Today 🏷️ work
3. ☐ Call dentist 📅 Today
```

#### Editing Commands

After listing tasks, they get numbered. You can then edit them:

| Short Form | Long Form | Description |
|------------|-----------|-------------|
| `edt 2: New title` | `edit title of task 2: New title` | Edit task title |
| `act 2: My note` | `add comment to task 2: My note` | Add comment/note |
| `cst 2: DONE` | `change status of task 2: DONE` | Change status |
| `del 2` | `delete task 2` | Delete task |

**Valid statuses:** TODO, DONE, HOLD, STARTED, CANCELED, SOMEDAY, CHECK

**Complete workflow example:**
```
You: wan list today
Bot: 1. ☐ Buy groceries 📅 Today
     2. ☐ Call dentist 📅 Today

You: edt 1: Buy groceries and organic milk
Bot: ✅ Updated task 1 title to: "Buy groceries and organic milk"

You: act 1: Check for sales on milk
Bot: ✅ Added comment to task 1

You: cst 1: DONE
Bot: ✅ Changed task 1 status to: DONE
```

### Creating Tasks

**IMPORTANT:** You must use `ant:` or `add new task:` prefix to create tasks.

#### Basic TODO

Message yourself on WhatsApp:
```
ant: Buy groceries
```

Creates in org file:
```org
* TODO Buy groceries
SCHEDULED: <2026-02-15>
:PROPERTIES:
:CREATED: [2026-02-15 10:30:00]
:SOURCE: WhatsApp
:END:
```

#### Priority Task (with `!` prefix)

Message:
```
ant: ! Call doctor about appointment
```

Creates:
```org
* TODO [#A] Call doctor about appointment
SCHEDULED: <2026-02-15>
:PROPERTIES:
:CREATED: [2026-02-15 10:30:00]
:SOURCE: WhatsApp
:END:
```

#### Custom Scheduled Date

Message:
```
ant: Submit report @2026-02-20
```

Creates:
```org
* TODO Submit report
SCHEDULED: <2026-02-20>
:PROPERTIES:
:CREATED: [2026-02-15 10:30:00]
:SOURCE: WhatsApp
:END:
```

#### Combined Priority and Date

Message:
```
ant: ! Finish presentation @2026-02-18
```

Creates:
```org
* TODO [#A] Finish presentation
SCHEDULED: <2026-02-18>
:PROPERTIES:
:CREATED: [2026-02-15 10:30:00]
:SOURCE: WhatsApp
:END:
```

#### Long Form

Both formats work the same way:
```
ant: Buy groceries
add new task: Buy groceries
```

## Emacs Integration

The package includes Emacs functions to interact with WhatsApp from within Emacs.

### Setup

The integration is already configured in your Doom Emacs config (`~/.config/doom/lisp/my-whatsapp.el`).

### Keybindings

Press `SPC a w` (in normal mode) followed by:

| Key | Command | Description |
|-----|---------|-------------|
| `s` | `whatsapp-send-message` | Send any message to WhatsApp |
| `t` | `whatsapp-list-today` | Query today's tasks |
| `T` | `whatsapp-list-tomorrow` | Query tomorrow's tasks |
| `w` | `whatsapp-list-week` | Query this week's tasks |
| `o` | `whatsapp-list-overdue` | Query overdue tasks |
| `a` | `whatsapp-list-all` | Query all tasks |
| `S` | `whatsapp-stats` | Get statistics |
| `h` | `whatsapp-help` | Show help |
| `c` | `whatsapp-check-server` | Check server status |
| `r` | `whatsapp-create-task-from-region` | Create task from selected text |

### Usage Examples

1. **Check server status:**
   - Press `SPC a w c`
   - Shows if server is running and authenticated

2. **Query today's tasks:**
   - Press `SPC a w t`
   - Response appears in your WhatsApp

3. **Create task from selected text:**
   - Select text in any buffer
   - Press `SPC a w r`
   - With prefix arg (`SPC u SPC a w r`): Mark as high priority

4. **Send custom message:**
   - Press `SPC a w s`
   - Type your message
   - Creates TODO or runs command

## Configuration

Edit `config.js` to customize behavior:

### Phone Number (Required)

```javascript
myPhoneNumber: '5511966428772'  // Your WhatsApp number
```

**Important:** This must be YOUR phone number in international format without spaces, dashes, or +:
- ✅ Correct: `'5511966428772'` (for +55 11 96642-8772)
- ❌ Wrong: `'+55 11 96642-8772'`
- ❌ Wrong: `'55 11 966428772'`

The app will only process messages sent TO this number (i.e., messages to yourself).

### Other Options

Full `config.js` structure:

```javascript
export const config = {
  // Path to your org-mode tasks file
  orgFile: join(homedir(), 'Documents/notes/notes/20251028165605-tasks.org'),

  // Only process messages containing these keywords (empty = process all)
  triggerKeywords: [],  // e.g., ['todo', 'task', 'remind']

  // Default TODO state
  todoState: 'TODO',

  // Auto-schedule days from today (null = no auto-schedule)
  defaultScheduledDays: 0,  // 0 = today, 1 = tomorrow

  // Include creation timestamp and metadata
  includeTimestamp: true,

  // Parse special syntax (! for priority, @ for dates)
  parseSpecialSyntax: true
};
```

## Running as a Service

### macOS (launchd)

Create `~/Library/LaunchAgents/com.whatsapp-org-tasks.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.whatsapp-org-tasks</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/wferreir/Documents/code/whatsapp-org-tasks/index.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/wferreir/Documents/code/whatsapp-org-tasks</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/wferreir/Library/Logs/whatsapp-org-tasks.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/wferreir/Library/Logs/whatsapp-org-tasks.error.log</string>
</dict>
</plist>
```

Load the service:
```bash
launchctl load ~/Library/LaunchAgents/com.whatsapp-org-tasks.plist
```

Check status:
```bash
launchctl list | grep whatsapp-org-tasks
```

View logs:
```bash
tail -f ~/Library/Logs/whatsapp-org-tasks.log
```

## Troubleshooting

### Tasks created from all messages (not just self-messages)

**Problem:** Tasks are being created when you message other people.

**Solution:** Configure your phone number in `config.js`:
```javascript
myPhoneNumber: '5511966428772'  // Your number without spaces or +
```

When you start the app, you'll see:
```
✅ WhatsApp client is ready!
📱 Detected phone number: 5511966428772
📱 Configured phone number: 5511966428772
📝 Monitoring messages to: 5511966428772
```

If the numbers don't match, you'll see a warning. Update your config to match the detected number.

### QR Code doesn't appear
- Ensure you have a stable internet connection
- Check that WhatsApp Web is not blocked by your network

### Authentication fails repeatedly
- Delete the `.wwebjs_auth` folder and restart
- Ensure no other WhatsApp Web sessions are using your account

### Tasks not appearing in org file
- Verify the org file path in `config.js`
- Check file permissions
- Look for error messages in console output
- Ensure you're using `ant:` prefix to create tasks

### "Cannot find module" errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version: `node --version` (should be v18+)

### Debug mode

To see detailed logging about message processing:
```bash
npm start
```

Look for lines like:
- `Skipping message - not a self-chat` (message not sent to yourself)
- `Skipping message - not from me` (incoming message)
- `✅ Created TODO:` (task successfully created)
- `✅ Processed command:` (command successfully executed)

## Advanced Usage

### Trigger Keywords

To only process messages containing specific keywords, edit `config.js`:

```javascript
triggerKeywords: ['todo', 'task', 'remind']
```

Now only messages like "todo: Buy milk" will create tasks.

### No Auto-Scheduling

To disable automatic scheduling:

```javascript
defaultScheduledDays: null
```

### Custom TODO States

Change the default state:

```javascript
todoState: 'NEXT'  // or 'WAITING', 'SOMEDAY', etc.
```

## Architecture

```
WhatsApp Message → whatsapp-web.js → Parser → Append to org file
```

The application:
1. Connects to WhatsApp Web via Puppeteer
2. Monitors messages in your "self-chat"
3. Parses message content and special syntax
4. Formats as org-mode TODO entry
5. Appends directly to your org file

No Emacs server required; works even when Emacs is closed.

## License

MIT
