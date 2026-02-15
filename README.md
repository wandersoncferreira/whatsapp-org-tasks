# WhatsApp to Org-Mode Tasks

Create and manage Emacs org-mode TODO tasks via WhatsApp messages to yourself.

## Features

- 🔄 Monitors WhatsApp self-messages
- 📝 Complete CRUD operations on tasks and comments
- ⚡ Persistent session (no repeated QR scanning)
- 🎯 Priority and date parsing (`!` and `@YYYY-MM-DD`)
- 💬 Query and edit tasks from WhatsApp
- 🔌 Emacs integration via HTTP

## Prerequisites

- Node.js v18+
- WhatsApp account
- Emacs with org-mode

## Quick Start

```bash
npm install
npm start
```

Scan QR code with WhatsApp → Send yourself a message → Task created!

## Configuration

Edit `config.js`:

```javascript
export const config = {
  orgFile: '/path/to/tasks.org',
  myPhoneNumber: '5511966428772',  // Required: your number
  headingLevel: 2,                  // 1=*, 2=**, 3=***
  defaultScheduledDays: 0,          // 0=today, 1=tomorrow, null=none
  parseSpecialSyntax: true,         // Enable ! and @
  httpPort: 3042
};
```

## Commands

All commands are case insensitive. See [CRUD_REFERENCE.md](CRUD_REFERENCE.md) for full details.

### Quick Reference

```
# Create
tc: Buy groceries
tc: ! Important task
tc: Meeting @2026-03-15
tcc: Shopping list      # Next messages = comments

# Read
tl          # List today
tlt         # List tomorrow
tlw         # List week
tlo         # List overdue
tla         # List all
ts          # Stats
tr 2        # Show task 2 details

# Update
tu 2: New title
tst 2: DONE
tsd 2: 2026-03-20
cc 2: Add comment
cu 2 1: Update comment 1

# Delete
td 2        # Delete task 2
cd 2 1      # Delete comment 1 from task 2

# Help
th
help
```

## Valid States

TODO, DONE, HOLD, STARTED, CANCELED, SOMEDAY, CHECK

## Org File Format

Tasks created at configured heading level (default: `**`):

```org
** TODO [#A] Task title
SCHEDULED: <2026-02-15>
- [2026-02-14 10:00:00] Comment
:PROPERTIES:
:CREATED: [2026-02-14 09:00:00]
:SOURCE: WhatsApp
:END:
```

## Emacs Integration

HTTP server runs on `http://localhost:3042`:

```elisp
;; Send message to WhatsApp
(let ((url-request-method "POST")
      (url-request-data (json-encode '((message . "tc: My task")))))
  (url-retrieve "http://localhost:3042/send-message" ...))

;; Check status
(url-retrieve "http://localhost:3042/status" ...)
```

## Testing

```bash
node test-crud.js              # 61 tests
node test-heading-level.js     # Heading tests
node test-date-filtering.js    # Date diagnostics
```

## Documentation

- [CRUD_REFERENCE.md](CRUD_REFERENCE.md) - Complete command reference
- [MIGRATION.md](MIGRATION.md) - Migration from v2.0
- [TESTING.md](TESTING.md) - Testing documentation
- [CHANGELOG_CRUD.md](CHANGELOG_CRUD.md) - Version history

## Running as Service

```bash
./manage.sh start     # Start service
./manage.sh stop      # Stop service
./manage.sh restart   # Restart service
./manage.sh status    # Check status
./manage.sh logs      # View logs
```

## Troubleshooting

**Commands not working:**
- Message yourself (self-chat)
- Check command starts with correct acronym
- Verify `myPhoneNumber` in config.js

**Wrong heading level:**
- Update `headingLevel` in config.js

**Date filtering issues:**
- Run `node test-date-filtering.js`
- Verify SCHEDULED format: `<YYYY-MM-DD>`

## License

MIT
