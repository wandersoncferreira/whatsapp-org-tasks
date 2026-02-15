import { parseOrgFile, filterByDate, filterByDateRange, getOverdue, formatTodoForWhatsApp } from './org-parser.js';
import { config } from './config.js';
import { cacheTasksForUser, getTaskFromCache } from './task-cache.js';
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

/**
 * Process command and return response
 */
export async function processCommand(messageText, userId = 'default') {
  const text = messageText.toLowerCase().trim();
  const originalText = messageText.trim();

  // Help command
  if (text === 'th' || text === 'help' || text.match(/^th\s/) || text.match(/^help\s/)) {
    return getHelpMessage();
  }

  // Task List commands (READ)
  if (text === 'tl' || text.match(/^tl\s/)) {
    return await listTodayTasks(userId);
  }
  if (text === 'tlt' || text.match(/^tlt\s/)) {
    return await listTomorrowTasks(userId);
  }
  if (text === 'tlw' || text.match(/^tlw\s/)) {
    return await listWeekTasks(userId);
  }
  if (text === 'tlo' || text.match(/^tlo\s/)) {
    return await listOverdueTasks(userId);
  }
  if (text === 'tla' || text.match(/^tla\s/)) {
    return await listAllTasks(userId);
  }

  // Task Stats (READ)
  if (text === 'ts' || text.match(/^ts\s/)) {
    return await getStats();
  }

  // Task Read: "tr 2" - show task details
  const taskReadMatch = originalText.match(/^tr\s+(\d+)$/i);
  if (taskReadMatch) {
    const [, index] = taskReadMatch;
    return await readTask(userId, parseInt(index));
  }

  // Task Update: "tu 2: New title"
  const taskUpdateMatch = originalText.match(/^tu\s+(\d+):\s*(.+)$/i);
  if (taskUpdateMatch) {
    const [, index, newTitle] = taskUpdateMatch;
    return await editTitle(userId, parseInt(index), newTitle);
  }

  // Task State: "tst 2: DONE"
  const taskStateMatch = originalText.match(/^tst\s+(\d+):\s*(\w+)$/i);
  if (taskStateMatch) {
    const [, index, newStatus] = taskStateMatch;
    return await changeStatus(userId, parseInt(index), newStatus);
  }

  // Task Scheduled Date: "tsd 2: 2026-02-20"
  const taskDateMatch = originalText.match(/^tsd\s+(\d+):\s*(\d{4}-\d{2}-\d{2})$/i);
  if (taskDateMatch) {
    const [, index, newDate] = taskDateMatch;
    return await changeDate(userId, parseInt(index), newDate);
  }

  // Task Delete: "td 2"
  const taskDeleteMatch = originalText.match(/^td\s+(\d+)$/i);
  if (taskDeleteMatch) {
    const [, index] = taskDeleteMatch;
    return await deleteTaskByIndex(userId, parseInt(index));
  }

  // Comment Create: "cc 2: My comment"
  const commentCreateMatch = originalText.match(/^cc\s+(\d+):\s*(.+)$/i);
  if (commentCreateMatch) {
    const [, index, comment] = commentCreateMatch;
    return await addComment(userId, parseInt(index), comment);
  }

  // Comment Update: "cu 2 1: Updated comment" (task 2, comment 1)
  const commentUpdateMatch = originalText.match(/^cu\s+(\d+)\s+(\d+):\s*(.+)$/i);
  if (commentUpdateMatch) {
    const [, taskIndex, commentIndex, newComment] = commentUpdateMatch;
    return await updateComment(userId, parseInt(taskIndex), parseInt(commentIndex), newComment);
  }

  // Comment Delete: "cd 2 1" (task 2, comment 1)
  const commentDeleteMatch = originalText.match(/^cd\s+(\d+)\s+(\d+)$/i);
  if (commentDeleteMatch) {
    const [, taskIndex, commentIndex] = commentDeleteMatch;
    return await deleteComment(userId, parseInt(taskIndex), parseInt(commentIndex));
  }

  return null; // Not a command
}

