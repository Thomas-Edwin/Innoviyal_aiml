/* ============================================
   INNOVIYAL — Glass Card Animations
   Intersection Observer for staggered entrance effects
   ============================================ */

const GlassCardAnimations = (() => {
  let initialized = false;
  function init() {
    if (initialized) return;
    initialized = true;
    // Animate glass cards on scroll
    const cards = document.querySelectorAll('.glass-card, .team-card, .event-card, .achievement-card, .stat-card, .premium-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s`;
      observer.observe(card);
    });

    // Stagger children animation
    const staggerContainers = document.querySelectorAll('.stagger-children');
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    staggerContainers.forEach(container => staggerObserver.observe(container));

    // Single scroll-in animations
    const scrollElements = document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right');
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    scrollElements.forEach(el => scrollObserver.observe(el));
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  function startAnimations() { GlassCardAnimations.init(); }
  document.addEventListener('loadingComplete', startAnimations);
  // Fallback: init after a short delay if loading screen never fires
  setTimeout(startAnimations, 500);
});
