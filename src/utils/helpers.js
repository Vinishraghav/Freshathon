/**
 * Helper utility functions for the application
 */

/**
 * Debounce function to limit how often a function can be called
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to call the function immediately
 * @returns {Function} The debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Throttle function to limit how often a function can be called
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds to limit
 * @returns {Function} The throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Format a number with commas
 * 
 * @param {number} num - The number to format
 * @returns {string} The formatted number
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Truncate a string to a specified length
 * 
 * @param {string} str - The string to truncate
 * @param {number} length - The maximum length
 * @param {string} ending - The ending to append if truncated
 * @returns {string} The truncated string
 */
export const truncateString = (str, length, ending = "...") => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
};

/**
 * Get a random item from an array
 * 
 * @param {Array} array - The array to get a random item from
 * @returns {*} A random item from the array
 */
export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Shuffle an array
 * 
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Group an array of objects by a key
 * 
 * @param {Array} array - The array to group
 * @param {string} key - The key to group by
 * @returns {Object} An object with keys as the grouped values and values as arrays of items
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Check if an object is empty
 * 
 * @param {Object} obj - The object to check
 * @returns {boolean} Whether the object is empty
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Get the difference between two dates in days
 * 
 * @param {Date|string} date1 - The first date
 * @param {Date|string} date2 - The second date
 * @returns {number} The difference in days
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Check if a date is in the past
 * 
 * @param {Date|string} date - The date to check
 * @returns {boolean} Whether the date is in the past
 */
export const isDateInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

/**
 * Check if a date is in the future
 * 
 * @param {Date|string} date - The date to check
 * @returns {boolean} Whether the date is in the future
 */
export const isDateInFuture = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate > today;
};

/**
 * Check if a date is today
 * 
 * @param {Date|string} date - The date to check
 * @returns {boolean} Whether the date is today
 */
export const isDateToday = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate.getTime() === today.getTime();
};

/**
 * Get a date range for a specific period
 * 
 * @param {string} period - The period (today, tomorrow, thisWeek, thisWeekend, thisMonth, nextMonth)
 * @returns {Object} An object with start and end dates
 */
export const getDateRangeForPeriod = (period) => {
  const today = new Date();
  let start = new Date(today);
  let end = new Date(today);
  
  switch (period) {
    case "today":
      // Start and end are both today
      break;
    case "tomorrow":
      start.setDate(today.getDate() + 1);
      end.setDate(today.getDate() + 1);
      break;
    case "thisWeek":
      // Start is today, end is the end of the week (Saturday)
      const daysToWeekend = 6 - today.getDay(); // 6 is Saturday
      end.setDate(today.getDate() + daysToWeekend);
      break;
    case "thisWeekend":
      // Start is the next Saturday (or today if it's already the weekend)
      const day = today.getDay();
      if (day === 0 || day === 6) { // It's already the weekend
        if (day === 0) { // Sunday
          start.setDate(today.getDate() - 1); // Set to Saturday
        }
        end.setDate(start.getDate() + (day === 6 ? 1 : 0)); // End is Sunday
      } else {
        const daysToSaturday = 6 - day;
        start.setDate(today.getDate() + daysToSaturday);
        end.setDate(start.getDate() + 1); // Sunday
      }
      break;
    case "thisMonth":
      // Start is today, end is the last day of the month
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case "nextMonth":
      // Start is the first day of next month, end is the last day of next month
      start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      break;
    default:
      break;
  }
  
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0]
  };
};

/**
 * Generate a unique ID
 * 
 * @returns {string} A unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
