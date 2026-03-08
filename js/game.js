/* ============================================================
   GAME.JS — Space Shooter (appears after 5 minutes)
============================================================ */

'use strict';

(function () {
    const TRIGGER_TIME    = 5 * 60 * 1000; // 5 minutes
    const SESSION_KEY     = 'portfolio-game-shown';
    const CANVAS_W        = 480;
    const CANVAS_H        = 520;

    let gameLoop = null;
    let state    = {};

    // ── Show modal after trigger time ───────────────────
    function initTrigger() {
        if (sessionStorage.getItem(SESSION_KEY)) return;
        setTimeout(() => {
            show();
            sessionStorage.setItem(SESSION_KEY, '1');
        }, TRIGGER_TIME);
    }

    function show() {
        const modal  = document.getElementById('gameModal');
        const prompt = document.getElementById('gamePrompt');
        const canvas = document.getElementById('gameCanvas');
        const hud    = document.getElementById('gameHud');
        if (!modal) return;
        prompt.style.display = 'block';
        canvas.style.display = 'none';
        hud.style.display    = 'none';
        modal.classList.add('open');
    }

    function exit() {
        stopGame();
        document.getElementById('gameModal')?.classList.remove('open');
    }

    // ── Game Core ────────────────────────────────────────
    function startGame() {
        const prompt = document.getElementById('gamePrompt');
        const canvas = document.getElementById('gameCanvas');
        const hud    = document.getElementById('gameHud');

        prompt.style.display = 'none';
        canvas.style.display = 'block';
        hud.style.display    = 'flex';

        canvas.width  = CANVAS_W;
        canvas.height = CANVAS_H;

        const ctx = canvas.getContext('2d');

        state = {
            player: { x: CANVAS_W / 2 - 18, y: CANVAS_H - 60, w: 36, h: 36, speed: 5 },
            bullets: [],
            enemies: [],
            score: 0,
            lives: 3,
            keys: {},
            running: true,
            enemyTimer: 0,
            enemyInterval: 80,
            bulletTimer: 0
        };

        document.addEventListener('keydown', onKey);
        document.addEventListener('keyup',   offKey);

        function onKey(e)  { state.keys[e.key] = true;  if (e.key === ' ') e.preventDefault(); }
        function offKey(e) { state.keys[e.key] = false; }

        function spawnEnemy() {
            state.enemies.push({
                x: Math.random() * (CANVAS_W - 28),
                y: -30,
                w: 28,
                h: 28,
                speed: 1.5 + Math.random() * 1.5 + state.score * 0.002
            });
        }

        function shoot() {
            state.bullets.push({
                x: state.player.x + state.player.w / 2 - 3,
                y: state.player.y,
                w: 6, h: 14, speed: 8
            });
        }

        function checkCollision(a, b) {
            return a.x < b.x + b.w && a.x + a.w > b.x &&
                   a.y < b.y + b.h && a.y + a.h > b.y;
        }

        function updateScore() {
            const el = document.getElementById('gameScore');
            if (el) el.textContent = state.score;
        }
        function updateLives() {
            const el = document.getElementById('gameLives');
            if (el) el.textContent = state.lives;
        }

        function drawPlayer(ctx) {
            // Simple spaceship shape
            ctx.fillStyle = '#2E7DD4';
            ctx.beginPath();
            ctx.moveTo(state.player.x + state.player.w / 2, state.player.y);
            ctx.lineTo(state.player.x + state.player.w, state.player.y + state.player.h);
            ctx.lineTo(state.player.x, state.player.y + state.player.h);
            ctx.closePath();
            ctx.fill();
            // Engine glow
            ctx.fillStyle = '#E8A87C';
            ctx.fillRect(
                state.player.x + state.player.w / 2 - 5,
                state.player.y + state.player.h,
                10, 6
            );
        }

        function drawEnemy(ctx, e) {
            ctx.fillStyle = '#C0392B';
            ctx.beginPath();
            ctx.moveTo(e.x + e.w / 2, e.y + e.h);
            ctx.lineTo(e.x + e.w, e.y);
            ctx.lineTo(e.x, e.y);
            ctx.closePath();
            ctx.fill();
        }

        function drawBullet(ctx, b) {
            ctx.fillStyle = '#F9CA24';
            ctx.fillRect(b.x, b.y, b.w, b.h);
        }

        function drawStars(ctx) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            // Static stars (seeded positions)
            for (let i = 0; i < 40; i++) {
                const sx = ((i * 97 + 13) % CANVAS_W);
                const sy = ((i * 53 + 7 + Date.now() * 0.02 * (i % 3 + 1)) % CANVAS_H);
                ctx.fillRect(sx, sy, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
            }
        }

        function gameFrame() {
            if (!state.running) return;

            // Clear
            ctx.fillStyle = '#0D1117';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

            drawStars(ctx);

            // Player movement
            if ((state.keys['ArrowLeft'] || state.keys['a'] || state.keys['A']) && state.player.x > 0)
                state.player.x -= state.player.speed;
            if ((state.keys['ArrowRight'] || state.keys['d'] || state.keys['D']) && state.player.x + state.player.w < CANVAS_W)
                state.player.x += state.player.speed;

            // Auto shoot
            state.bulletTimer++;
            if ((state.keys[' '] || state.keys['ArrowUp']) && state.bulletTimer > 12) {
                shoot();
                state.bulletTimer = 0;
            }

            // Spawn enemies
            state.enemyTimer++;
            if (state.enemyTimer >= state.enemyInterval) {
                spawnEnemy();
                state.enemyTimer = 0;
                state.enemyInterval = Math.max(30, state.enemyInterval - 0.5);
            }

            // Move bullets
            state.bullets = state.bullets
                .filter(b => b.y > -b.h)
                .map(b => ({ ...b, y: b.y - b.speed }));

            // Move enemies
            state.enemies = state.enemies
                .filter(e => {
                    if (e.y > CANVAS_H) {
                        state.lives--;
                        updateLives();
                        return false;
                    }
                    return true;
                })
                .map(e => ({ ...e, y: e.y + e.speed }));

            // Collision: bullets vs enemies
            state.bullets = state.bullets.filter(b => {
                let hit = false;
                state.enemies = state.enemies.filter(e => {
                    if (!hit && checkCollision(b, e)) {
                        hit = true;
                        state.score += 10;
                        updateScore();
                        return false;
                    }
                    return true;
                });
                return !hit;
            });

            // Collision: player vs enemies
            state.enemies = state.enemies.filter(e => {
                if (checkCollision(state.player, e)) {
                    state.lives--;
                    updateLives();
                    return false;
                }
                return true;
            });

            // Draw
            drawPlayer(ctx);
            state.bullets.forEach(b => drawBullet(ctx, b));
            state.enemies.forEach(e => drawEnemy(ctx, e));

            // HUD in canvas
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText('← → to move  |  Space to shoot', 10, CANVAS_H - 10);

            // Game over
            if (state.lives <= 0) {
                stopGame();
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 28px Playfair Display, serif';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over!', CANVAS_W / 2, CANVAS_H / 2 - 20);
                ctx.font = '16px Inter, sans-serif';
                ctx.fillText(`Score: ${state.score}`, CANVAS_W / 2, CANVAS_H / 2 + 15);
                ctx.font = '13px Inter, sans-serif';
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.fillText('Close to return to portfolio', CANVAS_W / 2, CANVAS_H / 2 + 45);
                ctx.textAlign = 'left';
                document.removeEventListener('keydown', onKey);
                document.removeEventListener('keyup',   offKey);
                return;
            }

            gameLoop = requestAnimationFrame(gameFrame);
        }

        gameLoop = requestAnimationFrame(gameFrame);
    }

    function stopGame() {
        state.running = false;
        if (gameLoop) {
            cancelAnimationFrame(gameLoop);
            gameLoop = null;
        }
    }

    // ── Init ─────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('startGameBtn')
            ?.addEventListener('click', startGame);
        document.getElementById('skipGameBtn')
            ?.addEventListener('click', exit);
        document.getElementById('exitGameBtn')
            ?.addEventListener('click', exit);
        document.getElementById('closeGameModal')
            ?.addEventListener('click', exit);

        initTrigger();
    });

    window.gameManager = { show, exit, start: startGame };
})();
