#!/usr/bin/env node

/**
 * Test command processing without WhatsApp connection
 * Usage: node test-commands.js
 */

import { processCommand } from './commands.js';

const testCommands = [
  // Help commands
  'th',
  'help',

  // Read commands (listing)
  'tl',
  'tlt',
  'tlw',
  'tlo',
  'tla',
  'ts',
  'tr 1',

  // Update commands
  'tu 1: Updated title',
  'tst 1: DONE',
  'tsd 1: 2026-02-20',

  // Comment commands
  'cc 1: This is a comment',
  'cu 1 1: Updated comment',
  'cd 1 1',

  // Delete command
  'td 1',

  // Case insensitivity tests
  'TL',
  'Tl',
  'TU 1: Title',
  'CC 1: Comment'
];

console.log('🧪 Testing WhatsApp Commands\n');
console.log('=' .repeat(60));

for (const cmd of testCommands) {
  console.log(`\n📤 Command: "${cmd}"`);
  console.log('-'.repeat(60));
  try {
    const response = await processCommand(cmd);
    if (response) {
      console.log(response);
    } else {
      console.log('(No response - not a recognized command)');
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
  console.log('='.repeat(60));
}

console.log('\n✅ Command testing complete!');
