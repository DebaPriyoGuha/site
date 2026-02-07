# Deba Priyo Guha - Portfolio Website 🎓

A minimalist, two-column portfolio website designed for PhD applications.

![Portfolio Preview](assets/images/preview.png)

---

## 🎨 Design Philosophy

**3-Color Scheme (Modern & Sophisticated):**

|
 Color 
|
 Hex Code 
|
 Usage 
|
 Percentage 
|
|
-------
|
----------
|
-------
|
------------
|
|
 Cream 
|
`#FDFBD4`
|
 Background 
|
 60% 
|
|
 Dark Cerulean 
|
`#003C7B`
|
 Content Areas 
|
 30% 
|
|
 Rich Chocolate 
|
`#4B2400`
|
 Accents/CTA 
|
 10% 
|

**Layout:** Two-column design with fixed left sidebar and scrollable right content.

---

## 📁 File Structure
portfolio/
│
├── index.html # Main HTML file
│
├── css/
│ └── style.css # All styles (3-color scheme)
│
├── js/
│ ├── main.js # Core functionality
│ ├── theme.js # Dark/Light mode toggle
│ ├── sound.js # Sound system (OFF by default)
│ └── game.js # Space Shooter game
│
├── data/
│ ├── projects.json # ← EDIT THIS to add/update projects
│ └── publications.json # ← EDIT THIS to add/update publications
│
├── assets/
│ ├── images/
│ │ ├── profile.jpg # Your profile photo
│ │ ├── favicon.png # Browser tab icon
│ │ └── projects/ # Project screenshots/images
│ │ ├── rgc.jpg
│ │ ├── pieada.jpg
│ │ ├── lunaxnet.jpg
│ │ └── ...
│ │
│ ├── sounds/
│ │ ├── click.mp3 # Click sound effect
│ │ └── bg-music.mp3 # Background music (optional)
│ │
│ └── resume.pdf # Your CV/Resume
│
└── README.md # This file

text

---

## ✨ Features

### Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🌓 Dark/Light Mode | Toggle with localStorage persistence | ✅ |
| 🔇 Sound System | OFF by default, user must enable | ✅ |
| 🎮 Space Shooter | Appears after 5-10 minutes on site | ✅ |
| 📱 Fully Responsive | Mobile, tablet, desktop optimized | ✅ |
| 📄 Easy Updates | Edit JSON files for projects/papers | ✅ |
| 📧 Email Contact | Direct mailto links (no forms) | ✅ |
| 🖨️ Print Optimized | Clean print version | ✅ |

### Interactive Elements

- **Profile Image Modal** - Click to view full image
- **Smooth Scroll Navigation** - Section highlighting
- **Project Filters** - Filter by status/category
- **Skill Bar Animations** - Animate on scroll
- **Scroll Reveal** - Elements fade in on scroll

---

## 🚀 Quick Start

### Step 1: Clone/Download

