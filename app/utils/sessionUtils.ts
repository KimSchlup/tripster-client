/**
 * Utility functions for session management
 */

// Default inactivity timeout in milliseconds (15 minutes)
const DEFAULT_INACTIVITY_TIMEOUT = 15 * 60 * 1000;

// Key for storing last activity timestamp
const LAST_ACTIVITY_KEY = 'lastActivityTimestamp';

/**
 * Updates the last activity timestamp
 */
export const updateLastActivity = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error updating last activity timestamp:', error);
  }
};

/**
 * Checks if the session has timed out due to inactivity
 * @param timeout - Timeout duration in milliseconds (default: 15 minutes)
 * @returns Boolean indicating if the session has timed out
 */
export const hasSessionTimedOut = (
  timeout: number = DEFAULT_INACTIVITY_TIMEOUT
): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivityStr) return false; // No activity recorded yet
    
    const lastActivity = parseInt(lastActivityStr, 10);
    const currentTime = Date.now();
    
    return currentTime - lastActivity > timeout;
  } catch (error) {
    console.error('Error checking session timeout:', error);
    return false;
  }
};

/**
 * Sets up activity tracking to update the last activity timestamp
 * @param events - Array of event names to track (default: common user interaction events)
 */
export const setupActivityTracking = (
  events: string[] = [
    'mousedown',
    'keydown',
    'scroll',
    'touchstart',
    'click',
    'mousemove',
  ]
): () => void => {
  if (typeof window === 'undefined') return () => {};
  
  // Update last activity on initial load
  updateLastActivity();
  
  // Create event handler
  const handleActivity = () => {
    updateLastActivity();
  };
  
  // Add event listeners
  events.forEach((eventName) => {
    globalThis.addEventListener(eventName, handleActivity, { passive: true });
  });
  
  // Return cleanup function
  return () => {
    events.forEach((eventName) => {
      globalThis.removeEventListener(eventName, handleActivity);
    });
  };
};

/**
 * Clears session data
 */
export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
};
