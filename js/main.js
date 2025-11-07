// ============================================================================
// MAIN.JS - COMPLETE PORTFOLIO INTERACTIVE FEATURES
// ============================================================================

// ============================================================================
// THEME MANAGER - HANDLES SEASON & BRIGHTNESS
// ============================================================================

const ThemeManager = {
    currentSeason: 'spring',
    currentBrightness: 'day',

    init() {
        // Load saved preferences from localStorage
        this.currentSeason = localStorage.getItem('season') || 'spring';
        this.currentBrightness = localStorage.getItem('brightness') || 'day';
        
        // Apply saved theme
        this.applyTheme();
        
        // Setup theme selector dropdown
        this.setupThemeSelector();
        this.setupBrightnessSelector();
    },

    setupThemeSelector() {
        const seasonBtn = document.getElementById('season-btn');
        const seasonDropdown = document.getElementById('season-dropdown');
        const seasonButtons = seasonDropdown.querySelectorAll('button');

        seasonBtn.addEventListener('click', () => {
            seasonDropdown.classList.toggle('active');
            document.getElementById('brightness-dropdown').classList.remove('active');
        });

        seasonButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const season = btn.getAttribute('data-season');
                this.changeSeason(season);
                seasonDropdown.classList.remove('active');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-selector')) {
                seasonDropdown.classList.remove('active');
            }
        });
    },

    setupBrightnessSelector() {
        const brightnessBtn = document.getElementById('brightness-btn');
        const brightnessDropdown = document.getElementById('brightness-dropdown');
        const brightnessButtons = brightnessDropdown.querySelectorAll('button');

        brightnessBtn.addEventListener('click', () => {
            brightnessDropdown.classList.toggle('active');
            document.getElementById('season-dropdown').classList.remove('active');
        });

        brightnessButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const brightness = btn.getAttribute('data-brightness');
                this.changeBrightness(brightness);
                brightnessDropdown.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.brightness-selector')) {
                brightnessDropdown.classList.remove('active');
            }
        });
    },

    changeSeason(season) {
        this.currentSeason = season;
        localStorage.setItem('season', season);
        this.applyTheme();
        this.updateBGM();
    },

    changeBrightness(brightness) {
        this.currentBrightness = brightness;
        localStorage.setItem('brightness', brightness);
        this.applyTheme();
        this.updateBGM();
    },

    applyTheme() {
        const body = document.body;

        // Remove all theme and mode classes
        body.classList.remove('spring-theme', 'summer-theme', 'autumn-theme', 'winter-theme');
        body.classList.remove('day-mode', 'dim-mode', 'night-mode');

        // Add current theme and mode classes
        body.classList.add(`${this.currentSeason}-theme`);
        body.classList.add(`${this.currentBrightness}-mode`);

        // Update icons
        this.updateIcons();
    },

    updateBGM() {
        if (MusicManager.isPlaying) {
            const filename = `${this.currentSeason}-${this.currentBrightness}.mp3`;
            const bgMusic = document.getElementById('bgMusic');
            bgMusic.src = `assets/sounds/${filename}`;
            bgMusic.play().catch(() => {});
        }
    },

    updateIcons() {
        const seasonIcons = {
            spring: 'fa-leaf',
            summer: 'fa-sun',
            autumn: 'fa-tree',
            winter: 'fa-snowflake'
        };

        const brightnessIcons = {
            day: 'fa-sun',
            dim: 'fa-cloud-sun',
            night: 'fa-moon'
        };

        const seasonBtn = document.querySelector('#season-btn i');
        seasonBtn.className = `fas ${seasonIcons[this.currentSeason]}`;

        const brightnessIcon = document.getElementById('brightness-icon');
        brightnessIcon.className = `fas ${brightnessIcons[this.currentBrightness]}`;
    }
};

// ============================================================================
// SOUND MANAGER - HANDLES SOUND EFFECTS (OFF BY DEFAULT)
// ============================================================================

const SoundManager = {
    enabled: false,

    init() {
        this.enabled = localStorage.getItem('soundEnabled') === 'true';
        this.setupToggle();
        this.updateIcon();
    },

    setupToggle() {
        const soundToggle = document.getElementById('sound-toggle');
        soundToggle.addEventListener('click', () => this.toggle());
    },

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled.toString());
        this.updateIcon();
        SoundManager.play('clickSound');
    },

    play(soundId) {
        if (!this.enabled) return;

        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.volume = 0.4;
            sound.play().catch(() => {});
        }
    },

    updateIcon() {
        const icon = document.getElementById('sound-icon');
        const btn = document.getElementById('sound-toggle');

        if (this.enabled) {
            icon.className = 'fas fa-volume-up';
            btn.title = 'Sound On';
        } else {
            icon.className = 'fas fa-volume-mute';
            btn.title = 'Sound Off';
        }
    }
};

