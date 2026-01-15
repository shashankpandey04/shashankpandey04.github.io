/**
 * home.js - Landing Page Dynamic Content
 * Fetches and renders featured projects and latest blogs on the homepage
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
function truncateText(text, length = 150) {
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
 * Render a featured project card for the landing page
 */
function renderFeaturedProjectCard(project, index = 0) {
  const animationDelay = index > 0 ? `style="animation-delay: ${index * 0.1}s;"` : '';
  
  const description = project.description 
    ? truncateText(project.description, 150)
    : (project.shortDescription || '');
  
  // Build tech stack display
  const techStackHTML = project.techStack && project.techStack.length > 0
    ? `
      <div class="mb-6">
        <div class="text-sm font-medium text-gray-600 mb-2">Tech Stack:</div>
        <div class="flex flex-wrap gap-2">
          ${project.techStack.map(tech => 
            `<span class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">${escapeHTML(tech)}</span>`
          ).join('')}
        </div>
      </div>
    `
    : '';
  
  return `
    <div class="glass-unified p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl transition transform hover:bg-white/30 hover:-translate-y-1 hover:saturate-150 opacity-0 translate-y-6 animate-fadeInUp" ${animationDelay}>
      <h3 class="text-2xl font-semibold text-gray-900 mb-4">${escapeHTML(project.title)}</h3>
      ${project.shortDescription ? `<p class="text-gray-600 mb-4">${escapeHTML(project.shortDescription)}</p>` : ''}
      ${description ? `<p class="text-gray-700 mb-6 leading-relaxed">${escapeHTML(description)}</p>` : ''}
      ${techStackHTML}
      <div class="flex space-x-3">
        ${project.liveUrl ? `
          <a href="${escapeHTML(project.liveUrl)}" target="_blank" rel="noopener noreferrer"
             class="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            Live Site
          </a>
        ` : ''}
        ${project.githubUrl ? `
          <a href="${escapeHTML(project.githubUrl)}" target="_blank" rel="noopener noreferrer"
             class="glass-unified px-6 py-3 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
            GitHub
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Render a blog preview card for the landing page
 */
function renderBlogPreviewCard(blog, index = 0) {
  const animationDelay = index > 0 ? `style="animation-delay: ${index * 0.1}s;"` : '';
  
  const summary = blog.summary || blog.excerpt || truncateText(blog.content || '', 120);
  const date = blog.publishedAt || blog.createdAt || blog.date;
  
  return `
    <div class="glass-unified p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl transition transform hover:bg-white/30 hover:-translate-y-1 hover:saturate-150 opacity-0 translate-y-6 animate-fadeInUp" ${animationDelay}>
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-gray-600">${formatDate(date)}</span>
        ${blog.readTime ? `<span class="text-sm text-gray-500">${escapeHTML(blog.readTime)}</span>` : ''}
      </div>
      <h3 class="text-2xl font-semibold text-gray-900 mb-4">${escapeHTML(blog.title)}</h3>
      ${summary ? `<p class="text-gray-700 mb-6 leading-relaxed">${escapeHTML(summary)}</p>` : ''}
      <a href="blog.html?slug=${encodeURIComponent(blog.slug)}" 
         class="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
        Read More →
      </a>
    </div>
  `;
}

/**
 * Load and render featured projects on the homepage
 */
async function loadFeaturedProjects() {
  const container = document.getElementById('featured-projects-container');
  if (!container) return;
  
  try {
    const response = await fetchFeaturedProjects();
    
    // Extract data - handle nested structure
    let projects = response.data?.data || response.data || [];
    
    if (!Array.isArray(projects)) {
      projects = [];
    }
    
    if (projects.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-500">No featured projects yet.</p>';
      return;
    }
    
    container.innerHTML = projects.slice(0, 4).map((p, i) => renderFeaturedProjectCard(p, i)).join('');
  } catch (error) {
    console.error('Error loading featured projects:', error);
    container.innerHTML = '<p class="text-center text-red-500">Failed to load projects.</p>';
  }
}

/**
 * Load and render latest blogs on the homepage
 */
async function loadLatestBlogs() {
  const container = document.getElementById('latest-blogs-container');
  if (!container) return;
  
  try {
    const response = await fetchBlogs();
    
    // Extract data - handle nested structure
    let blogs = response.data?.data || response.data || [];
    
    if (!Array.isArray(blogs)) {
      blogs = [];
    }
    
    if (blogs.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-500">No blog posts yet.</p>';
      return;
    }
    
    container.innerHTML = blogs.slice(0, 3).map((b, i) => renderBlogPreviewCard(b, i)).join('');
  } catch (error) {
    console.error('Error loading blogs:', error);
    container.innerHTML = '<p class="text-center text-red-500">Failed to load blog posts.</p>';
  }
}

/**
 * Initialize the homepage
 */
async function initHomePage() {
  // Check if we're on the home page
  if (!document.getElementById('featured-projects-container') && 
      !document.getElementById('latest-blogs-container')) {
    return;
  }
  
  // Load content in parallel
  await Promise.all([
    loadFeaturedProjects(),
    loadLatestBlogs()
  ]);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage);
} else {
  initHomePage();
}
