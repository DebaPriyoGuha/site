/**
 * Theme Toggle - Dark/Light Mode
 * Deba Priyo Guha Portfolio
 */

(function() {
    'use strict';

    const THEME_KEY = 'portfolio-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');

    /**
     * Get saved theme or system preference
     */
    function getPreferredTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
            return savedTheme;
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
    }

    /**
     * Apply theme to document
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateIcon(theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    /**
     * Update toggle icon
     */
    function updateIcon(theme) {
        if (!themeIcon) return;
        
        if (theme === DARK) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    /**
     * Toggle theme
     */
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === DARK ? LIGHT : DARK;
        applyTheme(newTheme);
    }

    // Initialize
    function init() {
        // Apply initial theme
        applyTheme(getPreferredTheme());

        // Add click listener
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? DARK : LIGHT);
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
