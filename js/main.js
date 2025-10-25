// ===================================
// Main JavaScript File
// ===================================

// Global Variables
let currentTheme = localStorage.getItem('theme') || 'light';
let musicEnabled = false;
let soundsEnabled = true;
let game = null;

// Audio Elements
const bgMusic = document.getElementById('bgMusic');
const clickSound = document.getElementById('clickSound');
const achievementSound = document.getElementById('achievementSound');
const profileOpenSound = document.getElementById('profileOpenSound');

// Store audio globally for game access
window.clickSound = clickSound;
window.achievementSound = achievementSound;

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initParticles();
    initNavigation();
    initTyping();
    initScrollAnimations();
    initProfileModal();
    initGame();
    initContactForm();
    initCounters();
    setupAudio();
});

// ===================================
// Theme System
// ===================================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Set initial theme
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        playClickSound();
        
        if (currentTheme === 'light') {
            currentTheme = 'dark';
            html.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            currentTheme = 'light';
            html.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        localStorage.setItem('theme', currentTheme);
    });
}

// ===================================
// Particles Background
// ===================================
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#6366f1' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1 }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.1 }
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
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const progressBar = document.getElementById('progressBar');
    
    // Scroll progress
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
        
        // Navbar background on scroll
        if (winScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active section highlighting
    const sections = document.querySelectorAll('.section, .hero-section');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
                
                // Achievement sound on section enter
                if (entry.target.classList.contains('section')) {
                    playAchievementSound();
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            playClickSound();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Close mobile menu
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        playClickSound();
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
}

// ===================================
// Typing Animation
// ===================================
function initTyping() {
    const typingText = document.getElementById('typingText');
    const phrases = [
        'Machine Learning Researcher',
        'Astrophysics Enthusiast',
        'Radio Astronomy Specialist',
        'Deep Learning Expert',
        'Data Science Professional',
        'Problem Solver'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.research-card, .project-card, .award-card, .timeline-item, .skill-item'
    );
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ===================================
// Profile Modal
// ===================================
function initProfileModal() {
    const profileWrapper = document.getElementById('profileWrapper');
    const profileImg = document.getElementById('profileImg');
    const modal = document.getElementById('profileModal');
    const modalClose = document.getElementById('modalClose');
    
    profileWrapper.addEventListener('click', () => {
        playProfileOpenSound();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    modalClose.addEventListener('click', () => {
        playClickSound();
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===================================
// Mini Game
// ===================================
function initGame() {
    const gameToggle = document.getElementById('gameToggle');
    const gameContainer = document.getElementById('gameContainer');
    const gameClose = document.getElementById('gameClose');
    const gameCanvas = document.getElementById('gameCanvas');
    
    // Initialize game
    game = new SpaceShooter(gameCanvas);
    
    // Open game
    function openGame() {
        playClickSound();
        gameContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        game.reset();
        game.start();
    }
    
    // Close game
    function closeGame() {
        playClickSound();
        gameContainer.classList.remove('active');
        document.body.style.overflow = 'auto';
        game.stop();
    }
    
    gameToggle.addEventListener('click', openGame);
    gameClose.addEventListener('click', closeGame);
    
    // Press 'G' to open game
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'g' && !gameContainer.classList.contains('active')) {
            openGame();
        } else if (e.key === 'Escape' && gameContainer.classList.contains('active')) {
            closeGame();
        }
    });
    
    // Click outside to close
    gameContainer.addEventListener('click', (e) => {
        if (e.target === gameContainer) {
            closeGame();
        }
    });
}

// ===================================
// Contact Form
// ===================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        playAchievementSound();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon. 🚀');
        
        // Reset form
        contactForm.reset();
        
        // In production, you would send this to a backend
        console.log('Form submitted:', data);
    });
}

// ===================================
// Animated Counters
// ===================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    const increment = target / speed;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target + '+';
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ===================================
// Audio System
// ===================================
function setupAudio() {
    const musicToggle = document.getElementById('musicToggle');
    
    // Music toggle
    musicToggle.addEventListener('click', () => {
        playClickSound();
        musicEnabled = !musicEnabled;
        
        if (musicEnabled) {
            bgMusic.play().catch(() => {
                console.log('Audio play blocked by browser');
            });
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.classList.add('active');
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicToggle.classList.remove('active');
        }
    });
    
    // Set volume
    bgMusic.volume = 0.3;
    clickSound.volume = 0.5;
    achievementSound.volume = 0.4;
    profileOpenSound.volume = 0.5;
}

function playClickSound() {
    if (soundsEnabled && clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }
}

function playAchievementSound() {
    if (soundsEnabled && achievementSound) {
        achievementSound.currentTime = 0;
        achievementSound.play().catch(() => {});
    }
}

function playProfileOpenSound() {
    if (soundsEnabled && profileOpenSound) {
        profileOpenSound.currentTime = 0;
        profileOpenSound.play().catch(() => {});
    }
}

// ===================================
// Utility Functions
// ===================================

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

// ===================================
// Easter Eggs & Fun Features
// ===================================

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateKonamiMode();
    }
});

function activateKonamiMode() {
    playAchievementSound();
    document.body.style.animation = 'rainbow 2s infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
        alert('🎉 Konami Code Activated! You found the secret! 🎮');
    }, 2000);
}

// Rainbow animation for konami code
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===================================
// Console Message
// ===================================
console.log('%c🚀 Welcome to My Portfolio!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%cLooking for Easter eggs? Try pressing "G" for a game! 🎮', 'font-size: 14px; color: #ec4899;');
console.log('%cOr try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 12px; color: #f59e0b;');
