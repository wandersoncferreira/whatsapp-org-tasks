# Quick Start

## Install & Run

```bash
cd ~/Documents/code/whatsapp-org-tasks
npm install
npm start
```

## First Time Setup

1. Scan QR code with WhatsApp (Settings → Linked Devices)
2. Update `config.js` with your phone number
3. Message yourself on WhatsApp

## Commands Cheat Sheet

```
tc: Task title          # Create task
tcc: Task title         # Create task + add comments mode
tl                      # List today
tu 1: New title         # Update task 1
tst 1: DONE            # Mark done
cc 1: Comment          # Add comment
td 1                   # Delete task 1
th                     # Help
```

## Special Syntax

```
tc: ! Priority task             # [#A] priority
tc: Meeting @2026-03-15         # Scheduled date
tc: ! Important @2026-03-20     # Both
```

## Run as Service

```bash
./manage.sh start
./manage.sh logs
```

See [README.md](README.md) for full documentation.
