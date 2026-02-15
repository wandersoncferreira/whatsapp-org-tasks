import { readFileSync } from 'fs';

/**
 * Parse org-mode TODO entries from file
 */
export function parseOrgFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const todos = [];
  let currentTodo = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match TODO entries (e.g., "** TODO Task title" or "* TODO Task")
    const todoMatch = line.match(/^(\*+)\s+(TODO|DONE|HOLD|STARTED|CANCELED|SOMEDAY|CHECK)\s+(\[#[A-Z]\]\s+)?(.*)/);

    if (todoMatch) {
      // Save previous todo if exists
      if (currentTodo) {
        todos.push(currentTodo);
      }

      const [, stars, state, priority, title] = todoMatch;
      currentTodo = {
        level: stars.length,
        state,
        priority: priority ? priority.trim() : null,
        title: title.trim(),
        scheduled: null,
        deadline: null,
        tags: [],
        properties: {},
        closed: null
      };

      // Extract tags from title
      const tagsMatch = title.match(/(.*?)\s+(:[a-zA-Z0-9:]+:)\s*$/);
      if (tagsMatch) {
        currentTodo.title = tagsMatch[1].trim();
        currentTodo.tags = tagsMatch[2].split(':').filter(t => t);
      }
    } else if (currentTodo) {
      // Parse metadata lines
      const scheduledMatch = line.match(/SCHEDULED:\s*<([^>]+)>/);
      if (scheduledMatch) {
        currentTodo.scheduled = parseOrgDate(scheduledMatch[1]);
      }

      const deadlineMatch = line.match(/DEADLINE:\s*<([^>]+)>/);
      if (deadlineMatch) {
        currentTodo.deadline = parseOrgDate(deadlineMatch[1]);
      }

      const closedMatch = line.match(/CLOSED:\s*\[([^\]]+)\]/);
      if (closedMatch) {
        currentTodo.closed = parseOrgDate(closedMatch[1]);
      }

      // Check if we're starting a new top-level item
      if (line.match(/^\* [^*]/)) {
        todos.push(currentTodo);
        currentTodo = null;
      }
    }
  }

  // Add last todo
  if (currentTodo) {
    todos.push(currentTodo);
  }

  return todos;
}

/**
 * Parse org-mode date string to Date object
 * Creates date in local timezone (not UTC) for proper comparison
 */
function parseOrgDate(dateStr) {
  // Handle formats like "2026-02-15" or "2026-02-15 Sat" or "2026-02-15 Sat 10:00"
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    // Create date in local timezone by using Date constructor with components
    // Month is 0-indexed in JavaScript
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  return null;
}

/**
 * Filter TODOs by date
 */
export function filterByDate(todos, targetDate) {
  const target = new Date(targetDate || new Date());
  target.setHours(0, 0, 0, 0);

  return todos.filter(todo => {
    if (!todo.scheduled && !todo.deadline) return false;

    const taskDate = todo.scheduled || todo.deadline;
    if (!taskDate) return false;

    // Create a copy to avoid mutating the original date
    const taskDateCopy = new Date(taskDate);
    taskDateCopy.setHours(0, 0, 0, 0);
    return taskDateCopy.getTime() === target.getTime();
  });
}

/**
 * Filter TODOs by date range
 */
export function filterByDateRange(todos, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return todos.filter(todo => {
    if (!todo.scheduled && !todo.deadline) return false;

    const taskDate = todo.scheduled || todo.deadline;
    if (!taskDate) return false;

    return taskDate >= start && taskDate <= end;
  });
}

/**
 * Get overdue TODOs
 */
export function getOverdue(todos) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return todos.filter(todo => {
    if (todo.state !== 'TODO') return false;

    const taskDate = todo.scheduled || todo.deadline;
    if (!taskDate) return false;

    return taskDate < today;
  });
}

/**
 * Format TODO for WhatsApp display
 */
export function formatTodoForWhatsApp(todo) {
  let msg = '';

  // Priority indicator
  if (todo.priority) {
    msg += '⚡ ';
  }

  // State emoji
  const stateEmoji = {
    'TODO': '☐',
    'DONE': '✓',
    'HOLD': '⏸',
    'STARTED': '▶',
    'CANCELED': '✗',
    'SOMEDAY': '💭',
    'CHECK': '🔍'
  };
  msg += `${stateEmoji[todo.state] || '○'} `;

  // Title
  msg += todo.title;

  // Date info
  if (todo.scheduled) {
    msg += ` 📅 ${formatDate(todo.scheduled)}`;
  }
  if (todo.deadline) {
    msg += ` ⏰ ${formatDate(todo.deadline)}`;
  }

  // Tags
  if (todo.tags.length > 0) {
    msg += ` 🏷️ ${todo.tags.join(', ')}`;
  }

  return msg;
}

/**
 * Format date for display
 */
function formatDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return date.toISOString().split('T')[0];
  }
}
