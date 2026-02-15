# Changelog

## v3.2 (2026-02-15)

### New Features
- **Natural language dates**: Support for human-friendly date formats
  - `@today`, `@tomorrow` - Relative dates
  - `@today+3`, `@today+7` - Days from today
  - `@next monday`, `@next friday` - Next weekday
  - `@this saturday` - This week's weekday
  - `@in 5 days` - Days from now
  - `@2026-02-20` - ISO dates (still supported)
  - Works in task creation (`tc:`, `tcc:`) and date changes (`tsd`)
  - Case insensitive

### Testing
- Added 40 comprehensive tests for date parsing
- All date formats validated
- Total: 115 tests, 100% pass rate

## v3.1 (2026-02-15)

### New Features
- **TCC command**: `tcc: Task title` creates task and enters comment mode
  - Next messages automatically added as comments
  - Any command exits comment mode
  - Auto-cleanup old sessions after 1 hour

### Security Improvements
- **Environment variables**: Moved sensitive data to `.env` file
  - Phone number no longer in repository
  - Org file path no longer in repository
  - Added `.env.example` as template
  - Added validation for required variables

### Code Cleanup

### Project Restructure
- **Standard Node.js structure**: Reorganized to industry standards
  - Created `src/` directory for source code
  - Created `test/` directory for test files  
  - Created `docs/` directory for documentation
  - Created `.github/workflows/` for CI/CD
- **GitHub Actions**: Added automated testing
  - Tests run on push and pull requests
  - Multi-version Node.js support (18.x, 20.x)
  - Automatic test environment setup
- **Updated package.json**:
  - Added test scripts for all test suites
  - Updated main entry point to `src/index.js`
  - Added repository metadata
  - Added node engine requirement (>=18.0.0)
- **Documentation improvements**:
  - All docs moved to `docs/` folder
  - Added PROJECT_STRUCTURE.md
  - Added RESTRUCTURE_SUMMARY.md
  - Updated all internal links
  - Added badges to README
- Removed obsolete files (test-editing.js, test-phone-config.js, old CHANGELOG.md, PHONE-NUMBER-FIX.md)
- Removed `triggerKeywords` backward compatibility code
- Consolidated documentation (CHANGELOG_CRUD.md → CHANGELOG.md)
- Removed ~130 lines of unused code
- Updated test.js to use headingLevel config

## v3.0 (2026-02-15)

### New Features
- Complete CRUD operations with short acronyms (tl, tc, tu, etc.)
- Comment management (create, read, update, delete)
- Date rescheduling with `tsd`
- Task details with `tr`
- Case insensitive commands

### Bug Fixes
- **Date filtering**: Fixed timezone issue causing `tl` to miss today's tasks
- **Heading level**: Tasks now created with `**` (configurable)
- **Cache returns**: Consistent null returns

### Breaking Changes
- `ant:` → `tc:`
- `wan list *` → `tl*` (tl, tlt, tlw, tlo, tla)
- `wan stats` → `ts`
- `edt` → `tu`
- `act` → `cc`
- `cst` → `tst`
- `del` → `td`

### Files Changed
- config.js: Added `headingLevel: 2`
- index.js: Updated command detection, fixed task creation
- commands.js: New acronym system, added functions
- org-editor.js: Added date/comment CRUD functions
- org-parser.js: Fixed date parsing for local timezone
- task-cache.js: Fixed null returns

### New Files (v3.1)
- comment-session.js (session management)
- test-tcc.js (10 tests)

### New Files (v3.0)
- test-crud.js (61 tests)
- test-heading-level.js
- test-date-filtering.js
- CRUD_REFERENCE.md
- MIGRATION.md
- TESTING.md

### Testing
- 61 tests, 100% pass rate
- Coverage: commands, org operations, caching, validation

### Performance
- 60% fewer characters to type
- <50ms command processing
- <100ms org parsing (200+ tasks)
