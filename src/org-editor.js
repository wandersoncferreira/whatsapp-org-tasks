import { readFileSync, writeFileSync } from 'fs';

/**
 * Edit task title in org file
 */
export function editTaskTitle(filePath, task, newTitle) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Find the task line
  const taskLineIndex = findTaskLine(lines, task);
  if (taskLineIndex === -1) {
    throw new Error('Task not found in org file');
  }

  // Parse the task line to preserve state, priority, and tags
  const oldLine = lines[taskLineIndex];
  const match = oldLine.match(/^(\*+\s+)(TODO|DONE|HOLD|STARTED|CANCELED|SOMEDAY|CHECK)(\s+\[#[A-Z]\])?\s+(.*?)(\s+:[a-zA-Z0-9:]+:)?\s*$/);

  if (match) {
    const [, stars, state, priority, , tags] = match;
    lines[taskLineIndex] = `${stars}${state}${priority || ''} ${newTitle}${tags || ''}`;
  } else {
    // Fallback: just replace the title part
    lines[taskLineIndex] = oldLine.replace(task.title, newTitle);
  }

  writeFileSync(filePath, lines.join('\n'), 'utf8');
}

/**
 * Add comment/note to task
 */
export function addTaskComment(filePath, task, comment) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const taskLineIndex = findTaskLine(lines, task);
  if (taskLineIndex === -1) {
    throw new Error('Task not found in org file');
  }

  // Find where to insert the comment (after SCHEDULED/DEADLINE/PROPERTIES)
  let insertIndex = taskLineIndex + 1;

  // Skip metadata lines
  while (insertIndex < lines.length) {
    const line = lines[insertIndex].trim();
    if (line.startsWith('SCHEDULED:') ||
        line.startsWith('DEADLINE:') ||
        line.startsWith('CLOSED:') ||
        line.startsWith(':PROPERTIES:') ||
        line.startsWith(':') ||
        line === ':END:') {
      insertIndex++;
    } else if (line.startsWith('*')) {
      // Next task, insert before it
      break;
    } else {
      // Found content area
      break;
    }
  }

  // Add comment with timestamp
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const commentLine = `- [${timestamp}] ${comment}`;

  lines.splice(insertIndex, 0, commentLine);

  writeFileSync(filePath, lines.join('\n'), 'utf8');
}

/**
 * Change task state
 */
export function changeTaskState(filePath, task, newState) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const taskLineIndex = findTaskLine(lines, task);
  if (taskLineIndex === -1) {
    throw new Error('Task not found in org file');
  }

  const oldLine = lines[taskLineIndex];
  const match = oldLine.match(/^(\*+\s+)(TODO|DONE|HOLD|STARTED|CANCELED|SOMEDAY|CHECK)(\s+.*)/);

  if (match) {
    const [, stars, , rest] = match;
    lines[taskLineIndex] = `${stars}${newState.toUpperCase()}${rest}`;

    // Add CLOSED timestamp if state is DONE
    if (newState.toUpperCase() === 'DONE') {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const closedLine = `CLOSED: [${timestamp}]`;

      // Check if there's already a SCHEDULED/DEADLINE line
      if (taskLineIndex + 1 < lines.length &&
          (lines[taskLineIndex + 1].includes('SCHEDULED:') ||
           lines[taskLineIndex + 1].includes('DEADLINE:'))) {
        lines[taskLineIndex + 1] = closedLine + ' ' + lines[taskLineIndex + 1];
      } else {
        lines.splice(taskLineIndex + 1, 0, closedLine);
      }
    }
  }

  writeFileSync(filePath, lines.join('\n'), 'utf8');
}

/**
 * Find task line index in lines array
 */
function findTaskLine(lines, task) {
  // Build a pattern to match the task
  // We need to match: state, priority (optional), title, and tags (optional)
  const escapedTitle = escapeRegExp(task.title);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line contains the task state and title
    if (line.includes(task.state) && line.includes(task.title)) {
      // Verify it's actually a task line (starts with *)
      if (line.match(/^\*+\s+/)) {
        // Additional verification: check if scheduled date matches (if available)
        if (task.scheduled) {
          // Look ahead for SCHEDULED line
          const nextFewLines = lines.slice(i + 1, i + 5).join('\n');
          const scheduledStr = task.scheduled.toISOString().split('T')[0];
          if (nextFewLines.includes(scheduledStr)) {
            return i;
          }
        } else {
          return i;
        }
      }
    }
  }

  return -1;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Delete task from org file
 */
