/**
 * cache.js - Client-Side Caching System
 * Implements localStorage-based caching with TTL (time-to-live)
 */

const CACHE_PREFIX = 'portfolio_cache_';
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {object|null} - Cached data or null if expired/missing
 */
function getCachedData(key) {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Cache read error:', error);
    return null;
  }
}

/**
 * Set cached data
 * @param {string} key - Cache key
 * @param {object} data - Data to cache
 */
function setCachedData(key, data) {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('Cache write error:', error);
  }
}

/**
 * Clear specific cache
 * @param {string} key - Cache key to clear
 */
function clearCache(key) {
  try {
    const cacheKey = CACHE_PREFIX + key;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.warn('Cache clear error:', error);
  }
}

/**
 * Clear all portfolio caches
 */
function clearAllCaches() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Clear all caches error:', error);
  }
}

/**
 * Fetch with cache support
 * Returns cached data immediately if available, then revalidates in background
 * @param {string} cacheKey - Cache identifier
 * @param {Function} fetchFunction - Async function that fetches fresh data
 * @returns {Promise<object>} - Data from cache or fresh fetch
 */
async function fetchWithCache(cacheKey, fetchFunction) {
  // Try to get cached data first
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    // Return cached data immediately
    // Then revalidate in background (stale-while-revalidate)
    fetchFunction().then(freshData => {
      if (freshData.success) {
        setCachedData(cacheKey, freshData.data);
      }
    }).catch(err => console.warn('Background revalidation failed:', err));
    
    return { success: true, data: cached, fromCache: true };
  }
  
  // No cache, fetch fresh data
  const result = await fetchFunction();
  if (result.success) {
    setCachedData(cacheKey, result.data);
  }
  return result;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCachedData,
    setCachedData,
    clearCache,
    clearAllCaches,
    fetchWithCache,
  };
}
