/* ============================================
   INNOVIYAL — Testimonials Carousel
   Auto-rotating testimonials with category filters
   ============================================ */

const TestimonialCarousel = (() => {
  let testimonials = [];
  let currentSlide = 0;
  let interval = null;
  let isPaused = false;

  function init() {
    const container = document.querySelector('.testimonials-carousel');
    if (!container) return;

    loadTestimonials();

    // Pause on hover
    container.addEventListener('mouseenter', () => { isPaused = true; });
    container.addEventListener('mouseleave', () => { isPaused = false; });

    // Arrow navigation
    container.querySelector('.testimonial-prev')?.addEventListener('click', () => {
      navigate(-1);
      resetAutoplay();
    });
    container.querySelector('.testimonial-next')?.addEventListener('click', () => {
      navigate(1);
      resetAutoplay();
    });
  }

  async function loadTestimonials() {
    try {
      const data = await API.getTestimonials({ params: { is_active: true } });
      testimonials = Array.isArray(data) ? data : (data.content || []);
    } catch {
      // Default testimonials
      testimonials = [
        { id: 1, name: 'Dr. S. Rajesh', role: 'Principal, MCET', quote: 'The AIML department has consistently produced outstanding engineers who excel in both academics and innovation.', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', category: 'FACULTY' },
        { id: 2, name: 'Priya Karthik', role: 'Final Year Student', quote: 'Being part of Innoviyal has been a transformative experience. The workshops, hackathons, and industry exposure are incredible.', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', category: 'STUDENT' },
        { id: 3, name: 'Rahul Sharma', role: 'Alumni, Software Engineer at Google', quote: 'The foundation I received at MCET\'s AIML department prepared me for the challenges of the tech industry.', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', category: 'ALUMNI' },
        { id: 4, name: 'Mr. Arun Prakash', role: 'Director, TCS Chennai', quote: 'MCET students demonstrate exceptional problem-solving skills and a strong grasp of AI/ML concepts.', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', category: 'RECRUITER' },
      ];
    }

    renderTestimonials();
    startAutoplay();
  }

  function renderTestimonials() {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelector('.testimonial-dots');
    if (!track) return;

    if (!testimonials.length) {
      track.innerHTML = '<div class="empty-state">No testimonials available.</div>';
      return;
    }

    track.innerHTML = testimonials.map((t, i) => `
      <div class="testimonial-slide${i === 0 ? ' active' : ''}">
        <div class="testimonial-content">
          <div class="testimonial-quote">"</div>
          <p class="testimonial-text">${t.quote}</p>
          <div class="testimonial-author">
            <img src="${t.photoUrl}" alt="${t.name}" 
                 onerror="this.src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80'">
            <div>
              <h4>${t.name}</h4>
              <span>${t.role}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Dots
    if (dots && testimonials.length > 1) {
      dots.innerHTML = testimonials.map((_, i) => `
        <button class="testimonial-dot${i === 0 ? ' active' : ''}" 
                onclick="TestimonialCarousel.goTo(${i})"
                aria-label="Go to testimonial ${i + 1}"></button>
      `).join('');
    }
  }

  function goTo(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    slides[index]?.classList.add('active');
    dots[index]?.classList.add('active');
    currentSlide = index;
  }

  function navigate(direction) {
    currentSlide = (currentSlide + direction + testimonials.length) % testimonials.length;
    goTo(currentSlide);
  }

  function startAutoplay() {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (!isPaused) navigate(1);
    }, 5000);
  }

  function resetAutoplay() {
    if (interval) clearInterval(interval);
    startAutoplay();
  }

  function filterByCategory(category) {
    // For future use with category filter buttons
  }

  return { init, goTo, navigate };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('loadingComplete', () => TestimonialCarousel.init());
  setTimeout(() => TestimonialCarousel.init(), 3500);
});
