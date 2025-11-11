// Blue Team vs Red Team Theme Toggle
(function() {
  const THEME_KEY = 'cyber-theme';
  const BLUE_TEAM = 'blue';
  const RED_TEAM = 'red';

  // Get saved theme or default to blue team
  let currentTheme = localStorage.getItem(THEME_KEY) || BLUE_TEAM;

  // Initialize theme on page load
  function initTheme() {
    applyTheme(currentTheme);
    updateToggleButton();
  }

  // Apply theme by setting CSS variables
  function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === RED_TEAM) {
      // Red Team Theme
      root.style.setProperty('--accent-primary', '#ef4545');
      root.style.setProperty('--accent-hover', '#ff5a5a');
      root.style.setProperty('--border-accent', '#ef4545');
      root.style.setProperty('--shadow', 'rgba(239, 69, 69, 0.3)');
      root.style.setProperty('--accent-glow', 'rgba(239, 69, 69, 0.5)');
      root.style.setProperty('--accent-bg', 'rgba(239, 69, 69, 0.1)');
      document.body.classList.add('red-team');
      document.body.classList.remove('blue-team');
    } else {
      // Blue Team Theme (Default)
      root.style.setProperty('--accent-primary', '#4553ef');
      root.style.setProperty('--accent-hover', '#5a68ff');
      root.style.setProperty('--border-accent', '#4553ef');
      root.style.setProperty('--shadow', 'rgba(69, 83, 239, 0.3)');
      root.style.setProperty('--accent-glow', 'rgba(69, 83, 239, 0.5)');
      root.style.setProperty('--accent-bg', 'rgba(69, 83, 239, 0.1)');
      document.body.classList.add('blue-team');
      document.body.classList.remove('red-team');
    }
  }

  // Update the toggle button appearance
  function updateToggleButton() {
    const toggleBtn = document.getElementById('themeToggle');
    const shieldIcon = document.getElementById('shieldIcon');
    const swordIcon = document.getElementById('swordIcon');
    
    if (!toggleBtn || !shieldIcon || !swordIcon) return;

    if (currentTheme === RED_TEAM) {
      // Show bright red sword, dim blue shield
      swordIcon.classList.add('active');
      shieldIcon.classList.remove('active');
      toggleBtn.classList.add('red-active');
      toggleBtn.classList.remove('blue-active');
    } else {
      // Show bright blue shield, dim red sword
      shieldIcon.classList.add('active');
      swordIcon.classList.remove('active');
      toggleBtn.classList.add('blue-active');
      toggleBtn.classList.remove('red-active');
    }
  }

  // Toggle between themes
  function toggleTheme() {
    currentTheme = currentTheme === BLUE_TEAM ? RED_TEAM : BLUE_TEAM;
    localStorage.setItem(THEME_KEY, currentTheme);
    applyTheme(currentTheme);
    updateToggleButton();
    
    // Add animation effect
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.classList.add('switching');
      setTimeout(() => toggleBtn.classList.remove('switching'), 300);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Attach toggle function to button when ready
  document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }
  });

  // Export for use in other scripts if needed
  window.cyberTheme = {
    toggle: toggleTheme,
    getCurrent: () => currentTheme,
    set: (theme) => {
      if (theme === BLUE_TEAM || theme === RED_TEAM) {
        currentTheme = theme;
        localStorage.setItem(THEME_KEY, currentTheme);
        applyTheme(currentTheme);
        updateToggleButton();
      }
    }
  };
})();
