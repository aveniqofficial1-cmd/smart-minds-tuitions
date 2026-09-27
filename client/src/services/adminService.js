import api from './api';

export const adminService = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getRequirements: async (params = {}) => {
    const res = await api.get('/admin/requirements', { params });
    return res.data;
  },

  updateRequirementStatus: async (id, statusData) => {
    const res = await api.put(`/admin/requirements/${id}/status`, statusData);
    return res.data;
  },

  getRequirementApplications: async (id) => {
    const res = await api.get(`/admin/requirements/${id}/applications`);
    return res.data;
  },

  getTutors: async (params = {}) => {
    const res = await api.get('/admin/tutors', { params });
    return res.data;
  },

  updateTutorStatus: async (id, statusData) => {
    const res = await api.put(`/admin/tutors/${id}/status`, statusData);
    return res.data;
  },

  getCenters: async (params = {}) => {
    const res = await api.get('/admin/centers', { params });
    return res.data;
  },

  updateCenterStatus: async (id, statusData) => {
    const res = await api.put(`/admin/centers/${id}/status`, statusData);
    return res.data;
  },

  scheduleDemo: async (demoData) => {
    const res = await api.post('/admin/demos/schedule', demoData);
    return res.data;
  },

  relayDemoOutcome: async (demoId, outcomeData) => {
    const res = await api.put(`/admin/demos/${demoId}/relay`, outcomeData);
    return res.data;
  },

  assignTutor: async (assignmentData) => {
    const res = await api.post('/admin/assignments', assignmentData);
    return res.data;
  },

  getAssignments: async (params = {}) => {
    const res = await api.get('/admin/assignments', { params });
    return res.data;
  },

  getSubscriptions: async (params = {}) => {
    const res = await api.get('/admin/subscriptions', { params });
    return res.data;
  },

  verifySubscription: async (id, verifyData) => {
    const res = await api.put(`/admin/subscriptions/${id}/verify`, verifyData);
    return res.data;
  },

  getCommissions: async (params = {}) => {
    const res = await api.get('/admin/commissions', { params });
    return res.data;
  },

  verifyCommission: async (id, verifyData) => {
    const res = await api.put(`/admin/commissions/${id}/verify`, verifyData);
    return res.data;
  },

  getEarnings: async () => {
    const res = await api.get('/admin/earnings');
    return res.data;
  },

  getAuditLogs: async (params = {}) => {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  },
};
