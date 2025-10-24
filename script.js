let score = 0;
let lastSection = '';
let konami = '';
const konamiCode = '38384040373937396665';
let music = null;

// Sounds
const beep = new Audio('assets/beep.mp3');
const confettiSound = new Audio('assets/confetti.mp3');
beep.volume = 0.5; confettiSound.volume = 0.7;

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 130; canvas.height = 130;
let rocket = { x: 65, y: 110, width: 45, height: 55 };
let asteroids = [], stars = [];

// Images
const rocketImg = new Image(); rocketImg.src = 'assets/rocket.png';
const asteroidImg = new Image(); asteroidImg.src = 'assets/asteroid.png';

// Stars
for (let i = 0; i < 70; i++) stars.push({ x: Math.random()*130, y: Math.random()*130, size: Math.random()*2.5, speed: Math.random()*0.6+0.3 });

// Draw
function draw() {
    ctx.clearRect(0,0,130,130);
    stars.forEach(s => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill(); s.y += s.speed; if (s.y > 130) s.y = 0; });
    ctx.drawImage(rocketImg, rocket.x-22, rocket.y, rocket.width, rocket.height);
    asteroids = asteroids.filter(a => { ctx.drawImage(asteroidImg, a.x-18, a.y, 36, 36); a.y += a.speed; return a.y < 150; });
    requestAnimationFrame(draw);
}

// Scroll
window.addEventListener('scroll', () => {
    const scroll = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    rocket.y = 110 - (scroll/100)*75;

    const sections = ['Research Interests','Education','Research Experience','Publications','Certifications','Selected Projects','Technical Skills','Awards','Leadership','Professional Development','References'];
    let current = '';
    sections.forEach(s => { const el = document.getElementById(`section-${s}`); if (el && el.getBoundingClientRect().top < 220) current = s; });

    if (current && current !== lastSection) {
        lastSection = current;
        const points = [60,80,120,90,70,140,100,130,110,90,180][sections.indexOf(current)];
        const titles = ["Curious Mind!", "Scholar!", "Researcher!", "Author!", "Certified!", "Builder!", "Tech Wizard!", "Champion!", "Leader!", "Pro!", "Legend!"];
        updateScore(points, titles[sections.indexOf(current)]);
        highlightPlanet(current);
    }

    document.getElementById('progressBar').style.width = scroll + '%';
    if (scroll > 98 && !window.done) { window.done = true; confettiExplosion(); }
});

// Planet Highlight
function highlightPlanet(section) {
    document.querySelectorAll('.planet').forEach(p => p.classList.remove('active'));
    const planet = document.querySelector(`.planet[data-section="${section}"]`);
    if (planet) planet.classList.add('active');
}

// Score
function updateScore(p, t) {
    score += p; document.getElementById('score').textContent = score;
    beep.currentTime = 0; beep.play();
    showAchievement(`${t} +${p} XP!`);
}
function showAchievement(t) {
    const p = document.getElementById('achievementPopup');
    p.textContent = t; p.className = 'achievement show';
    setTimeout(() => p.className = 'achievement', 3500);
}

// Confetti
function confettiExplosion() {
    confettiSound.play();
    confetti({ particleCount: 250, spread: 80, origin: { y: 0.55 } });
    updateScore(600, "JOURNEY COMPLETE!");
}

// Konami
window.addEventListener('keydown', e => {
    konami += e.which;
    if (konami.length > konamiCode.length) konami = konami.slice(-konamiCode.length);
    if (konami === konamiCode) konamiEaster();
});
function konamiEaster() {
    document.body.style.filter = 'hue-rotate(180deg) invert(1)'; setTimeout(() => {
        alert("KONAMI CODE UNLOCKED! You're a LEGEND!");
        document.body.style.filter = '';
        confetti({ particleCount: 400, spread: 120 });
        updateScore(1500, "KONAMI MASTER");
    }, 1000);
}

// Music
function startMusic() {
    if (!music) { music = new Audio('assets/background.mp3'); music.loop = true; }
    music.play();
}

// Init
window.onload = () => {
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');
    rocketImg.onload = () => { asteroidImg.onload = () => { draw(); setInterval(() => { if (Math.random()<0.45) asteroids.push({x: Math.random()*110+10, y: -50, speed: Math.random()*2.5+1.2}); }, 2800); }};
    const obs = new IntersectionObserver(e => e.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); }), { threshold: 0.12 });
    document.querySelectorAll('.card').forEach(c => obs.observe(c));
};

function toggleTheme() {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}
function downloadPDF() { window.print(); }
