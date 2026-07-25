/* ============================================
   INNOVIYAL — Scroll-Triggered Counter Animation
   Animated stats counters (students, faculty, events, etc.)
   ============================================ */

const CounterAnimation = (() => {
  let animated = false;

  function init() {
    const counters = document.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters(counters);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(counters[0].closest('.stats-section') || counters[0].parentElement);
  }

  function animateCounters(counters) {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target) || 0;
      const duration = parseInt(counter.dataset.duration) || 2000;
      const suffix = counter.dataset.suffix || '+';
      const prefix = counter.dataset.prefix || '';
      
      let startTime = null;
      
      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = Math.floor(easedProgress * target);
        
        counter.textContent = prefix + current.toLocaleString() + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.textContent = prefix + target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(animate);
    });
  }

  function reset() {
    animated = false;
  }

  return { init, reset };
})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('loadingComplete', () => CounterAnimation.init());
  setTimeout(() => CounterAnimation.init(), 3500);
});
