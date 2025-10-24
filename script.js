let score = 0;
let lastSection = '';
let konami = '';
const konamiCode = '38384040373937396665';
let music = null;

// Sounds
const beep = new Audio('assets/beep.mp3');
const confettiSound = new Audio('assets/confetti.mp3');
beep.volume = 0.4; confettiSound.volume = 0.6;

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 120; canvas.height = 120;
let rocket = { x: 60, y: 100, width: 40, height: 50 };
let asteroids = [], stars = [];

// Images
const rocketImg = new Image(); rocketImg.src = 'assets/rocket.png';
const asteroidImg = new Image(); asteroidImg.src = 'assets/asteroid.png';

// Stars
for (let i = 0; i < 60; i++) stars.push({ x: Math.random()*120, y: Math.random()*120, size: Math.random()*2, speed: Math.random()*0.5+0.2 });

// Draw
function draw() {
    ctx.clearRect(0,0,120,120);
    stars.forEach(s => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill(); s.y += s.speed; if (s.y > 120) s.y = 0; });
    ctx.drawImage(rocketImg, rocket.x-20, rocket.y, rocket.width, rocket.height);
    asteroids = asteroids.filter(a => { ctx.drawImage(asteroidImg, a.x-15, a.y, 30, 30); a.y += a.speed; return a.y < 140; });
    requestAnimationFrame(draw);
}

// Scroll
window.addEventListener('scroll', () => {
    const scroll = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    rocket.y = 100 - (scroll/100)*70;

    const sections = ['Research Interests','Education','Research Experience','Publications','Certifications','Selected Projects','Technical Skills','Awards','Leadership','Professional Development','References'];
    let current = '';
    sections.forEach(s => { const el = document.querySelector(`#section-${s.replace(/ /g,' ')}`); if (el && el.getBoundingClientRect().top < 200) current = s; });

    if (current && current !== lastSection) {
        lastSection = current;
        const points = [50,70,100,80,60,120,90,110,100,80,150][sections.indexOf(current)];
        const titles = ["Curious!", "Scholar!", "Researcher!", "Author!", "Certified!", "Builder!", "Wizard!", "Champion!", "Leader!", "Pro!", "Legend!"];
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
    setTimeout(() => p.className = 'achievement', 3000);
}

// Confetti
function confettiExplosion() {
    confettiSound.play();
    confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
    updateScore(500, "JOURNEY COMPLETE!");
}

// Konami
window.addEventListener('keydown', e => {
    konami += e.which;
    if (konami.length > konamiCode.length) konami = konami.slice(-konamiCode.length);
    if (konami === konamiCode) konamiEaster();
});
function konamiEaster() {
    document.body.style.filter = 'hue-rotate(180deg) invert(1)'; setTimeout(() => {
        alert("KONAMI UNLOCKED! You're a LEGEND!");
        document.body.style.filter = '';
        confetti({ particleCount: 300, spread: 100 });
        updateScore(1000, "KONAMI MASTER");
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
    rocketImg.onload = () => { asteroidImg.onload = () => { draw(); setInterval(() => { if (Math.random()<0.4) asteroids.push({x: Math.random()*100+10, y: -40, speed: Math.random()*2+1}); }, 3000); }};
    const obs = new IntersectionObserver(e => e.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); }), { threshold: 0.1 });
    document.querySelectorAll('.card').forEach(c => obs.observe(c));
};

function toggleTheme() {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}
function downloadPDF() { window.print(); }