```bash
git clone https://github.com/DebaPriyoGuha/portfolio.git
cd portfolio
Step 2: Add Your Content
Required Files:
text
assets/images/profile.jpg     # Your photo (recommended: 800x800px)
assets/resume.pdf             # Your CV
Optional Files:
text
assets/images/favicon.png     # 32x32 or 64x64 px
assets/images/projects/*.jpg  # Project images (1200x800px recommended)
assets/sounds/click.mp3       # Short click sound
assets/sounds/bg-music.mp3    # Background music (looping)
Step 3: Update Personal Info
Edit index.html and update:

html
<!-- Line 47-49: Contact Info -->
<span>Chattogram, Bangladesh</span>
<span>debapriyoguha@gmail.com</span>
<span>+880-1820-886459</span>

<!-- Line 55-66: Social Links -->
<a href="https://www.linkedin.com/in/debapriyo-guha/">...</a>
<a href="https://github.com/DebaPriyoGuha">...</a>
Step 4: Test Locally
Open index.html in your browser:

bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Or simply double-click index.html
Step 5: Deploy
GitHub Pages:
bash
git add .
git commit -m "Initial portfolio"
git push origin main
Then enable GitHub Pages in repository settings.

Your site will be live at: https://yourusername.github.io/portfolio

📝 Adding New Projects
Edit data/projects.json:

json
{
    "projects": [
        {
            "id": 1,
            "title": "Project Title",
            "organization": "Organization Name",
            "date": "2024 - Present",
            "status": "ongoing",
            "categories": ["astro", "ml"],
            "description": "Brief description of the project...",
            "tags": ["Python", "TensorFlow", "CNN"],
            "image": "assets/images/projects/project1.jpg",
            "links": {
                "website": "https://example.com",
                "github": "https://github.com/...",
                "paper": "https://arxiv.org/..."
            }
        }
    ]
}
Project Fields:
Field	Type	Required	Description
id	number	✅	Unique identifier
title	string	✅	Project name
organization	string	✅	Where you did it
date	string	✅	Time period
status	string	✅	"ongoing" or "completed"
categories	array	✅	["astro"], ["ml"], or both
description	string	✅	Brief description
tags	array	✅	Technology tags
image	string	❌	Path to image (optional)
links.website	string	❌	Project website
links.github	string	❌	GitHub repo
links.paper	string	❌	Related paper
📝 Adding New Publications
Edit data/publications.json:

json
{
    "publications": [
        {
            "id": 1,
            "title": "Paper Title Here",
            "authors": "<strong>D. P. Guha</strong>, F. Tabassum",
            "venue": "Journal/Conference Name, Year",
            "status": "submitted",
            "role": "First Author",
            "abstract": "Abstract text goes here...",
            "contribution": "Your specific contribution (for co-authored papers)"
        }
    ]
}
Publication Fields:
Field	Type	Required	Options
id	number	✅	Unique identifier
title	string	✅	Full paper title
authors	string	✅	Use <strong> for your name
venue	string	✅	Journal/Conference
status	string	✅	"submitted", "in preparation", "published"
role	string	✅	"First Author", "Co-author"
abstract	string	❌	Paper abstract
contribution	string	❌	Your contribution (co-authored)
🎮 Game System
How It Works:
User visits the website
After 5 minutes of browsing, a modal appears
User can choose to play or skip
Game is a simple Space Shooter
Testing the Game:
Open browser console and run:

javascript
// Show game modal immediately
window.gameManager.show()

// Start game directly
window.gameManager.start()

// Exit game
window.gameManager.exit()
Game Controls:
Key	Action
← / A	Move left
→ / D	Move right
Space	Shoot
Escape	Exit game
🔊 Sound System
Default Behavior:
Sound is OFF by default
User must click the speaker icon to enable
Setting persists in localStorage
Sound Files:
File	Duration	Purpose
click.mp3	~0.1s	Button clicks
bg-music.mp3	1-3 min	Background music (loops)
Free Sound Resources:
Freesound.org
Zapsplat.com
Mixkit.co
🌓 Theme System
Default:
Follows system preference
Falls back to light mode
Toggle:
Click moon/sun icon (top right)
Persists in localStorage
CSS Variables:
css
/* Light Mode */
:root {
    --color-cream: #FDFBD4;
    --color-blue: #003C7B;
    --color-chocolate: #4B2400;
}

/* Dark Mode */
[data-theme="dark"] {
    --color-cream: #1a1a2e;
    --color-blue: #16213e;
    --color-chocolate: #e94560;
}
📱 Responsive Breakpoints
Device	Width	Layout
Desktop	≥1024px	Two-column, sidebar fixed
Tablet	768-1023px	Two-column, narrower sidebar
Mobile	480-767px	Single column, sidebar on top
Small Mobile	<480px	Single column, compact
⌨️ Keyboard Shortcuts
Shortcut	Action
Escape	Close modals/game
Ctrl + G	Open game modal (testing)
🖨️ Print Version
The website is print-optimized:

Press Ctrl + P (or Cmd + P on Mac)
Sidebar converts to full-width header
Toggle buttons and game hidden
Links show as underlined text
🐛 Troubleshooting
Projects/Publications Not Loading
text
Problem: JSON files not loading
Solution: 
1. Run a local server (not file://)
2. Check console for errors
3. Validate JSON at jsonlint.com
Sounds Not Playing
text
Problem: No sound on click
Solution:
1. Click speaker icon to enable
2. Check if files exist in assets/sounds/
3. Browser may block autoplay - user interaction required
Game Not Appearing
text
Problem: Game modal never shows
Solution:
1. Wait 5 minutes on the page
2. Test with: window.gameManager.show()
3. Check if sessionStorage has 'portfolio-game-shown'
Dark Mode Not Working
text
Problem: Theme toggle not responding
Solution:
1. Check if theme.js is loaded
2. Clear localStorage
3. Check console for errors
🔧 Customization
Changing Colors:
Edit css/style.css lines 8-12:

css
:root {
    --color-cream: #YOUR_COLOR;
    --color-blue: #YOUR_COLOR;
    --color-chocolate: #YOUR_COLOR;
}
Changing Fonts:
Edit index.html Google Fonts link and css/style.css:

css
body {
    font-family: 'Your Font', sans-serif;
}
Changing Game Trigger Time:
Edit js/game.js line 9:

javascript
const GAME_TRIGGER_TIME = 5 * 60 * 1000; // 5 minutes
// Change to:
const GAME_TRIGGER_TIME = 10 * 60 * 1000; // 10 minutes
📊 Performance Tips
Optimize Images:

Use WebP format
Compress to <200KB each
Use Squoosh
Minify Files:

Minify CSS/JS for production
Use Terser for JS
Use cssnano for CSS
Lazy Loading:

Images already use native lazy loading
Add loading="lazy" to new images
📄 License
MIT License - Feel free to use and modify for your own portfolio.

👤 Author
Deba Priyo Guha

Platform	Link
📧 Email	debapriyoguha@gmail.com
💼 LinkedIn	debapriyo-guha
🐙 GitHub	@DebaPriyoGuha
🔬 ResearchGate	Deba-Priyo-Guha
🙏 Acknowledgments
Font Awesome - Icons
Google Fonts - Typography
Freesound - Sound effects
📝 Changelog
v1.0.0 (2025)
Initial release
Two-column layout
3-color minimalist design
Dark/Light mode
Sound system (off by default)
Space Shooter game (5-min trigger)
JSON-based projects/publications
Fully responsive
Print optimized
⭐ If you like this portfolio template, please give it a star on GitHub! ⭐

Made with ❤️ for PhD applications

```
