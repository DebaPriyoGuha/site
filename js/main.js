// ===================================
// Audio System - FIXED VERSION
// ===================================
function setupAudio() {
    const musicToggle = document.getElementById('musicToggle');
    
    // Set volumes
    if (bgMusic) bgMusic.volume = 0.3;
    if (clickSound) clickSound.volume = 0.5;
    if (achievementSound) achievementSound.volume = 0.6;
    if (profileOpenSound) profileOpenSound.volume = 0.5;
    
    // Music toggle
    musicToggle.addEventListener('click', () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Click sound error:', e));
        }
        
        musicEnabled = !musicEnabled;
        
        if (musicEnabled) {
            bgMusic.play().catch(e => {
                console.log('Music blocked - user interaction needed');
            });
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.classList.add('active');
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicToggle.classList.remove('active');
        }
    });
}

// FIXED sound functions
function playClickSound() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Sound play error:', e));
    }
}

function playAchievementSound() {
    if (achievementSound) {
        achievementSound.currentTime = 0;
        achievementSound.play().catch(e => console.log('Achievement sound error:', e));
    }
}

function playProfileOpenSound() {
    if (profileOpenSound) {
        profileOpenSound.currentTime = 0;
        profileOpenSound.play().catch(e => console.log('Profile sound error:', e));
    }
}

// Enable sounds after first user interaction
let soundsInitialized = false;
document.addEventListener('click', () => {
    if (!soundsInitialized) {
        soundsInitialized = true;
        // Pre-load sounds
        [clickSound, achievementSound, profileOpenSound].forEach(sound => {
            if (sound) {
                sound.load();
            }
        });
        console.log('✅ Sounds initialized!');
    }
}, { once: true });
