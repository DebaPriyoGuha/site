'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

async function fetchJSON(path) {
    try {
        const r = await fetch(path);
        if (!r.ok) throw new Error(r.status);
        return r.json();
    } catch (e) {
        console.error('fetchJSON failed:', path, e);
        return null;
    }
}

/* ── Sidebar highlight ── */
function initNavSpy() {
    const sections = $$('section[id]');
    const links    = $$('.nl');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = links.find(l => l.dataset.s === e.target.id);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => obs.observe(s));
}

/* ── Scroll reveal ── */
function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.06 });
    $$('.fade-in').forEach(el => obs.observe(el));
}

/* ── Mobile sidebar ── */
function initMobile() {
    const sb      = $('#sidebar');
    const toggle  = $('#mobToggle');
    const overlay = $('#mobOverlay');

    function open()  { sb.classList.add('open');    overlay.classList.add('active'); }
    function close() { sb.classList.remove('open'); overlay.classList.remove('active'); }

    if (toggle)  toggle.addEventListener('click', open);
    if (overlay) overlay.addEventListener('click', close);
    $$('.nl').forEach(l => l.addEventListener('click', close));
}

/* ── Footer year ── */
function setYear() {
    const el = $('#yr');
    if (el) el.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────
   SECTION LOADERS
────────────────────────────────────── */

/* ABOUT */
async function loadAbout() {
    const d = await fetchJSON('data/profile.json');
    if (!d) return;

    /* sidebar */
    const sbName = $('#sbName');
    if (sbName) sbName.textContent = d.name;
    const sbRole = $('#sbRole');
    if (sbRole) sbRole.textContent = d.tagline;
    const sbLoc  = $('#sbLoc');
    if (sbLoc)  sbLoc.textContent  = d.location;

    /* summary paragraphs */
    const sumHtml = (d.summary || []).map(p => `<p>${p}</p>`).join('');

    /* research interests */
    const ri = d.research_interests || {};
    const primHtml = (ri.primary  || []).map(i => `<li>${i}</li>`).join('');
    const specHtml = (ri.specific || []).map(i => `<li>${i}</li>`).join('');

    /* languages */
    const langHtml = (d.languages || []).map(l => `
        <div class="lang-tag">
            ${l.name}
            <span class="lang-lv">${l.level}</span>
            ${l.test ? `<span style="font-size:.7rem;color:var(--muted)">${l.test}: ${l.scores.overall}</span>` : ''}
        </div>
    `).join('');

    /* hobbies */
    const hobbyHtml = (d.interests || []).map(h => `
        <div class="hobby-tag"><i class="${h.icon}"></i>${h.name}</div>
    `).join('');

    $('#aboutContent').innerHTML = `
        <div class="about-summary">${sumHtml}</div>
        <div class="ri-grid">
            <div class="ri-box">
                <h3><i class="fas fa-star" style="color:var(--sky);margin-right:6px;font-size:.8em"></i>Primary Interests</h3>
                <ul>${primHtml}</ul>
            </div>
            <div class="ri-box">
                <h3><i class="fas fa-microscope" style="color:var(--sky);margin-right:6px;font-size:.8em"></i>Specific Topics</h3>
                <ul>${specHtml}</ul>
            </div>
        </div>
        <h3 style="font-family:'Crimson Pro',Georgia,serif;font-size:1rem;color:var(--navy);margin-bottom:10px">Languages</h3>
        <div class="lang-row">${langHtml}</div>
        <h3 style="font-family:'Crimson Pro',Georgia,serif;font-size:1rem;color:var(--navy);margin-bottom:10px">Interests &amp; Hobbies</h3>
        <div class="hobby-row">${hobbyHtml}</div>
    `;
}

/* EDUCATION */
async function loadEducation() {
    const data = await fetchJSON('data/education.json');
    if (!data) return;
    const list = Array.isArray(data) ? data : data.education || [];

    const html = list.map(e => {
        const cwHtml = (e.coursework || []).map(c => `<span class="tag">${c}</span>`).join('');
        const cwBlock = cwHtml ? `<div class="edu-cw">${cwHtml}</div>` : '';
        return `
        <div class="edu-card${e.highlight ? ' highlight' : ''}">
            <div class="edu-head">
                <div class="edu-inst">
                    <h3>${e.website ? `<a href="${e.website}" target="_blank">${e.institution}</a>` : e.institution}</h3>
                    <div class="deg">${e.degree}</div>
                    ${e.department ? `<div class="dept">${e.department}</div>` : ''}
                </div>
                <div class="edu-period">${e.period}</div>
            </div>
            ${cwBlock ? `<div class="edu-body">${cwBlock}</div>` : ''}
        </div>`;
    }).join('');

    $('#educationContent').innerHTML = `<div class="edu-list">${html}</div>`;
}

/* EXPERIENCE */
async function loadExperience() {
    const data = await fetchJSON('data/experience.json');
    if (!data) return;
    const list = Array.isArray(data) ? data : data.experience || [];

    const html = list.map(e => {
        const respHtml = (e.responsibilities || []).map(r => `<li>${r}</li>`).join('');
        const tagsHtml = (e.technologies  || []).map(t => `<span class="exp-tag">${t}</span>`).join('');
        return `
        <div class="exp-card">
            <div class="exp-head">
                <div class="exp-info">
                    <div class="exp-title">${e.title || e.position}</div>
                    <div class="exp-org">${e.organization || e.company}${e.location ? ' · ' + e.location : ''}</div>
                </div>
                <div class="exp-period">${e.period}</div>
            </div>
            <div class="exp-body">
                ${respHtml ? `<ul>${respHtml}</ul>` : ''}
                ${tagsHtml ? `<div class="exp-tags">${tagsHtml}</div>` : ''}
            </div>
        </div>`;
    }).join('');

    $('#experienceContent').innerHTML = `<div class="exp-list">${html}</div>`;
}

/* PUBLICATIONS */
async function loadPublications() {
    const data = await fetchJSON('data/publications.json');
    if (!data) return;
    const groups = data.groups || [];

    let counter = 0;

    const html = groups.map(g => {
        const pubs = g.publications || [];
        if (!pubs.length) return '';

        const pubsHtml = pubs.map(p => {
            counter++;
            const n = counter;
            const status = p.status || g.id;
            const authors = (p.authors || '').replace(
                /Guha,?\s*(D\.?\s*P\.?|Deba?\s*Priyo?)/gi,
                '<span class="me">$&</span>'
            );
            const links = [
                p.doi   ? `<a href="${p.doi}"   target="_blank" class="pub-link"><i class="fas fa-link"></i> DOI</a>`   : '',
                p.arxiv ? `<a href="https://arxiv.org/abs/${p.arxiv}" target="_blank" class="pub-link"><i class="fas fa-external-link-alt"></i> arXiv</a>` : '',
                p.pdf   ? `<a href="${p.pdf}"   target="_blank" class="pub-link"><i class="fas fa-file-pdf"></i> PDF</a>`  : ''
            ].filter(Boolean).join('');
            return `
            <div class="pub-card">
                <div class="pub-num">${n}</div>
                <div class="pub-body">
                    <div class="pub-title">${p.title}</div>
                    ${authors ? `<div class="pub-authors">${authors}</div>` : ''}
                    ${p.venue  ? `<div class="pub-venue">${p.venue}</div>` : ''}
                    <div class="pub-meta">
                        <span class="pub-status ${status}">${p.status_label || status}</span>
                        ${links}
                    </div>
                </div>
            </div>`;
        }).join('');

        return `
        <div class="pub-group">
            <div class="pub-group-hd">
                <i class="${g.icon || 'fas fa-book'}"></i>
                ${g.label}
                <span class="pub-count">${pubs.length}</span>
            </div>
            <div class="pub-list">${pubsHtml}</div>
        </div>`;
    }).join('');

    $('#publicationsContent').innerHTML = html || '<p style="color:var(--muted)">No publications listed yet.</p>';
}

/* PROJECTS */
async function loadProjects() {
    const data = await fetchJSON('data/projects.json');
    if (!data) return;
    const list = Array.isArray(data) ? data : data.projects || [];

    const html = list.map(p => {
        const cats = [].concat(p.category || []);
        const catAttr = cats.join(' ');
        const st = (p.status || 'completed').toLowerCase();
        const tagsHtml = (p.technologies || p.tags || []).map(t => `<span class="proj-tag">${t}</span>`).join('');
        const linksHtml = [
            p.github ? `<a href="${p.github}" target="_blank" class="proj-link"><i class="fab fa-github"></i> Code</a>` : '',
            p.demo   ? `<a href="${p.demo}"   target="_blank" class="proj-link"><i class="fas fa-external-link-alt"></i> Demo</a>` : '',
            p.paper  ? `<a href="${p.paper}"  target="_blank" class="proj-link"><i class="fas fa-scroll"></i> Paper</a>` : ''
        ].filter(Boolean).join('');
        return `
        <div class="proj-card" data-cat="${catAttr}" data-status="${st}">
            <div class="proj-head">
                <div class="proj-icon"><i class="${p.icon || 'fas fa-flask'}"></i></div>
                <div class="proj-info">
                    <div class="proj-name">${p.name}</div>
                    <span class="proj-status ${st}">${st.charAt(0).toUpperCase()+st.slice(1)}</span>
                </div>
            </div>
            <div class="proj-desc">${p.description || ''}</div>
            ${tagsHtml ? `<div class="proj-tags">${tagsHtml}</div>` : ''}
            ${linksHtml ? `<div class="proj-links">${linksHtml}</div>` : ''}
        </div>`;
    }).join('');

    $('#projectsContent').innerHTML = `<div class="proj-grid">${html}</div>`;
    initProjectFilter();
}

function initProjectFilter() {
    $$('.fb').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.fb').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const f = btn.dataset.f;
            $$('.proj-card').forEach(card => {
                if (f === 'all') { card.classList.remove('hidden'); return; }
                const cats   = card.dataset.cat.split(' ');
                const status = card.dataset.status;
                const match  = cats.includes(f) || status === f;
                card.classList.toggle('hidden', !match);
            });
        });
    });
}

