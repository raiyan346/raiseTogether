import api from './api';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  completeProfile: (data) => api.post('/auth/complete-profile', data),
  setup2FA: () => api.post('/auth/2fa/setup'),
  enable2FA: (code) => api.post('/auth/2fa/enable', { code }),
  disable2FA: (password) => api.post('/auth/2fa/disable', { password }),
};

export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  followUser: (id) => api.post(`/users/${id}/follow`),
  getLeaderboard: (page = 1) => api.get(`/users/leaderboard?page=${page}`),
  exportPortfolio: (id) => api.get(id ? `/users/${id}/portfolio` : '/users/me/portfolio'),
};

export const aiAPI = {
  getQuote: () => api.get('/ai/quote'),
  analyzeResume: (resumeText) => api.post('/ai/resume-analyzer', { resumeText }),
  skillGap: (data) => api.post('/ai/skill-gap', data),
  careerRoadmap: () => api.post('/ai/career-roadmap'),
  interviewQuestions: (data) => api.post('/ai/interview-questions', data),
  learningRecommendations: (skills) => api.post('/ai/learning-recommendations', { skills }),
  validateStartup: (data) => api.post('/ai/validate-startup', data),
  mentorChat: (message) => api.post('/ai/mentor-chat', { message }),
};

export const communityAPI = {
  getPosts: (page = 1) => api.get(`/community?page=${page}`),
  createPost: (data) => api.post('/community', data),
  likePost: (id) => api.post(`/community/${id}/like`),
  getComments: (id) => api.get(`/community/${id}/comments`),
  createComment: (id, content) => api.post(`/community/${id}/comments`, { content }),
};

export const projectAPI = {
  getProjects: (page = 1) => api.get(`/projects?page=${page}`),
  createProject: (data) => api.post('/projects', data),
  joinProject: (id) => api.post(`/projects/${id}/join`),
};

export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  createJob: (data) => api.post('/jobs', data),
  applyToJob: (id, data) => api.post(`/jobs/${id}/apply`, data),
  getMyApplications: () => api.get('/jobs/applications/me'),
};

export const marketplaceAPI = {
  getGigs: (page = 1) => api.get(`/marketplace/gigs?page=${page}`),
  createGig: (data) => api.post('/marketplace/gigs', data),
  applyToGig: (id, proposal) => api.post(`/marketplace/gigs/${id}/apply`, { proposal }),
  bookMentorship: (data) => api.post('/marketplace/mentorships', data),
  getMentorships: () => api.get('/marketplace/mentorships'),
};

export const generalAPI = {
  getCourses: (page = 1) => api.get(`/courses?page=${page}`),
  enrollCourse: (id) => api.post(`/courses/${id}/enroll`),
  getStartups: () => api.get('/startups'),
  submitStartup: (data) => api.post('/startups', data),
  voteStartup: (id) => api.post(`/startups/${id}/vote`),
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (data) => api.post('/messages', data),
  getMotivation: () => api.get('/motivation'),
  updateDailyGoals: (goals) => api.put('/motivation/goals', { goals }),
  getAnalytics: () => api.get('/analytics'),
  adminGetUsers: (page = 1) => api.get(`/admin/users?page=${page}`),
  adminToggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  adminApproveJob: (id) => api.put(`/admin/jobs/${id}/approve`),
  adminGetCourses: () => api.get('/admin/courses'),
  adminCreateCourse: (data) => api.post('/admin/courses', data),
  adminUpdateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
  adminGetJobs: () => api.get('/admin/content/jobs'),
  adminCreateJob: (data) => api.post('/admin/content/jobs', data),
  adminUpdateJob: (id, data) => api.put(`/admin/content/jobs/${id}`, data),
  adminGetGigs: () => api.get('/admin/content/gigs'),
  adminCreateGig: (data) => api.post('/admin/content/gigs', data),
  adminUpdateGig: (id, data) => api.put(`/admin/content/gigs/${id}`, data),
};
