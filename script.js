let score = 0;
let lastSection = '';
let konami = '';
const konamiCode = '38384040373937396665';
let music = null;

// Sounds
const beep = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-notification-ding-862.mp3');
const confettiSound = new Audio('assets/confetti.mp3');
beep.volume = 0.5; confettiSound.volume = 0.7;

function playPhotoSound() {
    beep.currentTime = 0;
    beep.play();
}

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 130; canvas.height = 130;
let rocket = { x: 65, y: 110, width: 45, height: 55 };
let asteroids = [], stars = [];

// Images
const rocketImg = new Image(); rocketImg.src = 'assets/rocket.png';
rocketImg.onerror = () => { rocketImg.src = 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyNy0xNjktcC5wbmc.png'; };
const asteroidImg = new Image(); asteroidImg.src = 'assets/asteroid.png';
asteroidImg.onerror = () => { asteroidImg.src = 'https://as1.ftcdn.net/jpg/05/34/22/72/1000_F_534227265_6BNB98Z1fN1D6Be4yAdYOtTLItkh6XX6.jpg'; };

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

    const sections = ['Summary','Research Interests','Education','Research Experience','Publications','Selected Projects','Technical Skills','Certifications','Awards','Leadership','Professional Development','Languages','Personal Interests','References'];
    let current = '';
    sections.forEach(s => { const el = document.getElementById(`section-${s}`); if (el && el.getBoundingClientRect().top < 250) current = s; });

    if (current && current !== lastSection) {
        lastSection = current;
        const points = [50,70,100,130,90,150,110,80,120,100,90,70,60,180];
        const titles = ["Welcome!", "Curious!", "Scholar!", "Researcher!", "Author!", "Builder!", "Tech Wizard!", "Certified!", "Champion!", "Leader!", "Pro!", "Linguist!", "Explorer!", "Legend!"];
        updateScore(points[sections.indexOf(current)], titles[sections.indexOf(current)]);
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
    confetti({ particleCount: 300, spread: 90, origin: { y: 0.55 } });
    updateScore(800, "JOURNEY COMPLETE!");
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
        confetti({ particleCount: 500, spread: 140 });
        updateScore(2000, "KONAMI MASTER");
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
    rocketImg.onload = () => { asteroidImg.onload = () => { draw(); setInterval(() => { if (Math.random()<0.5) asteroids.push({x: Math.random()*110+10, y: -50, speed: Math.random()*2.5+1.2}); }, 2500); }};
    const obs = new IntersectionObserver(e => e.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); }), { threshold: 0.12 });
    document.querySelectorAll('.card').forEach(c => obs.observe(c));
    initMiniGame();
};

function toggleTheme() {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}
function downloadPDF() { window.print(); }

// ====================
// MINI GAME: SPACE DEFENDER
// ====================
let miniGame = {
    canvas: null, ctx: null, player: { x: 200, y: 400, width: 50, height: 60 },
    bullets: [], enemies: [], score: 0, lives: 3, gameRunning: false, keys: {}
};

const shootSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-laser-weapon-shot-1681.mp3');
const explosionSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-explosion-hit-1704.mp3');
shootSound.volume = 0.4; explosionSound.volume = 0.6;

function initMiniGame() {
    miniGame.canvas = document.getElementById('miniGameCanvas');
    miniGame.ctx = miniGame.canvas.getContext('2d');
    document.getElementById('startGameBtn').addEventListener('click', startMiniGame);
    window.addEventListener('keydown', e => { if (miniGame.gameRunning) miniGame.keys[e.key] = true; });
    window.addEventListener('keyup', e => { miniGame.keys[e.key] = false; });
}

function startMiniGame() {
    if (miniGame.gameRunning) return;
    miniGame.score = 0; miniGame.lives = 3; miniGame.bullets = []; miniGame.enemies = []; miniGame.player.x = 200;
    miniGame.gameRunning = true;
    document.getElementById('gameScore').textContent = 0;
    document.getElementById('gameLives').textContent = 3;
    document.getElementById('startGameBtn').textContent = 'Playing...';
    document.getElementById('startGameBtn').disabled = true;
    setInterval(() => { if (miniGame.gameRunning) miniGame.enemies.push({ x: Math.random() * 340 + 30, y: -40, width: 40, height: 40, speed: Math.random() * 3 + 2 }); }, 1200);
    gameLoop();
}

function gameLoop() {
    if (!miniGame.gameRunning) return;
    const ctx = miniGame.ctx;
    ctx.clearRect(0, 0, 400, 500);
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, 400, 500);
    for (let i = 0; i < 50; i++) { ctx.fillStyle = '#fff'; ctx.fillRect((i * 37) % 400, (Date.now() * 0.1 + i * 20) % 500, 2, 2); }

    if (miniGame.keys['ArrowLeft'] && miniGame.player.x > 25) miniGame.player.x -= 7;
    if (miniGame.keys['ArrowRight'] && miniGame.player.x < 350) miniGame.player.x += 7;
    if (miniGame.keys[' '] && !miniGame.keys.spacePressed) {
        miniGame.bullets.push({ x: miniGame.player.x + 22, y: miniGame.player.y, width: 6, height: 15 });
        shootSound.currentTime = 0; shootSound.play();
        miniGame.keys.spacePressed = true;
    }
    if (!miniGame.keys[' ']) miniGame.keys.spacePressed = false;

    ctx.fillStyle = '#3b82f6'; ctx.fillRect(miniGame.player.x, miniGame.player.y, miniGame.player.width, miniGame.player.height);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(miniGame.player.x + 15, miniGame.player.y - 10, 20, 20);

    miniGame.bullets = miniGame.bullets.filter(b => { ctx.fillStyle = '#fbbf24'; ctx.fillRect(b.x, b.y, b.width, b.height); b.y -= 10; return b.y > -20; });
    miniGame.enemies = miniGame.enemies.filter(e => {
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(e.x + 20, e.y + 20, 20, 0, Math.PI * 2); ctx.fill(); e.y += e.speed;
        if (e.y > 380 && Math.abs(e.x - miniGame.player.x) < 50) { miniGame.lives--; document.getElementById('gameLives').textContent = miniGame.lives; explosionSound.play(); if (miniGame.lives <= 0) endMiniGame(); return false; }
        return e.y < 520;
    });

    miniGame.bullets = miniGame.bullets.filter(b => {
        let hit = false;
        miniGame.enemies = miniGame.enemies.filter(e => {
            if (b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
                hit = true; miniGame.score += 10; document.getElementById('gameScore').textContent = miniGame.score;
                explosionSound.play(); confetti({ particleCount: 30, spread: 60, origin: { x: b.x/400, y: b.y/500 } });
                return false;
            }
            return true;
        });
        return !hit;
    });

    requestAnimationFrame(gameLoop);
}

function endMiniGame() {
    miniGame.gameRunning = false;
    document.getElementById('startGameBtn').textContent = 'Play Again';
    document.getElementById('startGameBtn').disabled = false;
    showAchievement(`Game Over! Final Score: ${miniGame.score}`);
    if (miniGame.score > 100) { updateScore(600, "SPACE HERO!"); confetti({ particleCount: 250, spread: 100 }); }
}
