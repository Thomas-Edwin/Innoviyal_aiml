/* ============================================
   INNOVIYAL — Industry Partner Logo Carousel
   Infinite scrolling logo marquee
   ============================================ */

const PartnerCarousel = (() => {
  function init() {
    const carousel = document.querySelector('.partner-carousel');
    if (!carousel) return;

    const partners = window.INNOVIYAL_PARTNERS || [
      { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
      { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
      { name: 'TCS', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg' },
      { name: 'Zoho', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Zoho_Corporation_Logo.svg' },
      { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg' },
      { name: 'Cognizant', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Cognizant_logo_2020.svg' },
      { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
      { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    ];

    const track = carousel.querySelector('.partner-track');
    if (!track) return;

    // Duplicate for seamless infinite scroll
    const allPartners = [...partners, ...partners];
    track.innerHTML = allPartners.map(p => `
      <div class="partner-item" title="${p.name}">
        <img src="${p.logo}" alt="${p.name}" loading="lazy"
             onerror="this.style.display='none'">
      </div>
    `).join('');

    // Load from API
    loadFromAPI(track);
  }

  async function loadFromAPI(track) {
    try {
      const data = await API.getPartners();
      if (data && data.length > 0) {
        const partners = data.map(p => ({ name: p.name, logo: p.logoUrl }));
        const allPartners = [...partners, ...partners];
        track.innerHTML = allPartners.map(p => `
          <div class="partner-item" title="${p.name}">
            <img src="${p.logo}" alt="${p.name}" loading="lazy"
                 onerror="this.style.display='none'">
          </div>
        `).join('');
      }
    } catch {
      // Keep defaults
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('loadingComplete', () => PartnerCarousel.init());
  setTimeout(() => PartnerCarousel.init(), 3500);
});
