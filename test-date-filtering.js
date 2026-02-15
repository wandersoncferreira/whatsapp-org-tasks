#!/usr/bin/env node

/**
 * Test date filtering to diagnose "list today" issues
 */

import { parseOrgFile, filterByDate } from './org-parser.js';
import { config } from './config.js';

console.log('🧪 Testing Date Filtering\n');
console.log('='.repeat(70));

// Get current date info
const today = new Date();
const todayStr = today.toISOString().split('T')[0];
console.log(`\n📅 Current date: ${todayStr}`);
console.log(`📅 Current time: ${today.toLocaleString()}`);
console.log(`📅 Timezone offset: UTC${today.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(today.getTimezoneOffset() / 60)}`);

try {
  // Parse org file
  console.log(`\n📖 Reading org file: ${config.orgFile}`);
  const todos = parseOrgFile(config.orgFile);
  console.log(`📋 Found ${todos.length} total tasks`);

  // Count by state
  const todoCount = todos.filter(t => t.state === 'TODO').length;
  const doneCount = todos.filter(t => t.state === 'DONE').length;
  console.log(`   - TODO: ${todoCount}`);
  console.log(`   - DONE: ${doneCount}`);
  console.log(`   - Other: ${todos.length - todoCount - doneCount}`);

  // Get TODO tasks
  const todoTasks = todos.filter(t => t.state === 'TODO');

  // Check tasks with scheduled dates
  const scheduledCount = todoTasks.filter(t => t.scheduled).length;
  console.log(`\n📅 TODO tasks with SCHEDULED date: ${scheduledCount}`);

  if (scheduledCount > 0) {
    console.log('\nScheduled tasks:');
    todoTasks
      .filter(t => t.scheduled)
      .slice(0, 10)  // Show first 10
      .forEach((task, idx) => {
        const dateStr = task.scheduled.toISOString().split('T')[0];
        const isToday = dateStr === todayStr;
        console.log(`  ${idx + 1}. [${task.state}] ${task.title.substring(0, 40)}`);
        console.log(`     SCHEDULED: ${dateStr} ${isToday ? '← TODAY' : ''}`);
      });
  }

  // Filter today's tasks
  console.log(`\n🔍 Filtering tasks for today (${todayStr})...`);
  const todayTasks = filterByDate(todoTasks, today);
  console.log(`📋 Found ${todayTasks.length} tasks scheduled for today`);

  if (todayTasks.length > 0) {
    console.log('\nToday\'s tasks:');
    todayTasks.forEach((task, idx) => {
      console.log(`  ${idx + 1}. [${task.state}] ${task.title.substring(0, 50)}`);
      if (task.scheduled) {
        console.log(`     SCHEDULED: ${task.scheduled.toISOString().split('T')[0]}`);
      }
    });
  } else {
    console.log('\n⚠️  No tasks found for today');
    console.log('\nDiagnostic: Checking all scheduled dates...');

    const allScheduledDates = todoTasks
      .filter(t => t.scheduled)
      .map(t => t.scheduled.toISOString().split('T')[0])
      .sort();

    const uniqueDates = [...new Set(allScheduledDates)];
    console.log(`\nUnique scheduled dates found (${uniqueDates.length}):`);
    uniqueDates.slice(0, 10).forEach(date => {
      const count = allScheduledDates.filter(d => d === date).length;
      const isToday = date === todayStr;
      console.log(`  ${date}: ${count} task(s) ${isToday ? '← TODAY' : ''}`);
    });

    if (uniqueDates.length > 10) {
      console.log(`  ... and ${uniqueDates.length - 10} more dates`);
    }
  }

  // Test filterByDate with explicit today
  console.log(`\n🧪 Testing filterByDate function...`);
  const testToday = new Date();
  testToday.setHours(0, 0, 0, 0);
  console.log(`Test date: ${testToday.toISOString()}`);

  const testResults = filterByDate(todoTasks, testToday);
  console.log(`Result: ${testResults.length} tasks`);

  // Check if there are tasks scheduled for today in raw format
  console.log(`\n🔎 Raw date comparison check...`);
  const todayTimestamp = new Date(todayStr).getTime();
  console.log(`Today timestamp (midnight local): ${todayTimestamp}`);

  todoTasks.filter(t => t.scheduled).slice(0, 5).forEach(task => {
    const taskTimestamp = new Date(task.scheduled).getTime();
    const taskDateStr = task.scheduled.toISOString().split('T')[0];
    console.log(`\nTask: ${task.title.substring(0, 40)}`);
    console.log(`  Scheduled: ${taskDateStr}`);
    console.log(`  Timestamp: ${taskTimestamp}`);
    console.log(`  Match: ${taskTimestamp === todayTimestamp ? 'YES' : 'NO'}`);
    console.log(`  Diff: ${(taskTimestamp - todayTimestamp) / (1000 * 60 * 60)} hours`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('✅ Date filtering diagnostic complete');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