/* SKILLS */
async function loadSkills() {
    const data = await fetchJSON('data/skills.json');
    if (!data) return;
    const categories = Array.isArray(data) ? data : data.categories || data.skills || [];

    const html = categories.map(cat => {
        const items = Array.isArray(cat.items) ? cat.items : [];
        const tagsHtml = items.map(i => `<span class="skill-tag">${i}</span>`).join('');
        return `
        <div class="skill-cat">
            <h3><i class="${cat.icon || 'fas fa-code'}"></i>${cat.category || cat.name}</h3>
            <div class="skill-tags">${tagsHtml}</div>
        </div>`;
    }).join('');

    $('#skillsContent').innerHTML = `<div class="skill-grid">${html}</div>`;
}

/* AWARDS */
async function loadAwards() {
    const data = await fetchJSON('data/awards.json');
    if (!data) return;
    const list = Array.isArray(data) ? data : data.awards || [];

    const html = list.map(a => `
        <div class="award-card">
            <div class="award-icon"><i class="${a.icon || 'fas fa-trophy'}"></i></div>
            <div class="award-body">
                <div class="award-title">${a.title}</div>
                ${a.organization ? `<div class="award-sub">${a.organization}</div>` : ''}
                ${a.description  ? `<div class="award-sub" style="margin-top:3px">${a.description}</div>` : ''}
                ${a.year         ? `<div class="award-year">${a.year}</div>` : ''}
            </div>
        </div>`).join('');

    $('#awardsContent').innerHTML = `<div class="award-list">${html}</div>`;
}

