/**
 * utils.js - DOM Helpers, Loaders, and Error Handlers
 * Utility functions for rendering loading states, error messages, and DOM manipulation
 */

/**
 * Show loading skeleton in a container
 * @param {HTMLElement} container - Container element to show loader
 * @param {number} count - Number of skeleton items to show
 */
function showLoadingSkeleton(container, count = 3) {
  if (!container) return;
  
  container.innerHTML = '';
  
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'glass-unified p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl animate-pulse';
    skeleton.innerHTML = `
      <div class="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
    `;
    container.appendChild(skeleton);
  }
}

/**
 * Show error message in a container
 * @param {HTMLElement} container - Container element to show error
 * @param {string} message - Error message to display
 */
function showError(container, message = 'Failed to load data. Please try again later.') {
  if (!container) return;
  
  container.innerHTML = `
    <div class="glass-unified p-8 rounded-2xl shadow-xl text-center">
      <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p class="text-gray-600 mb-4">${escapeHTML(message)}</p>
      <button onclick="location.reload()" 
              class="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
        Retry
      </button>
    </div>
  `;
}

/**
 * Show empty state message in a container
 * @param {HTMLElement} container - Container element to show empty state
 * @param {string} message - Empty state message
 */
function showEmptyState(container, message = 'No items found.') {
  if (!container) return;
  
  container.innerHTML = `
    <div class="glass-unified p-8 rounded-2xl shadow-xl text-center">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Nothing here yet</h3>
      <p class="text-gray-600">${escapeHTML(message)}</p>
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHTML(str) {
  if (!str) return '';
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date (e.g., "Jan 8, 2026")
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text with ellipsis
 */
function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get URL query parameter
 * @param {string} param - Parameter name
 * @returns {string|null} - Parameter value or null
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Smooth scroll to element
 * @param {string} selector - CSS selector
 */
function smoothScrollTo(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showLoadingSkeleton,
    showError,
    showEmptyState,
    escapeHTML,
    formatDate,
    truncateText,
    getQueryParam,
    smoothScrollTo,
    debounce,
  };
}
