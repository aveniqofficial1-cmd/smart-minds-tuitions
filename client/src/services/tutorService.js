import api from './api';

export const tutorService = {
  getDashboard: async () => {
    const res = await api.get('/tutors/dashboard');
    return res.data;
  },

  getRequirements: async (params = {}) => {
    const res = await api.get('/tutors/requirements', { params });
    return res.data;
  },

  applyForRequirement: async (requirementId, applicationData = {}) => {
    const res = await api.post(`/tutors/requirements/${requirementId}/apply`, applicationData);
    return res.data;
  },

  getApplications: async () => {
    const res = await api.get('/tutors/applications');
    return res.data;
  },

  getDemos: async () => {
    const res = await api.get('/tutors/demos');
    return res.data;
  },

  getTuitions: async () => {
    const res = await api.get('/tutors/tuitions');
    return res.data;
  },

  markAttendance: async (attendanceData) => {
    const res = await api.post('/tutors/attendance', attendanceData);
    return res.data;
  },

  getAttendance: async (params = {}) => {
    const res = await api.get('/tutors/attendance', { params });
    return res.data;
  },

  submitReport: async (reportData) => {
    const res = await api.post('/tutors/reports', reportData);
    return res.data;
  },

  getReports: async () => {
    const res = await api.get('/tutors/reports');
    return res.data;
  },

  logEarning: async (earningData) => {
    const res = await api.post('/tutors/earnings', earningData);
    return res.data;
  },

  getEarnings: async () => {
    const res = await api.get('/tutors/earnings');
    return res.data;
  },

  createSubscription: async (formData) => {
    const res = await api.post('/tutors/subscriptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getSubscriptions: async () => {
    const res = await api.get('/tutors/subscriptions');
    return res.data;
  },

  uploadCommissionProof: async (formData) => {
    const res = await api.post('/tutors/commissions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getCommissions: async () => {
    const res = await api.get('/tutors/commissions');
    return res.data;
  },
};
