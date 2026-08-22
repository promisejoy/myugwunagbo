import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🔗 API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    // 1. Attach Auth Token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Automatically handle FormData header overrides
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    
    // Auto-logout on 401 Unauthorized, except for non-fatal/chat endpoints
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isChatEndpoint = url.includes('/api/chat/');
      
      if (!isChatEndpoint) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// API CLIENT METHODS
// ============================================
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
  updateGovernor: (data) => apiClient.put('/api/governor', data),
  
  // Leaders
  getLeaders: () => apiClient.get('/api/leaders'),
  addLeader: (data) => apiClient.post('/api/leaders', data),
  updateLeader: (id, data) => apiClient.put(`/api/leaders/${id}`, data),
  deleteLeader: (id) => apiClient.delete(`/api/leaders/${id}`),
  
  // Villages
  getVillages: () => apiClient.get('/api/villages'),
  addVillage: (data) => apiClient.post('/api/villages', data),
  deleteVillage: (id) => apiClient.delete(`/api/villages/${id}`),
  
  // News
  getNews: () => apiClient.get('/api/news'),
  addNews: (data) => apiClient.post('/api/news', data),
  updateNews: (id, data) => apiClient.put(`/api/news/${id}`, data),
  deleteNews: (id) => apiClient.delete(`/api/news/${id}`),
  
  // Traditional Rulers
  getTraditionalRulers: () => apiClient.get('/api/traditional-rulers'),
  addTraditionalRuler: (data) => apiClient.post('/api/traditional-rulers', data),
  updateTraditionalRuler: (id, data) => apiClient.put(`/api/traditional-rulers/${id}`, data),
  deleteTraditionalRuler: (id) => apiClient.delete(`/api/traditional-rulers/${id}`),
  
  // NGOs
  getNGOs: () => apiClient.get('/api/ngos-foundations'),
  addNGO: (data) => apiClient.post('/api/ngos-foundations', data),
  updateNGO: (id, data) => apiClient.put(`/api/ngos-foundations/${id}`, data),
  deleteNGO: (id) => apiClient.delete(`/api/ngos-foundations/${id}`),
  
  // Academia
  getAcademia: () => apiClient.get('/api/academia'),
  addAcademician: (data) => apiClient.post('/api/academia', data),
  updateAcademician: (id, data) => apiClient.put(`/api/academia/${id}`, data),
  deleteAcademician: (id) => apiClient.delete(`/api/academia/${id}`),
  
  // Gallery
  getGallery: () => apiClient.get('/api/gallery'),
  addGalleryItem: (data) => apiClient.post('/api/gallery', data),
  updateGalleryItem: (id, data) => apiClient.put(`/api/gallery/${id}`, data),
  deleteGalleryItem: (id) => apiClient.delete(`/api/gallery/${id}`),
  
  // Budgets
  getBudgets: () => apiClient.get('/api/budgets'),
  uploadBudget: (data) => apiClient.post('/api/budgets', data),
  deleteBudget: (id) => apiClient.delete(`/api/budgets/${id}`),
  
  // Contacts
  getContacts: () => apiClient.get('/api/contacts'),
  submitContact: (data) => apiClient.post('/api/contacts', data),
  
  // Service Applications
  getApplications: () => apiClient.get('/api/service-applications'),
  submitApplication: (data) => apiClient.post('/api/service-applications', data),
  submitApplicationWithFile: (formData) => apiClient.post('/api/service-applications/apply-with-file', formData),
  getServicePrices: () => apiClient.get('/api/service-applications/prices'),
  updateServicePrice: (serviceType, data) => 
    apiClient.put(`/api/service-applications/prices/${encodeURIComponent(serviceType)}`, data),
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
  createTopicWithFile: (formData) => apiClient.post('/api/forum/topics-with-file', formData),
  addReplyWithFile: (topicId, formData) => apiClient.post(`/api/forum/topics/${topicId}/replies-with-file`, formData),

  // Chat
  // ============================================
// CHAT
// ============================================
getChatMessages: () =>
  apiClient.get('/api/chat/messages'),

sendChatMessage: (data) =>
  apiClient.post('/api/chat/messages', data),

sendChatMessageWithFile: (formData) =>
  apiClient.post('/api/chat/messages-with-file', formData),

deleteChatMessage: (id) =>
  apiClient.delete(`/api/chat/messages/${id}`),

reactToMessage: (id, emoji) =>
  apiClient.post(`/api/chat/messages/${id}/react`, { emoji }),

getOnlineUsers: () =>
  apiClient.get('/api/chat/users/online'),

updateUserActivity: () =>
  apiClient.post('/api/chat/users/active'),

// ============================================
// CHAT READ STATE
// ============================================
getChatReadState: () =>
  apiClient.get('/api/chat/read-state'),

saveChatReadState: (messageId, readAt) =>
  apiClient.post('/api/chat/read-state', {
    messageId,
    readAt
}),
};

export default apiClient;