export function deleteTask(filePath, task) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const taskLineIndex = findTaskLine(lines, task);
  if (taskLineIndex === -1) {
    throw new Error('Task not found in org file');
  }

  // Find the end of this task (next heading at same or higher level)
  const taskLevel = lines[taskLineIndex].match(/^\*+/)[0].length;
  let endIndex = taskLineIndex + 1;

  while (endIndex < lines.length) {
    const line = lines[endIndex];
    const headingMatch = line.match(/^(\*+)\s/);

    if (headingMatch && headingMatch[1].length <= taskLevel) {
      // Found next task at same or higher level
      break;
    }
    endIndex++;
  }

  // Remove the task and its content
  lines.splice(taskLineIndex, endIndex - taskLineIndex);

  writeFileSync(filePath, lines.join('\n'), 'utf8');
}

/**
 * Change task scheduled date
 */
export function changeScheduledDate(filePath, task, newDate) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const taskLineIndex = findTaskLine(lines, task);
  if (taskLineIndex === -1) {
    throw new Error('Task not found in org file');
  }

  // Find scheduled line or insert position
  let scheduledLineIndex = -1;
  let insertIndex = taskLineIndex + 1;

  // Look for existing SCHEDULED line
  for (let i = taskLineIndex + 1; i < lines.length && i < taskLineIndex + 10; i++) {
    const line = lines[i].trim();

    if (line.startsWith('SCHEDULED:')) {
      scheduledLineIndex = i;
      break;
    }

    // Stop at next task or end of metadata
    if (line.startsWith('*') || (line.startsWith('-') && !line.startsWith('- ['))) {
      break;
    }

    // Track last metadata line
    if (line.startsWith('CLOSED:') || line.startsWith('DEADLINE:') || line === ':END:') {
      insertIndex = i + 1;
    }
  }

  const scheduledLine = `SCHEDULED: <${newDate}>`;

  if (scheduledLineIndex !== -1) {
    // Update existing SCHEDULED line
    lines[scheduledLineIndex] = scheduledLine;
  } else {
    // Insert new SCHEDULED line
    lines.splice(insertIndex, 0, scheduledLine);
  }

  writeFileSync(filePath, lines.join('\n'), 'utf8');
}

/**
 * Get all comments from a task
 * Returns array of {index, text, timestamp}
 */
export function getTaskComments(filePath, task) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const taskLineIndex = findTaskLine(lines, task);
  if (taskLineIndex === -1) {
    throw new Error('Task not found in org file');
  }

  const comments = [];
  const taskLevel = lines[taskLineIndex].match(/^\*+/)[0].length;

  // Scan lines after task heading
  for (let i = taskLineIndex + 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop at next heading
    const headingMatch = line.match(/^(\*+)\s/);
    if (headingMatch && headingMatch[1].length <= taskLevel) {
      break;
    }

    // Parse comment lines: - [timestamp] text
    const commentMatch = line.match(/^-\s+\[([^\]]+)\]\s+(.+)$/);
    if (commentMatch) {
      comments.push({
        lineIndex: i,
        timestamp: commentMatch[1],
        text: commentMatch[2]
      });
    }
  }

  return comments;
}

/**
 * Update a specific comment in task
 */
export function updateTaskComment(filePath, task, commentIndex, newComment) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const comments = getTaskComments(filePath, task);

  if (commentIndex < 1 || commentIndex > comments.length) {
    throw new Error(`Comment ${commentIndex} not found (task has ${comments.length} comments)`);
  }

  const comment = comments[commentIndex - 1];
  const lineIndex = comment.lineIndex;

  // Update comment preserving timestamp
  lines[lineIndex] = `- [${comment.timestamp}] ${newComment}`;

  writeFileSync(filePath, lines.join('\n'), 'utf8');
}

/**
 * Delete a specific comment from task
 */
export function deleteTaskComment(filePath, task, commentIndex) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const comments = getTaskComments(filePath, task);

  if (commentIndex < 1 || commentIndex > comments.length) {
    throw new Error(`Comment ${commentIndex} not found (task has ${comments.length} comments)`);
  }

  const comment = comments[commentIndex - 1];
  lines.splice(comment.lineIndex, 1);

  writeFileSync(filePath, lines.join('\n'), 'utf8');
}
