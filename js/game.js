/**
 * Space Shooter Game
 * Appears after 5-10 minutes on site
 * Deba Priyo Guha Portfolio
 */

(function() {
    'use strict';

    // Game configuration
    const GAME_TRIGGER_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
    const GAME_SHOWN_KEY = 'portfolio-game-shown';

    class SpaceShooter {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.width = canvas.width;
            this.height = canvas.height;
            
            this.player = {
                x: this.width / 2 - 25,
                y: this.height - 60,
                width: 50,
                height: 40,
                speed: 8,
                color: '#FDFBD4'
            };
            
            this.bullets = [];
            this.asteroids = [];
            this.particles = [];
            this.score = 0;
            this.gameOver = false;
            this.running = false;
            
            this.keys = {
                left: false,
                right: false,
                space: false
            };
            
            this.lastBulletTime = 0;
            this.bulletCooldown = 200;
            
            this.bindEvents();
        }

        bindEvents() {
            document.addEventListener('keydown', (e) => {
                if (!this.running) return;
                
                if (e.key === 'ArrowLeft' || e.key === 'a') {
                    this.keys.left = true;
                    e.preventDefault();
                }
                if (e.key === 'ArrowRight' || e.key === 'd') {
                    this.keys.right = true;
                    e.preventDefault();
                }
                if (e.key === ' ') {
                    this.keys.space = true;
                    e.preventDefault();
                }
            });

            document.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'a') {
                    this.keys.left = false;
                }
                if (e.key === 'ArrowRight' || e.key === 'd') {
                    this.keys.right = false;
                }
                if (e.key === ' ') {
                    this.keys.space = false;
                }
            });
        }

        start() {
            this.reset();
            this.running = true;
            this.gameLoop();
            this.spawnAsteroids();
        }

        reset() {
            this.player.x = this.width / 2 - 25;
            this.bullets = [];
            this.asteroids = [];
            this.particles = [];
            this.score = 0;
            this.gameOver = false;
            this.updateScoreDisplay();
        }

        stop() {
            this.running = false;
        }

        gameLoop() {
            if (!this.running) return;
            
            this.update();
            this.draw();
            
            requestAnimationFrame(() => this.gameLoop());
        }

        update() {
            if (this.gameOver) return;
            
            // Player movement
            if (this.keys.left && this.player.x > 0) {
                this.player.x -= this.player.speed;
            }
            if (this.keys.right && this.player.x < this.width - this.player.width) {
                this.player.x += this.player.speed;
            }
            
            // Shooting
            const now = Date.now();
            if (this.keys.space && now - this.lastBulletTime > this.bulletCooldown) {
                this.shoot();
                this.lastBulletTime = now;
            }
            
            // Update bullets
            this.bullets = this.bullets.filter(bullet => {
                bullet.y -= bullet.speed;
                return bullet.y > -10;
            });
            
            // Update asteroids
            this.asteroids = this.asteroids.filter(asteroid => {
                asteroid.y += asteroid.speed;
                asteroid.rotation += asteroid.rotationSpeed;
                
                // Check collision with player
                if (this.checkCollision(asteroid, this.player)) {
                    this.endGame();
                    return false;
                }
                
                return asteroid.y < this.height + 50;
            });
            
            // Check bullet-asteroid collisions
            this.bullets.forEach((bullet, bi) => {
                this.asteroids.forEach((asteroid, ai) => {
                    if (this.checkCollision(bullet, asteroid)) {
                        // Create explosion particles
                        this.createExplosion(asteroid.x + asteroid.size/2, asteroid.y + asteroid.size/2);
                        
                        // Remove both
                        this.bullets.splice(bi, 1);
                        this.asteroids.splice(ai, 1);
                        
                        // Increase score
                        this.score += 10;
                        this.updateScoreDisplay();
                    }
                });
            });
            
            // Update particles
            this.particles = this.particles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                return p.life > 0;
            });
        }

        draw() {
            // Clear canvas
            this.ctx.fillStyle = '#0a0a1a';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            // Draw stars background
            this.drawStars();
            
            // Draw particles
            this.particles.forEach(p => {
                this.ctx.globalAlpha = p.life;
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
            this.ctx.globalAlpha = 1;
            
            // Draw bullets
            this.ctx.fillStyle = '#4B2400';
            this.bullets.forEach(bullet => {
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
            
            // Draw asteroids
            this.asteroids.forEach(asteroid => {
                this.ctx.save();
                this.ctx.translate(asteroid.x + asteroid.size/2, asteroid.y + asteroid.size/2);
                this.ctx.rotate(asteroid.rotation);
                this.ctx.fillStyle = '#003C7B';
                this.ctx.beginPath();
                this.drawAsteroid(asteroid.size);
                this.ctx.fill();
                this.ctx.restore();
            });
            
            // Draw player (spaceship)
            this.drawPlayer();
            
            // Game over screen
            if (this.gameOver) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.width, this.height);
                
                this.ctx.fillStyle = '#FDFBD4';
                this.ctx.font = 'bold 36px Inter';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('GAME OVER', this.width/2, this.height/2 - 20);
                
                this.ctx.font = '20px Inter';
                this.ctx.fillText(`Score: ${this.score}`, this.width/2, this.height/2 + 20);
                
                this.ctx.font = '16px Inter';
                this.ctx.fillStyle = '#4B2400';
                this.ctx.fillText('Press SPACE to restart', this.width/2, this.height/2 + 60);
            }
        }

        drawStars() {
            this.ctx.fillStyle = 'rgba(253, 251, 212, 0.5)';
            for (let i = 0; i < 50; i++) {
                const x = (i * 37) % this.width;
                const y = (i * 53 + Date.now() * 0.02) % this.height;
                const size = (i % 3) + 1;
                this.ctx.fillRect(x, y, size, size);
            }
        }

        drawPlayer() {
            const { x, y, width, height, color } = this.player;
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            // Triangle spaceship
            this.ctx.moveTo(x + width/2, y);
            this.ctx.lineTo(x + width, y + height);
            this.ctx.lineTo(x + width * 0.7, y + height * 0.7);
            this.ctx.lineTo(x + width * 0.3, y + height * 0.7);
            this.ctx.lineTo(x, y + height);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Engine glow
            this.ctx.fillStyle = '#4B2400';
            this.ctx.beginPath();
            this.ctx.moveTo(x + width * 0.35, y + height * 0.7);
            this.ctx.lineTo(x + width/2, y + height + 10 + Math.random() * 5);
            this.ctx.lineTo(x + width * 0.65, y + height * 0.7);
            this.ctx.closePath();
            this.ctx.fill();
        }

        drawAsteroid(size) {
            const points = 8;
            const angleStep = (Math.PI * 2) / points;
            
            this.ctx.beginPath();
            for (let i = 0; i < points; i++) {
                const angle = i * angleStep;
                const radius = size/2 * (0.7 + Math.random() * 0.3);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
        }

        shoot() {
            this.bullets.push({
                x: this.player.x + this.player.width/2 - 3,
                y: this.player.y,
                width: 6,
                height: 15,
                speed: 12
            });
            
            // Play sound if enabled
            if (window.soundManager?.isEnabled()) {
                window.soundManager.play('click');
            }
        }

        spawnAsteroids() {
            if (!this.running || this.gameOver) return;
            
            const asteroid = {
                x: Math.random() * (this.width - 40),
                y: -50,
                size: 30 + Math.random() * 30,
                speed: 2 + Math.random() * 3,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            };
            
            this.asteroids.push(asteroid);
            
            // Spawn more frequently as score increases
            const interval = Math.max(500, 2000 - this.score * 10);
            setTimeout(() => this.spawnAsteroids(), interval);
        }

        createExplosion(x, y) {
            for (let i = 0; i < 15; i++) {
                this.particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    size: Math.random() * 4 + 2,
                    color: Math.random() > 0.5 ? '#FDFBD4' : '#4B2400',
                    life: 1
                });
            }
        }

        checkCollision(a, b) {
            return a.x < b.x + (b.width || b.size) &&
                   a.x + (a.width || a.size) > b.x &&
                   a.y < b.y + (b.height || b.size) &&
                   a.y + (a.height || a.size) > b.y;
        }

        endGame() {
            this.gameOver = true;
            
            // Allow restart with space
            const restartHandler = (e) => {
                if (e.key === ' ' && this.gameOver) {
                    this.reset();
                    this.gameOver = false;
                    this.spawnAsteroids();
                    document.removeEventListener('keydown', restartHandler);
                }
            };
            document.addEventListener('keydown', restartHandler);
        }

        updateScoreDisplay() {
            const scoreEl = document.getElementById('gameScore');
            if (scoreEl) {
                scoreEl.textContent = this.score;
            }
        }
    }

    // Game trigger system
    let gameInstance = null;
    let triggerTimeout = null;

    /**
     * Show game modal after specified time
     */
    function initGameTrigger() {
        // Check if already shown in this session
        if (sessionStorage.getItem(GAME_SHOWN_KEY)) {
            return;
        }

        triggerTimeout = setTimeout(() => {
            showGameModal();
        }, GAME_TRIGGER_TIME);

        // Reset timer on user activity
        ['scroll', 'mousemove', 'keypress'].forEach(event => {
            document.addEventListener(event, resetTriggerTimer, { passive: true });
        });
    }

    function resetTriggerTimer() {
        if (triggerTimeout) {
            clearTimeout(triggerTimeout);
        }
        
        if (!sessionStorage.getItem(GAME_SHOWN_KEY)) {
            triggerTimeout = setTimeout(() => {
                showGameModal();
            }, GAME_TRIGGER_TIME);
        }
    }

    function showGameModal() {
        const modal = document.getElementById('gameModal');
        if (modal) {
            modal.classList.add('show');
            sessionStorage.setItem(GAME_SHOWN_KEY, 'true');
        }
    }

    function hideGameModal() {
        const modal = document.getElementById('gameModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    function startGame() {
        hideGameModal();
        
        const container = document.getElementById('gameContainer');
        const canvas = document.getElementById('gameCanvas');
        
        if (container && canvas) {
            container.classList.add('show');
            
            if (!gameInstance) {
                gameInstance = new SpaceShooter(canvas);
            }
            
            gameInstance.start();
        }
    }

    function exitGame() {
        const container = document.getElementById('gameContainer');
        
        if (container) {
            container.classList.remove('show');
        }
        
        if (gameInstance) {
            gameInstance.stop();
        }
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        // Game modal buttons
        const playBtn = document.getElementById('playGame');
        const skipBtn = document.getElementById('skipGame');
        const closeBtn = document.getElementById('gameClose');
        const exitBtn = document.getElementById('gameExit');

        if (playBtn) {
            playBtn.addEventListener('click', startGame);
        }

        if (skipBtn) {
            skipBtn.addEventListener('click', hideGameModal);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', hideGameModal);
        }

        if (exitBtn) {
            exitBtn.addEventListener('click', exitGame);
        }

        // ESC to close game
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                exitGame();
                hideGameModal();
            }
        });

        // Start trigger timer
        initGameTrigger();
    });

    // Export for external access
    window.gameManager = {
        show: showGameModal,
        start: startGame,
        exit: exitGame
    };
})();                
