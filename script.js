// ===============================================
// DEBA PRIYO GUHA - SPACE ADVENTURE RESUME GAME
// ===============================================

let score = 0;
let lastSection = '';
let konami = '';
const konamiCode = '38384040373937396665'; // ↑↑↓↓←→←→BA
let music = null;
let windowDone = false;

// ====================
// SOUNDS
// ====================
const beep = new Audio('assets/beep.mp3');
const confettiSound = new Audio('assets/confetti.mp3');
beep.volume = 0.5;
confettiSound.volume = 0.7;

// ====================
// CANVAS GAME (ROCKET + ASTEROIDS)
// ====================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 130;
canvas.height = 130;

let rocket = { x: 65, y: 110, width: 45, height: 55 };
let asteroids = [];
let stars = [];

// Rocket & Asteroid Images (Fallback if assets/ missing)
const rocketImg = new Image();
rocketImg.src = 'https://images.rawpixel.com/image_png_800/cHJpd

// Fallback images if local assets fail
const fallbackRocket = 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyNy0xNjktcC5wbmc.png';
const fallbackAsteroid = 'https://as1.ftcdn.net/jpg/05/34/22/72/1000_F_534227265_6BNB98Z1fN1D6Be4yAdYOtTLItkh6XX6.jpg';

rocketImg.onerror = () => { rocketImg.src = fallbackRocket; };
const asteroidImg = new Image();
asteroidImg.src = 'assets/asteroid.png';
asteroidImg.onerror = () => { asteroidImg.src = fallbackAsteroid; };

// Generate Stars
for (let i = 0; i < 70; i++) {
    stars.push({
        x: Math.random() * 130,
        y: Math.random() * 130,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.6 + 0.3
    });
}

// Draw Game
function draw() {
    ctx.clearRect(0, 0, 130, 130);

    // Stars
    stars.forEach(s => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.speed;
        if (s.y > 130) s.y = -10;
    });

    // Rocket
    ctx.drawImage(rocketImg, rocket.x - 22, rocket.y, rocket.width, rocket.height);

    // Asteroids
    asteroids = asteroids.filter(a => {
        ctx.drawImage(asteroidImg, a.x - 18, a.y, 36, 36);
        a.y += a.speed;
        return a.y < 150;
    });

    requestAnimationFrame(draw);
}

// ====================
// SCROLL TRACKING & PROGRESS
// ====================
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('progressBar').style.width = scrollPercent + '%';

    // Move Rocket
    rocket.y = 110 - (scrollPercent / 100) * 75;

    // Section Detection
    const sections = [
        'Research Interests', 'Education', 'Research Experience',
        'Publications', 'Certifications', 'Selected Projects',
        'Technical Skills', 'Awards', 'Leadership',
        'Professional Development', 'References'
    ];

    let currentSection = '';
    sections.forEach(s => {
        const el = document.getElementById(`section-${s}`);
        if (el && el.getBoundingClientRect().top < 220) {
            currentSection = s;
        }
    });

    if (currentSection && currentSection !== lastSection) {
        lastSection = currentSection;
        const points = [60, 80, 120, 90, 70, 140, 100, 130, 110, 90, 180];
        const titles = [
            "Curious Mind!", "Scholar!", "Researcher!", "Author!", "Certified!",
            "Builder!", "Tech Wizard!", "Champion!", "Leader!", "Pro!", "Legend!"
        ];
        const idx = sections.indexOf(currentSection);
        updateScore(points[idx], titles[idx]);
        highlightPlanet(currentSection);
    }

    // Journey Complete
    if (scrollPercent > 98 && !windowDone) {
        windowDone = true;
        confettiExplosion();
    }
});

// ====================
// PLANET NAVIGATION HIGHLIGHT
// ====================
function highlightPlanet(section) {
    document.querySelectorAll('.planet').forEach(p => p.classList.remove('active'));
    const planet = document.querySelector(`.planet[data-section="${section}"]`);
    if (planet) planet.classList.add('active');
}

// ====================
// SCORE & ACHIEVEMENT
// ====================
function updateScore(points, title) {
    score += points;
    document.getElementById('score').textContent = score;
    beep.currentTime = 0;
    beep.play();
    showAchievement(`${title} +${points} XP!`);
}

function showAchievement(text) {
    const popup = document.getElementById('achievementPopup');
    popup.textContent = text;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3500);
}

// ====================
// CONFETTI EXPLOSION
// ====================
function confettiExplosion() {
    confettiSound.currentTime = 0;
    confettiSound.play();
    confetti({
        particleCount: 250,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#fbbf24', '#3b82f6', '#1e40af', '#ffffff']
    });
    updateScore(600, "JOURNEY COMPLETE!");
}

// ====================
// KONAMI CODE EASTER EGG
// ====================
window.addEventListener('keydown', e => {
    konami += e.which;
    if (konami.length > konamiCode.length) {
        konami = konami.slice(-konamiCode.length);
    }
    if (konami === konamiCode) {
        konamiEaster();
    }
});

function konamiEaster() {
    document.body.style.filter = 'hue-rotate(180deg) invert(1)';
    setTimeout(() => {
        alert("KONAMI CODE UNLOCKED! You're a LEGEND!");
        document.body.style.filter = '';
        confetti({
            particleCount: 400,
            spread: 120,
            origin: { y: 0.6 }
        });
        updateScore(1500, "KONAMI MASTER");
    }, 1000);
}

// ====================
// MUSIC CONTROL
// ====================
function startMusic() {
    if (!music) {
        music = new Audio('assets/background.mp3');
        music.loop = true;
        music.volume = 0.4;
    }
    music.play().catch(() => {
        alert("Music blocked. Click anywhere to enable.");
        document.body.addEventListener('click', () => music.play(), { once: true });
    });
}

// ====================
// THEME TOGGLE (DARK / LIGHT)
// ====================
function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// ====================
// PDF DOWNLOAD (PRINT)
// ====================
function downloadPDF() {
    window.print();
}

// ====================
// INITIALIZATION
// ====================
window.onload = () => {
    // Restore Theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light');
    }

    // Start Game
    rocketImg.onload = () => {
        asteroidImg.onload = () => {
            draw();
            // Spawn Asteroids
            setInterval(() => {
                if (Math.random() < 0.45) {
                    asteroids.push({
                        x: Math.random() * 110 + 10,
                        y: -50,
                        speed: Math.random() * 2.5 + 1.2
                    });
                }
            }, 2800);
        };
    };

    // Fade-in Animation Observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.card').forEach(card => observer.observe(card));

    // Preload Sounds
    beep.load();
    confettiSound.load();
};
