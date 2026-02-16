/**
 * Natural language date parser
 * Supports: today, tomorrow, today+N (where N is any number), next <weekday>, YYYY-MM-DD
 */

/**
 * Parse natural language date to YYYY-MM-DD format
 * @param {string} dateStr - Date string (e.g., "today", "tomorrow", "today+N", "next monday", "2026-02-20")
 *                          Note: N can be any positive integer (1, 2, 5, 10, 30, 100, etc.)
 * @returns {string|null} - Date in YYYY-MM-DD format or null if invalid
 */
export function parseDate(dateStr) {
  if (!dateStr) return null;

  const normalized = dateStr.toLowerCase().trim();

  // Handle ISO date format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  // Handle "today"
  if (normalized === 'today') {
    return formatDate(new Date());
  }

  // Handle "tomorrow"
  if (normalized === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  }

  // Handle "today+N" or "today +N"
  const todayPlusMatch = normalized.match(/^today\s*\+\s*(\d+)$/);
  if (todayPlusMatch) {
    const days = parseInt(todayPlusMatch[1]);
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
  }

  // Handle "next <weekday>"
  const nextWeekdayMatch = normalized.match(/^next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
  if (nextWeekdayMatch) {
    const weekday = nextWeekdayMatch[1];
    return getNextWeekday(weekday);
  }

  // Handle "this <weekday>"
  const thisWeekdayMatch = normalized.match(/^this\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
  if (thisWeekdayMatch) {
    const weekday = thisWeekdayMatch[1];
    return getThisWeekday(weekday);
  }

  // Handle relative days: "in N days"
  const inDaysMatch = normalized.match(/^in\s+(\d+)\s+days?$/);
  if (inDaysMatch) {
    const days = parseInt(inDaysMatch[1]);
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
  }

  return null;
}

/**
 * Get the next occurrence of a weekday
 * @param {string} weekday - Weekday name (monday, tuesday, etc.)
 * @returns {string} - Date in YYYY-MM-DD format
 */
function getNextWeekday(weekday) {
  const weekdays = {
    'sunday': 0,
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6
  };

  const targetDay = weekdays[weekday];
  const today = new Date();
  const currentDay = today.getDay();

  // Calculate days until next occurrence
  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) {
    daysUntil += 7; // Next week
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);

  return formatDate(nextDate);
}

/**
 * Get this week's occurrence of a weekday
 * @param {string} weekday - Weekday name (monday, tuesday, etc.)
 * @returns {string} - Date in YYYY-MM-DD format
 */
function getThisWeekday(weekday) {
  const weekdays = {
    'sunday': 0,
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6
  };

  const targetDay = weekdays[weekday];
  const today = new Date();
  const currentDay = today.getDay();

  // Calculate days until this week's occurrence
  let daysUntil = targetDay - currentDay;
  if (daysUntil < 0) {
    daysUntil += 7; // If already passed, next week
  }

  const date = new Date(today);
  date.setDate(today.getDate() + daysUntil);

  return formatDate(date);
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} - Date in YYYY-MM-DD format
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Extract date from message text
 * Supports @date or #date syntax
 * @param {string} text - Message text
 * @returns {Object} - { text: cleanedText, date: parsedDate }
 */
export function extractDate(text) {
  // Try to match known date patterns
  // Patterns: @today, @tomorrow, @today+N, @next <weekday>, @this <weekday>, @in N days, @YYYY-MM-DD
  const patterns = [
    /@(next\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))/i,
    /@(this\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))/i,
    /@(in\s+\d+\s+days?)/i,
    /@(today\s*\+\s*\d+)/i,
    /@(tomorrow)/i,
    /@(today)/i,
    /@(\d{4}-\d{2}-\d{2})/,
    /#(next\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))/i,
    /#(this\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))/i,
    /#(in\s+\d+\s+days?)/i,
    /#(today\s*\+\s*\d+)/i,
    /#(tomorrow)/i,
    /#(today)/i,
    /#(\d{4}-\d{2}-\d{2})/
  ];

  for (const pattern of patterns) {
    const dateMatch = text.match(pattern);
    if (dateMatch) {
      const dateStr = dateMatch[1].trim();
      const parsedDate = parseDate(dateStr);

      if (parsedDate) {
        // Remove the date from text (including @ or # prefix)
        let cleanText = text.replace(dateMatch[0], '').trim();
        // Normalize multiple spaces to single space
        cleanText = cleanText.replace(/\s+/g, ' ');
        return { text: cleanText, date: parsedDate };
      }
    }
  }

  return { text, date: null };
}

/**
 * Get list of example date formats
 * @returns {Array<Object>} - Examples with description
 */
export function getDateExamples() {
  return [
    { input: 'today', description: 'Today' },
    { input: 'tomorrow', description: 'Tomorrow' },
    { input: 'today+1', description: '1 day from today' },
    { input: 'today+3', description: '3 days from today' },
    { input: 'today+7', description: '7 days from today' },
    { input: 'today+30', description: '30 days from today (any number N works)' },
    { input: 'next monday', description: 'Next Monday' },
    { input: 'next friday', description: 'Next Friday' },
    { input: 'this saturday', description: 'This Saturday' },
    { input: 'in 5 days', description: '5 days from now' },
    { input: '2026-02-20', description: 'Specific date (ISO format)' }
  ];
}
