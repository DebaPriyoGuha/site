// ============================================================================
// GAME.JS - SPACE SHOOTER MINI GAME
// ============================================================================

let gameCanvas, ctx;
let gameState = {
    playing: false,
    score: 0,
    wave: 1,
    lives: 3
};

let player = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    speed: 5,
    dx: 0,
    dy: 0
};

let bullets = [];
let enemies = [];
let particles = [];
let stars = [];

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 600;

// ============================================================================
// INITIALIZE GAME
// ============================================================================

function initGame() {
    gameCanvas = document.getElementById('game-canvas');
    if (!gameCanvas) return;

    ctx = gameCanvas.getContext('2d');

    // Set canvas size
    gameCanvas.width = CANVAS_WIDTH;
    gameCanvas.height = CANVAS_HEIGHT;

    // Initialize player
    player.x = CANVAS_WIDTH / 2 - player.width / 2;
    player.y = CANVAS_HEIGHT - player.height - 20;

    // Reset game state
    gameState = {
        playing: true,
        score: 0,
        wave: 1,
        lives: 3
    };

    bullets = [];
    enemies = [];
    particles = [];
    stars = generateStars();

    // Create initial enemies
    spawnWave();

    // Setup controls
    setupControls();

    // Start game loop
    gameLoop();
}

// ============================================================================
// STARS BACKGROUND
// ============================================================================

function generateStars() {
    const starArray = [];
    for (let i = 0; i < 50; i++) {
        starArray.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            radius: Math.random() * 1.5,
            opacity: Math.random() * 0.5 + 0.5,
            twinkleSpeed: Math.random() * 0.02
        });
    }
    return starArray;
}

function drawStars() {
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Twinkling effect
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0.3) {
            star.twinkleSpeed *= -1;
        }
    });
}

// ============================================================================
// SPAWN ENEMIES
// ============================================================================

function spawnWave() {
    enemies = [];
    const enemyCount = 3 + gameState.wave;

    for (let i = 0; i < enemyCount; i++) {
        enemies.push({
            x: (i % 4) * (CANVAS_WIDTH / 4) + 30,
            y: Math.random() * 100 + 20,
            width: 30,
            height: 30,
            speed: 1 + gameState.wave * 0.3,
            health: 1,
            shootTimer: Math.random() * 120
        });
    }
}

// ============================================================================
// PLAYER
// ============================================================================

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

    // Ship body
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(0, -player.height / 2);
    ctx.lineTo(player.width / 2, player.height / 2);
    ctx.lineTo(0, player.height / 3);
    ctx.lineTo(-player.width / 2, player.height / 2);
    ctx.closePath();
    ctx.fill();

    // Glow effect
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Engine flame
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-8, player.height / 3);
    ctx.lineTo(8, player.height / 3);
    ctx.lineTo(0, player.height / 2 + 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Boundary checking
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > CANVAS_WIDTH) player.x = CANVAS_WIDTH - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > CANVAS_HEIGHT) player.y = CANVAS_HEIGHT - player.height;
}

// ============================================================================
// BULLETS
// ============================================================================

function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 12,
        speed: 7,
        damage: 1
    });
    SoundManager.play('clickSound');
}

function drawBullets() {
    ctx.fillStyle = '#f59e0b';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Glow
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(bullet.x - 1, bullet.y - 1, bullet.width + 2, bullet.height + 2);
    });
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;

        if (bullets[i].y < -10) {
            bullets.splice(i, 1);
        }
    }
}

// ============================================================================
// ENEMIES
// ============================================================================

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);

        // Enemy body
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(-6, -4, 4, 4);
        ctx.fillRect(2, -4, 4, 4);

        // Glow
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.width / 2 + 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    });
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x += Math.sin(Date.now() * 0.001 + index) * enemy.speed;
        enemy.y += enemy.speed * 0.5;

        // Shoot occasionally
        enemy.shootTimer--;
        if (enemy.shootTimer <= 0) {
            shootEnemyBullet(enemy);
            enemy.shootTimer = 80 + Math.random() * 40;
        }

        // Check if off screen
        if (enemy.y > CANVAS_HEIGHT) {
            gameState.lives--;
            enemies.splice(index, 1);
        }
    });

    if (enemies.length === 0) {
        gameState.wave++;
        spawnWave();
    }
}

