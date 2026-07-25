/* ============================================
   INNOVIYAL — Announcement Ticker
   Moving announcement bar with pause on hover
   ============================================ */

const AnnouncementTicker = (() => {
  let isPaused = false;

  function init() {
    const ticker = document.querySelector('.announcement-ticker');
    if (!ticker) return;

    const announcements = window.INNOVIYAL_ANNOUNCEMENTS || [
      '🎓 Symposium Registration Open — March 15-16, 2026',
      '💻 Hackathon 2026 Registrations Live — Register Now!',
      '🤖 Workshop on Generative AI — March 10, 2026',
      '🏆 AIML Project Expo — Submit Your Projects',
      '📢 Industrial Visit to TCS — Limited Seats Available',
    ];

    const track = ticker.querySelector('.ticker-track');
    if (!track) return;

    // Build announcement items with duplicates for seamless loop
    const items = [...announcements, ...announcements];
    track.innerHTML = items.map(text => `<span class="ticker-item">${text}</span>`).join('');

    // Pause on hover
    ticker.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });

    ticker.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });

    // Click to open details
    ticker.addEventListener('click', () => {
      const eventsSection = document.querySelector('#events');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Load from API if available
    loadFromAPI(track);
  }

  async function loadFromAPI(track) {
    try {
      const data = await API.getAnnouncements();
      if (data && data.length > 0) {
        const announcements = data.map(a => a.title);
        const items = [...announcements, ...announcements];
        track.innerHTML = items.map(text => `<span class="ticker-item">${text}</span>`).join('');
      }
    } catch {
      // Use defaults on error — already set
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => AnnouncementTicker.init(), 3500);
});
