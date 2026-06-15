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

// Parallax effect for tentacles
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const tentacles = document.querySelector('.tentacles');
    tentacles.style.transform = `translateY(${scrolled * 0.5}px)`;
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

document.querySelectorAll('.project-card, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Cursor effect
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const tentacles = document.querySelector('.tentacles');
    const moveX = (x / window.innerWidth - 0.5) * 20;
    const moveY = (y / window.innerHeight - 0.5) * 20;

    tentacles.style.transform = `translate(${moveX}px, ${moveY}px)`;
});
