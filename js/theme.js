/* ============================================================
   THEME.JS — Dark / Light mode toggle
============================================================ */

'use strict';

(function () {
    const STORAGE_KEY = 'portfolio-theme';

    function getPreferred() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);

        const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
        document.querySelectorAll('#themeToggle i, #themeToggleMobile i')
            .forEach(i => {
                i.className = `fas ${icon}`;
            });
    }

    function toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
        window.soundManager?.playClick();
    }

    // Apply on load immediately (before DOMContentLoaded to avoid flash)
    applyTheme(getPreferred());

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('themeToggle')
            ?.addEventListener('click', toggle);
        document.getElementById('themeToggleMobile')
            ?.addEventListener('click', toggle);
    });

    // Expose for external use
    window.themeManager = { toggle, applyTheme, getPreferred };
})();
