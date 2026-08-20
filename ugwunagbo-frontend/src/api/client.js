import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🔗 API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - handle FormData
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: (username, password) => 
    apiClient.post('/api/auth/login', { username, password }),

  register: (userData) => 
    apiClient.post('/api/auth/register', userData),
    
  changePassword: (currentPassword, newPassword) =>
    apiClient.put('/api/auth/change-password', { currentPassword, newPassword }),
    
  getAdminProfile: () => apiClient.get('/api/auth/profile'),
  updateAdminProfile: (data) => apiClient.put('/api/auth/update-profile', data),
  
  // Governor
  getGovernor: () => apiClient.get('/api/governor'),
  updateGovernor: (data) => {
    return apiClient.put('/api/governor', data, {
      headers: {}
    });
  },
  
  // Leaders
  getLeaders: () => apiClient.get('/api/leaders'),
  addLeader: (data) => {
    return apiClient.post('/api/leaders', data, {
      headers: {}
    });
  },
  updateLeader: (id, data) => {
    return apiClient.put(`/api/leaders/${id}`, data, {
      headers: {}
    });
  },
  deleteLeader: (id) => apiClient.delete(`/api/leaders/${id}`),
  
  // Villages
  getVillages: () => apiClient.get('/api/villages'),
  addVillage: (data) => apiClient.post('/api/villages', data),
  deleteVillage: (id) => apiClient.delete(`/api/villages/${id}`),
  
  // News
  getNews: () => apiClient.get('/api/news'),
  addNews: (data) => {
    return apiClient.post('/api/news', data, {
      headers: {}
    });
  },
  updateNews: (id, data) => {
    return apiClient.put(`/api/news/${id}`, data, {
      headers: {}
    });
  },
  deleteNews: (id) => apiClient.delete(`/api/news/${id}`),
  
  // Traditional Rulers
  getTraditionalRulers: () => apiClient.get('/api/traditional-rulers'),
  addTraditionalRuler: (data) => {
    return apiClient.post('/api/traditional-rulers', data, {
      headers: {}
    });
  },
  updateTraditionalRuler: (id, data) => {
    return apiClient.put(`/api/traditional-rulers/${id}`, data, {
      headers: {}
    });
  },
  deleteTraditionalRuler: (id) => apiClient.delete(`/api/traditional-rulers/${id}`),
  
  // NGOs
  getNGOs: () => apiClient.get('/api/ngos-foundations'),
  addNGO: (data) => {
    return apiClient.post('/api/ngos-foundations', data, {
      headers: {}
    });
  },
  updateNGO: (id, data) => {
    return apiClient.put(`/api/ngos-foundations/${id}`, data, {
      headers: {}
    });
  },
  deleteNGO: (id) => apiClient.delete(`/api/ngos-foundations/${id}`),
  
  // Academia
  getAcademia: () => apiClient.get('/api/academia'),
  addAcademician: (data) => {
    return apiClient.post('/api/academia', data, {
      headers: {}
    });
  },
  updateAcademician: (id, data) => {
    return apiClient.put(`/api/academia/${id}`, data, {
      headers: {}
    });
  },
  deleteAcademician: (id) => apiClient.delete(`/api/academia/${id}`),
  
  // Gallery
  getGallery: () => apiClient.get('/api/gallery'),
  addGalleryItem: (data) => {
    return apiClient.post('/api/gallery', data, {
      headers: {}
    });
  },
  updateGalleryItem: (id, data) => {
    return apiClient.put(`/api/gallery/${id}`, data, {
      headers: {}
    });
  },
  deleteGalleryItem: (id) => apiClient.delete(`/api/gallery/${id}`),
  
  // Budgets
  getBudgets: () => apiClient.get('/api/budgets'),
  uploadBudget: (data) => {
    return apiClient.post('/api/budgets', data, {
      headers: {}
    });
  },
  deleteBudget: (id) => apiClient.delete(`/api/budgets/${id}`),
  
  // Contacts
  getContacts: () => apiClient.get('/api/contacts'),
  submitContact: (data) => {
    console.log('📤 Submitting contact data:', data);
    return apiClient.post('/api/contacts', data);
  },
  
  // Service Applications
  getApplications: () => apiClient.get('/api/service-applications'),
  submitApplication: (data) => {
    console.log('📤 Submitting application data:', data);
    return apiClient.post('/api/service-applications', data);
  },
  
  submitApplicationWithFile: (formData) => {
    console.log('📤 Submitting application with file...');
    return apiClient.post('/api/service-applications/apply-with-file', formData, {
      headers: {}
    });
  },
  
  getServicePrices: () => {
    console.log('📤 Fetching service prices...');
    return apiClient.get('/api/service-applications/prices');
  },
  
  updateServicePrice: (serviceType, data) => {
    console.log(`📤 Updating price for ${serviceType}:`, data);
    return apiClient.put(`/api/service-applications/prices/${encodeURIComponent(serviceType)}`, data);
  },
  
  updateApplicationStatus: (id, status) => 
    apiClient.put(`/api/service-applications/${id}/status`, { status }),
  deleteApplication: (id) => apiClient.delete(`/api/service-applications/${id}`),
  
  // Leadership History
  getLeadershipHistory: () => apiClient.get('/api/leadership-history'),
  addLeadershipHistory: (data) => apiClient.post('/api/leadership-history', data),
  updateLeadershipHistory: (id, data) => apiClient.put(`/api/leadership-history/${id}`, data),
  deleteLeadershipHistory: (id) => apiClient.delete(`/api/leadership-history/${id}`),
  
  // Notifications
  getNotifications: () => apiClient.get('/api/notifications'),
  markNotificationRead: (id) => apiClient.put(`/api/notifications/${id}/read`),
  markAllNotificationsRead: () => apiClient.put('/api/notifications/read-all'),

  // Forum
  getTopics: () => apiClient.get('/api/forum/topics'),
  getTopic: (id) => apiClient.get(`/api/forum/topics/${id}`),
  createTopic: (data) => apiClient.post('/api/forum/topics', data),
  getReplies: (topicId) => apiClient.get(`/api/forum/topics/${topicId}/replies`),
  addReply: (topicId, data) => apiClient.post(`/api/forum/topics/${topicId}/replies`, data),
  likeTopic: (topicId) => apiClient.post(`/api/forum/topics/${topicId}/like`),
  getLikeStatus: (topicId) => apiClient.get(`/api/forum/topics/${topicId}/like-status`),
  getLikeCount: (topicId) => apiClient.get(`/api/forum/topics/${topicId}/likes`),

  // Chat
// Chat
getChatMessages: () => apiClient.get('/api/chat/messages'),
sendChatMessage: (data) => apiClient.post('/api/chat/messages', data),
deleteChatMessage: (id) => apiClient.delete(`/api/chat/messages/${id}`),
reactToMessage: (id, data) => apiClient.post(`/api/chat/messages/${id}/react`, data),
getOnlineUsers: () => apiClient.get('/api/chat/users/online'),
updateUserActivity: () => apiClient.post('/api/chat/users/active'),
};



export default apiClient;