// Simple Space Shooter Game - Mini Game Modal
let gameCanvas, ctx, interval, ship, asteroids, bullets, score, playing=false;

function startGame() {
    if (playing) return; playing=true;
    gameCanvas = document.getElementById('space-game');
    ctx = gameCanvas.getContext('2d');
    ship = { x:gameCanvas.width/2-24, y:gameCanvas.height-60, w:48, h:32, dx:0 };
    asteroids = [];
    bullets = [];
    score = 0;

    for (let i=0; i<7; ++i) asteroids.push({ x:Math.random()*gameCanvas.width, y:Math.random()*-300, r:22+Math.random()*14, speed:2+Math.random()*1.4 });
    document.getElementById('game-score').innerText = 'Score: 0';

    function draw() {
        ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
        // Ship
        ctx.fillStyle="#6366f1";
        ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
        ctx.fillStyle="#e0e7ff";
        ctx.fillRect(ship.x+18, ship.y, 12, 14);
        // Bullets
        ctx.fillStyle="#f59e0b";
        bullets.forEach(b => ctx.fillRect(b.x, b.y, 6, 16));
        // Asteroids
        asteroids.forEach(a => { ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 2*Math.PI); ctx.fillStyle="#ec4899"; ctx.fill(); });

        // Move objects
        ship.x += ship.dx;
        if (ship.x<0) ship.x=0; if (ship.x+ship.w>gameCanvas.width) ship.x=gameCanvas.width-ship.w;
        bullets.forEach(b => b.y -= 14);
        bullets = bullets.filter(b => b.y>-20);

        asteroids.forEach(a => a.y += a.speed);
        // Collision
        asteroids = asteroids.filter(a => {
            for(let b of bullets){ let dx=a.x-b.x, dy=a.y-b.y;
                if(dx>-a.r&&dx<a.r&&dy>-a.r&&dy<a.r){ score+=10; b.y=-100;playSound('achievement-sound'); return false; }
            }
            if(a.y>gameCanvas.height+60) { a.x=Math.random()*gameCanvas.width; a.y=-Math.random()*200; }
            return true;
        });
        // Game over if hit
        for(let a of asteroids) {
            if(ship.x<a.x&&ship.x+ship.w>a.x&&ship.y<a.y&&ship.y+ship.h>a.y) { gameOver(); return; }
        }
        document.getElementById('game-score').innerText = "Score: " + score;
    }
    interval = setInterval(draw, 35);

    // Controls
    document.onkeydown = function(e) {
        if(!playing) return;
        if(e.key==='ArrowLeft') ship.dx=-10;
        if(e.key==='ArrowRight') ship.dx=10;
        if(e.key===' '){
            bullets.push({ x:ship.x+ship.w/2-3, y:ship.y });
            playSound('click-sound');
        }
    };
    document.onkeyup = function(e) { if(e.key==='ArrowLeft'||e.key==='ArrowRight') ship.dx=0; };
}
// End and cleanup game
function gameOver() {
    clearInterval(interval); playing=false;
    alert("Game Over!\nYour Score: "+score);
    document.getElementById('game-modal').style.display='none';
}
