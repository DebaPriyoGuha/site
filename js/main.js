const scrollBar = document.getElementById('scrollBar');
const themeToggle = document.getElementById('themeToggle');
const musicToggle = document.getElementById('musicToggle');
const gameCanvas = document.getElementById('gameCanvas');

window.onscroll = () => {
  const scrollTop = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / height) * 100;
  scrollBar.style.width = scrolled + "%";
};

// Theme Toggle
themeToggle.onclick = () => {
  document.body.classList.toggle('light');
  themeToggle.classList.toggle('fa-sun');
  themeToggle.classList.toggle('fa-moon');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
};

window.onload = () => {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeToggle.classList.add('fa-sun');
  }
};

// Background Music
let bgMusic = new Audio('assets/sounds/bg-music.mp3');
bgMusic.loop = true;
let musicOn = false;

musicToggle.onclick = () => {
  if (!musicOn) {
    bgMusic.play();
    musicOn = true;
    musicToggle.classList.replace('fa-volume-high','fa-volume-xmark');
  } else {
    bgMusic.pause();
    musicOn = false;
    musicToggle.classList.replace('fa-volume-xmark','fa-volume-high');
  }
};

// Contact Form Validation
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Message sent! Thank you for reaching out.');
  form.reset();
});

// Konami Code -> Launch Game
const sequence = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let current = 0;
document.addEventListener('keydown', function(e) {
  if (e.key === sequence[current]) {
    current++;
    if (current === sequence.length) {
      startGame();
      current = 0;
    }
  } else current = 0;
});

// Shortcut “G” to open game
document.addEventListener('keydown', (e)=>{
  if (e.key === 'g' || e.key === 'G') startGame();
});

function startGame() {
  gameCanvas.classList.remove('hidden');
  startSpaceShooter();
}
