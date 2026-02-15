# Command Reference

All commands are case insensitive.

## Commands

| Command | Syntax | Description |
|---------|--------|-------------|
| **HELP** | `th` or `help` | Show help |
| **CREATE** | `tc: Title` | Create task |
| | `tcc: Title` | Create task, next messages = comments |
| | `tc: ! Title` | Create with priority [#A] |
| | `tc: Title @tomorrow` | Create with natural language date |
| | `tc: Title @next monday` | Create with weekday date |
| | `tc: Title @2026-02-20` | Create with ISO date |
| | `cc N: Text` | Add comment to task N |
| **READ** | `tl` | List today |
| | `tlt` | List tomorrow |
| | `tlw` | List week |
| | `tlo` | List overdue |
| | `tla` | List all |
| | `ts` | Stats |
| | `tr N` | Show task N details |
| **UPDATE** | `tu N: Title` | Update task N title |
| | `tst N: STATE` | Change task N state |
| | `tsd N: tomorrow` | Change task N date (natural language) |
| | `tsd N: next friday` | Change task N date (weekday) |
| | `tsd N: 2026-02-20` | Change task N date (ISO) |
| | `cu N M: Text` | Update comment M of task N |
| **DELETE** | `td N` | Delete task N |
| | `cd N M` | Delete comment M of task N |

## Valid States

TODO, DONE, HOLD, STARTED, CANCELED, SOMEDAY, CHECK

## Date Formats

Natural language dates are supported in task creation (`tc:`, `tcc:`) and date changes (`tsd`):

| Format | Example | Description |
|--------|---------|-------------|
| `today` | `@today` | Today's date |
| `tomorrow` | `@tomorrow` | Tomorrow's date |
| `today+N` | `@today+3` | N days from today |
| `next <weekday>` | `@next monday` | Next occurrence of weekday |
| `this <weekday>` | `@this saturday` | This week's weekday |
| `in N days` | `@in 5 days` | N days from now |
| `YYYY-MM-DD` | `@2026-02-20` | ISO date format |

All date formats are case insensitive and work with both `@` and `#` prefixes.

## Examples

### Basic Workflow
```
tc: Buy groceries
tl
tu 1: Buy groceries and milk
cc 1: Get organic
tst 1: DONE
```

### Create with Comments
```
tcc: Grocery shopping
Milk
Eggs
Bread
tl
```
(Next messages become comments until you send a command)

### Natural Language Dates
```
tc: Meeting @tomorrow
tc: Call John @next monday
tc: Review document @today+3
tc: Conference @in 7 days
tsd 1: next friday
```

## Configuration

Edit `.env` file:
- `MY_PHONE_NUMBER` - Your WhatsApp number (required)
- `ORG_FILE_PATH` - Path to org file (required)
- `HEADING_LEVEL=2` - Heading level (1=*, 2=**, 3=***)
- `DEFAULT_SCHEDULED_DAYS=0` - Auto-schedule (0=today, 1=tomorrow, null=none)
- `PARSE_SPECIAL_SYNTAX=true` - Enable ! and @ parsing
