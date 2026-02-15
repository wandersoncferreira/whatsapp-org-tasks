/**
 * Session management for multi-message comment addition
 * Tracks users who are in "comment mode" after using tcc command
 */

const commentSessions = new Map();

/**
 * Start a comment session for a user
 * @param {string} userId - User identifier
 * @param {Object} task - Task object to add comments to
 */
export function startCommentSession(userId, task) {
  commentSessions.set(userId, {
    task,
    startTime: Date.now()
  });
}

/**
 * Check if user is in comment session
 * @param {string} userId - User identifier
 * @returns {boolean}
 */
export function hasCommentSession(userId) {
  return commentSessions.has(userId);
}

/**
 * Get comment session for user
 * @param {string} userId - User identifier
 * @returns {Object|null} - Session object or null
 */
export function getCommentSession(userId) {
  return commentSessions.get(userId) || null;
}

/**
 * End comment session for user
 * @param {string} userId - User identifier
 */
export function endCommentSession(userId) {
  commentSessions.delete(userId);
}

/**
 * Clear all sessions (for cleanup)
 */
export function clearAllSessions() {
  commentSessions.clear();
}

/**
 * Clean up old sessions (older than 1 hour)
 */
export function cleanupOldSessions() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [userId, session] of commentSessions.entries()) {
    if (session.startTime < oneHourAgo) {
      commentSessions.delete(userId);
    }
  }
}

// Auto-cleanup every 30 minutes
setInterval(cleanupOldSessions, 30 * 60 * 1000);