/**
 * Get help message
 */
function getHelpMessage() {
  return `*WhatsApp Org Tasks - CRUD Commands* 📋

*HELP:*
• \`th\` or \`help\` → Show this help

*CREATE (C):*
• \`tc: Task title\` → Task Create
• \`tcc: Task title\` → Task Create with Comments (next messages = comments)
• \`tc: ! Urgent\` → Priority [#A]
• \`tc: Meeting @2026-02-20\` → Custom date
• \`cc 2: Comment\` → Comment Create (task 2)

*READ (R):*
• \`tl\` → Task List today
• \`tlt\` → Task List tomorrow
• \`tlw\` → Task List week
• \`tlo\` → Task List overdue
• \`tla\` → Task List all
• \`ts\` → Task Stats
• \`tr 2\` → Task Read (show details of task 2)

*UPDATE (U):*
• \`tu 2: New title\` → Task Update title
• \`tst 2: DONE\` → Task STate change
• \`tsd 2: 2026-02-20\` → Task Scheduled Date
• \`cu 2 1: Updated\` → Comment Update (task 2, comment 1)

*DELETE (D):*
• \`td 2\` → Task Delete
• \`cd 2 1\` → Comment Delete (task 2, comment 1)

*Valid States:*
TODO, DONE, HOLD, STARTED, CANCELED, SOMEDAY, CHECK

*Example Workflow:*
\`\`\`
tc: Buy groceries
tl
tu 1: Buy groceries and milk
cc 1: Get organic milk
tst 1: DONE
\`\`\`

✨ All commands are case insensitive
📝 Tasks saved to your org file`;
}

/**
 * List today's tasks
 */
async function listTodayTasks(userId) {
  try {
    const todos = parseOrgFile(config.orgFile);
    const today = filterByDate(todos.filter(t => t.state === 'TODO'), new Date());

    if (today.length === 0) {
      return '✨ No tasks scheduled for today!';
    }

    // Cache tasks for editing
    cacheTasksForUser(userId, today);

    let msg = `*Today's Tasks* (${today.length}) 📅\n\n`;
    today.forEach((todo, index) => {
      msg += `${index + 1}. ${formatTodoForWhatsApp(todo)}\n`;
    });

    return msg;
  } catch (error) {
    return `❌ Error reading tasks: ${error.message}`;
  }
}

/**
 * List tomorrow's tasks
 */
async function listTomorrowTasks(userId) {
  try {
    const todos = parseOrgFile(config.orgFile);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tasks = filterByDate(todos.filter(t => t.state === 'TODO'), tomorrow);

    if (tasks.length === 0) {
      return '✨ No tasks scheduled for tomorrow!';
    }

    // Cache tasks for editing
    cacheTasksForUser(userId, tasks);

    let msg = `*Tomorrow's Tasks* (${tasks.length}) 📅\n\n`;
    tasks.forEach((todo, index) => {
      msg += `${index + 1}. ${formatTodoForWhatsApp(todo)}\n`;
    });

    return msg;
  } catch (error) {
    return `❌ Error reading tasks: ${error.message}`;
  }
}

/**
 * List this week's tasks
 */
async function listWeekTasks(userId) {
  try {
    const todos = parseOrgFile(config.orgFile);
    const today = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + 7);

    const tasks = filterByDateRange(
      todos.filter(t => t.state === 'TODO'),
      today,
      endOfWeek
    );

    if (tasks.length === 0) {
      return '✨ No tasks scheduled for this week!';
    }

    // Cache tasks for editing
    cacheTasksForUser(userId, tasks);

    let msg = `*This Week's Tasks* (${tasks.length}) 📅\n\n`;
    tasks.forEach((todo, index) => {
      msg += `${index + 1}. ${formatTodoForWhatsApp(todo)}\n`;
    });

    return msg;
  } catch (error) {
    return `❌ Error reading tasks: ${error.message}`;
  }
}

