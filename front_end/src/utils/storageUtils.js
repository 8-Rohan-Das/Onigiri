/**
 * Safe local storage access utilities to prevent application crashes
 * caused by invalid JSON or missing data.
 */

/**
 * Safely parses a JSON string from localStorage.
 * Returns the parsed value or the defaultValue if parsing fails or key doesn't exist.
 * 
 * @param {string} key - The localStorage key to retrieve
 * @param {any} defaultValue - The value to return if retrieval/parsing fails
 * @returns {any} - The parsed value or defaultValue
 */
export const getStoredItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    const parsedItem = JSON.parse(item);
    return parsedItem === null ? defaultValue : parsedItem;
  } catch (error) {
    console.warn(`Error parsing localStorage item "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely retrieves user data from localStorage.
 * Returns an empty object if no user data is found or is invalid.
 * 
 * @returns {Object} - The user object or empty object
 */
export const getStoredUser = () => {
  return getStoredItem('user', {});
};

/**
 * Safely saves a value to localStorage.
 * 
 * @param {string} key - The localStorage key to set
 * @param {any} value - The value to stringify and store
 */
/**
 * Safely saves a value to localStorage.
 * 
 * @param {string} key - The localStorage key to set
 * @param {any} value - The value to stringify and store
 */
export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage "${key}":`, error);
  }
};

/**
 * Safely removes an item from localStorage.
 * 
 * @param {string} key - The localStorage key to remove
 */
export const removeStoredItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error);
  }
};

/**
 * Gets a user-specific storage key by prefixing with user ID.
 * 
 * @param {string} key - The base key
 * @param {string} userId - The user ID (optional, defaults to current user)
 * @returns {string} - User-specific key
 */
export const getUserSpecificKey = (key, userId = null) => {
  const currentUser = userId || getStoredUser().id || 'guest';
  return `${currentUser}_${key}`;
};

/**
 * Gets user-specific item from localStorage.
 * 
 * @param {string} key - The base key
 * @param {any} defaultValue - Default value if not found
 * @param {string} userId - User ID (optional)
 * @returns {any} - The stored value or default
 */
export const getUserStoredItem = (key, defaultValue = null, userId = null) => {
  return getStoredItem(getUserSpecificKey(key, userId), defaultValue);
};

/**
 * Sets user-specific item in localStorage.
 * 
 * @param {string} key - The base key
 * @param {any} value - Value to store
 * @param {string} userId - User ID (optional)
 */
export const setUserStoredItem = (key, value, userId = null) => {
  setStoredItem(getUserSpecificKey(key, userId), value);
};

/**
 * Removes user-specific item from localStorage.
 * 
 * @param {string} key - The base key
 * @param {string} userId - User ID (optional)
 */
export const removeUserStoredItem = (key, userId = null) => {
  removeStoredItem(getUserSpecificKey(key, userId));
};

/**
 * Clears all user-specific data for a user.
 * 
 * @param {string} userId - User ID (optional, defaults to current user)
 */
export const clearUserData = (userId = null) => {
  const targetUserId = userId || getStoredUser().id;
  if (!targetUserId) return;
  
  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Remove keys that start with the user ID
    keys.forEach(key => {
      if (key.startsWith(`${targetUserId}_`)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error(`Error clearing user data for user ${targetUserId}:`, error);
  }
};
