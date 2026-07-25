/* ============================================
   INNOVIYAL — Gallery Lightbox
   Image lightbox with zoom, download, navigation
   ============================================ */

const GalleryLightbox = (() => {
  let currentIndex = 0;
  let images = [];

  function init() {
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;

    // Category filter buttons
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterGallery(btn.dataset.category);
      });
    });

    // Load gallery items
    loadGallery();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!document.querySelector('.lightbox.active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  async function loadGallery() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    grid.innerHTML = Utils.createSkeleton(6);

    try {
      const data = await API.getGallery();
      images = Array.isArray(data) ? data : (data.content || []);
    } catch {
      // Default images
      images = [
        { id: 1, imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80', caption: 'Campus Building', category: 'CAMPUS' },
        { id: 2, imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', caption: 'Workshop Session', category: 'WORKSHOP' },
        { id: 3, imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', caption: 'Hackathon Event', category: 'HACKATHON' },
        { id: 4, imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', caption: 'Team Collaboration', category: 'INNOVIYAL' },
        { id: 5, imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', caption: 'Symposium', category: 'SYMPOSIUM' },
        { id: 6, imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', caption: 'Club Activity', category: 'CLUB_ACTIVITY' },
      ];
    }

    renderGallery(images);
  }

  function renderGallery(items) {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    if (!items.length) {
      grid.innerHTML = '<div class="empty-state">No images found in this category.</div>';
      return;
    }

    grid.innerHTML = items.map((item, index) => `
      <div class="gallery-item" onclick="GalleryLightbox.open(${index})">
        <img src="${item.imageUrl || item.thumbnailUrl}" alt="${item.caption || 'Gallery image'}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'">
        <div class="gallery-item-overlay">
          <span>${item.caption || 'View Image'}</span>
        </div>
      </div>
    `).join('');
  }

  function filterGallery(category) {
    const filtered = category === 'ALL' 
      ? images 
      : images.filter(img => img.category === category);
    renderGallery(filtered);
  }

  function open(index) {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;
    
    currentIndex = index;
    lightbox.classList.add('active');
    updateLightbox();
  }

  function updateLightbox() {
    const img = document.querySelector('.lightbox-content img');
    const caption = document.querySelector('.lightbox-caption');
    const count = document.querySelector('.lightbox-count');
    
    if (!img) return;
    
    const item = images[currentIndex];
    img.src = item.imageUrl || item.thumbnailUrl;
    img.alt = item.caption || 'Gallery image';
    img.classList.remove('zoomed');
    if (caption) caption.textContent = item.caption || '';
    if (count) count.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function navigate(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    updateLightbox();
  }

  function toggleZoom() {
    const img = document.querySelector('.lightbox-content img');
    if (!img) return;
    img.classList.toggle('zoomed');
  }

  function download() {
    const img = document.querySelector('.lightbox-content img');
    if (!img) return;
    
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `innovial-gallery-${currentIndex + 1}`;
    link.click();
  }

  function close() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) lightbox.classList.remove('active');
  }

  return { init, open, navigate, toggleZoom, download, close };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('loadingComplete', () => GalleryLightbox.init());
});
