// ===================================
// SPACE SHOOTER MINI GAME
// ===================================

class SpaceShooter {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 500;
        
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 60,
            width: 40,
            height: 40,
            speed: 6,
            color: '#6366f1'
        };
        
        this.bullets = [];
        this.asteroids = [];
        this.particles = [];
        this.stars = [];
        this.score = 0;
        this.gameOver = false;
        
        this.keys = {};
        this.asteroidSpawnRate = 60;
        this.frameCount = 0;
        
        this.initStars();
        this.setupControls();
    }
    
    initStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ' && !this.gameOver) {
                e.preventDefault();
                this.shoot();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    shoot() {
        this.bullets.push({
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 15,
            speed: 8,
            color: '#ec4899'
        });
        
        // Play sound effect
        if (window.clickSound) {
            window.clickSound.currentTime = 0;
            window.clickSound.play().catch(() => {});
        }
    }
    
    spawnAsteroid() {
        const size = 20 + Math.random() * 30;
        this.asteroids.push({
            x: Math.random() * (this.canvas.width - size),
            y: -size,
            width: size,
            height: size,
            speed: 2 + Math.random() * 3,
            color: '#f59e0b',
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: 2 + Math.random() * 4,
                life: 30,
                color: `hsl(${Math.random() * 60 + 20}, 100%, 50%)`
            });
        }
    }
    
    update() {
        if (this.gameOver) return;
        
        // Update stars
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
        
        // Move player
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
        
        // Spawn asteroids
        this.frameCount++;
        if (this.frameCount % this.asteroidSpawnRate === 0) {
            this.spawnAsteroid();
            if (this.asteroidSpawnRate > 30) {
                this.asteroidSpawnRate--;
            }
        }
        
        // Update asteroids
        this.asteroids = this.asteroids.filter(asteroid => {
            asteroid.y += asteroid.speed;
            asteroid.rotation += asteroid.rotationSpeed;
            
            // Check collision with player
            if (this.checkCollision(this.player, asteroid)) {
                this.gameOver = true;
                this.createExplosion(this.player.x + this.player.width / 2, 
                                   this.player.y + this.player.height / 2);
                
                // Play explosion sound
                if (window.achievementSound) {
                    window.achievementSound.currentTime = 0;
                    window.achievementSound.play().catch(() => {});
                }
                return false;
            }
            
            return asteroid.y < this.canvas.height;
        });
        
        // Check bullet-asteroid collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.asteroids.length - 1; j >= 0; j--) {
                if (this.checkCollision(this.bullets[i], this.asteroids[j])) {
                    this.createExplosion(this.asteroids[j].x + this.asteroids[j].width / 2,
                                       this.asteroids[j].y + this.asteroids[j].height / 2);
                    this.bullets.splice(i, 1);
                    this.asteroids.splice(j, 1);
                    this.score += 10;
                    document.getElementById('gameScore').textContent = `Score: ${this.score}`;
                    
                    // Play hit sound
                    if (window.clickSound) {
                        const sound = window.clickSound.cloneNode();
                        sound.volume = 0.3;
                        sound.play().catch(() => {});
                    }
                    break;
                }
            }
        }
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // Gravity
            particle.life--;
            return particle.life > 0;
        });
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.size / 2})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        
        // Draw player
        if (!this.gameOver) {
            this.ctx.fillStyle = this.player.color;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = this.player.color;
            this.ctx.beginPath();
            this.ctx.moveTo(this.player.x + this.player.width / 2, this.player.y);
            this.ctx.lineTo(this.player.x, this.player.y + this.player.height);
            this.ctx.lineTo(this.player.x + this.player.width, this.player.y + this.player.height);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        
        // Draw bullets
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            this.ctx.shadowBlur = 0;
        });
        
        // Draw asteroids
        this.asteroids.forEach(asteroid => {
            this.ctx.save();
            this.ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
            this.ctx.rotate(asteroid.rotation);
            this.ctx.fillStyle = asteroid.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = asteroid.color;
            
            // Draw hexagon
            this.ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = (asteroid.width / 2) * Math.cos(angle);
                const y = (asteroid.height / 2) * Math.sin(angle);
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.restore();
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
        
        // Draw game over
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 48px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30);
            
            this.ctx.font = '24px Poppins';
            this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
            
            this.ctx.font = '18px Poppins';
            this.ctx.fillStyle = '#6366f1';
            this.ctx.fillText('Press ESC to close', this.canvas.width / 2, this.canvas.height / 2 + 60);
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        
        if (!this.stopped) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    start() {
        this.stopped = false;
        this.gameLoop();
    }
    
    stop() {
        this.stopped = true;
    }
    
    reset() {
        this.player.x = this.canvas.width / 2;
        this.bullets = [];
        this.asteroids = [];
        this.particles = [];
        this.score = 0;
        this.gameOver = false;
        this.frameCount = 0;
        this.asteroidSpawnRate = 60;
        document.getElementById('gameScore').textContent = 'Score: 0';
    }
}

// Export for use in main.js
window.SpaceShooter = SpaceShooter;
