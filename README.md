# Deba Priyo Guha - Interactive Portfolio Website 🚀

A professional and interactive portfolio website showcasing research, projects, and achievements in Machine Learning and Astrophysics.

## ✨ Features

### Core Features
- 🎨 **Dark/Light Theme Toggle** - Seamless theme switching with localStorage persistence
- 🎵 **Background Music System** - Optional background music with toggle control
- 🔊 **Sound Effects** - Click, achievement, and profile open sounds
- 📊 **Scroll Progress Bar** - Visual feedback of page scroll progress
- ✨ **Particle.js Background** - Animated interactive particle system
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized

### Interactive Elements
- 🖼️ **Profile Picture Modal** - Click to view full image with sound effect
- 🎮 **Space Shooter Mini Game** - Press 'G' to play (Arrow keys + Space)
- 📧 **Contact Form** - Functional contact form with validation
- 🔗 **WhatsApp Integration** - Direct WhatsApp link for phone number
- 📄 **PDF Download** - Download full CV
- 🖨️ **Print Optimized** - Print-friendly version of portfolio

### Advanced Features
- 🎯 **Smooth Scroll Navigation** - Section highlighting and smooth transitions
- 💫 **Scroll Animations** - Elements animate on scroll into view
- ⌨️ **Keyboard Shortcuts** - 'G' for game, 'ESC' to close modals
- 🎊 **Konami Code Easter Egg** - Try: ↑ ↑ ↓ ↓ ← → ← → B A
- 📈 **Animated Counters** - Statistics count up on scroll
- ⚡ **Optimized Performance** - Fast loading and smooth animations

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, Animations
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Particles.js** - Background particles
- **Font Awesome 6** - Icons
- **Google Fonts** - Poppins & JetBrains Mono

## 📁 File Structure
portfolio/
├── index.html # Main HTML file
├── css/
│ └── style.css # All styles including responsive design
├── js/
│ ├── main.js # Main JavaScript functionality
│ └── game.js # Space shooter game logic
├── assets/
│ ├── images/
│ │ ├── profile.jpg # Your profile picture
│ │ ├── demo-*.jpg # Project images
│ │ └── favicon.png # Website favicon
│ ├── sounds/
│ │ ├── click.mp3 # Click sound effect
│ │ ├── achievement.mp3 # Section unlock sound
│ │ ├── profile-open.mp3 # Profile modal sound
│ │ └── bg-music.mp3 # Background music (optional)
│ └── resume.pdf # Your CV PDF
└── README.md # This file

text

## 🚀 Setup Instructions

