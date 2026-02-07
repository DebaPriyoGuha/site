/**
 * Space Shooter Game
 * With High Score Save Feature
 * Deba Priyo Guha Portfolio
 */

(function() {
    'use strict';

    // Game configuration
    const GAME_TRIGGER_TIME = 5 * 60 * 1000; // 5 minutes
    const GAME_SHOWN_KEY = 'portfolio-game-shown';
    const HIGH_SCORE_KEY = 'portfolio-game-highscore';

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
                color: '#F5F5DC'
            };
            
            this.bullets = [];
            this.asteroids = [];
            this.particles = [];
            this.score = 0;
            this.highScore = this.loadHighScore();
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
            this.updateHighScoreDisplay();
        }

        loadHighScore() {
            const saved = localStorage.getItem(HIGH_SCORE_KEY);
            return saved ? parseInt(saved, 10) : 0;
        }

        saveHighScore() {
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem(HIGH_SCORE_KEY, this.highScore.toString());
                this.updateHighScoreDisplay();
                return true; // New high score!
            }
            return false;
        }

        updateHighScoreDisplay() {
            const displays = document.querySelectorAll('#gameHighScore, #modalHighScore');
            displays.forEach(el => {
                if (el) el.textContent = this.highScore;
            });
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
            this.updateHighScoreDisplay();
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
            // Clear canvas with dark chocolate background
            this.ctx.fillStyle = '#1a1410';
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
            
            // Draw bullets (chocolate color)
            this.ctx.fillStyle = '#7B3F00';
            this.bullets.forEach(bullet => {
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
            
            // Draw asteroids
            this.asteroids.forEach(asteroid => {
                this.ctx.save();
                this.ctx.translate(asteroid.x + asteroid.size/2, asteroid.y + asteroid.size/2);
                this.ctx.rotate(asteroid.rotation);
                this.ctx.fillStyle = '#5C2E00';
                this.ctx.strokeStyle = '#7B3F00';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.drawAsteroid(asteroid.size);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.restore();
            });
            
            // Draw player (spaceship)
            this.drawPlayer();
            
            // Game over screen
            if (this.gameOver) {
                this.ctx.fillStyle = 'rgba(26, 20, 16, 0.85)';
                this.ctx.fillRect(0, 0, this.width, this.height);
                
                const isNewHighScore = this.score >= this.highScore && this.score > 0;
                
                // New High Score celebration
                if (isNewHighScore) {
                    this.ctx.fillStyle = '#f59e0b';
                    this.ctx.font = 'bold 24px Inter';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('🏆 NEW HIGH SCORE! 🏆', this.width/2, this.height/2 - 60);
                }
                
                this.ctx.fillStyle = '#F5F5DC';
                this.ctx.font = 'bold 36px Inter';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('GAME OVER', this.width/2, this.height/2 - 20);
                
                this.ctx.font = '24px Inter';
                this.ctx.fillText(`Score: ${this.score}`, this.width/2, this.height/2 + 20);
                
                this.ctx.fillStyle = '#7B3F00';
                this.ctx.font = '18px Inter';
                this.ctx.fillText(`High Score: ${this.highScore}`, this.width/2, this.height/2 + 55);
                
                this.ctx.fillStyle = 'rgba(245, 245, 220, 0.7)';
                this.ctx.font = '16px Inter';
                this.ctx.fillText('Press SPACE to play again', this.width/2, this.height/2 + 95);
            }
        }

        drawStars() {
            this.ctx.fillStyle = 'rgba(245, 245, 220, 0.4)';
            for (let i = 0; i < 60; i++) {
                const x = (i * 37) % this.width;
                const y = (i * 53 + Date.now() * 0.015) % this.height;
                const size = (i % 3) + 1;
                this.ctx.fillRect(x, y, size, size);
            }
        }

        drawPlayer() {
            const { x, y, width, height, color } = this.player;
            
            // Ship body
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(x + width/2, y);
            this.ctx.lineTo(x + width, y + height);
            this.ctx.lineTo(x + width * 0.75, y + height * 0.75);
            this.ctx.lineTo(x + width * 0.25, y + height * 0.75);
            this.ctx.lineTo(x, y + height);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Ship outline
            this.ctx.strokeStyle = '#7B3F00';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Engine glow
            this.ctx.fillStyle = '#7B3F00';
            this.ctx.beginPath();
            this.ctx.moveTo(x + width * 0.35, y + height * 0.75);
            this.ctx.lineTo(x + width/2, y + height + 12 + Math.random() * 6);
            this.ctx.lineTo(x + width * 0.65, y + height * 0.75);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Inner glow
            this.ctx.fillStyle = '#f59e0b';
            this.ctx.beginPath();
            this.ctx.moveTo(x + width * 0.4, y + height * 0.75);
            this.ctx.lineTo(x + width/2, y + height + 6 + Math.random() * 4);
            this.ctx.lineTo(x + width * 0.6, y + height * 0.75);
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
                speed: 2 + Math.random() * 3 + (this.score / 200), // Speed increases with score
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            };
            
            this.asteroids.push(asteroid);
            
            // Spawn more frequently as score increases
            const interval = Math.max(400, 1800 - this.score * 8);
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
                    color: Math.random() > 0.5 ? '#F5F5DC' : '#7B3F00',
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
            
            // Save high score
            const isNewHighScore = this.saveHighScore();
            
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

    function initGameTrigger() {
        if (sessionStorage.getItem(GAME_SHOWN_KEY)) {
            return;
        }

        triggerTimeout = setTimeout(() => {
            showGameModal();
        }, GAME_TRIGGER_TIME);

        // Reset timer on user activity
        let activityCount = 0;
        const resetOnActivity = () => {
            activityCount++;
            if (activityCount > 10) return; // Don't keep resetting forever
            
            if (triggerTimeout) {
                clearTimeout(triggerTimeout);
            }
            
            if (!sessionStorage.getItem(GAME_SHOWN_KEY)) {
                triggerTimeout = setTimeout(() => {
                    showGameModal();
                }, GAME_TRIGGER_TIME);
            }
        };

        ['scroll', 'mousemove', 'keypress'].forEach(event => {
            document.addEventListener(event, resetOnActivity, { passive: true, once: false });
        });
    }

    function showGameModal() {
        const modal = document.getElementById('gameModal');
        if (modal) {
            // Update high score display in modal
            const highScore = localStorage.getItem(HIGH_SCORE_KEY) || '0';
            const modalHighScore = document.getElementById('modalHighScore');
            if (modalHighScore) {
                modalHighScore.textContent = highScore;
            }
            
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
        // Update initial high score display
        const highScore = localStorage.getItem(HIGH_SCORE_KEY) || '0';
        document.querySelectorAll('#gameHighScore, #modalHighScore').forEach(el => {
            if (el) el.textContent = highScore;
        });

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
        exit: exitGame,
        getHighScore: () => localStorage.getItem(HIGH_SCORE_KEY) || '0',
        resetHighScore: () => {
            localStorage.removeItem(HIGH_SCORE_KEY);
            document.querySelectorAll('#gameHighScore, #modalHighScore').forEach(el => {
                if (el) el.textContent = '0';
            });
        }
    };
})();
