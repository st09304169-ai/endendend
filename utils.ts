
// Simple unique ID generator to avoid external dependencies
export const generateId = (): string => {
  // Use crypto.randomUUID if available (Modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