### 1. Clone or Download
```bash
git clone https://github.com/DebaPriyoGuha/portfolio.git
cd portfolio
### 2. Add Your Content
Images
Add your profile picture as assets/images/profile.jpg
Add project images as assets/images/demo-*.jpg
Add favicon as assets/images/favicon.png
Resume
Add your CV PDF as assets/resume.pdf
Sounds (Optional)
click.mp3 - Short click sound (~0.1s)
achievement.mp3 - Achievement notification (~0.5s)
profile-open.mp3 - Whoosh or pop sound (~0.3s)
bg-music.mp3 - Looping background music (1-3 min)
Free Sound Resources:

Freesound.org
Zapsplat.com
Mixkit.com
### 3. Customize Content

Edit `index.html` to update:
- Personal information (name, location, contact)
- Research experience details
- Project descriptions
- Publications and manuscripts
- Awards and achievements
- Skills and interests

### 4. Deploy to GitHub Pages

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit - Portfolio website"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git branch -M main
git push -u origin main


Your site will be live at: https://YOUR_USERNAME.github.io

🎮 Interactive Features Guide
Keyboard Shortcuts
G - Open Space Shooter game
ESC - Close modals/game
↑↑↓↓←→←→BA - Konami Code easter egg
Space Shooter Game Controls
← → Arrow keys - Move spaceship
Space - Shoot bullets
Destroy asteroids to increase score!
Theme Toggle
Click moon/sun icon in navbar
Persists across browser sessions
Automatically adjusts all colors
Music System
Click speaker icon to enable background music
All sound effects work independently
Optimized for performance
📱 Responsive Breakpoints
Desktop: 1024px and above
Tablet: 768px - 1023px
Mobile: 480px - 767px
Small Mobile: Below 480px
🎨 Color Customization
Edit CSS variables in css/style.css:

css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --secondary-color: #ec4899;  /* Accent color */
    --accent-color: #f59e0b;     /* Highlight color */
    /* ... more variables */
}
🔧 Browser Support
✅ Chrome (90+)
✅ Firefox (88+)
✅ Safari (14+)
✅ Edge (90+)
✅ Opera (76+)
⚡ Performance Tips
Optimize Images: Use WebP format, compress to <200KB
Lazy Loading: Images load as you scroll
Minify Code: Minify CSS/JS for production
CDN: Use CDN for Font Awesome and Particles.js
🐛 Troubleshooting
Sounds Not Playing
Check browser autoplay policy
Sounds play after user interaction
Ensure sound files are in correct path
Particles Not Showing
Check if Particles.js CDN is loaded
Open console for any errors
Verify particles-js div exists
Game Not Working
Ensure game.js is loaded before main.js
Check canvas element exists
Browser needs to support Canvas API
📄 License
MIT License - Feel free to use for your own portfolio!

👤 Author
Deba Priyo Guha

LinkedIn: deba-priyo-guha
GitHub: @DebaPriyoGuha
Email: debapriyoguha@gmail.com
🙏 Acknowledgments
Particles.js for background effects
Font Awesome for icons
Google Fonts for typography
All open-source contributors
⭐ If you like this portfolio, please give it a star on GitHub!

text

---

## 🎵 **Sound Files Guide** (Create dummy files or download)

Create a simple text file to remind you:

**assets/sounds/README.txt**
Sound Files Needed:
click.mp3 (0.1-0.2s)

Short click/tap sound
Download from: https://freesound.org/people/kwahmah_02/sounds/256116/
achievement.mp3 (0.3-0.5s)

Success notification sound
Download from: https://freesound.org/people/LittleRobotSoundFactory/sounds/270303/
profile-open.mp3 (0.2-0.4s)

Whoosh or pop sound
Download from: https://freesound.org/people/deleted_user_7146007/sounds/383810/
bg-music.mp3 (1-3 min, looping)

Calm instrumental background music
Download from: https://mixkit.co/free-stock-music/
Recommended: Soft piano or ambient electronic
Alternative Sources:

Zapsplat: https://www.zapsplat.com/
Mixkit: https://mixkit.co/
YouTube Audio Library (download as MP3)
Note: All sounds should be royalty-free or Creative Commons licensed.
Volume will be adjusted in JavaScript (30-50%).

text

---

## 🖼️ **Demo Images Guide**

**assets/images/README.txt**
Image Files Needed:
profile.jpg

Your professional photo
Recommended size: 800x800px (square)
Format: JPG or PNG
Keep under 300KB
favicon.png

Small icon for browser tab
Size: 32x32px or 64x64px
Format: PNG with transparency
demo-rgc.jpg

RGC project screenshot/illustration
Size: 1200x800px (3:2 ratio)
Radio galaxy images or Python code
demo-lunaxnet.jpg

Lunar surface or mineralogy map
Size: 1200x800px
Moon imagery or spectral analysis
demo-supernova.jpg

Supernova or space imagery
Size: 1200x800px
Astronomical visualization
demo-medical.jpg

Medical imaging illustration
Size: 1200x800px
GAN-generated or medical scans
Free Image Resources:

Unsplash: https://unsplash.com/
NASA Images: https://images.nasa.gov/
Pexels: https://www.pexels.com/
Pixabay: https://pixabay.com/
Placeholder Service:

Use https://via.placeholder.com/1200x800 for testing
text

---

## 🎨 **Quick Customization Checklist**

**CHECKLIST.md**

```markdown
# Portfolio Customization Checklist

## Before Launch - Must Do ✅

### Content Updates
- [ ] Update name and title in HTML
- [ ] Change email address
- [ ] Update phone number (WhatsApp link)
- [ ] Modify location information
- [ ] Update IELTS/test scores
- [ ] Add your LinkedIn, GitHub, ResearchGate links
- [ ] Update education details
- [ ] Modify research experience
- [ ] Update project descriptions
- [ ] Add your publications
- [ ] List your awards correctly
- [ ] Update skills and percentages

### Media Files
- [ ] Add profile.jpg (your photo)
- [ ] Add favicon.png
- [ ] Add project images (demo-*.jpg)
- [ ] Add resume.pdf
- [ ] Add sound files (optional but recommended)

### Links & URLs
- [ ] Update all external links
- [ ] Test WhatsApp link with your number
- [ ] Verify email mailto: links
- [ ] Check social media URLs
- [ ] Test PDF download link

### Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari (if Mac)
- [ ] Test on mobile device
- [ ] Test dark/light theme toggle
- [ ] Test all navigation links
- [ ] Test profile modal
- [ ] Test mini game (press G)
- [ ] Test contact form
- [ ] Test print version (Ctrl+P)

### Performance
- [ ] Compress all images (<200KB each)
- [ ] Verify page loads in <3 seconds
- [ ] Check console for errors
- [ ] Test on slow 3G connection

