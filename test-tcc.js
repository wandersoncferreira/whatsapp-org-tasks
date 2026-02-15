#!/usr/bin/env node

/**
 * Test TCC (Task Create with Comments) functionality
 */

import { startCommentSession, hasCommentSession, getCommentSession, endCommentSession, clearAllSessions } from './comment-session.js';
import { parseOrgFile } from './org-parser.js';
import { addTaskComment } from './org-editor.js';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';

console.log('🧪 Testing TCC (Task Create with Comments)\n');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    passed++;
    console.log(`✅ ${description}`);
  } catch (error) {
    failed++;
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
  }
}

const testFile = './test-tcc.org';
const userId = 'test-user';

// Create test org file
const testContent = `* Tasks
** TODO Test Task 1
SCHEDULED: <2026-02-15>
:PROPERTIES:
:CREATED: [2026-02-15 10:00:00]
:SOURCE: WhatsApp
:END:
`;

writeFileSync(testFile, testContent, 'utf8');

// ============================================================================
// Section 1: Comment Session Management
// ============================================================================

console.log('\n📋 Section 1: Comment Session Management');
console.log('-'.repeat(70));

test('User has no session initially', () => {
  const hasSession = hasCommentSession(userId);
  if (hasSession) throw new Error('Should not have session');
});

test('Start comment session', () => {
  const todos = parseOrgFile(testFile);
  const task = todos[0];
  startCommentSession(userId, task);

  const hasSession = hasCommentSession(userId);
  if (!hasSession) throw new Error('Should have session');
});

test('Get comment session', () => {
  const session = getCommentSession(userId);
  if (!session) throw new Error('Should return session');
  if (!session.task) throw new Error('Session should have task');
  if (!session.startTime) throw new Error('Session should have startTime');
});

test('End comment session', () => {
  endCommentSession(userId);
  const hasSession = hasCommentSession(userId);
  if (hasSession) throw new Error('Should not have session after ending');
});

test('Get null for non-existent session', () => {
  const session = getCommentSession('non-existent-user');
  if (session !== null) throw new Error('Should return null');
});

// ============================================================================
// Section 2: Comment Adding
// ============================================================================

console.log('\n💬 Section 2: Comment Adding');
console.log('-'.repeat(70));

test('Add comment to task in session', () => {
  const todos = parseOrgFile(testFile);
  const task = todos[0];

  startCommentSession(userId, task);

  // Add comment
  addTaskComment(testFile, task, 'First comment');

  // Verify comment was added
  const content = readFileSync(testFile, 'utf8');
  if (!content.includes('First comment')) {
    throw new Error('Comment not added');
  }
});

test('Add multiple comments', () => {
  const session = getCommentSession(userId);
  if (!session) throw new Error('No active session');

  addTaskComment(testFile, session.task, 'Second comment');
  addTaskComment(testFile, session.task, 'Third comment');

  const content = readFileSync(testFile, 'utf8');
  if (!content.includes('Second comment')) {
    throw new Error('Second comment not added');
  }
  if (!content.includes('Third comment')) {
    throw new Error('Third comment not added');
  }
});

test('End session after adding comments', () => {
  endCommentSession(userId);
  const hasSession = hasCommentSession(userId);
  if (hasSession) throw new Error('Session should be ended');
});

// ============================================================================
// Section 3: Session Cleanup
// ============================================================================

console.log('\n🧹 Section 3: Session Cleanup');
console.log('-'.repeat(70));

test('Clear all sessions', () => {
  const todos = parseOrgFile(testFile);
  const task = todos[0];

  // Start multiple sessions
  startCommentSession('user1', task);
  startCommentSession('user2', task);
  startCommentSession('user3', task);

  clearAllSessions();

  const has1 = hasCommentSession('user1');
  const has2 = hasCommentSession('user2');
  const has3 = hasCommentSession('user3');

  if (has1 || has2 || has3) {
    throw new Error('All sessions should be cleared');
  }
});

// ============================================================================
// Section 4: Workflow Simulation
// ============================================================================

console.log('\n🔄 Section 4: Workflow Simulation');
console.log('-'.repeat(70));

test('Complete TCC workflow', () => {
  // Reset file
  writeFileSync(testFile, testContent, 'utf8');

  // Simulate: User creates task with tcc
  const todos = parseOrgFile(testFile);
  const task = todos[0];

  // Start session (simulating tcc: command)
  startCommentSession(userId, task);

  // User sends messages (should become comments)
  addTaskComment(testFile, task, 'Buy milk');
  addTaskComment(testFile, task, 'Buy eggs');
  addTaskComment(testFile, task, 'Buy bread');

  // User sends a command (should end session)
  endCommentSession(userId);

  // Verify
  const content = readFileSync(testFile, 'utf8');

  if (!content.includes('Buy milk')) throw new Error('Missing comment 1');
  if (!content.includes('Buy eggs')) throw new Error('Missing comment 2');
  if (!content.includes('Buy bread')) throw new Error('Missing comment 3');

  if (hasCommentSession(userId)) {
    throw new Error('Session should be ended');
  }
});

// ============================================================================
// Cleanup
// ============================================================================

if (existsSync(testFile)) {
  unlinkSync(testFile);
}

clearAllSessions();

// ============================================================================
// Results
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('📊 Test Results');
console.log('='.repeat(70));

const total = passed + failed;
const percentage = ((passed / total) * 100).toFixed(1);

console.log(`\nTotal Tests: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Success Rate: ${percentage}%`);

if (failed === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log(`\n❌ ${failed} test(s) failed`);
  process.exit(1);
}
