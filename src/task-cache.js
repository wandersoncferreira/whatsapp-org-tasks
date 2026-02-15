/**
 * Task cache to track indexed tasks for editing
 * Maps user ID -> array of tasks with indices
 */

const taskCache = new Map();

export function cacheTasksForUser(userId, tasks) {
  taskCache.set(userId, tasks.map((task, index) => ({
    index: index + 1,
    ...task
  })));
}

export function getTaskFromCache(userId, index) {
  const tasks = taskCache.get(userId);
  if (!tasks) return null;
  return tasks.find(t => t.index === index) || null;
}

export function clearCacheForUser(userId) {
  taskCache.delete(userId);
}

export function getCachedTasks(userId) {
  return taskCache.get(userId) || [];
}
