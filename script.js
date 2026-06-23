// Random opacity for background sigils
document.querySelectorAll('.sigil-background').forEach((sigil) => {
    sigil.style.opacity = 0.025 + Math.random() * 0.025;
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .skill-category, .writings-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Skill categories: show 4 items, modal for the rest
const SKILL_PREVIEW_LIMIT = 4;
const skillModal = document.getElementById('skill-modal');
const skillModalTitle = document.getElementById('skill-modal-title');
const skillModalList = document.getElementById('skill-modal-list');
let skillModalTrigger = null;

function initSkillPreviews() {
    document.querySelectorAll('.skills-grid .skill-category').forEach((category) => {
        const items = category.querySelectorAll('ul li');
        const witnessBtn = category.querySelector('.skill-witness-more');

        if (items.length <= SKILL_PREVIEW_LIMIT) return;

        items.forEach((item, index) => {
            if (index >= SKILL_PREVIEW_LIMIT) {
                item.classList.add('skill-item-hidden');
            }
        });

        if (witnessBtn) {
            witnessBtn.hidden = false;
            witnessBtn.addEventListener('click', () => openSkillModal(category, witnessBtn));
        }
    });
}

function openSkillModal(category, trigger) {
    if (!skillModal || !skillModalTitle || !skillModalList) return;

    const title = category.querySelector('h3')?.textContent ?? 'Technologies';
    const items = category.querySelectorAll('ul li');

    skillModalTitle.textContent = title;
    skillModalList.replaceChildren();

    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.textContent;
        skillModalList.appendChild(li);
    });

    skillModal.hidden = false;
    skillModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    skillModalTrigger = trigger;
    skillModal.querySelector('.skill-modal-close')?.focus();
}

function closeSkillModal() {
    if (!skillModal) return;

    skillModal.hidden = true;
    skillModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    skillModalTrigger?.focus();
    skillModalTrigger = null;
}

if (skillModal) {
    skillModal.querySelectorAll('[data-skill-modal-close]').forEach((el) => {
        el.addEventListener('click', closeSkillModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !skillModal.hidden) {
            closeSkillModal();
        }
    });
}

initSkillPreviews();

// Mobile nav: full menu at top, single active section when scrolled
(function initMobileNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    const sections = navLinks
        .map((link) => {
            const id = link.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            return el ? { id, el, li: link.parentElement } : null;
        })
        .filter(Boolean);

    function updateNav() {
        if (!mobileQuery.matches) {
            nav.classList.remove('nav-collapsed');
            sections.forEach(({ li }) => li.classList.remove('nav-active'));
            return;
        }

        const marker = window.scrollY + nav.offsetHeight + 20;
        let activeId = 'home';

        for (const { id, el } of sections) {
            if (el.offsetTop <= marker) {
                activeId = id;
            }
        }

        const isHome = activeId === 'home';
        nav.classList.toggle('nav-collapsed', !isHome);

        sections.forEach(({ id, li }) => {
            li.classList.toggle('nav-active', id === activeId);
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                updateNav();
                ticking = false;
            });
        }
    }, { passive: true });

    mobileQuery.addEventListener('change', updateNav);
    updateNav();
})();

(function initBackToTop() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.textContent = '↑';
    document.body.appendChild(button);

    const showAfter = 400;

    function updateVisibility() {
        button.classList.toggle('is-visible', window.scrollY > showAfter);
    }

    button.addEventListener('click', () => {
        const home = document.getElementById('home');
        if (home) {
            home.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                updateVisibility();
                ticking = false;
            });
        }
    }, { passive: true });

    updateVisibility();
})();