### SEO & Meta
- [ ] Update page title
- [ ] Update meta description
- [ ] Add Open Graph tags (optional)
- [ ] Add favicon

## Optional Enhancements 🌟

- [ ] Add Google Analytics
- [ ] Add custom domain
- [ ] Implement actual contact form backend
- [ ] Add blog section
- [ ] Add more projects
- [ ] Create video demos
- [ ] Add testimonials
- [ ] Add resume timeline visualization
- [ ] Integrate with GitHub API for live stats
- [ ] Add more easter eggs!

## Deployment ☁️

- [ ] Create GitHub repository
- [ ] Push to GitHub
- [ ] Enable GitHub Pages
- [ ] Verify live site works
- [ ] Share with friends!

## Post-Launch 📢

- [ ] Add to LinkedIn profile
- [ ] Share on social media
- [ ] Add to email signature
- [ ] Update on ResearchGate
- [ ] Submit to portfolio directories
🚀 Quick Start Script
start.sh (For Linux/Mac users)

bash
#!/bin/bash

echo "🚀 Setting up Deba Priyo Guha Portfolio..."

# Create directory structure
mkdir -p assets/images assets/sounds

# Create placeholder files
echo "Creating placeholder files..."

# Placeholder image (you'll replace this)
curl -o assets/images/profile.jpg https://via.placeholder.com/800x800/6366f1/ffffff?text=Your+Photo
curl -o assets/images/demo-rgc.jpg https://via.placeholder.com/1200x800/6366f1/ffffff?text=RGC+Project
curl -o assets/images/demo-lunaxnet.jpg https://via.placeholder.com/1200x800/ec4899/ffffff?text=LunaXNet
curl -o assets/images/demo-supernova.jpg https://via.placeholder.com/1200x800/f59e0b/ffffff?text=Supernova
curl -o assets/images/demo-medical.jpg https://via.placeholder.com/1200x800/10b981/ffffff?text=Medical+AI

echo "✅ Setup complete!"
echo "📝 Next steps:"
echo "   1. Replace placeholder images in assets/images/"
echo "   2. Add sound files in assets/sounds/ (optional)"
echo "   3. Add your resume.pdf in assets/"
echo "   4. Update content in index.html"
echo "   5. Open index.html in browser to test"
echo ""
echo "🎮 Pro tip: Press 'G' on the website to play the mini game!"
start.bat (For Windows users)

batch
@echo off
echo 🚀 Setting up Deba Priyo Guha Portfolio...

REM Create directory structure
mkdir assets\images 2>nul
mkdir assets\sounds 2>nul

echo ✅ Directories created!
echo 📝 Next steps:
echo    1. Add your profile photo as assets\images\profile.jpg
echo    2. Add project images as assets\images\demo-*.jpg
echo    3. Add sound files in assets\sounds\ (optional)
echo    4. Add your resume.pdf in assets\
echo    5. Update content in index.html
echo    6. Open index.html in browser to test
echo.
echo 🎮 Pro tip: Press 'G' on the website to play the mini game!
pause
📦 Package.json (Optional - for development)
json
{
  "name": "debapriyoguha-portfolio",
  "version": "1.0.0",
  "description": "Interactive portfolio website for Deba Priyo Guha",
  "main": "index.html",
  "scripts": {
    "start": "python -m http.server 8000",
    "start-node": "npx http-server -p 8000 -o",
    "lint": "echo 'Linting not configured'",
    "test": "echo 'No tests configured'"
  },
  "keywords": [
    "portfolio",
    "machine-learning",
    "astrophysics",
    "interactive"
  ],
  "author": "Deba Priyo Guha",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/DebaPriyoGuha/portfolio"
  }
}
🎯 Final Tips & Best Practices
Performance Optimization
javascript
// Add to end of main.js for lazy loading images

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

// Call on load
document.addEventListener('DOMContentLoaded', lazyLoadImages);
Analytics (Optional)
Add to <head> in index.html:

html
<!-- Google Analytics (Optional) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
🎉 You're All Set!
Your portfolio structure is complete! Here's what you have:

✅ Responsive design with dark/light mode
✅ Interactive profile modal
✅ Space shooter mini game
✅ Background music system
✅ Sound effects
✅ Smooth animations
✅ Print-optimized version
✅ Mobile-friendly
✅ SEO-ready

Next Steps:
Add your personal photos and content
Test on multiple devices
Deploy to GitHub Pages
Share with the world! 🌍
Need Help?
Check browser console for errors (F12)
Validate HTML: https://validator.w3.org/
Test responsiveness: Chrome DevTools (F12 → Toggle Device)
