# Migration Guide

## Old → New Commands

| Old | New |
|-----|-----|
| `ant: Task` | `tc: Task` |
| `wan list today` | `tl` |
| `wan list tomorrow` | `tlt` |
| `wan list week` | `tlw` |
| `wan list overdue` | `tlo` |
| `wan list all` | `tla` |
| `wan stats` | `ts` |
| `wan help` | `th` or `help` |
| `edt N: Title` | `tu N: Title` |
| `act N: Comment` | `cc N: Comment` |
| `cst N: STATE` | `tst N: STATE` |
| `del N` | `td N` |

## New Features

- `tr N` - Show task details
- `tsd N: DATE` - Change scheduled date
- `cu N M: Text` - Update comment
- `cd N M` - Delete comment

## Example Workflow

Old:
```
ant: Buy groceries
wan list today
edt 1: Buy milk
act 1: Organic
cst 1: DONE
```

New:
```
tc: Buy groceries
tl
tu 1: Buy milk
cc 1: Organic
tst 1: DONE
```

Average typing reduction: 60%
