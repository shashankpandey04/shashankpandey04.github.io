/**
 * blog.js - Single Blog Post Rendering
 * Fetches and renders a single blog post based on slug from URL query string
 */

/**
 * Render single blog post
 * @param {object} blog - Blog object from API
 * @param {HTMLElement} container - Container element
 */
function renderBlogPost(blog, container) {
  if (!container) return;
  
  // Format the date
  const formattedDate = formatDate(blog.createdAt);
  
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
      
      <!-- Blog Content -->
      <div class="prose prose-lg max-w-none">
        <div class="text-gray-800 leading-relaxed whitespace-pre-wrap">
          ${escapeHTML(blog.description)}
        </div>
      </div>
      
      <!-- Share Section (Optional) -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <a href="blogs.html" 
             class="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            ← Back to all blogs
          </a>
          <div class="flex space-x-4">
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}" 
               target="_blank" rel="noopener noreferrer"
               class="text-gray-600 hover:text-gray-900 transition-colors"
               title="Share on Twitter">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
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
    showError(container, 'No blog post specified. Please select a blog post to read.');
    return;
  }
  
  // Show loading state
  showLoadingSkeleton(container, 1);
  
  try {
    // Fetch blog by slug from API
    const response = await fetchBlogBySlug(slug);
    
    if (response.success && response.data) {
      // Get the blog object
      const blog = response.data;
      
      // Update page title
      if (blog.title) {
        document.title = `${blog.title} - Shashank Pandey`;
      }
      
      // Render blog post
      renderBlogPost(blog, container);
    } else {
      // Show error if fetch failed
      showError(container, response.error || 'Blog post not found.');
    }
  } catch (error) {
    console.error('Error loading blog post:', error);
    showError(container, 'An unexpected error occurred while loading the blog post.');
  }
}

// Auto-load blog post when DOM is ready (only if blog-post-container exists)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blog-post-container')) {
      loadBlogPost();
    }
  });
} else {
  // DOM already loaded
  if (document.getElementById('blog-post-container')) {
    loadBlogPost();
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderBlogPost,
    loadBlogPost,
  };
}
