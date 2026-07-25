/* ============================================
   INNOVIYAL — Loading Screen Controller
   Animated intro sequence with logo, typing, progress
   ============================================ */

const LoadingScreen = (() => {
  const TAGLINE = 'Innovating the Future with AI';
  let isDone = false;

  function init() {
    const screen = document.getElementById('loading-screen');
    if (!screen) return;

    const taglineEl = screen.querySelector('.loading-tagline');
    const progressBar = screen.querySelector('.loading-progress-bar');
    const progressText = screen.querySelector('.loading-progress-text');

    // Generate particles
    const particlesContainer = screen.querySelector('.loading-particles');
    if (particlesContainer) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'loading-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '0';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (2 + Math.random() * 3) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
      }
    }

    // Typing effect
    let charIndex = 0;
    function typeChar() {
      if (charIndex < TAGLINE.length) {
        taglineEl.textContent = TAGLINE.substring(0, charIndex + 1);
        charIndex++;
        const delay = TAGLINE[charIndex - 1] === ' ' ? 80 : 60;
        setTimeout(typeChar, delay);
      } else {
        taglineEl.classList.add('typing-done');
        startProgress();
      }
    }

    // Progress bar
    function startProgress() {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = progress + '%';
        if (progressText) {
          progressText.textContent = Math.round(progress) + '%';
        }

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(hide, 400);
        }
      }, 150);
    }

    function hide() {
      if (isDone) return;
      isDone = true;
      screen.classList.add('hidden');
      document.body.style.overflow = '';
      
      // Dispatch event for other scripts
      document.dispatchEvent(new Event('loadingComplete'));
      
      // Enable scroll animations now
      if (window.ScrollAnimations) {
        window.ScrollAnimations.init();
      }
    }

    // Start typing after a brief pause
    setTimeout(typeChar, 500);
    
    // Safety: hide after max 5 seconds
    setTimeout(hide, 5000);
  }

  return { init };
})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  LoadingScreen.init();
});