/**
 * List overdue tasks
 */
async function listOverdueTasks(userId) {
  try {
    const todos = parseOrgFile(config.orgFile);
    const overdue = getOverdue(todos);

    if (overdue.length === 0) {
      return '✨ No overdue tasks!';
    }

    // Cache tasks for editing
    cacheTasksForUser(userId, overdue);

    let msg = `*Overdue Tasks* (${overdue.length}) ⚠️\n\n`;
    overdue.forEach((todo, index) => {
      msg += `${index + 1}. ${formatTodoForWhatsApp(todo)}\n`;
    });

    return msg;
  } catch (error) {
    return `❌ Error reading tasks: ${error.message}`;
  }
}

/**
 * List all open tasks
 */
async function listAllTasks(userId) {
  try {
    const todos = parseOrgFile(config.orgFile);
    const openTasks = todos.filter(t => t.state === 'TODO');

    if (openTasks.length === 0) {
      return '✨ No open tasks!';
    }

    // Limit to 20 tasks to avoid overwhelming
    const limit = 20;
    const tasks = openTasks.slice(0, limit);

    // Cache tasks for editing
    cacheTasksForUser(userId, tasks);

    let msg = `*All Open Tasks* (showing ${tasks.length} of ${openTasks.length}) 📋\n\n`;
    tasks.forEach((todo, index) => {
      msg += `${index + 1}. ${formatTodoForWhatsApp(todo)}\n`;
    });

    if (openTasks.length > limit) {
      msg += `\n... and ${openTasks.length - limit} more`;
    }

    return msg;
  } catch (error) {
    return `❌ Error reading tasks: ${error.message}`;
  }
}

/**
 * Get task statistics
 */
async function getStats() {
  try {
    const todos = parseOrgFile(config.orgFile);

    const total = todos.length;
    const byState = {};
    todos.forEach(todo => {
      byState[todo.state] = (byState[todo.state] || 0) + 1;
    });

    const openTasks = todos.filter(t => t.state === 'TODO');
    const today = filterByDate(openTasks, new Date());
    const overdue = getOverdue(todos);

    let msg = `*Task Statistics* 📊\n\n`;
    msg += `Total: ${total}\n`;
    msg += `Open (TODO): ${byState.TODO || 0}\n`;
    msg += `Done: ${byState.DONE || 0}\n`;
    msg += `Today: ${today.length}\n`;
    msg += `Overdue: ${overdue.length}\n\n`;

    if (byState.HOLD) msg += `On Hold: ${byState.HOLD}\n`;
    if (byState.STARTED) msg += `In Progress: ${byState.STARTED}\n`;
    if (byState.SOMEDAY) msg += `Someday: ${byState.SOMEDAY}\n`;

    return msg;
  } catch (error) {
    return `❌ Error reading tasks: ${error.message}`;
  }
}

/**
 * Edit task title
 */
async function editTitle(userId, index, newTitle) {
  try {
    const task = getTaskFromCache(userId, index);
    if (!task) {
      return `❌ Task ${index} not found. Please list tasks first.`;
    }

    editTaskTitle(config.orgFile, task, newTitle);
    return `✅ Updated task ${index} title to: "${newTitle}"`;
  } catch (error) {
    return `❌ Error editing task: ${error.message}`;
  }
}

/**
 * Add comment to task
 */
async function addComment(userId, index, comment) {
  try {
    const task = getTaskFromCache(userId, index);
    if (!task) {
      return `❌ Task ${index} not found. Please list tasks first.`;
    }

    addTaskComment(config.orgFile, task, comment);
    return `✅ Added comment to task ${index}`;
  } catch (error) {
    return `❌ Error adding comment: ${error.message}`;
  }
}

/**
 * Change task status
 */
