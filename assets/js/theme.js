/**
 * theme.js - Dark/Light Mode Theme System
 * Handles theme detection, toggle, and persistence
 */

const THEME_KEY = 'portfolio_theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

/**
 * Get current theme from localStorage or system preference
 * @returns {string} - 'dark' or 'light'
 */
function getCurrentTheme() {
  // Check localStorage first
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme;
  }
  
  // Fall back to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEME_DARK;
  }
  
  return THEME_LIGHT;
}

/**
 * Apply theme to document
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
  if (theme === THEME_DARK) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Save to localStorage
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
  applyTheme(newTheme);
  return newTheme;
}

/**
 * Initialize theme system
 * Sets initial theme and creates toggle button listener
 */
function initTheme() {
  // Apply saved or system theme immediately
  const theme = getCurrentTheme();
  applyTheme(theme);
  
  // Update toggle button if it exists
  updateThemeToggleButton(theme);
  
  // Listen for theme toggle button clicks
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = toggleTheme();
      updateThemeToggleButton(newTheme);
    });
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
      }
    });
  }
}

/**
 * Update theme toggle button appearance
 * @param {string} theme - Current theme
 */
function updateThemeToggleButton(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const icon = themeToggle.querySelector('.theme-icon');
  if (!icon) return;
  
  if (theme === THEME_DARK) {
    icon.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    `;
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    icon.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
    `;
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
}

// Initialize theme on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCurrentTheme,
    applyTheme,
    toggleTheme,
    initTheme,
  };
}