// ============================================================================
// MUSIC MANAGER - HANDLES BACKGROUND MUSIC (OFF BY DEFAULT)
// ============================================================================

const MusicManager = {
    isPlaying: false,

    init() {
        this.isPlaying = localStorage.getItem('musicPlaying') === 'true';
        this.setupToggle();
        if (this.isPlaying) {
            this.play();
        }
        this.updateIcon();
    },

    setupToggle() {
        const musicToggle = document.getElementById('music-toggle');
        musicToggle.addEventListener('click', () => this.toggle());
    },

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },

    play() {
        const bgMusic = document.getElementById('bgMusic');
        const filename = `${ThemeManager.currentSeason}-${ThemeManager.currentBrightness}.mp3`;
        bgMusic.src = `assets/sounds/${filename}`;
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            this.isPlaying = true;
            localStorage.setItem('musicPlaying', 'true');
            this.updateIcon();
        }).catch(() => {});
    },

    pause() {
        const bgMusic = document.getElementById('bgMusic');
        bgMusic.pause();
        this.isPlaying = false;
        localStorage.setItem('musicPlaying', 'false');
        this.updateIcon();
    },

    updateIcon() {
        const icon = document.getElementById('music-icon');
        const btn = document.getElementById('music-toggle');

        if (this.isPlaying) {
            icon.className = 'fas fa-volume-up';
            btn.title = 'Music On';
        } else {
            icon.className = 'fas fa-music';
            btn.title = 'Music Off';
        }
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize managers
    ThemeManager.init();
    SoundManager.init();
    MusicManager.init();

    // Initialize features
    initParticles();
    initNavigation();
    initScrollProgress();
    initAnimations();
    initCounters();
    initSkillBars();
    initProfileModal();
    initContactForm();
    initGameModal();
});

// ============================================================================
// PARTICLES BACKGROUND
// ============================================================================

function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: ['#6366f1', '#ec4899', '#f59e0b'] },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6366f1',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    repulse: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

// ============================================================================
// NAVIGATION
// ============================================================================

function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section, header');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// ============================================================================
// SCROLL PROGRESS BAR
// ============================================================================

function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        document.getElementById('scroll-progress').style.width = scrolled + '%';
    });
}

// ============================================================================
// ANIMATIONS
// ============================================================================

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section > .container').forEach(el => {
        observer.observe(el);
    });
}

// ============================================================================
// ANIMATED COUNTERS
// ============================================================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasStarted = false;

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                counters.forEach(counter => animateCounter(counter));
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const start = Date.now();

    function update() {
        const now = Date.now();
        const progress = (now - start) / duration;

        if (progress < 1) {
            const value = target < 10 ? (target * progress).toFixed(1) : Math.floor(target * progress);
            element.textContent = value;
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    update();
}

// ============================================================================
// SKILL PROGRESS BARS
// ============================================================================

function initSkillBars() {
    // Placeholder for skill bar animations
    // Can be enhanced with actual progress bar elements if needed
}

// ============================================================================
// PROFILE MODAL
// ============================================================================

function initProfileModal() {
    const profileImg = document.getElementById('profile-img');

    profileImg.addEventListener('click', () => {
        SoundManager.play('profileOpenSound');
        // Could expand to open a modal here
    });
}

// ============================================================================
// CONTACT FORM
// ============================================================================

function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = this.querySelector('input[name="name"]')?.value.trim();
        const email = this.querySelector('input[name="email"]')?.value.trim();
        const message = this.querySelector('textarea[name="message"]')?.value.trim();

        if (!name || !email || !message) {
            alert('Please fill all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email');
            return;
        }

        SoundManager.play('achievementSound');
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
    });
}

// ============================================================================
// GAME MODAL
// ============================================================================

function initGameModal() {
    const gameBtn = document.getElementById('game-btn');

    if (gameBtn) {
        gameBtn.addEventListener('click', () => {
            // Game functionality would go here
            alert('Game feature coming soon! Press arrow keys to move, Space to shoot.');
        });
    }

    // Keyboard shortcut for game (press 'G')
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'g') {
            gameBtn?.click();
        }
    });
}

// ============================================================================
// TYPING ANIMATION
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let index = 0;

        function typeCharacter() {
            if (index < text.length) {
                typingText.textContent += text[index];
                index++;
                setTimeout(typeCharacter, 50);
            }
        }

        typeCharacter();
    }
});
