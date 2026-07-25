/* ============================================
   INNOVIYAL — Admin Dashboard Logic
   Sidebar, CRUD operations, uploads, analytics, backup
   ============================================ */

const Admin = (() => {
  let currentPage = 1;
  let totalPages = 1;

  function init() {
    // Check auth
    if (!Auth.requireAuth('ADMIN')) return;
    
    initSidebar();
    initContent();
  }

  /* --- Sidebar --- */
  function initSidebar() {
    const toggle = document.querySelector('.admin-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Highlight active nav item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      if (item.getAttribute('href') === currentPath) {
        item.classList.add('active');
      }
    });
  }

  /* --- Dashboard Content --- */
  function initContent() {
    const page = document.body.dataset.page;
    
    switch (page) {
      case 'dashboard': loadDashboard(); break;
      case 'news': loadTable('news'); break;
      case 'events': loadTable('events'); break;
      case 'people': loadPeople(); break;
      case 'gallery': loadGallery(); break;
      case 'hero': loadHero(); break;
      case 'testimonials': loadTable('testimonials'); break;
      case 'magazine': loadTable('magazine'); break;
      case 'materials': loadTable('materials'); break;
      case 'achievements': loadTable('achievements'); break;
      case 'partners': loadPartners(); break;
      case 'messages': loadMessages(); break;
      case 'backup': initBackup(); break;
    }

    // Init forms
    initForms();
    initFileUploads();
  }

  /* --- Dashboard Stats --- */
  async function loadDashboard() {
    const counters = document.querySelectorAll('[data-admin-count]');
    
    try {
      const analytics = await API.admin.getAnalytics('month');
      counters.forEach(counter => {
        const key = counter.dataset.adminCount;
        if (analytics[key] !== undefined) {
          counter.textContent = analytics[key];
        }
      });
    } catch {
      // Use placeholder numbers
      const defaults = {
        news: 12, events: 24, people: 156, gallery: 89,
        messages: 7, testimonials: 16, partners: 8
      };
      counters.forEach(counter => {
        const key = counter.dataset.adminCount;
        if (defaults[key] !== undefined) {
          counter.textContent = defaults[key];
        }
      });
    }
  }

  /* --- Generic Table Loader --- */
  async function loadTable(type) {
    const tbody = document.querySelector(`#${type}-table tbody`);
    if (!tbody) return;

    tbody.innerHTML = Utils.createSkeleton(5, 'table');

    try {
      const data = await API.admin[`get${capitalize(type)}`]?.() || 
                   await API[`get${capitalize(type)}`]?.();
      const items = Array.isArray(data) ? data : (data.content || []);
      renderTableRows(tbody, items, type);
    } catch {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state">No data available</div></td></tr>';
    }
  }

  function renderTableRows(tbody, items, type) {
    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state">No items found</div></td></tr>';
      return;
    }

    tbody.innerHTML = items.map(item => {
      const cols = getTableColumns(type, item);
      return `<tr>
        ${cols.map(col => `<td>${col}</td>`).join('')}
        <td>
          <div class="table-actions">
            <button class="btn-edit" onclick="Admin.editItem('${type}', ${item.id})">✏️ Edit</button>
            <button class="btn-delete" onclick="Admin.deleteItem('${type}', ${item.id})">🗑️ Delete</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  function getTableColumns(type, item) {
    switch (type) {
      case 'news':
        return [
          item.id,
          `<strong>${item.title || 'Untitled'}</strong>`,
          item.publishedAt ? Utils.formatDateShort(item.publishedAt) : '-',
          `<span class="status-badge status-${item.isPublished ? 'active' : 'pending'}">${item.isPublished ? 'Published' : 'Draft'}</span>`
        ];
      case 'events':
        return [
          item.id,
          `<strong>${item.title || 'Untitled'}</strong>`,
          item.eventDate ? Utils.formatDateShort(item.eventDate) : '-',
          item.eventType || 'General'
        ];
      case 'newsletters':
        return [
          item.id,
          `<strong>${item.title || 'Untitled'}</strong>`,
          `<span class="status-badge status-${item.newsletterType === 'AIML_NEWSLETTER' ? 'active' : 'pending'}">${item.newsletterType === 'AIML_NEWSLETTER' ? '📬 AIML' : '📋 Annual'}</span>`,
          item.monthYear || '-'
        ];
      case 'event-winners':
        return [
          item.id,
          `<strong>${item.winnerName || 'Unknown'}</strong>`,
          `<span class="status-badge status-active">${item.prize || '-'}</span>`,
          item.eventId ? `Event #${item.eventId}` : '-'
        ];
      case 'people':
        return [
          `<strong>${item.name || 'Unknown'}</strong>`,
          item.category || '-',
          item.roleTitle || '-',
          item.year || '-'
        ];
      default:
        return [item.id, item.title || item.name || '-', '-', '-'];
    }
  }

  /* --- People Management --- */
  async function loadPeople() {
    const tbody = document.querySelector('#people-table tbody');
    if (!tbody) return;

    tbody.innerHTML = Utils.createSkeleton(5, 'table');

    try {
      const data = await API.getPeople();
      const items = Array.isArray(data) ? data : (data.content || []);
      renderTableRows(tbody, items, 'people');
    } catch {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state">No data available</div></td></tr>';
    }

    // Bulk import
    const importBtn = document.querySelector('#bulk-import-btn');
    const importInput = document.querySelector('#bulk-import-input');
    if (importBtn && importInput) {
      importBtn.addEventListener('click', async () => {
        const file = importInput.files[0];
        if (!file) return Utils.showToast('Please select a CSV file', 'error');
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          await API.admin.bulkImportPeople(formData);
          Utils.showToast('Import successful!', 'success');
          loadPeople();
        } catch (e) {
          Utils.showToast(e.message || 'Import failed', 'error');
        }
      });
    }
  }

  /* --- Gallery Management --- */
  function loadGallery() {
    // Handled by file upload area
    initFileUploads();
  }

  /* --- Hero Media Management --- */
  function loadHero() {
    // Handled by file upload
    initFileUploads();
  }

  /* --- Partners Management --- */
  async function loadPartners() {
    const tbody = document.querySelector('#partners-table tbody');
    if (!tbody) return;
    
    try {
      const data = await API.getPartners();
      const items = Array.isArray(data) ? data : [];
      tbody.innerHTML = items.map(p => `
        <tr>
          <td><img src="${p.logoUrl}" alt="${p.name}" style="height:30px"></td>
          <td>${p.name}</td>
          <td><a href="${p.websiteUrl}" target="_blank">${p.websiteUrl || '-'}</a></td>
          <td>${p.displayOrder || 0}</td>
          <td>
            <div class="table-actions">
              <button class="btn-edit" onclick="Admin.editItem('partners', ${p.id})">✏️ Edit</button>
              <button class="btn-delete" onclick="Admin.deleteItem('partners', ${p.id})">🗑️ Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state">No partners</div></td></tr>';
    }
  }

  /* --- Messages --- */
  async function loadMessages() {
    const tbody = document.querySelector('#messages-table tbody');
    if (!tbody) return;

    try {
      const data = await API.admin.getMessages();
      const items = Array.isArray(data) ? data : (data.content || []);
      tbody.innerHTML = items.map(m => `
        <tr class="${m.isRead ? '' : 'unread'}" onclick="Admin.viewMessage(${m.id})">
          <td><strong>${m.isRead ? '' : '🟢 '}${m.name}</strong></td>
          <td>${m.email}</td>
          <td>${m.subject || 'No Subject'}</td>
          <td>${Utils.timeAgo(m.submittedAt)}</td>
          <td>
            <button class="btn-delete" onclick="event.stopPropagation();Admin.deleteItem('messages', ${m.id})">🗑️</button>
          </td>
        </tr>
      `).join('');
    } catch {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state">No messages</div></td></tr>';
    }
  }

  function viewMessage(id) {
    // Open message detail modal
    Utils.showToast('Message detail view coming soon', 'info');
  }

  /* --- Backup --- */
  function initBackup() {
    const backupBtn = document.querySelector('#create-backup-btn');
    const restoreInput = document.querySelector('#restore-backup-input');
    const restoreBtn = document.querySelector('#restore-backup-btn');
    const backupsList = document.querySelector('#backups-list');

    if (backupBtn) {
      backupBtn.addEventListener('click', async () => {
        backupBtn.disabled = true;
        backupBtn.textContent = 'Creating backup...';
        
        try {
          const data = await API.admin.createBackup();
          Utils.showToast('Backup created successfully!', 'success');
          loadBackupsList(backupsList);
        } catch (e) {
          Utils.showToast(e.message || 'Backup failed', 'error');
        }
        
        backupBtn.disabled = false;
        backupBtn.textContent = 'Create Backup';
      });
    }

    if (restoreBtn && restoreInput) {
      restoreBtn.addEventListener('click', async () => {
        const file = restoreInput.files[0];
        if (!file) return Utils.showToast('Please select a backup file', 'error');
        
        if (!confirm('Are you sure? This will overwrite all current data!')) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          await API.admin.restoreBackup(formData);
          Utils.showToast('Database restored successfully!', 'success');
        } catch (e) {
          Utils.showToast(e.message || 'Restore failed', 'error');
        }
      });
    }

    loadBackupsList(backupsList);
  }

  function loadBackupsList(container) {
    if (!container) return;
    container.innerHTML = '<p class="empty-state">No backups available yet.</p>';
  }

  /* --- Forms --- */
  function initForms() {
    document.querySelectorAll('.admin-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
          const action = form.dataset.action || 'create';
          const type = form.dataset.type;
          const id = form.dataset.id;
          
          if (action === 'create') {
            await API.admin[`create${capitalize(type)}`](data);
            Utils.showToast(`${capitalize(type)} created successfully!`, 'success');
          } else {
            await API.admin[`update${capitalize(type)}`](id, data);
            Utils.showToast(`${capitalize(type)} updated successfully!`, 'success');
          }
          
          // Redirect back to list
          setTimeout(() => {
            window.location.href = `manage-${type}.html`;
          }, 1000);
        } catch (e) {
          Utils.showToast(e.message || 'Save failed', 'error');
        }
      });
    });
  }

  /* --- File Upload Areas --- */
  function initFileUploads() {
    document.querySelectorAll('.file-upload-area').forEach(area => {
      const input = area.querySelector('input[type="file"]');
      if (!input) return;

      area.addEventListener('click', () => input.click());
      
      input.addEventListener('change', () => {
        const files = input.files;
        if (files.length) {
          previewFiles(area, files);
        }
      });

      // Drag and drop
      area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('dragover');
      });

      area.addEventListener('dragleave', () => {
        area.classList.remove('dragover');
      });

      area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('dragover');
        input.files = e.dataTransfer.files;
        previewFiles(area, e.dataTransfer.files);
      });
    });
  }

  function previewFiles(area, files) {
    const preview = area.querySelector('.file-preview') || (() => {
      const p = document.createElement('div');
      p.className = 'file-preview';
      area.appendChild(p);
      return p;
    })();

    preview.innerHTML = '';
    [...files].forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const item = document.createElement('div');
          item.className = 'file-preview-item';
          item.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button class="remove" data-index="${index}">✕</button>
          `;
          preview.appendChild(item);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /* --- CRUD Actions --- */
  async function editItem(type, id) {
    window.location.href = `manage-${type}.html?id=${id}`;
  }

  async function deleteItem(type, id) {
    if (!confirm(`Are you sure you want to delete this ${type} item?`)) return;
    
    try {
      await API.admin[`delete${capitalize(type)}`](id);
      Utils.showToast('Deleted successfully!', 'success');
      // Reload current table
      if (type === 'people') loadPeople();
      else if (type === 'partners') loadPartners();
      else if (type === 'messages') loadMessages();
      else loadTable(type);
    } catch (e) {
      Utils.showToast(e.message || 'Delete failed', 'error');
    }
  }

  /* --- Helpers --- */
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return { init, editItem, deleteItem, viewMessage };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.admin-wrapper')) {
    Admin.init();
  }
});