// Enemy bullets
let enemyBullets = [];

function shootEnemyBullet(enemy) {
    enemyBullets.push({
        x: enemy.x + enemy.width / 2,
        y: enemy.y + enemy.height / 2,
        width: 6,
        height: 12,
        speed: 4
    });
}

function drawEnemyBullets() {
    ctx.fillStyle = '#ef4444';
    enemyBullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateEnemyBullets() {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].speed;

        // Check collision with player
        if (checkCollision(
            enemyBullets[i].x - enemyBullets[i].width / 2,
            enemyBullets[i].y - enemyBullets[i].width / 2,
            enemyBullets[i].width,
            enemyBullets[i].width,
            player.x,
            player.y,
            player.width,
            player.height
        )) {
            gameState.lives--;
            createExplosion(player.x + player.width / 2, player.y + player.height / 2, 10, '#ff0000');
            enemyBullets.splice(i, 1);
            continue;
        }

        if (enemyBullets[i].y > CANVAS_HEIGHT + 10) {
            enemyBullets.splice(i, 1);
        }
    }
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

function detectCollisions() {
    // Bullet-Enemy collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(
                bullets[i].x,
                bullets[i].y,
                bullets[i].width,
                bullets[i].height,
                enemies[j].x,
                enemies[j].y,
                enemies[j].width,
                enemies[j].height
            )) {
                createExplosion(enemies[j].x + enemies[j].width / 2, enemies[j].y + enemies[j].height / 2, 15, '#f59e0b');
                gameState.score += 10 * gameState.wave;
                SoundManager.play('achievementSound');
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                break;
            }
        }
    }
}

// ============================================================================
// PARTICLES & EXPLOSIONS
// ============================================================================

function createExplosion(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 - 2,
            color: color,
            life: 1,
            size: Math.random() * 4 + 2
        });
    }
}

function drawParticles() {
    ctx.save();
    particles.forEach(particle => {
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].vy += 0.2; // gravity
        particles[i].life -= 0.02;

        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// ============================================================================
// CONTROLS
// ============================================================================

function setupControls() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(e) {
    if (!gameState.playing) return;

    switch (e.key.toLowerCase()) {
        case 'arrowleft':
            player.dx = -player.speed;
            break;
        case 'arrowright':
            player.dx = player.speed;
            break;
        case 'arrowup':
            player.dy = -player.speed;
            break;
        case 'arrowdown':
            player.dy = player.speed;
            break;
        case ' ':
            e.preventDefault();
            shootBullet();
            break;
    }
}

function handleKeyUp(e) {
    switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'arrowright':
            player.dx = 0;
            break;
        case 'arrowup':
        case 'arrowdown':
            player.dy = 0;
            break;
    }
}

// ============================================================================
// HUD
// ============================================================================

function drawHUD() {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Poppins, sans-serif';
    ctx.fillText(`Score: ${gameState.score}`, 15, 30);
    ctx.fillText(`Wave: ${gameState.wave}`, 15, 55);

    // Lives
    ctx.fillStyle = '#ef4444';
    for (let i = 0; i < gameState.lives; i++) {
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH - 30 - i * 25, 25, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// ============================================================================
// GAME LOOP
// ============================================================================

function gameLoop() {
    if (!gameState.playing) return;

    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw starfield
    drawStars();

    // Update and draw
    updatePlayer();
    drawPlayer();

    updateBullets();
    drawBullets();

    updateEnemies();
    drawEnemies();

    updateEnemyBullets();
    drawEnemyBullets();

    updateParticles();
    drawParticles();

    detectCollisions();
    drawHUD();

    // Game over check
    if (gameState.lives <= 0) {
        endGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

// ============================================================================
// GAME END
// ============================================================================

function endGame() {
    gameState.playing = false;

    // Draw game over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

    ctx.font = '24px Poppins, sans-serif';
    ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    ctx.fillText(`Wave: ${gameState.wave}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);

    // Cleanup
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    SoundManager.play('achievementSound');
}

// ============================================================================
// PUBLIC API
// ============================================================================

window.startGame = initGame;
