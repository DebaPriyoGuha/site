/**
 * Sound Manager
 * Sound is OFF by default - user must enable
 * Deba Priyo Guha Portfolio
 */

(function() {
    'use strict';

    const SOUND_KEY = 'portfolio-sound-enabled';

    class SoundManager {
        constructor() {
            this.sounds = {};
            this.bgMusic = null;
            this.enabled = localStorage.getItem(SOUND_KEY) === 'true'; // OFF by default
            this.volume = 0.3;
            this.bgMusicVolume = 0.15;
            this.initialized = false;
        }

        /**
         * Initialize sound system (call after user interaction)
         */
        init() {
            if (this.initialized) return;
            
            // Preload sounds
            this.loadSound('click', 'assets/sounds/click.mp3');
            this.loadSound('hover', 'assets/sounds/hover.mp3');
            
            // Background music
            this.bgMusic = new Audio('assets/sounds/bg-music.mp3');
            this.bgMusic.loop = true;
            this.bgMusic.volume = this.bgMusicVolume;
            
            this.initialized = true;
            this.updateUI();
        }

        /**
         * Load a sound
         */
        loadSound(name, path) {
            const audio = new Audio(path);
            audio.volume = this.volume;
            audio.preload = 'auto';
            this.sounds[name] = audio;
        }

        /**
         * Play a sound
         */
        play(name) {
            if (!this.enabled || !this.sounds[name]) return;
            
            try {
                const sound = this.sounds[name].cloneNode();
                sound.volume = this.volume;
                sound.play().catch(() => {});
            } catch (e) {
                // Silent fail
            }
        }

        /**
         * Toggle sound on/off
         */
        toggle() {
            this.enabled = !this.enabled;
            localStorage.setItem(SOUND_KEY, this.enabled);
            
            if (this.enabled) {
                this.init();
                if (this.bgMusic) {
                    this.bgMusic.play().catch(() => {});
                }
            } else {
                if (this.bgMusic) {
                    this.bgMusic.pause();
                }
            }
            
            this.updateUI();
            return this.enabled;
        }

        /**
         * Update UI icon
         */
        updateUI() {
            const toggle = document.getElementById('soundToggle');
            const icon = toggle?.querySelector('i');
            
            if (icon) {
                if (this.enabled) {
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                } else {
                    icon.classList.remove('fa-volume-up');
                    icon.classList.add('fa-volume-mute');
                }
            }
        }

        /**
         * Check if enabled
         */
        isEnabled() {
            return this.enabled;
        }
    }

    // Create global instance
    window.soundManager = new SoundManager();

    // Initialize on first user interaction if sound was previously enabled
    document.addEventListener('click', function initOnClick() {
        window.soundManager.init();
        document.removeEventListener('click', initOnClick);
    }, { once: true });

    // Sound toggle button
    document.addEventListener('DOMContentLoaded', () => {
        const soundToggle = document.getElementById('soundToggle');
        
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                window.soundManager.toggle();
            });
        }

        // Initial UI update
        window.soundManager.updateUI();
    });
})();
