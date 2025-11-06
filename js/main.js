// ============================================================================
// MAIN.JS - Portfolio Interactive Features
// ============================================================================

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const musicToggle = document.getElementById('music-toggle');
const gameBtn = document.getElementById('game-btn');
const profileImg = document.getElementById('profile-img');
const profileModal = document.getElementById('profile-modal');
const gameModal = document.getElementById('game-modal');
const gameClose = document.querySelector('.game-close');
const modalCloses = document.querySelectorAll('.modal-close');
const scrollProgress = document.getElementById('scroll-progress');
const contactForm = document.getElementById('contact-form');
const bgMusic = document.getElementById('bg-music');
const clickSound = document.getElementById('click-sound');
const achievementSound = document.getElementById('achievement-sound');

// ============================================================================
// Initialize
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initParticles();
    initNavigation();
    initScrollProgress();
    initAnimations();
    initCounters();
    initSkillBars();
    initContactForm();
    initModals();
    initMusicPlayer();
    initGameButton();
    initKonamiCode();
    lazyLoadImages();
});

// ============================================================================
// Theme Management
// ============================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light', savedTheme === 'light');
    updateThemeIcon(savedTheme === 'light');

    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
    playClickSound();
}

function updateThemeIcon(isLight) {
    if (isLight) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// ============================================================================
// Navigation Menu
// ============================================================================
function initNavigation() {
    navToggle.addEventListener('click', toggleNavMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeNavMenu();
            const targetId = this.getAttribute('href').substring(1);
            updateActiveNavLink(targetId);
        });
    });

    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target)) {
            closeNavMenu();
        }
    });

    window.addEventListener('scroll', updateNavActiveLink);
}

function toggleNavMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeNavMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
}

function updateActiveNavLink(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === sectionId) {
            link.classList.add('active');
        }
    });
}

function updateNavActiveLink() {
    const sections = document.querySelectorAll('section, header');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    updateActiveNavLink(current);
}

// ============================================================================
// Scroll Progress Bar
// ============================================================================
function initScrollProgress() {
    window.addEventListener('scroll', updateScrollProgress);
}

function updateScrollProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
}

// ============================================================================
// Particle.js Background
// ============================================================================
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#6366f1', '#ec4899', '#f59e0b']
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
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
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// ============================================================================
// Scroll Animations
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

    document.querySelectorAll('.section > .container > h2, .section > .container > div').forEach(el => {
        observer.observe(el);
    });

    // Card animations
    const cards = document.querySelectorAll(
        '.research-card, .project-card, .award-card, .leadership-card, .timeline-item'
    );
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });
}

// ============================================================================
// Animated Counters
// ============================================================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasStarted = false;

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const start = Date.now();

    function update() {
        const now = Date.now();
        const progress = (now - start) / duration;

        if (progress < 1) {
            const value = Math.floor(target * progress);
            element.textContent = value;
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    update();
}

// ============================================================================
// Skill Progress Bars
// ============================================================================
function initSkillBars() {
    const progressBars = document.querySelectorAll('.skill-progress');

    const barObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const skillItem = progress.parentElement;
                const skillName = skillItem.querySelector('.skill-name');
                const progressValue = skillName.textContent.match(/(\d+)%/)?.[1] || 
                                     parseFloat(progress.getAttribute('data-progress')) || 75;

                progress.style.setProperty('--progress-width', progressValue + '%');
                progress.style.animation = `fillBar 1.5s ease-out forwards`;
                barObserver.unobserve(progress);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => barObserver.observe(bar));
}

// ============================================================================
// Contact Form
// ============================================================================
function initContactForm() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const formStatus = document.getElementById('form-status');

        // Validation
        if (!name || !email || !subject || !message) {
            showFormStatus('Please fill all fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus('Please enter a valid email', 'error');
            return;
        }

        // Simulate form submission (in production, send to backend)
        playAchievementSound();
        showFormStatus('Message sent successfully! 🚀 (Demo)', 'success');
        contactForm.reset();

        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = '';
        }, 4000);
    });
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    formStatus.textContent = message;
    formStatus.className = type;
}

// ============================================================================
// Modals
// ============================================================================
function initModals() {
    // Profile modal
    if (profileImg) {
        profileImg.addEventListener('click', openProfileModal);
    }

    // Close modals
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(closeModal);
        }
        if (e.key.toLowerCase() === 'g') {
            toggleGameModal();
        }
    });
}

function openProfileModal() {
    profileModal.classList.add('active');
    playClickSound();
}

function toggleGameModal() {
    gameModal.classList.toggle('active');
    if (gameModal.classList.contains('active')) {
        playAchievementSound();
        startGame();
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// ============================================================================
// Music Player
// ============================================================================
function initMusicPlayer() {
    let isPlaying = false;

    musicToggle.addEventListener('click', function() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            bgMusic.volume = 0.3;
            bgMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        }

        playClickSound();
    });
}

// ============================================================================
// Game Button
// ============================================================================
function initGameButton() {
    gameBtn.addEventListener('click', toggleGameModal);
}

// ============================================================================
// Konami Code Easter Egg
// ============================================================================
function initKonamiCode() {
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];

    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === konamiSequence[konamiIndex].toLowerCase()) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                triggerKonamiCode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function triggerKonamiCode() {
    playAchievementSound();
    alert('🎮 Konami Code Activated! 🎉\n\nYou found the secret! Try pressing G to play the mini game.');
}

// ============================================================================
// Lazy Loading Images
// ============================================================================
function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================================================
// Sound Effects
// ============================================================================
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.volume = 0.3;
    clickSound.play().catch(() => {});
}

function playAchievementSound() {
    achievementSound.currentTime = 0;
    achievementSound.volume = 0.4;
    achievementSound.play().catch(() => {});
}

// ============================================================================
// Utility Functions
// ============================================================================
window.playClickSound = playClickSound;
window.playAchievementSound = playAchievementSound;
window.toggleTheme = toggleTheme;
window.toggleGameModal = toggleGameModal;
