# Deba Priyo Guha — Astrophysics Portfolio

Personal academic website for PhD applications. Live at **[debapriyoguha.github.io/site](https://debapriyoguha.github.io/site/)**.

Dark navy sidebar + white content — optimized for a PhD astrophysics applicant audience.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--navy`    | `#0f172a` | Sidebar background |
| `--sky`     | `#0ea5e9` | Links, active states, accents |
| `--sky-d`   | `#0284c7` | Hover state for links |
| `--sky-pp`  | `#f0f9ff` | Card/badge pale fills |
| `--gold`    | `#d97706` | Awards, honors |
| `--bg`      | `#ffffff` | Main background |
| `--bg-2`    | `#f8fafc` | Card/section alternates |

---

## File Structure

```
site/
├── index.html
├── css/style.css
├── js/main.js              # All section loaders
├── data/                   # ← Edit these to update content
│   ├── profile.json        # About, summary, languages, interests, contact
│   ├── education.json
│   ├── experience.json
│   ├── publications.json   # Grouped: published / under_review / in_prep_*
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
      "label": "Published & Accepted",
      "icon": "fas fa-check-circle",
      "publications": [ { "title": "...", "status": "published", "doi": "...", "arxiv": "..." } ]
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
[debapriyoguha@gmail.com](mailto:debapriyoguha@gmail.com) · [ORCID](https://orcid.org/0009-0003-8748-1491) · [LinkedIn](https://www.linkedin.com/in/debapriyo-guha/)
