// --- Space Shooter Game Logic ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let gameLoop;
let score, player, bullets, asteroids, keys;

// Sounds are defined in main.js, we just need a way to play them
// We will pass the playSound function to the game logic
let playSoundDelegate = () => {}; 

function initGame() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    score = 0;
    keys = {};
    player = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50, speed: 5, color: '#6366f1' };
    bullets = [];
    asteroids = [];
    for (let i = 0; i < 5; i++) spawnAsteroid();
}

function spawnAsteroid() {
    asteroids.push({
        x: Math.random() * canvas.width,
        y: -30,
        radius: Math.random() * 20 + 10,
        speed: Math.random() * 2 + 1,
        color: '#f59e0b'
    });
}

function updateGame() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

    bullets.forEach((bullet, bIndex) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(bIndex, 1);
        asteroids.forEach((asteroid, aIndex) => {
            const dist = Math.hypot(bullet.x - asteroid.x, bullet.y - asteroid.y);
            if (dist < bullet.radius + asteroid.radius) {
                playSoundDelegate('achievement');
                score += Math.floor(asteroid.radius);
                bullets.splice(bIndex, 1);
                asteroids.splice(aIndex, 1);
                spawnAsteroid();
            }
        });
    });

    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;
        if (asteroid.y > canvas.height + asteroid.radius) {
            asteroids.splice(index, 1);
            spawnAsteroid();
        }
        if (player.x < asteroid.x + asteroid.radius && player.x + player.width > asteroid.x - asteroid.radius && player.y < asteroid.y + asteroid.radius && player.y + player.height > asteroid.y - asteroid.radius) {
            stopGame();
            alert(`Game Over! Your score: ${score}`);
        }
    });
}

function drawGame() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ec4899';
    bullets.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill(); });
    asteroids.forEach(a => { ctx.fillStyle = a.color; ctx.beginPath(); ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = 'white';
    ctx.font = '20px "JetBrains Mono"';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Press ESC to exit`, canvas.width - 180, 30);
}

function gameLoopFn() {
    updateGame();
    drawGame();
    gameLoop = requestAnimationFrame(gameLoopFn);
}

function startGame(soundPlayer) {
    playSoundDelegate = soundPlayer;
    if (!gameLoop) {
        initGame();
        gameLoop = requestAnimationFrame(gameLoopFn);
    }
}

function stopGame() {
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        gameLoop = null;
    }
}

window.addEventListener('keydown', (e) => {
    if (gameLoop) { // Only listen to game keys if game is running
        keys[e.key] = true;
        if (e.key === ' ') {
            e.preventDefault();
            bullets.push({ x: player.x + player.width / 2, y: player.y, radius: 5, speed: 10 });
            playSoundDelegate('click');
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (gameLoop) keys[e.key] = false;
});
