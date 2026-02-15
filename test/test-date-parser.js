/**
 * Unit tests for natural language date parsing
 */

import { parseDate, extractDate, getDateExamples } from '../src/date-parser.js';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';

// Test configuration
const TEST_ORG_FILE = './test-dates.org';
let testCount = 0;
let passCount = 0;

/**
 * Test helpers
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayStr() {
  return formatDate(new Date());
}

function getTomorrowStr() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return formatDate(date);
}

function getDaysFromNowStr(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

function getNextWeekdayStr(weekday) {
  const weekdays = {
    'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
    'thursday': 4, 'friday': 5, 'saturday': 6
  };
  const targetDay = weekdays[weekday.toLowerCase()];
  const today = new Date();
  const currentDay = today.getDay();

  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) {
    daysUntil += 7; // Next week
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  return formatDate(nextDate);
}

function test(name, fn) {
  testCount++;
  try {
    fn();
    passCount++;
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

/**
 * Test Suite 1: parseDate() - Basic date formats
 */
console.log('\n=== Test Suite 1: parseDate() - Basic Formats ===\n');

test('parseDate("today") returns today\'s date', () => {
  const result = parseDate('today');
  const expected = getTodayStr();
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("tomorrow") returns tomorrow\'s date', () => {
  const result = parseDate('tomorrow');
  const expected = getTomorrowStr();
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("TODAY") is case insensitive', () => {
  const result = parseDate('TODAY');
  const expected = getTodayStr();
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("TOMORROW") is case insensitive', () => {
  const result = parseDate('TOMORROW');
  const expected = getTomorrowStr();
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("2026-02-20") returns ISO date', () => {
  const result = parseDate('2026-02-20');
  assertEqual(result, '2026-02-20');
});

test('parseDate("invalid") returns null', () => {
  const result = parseDate('invalid');
  assertEqual(result, null);
});

test('parseDate(null) returns null', () => {
  const result = parseDate(null);
  assertEqual(result, null);
});

test('parseDate("") returns null', () => {
  const result = parseDate('');
  assertEqual(result, null);
});

/**
 * Test Suite 2: parseDate() - Relative dates
 */
console.log('\n=== Test Suite 2: parseDate() - Relative Dates ===\n');

test('parseDate("today+3") returns 3 days from now', () => {
  const result = parseDate('today+3');
  const expected = getDaysFromNowStr(3);
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("today +7") handles space before +', () => {
  const result = parseDate('today +7');
  const expected = getDaysFromNowStr(7);
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("today+0") returns today', () => {
  const result = parseDate('today+0');
  const expected = getTodayStr();
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("today+1") returns tomorrow', () => {
  const result = parseDate('today+1');
  const expected = getTomorrowStr();
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("in 5 days") returns 5 days from now', () => {
  const result = parseDate('in 5 days');
  const expected = getDaysFromNowStr(5);
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("in 1 day") returns tomorrow', () => {
  const result = parseDate('in 1 day');
  const expected = getTomorrowStr();
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

/**
 * Test Suite 3: parseDate() - Weekdays
 */
console.log('\n=== Test Suite 3: parseDate() - Weekdays ===\n');

test('parseDate("next monday") returns next Monday', () => {
  const result = parseDate('next monday');
  const expected = getNextWeekdayStr('monday');
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("next friday") returns next Friday', () => {
  const result = parseDate('next friday');
  const expected = getNextWeekdayStr('friday');
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("next SUNDAY") is case insensitive', () => {
  const result = parseDate('next SUNDAY');
  const expected = getNextWeekdayStr('sunday');
  assertEqual(result, expected, `Expected ${expected}, got ${result}`);
});

test('parseDate("next tuesday") returns next Tuesday', () => {
  const result = parseDate('next tuesday');
  assert(result !== null, 'Result should not be null');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(result), 'Result should be valid date format');
});

test('parseDate("this monday") returns this week\'s Monday', () => {
  const result = parseDate('this monday');
  assert(result !== null, 'Result should not be null');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(result), 'Result should be valid date format');
});

test('parseDate("this friday") returns this week\'s Friday', () => {
  const result = parseDate('this friday');
  assert(result !== null, 'Result should not be null');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(result), 'Result should be valid date format');
});

/**
 * Test Suite 4: extractDate() - Date extraction from text
 */
console.log('\n=== Test Suite 4: extractDate() - Date Extraction ===\n');

test('extractDate("Meeting @tomorrow") extracts date and cleans text', () => {
  const result = extractDate('Meeting @tomorrow');
  assertEqual(result.text, 'Meeting');
  assertEqual(result.date, getTomorrowStr());
});

test('extractDate("Call John @next monday") extracts date', () => {
  const result = extractDate('Call John @next monday');
  assertEqual(result.text, 'Call John');
  const expectedDate = getNextWeekdayStr('monday');
  assertEqual(result.date, expectedDate);
});

test('extractDate("Review @2026-02-20") extracts ISO date', () => {
  const result = extractDate('Review @2026-02-20');
  assertEqual(result.text, 'Review');
  assertEqual(result.date, '2026-02-20');
});

