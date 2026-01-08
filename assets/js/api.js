/**
 * api.js - Centralized Fetch Wrapper
 * Handles all API calls to the backend with proper error handling and response parsing
 */

const API_BASE_URL = 'https://shashankpandey04.netlify.app/v1';

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generic fetch wrapper with error handling and retry logic
 * @param {string} endpoint - API endpoint (e.g., '/blogs', '/projects')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} retryDelay - Initial delay between retries in ms (default: 1000)
 * @returns {Promise<object>} - Parsed JSON response
 */
async function fetchAPI(endpoint, options = {}, maxRetries = 3, retryDelay = 1000) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  let lastError = null;
  
  // Try fetching with retries
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, defaultOptions);
      
      // Check if response is ok (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      
      // Parse JSON response
      const data = await response.json();
      return { success: true, data };
      
    } catch (error) {
      lastError = error;
      console.warn(`API Fetch Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error.message);
      
      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(1.5, attempt); // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  // All retries failed
  console.error('API Fetch Error - All retries exhausted:', lastError);
  return { 
    success: false, 
    error: lastError?.message || 'Failed to fetch data from API' 
  };
}

/**
 * Fetch all blogs
 * GET /v1/blogs
 */
async function fetchBlogs() {
  return await fetchAPI('/blogs');
}

/**
 * Fetch single blog by slug
 * GET /v1/blogs/:slug
 * @param {string} slug - Blog slug
 */
async function fetchBlogBySlug(slug) {
  return await fetchAPI(`/blogs/${slug}`);
}

/**
 * Fetch all projects
 * GET /v1/projects
 */
async function fetchProjects() {
  return await fetchAPI('/projects');
}

/**
 * Fetch featured projects only
 * GET /v1/projects/featured
 */
async function fetchFeaturedProjects() {
  return await fetchAPI('/projects/featured');
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchBlogs,
    fetchBlogBySlug,
    fetchProjects,
    fetchFeaturedProjects,
  };
}