async function changeStatus(userId, index, newStatus) {
  try {
    const task = getTaskFromCache(userId, index);
    if (!task) {
      return `❌ Task ${index} not found. Please list tasks first.`;
    }

    const validStates = ['TODO', 'DONE', 'HOLD', 'STARTED', 'CANCELED', 'SOMEDAY', 'CHECK'];
    const upperStatus = newStatus.toUpperCase();

    if (!validStates.includes(upperStatus)) {
      return `❌ Invalid status. Valid: ${validStates.join(', ')}`;
    }

    changeTaskState(config.orgFile, task, upperStatus);
    return `✅ Changed task ${index} status to: ${upperStatus}`;
  } catch (error) {
    return `❌ Error changing status: ${error.message}`;
  }
}

/**
 * Delete task
 */
async function deleteTaskByIndex(userId, index) {
  try {
    const task = getTaskFromCache(userId, index);
    if (!task) {
      return `❌ Task ${index} not found. Please list tasks first.`;
    }

    deleteTask(config.orgFile, task);
    return `✅ Deleted task ${index}: "${task.title}"`;
  } catch (error) {
    return `❌ Error deleting task: ${error.message}`;
  }
}

/**
 * Read task details (show full info including comments)
 */
async function readTask(userId, index) {
  try {
    const task = getTaskFromCache(userId, index);
    if (!task) {
      return `❌ Task ${index} not found. Please list tasks first.`;
    }

    // Get comments
    const comments = getTaskComments(config.orgFile, task);

    let msg = `*Task ${index} Details:*\n\n`;
    msg += `*Title:* ${task.title}\n`;
    msg += `*State:* ${task.state}\n`;
    if (task.priority) msg += `*Priority:* ${task.priority}\n`;
    if (task.scheduled) {
      const dateStr = task.scheduled.toISOString().split('T')[0];
      msg += `*Scheduled:* ${dateStr}\n`;
    }
    if (task.tags.length > 0) msg += `*Tags:* ${task.tags.join(', ')}\n`;

    if (comments.length > 0) {
      msg += `\n*Comments (${comments.length}):*\n`;
      comments.forEach((comment, idx) => {
        msg += `${idx + 1}. [${comment.timestamp}] ${comment.text}\n`;
      });
    } else {
      msg += `\n_No comments_`;
    }

    return msg;
  } catch (error) {
    return `❌ Error reading task: ${error.message}`;
  }
}

/**
 * Change task scheduled date
 */
async function changeDate(userId, index, newDate) {
  try {
    const task = getTaskFromCache(userId, index);
    if (!task) {
      return `❌ Task ${index} not found. Please list tasks first.`;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      return `❌ Invalid date format. Use YYYY-MM-DD (e.g., 2026-02-20)`;
    }

    changeScheduledDate(config.orgFile, task, newDate);
    return `✅ Changed task ${index} scheduled date to: ${newDate}`;
  } catch (error) {
    return `❌ Error changing date: ${error.message}`;
  }
}

/**
 * Update comment
 */
async function updateComment(userId, taskIndex, commentIndex, newComment) {
  try {
    const task = getTaskFromCache(userId, taskIndex);
    if (!task) {
      return `❌ Task ${taskIndex} not found. Please list tasks first.`;
    }

    updateTaskComment(config.orgFile, task, commentIndex, newComment);
    return `✅ Updated comment ${commentIndex} of task ${taskIndex}`;
  } catch (error) {
    return `❌ Error updating comment: ${error.message}`;
  }
}

/**
 * Delete comment
 */
async function deleteComment(userId, taskIndex, commentIndex) {
  try {
    const task = getTaskFromCache(userId, taskIndex);
    if (!task) {
      return `❌ Task ${taskIndex} not found. Please list tasks first.`;
    }

    deleteTaskComment(config.orgFile, task, commentIndex);
    return `✅ Deleted comment ${commentIndex} from task ${taskIndex}`;
  } catch (error) {
    return `❌ Error deleting comment: ${error.message}`;
  }
}