test('extractDate("Task @today+3") extracts relative date', () => {
  const result = extractDate('Task @today+3');
  assertEqual(result.text, 'Task');
  assertEqual(result.date, getDaysFromNowStr(3));
});

test('extractDate("#tomorrow urgent meeting") supports # syntax', () => {
  const result = extractDate('#tomorrow urgent meeting');
  assertEqual(result.text, 'urgent meeting');
  assertEqual(result.date, getTomorrowStr());
});

test('extractDate("No date here") returns null date', () => {
  const result = extractDate('No date here');
  assertEqual(result.text, 'No date here');
  assertEqual(result.date, null);
});

test('extractDate("Invalid @xxx date") returns null date', () => {
  const result = extractDate('Invalid @xxx date');
  assertEqual(result.text, 'Invalid @xxx date');
  assertEqual(result.date, null);
});

test('extractDate("") handles empty string', () => {
  const result = extractDate('');
  assertEqual(result.text, '');
  assertEqual(result.date, null);
});

/**
 * Test Suite 5: extractDate() - Multiple date patterns
 */
console.log('\n=== Test Suite 5: extractDate() - Edge Cases ===\n');

test('extractDate("Meeting@tomorrow") handles no space', () => {
  const result = extractDate('Meeting@tomorrow');
  assertEqual(result.text, 'Meeting');
  assertEqual(result.date, getTomorrowStr());
});

test('extractDate("@today Task title") handles date at start', () => {
  const result = extractDate('@today Task title');
  assertEqual(result.text, 'Task title');
  assertEqual(result.date, getTodayStr());
});

test('extractDate("Buy milk @tomorrow please") extracts from middle', () => {
  const result = extractDate('Buy milk @tomorrow please');
  assertEqual(result.text, 'Buy milk please');
  assertEqual(result.date, getTomorrowStr());
});

test('extractDate("@in 5 days start project") handles "in N days"', () => {
  const result = extractDate('@in 5 days start project');
  assertEqual(result.text, 'start project');
  assertEqual(result.date, getDaysFromNowStr(5));
});

/**
 * Test Suite 6: getDateExamples() - Documentation
 */
console.log('\n=== Test Suite 6: getDateExamples() ===\n');

test('getDateExamples() returns array of examples', () => {
  const examples = getDateExamples();
  assert(Array.isArray(examples), 'Should return an array');
  assert(examples.length > 0, 'Should have at least one example');
});

test('getDateExamples() has valid structure', () => {
  const examples = getDateExamples();
  examples.forEach(ex => {
    assert(ex.input, 'Each example should have input');
    assert(ex.description, 'Each example should have description');
  });
});

test('getDateExamples() includes all major patterns', () => {
  const examples = getDateExamples();
  const inputs = examples.map(ex => ex.input);

  assert(inputs.includes('today'), 'Should include "today"');
  assert(inputs.includes('tomorrow'), 'Should include "tomorrow"');
  assert(inputs.some(i => i.includes('today+')), 'Should include "today+N"');
  assert(inputs.some(i => i.includes('next')), 'Should include "next weekday"');
  assert(inputs.some(i => i.includes('this')), 'Should include "this weekday"');
  assert(inputs.some(i => i.includes('in')), 'Should include "in N days"');
  assert(inputs.some(i => /^\d{4}-\d{2}-\d{2}$/.test(i)), 'Should include ISO format');
});

/**
 * Test Suite 7: Integration - Real-world scenarios
 */
console.log('\n=== Test Suite 7: Integration - Real Scenarios ===\n');

test('Scenario: Create task with tomorrow date', () => {
  const taskText = 'Buy groceries @tomorrow';
  const result = extractDate(taskText);

  assertEqual(result.text, 'Buy groceries');
  assertEqual(result.date, getTomorrowStr());
});

test('Scenario: Create urgent task for next Monday', () => {
  const taskText = '! Important meeting @next monday';
  const result = extractDate(taskText);

  assertEqual(result.text, '! Important meeting');
  const expectedDate = getNextWeekdayStr('monday');
  assertEqual(result.date, expectedDate);
});

test('Scenario: Task scheduled 7 days from now', () => {
  const taskText = 'Review project @today+7';
  const result = extractDate(taskText);

  assertEqual(result.text, 'Review project');
  assertEqual(result.date, getDaysFromNowStr(7));
});

test('Scenario: Task with specific ISO date', () => {
  const taskText = 'Conference @2026-03-15';
  const result = extractDate(taskText);

  assertEqual(result.text, 'Conference');
  assertEqual(result.date, '2026-03-15');
});

test('Scenario: Task for today', () => {
  const taskText = 'Urgent fix @today';
  const result = extractDate(taskText);

  assertEqual(result.text, 'Urgent fix');
  assertEqual(result.date, getTodayStr());
});

/**
 * Test Summary
 */
console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passCount}/${testCount} passed`);
console.log('='.repeat(50) + '\n');

if (passCount === testCount) {
  console.log('✅ All tests passed!\n');
  process.exit(0);
} else {
  console.log(`❌ ${testCount - passCount} test(s) failed\n`);
  process.exit(1);
}
