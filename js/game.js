let ctx, ship, bullets, asteroids, score;
function startSpaceShooter() {
  const canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ship = { x: canvas.width / 2, y: canvas.height - 80, w: 40, h: 20, speed: 7 };
  bullets = [];
  asteroids = [];
  score = 0;
  document.addEventListener('keydown',control);
  requestAnimationFrame(update);
}

function control(e){
  if(e.key==="ArrowLeft") ship.x -= ship.speed;
  if(e.key==="ArrowRight") ship.x += ship.speed;
  if(e.key===" ") bullets.push({x: ship.x+18,y: ship.y-10});
  if(e.key==="Escape"){
    document.getElementById('gameCanvas').classList.add('hidden');
  }
}

// --- CONTINUATION ---
function update() {
  const canvas = document.getElementById('gameCanvas');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ship
  ctx.fillStyle = "cyan";
  ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
  ship.x = Math.max(0, Math.min(canvas.width - ship.w, ship.x));

  // Bullets
  ctx.fillStyle = "yellow";
  bullets.forEach((b) => (b.y -= 10));
  bullets = bullets.filter((b) => b.y > 0);
  bullets.forEach((b) => ctx.fillRect(b.x, b.y, 4, 10));

  // Asteroids — randomly spawn
  if (Math.random() < 0.03) {
    asteroids.push({
      x: Math.random() * canvas.width,
      y: -20,
      r: 20 + Math.random() * 20,
      speed: 3 + Math.random() * 3
    });
  }

  // Draw asteroids
  ctx.fillStyle = "orange";
  asteroids.forEach((a) => {
    a.y += a.speed;
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Collision detection (bullet vs asteroid)
  asteroids.forEach((a, ai) => {
    bullets.forEach((b, bi) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < a.r) {
        // collision found
        asteroids.splice(ai, 1);
        bullets.splice(bi, 1);
        score++;
      }
    });
  });

  // Collision detection (asteroid vs ship)
  asteroids.forEach((a) => {
    if (
      a.x + a.r > ship.x &&
      a.x - a.r < ship.x + ship.w &&
      a.y + a.r > ship.y &&
      a.y - a.r < ship.y + ship.h
    ) {
      gameOver();
    }
  });

  // Remove off-screen asteroids
  asteroids = asteroids.filter((a) => a.y < canvas.height + a.r);

  // Draw score
  ctx.fillStyle = "#fff";
  ctx.font = "20px JetBrains Mono";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("Press ESC to Exit", 20, 60);

  // Loop
  if (!document.getElementById('gameCanvas').classList.contains('hidden'))
    requestAnimationFrame(update);
}

function gameOver() {
  const canvas = document.getElementById('gameCanvas');
  ctx.fillStyle = "red";
  ctx.font = "50px JetBrains Mono";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
  ctx.font = "30px JetBrains Mono";
  ctx.fillText("Score: " + score, canvas.width/2, canvas.height/2 + 50);
  setTimeout(() => {
    canvas.classList.add('hidden');
  }, 2000);
}
