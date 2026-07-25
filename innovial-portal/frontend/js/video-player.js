/* ============================================
   INNOVIYAL — Video Gallery Player
   In-site video player (no YouTube redirect)
   ============================================ */

const VideoPlayer = (() => {
  let videos = [];
  let currentVideo = null;

  function init() {
    const gallery = document.querySelector('.video-gallery');
    if (!gallery) return;

    const filterBtns = document.querySelectorAll('.video-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterVideos(btn.dataset.category);
      });
    });

    loadVideos();
  }

  async function loadVideos() {
    const grid = document.querySelector('.video-grid');
    if (!grid) return;
    grid.innerHTML = Utils.createSkeleton(4);

    try {
      const data = await API.getVideos();
      videos = Array.isArray(data) ? data : (data.content || []);
    } catch {
      videos = [
        { id: 1, title: 'Innoviyal Symposium 2025', description: 'Highlights from the annual symposium', thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', category: 'SYMPOSIUM' },
        { id: 2, title: 'AI Workshop Series', description: 'Hands-on workshop on Machine Learning', thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', category: 'WORKSHOP' },
        { id: 3, title: 'Hackathon 2025 Highlights', description: '24-hour coding challenge', thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', category: 'HACKATHON' },
      ];
    }
    renderVideos(videos);
  }

  function renderVideos(items) {
    const grid = document.querySelector('.video-grid');
    if (!grid) return;
    if (!items.length) { grid.innerHTML = '<div class="empty-state">No videos found.</div>'; return; }
    grid.innerHTML = items.map((video, index) => `
      <div class="video-card" onclick="VideoPlayer.open(${index})">
        <div class="video-thumb">
          <img src="${video.thumbnailUrl}" alt="${video.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80'">
          <div class="video-play-btn"><span>▶</span></div>
          <span class="video-duration">${video.duration || '5:00'}</span>
        </div>
        <div class="video-info"><h4>${video.title}</h4><p>${video.description || ''}</p></div>
      </div>
    `).join('');
  }

  function filterVideos(category) {
    const filtered = category === 'ALL' ? videos : videos.filter(v => v.category === category);
    renderVideos(filtered);
  }

  function open(index) {
    const video = videos[index];
    if (!video) return;
    currentVideo = video;
    const player = document.getElementById('video-player');
    if (!player) return;
    const videoEl = player.querySelector('video');
    if (videoEl) { videoEl.src = video.videoUrl; videoEl.play().catch(() => {}); }
    player.querySelector('.video-player-title').textContent = video.title;
    player.querySelector('.video-player-desc').textContent = video.description || '';
    player.classList.add('active');
  }

  function close() {
    const player = document.getElementById('video-player');
    if (!player) return;
    const videoEl = player.querySelector('video');
    if (videoEl) { videoEl.pause(); videoEl.src = ''; }
    player.classList.remove('active');
  }

  return { init, open, close };
})();

// Expose to window for HTML onclick handlers
window.VideoPlayer = VideoPlayer;

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('loadingComplete', () => VideoPlayer.init());
});
