/* ============================================
   INNOVIYAL — Authentication Module
   JWT token management, login/logout, role checks
   ============================================ */

const Auth = (() => {
  const TOKEN_KEY = 'innovial_token';
  const USER_KEY = 'innovial_user';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  }

  function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function isLoggedIn() {
    return !!getToken();
  }

  function isAdmin() {
    const user = getUser();
    return user && user.role === 'ADMIN';
  }

  function isStudent() {
    const user = getUser();
    return user && user.role === 'STUDENT';
  }

  function requireAuth(role) {
    if (!isLoggedIn()) {
      window.location.href = '/pages/student/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    if (role === 'ADMIN' && !isAdmin()) {
      window.location.href = '/pages/student/login.html';
      return false;
    }
    return true;
  }

  async function login(email, password) {
    try {
      const response = await API.login({ email, password });
      setSession(response.token, response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function register(data) {
    try {
      const response = await API.register(data);
      return { success: true, message: 'Registration successful! Please login.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  function logout() {
    clearSession();
    window.location.href = '/index.html';
  }

  function initAuthUI() {
    const authLinks = document.querySelectorAll('[data-auth]');
    const user = getUser();
    
    authLinks.forEach(el => {
      const action = el.dataset.auth;
      if (action === 'login') {
        if (isLoggedIn()) {
          el.textContent = 'Dashboard';
          el.href = isAdmin() ? '/pages/admin/dashboard.html' : '/pages/student/dashboard.html';
        }
      } else if (action === 'logout') {
        if (isLoggedIn()) {
          el.style.display = 'block';
          el.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
          });
        } else {
          el.style.display = 'none';
        }
      } else if (action === 'user-name') {
        if (user) {
          el.textContent = user.name || user.email;
        }
      }
    });
  }

  return {
    getToken,
    getUser,
    isLoggedIn,
    isAdmin,
    isStudent,
    requireAuth,
    login,
    register,
    logout,
    initAuthUI,
  };
})();

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
  Auth.initAuthUI();
});
