/* ============================================
   INNOVIYAL — Main Homepage Interactions
   Back to top, scroll spy, page view tracking, smooth scroll
   ============================================ */

const Main = (() => {
  /* --- Back to Top Button --- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Scroll Spy (active nav link) --- */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.aiml-navbar-link');
    
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  function init() {
    // Note: Navbar scroll effect & mobile menu are handled by inline scripts on each page.
    // We only initialize features that don't conflict with those inline scripts.
    initBackToTop();
    initScrollSpy();
  }

  return { init };
})();

/* --- Page View Tracking --- */
document.addEventListener('DOMContentLoaded', () => {
  const pageName = window.location.pathname.replace(/\/|\.[^.]+$/g, '-').replace(/^-|-$/g, '') || 'home';
  // Use same API base URL logic as api.js
  const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080/api'
    : 'https://innovial-backend.up.railway.app/api';
  // Silently tracks page view (fails gracefully if backend not available)
  fetch(apiBase + '/page-view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: pageName })
  }).catch(() => {});
});

/* --- Smooth Scroll for Anchor Links --- */
document.addEventListener('DOMContentLoaded', () => {
  // Run Main.init on loading complete (if loading screen exists) or immediately
  function startMain() { Main.init(); }
  document.addEventListener('loadingComplete', startMain);
  // Fallback: also try to init after a short delay (handles pages without loading screen)
  setTimeout(startMain, 1000);
  
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
