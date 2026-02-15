#!/usr/bin/env node

/**
 * Comprehensive CRUD Command Tests
 * Tests all CREATE, READ, UPDATE, DELETE operations
 * Usage: node test-crud.js
 */

import { processCommand } from './commands.js';
import { parseOrgFile, filterByDate } from './org-parser.js';
import { config } from './config.js';
import { cacheTasksForUser, getTaskFromCache, clearCacheForUser } from './task-cache.js';
import {
  editTaskTitle,
  addTaskComment,
  changeTaskState,
  deleteTask,
  changeScheduledDate,
  getTaskComments,
  updateTaskComment,
  deleteTaskComment
} from './org-editor.js';
import { writeFileSync, readFileSync, copyFileSync, unlinkSync, existsSync } from 'fs';

// Test counters
let passed = 0;
let failed = 0;
const userId = 'test-user';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(description, fn) {
  try {
    fn();
    passed++;
    log(`✅ ${description}`, 'green');
  } catch (error) {
    failed++;
    log(`❌ ${description}`, 'red');
    log(`   Error: ${error.message}`, 'red');
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertMatch(text, pattern, message) {
  if (!pattern.test(text)) {
    throw new Error(message || `Expected to match ${pattern}`);
  }
}

function assertIncludes(text, substring, message) {
  if (!text.includes(substring)) {
    throw new Error(message || `Expected to include "${substring}"`);
  }
}

// ============================================================================
// TEST SUITE
// ============================================================================

log('\n🧪 CRUD Command Test Suite', 'cyan');
log('='.repeat(70), 'gray');

// ============================================================================
// SECTION: Command Recognition Tests
// ============================================================================

log('\n📋 Section 1: Command Recognition', 'blue');
log('-'.repeat(70), 'gray');

test('Help command: th', async () => {
  const response = await processCommand('th', userId);
  assert(response !== null, 'Should return response');
  assertIncludes(response, 'CRUD Commands', 'Should contain help text');
});

test('Help command: help', async () => {
  const response = await processCommand('help', userId);
  assert(response !== null, 'Should return response');
  assertIncludes(response, 'CREATE', 'Should contain help sections');
});

test('Help command: case insensitive (TH)', async () => {
  const response = await processCommand('TH', userId);
  assert(response !== null, 'Should work with uppercase');
});

test('Help command: case insensitive (HeLp)', async () => {
  const response = await processCommand('HeLp', userId);
  assert(response !== null, 'Should work with mixed case');
});

test('Task List today: tl', async () => {
  const response = await processCommand('tl', userId);
  assert(response !== null, 'Should return response');
});

test('Task List tomorrow: tlt', async () => {
  const response = await processCommand('tlt', userId);
  assert(response !== null, 'Should return response');
});

test('Task List week: tlw', async () => {
  const response = await processCommand('tlw', userId);
  assert(response !== null, 'Should return response');
});

test('Task List overdue: tlo', async () => {
  const response = await processCommand('tlo', userId);
  assert(response !== null, 'Should return response');
});

test('Task List all: tla', async () => {
  const response = await processCommand('tla', userId);
  assert(response !== null, 'Should return response');
});

test('Task Stats: ts', async () => {
  const response = await processCommand('ts', userId);
  assert(response !== null, 'Should return response');
  assertIncludes(response, 'Statistics', 'Should contain stats');
});

test('Task Read: tr 1', async () => {
  // First list tasks to cache them
  await processCommand('tla', userId);
  const response = await processCommand('tr 1', userId);
  assert(response !== null, 'Should return response');
});

test('Case insensitivity: TL (uppercase)', async () => {
  const response = await processCommand('TL', userId);
  assert(response !== null, 'Should work with uppercase');
});

test('Case insensitivity: Tl (mixed)', async () => {
  const response = await processCommand('Tl', userId);
  assert(response !== null, 'Should work with mixed case');
});

// ============================================================================
// SECTION: Task Update Commands
// ============================================================================

log('\n📝 Section 2: Task Update Commands', 'blue');
log('-'.repeat(70), 'gray');

test('Task Update pattern: tu 1: New title', async () => {
  const response = await processCommand('tu 1: New title', userId);
  assert(response !== null, 'Should recognize tu command');
});

test('Task State pattern: tst 1: DONE', async () => {
  const response = await processCommand('tst 1: DONE', userId);
  assert(response !== null, 'Should recognize tst command');
});

test('Task Scheduled Date pattern: tsd 1: 2026-02-20', async () => {
  const response = await processCommand('tsd 1: 2026-02-20', userId);
  assert(response !== null, 'Should recognize tsd command');
});

test('Task Delete pattern: td 1', async () => {
  const response = await processCommand('td 1', userId);
  assert(response !== null, 'Should recognize td command');
});

test('Task State: case insensitive state (done)', async () => {
  const response = await processCommand('tst 1: done', userId);
  assert(response !== null, 'Should accept lowercase state');
});

test('Task State: case insensitive state (Done)', async () => {
  const response = await processCommand('tst 1: Done', userId);
  assert(response !== null, 'Should accept mixed case state');
});

test('Task Update: case insensitive command (TU)', async () => {
  const response = await processCommand('TU 1: Title', userId);
  assert(response !== null, 'Should work with uppercase command');
});

test('Task Update: case insensitive command (Tu)', async () => {
  const response = await processCommand('Tu 1: Title', userId);
  assert(response !== null, 'Should work with mixed case command');
});

// ============================================================================
// SECTION: Comment Commands
// ============================================================================

log('\n💬 Section 3: Comment Commands', 'blue');
log('-'.repeat(70), 'gray');

test('Comment Create pattern: cc 1: Comment text', async () => {
  const response = await processCommand('cc 1: Comment text', userId);
  assert(response !== null, 'Should recognize cc command');
});

test('Comment Update pattern: cu 1 1: Updated text', async () => {
  const response = await processCommand('cu 1 1: Updated text', userId);
  assert(response !== null, 'Should recognize cu command');
});

test('Comment Delete pattern: cd 1 1', async () => {
  const response = await processCommand('cd 1 1', userId);
  assert(response !== null, 'Should recognize cd command');
});

test('Comment Create: case insensitive (CC)', async () => {
  const response = await processCommand('CC 1: Comment', userId);
  assert(response !== null, 'Should work with uppercase');
});

test('Comment Update: case insensitive (CU)', async () => {
  const response = await processCommand('CU 1 1: Updated', userId);
  assert(response !== null, 'Should work with uppercase');
});

test('Comment Delete: case insensitive (CD)', async () => {
  const response = await processCommand('CD 1 1', userId);
  assert(response !== null, 'Should work with uppercase');
});

// ============================================================================
// SECTION: Invalid Commands
// ============================================================================

log('\n❌ Section 4: Invalid Commands', 'blue');
log('-'.repeat(70), 'gray');

test('Invalid command returns null', async () => {
  const response = await processCommand('invalid command', userId);
  assert(response === null, 'Should return null for invalid command');
});

test('Random text returns null', async () => {
  const response = await processCommand('just some random text', userId);
  assert(response === null, 'Should return null for random text');
});

test('Empty command returns null', async () => {
  const response = await processCommand('', userId);
  assert(response === null, 'Should return null for empty command');
});

// ============================================================================
// SECTION: Org Editor Functions
// ============================================================================

log('\n🔧 Section 5: Org Editor Functions', 'blue');
log('-'.repeat(70), 'gray');

// Create a temporary test org file
const testOrgFile = './test-tasks.org';
const testOrgContent = `
* TODO Test Task 1
SCHEDULED: <2026-02-15>
- [2026-02-14 10:00:00] First comment
- [2026-02-14 11:00:00] Second comment
:PROPERTIES:
:CREATED: [2026-02-14 09:00:00]
:SOURCE: WhatsApp
:END:

* TODO [#A] Test Task 2
SCHEDULED: <2026-02-16>
:PROPERTIES:
:CREATED: [2026-02-14 09:30:00]
:SOURCE: WhatsApp
:END:

* DONE Test Task 3
CLOSED: [2026-02-14 15:00:00]
SCHEDULED: <2026-02-13>
:PROPERTIES:
:CREATED: [2026-02-13 08:00:00]
:SOURCE: WhatsApp
:END:
`;

// Helper to reset test file
function resetTestFile() {
  writeFileSync(testOrgFile, testOrgContent, 'utf8');
}

// Helper to get test task
function getTestTask(title, state = 'TODO') {
  const todos = parseOrgFile(testOrgFile);
  return todos.find(t => t.title === title && t.state === state);
}

// Create test file
resetTestFile();

test('Edit task title', () => {
  const task = getTestTask('Test Task 1');
  assert(task !== undefined, 'Task should exist');

  editTaskTitle(testOrgFile, task, 'Updated Test Task 1');

  const content = readFileSync(testOrgFile, 'utf8');
  assertIncludes(content, 'Updated Test Task 1', 'Should contain new title');
  assert(!content.includes('* TODO Test Task 1\n'), 'Should not contain old title');
});

test('Add comment to task', () => {
  resetTestFile();
  const task = getTestTask('Test Task 2');
  assert(task !== undefined, 'Task should exist');

  addTaskComment(testOrgFile, task, 'New comment added');

  const content = readFileSync(testOrgFile, 'utf8');
  assertIncludes(content, 'New comment added', 'Should contain new comment');
  assertMatch(content, /- \[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] New comment added/, 'Should have timestamp');
});

test('Change task state to DONE', () => {
  resetTestFile();
  const task = getTestTask('Test Task 1');
  assert(task !== undefined, 'Task should exist');

  changeTaskState(testOrgFile, task, 'DONE');

  const content = readFileSync(testOrgFile, 'utf8');
  assertMatch(content, /\* DONE.*Test Task 1/, 'Should be marked as DONE');
  assertIncludes(content, 'CLOSED:', 'Should have CLOSED timestamp');
});

test('Change task state to STARTED', () => {
  resetTestFile();
  const task = getTestTask('Test Task 1');
  assert(task !== undefined, 'Task should exist');

  changeTaskState(testOrgFile, task, 'STARTED');

  const content = readFileSync(testOrgFile, 'utf8');
  assertMatch(content, /\* STARTED.*Test Task 1/, 'Should be marked as STARTED');
});

test('Change scheduled date', () => {
  resetTestFile();
  const task = getTestTask('Test Task 1');
  assert(task !== undefined, 'Task should exist');

  changeScheduledDate(testOrgFile, task, '2026-03-20');

  const content = readFileSync(testOrgFile, 'utf8');
  assertIncludes(content, 'SCHEDULED: <2026-03-20>', 'Should have new scheduled date');
  assert(!content.includes('SCHEDULED: <2026-02-15>'), 'Should not have old date');
});

test('Get task comments', () => {
  resetTestFile();
  const task = getTestTask('Test Task 1');
  assert(task !== undefined, 'Task should exist');

  const comments = getTaskComments(testOrgFile, task);
  assert(comments.length === 2, 'Should have 2 comments');
  assertIncludes(comments[0].text, 'First comment', 'Should have first comment');
  assertIncludes(comments[1].text, 'Second comment', 'Should have second comment');
});

test('Update task comment', () => {
  resetTestFile();
  const task = getTestTask('Test Task 1');
  assert(task !== undefined, 'Task should exist');

  updateTaskComment(testOrgFile, task, 1, 'Updated first comment');

  const content = readFileSync(testOrgFile, 'utf8');
  assertIncludes(content, 'Updated first comment', 'Should have updated comment');
  assert(!content.includes('First comment'), 'Should not have old comment text');
});

test('Delete task comment', () => {
  resetTestFile();
  const task = getTestTask('Test Task 1');
  assert(task !== undefined, 'Task should exist');

  deleteTaskComment(testOrgFile, task, 1);

  const content = readFileSync(testOrgFile, 'utf8');
  assert(!content.includes('First comment'), 'Should not have deleted comment');
  assertIncludes(content, 'Second comment', 'Should still have other comment');
});

test('Delete task', () => {
  resetTestFile();
  const task = getTestTask('Test Task 1');
  assert(task !== undefined, 'Task should exist');

  deleteTask(testOrgFile, task);

  const content = readFileSync(testOrgFile, 'utf8');
  assert(!content.includes('Test Task 1'), 'Should not have deleted task');
  assertIncludes(content, 'Test Task 2', 'Should still have other tasks');
});

// ============================================================================
// SECTION: Task Caching
// ============================================================================

log('\n💾 Section 6: Task Caching', 'blue');
log('-'.repeat(70), 'gray');

test('Cache tasks for user', () => {
  resetTestFile();
  const todos = parseOrgFile(testOrgFile);
  const todoTasks = todos.filter(t => t.state === 'TODO');

  cacheTasksForUser(userId, todoTasks);

  const cached = getTaskFromCache(userId, 1);
  assert(cached !== null, 'Should cache tasks');
  assert(cached.title === 'Test Task 1' || cached.title === 'Test Task 2', 'Should cache correct task');
});

test('Get task from cache by index', () => {
  const task = getTaskFromCache(userId, 1);
  assert(task !== null, 'Should retrieve cached task');
});

test('Get non-existent task returns null', () => {
  const task = getTaskFromCache(userId, 999);
  assert(task === null, 'Should return null for non-existent task');
});

test('Clear cache for user', () => {
  clearCacheForUser(userId);
  const task = getTaskFromCache(userId, 1);
  assert(task === null, 'Should clear cache');
});

// ============================================================================
// SECTION: Date Validation
// ============================================================================

log('\n📅 Section 7: Date Validation', 'blue');
log('-'.repeat(70), 'gray');

test('Valid date format: YYYY-MM-DD', async () => {
  await processCommand('tla', userId); // Cache tasks
  const response = await processCommand('tsd 1: 2026-02-20', userId);
  assert(response !== null, 'Should accept valid date');
});

test('Invalid date format: MM/DD/YYYY', async () => {
  const response = await processCommand('tsd 1: 02/20/2026', userId);
  assertIncludes(response, 'Invalid date format', 'Should reject invalid format');
});

test('Invalid date format: DD-MM-YYYY', async () => {
  const response = await processCommand('tsd 1: 20-02-2026', userId);
  assertIncludes(response, 'Invalid date format', 'Should reject invalid format');
});

test('Invalid date format: no hyphens', async () => {
  const response = await processCommand('tsd 1: 20260220', userId);
  assertIncludes(response, 'Invalid date format', 'Should reject invalid format');
});

// ============================================================================
// SECTION: State Validation
// ============================================================================

log('\n🎯 Section 8: State Validation', 'blue');
log('-'.repeat(70), 'gray');

const validStates = ['TODO', 'DONE', 'HOLD', 'STARTED', 'CANCELED', 'SOMEDAY', 'CHECK'];

for (const state of validStates) {
  test(`Valid state: ${state}`, async () => {
    await processCommand('tla', userId); // Cache tasks
    const response = await processCommand(`tst 1: ${state}`, userId);
    assert(response !== null, `Should accept ${state}`);
  });
}

test('Invalid state: INVALID', async () => {
  const response = await processCommand('tst 1: INVALID', userId);
  assertIncludes(response, 'Invalid status', 'Should reject invalid state');
});

test('Invalid state: COMPLETE', async () => {
  const response = await processCommand('tst 1: COMPLETE', userId);
  assertIncludes(response, 'Invalid status', 'Should reject invalid state');
});

// ============================================================================
// SECTION: Error Handling
// ============================================================================

log('\n⚠️  Section 9: Error Handling', 'blue');
log('-'.repeat(70), 'gray');

test('Task not found error', async () => {
  clearCacheForUser(userId); // Clear cache to ensure no tasks
  const response = await processCommand('tu 1: Title', userId);
  assertIncludes(response, 'not found', 'Should show task not found');
});

test('Comment index out of range', async () => {
  resetTestFile();
  await processCommand('tla', userId); // Cache tasks
  const response = await processCommand('cu 1 999: Comment', userId);
  assertIncludes(response, 'not found', 'Should show comment not found');
});

test('Delete non-existent comment', async () => {
  const response = await processCommand('cd 1 999', userId);
  assertIncludes(response, 'not found', 'Should show comment not found');
});

// ============================================================================
// SECTION: Integration Tests
// ============================================================================

log('\n🔄 Section 10: Integration Tests (Full Workflows)', 'blue');
log('-'.repeat(70), 'gray');

test('Complete workflow: Create, List, Update, Complete', async () => {
  resetTestFile();
  clearCacheForUser(userId);

  // List tasks (cache them)
  const list1 = await processCommand('tla', userId);
  assert(list1 !== null, 'Should list tasks');

  // Update title
  const update = await processCommand('tu 1: Updated Title', userId);
  assertIncludes(update, 'Updated', 'Should update title');

  // Add comment
  const comment = await processCommand('cc 1: Test comment', userId);
  assertIncludes(comment, 'Added comment', 'Should add comment');

  // Mark as done
  const done = await processCommand('tst 1: DONE', userId);
  assertIncludes(done, 'DONE', 'Should mark as done');
});

test('Comment CRUD workflow', async () => {
  resetTestFile();
  clearCacheForUser(userId);

  // List and read task
  await processCommand('tla', userId);
  const read1 = await processCommand('tr 1', userId);
  assert(read1 !== null, 'Should read task');

  // Add comment
  const add = await processCommand('cc 1: New comment', userId);
  assertIncludes(add, 'Added comment', 'Should add comment');

  // Update comment
  const update = await processCommand('cu 1 1: Updated comment', userId);
  assertIncludes(update, 'Updated comment', 'Should update comment');

  // Delete comment
  const del = await processCommand('cd 1 1', userId);
  assertIncludes(del, 'Deleted comment', 'Should delete comment');
});

// ============================================================================
// CLEANUP
// ============================================================================

// Remove test file
if (existsSync(testOrgFile)) {
  unlinkSync(testOrgFile);
}

// ============================================================================
// RESULTS
// ============================================================================

log('\n' + '='.repeat(70), 'gray');
log('📊 Test Results', 'cyan');
log('='.repeat(70), 'gray');

const total = passed + failed;
const percentage = ((passed / total) * 100).toFixed(1);

log(`\nTotal Tests: ${total}`, 'blue');
log(`Passed: ${passed}`, 'green');
log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
log(`Success Rate: ${percentage}%`, percentage === '100.0' ? 'green' : 'yellow');

if (failed === 0) {
  log('\n🎉 All tests passed!', 'green');
  process.exit(0);
} else {
  log(`\n❌ ${failed} test(s) failed`, 'red');
  process.exit(1);
}
