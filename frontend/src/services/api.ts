import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Issue APIs
export const issueAPI = {
  getAll: (params?: { page?: number; limit?: number; status?: string; priority?: string; search?: string }) =>
    api.get('/issues', { params }),
  getById: (id: string) =>
    api.get(`/issues/${id}`),
  create: (data: { title: string; description: string; priority?: string; severity?: string }) =>
    api.post('/issues', data),
  update: (id: string, data: Partial<{ title: string; description: string; status: string; priority: string; severity: string }>) =>
    api.put(`/issues/${id}`, data),
  delete: (id: string) =>
    api.delete(`/issues/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/issues/${id}`, { status }),
  exportCSV: () =>
    api.get('/issues/export/csv', { responseType: 'blob' }),
  exportJSON: () =>
    api.get('/issues/export/json', { responseType: 'blob' }),
};

export default api;
