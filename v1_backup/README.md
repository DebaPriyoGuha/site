# Deba Priyo Guha — Portfolio Website

Personal academic portfolio website built for PhD applications. Live at **[debapriyoguha.github.io/site](https://debapriyoguha.github.io/site/)**.

---

## Design

**3-Color Scheme:**

| Color | Hex | Usage |
|-------|-----|-------|
| Cream | `#FDFBD4` | Background (60%) |
| Dark Cerulean | `#003C7B` | Sidebar / content areas (30%) |
| Rich Chocolate | `#4B2400` | Accents / CTA (10%) |

Two-column layout — fixed left sidebar, scrollable right content. Fully responsive (collapses to single column on mobile).

---

## Features

| Feature | Details |
|---------|---------|
| Dark / Light mode | System preference auto-detect + toggle; persists via `localStorage` |
| Sound system | OFF by default; synthesized click via Web Audio API |
| Space Shooter game | Appears after 5 minutes on site (`Ctrl+G` to test immediately) |
| Scroll reveal | Sections fade in on scroll via `IntersectionObserver` |
| Project filters | Filter by category (astro / ml / medical / hardware / web) or status |
| Print optimized | Sidebar hidden, clean print layout |
| Profile image modal | Click photo to enlarge |

---

## File Structure

```
site/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js       # Section loaders (fetches all JSON files)
│   ├── theme.js      # Dark/light mode
│   ├── sound.js      # Sound system
│   └── game.js       # Space Shooter
├── data/             # ← Edit these files to update content
│   ├── profile.json        # About, summary, languages, interests, contact
│   ├── education.json      # Education timeline
│   ├── experience.json     # Research experience
│   ├── publications.json   # Papers (grouped by status)
│   ├── projects.json       # Projects (filterable cards)
│   ├── skills.json         # Technical skills (tags + IELTS bars)
│   ├── awards.json         # Awards & honors
│   ├── leadership.json     # Leadership & service
│   └── certifications.json # Certifications & training
├── assets/
│   ├── images/
│   │   ├── profile.jpg     # Profile photo (recommended: 800×800px)
│   │   ├── favicon.png     # 32×32 or 64×64px
│   │   └── projects/       # Project images (recommended: 1200×800px)
│   └── resume.pdf          # CV download
└── README.md
```

---

## Updating Content

All content lives in `data/`. No HTML editing needed.

### Adding a project — `data/projects.json`

```json
{
  "id": 10,
  "title": "Project Title",
  "organization": "Organization Name",
  "date": "2024 – Present",
  "status": "ongoing",
  "categories": ["astro", "ml"],
  "description": "Brief description.",
  "tags": ["Python", "PyTorch"],
  "image": null,
  "icon": "fas fa-star",
  "links": {
    "website": null,
    "github": "https://github.com/...",
    "paper": null
  }
}
```

`status`: `"ongoing"` or `"completed"`  
`categories`: any of `astro`, `ml`, `medical`, `hardware`, `web`

### Adding a publication — `data/publications.json`

Publications are grouped. Add to the appropriate group:

```json
{
  "id": 9,
  "title": "Paper Title",
  "authors": "<strong>D. P. Guha</strong>, Co-Author",
  "venue": "Journal Name, Year",
  "status": "published",
  "role": "First Author",
  "doi": "https://doi.org/10.xxxx/...",
  "arxiv": "https://arxiv.org/abs/...",
  "abstract": "Abstract text.",
  "contribution": null
}
```

`status`: `"published"`, `"accepted"`, `"submitted"`, or `"preparation"`

---

## Running Locally

JSON files require a server (not `file://`):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Escape` | Close modals / exit game |
| `Ctrl + G` | Open game modal immediately |

**Game controls:** `← / →` or `A / D` to move, `Space` to shoot.

---

## Customization

**Colors** — edit CSS variables at the top of `css/style.css`:
```css
:root {
    --cream:      #FDFBD4;
    --blue:       #003C7B;
    --chocolate:  #4B2400;
}
```

**Game trigger time** — edit `js/game.js` line 8:
```js
const TRIGGER_TIME = 5 * 60 * 1000; // 5 minutes
```

---

## Deployment

Deployed via GitHub Pages from the `main` branch root.  
Live URL: `https://debapriyoguha.github.io/site/`

---

## Author

**Deba Priyo Guha** — ML Researcher · Astrophysics  
[debapriyoguha@gmail.com](mailto:debapriyoguha@gmail.com) · [LinkedIn](https://www.linkedin.com/in/debapriyo-guha/) · [GitHub](https://github.com/DebaPriyoGuha) · [ORCID](https://orcid.org/0009-0003-8748-1491)
