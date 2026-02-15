# Setup Guide

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your details:

```bash
# Required: Your WhatsApp phone number
# Format: country code + number (no spaces, dashes, or +)
# Example: 5511988766787
MY_PHONE_NUMBER=your_phone_number_here

# Required: Path to your org-mode tasks file
# Example: /Users/username/Documents/notes/tasks.org
ORG_FILE_PATH=/path/to/your/tasks.org

# Optional: HTTP server port (default: 3042)
HTTP_PORT=3042
```

### 3. Start the Application

```bash
npm start
```

### 4. Authenticate WhatsApp

1. A QR code will appear in your terminal
2. Open WhatsApp on your phone
3. Go to Settings → Linked Devices → Link a Device
4. Scan the QR code
5. Done! The session will persist

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `MY_PHONE_NUMBER` | Your WhatsApp number | `5511988766789` |
| `ORG_FILE_PATH` | Path to org file | `/Users/you/notes/tasks.org` |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `HTTP_PORT` | `3042` | HTTP server port |
| `TODO_STATE` | `TODO` | Default task state |
| `HEADING_LEVEL` | `2` | Heading level (1=*, 2=**, 3=***) |
| `DEFAULT_SCHEDULED_DAYS` | `0` | Days to schedule (0=today, 1=tomorrow) |
| `PARSE_SPECIAL_SYNTAX` | `true` | Enable ! and @ parsing |
| `INCLUDE_TIMESTAMP` | `true` | Add timestamp to tasks |

## Troubleshooting

### "ORG_FILE_PATH is required"

Make sure `.env` file exists and contains:
```bash
ORG_FILE_PATH=/full/path/to/tasks.org
```

### "MY_PHONE_NUMBER is required"

Make sure `.env` file exists and contains:
```bash
MY_PHONE_NUMBER=5511988766789
```

### Phone number format

- ✅ Correct: `5511988766789`
- ❌ Wrong: `+55 11 98876-6789 `

## Security Notes

- `.env` is in `.gitignore` - it will NOT be committed
- Never share your `.env` file
- Never commit `.env` to version control
- Use `.env.example` as template for others

## Running as Service

After configuration, you can run as a service:

```bash
./manage.sh start
./manage.sh status
./manage.sh logs
```

See [README.md](README.md) for full documentation.
