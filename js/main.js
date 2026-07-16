'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

async function fetchJSON(path) {
    try {
        const r = await fetch(path);
        if (!r.ok) throw new Error(r.status);
        return r.json();
    } catch (e) {
        console.error('Failed to load', path, e);
        return null;
    }
}

// ── Scroll reveal ─────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
}, { threshold: 0.07 });

// ── Active nav on scroll ──────────────────────────────────
function initScrollSpy() {
    const spy = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                $$('.nav-link').forEach(l =>
                    l.classList.toggle('active', l.dataset.s === e.target.id));
            }
        });
    }, { threshold: 0.3 });
    $$('section.section').forEach(s => spy.observe(s));
}

// ── Mobile sidebar ────────────────────────────────────────
function initMobile() {
    const sidebar  = $('#sidebar');
    const overlay  = $('#mobOverlay');
    const menuBtn  = $('#mobMenu');
    const toggle   = () => {
        const open = sidebar.classList.toggle('open');
        overlay.classList.toggle('show', open);
    };
    menuBtn?.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);
    $$('.nav-link').forEach(l => l.addEventListener('click', () => {
        if (window.innerWidth <= 768) { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
    }));
}

// ── Loaders ───────────────────────────────────────────────

async function loadAbout() {
    const d = await fetchJSON('data/profile.json');
    if (!d) return;

    // Sidebar
    const nameEl = $('#sidebar .profile-name a');
    if (nameEl) nameEl.textContent = d.name;
    const tagEl  = $('#sidebarTagline');  if (tagEl)  tagEl.textContent  = d.tagline;
    const locEl  = $('#sidebarLocation'); if (locEl)  locEl.textContent  = d.location;

    const c = $('#aboutContent');
    if (!c) return;

    const summary = d.summary.map(p => `<p>${p}</p>`).join('');

    const primary  = d.research_interests.primary.map(i => `<li>${i}</li>`).join('');
    const specific = d.research_interests.specific.map(i => `<li>${i}</li>`).join('');

    const langs = d.languages.map(l => {
        if (l.scores) {
            const bars = Object.entries(l.scores)
                .filter(([k]) => k !== 'overall')
                .map(([k, v]) => `
                    <div class="ielts-item">
                        <span class="ielts-label">${k.charAt(0).toUpperCase()+k.slice(1)}</span>
                        <div class="ielts-track"><div class="ielts-fill" style="width:${(v/9)*100}%"></div></div>
                        <span class="ielts-score">${v}</span>
                    </div>`).join('');
            return `<li><strong>${l.name}</strong> — ${l.level}<br>
                <small style="color:var(--text-muted)">${l.note}</small><br>
                <small style="color:var(--text-muted)">${l.test} · Overall ${l.scores.overall} · ${l.test_date}</small>
                <div class="ielts-bar">${bars}</div></li>`;
        }
        return `<li><strong>${l.name}</strong> — ${l.level}<br><small style="color:var(--text-muted)">${l.note}</small></li>`;
    }).join('');

    const interests = d.interests.map(i =>
        `<li><i class="${i.icon}" style="color:var(--green-light);margin-right:6px"></i><strong>${i.name}</strong> — ${i.desc}</li>`
    ).join('');

    c.innerHTML = `
        <div class="about-grid">
            <div class="about-summary">${summary}</div>
            <div class="card">
                <h3><i class="fas fa-bullseye"></i> Primary Research Areas</h3>
                <ul>${primary}</ul>
            </div>
            <div class="card">
                <h3><i class="fas fa-microscope"></i> Specific Focus</h3>
                <ul>${specific}</ul>
            </div>
            <div class="card">
                <h3><i class="fas fa-language"></i> Languages</h3>
                <ul style="gap:12px">${langs}</ul>
            </div>
            <div class="card">
                <h3><i class="fas fa-heart"></i> Interests</h3>
                <ul>${interests}</ul>
            </div>
        </div>`;
}

