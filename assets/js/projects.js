/**
 * projects.js - Dynamic Projects Rendering
 * Fetches and renders project cards from the API
 */

/**
 * Render a single project card
 * @param {object} project - Project object from API
 * @param {number} index - Index for animation delay
 * @returns {string} - HTML string for project card
 */
function renderProjectCard(project, index = 0) {
  const animationDelay = index > 0 ? `style="animation-delay: ${index * 0.1}s;"` : '';
  
  // Build tech stack display
  const techStackHTML = project.techStack && project.techStack.length > 0
    ? `
      <div class="mb-6">
        <div class="text-sm font-medium text-gray-600 mb-2">Tech Stack:</div>
        <div class="flex flex-wrap gap-2">
          ${project.techStack.map(tech => `
            <span class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
              ${escapeHTML(tech)}
            </span>
          `).join('')}
        </div>
      </div>
    `
    : '';
  
  // Build action buttons
  const buttonsHTML = `
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
  `;
  
  return `
    <div class="glass-unified p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl transition transform hover:bg-white/30 hover:-translate-y-1 hover:saturate-150 opacity-0 translate-y-6 animate-fadeInUp" ${animationDelay}>
      <h3 class="text-2xl font-semibold text-gray-900 mb-4">${escapeHTML(project.title)}</h3>
      ${project.shortDescription ? `<p class="text-gray-600 mb-4">${escapeHTML(project.shortDescription)}</p>` : ''}
      ${project.description ? `<p class="text-gray-700 mb-6 leading-relaxed">${escapeHTML(project.description)}</p>` : ''}
      ${techStackHTML}
      ${buttonsHTML}
    </div>
  `;
}

/**
 * Render all projects in the container
 * @param {Array} projects - Array of project objects
 * @param {HTMLElement} container - Container element
 */
function renderProjects(projects, container) {
  if (!container) return;
  
  if (!projects || projects.length === 0) {
    showEmptyState(container, 'No projects available at the moment.');
    return;
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Render each project
  projects.forEach((project, index) => {
    const projectHTML = renderProjectCard(project, index);
    container.insertAdjacentHTML('beforeend', projectHTML);
  });
}

/**
 * Load and display projects
 * Fetches projects from API and renders them
 */
async function loadProjects() {
  const container = document.getElementById('projects-container');
  
  if (!container) {
    console.error('Projects container not found. Add <div id="projects-container"></div> to your HTML.');
    return;
  }
  
  // Show loading state
  showLoadingSkeleton(container, 3);
  
  try {
    // Fetch projects from API
    const response = await fetchProjects();
    
    if (response.success && response.data) {
      // Check if data is an array or has a projects property
      const projects = Array.isArray(response.data) ? response.data : response.data.projects || [];
      
      // Render projects
      renderProjects(projects, container);
    } else {
      // Show error if fetch failed
      showError(container, response.error || 'Failed to load projects.');
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    showError(container, 'An unexpected error occurred while loading projects.');
  }
}

/**
 * Load and display featured projects only
 * Fetches featured projects from API and renders them
 */
async function loadFeaturedProjects() {
  const container = document.getElementById('projects-container');
  
  if (!container) {
    console.error('Projects container not found. Add <div id="projects-container"></div> to your HTML.');
    return;
  }
  
  // Show loading state
  showLoadingSkeleton(container, 2);
  
  try {
    // Fetch featured projects from API
    const response = await fetchFeaturedProjects();
    
    if (response.success && response.data) {
      // Check if data is an array or has a projects property
      const projects = Array.isArray(response.data) ? response.data : response.data.projects || [];
      
      // Render projects
      renderProjects(projects, container);
    } else {
      // Show error if fetch failed
      showError(container, response.error || 'Failed to load featured projects.');
    }
  } catch (error) {
    console.error('Error loading featured projects:', error);
    showError(container, 'An unexpected error occurred while loading projects.');
  }
}

// Auto-load projects when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProjects);
} else {
  // DOM already loaded
  loadProjects();
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderProjectCard,
    renderProjects,
    loadProjects,
    loadFeaturedProjects,
  };
}
