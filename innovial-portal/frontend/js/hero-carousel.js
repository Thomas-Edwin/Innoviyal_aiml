/* ============================================
   INNOVIYAL — Hero Carousel
   Full-screen rotating video/image background
   VIT.ac.in-inspired crossfade with video fallback
   ============================================ */

const HeroCarousel = (() => {
  let currentSlide = 0;
  let slides = [];
  let interval = null;
  const TRANSITION_INTERVAL = 6000;

  function init() {
    const container = document.querySelector('.hero-slides');
    if (!container) return;

    // Use provided slides or defaults
    slides = window.INNOVIYAL_HERO_SLIDES || [
      { type: 'image', src: 'assets/hero/MCET01.jpg.jpeg' },
      { type: 'image', src: 'assets/hero/MCET02.jpg.jpeg' },
      { type: 'image', src: 'assets/hero/IMG_20260724_144448.jpg.jpeg' },
    ];

    slides.forEach((slide, index) => {
      const div = document.createElement('div');
      div.className = `hero-slide${index === 0 ? ' active' : ''}`;
      
      if (slide.type === 'video') {
        const video = document.createElement('video');
        video.src = slide.src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = index === 0;
        video.preload = 'metadata';
        
        // Video fallback: if video fails to load, show fallback image
        video.onerror = () => {
          const img = document.createElement('img');
          img.src = slide.fallback || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80';
          img.alt = 'Hero background';
          div.innerHTML = '';
          div.appendChild(img);
        };
        
        div.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = slide.src;
        img.alt = 'Hero background';
        img.loading = index === 0 ? 'eager' : 'lazy';
        div.appendChild(img);
      }
      
      container.appendChild(div);
    });

    // Start preloading next slides
    preloadNext();

    // Start carousel
    startAutoplay();

    // Build navigation dots
    buildNav();

    // Create event for manual control
    const navDots = document.querySelectorAll('.hero-nav-dot');
    navDots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });
  }

  function preloadNext() {
    slides.forEach((slide, i) => {
      if (i > 0 && slide.type === 'image') {
        const img = new Image();
        img.src = slide.src;
      }
    });
  }

  function goToSlide(index) {
    if (index === currentSlide) return;
    
    const allSlides = document.querySelectorAll('.hero-slide');
    const navDots = document.querySelectorAll('.hero-nav-dot');
    
    allSlides.forEach(s => s.classList.remove('active'));
    navDots.forEach(d => d.classList.remove('active'));
    
    allSlides[index].classList.add('active');
    navDots[index].classList.add('active');
    
    // Handle video play/pause
    const currentVideo = allSlides[currentSlide].querySelector('video');
    if (currentVideo) currentVideo.pause();
    
    const nextVideo = allSlides[index].querySelector('video');
    if (nextVideo) nextVideo.play().catch(() => {});
    
    currentSlide = index;
    resetAutoplay();
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startAutoplay() {
    if (interval) clearInterval(interval);
    interval = setInterval(nextSlide, TRANSITION_INTERVAL);
  }

  function resetAutoplay() {
    if (interval) clearInterval(interval);
    startAutoplay();
  }

  function buildNav() {
    const nav = document.querySelector('.hero-nav');
    if (!nav) return;
    
    nav.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `hero-nav-dot${index === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      nav.appendChild(dot);
    });
  }

  function destroy() {
    if (interval) clearInterval(interval);
  }

  return { init, goToSlide, destroy };
})();

// Auto-init hero carousel
document.addEventListener('DOMContentLoaded', () => {
  // Wait for loading screen
  document.addEventListener('loadingComplete', () => {
    HeroCarousel.init();
  });
  
  // Fallback: init after 3 seconds even if loading doesn't fire
  setTimeout(() => HeroCarousel.init(), 3000);
});
