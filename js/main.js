/* ============================================================
   MAIN.JS — Core site functionality
   Loads all data sections independently from their JSON files
============================================================ */

'use strict';

// ── Utility ───────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const 
$$
= (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

async function fetchJSON(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (e) {
        console.error(`Failed to load ${path}:`, e);
        return null;
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Scroll Reveal ─────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

// ── Active Nav on Scroll ──────────────────────────────────
function initScrollSpy() {
    const sections =
$$
('section.content-section');
    const navLinks = 
$$
('.nav-link');

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.dataset.section === id);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => spy.observe(s));
}

// ── Mobile Sidebar ────────────────────────────────────────
function initMobileSidebar() {
    const sidebar = $('#sidebar');
    const menuBtn = $('#mobileMenuBtn');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
        display:none; position:fixed; inset:0;
        background:rgba(0,0,0,0.5); z-index:99;
    `;
    document.body.appendChild(overlay);

    function toggle() {
        const open = sidebar.classList.toggle('open');
        overlay.style.display = open ? 'block' : 'none';
    }
    menuBtn?.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);
$$
('.nav-link').forEach(l => l.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            overlay.style.display = 'none';
        }
    }));
}

// ── Profile Image Modal ───────────────────────────────────
function initProfileModal() {
    const wrapper = $('#profileImgWrapper');
    const modal   = $('#profileModal');
    const close   = $('#closeProfileModal');

    wrapper?.addEventListener('click', () => modal.classList.add('open'));
    close?.addEventListener('click',   () => modal.classList.remove('open'));
    modal?.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('open');
    });
}

// ── Keyboard Shortcuts ────────────────────────────────────
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        
$$
('.modal-overlay').forEach(m => m.classList.remove('open'));
    }
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        window.gameManager?.show();
    }
});

// ============================================================
//  SECTION LOADERS
// ============================================================

// ── PROFILE / ABOUT ───────────────────────────────────────
async function loadAbout() {
    const data = await fetchJSON('data/profile.json');
    if (!data) return;

    // Update sidebar
    const sidebarName     = $('#sidebarName');
    const sidebarTagline  = $('#sidebarTagline');
    const sidebarLocation = $('#sidebarLocation span');
    if (sidebarName)     sidebarName.textContent     = data.name;
    if (sidebarTagline)  sidebarTagline.textContent  = data.tagline;
    if (sidebarLocation) sidebarLocation.textContent = data.location;

    // Build about section
    const container = $('#aboutContent');
    if (!container) return;

    const summaryHTML = data.summary
        .map(p => `<p>${p}</p>`).join('');

    const primaryHTML = data.research_interests.primary
        .map(i => `<li>${i}</li>`).join('');

    const specificHTML = data.research_interests.specific
        .map(i => `<li>${i}</li>`).join('');

    const langHTML = data.languages.map(lang => {
        if (lang.scores) {
            const bars = Object.entries(lang.scores)
                .filter(([k]) => k !== 'overall')
                .map(([k, v]) => `
                    <div class="ielts-item">
                        <span class="ielts-label">${capitalize(k)}</span>
                        <div class="ielts-track">
                            <div class="ielts-fill" style="width:${(v / 9) * 100}%"></div>
                        </div>
                        <span class="ielts-score">${v}</span>
                    </div>
                `).join('');
            return `
                <li>
                    <strong>${lang.name}</strong> — ${lang.level}
                    <br><small style="color:var(--text-muted)">${lang.note}</small>
                    <br><small style="color:var(--text-muted)">${lang.test} · Overall: ${lang.scores.overall} · ${lang.test_date}</small>
                    <div class="ielts-bar">${bars}</div>
                </li>`;
        }
        return `
            <li>
                <strong>${lang.name}</strong> — ${lang.level}
                <br><small style="color:var(--text-muted)">${lang.note}</small>
            </li>`;
    }).join('');

    const interestsHTML = data.interests.map(i =>
        `<li>
            <i class="${i.icon}" style="color:var(--accent);margin-right:6px"></i>
            <strong>${i.name}</strong> — ${i.desc}
        </li>`
    ).join('');

    container.innerHTML = `
        <div class="about-grid">
            <div class="about-summary">${summaryHTML}</div>
            <div class="about-card">
                <h3><i class="fas fa-bullseye"></i> Primary Research Areas</h3>
                <ul>${primaryHTML}</ul>
            </div>
            <div class="about-card">
                <h3><i class="fas fa-microscope"></i> Specific Focus</h3>
                <ul>${specificHTML}</ul>
            </div>
            <div class="about-card">
                <h3><i class="fas fa-language"></i> Languages</h3>
                <ul style="gap:12px">${langHTML}</ul>
            </div>
            <div class="about-card">
                <h3><i class="fas fa-heart"></i> Interests & Hobbies</h3>
                <ul>${interestsHTML}</ul>
            </div>
        </div>`;

    // Animate IELTS bars after render
    setTimeout(() => {
$$
('.ielts-fill').forEach(bar => {
            bar.style.width = bar.style.width;
        });
    }, 300);
}

// ── EDUCATION ─────────────────────────────────────────────
async function loadEducation() {
    const data = await fetchJSON('data/education.json');
    if (!data) return;
    const container = $('#educationContent');
    if (!container) return;

    const cardsHTML = data.education.map(edu => {
        const thesisHTML = edu.thesis ? `
            <div class="edu-thesis">
                <strong>Thesis:</strong> "${edu.thesis.title}"<br>
                <small>Supervisor: ${edu.thesis.supervisor}</small>
            </div>` : '';

        const cgpaHTML = edu.cgpa
            ? `<span class="edu-badge">CGPA: ${edu.cgpa}</span>`
            : edu.gpa
            ? `<span class="edu-badge">GPA: ${edu.gpa}</span>`
            : '';

        const websiteHTML = edu.website
            ? `<a href="${edu.website}" target="_blank" class="edu-badge"
                  style="text-decoration:none">
                   <i class="fas fa-globe"></i> Website
               </a>`
            : '';

        return `
        <div class="edu-card ${edu.highlight ? 'highlight' : ''}">
            <div class="edu-header">
                <span class="edu-inst">${edu.institution}</span>
                <span class="edu-period">${edu.period}</span>
            </div>
            <div class="edu-degree">${edu.degree}</div>
            ${edu.department ? `<div class="edu-dept">${edu.department}</div>` : ''}
            <div class="edu-meta">
                ${cgpaHTML}
                ${edu.location
                    ? `<span class="edu-badge">
                           <i class="fas fa-map-marker-alt"></i> ${edu.location}
                       </span>`
                    : ''}
                ${websiteHTML}
            </div>
            ${thesisHTML}
        </div>`;
    }).join('');

    container.innerHTML = `<div class="edu-timeline">${cardsHTML}</div>`;
}

// ── RESEARCH EXPERIENCE ───────────────────────────────────
async function loadExperience() {
    const data = await fetchJSON('data/experience.json');
    if (!data) return;
    const container = $('#experienceContent');
    if (!container) return;

    const cardsHTML = data.experience.map(exp => {
        const pointsHTML = exp.points
            .map(p => `<li>${p}</li>`).join('');

        const projectHTML = exp.project ? `
            <div style="margin-bottom:10px">
                <span style="font-size:0.75rem;font-weight:700;text-transform:uppercase;
                             letter-spacing:0.5px;color:var(--text-muted)">Project</span>
                <div style="font-size:0.88rem;font-weight:600;color:var(--accent);margin-top:2px">
                    ${exp.project_url
                        ? `<a href="${exp.project_url}" target="_blank"
                              style="color:var(--accent)">
                               <i class="fas fa-flask" style="margin-right:5px"></i>${exp.project}
                               <i class="fas fa-external-link-alt"
                                  style="font-size:0.7rem;margin-left:4px"></i>
                           </a>`
                        : `<i class="fas fa-flask" style="margin-right:5px"></i>${exp.project}`}
                </div>
            </div>` : '';

        const supervisorHTML = exp.supervisor ? `
            <div class="exp-supervisor">
                Supervisor:
                <a href="${exp.supervisor.website || '#'}" target="_blank">
                    ${exp.supervisor.name}
                </a>
                — ${exp.supervisor.title}
                ${exp.supervisor.email
                    ? `| <a href="mailto:${exp.supervisor.email}">${exp.supervisor.email}</a>`
                    : ''}
            </div>` : '';

        const thesisHTML = exp.thesis_title ? `
            <div class="edu-thesis" style="margin-bottom:12px">
                <strong>Thesis:</strong> "${exp.thesis_title}"
            </div>` : '';

        const creditHTML = exp.credit
            ? `<span class="edu-badge" style="margin-left:8px">${exp.credit}</span>`
            : '';

        return `
        <div class="exp-card ${exp.current ? 'current' : ''}">
            <div class="exp-header">
                <span class="exp-title">${exp.title}</span>
                <span class="exp-period ${exp.current ? 'current-badge' : ''}">
                    ${exp.current
                        ? '<i class="fas fa-circle" style="font-size:0.5rem"></i> '
                        : ''}
                    ${exp.period}
                </span>
            </div>
            <div class="exp-org">
                ${exp.org_website
                    ? `<a href="${exp.org_website}" target="_blank">${exp.organization}</a>`
                    : exp.organization}
                ${creditHTML}
            </div>
            ${projectHTML}
            ${supervisorHTML}
            ${thesisHTML}
            <ul class="exp-points">${pointsHTML}</ul>
        </div>`;
    }).join('');

    container.innerHTML = `<div class="exp-timeline">${cardsHTML}</div>`;
}

// ── PUBLICATIONS ──────────────────────────────────────────
async function loadPublications() {
    const data = await fetchJSON('data/publications.json');
    if (!data) return;
    const container = $('#publicationsContent');
    if (!container) return;

    let globalNum = 0;

    const groupsHTML = data.groups.map(group => {
        const pubsHTML = group.publications.map(pub => {
            globalNum++;
            const num = globalNum;

            const statusClass = {
                published:   'published',
                accepted:    'accepted',
                submitted:   'submitted',
                preparation: 'preparation'
            }[pub.status] || 'preparation';

            const statusLabel = {
                published:   'Published',
                accepted:    'Accepted',
                submitted:   'Under Review',
                preparation: 'In Preparation'
            }[pub.status] || 'In Preparation';

            const linksHTML = pub.arxiv
                ? `<a href="${pub.arxiv}" target="_blank" class="pub-link">
                       <i class="fas fa-external-link-alt"></i> arXiv
                   </a>`
                : '';

            const abstractHTML = pub.abstract ? `
                <button class="pub-abstract-toggle"
                    onclick="
                        this.nextElementSibling.classList.toggle('open');
                        this.innerHTML = this.nextElementSibling.classList.contains('open')
                            ? '<i class=\\'fas fa-chevron-up\\'></i> Hide Abstract'
                            : '<i class=\\'fas fa-chevron-down\\'></i> Show Abstract';
                    ">
                    <i class="fas fa-chevron-down"></i> Show Abstract
                </button>
                <div class="pub-abstract">${pub.abstract}</div>` : '';

            const contribHTML = pub.contribution ? `
                <div class="pub-contribution">
                    <strong>My Contribution:</strong> ${pub.contribution}
                </div>` : '';

            const statusNoteHTML = pub.status_note ? `
                <div class="pub-contribution">
                    <strong>Status:</strong> ${pub.status_note}
                </div>` : '';

            return `
            <div class="pub-card">
                <div class="pub-num">${num}</div>
                <div class="pub-title">${pub.title}</div>
                <div class="pub-authors">${pub.authors}</div>
                <div class="pub-venue">${pub.venue}</div>
                <div class="pub-meta">
                    <span class="pub-badge ${statusClass}">${statusLabel}</span>
                    <span class="pub-badge first-author">${pub.role}</span>
                    ${linksHTML}
                </div>
                ${abstractHTML}
                ${contribHTML}
                ${statusNoteHTML}
            </div>`;
        }).join('');

        return `
        <div class="pub-group">
            <div class="pub-group-title">
                <i class="${group.icon}"></i> ${group.label}
            </div>
            <div class="pub-list">${pubsHTML}</div>
        </div>`;
    }).join('');

    container.innerHTML = groupsHTML;
}

// ── PROJECTS ──────────────────────────────────────────────
async function loadProjects() {
    const data = await fetchJSON('data/projects.json');
    if (!data) return;
    const container = $('#projectsContent');
    if (!container) return;

    const cardsHTML = data.projects.map(proj => {
        const tagsHTML = proj.tags
            .map(t => `<span class="project-tag">${t}</span>`).join('');

        const imageHTML = proj.image
            ? `<img src="${proj.image}" alt="${proj.title}"
                    class="project-img" loading="lazy">`
            : `<div class="project-img-placeholder">
                   <i class="${proj.icon || 'fas fa-code'}"></i>
               </div>`;

        const linksHTML = Object.entries(proj.links)
            .filter(([, v]) => v)
            .map(([k, v]) => {
                const icons  = {
                    website: 'fas fa-globe',
                    github:  'fab fa-github',
                    paper:   'fas fa-file-alt'
                };
                const titles = {
                    website: 'Website',
                    github:  'GitHub',
                    paper:   'Paper'
                };
                return `
                <a href="${v}" target="_blank"
                   class="project-link-btn" title="${titles[k]}">
                    <i class="${icons[k]}"></i>
                </a>`;
            }).join('');

        const categories = [
            ...(proj.categories || []),
            proj.status
        ].join(' ');

        return `
        <div class="project-card" data-categories="${categories}">
            ${imageHTML}
            <div class="project-body">
                <div class="project-header">
                    <div class="project-title">${proj.title}</div>
                    <div class="project-org">${proj.organization} · ${proj.date}</div>
                </div>
                <div class="project-desc">${proj.description}</div>
                <div class="project-tags">${tagsHTML}</div>
                <div class="project-footer">
                    <span class="project-status ${proj.status}">
                        ${capitalize(proj.status)}
                    </span>
                    <div class="project-links">${linksHTML}</div>
                </div>
            </div>
        </div>`;
    }).join('');

    container.innerHTML = `<div class="projects-grid">${cardsHTML}</div>`;

    // Filter logic
    
$$
('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
$$
('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            
$$
('.project-card').forEach(card => {
                const cats = card.dataset.categories || '';
                card.classList.toggle('hidden',
                    filter !== 'all' && !cats.includes(filter));
            });
            window.soundManager?.playClick();
        });
    });
}

// ── SKILLS ────────────────────────────────────────────────
async function loadSkills() {
    const data = await fetchJSON('data/skills.json');
    if (!data) return;
    const container = $('#skillsContent');
    if (!container) return;

    const categoriesHTML = data.categories.map(cat => {
        let innerHTML = '';

        if (cat.type === 'tags' && cat.subcategories) {
            innerHTML = cat.subcategories.map(sub => `
                <div style="margin-bottom:10px">
                    <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px;
                                font-weight:600;text-transform:uppercase;letter-spacing:0.5px">
                        ${sub.label}
                    </div>
                    <div class="skill-tags">
                        ${sub.items.map(i => `<span class="skill-tag">${i}</span>`).join('')}
                    </div>
                </div>`).join('');
        }

        if (cat.type === 'bars' && cat.items) {
            innerHTML = cat.items.map(item => `
                <div class="skill-bar-item">
                    <div class="skill-bar-header">
                        <span>${item.label}</span>
                        <span>${item.score} / ${item.max}</span>
                    </div>
                    <div class="skill-bar-track">
                        <div class="skill-bar-fill"
                             data-width="${(item.score / item.max) * 100}"></div>
                    </div>
                </div>`).join('');
        }

        return `
        <div class="skill-category">
            <div class="skill-category-title">
                <i class="${cat.icon}"></i> ${cat.title}
            </div>
            ${innerHTML}
        </div>`;
    }).join('');

    container.innerHTML = `<div class="skills-grid">${categoriesHTML}</div>`;

    // Animate skill bars on scroll
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
$$
('.skill-bar-fill', entry.target).forEach(bar => {
                    bar.style.width = bar.dataset.width + '%';
                });
            }
        });
    }, { threshold: 0.3 });

    const skillSection = $('#skills');
    if (skillSection) barObserver.observe(skillSection);
}

// ── AWARDS ────────────────────────────────────────────────
async function loadAwards() {
    const data = await fetchJSON('data/awards.json');
    if (!data) return;
    const container = $('#awardsContent');
    if (!container) return;

    const groupsHTML = data.groups.map(group => {
        const awardsHTML = group.awards.map(award => {
            const noteHTML = award.note
                ? `<div class="award-note">${award.note}</div>` : '';

            const linkHTML = award.link
                ? `<a href="${award.link}" target="_blank"
                      style="font-size:0.75rem;color:var(--blue-lighter)">
                       <i class="fas fa-external-link-alt"></i>
                   </a>` : '';

            return `
            <div class="award-card">
                <div class="award-icon">${award.icon}</div>
                <div class="award-body">
                    <div class="award-year-title">
                        <span class="award-year">${award.year}</span>
                        <span class="award-title">${award.title}</span>
                        ${linkHTML}
                    </div>
                    <div class="award-org">${award.org}</div>
                    ${noteHTML}
                </div>
            </div>`;
        }).join('');

        return `
        <div class="awards-group">
            <div class="awards-group-title">${group.label}</div>
            <div class="awards-list">${awardsHTML}</div>
        </div>`;
    }).join('');

    container.innerHTML = groupsHTML;
}

// ── LEADERSHIP ────────────────────────────────────────────
async function loadLeadership() {
    const data = await fetchJSON('data/leadership.json');
    if (!data) return;
    const container = $('#leadershipContent');
    if (!container) return;

    const cardsHTML = data.leadership.map(item => {
        const pointsHTML = item.points
            .map(p => `<li>${p}</li>`).join('');

        return `
        <div class="leadership-card ${item.featured ? 'featured' : ''}">
            <div class="leadership-header">
                <span class="leadership-role">${item.role}</span>
                <span class="leadership-period">${item.period}</span>
            </div>
            <div class="leadership-org">
                ${item.org_website
                    ? `<a href="${item.org_website}" target="_blank">${item.organization}</a>`
                    : item.organization}
            </div>
            <ul class="leadership-points">${pointsHTML}</ul>
        </div>`;
    }).join('');

    container.innerHTML = `<div class="leadership-list">${cardsHTML}</div>`;
}

// ── CERTIFICATIONS ────────────────────────────────────────
async function loadCertifications() {
    const data = await fetchJSON('data/certifications.json');
    if (!data) return;
    const container = $('#certificationsContent');
    if (!container) return;

    const cardsHTML = data.certifications.map(cert => {
        const pointsHTML = cert.points
            .map(p => `<li>${p}</li>`).join('');

        return `
        <div class="cert-card">
            <div class="cert-header">
                <span class="cert-title">${cert.title}</span>
                <span class="cert-period">${cert.period}</span>
            </div>
            <div class="cert-org">
                ${cert.org_website
                    ? `<a href="${cert.org_website}" target="_blank">${cert.organization}</a>`
                    : cert.organization}
            </div>
            <ul class="cert-points">${pointsHTML}</ul>
        </div>`;
    }).join('');

    container.innerHTML = `<div class="cert-list">${cardsHTML}</div>`;
}

// ── CONTACT ───────────────────────────────────────────────
async function loadContact() {
    const data = await fetchJSON('data/profile.json');
    if (!data) return;
    const container = $('#contactContent');
    if (!container) return;

    const linksHTML = data.contact_links.map(item => `
        <a href="${item.href}"
           target="${item.href.startsWith('mailto') || item.href.startsWith('tel')
               ? '_self' : '_blank'}"
           class="contact-item">
            <div class="contact-icon"><i class="${item.icon}"></i></div>
            <div>
                <div class="contact-label">${item.label}</div>
                <div class="contact-value">${item.value}</div>
            </div>
        </a>`).join('');

    container.innerHTML = `
        <div class="contact-grid">${linksHTML}</div>
        <p style="font-size:0.85rem;color:var(--text-muted);
                  text-align:center;margin-top:16px">
            Feel free to reach out for research collaborations,
            PhD inquiries, or general discussions.
        </p>`;
}

// ============================================================
//  INIT
// ============================================================
async function init() {
    // Footer year
    const fy = $('#footerYear');
    if (fy) fy.textContent = new Date().getFullYear();

    // Observe sections for scroll reveal
    $$('section.content-section').forEach(s => observer.observe(s));

    // Init UI
    initMobileSidebar();
    initProfileModal();
    initScrollSpy();

    // Load all sections in parallel
    await Promise.all([
        loadAbout(),
        loadEducation(),
        loadExperience(),
        loadPublications(),
        loadProjects(),
        loadSkills(),
        loadAwards(),
        loadLeadership(),
        loadCertifications(),
        loadContact()
    ]);
}

document.addEventListener('DOMContentLoaded', init);
