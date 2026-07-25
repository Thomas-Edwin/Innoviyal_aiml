/* ============================================
   INNOVIYAL — Utility Functions
   ============================================ */

const Utils = (() => {
  // --- Date Formatting ---
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  function formatDateShort(dateStr) {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  function getDay(dateStr) {
    return new Date(dateStr).getDate();
  }

  function getMonth(dateStr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date(dateStr).getMonth()];
  }

  function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDateShort(dateStr);
  }

  function isUpcoming(dateStr) {
    return new Date(dateStr) > new Date();
  }

  // --- Debounce ---
  function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // --- DOM Helpers ---
  function createElement(tag, classes = '', attrs = {}) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  }

  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  }

  // --- Validation ---
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[+]?[\d\s()-]{10,15}$/.test(phone);
  }

  function validateRequired(value) {
    return value && value.trim().length > 0;
  }

  function showFieldError(input, message) {
    const parent = input.closest('.form-group') || input.parentElement;
    let error = parent.querySelector('.form-error');
    if (!error) {
      error = createElement('div', 'form-error');
      parent.appendChild(error);
    }
    error.textContent = message;
    input.classList.add('error');
  }

  function clearFieldError(input) {
    const parent = input.closest('.form-group') || input.parentElement;
    const error = parent.querySelector('.form-error');
    if (error) error.remove();
    input.classList.remove('error');
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container') || (() => {
      const c = createElement('div', 'toast-container');
      document.body.appendChild(c);
      return c;
    })();

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
    };

    const toast = createElement('div', `toast toast-${type}`);
    toast.innerHTML = `
      <span>${icons[type] || ''}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- Loading Spinner ---
  function showLoading(container) {
    let spinner = container.querySelector('.loading-spinner');
    if (!spinner) {
      spinner = createElement('div', 'loading-spinner');
      spinner.innerHTML = '<div class="spinner"></div>';
      container.appendChild(spinner);
    }
    spinner.style.display = 'flex';
  }

  function hideLoading(container) {
    const spinner = container.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'none';
  }

  // --- Pagination ---
  function renderPagination(container, currentPage, totalPages, onPageChange) {
    container.innerHTML = '';
    if (totalPages <= 1) return;

    const createPageBtn = (page, label, isActive = false) => {
      const btn = createElement('button', `page-btn${isActive ? ' active' : ''}`);
      btn.textContent = label || page;
      btn.addEventListener('click', () => onPageChange(page));
      return btn;
    };

    // Previous
    if (currentPage > 1) {
      container.appendChild(createPageBtn(currentPage - 1, '‹'));
    }

    // Pages
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      container.appendChild(createPageBtn(i, i, i === currentPage));
    }

    // Next
    if (currentPage < totalPages) {
      container.appendChild(createPageBtn(currentPage + 1, '›'));
    }
  }

  // --- Skeleton Loader ---
  function createSkeleton(count = 3, type = 'card') {
    let html = '';
    for (let i = 0; i < count; i++) {
      if (type === 'card') {
        html += `
          <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line w-75"></div>
              <div class="skeleton-line w-50"></div>
              <div class="skeleton-line w-60"></div>
            </div>
          </div>
        `;
      } else if (type === 'table') {
        html += `
          <tr>
            <td><div class="skeleton-line"></div></td>
            <td><div class="skeleton-line"></div></td>
            <td><div class="skeleton-line w-50"></div></td>
            <td><div class="skeleton-line w-30"></div></td>
          </tr>
        `;
      }
    }
    return html;
  }

  return {
    formatDate,
    formatDateShort,
    getDay,
    getMonth,
    timeAgo,
    isUpcoming,
    debounce,
    createElement,
    $,
    $$,
    validateEmail,
    validatePhone,
    validateRequired,
    showFieldError,
    clearFieldError,
    showToast,
    showLoading,
    hideLoading,
    renderPagination,
    createSkeleton,
  };
})();