/* LEADERSHIP */
async function loadLeadership() {
    const data = await fetchJSON('data/leadership.json');
    if (!data) return;
    const list = Array.isArray(data) ? data : data.leadership || [];

    const html = list.map(l => `
        <div class="lead-card">
            <div class="lead-icon"><i class="${l.icon || 'fas fa-users'}"></i></div>
            <div class="lead-body">
                <div class="lead-role">${l.role || l.title}</div>
                <div class="lead-org">${l.organization}</div>
                <div class="lead-meta">
                    <span class="lead-period">${l.period}</span>
                </div>
                ${l.description ? `<div class="lead-desc">${l.description}</div>` : ''}
            </div>
        </div>`).join('');

    $('#leadershipContent').innerHTML = `<div class="lead-list">${html}</div>`;
}

/* CERTIFICATIONS */
async function loadCertifications() {
    const data = await fetchJSON('data/certifications.json');
    if (!data) return;
    const list = Array.isArray(data) ? data : data.certifications || [];

    const html = list.map(c => `
        <div class="cert-card">
            <div class="cert-icon"><i class="${c.icon || 'fas fa-certificate'}"></i></div>
            <div class="cert-body">
                <div class="cert-title">${c.title || c.name}</div>
                <div class="cert-org">${c.issuer || c.organization || ''}</div>
                ${c.date || c.period ? `<div class="cert-period">${c.date || c.period}</div>` : ''}
            </div>
        </div>`).join('');

    $('#certificationsContent').innerHTML = `<div class="cert-list">${html}</div>`;
}

/* CONTACT */
async function loadContact() {
    const d = await fetchJSON('data/profile.json');
    if (!d) return;
    const links = d.contact_links || [];

    const html = links.map(l => `
        <div class="contact-item">
            <div class="contact-icon"><i class="${l.icon}"></i></div>
            <div class="contact-txt">
                <div class="contact-label">${l.label}</div>
                <div class="contact-val">
                    ${l.href ? `<a href="${l.href}" target="${l.href.startsWith('mailto') || l.href.startsWith('tel') ? '_self' : '_blank'}">${l.value}</a>` : l.value}
                </div>
            </div>
        </div>`).join('');

    $('#contactContent').innerHTML = `<div class="contact-grid">${html}</div>`;
}

/* ── INIT ── */
async function init() {
    setYear();
    initMobile();
    initReveal();
    initNavSpy();

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

    /* re-trigger reveal for newly rendered sections */
    initReveal();
}

document.addEventListener('DOMContentLoaded', init);