async function loadEducation() {
    const d = await fetchJSON('data/education.json');
    if (!d) return;
    const c = $('#educationContent');
    if (!c) return;
    c.innerHTML = `<div class="edu-list">${d.education.map(e => `
        <div class="edu-card ${e.highlight ? 'highlight' : ''}">
            <div class="edu-head">
                <span class="edu-inst">${e.institution}</span>
                <span class="edu-period">${e.period}</span>
            </div>
            <div class="edu-degree">${e.degree}</div>
            ${e.department ? `<div class="edu-dept">${e.department}</div>` : ''}
            <div class="edu-meta">
                ${e.cgpa ? `<span class="badge">CGPA: ${e.cgpa}</span>` : e.gpa ? `<span class="badge">GPA: ${e.gpa}</span>` : ''}
                ${e.location ? `<span class="badge"><i class="fas fa-map-marker-alt"></i> ${e.location}</span>` : ''}
                ${e.website ? `<a href="${e.website}" target="_blank" class="badge" style="text-decoration:none"><i class="fas fa-globe"></i> Website</a>` : ''}
            </div>
            ${e.thesis ? `<div class="edu-thesis"><strong>Thesis:</strong> "${e.thesis.title}"<br><small>Supervisor: ${e.thesis.supervisor}</small></div>` : ''}
        </div>`).join('')}</div>`;
}

