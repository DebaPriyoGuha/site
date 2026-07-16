# Deba Priyo Guha — Academic Portfolio

Personal academic portfolio. Live at **[debapriyoguha.github.io/site](https://debapriyoguha.github.io/site/)**.

Designed for PhD applications — clean white + forest green (CANDLE-inspired palette).

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--green-dark` | `#1b5e20` | Sidebar, section titles |
| `--green` | `#2e7d32` | Accents, badges |
| `--green-light` | `#4caf50` | Tags, bullet markers |
| `--green-pale` | `#e8f5e9` | Card backgrounds, badge fills |
| `--bg` | `#ffffff` | Main background |

---

## File Structure

```
site/
├── index.html
├── css/style.css
├── js/main.js              # All section loaders
├── data/                   # ← Edit these to update content
│   ├── profile.json        # About, languages, interests, contact
│   ├── education.json
│   ├── experience.json
│   ├── publications.json   # Grouped: published / under review / in prep
│   ├── projects.json
│   ├── skills.json
│   ├── awards.json
│   ├── leadership.json
│   └── certifications.json
├── assets/
│   ├── images/profile.jpg
│   ├── images/favicon.png
│   └── resume.pdf
├── v1_backup/              # Previous version (cream/blue/dark-mode design)
└── README.md
```

---

## Running Locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

---

## Updating Content

All content is in `data/`. Edit the relevant JSON file — no HTML changes needed.

**Publications** use a `groups` structure:
```json
{
  "groups": [
    {
      "id": "published",
      "label": "Published",
      "icon": "fas fa-check-circle",
      "publications": [ { "id": 1, "title": "...", "status": "published", ... } ]
    }
  ]
}
```
`status` values: `"published"` · `"accepted"` · `"submitted"` · `"preparation"`

---

## Deployment

GitHub Pages from `main` branch root.
Live: `https://debapriyoguha.github.io/site/`

---

## Author

**Deba Priyo Guha** — ML Researcher · Astrophysics  
[debapriyoguha@gmail.com](mailto:debapriyoguha@gmail.com) · [LinkedIn](https://www.linkedin.com/in/debapriyo-guha/) · [ORCID](https://orcid.org/0009-0003-8748-1491)
