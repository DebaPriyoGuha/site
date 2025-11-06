// Theme Toggle & Local Storage
document.addEventListener('DOMContentLoaded', function() {
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    let isLight = localStorage.getItem('theme') === 'light';
    setTheme(isLight);

    themeBtn.onclick = () => {
        isLight = !isLight;
        setTheme(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        playSound('click-sound');
    };

    function setTheme(light) {
        if (light) {
            document.body.classList.add('light');
            themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('light');
            themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon');
        }
    }

    // Music Player
    const musicBtn = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const bgMusic = document.getElementById('bg-music');

    let musicOn = false;
    musicBtn.onclick = () => {
        musicOn = !musicOn;
        if (musicOn) {
            bgMusic.volume = 0.4; bgMusic.play();
            musicIcon.classList.add('fa-volume-up');
            musicIcon.classList.remove('fa-music');
        } else {
            bgMusic.pause();
            musicIcon.classList.remove('fa-volume-up');
            musicIcon.classList.add('fa-music');
        }
        playSound('click-sound');
    };

    // Print button functionality
    document.getElementById('print-btn').onclick = () => { window.print(); playSound('click-sound'); };

    // Scroll Progress Bar
    window.addEventListener('scroll', function() {
        let scrollBar = document.getElementById('scroll-bar'),
            scrolled = (window.scrollY)/(document.body.scrollHeight-window.innerHeight)*100;
        scrollBar.style.width = scrolled + "%";
    });

    // Profile Modal
    let profilePic = document.getElementById('profile-pic');
    let profileModal = document.getElementById('profile-modal');
    let profileClose = document.getElementById('modal-close');
    profilePic.onclick = () => {
        profileModal.style.display = 'flex';
        playSound('profile-open-sound');
    };
    profileClose.onclick = () => { profileModal.style.display = 'none'; };

    // Game Modal Toggle (Key "G")
    let gameModal = document.getElementById('game-modal');
    let gameClose = document.getElementById('game-close');
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'g') { gameModal.style.display = 'flex'; playSound('achievement-sound'); startGame(); }
        if (e.key === 'Escape') { gameModal.style.display = 'none'; profileModal.style.display = 'none'; }
    });
    gameClose.onclick = () => { gameModal.style.display = 'none'; };

    // Konami Code Easter Egg
    let konamiSeq = [38,38,40,40,37,39,37,39,66,65], ptr=0;
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konamiSeq[ptr]) { ptr++; if(ptr===konamiSeq.length) {
            ptr=0; playSound('achievement-sound'); alert("🎉 You found the Konami Code! 🚀");
        }} else { ptr=0; }
    });

    // Animated Counters on Scroll
    let counters = document.querySelectorAll('.counter');
    let countersActivated = false;
    window.addEventListener('scroll', function() {
        if (countersActivated) return;
        let about = document.getElementById('about');
        let rect = about.getBoundingClientRect();
        if (rect.top<window.innerHeight && rect.bottom>0) {
            countersActivated = true;
            counters.forEach(counter => {
                let target = +counter.getAttribute('data-count');
                let start = 0, duration=1200;
                let step = Math.ceil(target/duration*18);
                let val = start;
                let interval = setInterval(() => {
                    val += step;
                    if (val >= target) { counter.innerText = target; clearInterval(interval); }
                    else counter.innerText = Math.round(val*100)/100;
                }, 18);
            });
        }
    });

    // Contact Form validation
    document.getElementById('contact-form').onsubmit = function(e) {
        e.preventDefault();
        let name = this.name.value.trim(), email = this.email.value.trim(), msg = this.message.value.trim();
        let msgBox = document.getElementById('form-msg');
        if (!name || !email || !msg) { msgBox.textContent = "Please fill all fields."; return; }
        let valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!valid) { msgBox.textContent = "Invalid email format."; return; }
        msgBox.textContent = "Message sent! 🚀 (demo, no backend)";
        playSound('click-sound');
        this.reset();
        setTimeout(()=>{msgBox.textContent="";}, 4000);
    };

    // Lazy loading images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
    document.addEventListener('DOMContentLoaded', lazyLoadImages);

    // Particle.js background
    particlesJS('particles-js', {
        particles: { number: { value: 40 }, color: { value: "#6366f1" }, shape: { type: "circle" },
        opacity: { value: 0.5 }, size: { value: 4 }, line_linked: { enable:true, distance:110, color:"#6366f1",opacity:0.3,width:1 },
        move: { enable:true, speed: 3 } }, interactivity: { detect_on:"canvas", events:{ onhover:{ enable:true, mode:"repulse" } } }
    });

    // Sound effect helper
    window.playSound = function(id) {
        let sound=document.getElementById(id); if(sound){ sound.volume=0.45;sound.currentTime=0;sound.play(); }
    };
});
