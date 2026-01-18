/**
 * blog.js - Single Blog Post Rendering
 * Fetches and renders a single blog post based on slug from URL query string
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
 * Format date
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get query parameter from URL
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Render single blog post
 * @param {object} blog - Blog object from API
 * @param {HTMLElement} container - Container element
 */
function renderBlogPost(blog, container) {
  if (!container) return;
  
  // Format the date
  const formattedDate = formatDate(blog.createdAt || blog.publishedAt);
  const content = blog.content || blog.description || '';
  // Parse markdown to HTML
  const htmlContent = marked.parse(content);
  
  container.innerHTML = `
    <article class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <div class="mb-8">
        <a href="blogs.html" 
           class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Blogs
        </a>
      </div>
      
      <!-- Blog Header -->
      <header class="mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          ${escapeHTML(blog.title)}
        </h1>
        ${formattedDate ? `
          <div class="flex items-center text-gray-600 mb-6">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            ${formattedDate}
          </div>
        ` : ''}
        ${blog.summary ? `
          <p class="text-xl text-gray-700 leading-relaxed">
            ${escapeHTML(blog.summary)}
          </p>
        ` : ''}
      </header>
      
      <!-- Blog Content - Markdown rendered -->
      <div class="prose max-w-none text-gray-800">
        ${htmlContent}
      </div>
      
      <!-- Share Section -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <a href="blogs.html" 
             class="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            ← Back to all blogs
          </a>
          <div class="mt-4">
            <button id="copy-url-button" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
              Copy Blog URL
            </button>
          </div>
          <script>
            document.getElementById('copy-url-button').addEventListener('click', function() {
              navigator.clipboard.writeText(window.location.href).then(function() {
                alert('Blog URL copied to clipboard!');
              }, function(err) {
                alert('Failed to copy URL: ' + err);
              });
            });
          </script>
        </div>
    </article>
  `;
}

/**
 * Load and display single blog post
 * Gets slug from URL query string and fetches blog
 */
async function loadBlogPost() {
  const container = document.getElementById('blog-post-container');
  
  if (!container) {
    console.error('Blog post container not found. Add <div id="blog-post-container"></div> to your HTML.');
    return;
  }
  
  // Get slug from URL query parameter
  const slug = getQueryParam('slug');
  
  if (!slug) {
    container.innerHTML = '<p class="text-center text-red-500">No blog post specified. Please select a blog post to read.</p>';
    return;
  }
  
  try {
    container.innerHTML = '<p class="text-center text-gray-500">Loading blog post...</p>';
    
    // Fetch blog by slug from API
    const response = await fetchBlogBySlug(slug);
    
    // Extract data - handle nested data.data or just data
    const blog = response.data?.data || response.data;
    
    if (!blog) {
      container.innerHTML = '<p class="text-center text-red-500">Blog post not found.</p>';
      return;
    }
    
    // Update page title
    if (blog.title) {
      document.title = `${blog.title} - Shashank Pandey`;
    }
    
    // Render blog post
    renderBlogPost(blog, container);
  } catch (error) {
    console.error('Error loading blog post:', error);
    container.innerHTML = '<p class="text-center text-red-500">Failed to load blog post. Please try again later.</p>';
  }
}

// Auto-load blog post when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBlogPost);
} else {
  loadBlogPost();
}
