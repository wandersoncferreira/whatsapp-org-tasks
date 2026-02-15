#!/usr/bin/env node

/**
 * Test that tasks are created with correct heading level
 */

import { config } from '../src/config.js';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';

console.log('🧪 Testing Task Heading Level\n');
console.log('='.repeat(70));

// Test file
const testFile = './test-heading.org';

// Simulate the createTodoEntry function
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

  // Build org entry with configured heading level
  const stars = '*'.repeat(config.headingLevel || 1);
  let entry = `\n${stars} ${config.todoState}${priority} ${content}`;

  if (scheduled) {
    entry += scheduled;
  }

  if (config.includeTimestamp) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    entry += `\n:PROPERTIES:\n:CREATED: [${timestamp}]\n:SOURCE: WhatsApp\n:END:`;
  }

  entry += '\n';

  return entry;
}

// Test cases
const testCases = [
  { input: 'Simple task', expectedStars: '**' },
  { input: '! Priority task', expectedStars: '**' },
  { input: 'Task with date @2026-03-15', expectedStars: '**' },
];

let passed = 0;
let failed = 0;

console.log(`📊 Config heading level: ${config.headingLevel}`);
console.log(`📊 Expected stars: ${'*'.repeat(config.headingLevel)}\n`);

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: "${testCase.input}"`);

  const entry = createTodoEntry(testCase.input);
  const lines = entry.split('\n');
  const taskLine = lines.find(line => line.match(/^\*+\s+TODO/));

  if (taskLine) {
    const starsMatch = taskLine.match(/^(\*+)/);
    const actualStars = starsMatch ? starsMatch[1] : '';

    if (actualStars === testCase.expectedStars) {
      console.log(`  ✅ Correct: ${actualStars} TODO ...`);
      passed++;
    } else {
      console.log(`  ❌ Wrong: Expected "${testCase.expectedStars}" but got "${actualStars}"`);
      console.log(`  Full line: ${taskLine}`);
      failed++;
    }
  } else {
    console.log(`  ❌ No task line found in entry:`);
    console.log(entry);
    failed++;
  }
  console.log();
});

// Test the actual file structure
console.log('='.repeat(70));
console.log('📝 Testing file creation\n');

writeFileSync(testFile, '* Tasks\n', 'utf8');
const entry1 = createTodoEntry('Test task 1');
const entry2 = createTodoEntry('! Priority task 2');
const entry3 = createTodoEntry('Scheduled task @2026-03-20');

writeFileSync(testFile, '* Tasks\n' + entry1 + entry2 + entry3, 'utf8');

const content = readFileSync(testFile, 'utf8');
console.log('Generated file content:');
console.log('-'.repeat(70));
console.log(content);
console.log('-'.repeat(70));

// Verify structure
const lines = content.split('\n');
const taskLines = lines.filter(line => line.match(/^\*+\s+(TODO|DONE)/));

console.log(`\nFound ${taskLines.length} task lines:`);
taskLines.forEach((line, idx) => {
  const starsMatch = line.match(/^(\*+)/);
  const stars = starsMatch ? starsMatch[1] : '';
  const level = stars.length;
  console.log(`  ${idx + 1}. Level ${level} (${stars}): ${line.substring(0, 50)}`);
});

// Verify all tasks are level 2
const allLevel2 = taskLines.every(line => {
  const starsMatch = line.match(/^(\*+)/);
  return starsMatch && starsMatch[1] === '**';
});

if (allLevel2) {
  console.log('\n✅ All tasks created with correct heading level (**)\n');
  passed++;
} else {
  console.log('\n❌ Some tasks have wrong heading level\n');
  failed++;
}

// Cleanup
unlinkSync(testFile);

// Results
console.log('='.repeat(70));
console.log('📊 Test Results\n');
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log(`\n❌ ${failed} test(s) failed`);
  process.exit(1);
}
