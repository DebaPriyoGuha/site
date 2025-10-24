// script.js - FULL FUN MODE

let score = 0;
let lastSection = '';
let konami = '';
const konamiCode = '38384040373937396665';
let asteroidTimer = null;

// Sound
const beep = new Audio('assets/beep.mp3');
beep.volume = 0.3;

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 100;
canvas.height = 100;
canvas.style.position = 'fixed';
canvas.style.bottom = '20px';
canvas.style.right = '20px';
canvas.style.zIndex = '9999';
canvas.style.pointerEvents = 'none';

let rocket = { x: 50, y: 80, width: 30, height: 40 };
let asteroids = [];
let stars = [];

// Create Stars
for (let i = 0; i < 50; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2
    });
}

// Rocket Image
const rocketImg = new Image();
rocketImg.src = 'assets/rocket.png';

// Asteroid Image
const asteroidImg = new Image();
asteroidImg.src = 'assets/asteroid.png';

// Update Score
function updateScore(points, title) {
    score += points;
    document.getElementById('score').textContent = score;
    beep.currentTime = 0;
    beep.play();

    showAchievement(`${title} +${points} XP!`);
}

// Show Achievement
function showAchievement(text) {
    const popup = document.getElementById('achievementPopup');
    popup.textContent = text;
    popup.className = 'achievement show';
    setTimeout(() => popup.className = 'achievement', 3000);
}

// Spawn Random Asteroid
function spawnAsteroid() {
    if (Math.random() < 0.3) return;
    asteroids.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -40,
        width: 30,
        height: 30,
        speed: Math.random() * 2 + 1
    });
    setTimeout(spawnAsteroid, Math.random() * 5000 + 3000);
}

// Draw Everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(star => {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
    });

    // Rocket
    ctx.drawImage(rocketImg, rocket.x - rocket.width/2, rocket.y, rocket.width, rocket.height);

    // Asteroids
    asteroids = asteroids.filter(a => {
        ctx.drawImage(asteroidImg, a.x - a.width/2, a.y, a.width, a.height);
        a.y += a.speed;
        return a.y < canvas.height + 50;
    });

    requestAnimationFrame(draw);
}

// Scroll-based Rocket Movement
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    rocket.y = 80 - (scrollPercent / 100) * 60;

    // Section Detection
    const sections = ['Research Interests', 'Education', 'Research Experience', 'Publications', 'Certifications', 'Selected Projects', 'Technical Skills', 'Awards', 'Leadership', 'Professional Development', 'References'];
    let current = '';
    sections.forEach(sec => {
        const el = document.querySelector(`h2:contains("${sec}")`);
        if (el && el.getBoundingClientRect().top < 200) current = sec;
    });

    if (current && current !== lastSection) {
        lastSection = current;
        const points = [50, 70, 100, 80, 60, 120, 90, 110, 100, 80, 150][sections.indexOf(current)] || 50;
        const titles = [
            "Curious Mind!", "Scholar!", "Researcher!", "Author!", "Certified!", "Builder!", "Tech Wizard!", "Champion!", "Leader!", "Pro!", "Legend!"
        ];
        updateScore(points, titles[sections.indexOf(current)]);
    }

    // Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';

    // 100% Scroll = CONFETTI
    if (scrolled > 98 && !window.confettiDone) {
        window.confettiDone = true;
        confettiExplosion();
    }
});

// Konami Easter Egg
window.addEventListener('keydown', e => {
    konami += e.which;
    if (konami.length > konamiCode.length) konami = konami.slice(-konamiCode.length);
    if (konami === konamiCode) {
        konamiEasterEgg();
    }
});

// Konami Easter Egg Surprise
function konamiEasterEgg() {
    document.body.style.filter = 'hue-rotate(180deg) invert(1)';
    document.body.style.transition = '1s';
    setTimeout(() => {
        alert("KONAMI CODE UNLOCKED! You're a LEGEND!");
        document.body.style.filter = '';
        updateScore(500, "KONAMI MASTER");
    }, 1000);
}

// Confetti Explosion
function confettiExplosion() {
    const confettiSettings = { target: 'gameCanvas', max: 200, size: 1, animate: true, clock: 30 };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    setTimeout(() => confetti.clear(), 5000);
    updateScore(300, "JOURNEY COMPLETE!");
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    const icon = document.querySelector('.theme-btn i');
    if (document.body.classList.contains('dark')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

function downloadPDF() {
    window.print();
}

// Load Theme
window.onload = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark');
        document.querySelector('.theme-btn i').classList.replace('fa-moon', 'fa-sun');
    }

    // Start Game
    rocketImg.onload = () => {
        asteroidImg.onload = () => {
            draw();
            spawnAsteroid();
        };
    };

    // Animate Cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card').forEach(card => observer.observe(card));
};