async function loadExperience() {
    const d = await fetchJSON('data/experience.json');
    if (!d) return;
    const c = $('#experienceContent');
    if (!c) return;
    c.innerHTML = `<div class="exp-list">${d.experience.map(e => `
        <div class="exp-card ${e.current ? 'current' : ''}">
            <div class="exp-head">
                <span class="exp-title">${e.title}</span>
                <span class="exp-period ${e.current ? 'cur' : ''}">${e.current ? '<i class="fas fa-circle" style="font-size:.45rem;vertical-align:middle;margin-right:3px"></i>' : ''}${e.period}</span>
            </div>
            <div class="exp-org">${e.org_website ? `<a href="${e.org_website}" target="_blank">${e.organization}</a>` : e.organization}${e.credit ? `<span class="badge" style="margin-left:8px">${e.credit}</span>` : ''}</div>
            ${e.supervisor ? `<div class="exp-sup">Supervisor: <a href="${e.supervisor.website||'#'}" target="_blank">${e.supervisor.name}</a> — ${e.supervisor.title}</div>` : ''}
            ${e.thesis_title ? `<div class="edu-thesis" style="margin-bottom:10px"><strong>Thesis:</strong> "${e.thesis_title}"</div>` : ''}
            <ul class="exp-pts">${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>`).join('')}</div>`;
}

async function loadPublications() {
    const d = await fetchJSON('data/publications.json');
    if (!d) return;
    const c = $('#publicationsContent');
    if (!c) return;
    let n = 0;
    c.innerHTML = d.groups.map(g => {
        const pubs = g.publications.map(p => {
            n++;
            const statusLabel = { published:'Published', accepted:'Accepted', submitted:'Under Review', preparation:'In Preparation' }[p.status] || 'In Preparation';
            const links = [
                p.doi   ? `<a href="${p.doi}"   target="_blank" class="pub-link"><i class="fas fa-link"></i> DOI</a>`   : '',
                p.arxiv ? `<a href="${p.arxiv}" target="_blank" class="pub-link"><i class="fas fa-external-link-alt"></i> arXiv</a>` : ''
            ].join('');
            return `
            <div class="pub-card">
                <div class="pub-num">${n}</div>
                <div class="pub-body">
                    <div class="pub-title">${p.title}</div>
                    <div class="pub-authors">${p.authors}</div>
                    <div class="pub-venue">${p.venue}</div>
                    <div class="pub-meta">
                        <span class="pub-badge ${p.status}">${statusLabel}</span>
                        <span class="pub-badge first-author">${p.role}</span>
                        ${links}
                    </div>
                    ${p.abstract ? `
                    <button class="pub-toggle" onclick="const a=this.nextElementSibling;a.classList.toggle('open');this.innerHTML=a.classList.contains('open')?'<i class=\\'fas fa-chevron-up\\'></i> Hide Abstract':'<i class=\\'fas fa-chevron-down\\'></i> Show Abstract'">
                        <i class="fas fa-chevron-down"></i> Show Abstract
                    </button>
                    <div class="pub-abstract">${p.abstract}</div>` : ''}
                    ${p.contribution ? `<div class="pub-contrib"><strong>My Contribution:</strong> ${p.contribution}</div>` : ''}
                    ${p.status_note  ? `<div class="pub-contrib"><strong>Status:</strong> ${p.status_note}</div>`          : ''}
                </div>
            </div>`;
        }).join('');
        return `<div class="pub-group"><div class="pub-group-title"><i class="${g.icon}"></i> ${g.label}</div><div class="pub-list">${pubs}</div></div>`;
    }).join('');
}

async function loadProjects() {
    const d = await fetchJSON('data/projects.json');
    if (!d) return;
    const c = $('#projectsContent');
    if (!c) return;
    c.innerHTML = `<div class="projects-grid">${d.projects.map(p => {
        const tags  = p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');
        const links = Object.entries(p.links).filter(([,v]) => v).map(([k,v]) => {
            const icon = { website:'fas fa-globe', github:'fab fa-github', paper:'fas fa-file-alt' }[k];
            const title= { website:'Website', github:'GitHub', paper:'Paper' }[k];
            return `<a href="${v}" target="_blank" class="proj-link-btn" title="${title}"><i class="${icon}"></i></a>`;
        }).join('');
        const cats = [...(p.categories||[]), p.status].join(' ');
        return `
        <div class="proj-card" data-cats="${cats}">
            <div class="proj-img-ph"><i class="${p.icon||'fas fa-code'}"></i></div>
            <div class="proj-body">
                <div class="proj-title">${p.title}</div>
                <div class="proj-org">${p.organization} · ${p.date}</div>
                <div class="proj-desc">${p.description}</div>
                <div class="proj-tags">${tags}</div>
                <div class="proj-foot">
                    <span class="proj-status ${p.status}">${p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span>
                    <div class="proj-links">${links}</div>
                </div>
            </div>
        </div>`;
    }).join('')}</div>`;

    $$('.flt').forEach(btn => btn.addEventListener('click', () => {
        $$('.flt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.f;
        $$('.proj-card').forEach(card =>
            card.classList.toggle('hidden', f !== 'all' && !card.dataset.cats.includes(f)));
    }));
}

async function loadSkills() {
    const d = await fetchJSON('data/skills.json');
    if (!d) return;
    const c = $('#skillsContent');
    if (!c) return;
    c.innerHTML = `<div class="skills-grid">${d.categories.map(cat => {
        let inner = '';
        if (cat.type === 'tags' && cat.subcategories) {
            inner = cat.subcategories.map(s => `
                <div style="margin-bottom:10px">
                    <div class="skill-sub-label">${s.label}</div>
                    <div class="skill-tags">${s.items.map(i => `<span class="skill-tag">${i}</span>`).join('')}</div>
                </div>`).join('');
        }
        if (cat.type === 'bars' && cat.items) {
            inner = cat.items.map(i => `
                <div class="skill-bar-item">
                    <div class="skill-bar-head"><span>${i.label}</span><span>${i.score}/${i.max}</span></div>
                    <div class="skill-bar-track"><div class="skill-bar-fill" data-w="${(i.score/i.max)*100}"></div></div>
                </div>`).join('');
        }
        return `<div class="skill-cat"><div class="skill-cat-title"><i class="${cat.icon}"></i> ${cat.title}</div>${inner}</div>`;
    }).join('')}</div>`;

    const barObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting)
                $$('.skill-bar-fill', e.target).forEach(b => { b.style.width = b.dataset.w + '%'; });
        });
    }, { threshold: 0.3 });
    const sk = $('#skills');
    if (sk) barObs.observe(sk);
}

