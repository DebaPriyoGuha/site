/* ============================================================
   SOUND.JS — Sound system (OFF by default)
============================================================ */

'use strict';

(function () {
    const STORAGE_KEY = 'portfolio-sound';

    const state = {
        enabled: false,
        ctx: null,
        bgSource: null,
        bgBuffer: null
    };

    function getAudioContext() {
        if (!state.ctx) {
            state.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return state.ctx;
    }

    // Synthesize a click sound using Web Audio API
    // (no external file required)
    function playClick() {
        if (!state.enabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            // Silently fail
        }
    }

    function updateIcon() {
        const icon = state.enabled ? 'fa-volume-up' : 'fa-volume-mute';
        document.querySelectorAll('#soundToggle i, #soundToggleMobile i')
            .forEach(i => { i.className = `fas ${icon}`; });
    }

    function toggle() {
        state.enabled = !state.enabled;
        localStorage.setItem(STORAGE_KEY, state.enabled ? '1' : '0');
        updateIcon();
        if (state.enabled) playClick();
    }

    // Load saved preference
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === '1') state.enabled = true;

    document.addEventListener('DOMContentLoaded', () => {
        updateIcon();
        document.getElementById('soundToggle')
            ?.addEventListener('click', toggle);
        document.getElementById('soundToggleMobile')
            ?.addEventListener('click', toggle);

        // Add click sounds to interactive elements
        document.addEventListener('click', e => {
            if (!state.enabled) return;
            const el = e.target.closest('a, button, .filter-btn, .nav-link, .project-card');
            if (el) playClick();
        }, true);
    });

    window.soundManager = { playClick, toggle, get enabled() { return state.enabled; } };
})();
