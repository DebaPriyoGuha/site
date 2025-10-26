// ===================================
// MAIN JAVASCRIPT FILE
// ===================================

// Global Variables
let currentTheme = localStorage.getItem('theme') || 'light';
let musicEnabled = false;
let soundsEnabled = true;
let game = null;
let soundsInitialized = false;

// Audio Elements
const bgMusic = document.getElementById('bgMusic');
const clickSound = document.getElementById('clickSound');
const achievementSound = document.getElementById('achievementSound');
const profileOpenSound = document.getElementById('profileOpenSound');

// Store audio globally for game access
window.clickSound = clickSound;
window.achievementSound = achievementSound;

// ===================================
// INITIALIZE ON DOM LOAD
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
    initSkillBars();
    setupAudio();
    initKonamiCode();
    
    console.log('%c🚀 Portfolio Loaded Successfully!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
    console.log('%c🎮 Press "G" to play Space Shooter!', 'font-size: 14px; color: #ec4899;');
    console.log('%c🎯 Try Konami Code: ↑↑↓↓←→←→BA', 'font-size: 12px; color: #f59e0b;');
});

// ===================================
// THEME SYSTEM
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
// PARTICLES BACKGROUND
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
// NAVIGATION
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
                
                // Achievement sound on section enter (except first load)
                if (entry.target.classList.contains('section') && soundsInitialized) {
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
// TYPING ANIMATION
// ===================================
function initTyping() {
    const typingText = document.getElementById('typingText');
    const phrases = [
        'Machine Learning Researcher',
        'Astrophysics Enthusiast',
        'Radio Astronomy Specialist',
        'Deep Learning Expert',
        'Data Science Professional',
        'Problem Solver',
        'STEM Educator'
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
// SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.research-card, .project-card, .award-card, .timeline-item, .leadership-card, .interest-card, .cert-card'
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
                observer.unobserve(entry.target);
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
// SKILL BARS ANIMATION
// ===================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ===================================
// PROFILE MODAL
// ===================================
function initProfileModal() {
    const profileWrapper = document.getElementById('profileWrapper');
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
    
    // Click backdrop to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            if (document.getElementById('gameContainer').classList.contains('active')) {
                closeGame();
            }
        }
    });
}

// ===================================
// MINI GAME
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
    window.closeGame = function() {
        playClickSound();
        gameContainer.classList.remove('active');
        document.body.style.overflow = 'auto';
        game.stop();
    }
    
    gameToggle.addEventListener('click', openGame);
    gameClose.addEventListener('click', closeGame);
    
    // Press 'G' to open game
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'g' && !gameContainer.classList.contains('active') && !document.getElementById('profileModal').classList.contains('active')) {
            openGame();
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
// CONTACT FORM WITH EMAILJS
// ===================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send email via EmailJS
            // IMPORTANT: Replace these with your actual EmailJS credentials
            const response = await emailjs.sendForm(
                'YOUR_SERVICE_ID',     // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID',    // Replace with your EmailJS template ID
                contactForm
            );
            
            console.log('Email sent successfully!', response.status, response.text);
            
            // Success feedback
            playAchievementSound();
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Show success notification
            showNotification('Message sent successfully! I\'ll get back to you soon. 🚀', 'success');
            
            // Reset form
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
            
        } catch (error) {
            console.error('Email send failed:', error);
            
            // Error feedback
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            showNotification('Failed to send message. Please email directly: debapriyoguha@gmail.com', 'error');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===================================
// ANIMATED COUNTERS
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
// AUDIO SYSTEM
// ===================================
function setupAudio() {
    const musicToggle = document.getElementById('musicToggle');
    
    // Set volumes
    if (bgMusic) bgMusic.volume = 0.3;
    if (clickSound) clickSound.volume = 0.5;
    if (achievementSound) achievementSound.volume = 0.6;
    if (profileOpenSound) profileOpenSound.volume = 0.5;
    
    // Music toggle
    musicToggle.addEventListener('click', () => {
        playClickSound();
        musicEnabled = !musicEnabled;
        
        if (musicEnabled) {
            bgMusic.play().catch(e => {
                console.log('Music autoplay blocked - user interaction needed');
            });
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.classList.add('active');
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicToggle.classList.remove('active');
        }
    });
}

// Sound play functions with error handling
function playClickSound() {
    if (soundsEnabled && clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Click sound error:', e));
    }
}

function playAchievementSound() {
    if (soundsEnabled && achievementSound) {
        achievementSound.currentTime = 0;
        achievementSound.play().catch(e => console.log('Achievement sound error:', e));
    }
}

function playProfileOpenSound() {
    if (soundsEnabled && profileOpenSound) {
        profileOpenSound.currentTime = 0;
        profileOpenSound.play().catch(e => console.log('Profile sound error:', e));
    }
}

// Enable sounds after first user interaction
document.addEventListener('click', () => {
    if (!soundsInitialized) {
        soundsInitialized = true;
        // Pre-load sounds
        [clickSound, achievementSound, profileOpenSound].forEach(sound => {
            if (sound) {
                sound.load();
            }
        });
        console.log('✅ Sounds initialized!');
    }
}, { once: true });

// ===================================
// KONAMI CODE EASTER EGG
// ===================================
function initKonamiCode() {
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join('') === konamiSequence.join('')) {
            activateKonamiMode();
        }
    });
}

function activateKonamiMode() {
    playAchievementSound();
    
    // Add rainbow animation
    document.body.style.animation = 'rainbow 2s linear';
    
    // Create confetti
    createConfetti();
    
    setTimeout(() => {
        document.body.style.animation = '';
        showNotification('🎉 Konami Code Activated! You found the secret! 🎮', 'success');
    }, 2000);
}

function createConfetti() {
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.zIndex = '10000';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        const fall = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        fall.onfinish = () => confetti.remove();
    }
}

// Rainbow animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}

// ===================================
// CONSOLE ART
// ===================================
console.log('%c██████╗ ██████╗  ██████╗ ', 'color: #6366f1; font-weight: bold;');
console.log('%c██╔══██╗██╔══██╗██╔════╝ ', 'color: #6366f1; font-weight: bold;');
console.log('%c██║  ██║██████╔╝██║  ███╗', 'color: #ec4899; font-weight: bold;');
console.log('%c██║  ██║██╔═══╝ ██║   ██║', 'color: #ec4899; font-weight: bold;');
console.log('%c██████╔╝██║     ╚██████╔╝', 'color: #f59e0b; font-weight: bold;');
console.log('%c╚═════╝ ╚═╝      ╚═════╝ ', 'color: #f59e0b; font-weight: bold;');
console.log('%c                          ', 'color: #10b981;');
console.log('%cDeba Priyo Guha Portfolio', 'color: #10b981; font-size: 16px; font-weight: bold;');
console.log('%cMachine Learning Researcher', 'color: #94a3b8; font-size: 12px;');
