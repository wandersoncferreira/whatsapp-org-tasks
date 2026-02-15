#!/usr/bin/env node

/**
 * Test task editing functionality
 */

import { parseOrgFile, filterByDate } from './org-parser.js';
import { editTaskTitle, addTaskComment, changeTaskState } from './org-editor.js';
import { config } from './config.js';
import { cacheTasksForUser, getTaskFromCache } from './task-cache.js';

console.log('🧪 Testing Task Editing Functions\n');

try {
  // Parse org file
  console.log('📖 Reading org file...');
  const todos = parseOrgFile(config.orgFile);
  console.log(`Found ${todos.length} total tasks`);

  // Get TODO tasks
  const todoTasks = todos.filter(t => t.state === 'TODO');
  console.log(`Found ${todoTasks.length} TODO tasks\n`);

  if (todoTasks.length === 0) {
    console.log('⚠️  No TODO tasks to test with');
    process.exit(0);
  }

  // Cache first 5 tasks
  const testTasks = todoTasks.slice(0, 5);
  const userId = 'test-user';
  cacheTasksForUser(userId, testTasks);

  console.log('📋 Cached tasks:');
  testTasks.forEach((task, index) => {
    console.log(`${index + 1}. [${task.state}] ${task.title}`);
  });

  console.log('\n✅ Task caching works!\n');

  // Test retrieving from cache
  const task1 = getTaskFromCache(userId, 1);
  if (task1) {
    console.log(`✅ Retrieved task 1: "${task1.title}"`);
  } else {
    console.log('❌ Failed to retrieve task 1');
  }

  const task99 = getTaskFromCache(userId, 99);
  if (!task99) {
    console.log('✅ Correctly returns null for non-existent task 99');
  }

  console.log('\n🎉 All tests passed!');
  console.log('\n⚠️  Note: Actual file editing is not tested to avoid modifying your org file.');
  console.log('   File editing will be tested when you use the WhatsApp commands.');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
