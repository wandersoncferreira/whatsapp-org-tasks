import 'dotenv/config';

export const config = {
  // Path to your org-mode tasks file (from .env)
  orgFile: process.env.ORG_FILE_PATH,

  // Your phone number (from .env)
  myPhoneNumber: process.env.MY_PHONE_NUMBER,

  // Default TODO state
  todoState: process.env.TODO_STATE || 'TODO',

  // Optional: Default scheduled offset in days (e.g., 0 = today, 1 = tomorrow)
  // Set to null to not auto-schedule
  defaultScheduledDays: process.env.DEFAULT_SCHEDULED_DAYS !== undefined
    ? (process.env.DEFAULT_SCHEDULED_DAYS === 'null' ? null : parseInt(process.env.DEFAULT_SCHEDULED_DAYS))
    : 0,

  // Include timestamp in TODO entry
  includeTimestamp: process.env.INCLUDE_TIMESTAMP !== 'false',

  // Parse special syntax:
  // - Lines starting with "!" become priority [#A]
  // - Lines with @YYYY-MM-DD become SCHEDULED
  parseSpecialSyntax: process.env.PARSE_SPECIAL_SYNTAX !== 'false',

  // Heading level for new tasks (1 = *, 2 = **, 3 = ***)
  headingLevel: parseInt(process.env.HEADING_LEVEL) || 2,

  // HTTP server port for Emacs integration
  httpPort: parseInt(process.env.HTTP_PORT) || 3042
};

// Validate required configuration
if (!config.orgFile) {
  throw new Error('ORG_FILE_PATH is required in .env file');
}

if (!config.myPhoneNumber) {
  throw new Error('MY_PHONE_NUMBER is required in .env file');
}
