/* ============================================
   INNOVIYAL — Team Page Filter & Search
   Filterable team sections + searchable student tables
   ============================================ */

const TeamFilter = (() => {
  let members = [];

  async function init() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;

    // Show skeleton while loading
    teamGrid.innerHTML = Utils.createSkeleton(6);

    try {
      const data = await API.getPeople();
      members = Array.isArray(data) ? data : (data.content || []);
    } catch {
      // Use sample data as fallback
      members = window.INNOVIYAL_TEAM_MEMBERS || getDefaultMembers();
    }

    renderTeam(members);
    initFilterButtons();
  }

  function getDefaultMembers() {
    // Use real team members from window.INNOVIYAL_TEAM_MEMBERS or return empty
    return window.INNOVIYAL_TEAM_MEMBERS || [];
  }

  function renderTeam(people) {
    const grid = document.getElementById('team-grid');
    if (!grid) return;

    if (!people.length) {
      grid.innerHTML = '<div class="empty-state">No team members found.</div>';
      return;
    }

    grid.innerHTML = people.map(person => `
      <div class="team-card" onclick="TeamFilter.openProfile(${person.id})">
        <img class="team-card-img" src="${person.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'}" 
             alt="${person.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'">
        <div class="team-card-body">
          <h4>${person.name}</h4>
          <div class="role">${person.roleTitle || 'Member'}</div>
          ${person.year ? `<span class="year-badge">${person.year}</span>` : ''}
        </div>
        <div class="team-card-overlay">
          <div>
            <h4 style="color:white">${person.name}</h4>
            <p style="color:var(--gray-300);font-size:var(--fs-sm)">${person.description || person.roleTitle || 'Association Member'}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Count categories
    updateCategoryCounts(people);
  }

  function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.team-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        filterByCategory(category);
      });
    });
  }

  function filterByCategory(category) {
    if (category === 'ALL') {
      renderTeam(members);
      return;
    }
    
    const filtered = members.filter(m => m.category === category);
    renderTeam(filtered);
  }

  function updateCategoryCounts(people) {
    document.querySelectorAll('[data-count]').forEach(el => {
      const category = el.dataset.count;
      const count = category === 'ALL' 
        ? people.length 
        : people.filter(p => p.category === category).length;
      el.textContent = count;
    });
  }

  function openProfile(id) {
    const person = members.find(m => m.id === id);
    if (!person) return;

    const modal = document.getElementById('profile-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-overlay active">
        <div class="modal">
          <div class="modal-header">
            <h3>${person.name}</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').classList.remove('active')">✕</button>
          </div>
          <div class="profile-popup">
            <img src="${person.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'}" 
                 alt="${person.name}" onerror="this.src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'">
            <h4>${person.name}</h4>
            <p class="role" style="color:var(--primary);font-weight:600">${person.roleTitle || 'Member'}</p>
            ${person.year ? `<p class="year">${person.year}</p>` : ''}
            ${person.description ? `<p style="margin-top:var(--space-4)">${person.description}</p>` : ''}
            ${person.designation ? `<p style="margin-top:var(--space-2);font-size:var(--fs-sm);color:var(--gray-500)">${person.designation}</p>` : ''}
            ${person.linkedinUrl ? `<a href="${person.linkedinUrl}" target="_blank" class="btn btn-outline btn-sm" style="margin-top:var(--space-4)">LinkedIn Profile</a>` : ''}
          </div>
        </div>
      </div>
    `;
    modal.style.display = 'block';
    
    // Close on overlay click
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('active');
      }
    });
  }

  return { init, openProfile };
})();

// --- Student Table Search/Filter/Sort ---
const StudentTable = (() => {
  function init(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const searchInput = table.querySelector('.student-search');
    const filterSelect = table.querySelector('.student-filter');
    const tbody = table.querySelector('tbody');

    if (!searchInput || !tbody) return;

    const rows = [...tbody.querySelectorAll('tr')];

    searchInput.addEventListener('input', Utils.debounce((e) => {
      const query = e.target.value.toLowerCase();
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    }, 200));

    // Sort by column click
    table.querySelectorAll('th[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        const order = th.dataset.order === 'asc' ? 'desc' : 'asc';
        th.dataset.order = order;
        
        rows.sort((a, b) => {
          const aVal = a.querySelector(`td:nth-child(${th.cellIndex + 1})`)?.textContent.trim() || '';
          const bVal = b.querySelector(`td:nth-child(${th.cellIndex + 1})`)?.textContent.trim() || '';
          return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('loadingComplete', () => {
    TeamFilter.init();
    StudentTable.init('student-table-2');
    StudentTable.init('student-table-3');
    StudentTable.init('student-table-4');
  });
});