async function loadAwards() {
    const d = await fetchJSON('data/awards.json');
    if (!d) return;
    const c = $('#awardsContent');
    if (!c) return;
    c.innerHTML = d.groups.map(g => `
        <div class="awards-group">
            <div class="awards-group-title">${g.label}</div>
            <div class="awards-list">${g.awards.map(a => `
                <div class="award-card">
                    <div class="award-icon">${a.icon}</div>
                    <div class="award-body">
                        <div class="award-year-title">
                            <span class="award-year">${a.year}</span>
                            <span class="award-title">${a.title}</span>
                            ${a.link ? `<a href="${a.link}" target="_blank" style="font-size:.73rem;color:var(--green-mid)"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                        <div class="award-org">${a.org}</div>
                        ${a.note ? `<div class="award-note">${a.note}</div>` : ''}
                    </div>
                </div>`).join('')}
            </div>
        </div>`).join('');
}

async function loadLeadership() {
    const d = await fetchJSON('data/leadership.json');
    if (!d) return;
    const c = $('#leadershipContent');
    if (!c) return;
    c.innerHTML = `<div class="leadership-list">${d.leadership.map(l => `
        <div class="lead-card ${l.featured ? 'featured' : ''}">
            <div class="lead-head">
                <span class="lead-role">${l.role}</span>
                <span class="lead-period">${l.period}</span>
            </div>
            <div class="lead-org">${l.org_website ? `<a href="${l.org_website}" target="_blank">${l.organization}</a>` : l.organization}</div>
            <ul class="lead-pts">${l.points.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>`).join('')}</div>`;
}

async function loadCertifications() {
    const d = await fetchJSON('data/certifications.json');
    if (!d) return;
    const c = $('#certificationsContent');
    if (!c) return;
    c.innerHTML = `<div class="cert-list">${d.certifications.map(cert => `
        <div class="cert-card">
            <div class="cert-head">
                <span class="cert-title">${cert.title}</span>
                <span class="cert-period">${cert.period}</span>
            </div>
            <div class="cert-org">${cert.org_website ? `<a href="${cert.org_website}" target="_blank">${cert.organization}</a>` : cert.organization}</div>
            <ul class="cert-pts">${cert.points.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>`).join('')}</div>`;
}

async function loadContact() {
    const d = await fetchJSON('data/profile.json');
    if (!d) return;
    const c = $('#contactContent');
    if (!c) return;
    const links = d.contact_links.map(l => `
        <a href="${l.href}" target="${l.href.startsWith('mailto')||l.href.startsWith('tel')?'_self':'_blank'}" class="contact-item">
            <div class="contact-icon"><i class="${l.icon}"></i></div>
            <div>
                <div class="contact-label">${l.label}</div>
                <div class="contact-value">${l.value}</div>
            </div>
        </a>`).join('');
    c.innerHTML = `<div class="contact-grid">${links}</div>
        <p style="font-size:.84rem;color:var(--text-muted);text-align:center;margin-top:16px">
            Open to research collaborations, PhD enquiries, and academic discussions.
        </p>`;
}

// ── Init ──────────────────────────────────────────────────
async function init() {
    document.getElementById('yr').textContent = new Date().getFullYear();
    $$('section.section').forEach(s => revealObs.observe(s));
    initMobile();
    initScrollSpy();
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            $('#sidebar')?.classList.remove('open');
            $('#mobOverlay')?.classList.remove('show');
        }
    });
    await Promise.all([
        loadAbout(), loadEducation(), loadExperience(),
        loadPublications(), loadProjects(), loadSkills(),
        loadAwards(), loadLeadership(), loadCertifications(), loadContact()
    ]);
}

document.addEventListener('DOMContentLoaded', init);
