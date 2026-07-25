/* ============================================
   INNOVIYAL — API Utilities
   Centralized fetch wrapper with error handling
   ============================================ */

const API = (() => {
  // Change this to your deployed backend URL
  const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080/api'
    : 'https://innovial-backend.up.railway.app/api';

  async function request(endpoint, options = {}) {
    const token = localStorage.getItem('innovial_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      
      // Handle 204 No Content
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || data.error || 'Something went wrong',
          errors: data.errors || [],
        };
      }

      return data;
    } catch (error) {
      if (error.status) {
        // API error with status
        if (error.status === 401) {
          // Auto logout on unauthorized
          localStorage.removeItem('innovial_token');
          localStorage.removeItem('innovial_user');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/pages/student/login.html';
          }
        }
        throw error;
      }
      // Network error
      throw {
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: [],
      };
    }
  }

  return {
    // --- Public APIs ---
    getNews: (params = '') => request(`/news${params}`),
    getNewsById: (id) => request(`/news/${id}`),
    getEvents: (params = '') => request(`/events${params}`),
    getEventById: (id) => request(`/events/${id}`),
    getPeople: (params = '') => request(`/people${params}`),
    getPersonById: (id) => request(`/people/${id}`),
    getAchievements: (params = '') => request(`/achievements${params}`),
    getGallery: (params = '') => request(`/gallery${params}`),
    getVideos: (params = '') => request(`/videos${params}`),
    getMagazines: () => request('/magazines'),
    getNewsletters: (params = '') => request(`/newsletters${params}`),
    getNewsletterById: (id) => request(`/newsletters/${id}`),
    getEventWinners: (params = '') => request(`/event-winners${params}`),
    getEventWinnerById: (id) => request(`/event-winners/${id}`),
    getMaterials: (params = '') => request(`/materials${params}`),
    getTestimonials: (params = '') => request(`/testimonials${params}`),
    getPartners: () => request('/partners'),
    getHeroMedia: () => request('/hero-media'),
    getStats: () => request('/stats'),
    getAnnouncements: () => request('/announcements'),
    submitContact: (data) => request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    // --- Auth APIs ---
    login: (credentials) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (data) => request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    // --- Student APIs ---
    getStudentMaterials: (semester) => request(`/student/materials?semester=${semester}`),
    getStudentTimetable: (semester) => request(`/student/timetable?semester=${semester}`),

    // --- Admin APIs ---
    admin: {
      // News
      createNews: (data) => request('/admin/news', { method: 'POST', body: JSON.stringify(data) }),
      updateNews: (id, data) => request(`/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      deleteNews: (id) => request(`/admin/news/${id}`, { method: 'DELETE' }),

      // Events
      createEvent: (data) => request('/admin/events', { method: 'POST', body: JSON.stringify(data) }),
      updateEvent: (id, data) => request(`/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      deleteEvent: (id) => request(`/admin/events/${id}`, { method: 'DELETE' }),

      // People
      createPerson: (data) => request('/admin/people', { method: 'POST', body: JSON.stringify(data) }),
      updatePerson: (id, data) => request(`/admin/people/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      deletePerson: (id) => request(`/admin/people/${id}`, { method: 'DELETE' }),
      bulkImportPeople: (formData) => request('/admin/people/bulk-import', {
        method: 'POST',
        body: formData,
      }),

      // Gallery
      uploadGallery: (formData) => request('/admin/gallery', {
        method: 'POST',
        body: formData,
      }),
      deleteGallery: (id) => request(`/admin/gallery/${id}`, { method: 'DELETE' }),

      // Videos
      createVideo: (data) => request('/admin/videos', { method: 'POST', body: JSON.stringify(data) }),
      deleteVideo: (id) => request(`/admin/videos/${id}`, { method: 'DELETE' }),

      // Testimonials
      createTestimonial: (data) => request('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }),
      updateTestimonial: (id, data) => request(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      deleteTestimonial: (id) => request(`/admin/testimonials/${id}`, { method: 'DELETE' }),

      // Partners
      createPartner: (data) => request('/admin/partners', { method: 'POST', body: JSON.stringify(data) }),
      updatePartner: (id, data) => request(`/admin/partners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      deletePartner: (id) => request(`/admin/partners/${id}`, { method: 'DELETE' }),

      // Magazine
      createMagazine: (data) => request('/admin/magazines', { method: 'POST', body: JSON.stringify(data) }),
      deleteMagazine: (id) => request(`/admin/magazines/${id}`, { method: 'DELETE' }),

      // Newsletters
      createNewsletter: (data) => request('/admin/newsletters', { method: 'POST', body: JSON.stringify(data) }),
      updateNewsletter: (id, data) => request(`/admin/newsletters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      deleteNewsletter: (id) => request(`/admin/newsletters/${id}`, { method: 'DELETE' }),

      // Event Winners
      createEventWinner: (data) => request('/admin/event-winners', { method: 'POST', body: JSON.stringify(data) }),
      updateEventWinner: (id, data) => request(`/admin/event-winners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      deleteEventWinner: (id) => request(`/admin/event-winners/${id}`, { method: 'DELETE' }),

      // Newsletters (for admin table loader)
      getNewsletters: () => request('/newsletters'),

      // Event Winners (for admin table loader)
      getEventWinners: () => request('/event-winners'),

      // Materials
      createMaterial: (data) => request('/admin/materials', { method: 'POST', body: JSON.stringify(data) }),
      deleteMaterial: (id) => request(`/admin/materials/${id}`, { method: 'DELETE' }),

      // Achievements
      createAchievement: (data) => request('/admin/achievements', { method: 'POST', body: JSON.stringify(data) }),
      deleteAchievement: (id) => request(`/admin/achievements/${id}`, { method: 'DELETE' }),

      // Hero
      uploadHeroMedia: (formData) => request('/admin/hero/upload', {
        method: 'POST',
        body: formData,
      }),
      deleteHeroMedia: (id) => request(`/admin/hero/${id}`, { method: 'DELETE' }),

      // File Upload
      uploadFile: (formData) => request('/admin/upload', {
        method: 'POST',
        body: formData,
      }),

      // Messages
      getMessages: (params = '') => request(`/admin/messages${params}`),
      markMessageRead: (id) => request(`/admin/messages/${id}/read`, { method: 'PUT' }),
      deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),

      // Analytics
      getAnalytics: (period) => request(`/admin/analytics?period=${period}`),

      // Backup
      createBackup: () => request('/admin/backup', { method: 'POST' }),
      restoreBackup: (formData) => request('/admin/restore', {
        method: 'POST',
        body: formData,
      }),
    },
  };
})();
