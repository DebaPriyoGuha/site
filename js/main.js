/**
 * Main JavaScript
 * Deba Priyo Guha Portfolio
 */

(function() {
    'use strict';

    // ================================================
    // NAVIGATION & SCROLL
    // ================================================
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    /**
     * Update active navigation link based on scroll position
     */
    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /**
     * Smooth scroll to section
     */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(updateActiveNav);
    }, { passive: true });

    // ================================================
    // PROFILE IMAGE MODAL
    // ================================================
    
    const profileImage = document.getElementById('profileImage');
    const profileModal = document.getElementById('profileModal');
    const profileModalClose = document.getElementById('profileModalClose');

    if (profileImage && profileModal) {
        profileImage.addEventListener('click', () => {
            profileModal.classList.add('show');
        });

        profileModalClose?.addEventListener('click', () => {
            profileModal.classList.remove('show');
        });

        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.remove('show');
            }
        });
    }

    // ================================================
    // LOAD PUBLICATIONS FROM JSON
    // ================================================
    
    async function loadPublications() {
        const container = document.getElementById('publications-container');
        if (!container) return;

        try {
            const response = await fetch('data/publications.json');
            const data = await response.json();
            
            container.innerHTML = data.publications.map(pub => `
                <div class="publication-card" data-status="${pub.status}">
                    <div class="publication-header">
                        <span class="publication-type ${pub.status.replace(' ', '-')}">${pub.status}</span>
                        <span class="publication-role">${pub.role}</span>
                    </div>
                    <div class="publication-body">
                        <h3 class="publication-title">${pub.title}</h3>
                        <p class="publication-authors">${pub.authors}</p>
                        <p class="publication-venue">${pub.venue}</p>
                        ${pub.abstract ? `
                        <details class="publication-abstract">
                            <summary>Abstract</summary>
                            <p>${pub.abstract}</p>
                        </details>
                        ` : ''}
                        ${pub.contribution ? `
                        <p class="publication-contribution"><strong>My Contribution:</strong> ${pub.contribution}</p>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading publications:', error);
            container.innerHTML = '<p>Unable to load publications. Please refresh the page.</p>';
        }
    }

    // ================================================
    // LOAD PROJECTS FROM JSON
    // ================================================
    
    async function loadProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;

        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            
            window.projectsData = data.projects; // Store for filtering
            renderProjects(data.projects);
            initProjectFilters();
        } catch (error) {
            console.error('Error loading projects:', error);
            container.innerHTML = '<p>Unable to load projects. Please refresh the page.</p>';
        }
    }

    function renderProjects(projects) {
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = projects.map(project => `
            <div class="project-card" data-status="${project.status}" data-categories="${project.categories.join(' ')}">
                ${project.image ? `<img src="${project.image}" alt="${project.title}" class="project-image">` : ''}
                <div class="project-content">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-status ${project.status}">${project.status}</span>
                    </div>
                    <p class="project-meta">${project.organization} | ${project.date}</p>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.links.github ? `
                        <a href="${project.links.github}" target="_blank" class="project-link secondary">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                        ` : ''}
                        ${project.links.website ? `
                        <a href="${project.links.website}" target="_blank" class="project-link primary">
                            <i class="fas fa-external-link-alt"></i> Website
                        </a>
                        ` : ''}
                        ${project.links.paper ? `
                        <a href="${project.links.paper}" target="_blank" class="project-link secondary">
                            <i class="fas fa-file-alt"></i> Paper
                        </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                filterProjects(filter);
            });
        });
    }

    function filterProjects(filter) {
        if (!window.projectsData) return;
        
        let filtered;
        
        if (filter === 'all') {
            filtered = window.projectsData;
        } else if (filter === 'ongoing' || filter === 'completed') {
            filtered = window.projectsData.filter(p => p.status === filter);
        } else {
            filtered = window.projectsData.filter(p => p.categories.includes(filter));
        }
        
        renderProjects(filtered);
    }

    // ================================================
    // SCROLL REVEAL ANIMATION
    // ================================================
    
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.section, .timeline-item, .experience-card, .award-card, .leadership-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    // ================================================
    // SKILL BAR ANIMATION
    // ================================================
    
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-fill, .proficiency-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // ================================================
    // MOBILE SIDEBAR TOGGLE (if needed)
    // ================================================
    
    function initMobileMenu() {
        // For future mobile menu implementation
    }

    // ================================================
    // INITIALIZE
    // ================================================
    
    document.addEventListener('DOMContentLoaded', () => {
        loadPublications();
        loadProjects();
        initScrollReveal();
        initSkillBars();
        initMobileMenu();
        updateActiveNav();
        
        console.log('🚀 Portfolio initialized - Deba Priyo Guha');
    });

    // ================================================
    // KEYBOARD SHORTCUTS
    // ================================================
    
    document.addEventListener('keydown', (e) => {
        // ESC to close modals
        if (e.key === 'Escape') {
            document.getElementById('profileModal')?.classList.remove('show');
        }
        
        // G to open game (for testing)
        if (e.key === 'g' && e.ctrlKey) {
            e.preventDefault();
            window.gameManager?.show();
        }
    });

})();
