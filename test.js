#!/usr/bin/env node

/**
 * Test script to verify TODO creation without WhatsApp connection
 * Usage: node test.js "Your test message"
 */

import { appendFileSync, existsSync } from 'fs';
import { config } from './config.js';

function createTodoEntry(messageText) {
  let priority = '';
  let scheduled = '';
  let content = messageText;

  if (config.parseSpecialSyntax) {
    // Parse priority (lines starting with !)
    if (content.startsWith('!')) {
      priority = ' [#A]';
      content = content.substring(1).trim();
    }

    // Parse scheduled date (@YYYY-MM-DD)
    const dateMatch = content.match(/@(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      scheduled = `\nSCHEDULED: <${dateMatch[1]}>`;
      content = content.replace(dateMatch[0], '').trim();
    }
  }

  // Default scheduled date if configured
  if (!scheduled && config.defaultScheduledDays !== null) {
    const date = new Date();
    date.setDate(date.getDate() + config.defaultScheduledDays);
    const dateStr = date.toISOString().split('T')[0];
    scheduled = `\nSCHEDULED: <${dateStr}>`;
  }

  // Build org entry
  let entry = `\n* ${config.todoState}${priority} ${content}`;

  if (scheduled) {
    entry += scheduled;
  }

  if (config.includeTimestamp) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    entry += `\n:PROPERTIES:\n:CREATED: [${timestamp}]\n:SOURCE: WhatsApp Test\n:END:`;
  }

  entry += '\n';

  return entry;
}

function appendToOrgFile(entry) {
  try {
    if (!existsSync(config.orgFile)) {
      console.error(`❌ Org file not found: ${config.orgFile}`);
      return false;
    }

    appendFileSync(config.orgFile, entry, 'utf8');
    return true;
  } catch (error) {
    console.error('❌ Error writing to org file:', error);
    return false;
  }
}

// Get message from command line args
const message = process.argv.slice(2).join(' ');

if (!message) {
  console.log('Usage: node test.js "Your test message"');
  console.log('\nExamples:');
  console.log('  node test.js "Buy groceries"');
  console.log('  node test.js "! Important task"');
  console.log('  node test.js "Meeting @2026-02-20"');
  console.log('  node test.js "! Urgent deadline @2026-02-18"');
  process.exit(1);
}

console.log(`\n📝 Testing TODO creation...`);
console.log(`Message: "${message}"`);

const entry = createTodoEntry(message);

console.log('\n📄 Generated org entry:');
console.log('─'.repeat(50));
console.log(entry);
console.log('─'.repeat(50));

if (appendToOrgFile(entry)) {
  console.log(`\n✅ Successfully appended to: ${config.orgFile}`);
  console.log('\nCheck your org file in Emacs to see the new TODO!');
} else {
  console.log('\n❌ Failed to append to org file');
  process.exit(1);
}
