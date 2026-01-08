/**
 * blogs.js - Dynamic Blogs List Rendering
 * Fetches and renders blog cards from the API
 */

/**
 * Render a single blog card
 * @param {object} blog - Blog object from API
 * @param {number} index - Index for animation delay
 * @returns {string} - HTML string for blog card
 */
function renderBlogCard(blog, index = 0) {
  const animationDelay = index > 0 ? `style="animation-delay: ${index * 0.1}s;"` : '';
  
  // Format the date
  const formattedDate = formatDate(blog.createdAt);
  
  // Truncate summary if too long
  const summary = blog.summary 
    ? truncateText(blog.summary, 200)
    : (blog.description ? truncateText(blog.description, 200) : '');
  
  return `
    <div class="glass-unified p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl transition transform hover:bg-white/30 hover:-translate-y-1 hover:saturate-150 opacity-0 translate-y-6 animate-fadeInUp" ${animationDelay}>
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-2xl font-semibold text-gray-900">${escapeHTML(blog.title)}</h3>
        ${formattedDate ? `<span class="text-sm text-gray-500 ml-4 flex-shrink-0">${formattedDate}</span>` : ''}
      </div>
      ${summary ? `<p class="text-gray-700 mb-6 leading-relaxed">${escapeHTML(summary)}</p>` : ''}
      <a href="blog.html?slug=${encodeURIComponent(blog.slug)}" 
         class="inline-flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors">
        Read More
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  `;
}

/**
 * Render all blogs in the container
 * @param {Array} blogs - Array of blog objects
 * @param {HTMLElement} container - Container element
 */
function renderBlogs(blogs, container) {
  if (!container) return;
  
  if (!blogs || blogs.length === 0) {
    showEmptyState(container, 'No blog posts available yet. Check back soon!');
    return;
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Render each blog
  blogs.forEach((blog, index) => {
    const blogHTML = renderBlogCard(blog, index);
    container.insertAdjacentHTML('beforeend', blogHTML);
  });
}

/**
 * Load and display blogs
 * Fetches blogs from API and renders them
 */
async function loadBlogs() {
  const container = document.getElementById('blogs-container');
  
  if (!container) {
    console.error('Blogs container not found. Add <div id="blogs-container"></div> to your HTML.');
    return;
  }
  
  // Show loading state
  showLoadingSkeleton(container, 4);
  
  try {
    // Fetch blogs from API
    const response = await fetchBlogs();
    
    if (response.success && response.data) {
      // Check if data is an array or has a blogs property
      const blogs = Array.isArray(response.data) ? response.data : response.data.blogs || [];
      
      // Render blogs
      renderBlogs(blogs, container);
    } else {
      // Show error if fetch failed
      showError(container, response.error || 'Failed to load blog posts.');
    }
  } catch (error) {
    console.error('Error loading blogs:', error);
    showError(container, 'An unexpected error occurred while loading blogs.');
  }
}

// Auto-load blogs when DOM is ready (only if blogs-container exists)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blogs-container')) {
      loadBlogs();
    }
  });
} else {
  // DOM already loaded
  if (document.getElementById('blogs-container')) {
    loadBlogs();
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderBlogCard,
    renderBlogs,
    loadBlogs,
  };
}
