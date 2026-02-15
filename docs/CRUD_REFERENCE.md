# Command Reference

All commands are case insensitive.

## Commands

| Command | Syntax | Description |
|---------|--------|-------------|
| **HELP** | `th` or `help` | Show help |
| **CREATE** | `tc: Title` | Create task |
| | `tcc: Title` | Create task, next messages = comments |
| | `tc: ! Title` | Create with priority [#A] |
| | `tc: Title @YYYY-MM-DD` | Create with date |
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
| | `tsd N: YYYY-MM-DD` | Change task N date |
| | `cu N M: Text` | Update comment M of task N |
| **DELETE** | `td N` | Delete task N |
| | `cd N M` | Delete comment M of task N |

## Valid States

TODO, DONE, HOLD, STARTED, CANCELED, SOMEDAY, CHECK

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

## Configuration

Edit `.env` file:
- `MY_PHONE_NUMBER` - Your WhatsApp number (required)
- `ORG_FILE_PATH` - Path to org file (required)
- `HEADING_LEVEL=2` - Heading level (1=*, 2=**, 3=***)
- `DEFAULT_SCHEDULED_DAYS=0` - Auto-schedule (0=today, 1=tomorrow, null=none)
- `PARSE_SPECIAL_SYNTAX=true` - Enable ! and @ parsing
