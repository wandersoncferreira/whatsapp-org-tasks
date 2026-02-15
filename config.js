import { homedir } from 'os';
import { join } from 'path';

export const config = {
  // Path to your org-mode tasks file
  orgFile: join(homedir(), 'Documents/notes/notes/20251028165605-tasks.org'),

  // Your phone number (used to detect self-messages)
  // Format: country code + area code + number (no spaces, dashes, or +)
  // Example: '5511966428772' for +55 11 96642-8772
  myPhoneNumber: '5511966428772',

  // Default TODO state
  todoState: 'TODO',

  // Optional: Default scheduled offset in days (e.g., 0 = today, 1 = tomorrow)
  // Set to null to not auto-schedule
  defaultScheduledDays: 0,

  // Include timestamp in TODO entry
  includeTimestamp: true,

  // Parse special syntax:
  // - Lines starting with "!" become priority [#A]
  // - Lines with @YYYY-MM-DD become SCHEDULED
  parseSpecialSyntax: true,

  // Heading level for new tasks (1 = *, 2 = **, 3 = ***, etc.)
  headingLevel: 2,

  // HTTP server port for Emacs integration
  httpPort: 3042
};
