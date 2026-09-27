import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  registerParent: async (data) => {
    const res = await api.post('/auth/register/parent', data);
    return res.data;
  },

  registerTutor: async (formData) => {
    const res = await api.post('/auth/register/tutor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  registerCenter: async (formData) => {
    const res = await api.post('/auth/register/center', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },

  changePassword: async (data) => {
    const res = await api.put('/auth/change-password', data);
    return res.data;
  },
};
