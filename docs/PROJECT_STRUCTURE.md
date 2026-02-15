# Project Structure

## Directory Layout

```
whatsapp-org-tasks/
├── .github/
│   └── workflows/
│       └── test.yml          # GitHub Actions CI/CD
├── docs/                     # Documentation
│   ├── CHANGELOG.md          # Version history
│   ├── CRUD_REFERENCE.md     # Command reference
│   ├── EXAMPLES.md           # Usage examples
│   ├── MIGRATION.md          # Migration guide
│   ├── PROJECT_STRUCTURE.md  # This file
│   ├── QUICKSTART.md         # Quick start guide
│   ├── SETUP.md              # Setup instructions
│   ├── TCC_GUIDE.md          # TCC command guide
│   └── TESTING.md            # Testing documentation
├── src/                      # Source code
│   ├── index.js              # Main application entry
│   ├── commands.js           # Command processing
│   ├── comment-session.js    # TCC session management
│   ├── config.js             # Configuration loader
│   ├── org-editor.js         # Org file editing
│   ├── org-parser.js         # Org file parsing
│   └── task-cache.js         # Task caching
├── test/                     # Test files
│   ├── test.js               # Manual testing utility
│   ├── test-commands.js      # Command tests
│   ├── test-crud.js          # CRUD tests (61 tests)
│   ├── test-tcc.js           # TCC tests (10 tests)
│   ├── test-heading-level.js # Heading level tests (4 tests)
│   └── test-date-filtering.js # Date filtering diagnostics
├── .env                      # Environment variables (git ignored)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── manage.sh                 # Service management script
├── package.json              # NPM package configuration
├── package-lock.json         # NPM lock file
└── README.md                 # Main documentation

# Generated at runtime:
├── .wwebjs_auth/             # WhatsApp session (git ignored)
├── .wwebjs_cache/            # WhatsApp cache (git ignored)
└── .pid                      # Process ID when running as service
```

## Source Code (`src/`)

### Core Files

**`index.js`** - Main application
- WhatsApp client initialization
- Message event handling
- HTTP server for Emacs integration
- Task creation (tc:, tcc:)
- Comment session management

**`commands.js`** - Command processor
- All CRUD command handlers
- Command pattern matching
- Response formatting
- Task caching integration

**`config.js`** - Configuration
- Environment variable loading
- Configuration validation
- Default values
- Type coercion

**`org-editor.js`** - Org file manipulation
- Edit task titles
- Add/update/delete comments
- Change task states
- Update scheduled dates
- Delete tasks

**`org-parser.js`** - Org file parsing
- Parse org-mode format
- Extract tasks with metadata
- Date filtering functions
- Task formatting for WhatsApp

**`task-cache.js`** - Task caching
- Cache tasks per user
- Index-based task retrieval
- Cache management

**`comment-session.js`** - TCC sessions
- Track comment-adding mode
- Session timeout management
- Multi-user support

## Tests (`test/`)

### Test Files

**`test-crud.js`** - Comprehensive CRUD tests
- 61 tests covering all operations
- Command recognition
- Org file operations
- Caching
- Validation
- Error handling
- Integration workflows

**`test-tcc.js`** - TCC functionality
- 10 tests for comment sessions
- Session management
- Comment adding
- Multi-message workflows

**`test-heading-level.js`** - Heading level
- 4 tests for task heading level
- Configuration verification
- File structure validation

**`test-date-filtering.js`** - Date diagnostics
- Date parsing verification
- Timezone handling
- Filter accuracy

**`test-commands.js`** - Command testing
- Command recognition
- Response validation
- Case insensitivity

**`test.js`** - Manual utility
- Interactive task creation
- Testing without WhatsApp
- Development utility

### Running Tests

```bash
npm test                # All main tests
npm run test:crud       # CRUD tests only
npm run test:tcc        # TCC tests only
npm run test:heading    # Heading tests only
npm run test:date       # Date diagnostics
npm run test:commands   # Command tests
npm run test:manual     # Manual utility
```

## Documentation (`docs/`)

### Documentation Files

**`SETUP.md`** - Setup guide
- Installation steps
- Environment configuration
- Troubleshooting

**`CRUD_REFERENCE.md`** - Command reference
- All commands with syntax
- Valid states
- Examples
- Configuration

**`QUICKSTART.md`** - Quick reference
- Install & run
- Command cheat sheet
- Special syntax

**`TCC_GUIDE.md`** - TCC command
- What is TCC
- How it works
- Use cases
- Examples

**`EXAMPLES.md`** - Usage examples
- Common workflows
- Real-world scenarios

**`MIGRATION.md`** - Migration guide
- Old → new command mapping
- Breaking changes

**`TESTING.md`** - Test documentation
- Test coverage
- Running tests

**`CHANGELOG.md`** - Version history
- Feature additions
- Bug fixes
- Breaking changes

## Configuration

### Environment Variables (`.env`)

Required:
- `MY_PHONE_NUMBER` - WhatsApp number
- `ORG_FILE_PATH` - Path to org file

Optional:
- `HTTP_PORT` - Server port (default: 3042)
- `TODO_STATE` - Default state (default: TODO)
- `HEADING_LEVEL` - Task level (default: 2)
- `DEFAULT_SCHEDULED_DAYS` - Auto-schedule (default: 0)
- `PARSE_SPECIAL_SYNTAX` - Enable ! and @ (default: true)
- `INCLUDE_TIMESTAMP` - Add timestamps (default: true)

### Git Ignored Files

- `.env` - Environment variables
- `.wwebjs_auth/` - WhatsApp session
- `.wwebjs_cache/` - WhatsApp cache
- `node_modules/` - Dependencies
- `*.log` - Log files
- `.DS_Store` - macOS files

## Scripts (`package.json`)

```bash
npm start           # Start application
npm run dev         # Start with auto-reload
npm test            # Run all tests
npm run test:crud   # CRUD tests
npm run test:tcc    # TCC tests
npm run test:heading # Heading tests
npm run test:date   # Date diagnostics
npm run test:commands # Command tests
npm run test:manual # Manual utility
```

## Service Management (`manage.sh`)

```bash
./manage.sh start   # Start as background service
./manage.sh stop    # Stop service
./manage.sh restart # Restart service
./manage.sh status  # Check status
./manage.sh logs    # View logs
```

## CI/CD (`.github/workflows/`)

**`test.yml`** - Automated testing
- Runs on push/PR
- Tests on Node 18.x and 20.x
- Creates test environment
- Runs all test suites

## Development Workflow

1. **Make changes** in `src/`
2. **Run tests** with `npm test`
3. **Test manually** with `npm run test:manual "Test message"`
4. **Commit changes** with descriptive message
5. **Push** - CI runs automatically

## Adding New Features

1. Update source in `src/`
2. Add tests in `test/`
3. Update documentation in `docs/`
4. Update `CHANGELOG.md`
5. Run full test suite
6. Update version in `package.json` if needed

## Project Standards

- **ES Modules** - Use `import/export`
- **No semicolons** - Project style
- **Comments** - Document complex logic
- **Tests** - All features must have tests
- **Documentation** - Update docs with changes
- **Git** - Descriptive commit messages

## Version

Current: **v3.1.0**

Total lines of code: ~2500
Total tests: 75
Test coverage: 100%
