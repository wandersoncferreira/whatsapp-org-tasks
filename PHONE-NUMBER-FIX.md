# Phone Number Configuration Fix

## Problem

Tasks were being created from **any** WhatsApp message you sent, not just messages sent to yourself.

## Solution

Added explicit phone number configuration to ensure only messages sent TO YOURSELF create tasks.

## Changes Made

### 1. Configuration (`config.js`)

Added required field:
```javascript
myPhoneNumber: '5511966428772'  // Your WhatsApp number
```

**Format:** Country code + area code + number (no spaces, +, or dashes)

### 2. Message Detection (`index.js`)

Improved self-message detection:

**Before:**
```javascript
const isSelfMessage = contact.isMe || chat.isGroup === false && contact.id.user === client.info.wid.user;
```

**After:**
```javascript
// Check if chat is with your own number
const chatUser = chat.id.user || chat.id._serialized?.split('@')[0];
const myNumber = config.myPhoneNumber;
const isSelfChat = chatUser === myNumber;

// Also verify message is from you (outgoing)
if (!message.fromMe) return;
```

### 3. Validation on Startup

When the app starts, it now shows:
```
✅ WhatsApp client is ready!
📱 Detected phone number: 5511966428772
📱 Configured phone number: 5511966428772
📝 Monitoring messages to: 5511966428772
```

If numbers don't match, you'll see:
```
⚠️  WARNING: Detected phone number does not match configured number!
   Please update config.myPhoneNumber to: 'XXXXXXXXXX'
```

### 4. Debug Logging

Added helpful logs:
- `Skipping message - not a self-chat (chat: X, my number: Y)` - Message not to yourself
- `Skipping message - not from me` - Incoming message (shouldn't happen with self-chat)

### 5. Test Tool

Created `test-phone-config.js` to validate configuration:
```bash
./manage.sh check
```

or

```bash
node test-phone-config.js
```

Shows:
- ✅ If phone number format is valid
- Country code detection
- Formatted number display
- What chat IDs will match

## How to Use

### 1. Configure Your Number

Edit `config.js`:
```javascript
myPhoneNumber: '5511966428772'  // No spaces, +, or -
```

### 2. Check Configuration

```bash
./manage.sh check
```

### 3. Start Service

```bash
npm start
```

### 4. Verify on Startup

Look for:
```
✅ WhatsApp client is ready!
📱 Detected phone number: 5511966428772
📱 Configured phone number: 5511966428772
```

Numbers should match!

## Now Messages Are Only Processed When:

1. ✅ Chat is with YOUR phone number (self-chat)
2. ✅ Message is FROM you (outgoing, `message.fromMe`)
3. ✅ Not a group message
4. ✅ Message starts with `ant:` or is a `wan` command

## What Gets Filtered Out:

- ❌ Messages to other people
- ❌ Messages from other people to you
- ❌ Group messages
- ❌ Messages without proper prefix

## Testing

### Test Task Creation
```bash
./manage.sh test "ant: Test task"
```

### Test Commands
```bash
node test-commands.js
```

### Test Phone Config
```bash
./manage.sh check
```

## Files Modified

1. `config.js` - Added `myPhoneNumber` field
2. `index.js` - Updated message detection logic
3. `manage.sh` - Added `check` command
4. `test-phone-config.js` - New validation tool
5. `README.md` - Updated configuration docs
6. `QUICKSTART.md` - Added setup instructions

## Your Configuration

```
Phone: +55 11 96642-8772
Formatted for config: 5511966428772
Chat ID: 5511966428772@c.us
```

Already configured correctly in your `config.js`! ✅
