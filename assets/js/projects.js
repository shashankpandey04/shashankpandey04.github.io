/**
 * projects.js - Projects Page Dynamic Content
 * Fetches and renders all projects from the API
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
 * Render a project card
 */
function renderProjectCard(project, index = 0) {
  const animationDelay = index > 0 ? `style="animation-delay: ${index * 0.1}s;"` : '';
  
  const description = project.description || project.shortDescription || '';
  
  // Build tech stack display
  const techStackHTML = project.techStack && project.techStack.length > 0
    ? `
      <div class="mb-6">
        <div class="text-sm font-medium text-gray-600 mb-2">Tech Stack:</div>
        <div class="flex flex-wrap gap-2">
          ${project.techStack.map(tech => 
            `<span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">${escapeHTML(tech)}</span>`
          ).join('')}
        </div>
      </div>
    `
    : '';
  
  return `
    <div class="glass-unified p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl transition transform hover:bg-white/30 hover:-translate-y-1 hover:saturate-150 opacity-0 translate-y-6 animate-fadeInUp" ${animationDelay}>
      <h3 class="text-2xl font-semibold text-gray-900 mb-4">${escapeHTML(project.title)}</h3>
      ${project.shortDescription ? `<p class="text-gray-600 mb-4">${escapeHTML(project.shortDescription)}</p>` : ''}
      ${description ? `<p class="text-gray-700 mb-6 leading-relaxed">${escapeHTML(truncateText(description, 200))}</p>` : ''}
      ${techStackHTML}
      <div class="flex flex-wrap gap-3">
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
 * Render multiple project cards
 */
function renderProjects(projects, container) {
  if (!projects || projects.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 col-span-full">No projects found.</p>';
    return;
  }
  container.innerHTML = projects.reverse().map((p, i) => renderProjectCard(p, i)).join('');
}

/**
 * Load and display all projects
 */
async function loadProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  try {
    container.innerHTML = '<p class="col-span-full text-center text-gray-500">Loading projects...</p>';
    
    const response = await fetchProjects();
    
    // Extract data - handle nested structure
    let projects = response.data?.data || response.data || [];
    
    if (!Array.isArray(projects)) {
      projects = [];
    }
    
    renderProjects(projects, container);
  } catch (error) {
    console.error('Error loading projects:', error);
    container.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load projects. Please try again later.</p>';
  }
}

/**
 * Load and display featured projects only
 */
async function loadFeaturedProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  try {
    container.innerHTML = '<p class="col-span-full text-center text-gray-500">Loading projects...</p>';
    
    const response = await fetchFeaturedProjects();
    
    // Extract data - handle nested structure
    let projects = response.data?.data || response.data || [];
    
    if (!Array.isArray(projects)) {
      projects = [];
    }
    
    renderProjects(projects, container);
  } catch (error) {
    console.error('Error loading featured projects:', error);
    container.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load projects. Please try again later.</p>';
  }
}

// Auto-load all projects when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProjects);
} else {
  loadProjects();
}
