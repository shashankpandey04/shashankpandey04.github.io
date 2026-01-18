/**
 * blogs.js - Dynamic Blogs List Rendering
 * Fetches and renders blog cards from the API
 */

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Truncate text to specified length
 */
function truncateText(text, length = 200) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Format date
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Render a single blog card
 */
function renderBlogCard(blog, index = 0) {
  const animationDelay = index > 0 ? `style="animation-delay: ${index * 0.1}s;"` : '';
  
  const formattedDate = formatDate(blog.createdAt || blog.publishedAt);
  const summaryText = blog.summary || truncateText(blog.content || blog.description || '', 200);
  // Parse markdown in summary
  const summary = marked.parse(summaryText).replace(/<p>|<\/p>/g, '').trim();
  
  return `
    <div class="glass-unified p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl transition transform hover:bg-white/30 hover:-translate-y-1 hover:saturate-150 opacity-0 translate-y-6 animate-fadeInUp" ${animationDelay}>
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-2xl font-semibold text-gray-900">${escapeHTML(blog.title)}</h3>
        ${formattedDate ? `<span class="text-sm text-gray-500 ml-4 flex-shrink-0">${formattedDate}</span>` : ''}
      </div>
      ${summary ? `<div class="text-gray-700 mb-6 leading-relaxed prose prose-sm">${summary}</div>` : ''}
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
 */
function renderBlogs(blogs, container) {
  if (!blogs || blogs.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 col-span-full">No blog posts available yet.</p>';
    return;
  }
  container.innerHTML = blogs.map((b, i) => renderBlogCard(b, i)).join('');
}

/**
 * Load and display blogs
 */
async function loadBlogs() {
  const container = document.getElementById('blogs-container');
  if (!container) return;
  
  try {
    container.innerHTML = '<p class="col-span-full text-center text-gray-500">Loading blogs...</p>';
    
    const response = await fetchBlogs();
    
    // Extract data - handle nested structure
    let blogs = response.data?.data || response.data || [];
    
    if (!Array.isArray(blogs)) {
      blogs = [];
    }
    
    renderBlogs(blogs, container);
  } catch (error) {
    console.error('Error loading blogs:', error);
    container.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load blog posts. Please try again later.</p>';
  }
}

// Auto-load blogs when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBlogs);
} else {
  loadBlogs();
}
