import api from './api';

export const parentService = {
  getDashboard: async () => {
    const res = await api.get('/parents/dashboard');
    return res.data;
  },

  getStudents: async () => {
    const res = await api.get('/parents/students');
    return res.data;
  },

  createStudent: async (studentData) => {
    const res = await api.post('/parents/students', studentData);
    return res.data;
  },

  getRequirements: async () => {
    const res = await api.get('/parents/requirements');
    return res.data;
  },

  createRequirement: async (reqData) => {
    const res = await api.post('/parents/requirements', reqData);
    return res.data;
  },

  getCandidates: async (requirementId) => {
    const res = await api.get(`/parents/requirements/${requirementId}/candidates`);
    return res.data;
  },

  getDemos: async () => {
    const res = await api.get('/parents/demos');
    return res.data;
  },

  submitDemoDecision: async (demoId, decisionData) => {
    const res = await api.post(`/parents/demos/${demoId}/decision`, decisionData);
    return res.data;
  },

  getAssignedTutors: async () => {
    const res = await api.get('/parents/assigned-tutors');
    return res.data;
  },

  getAttendance: async () => {
    const res = await api.get('/parents/attendance');
    return res.data;
  },

  getReports: async () => {
    const res = await api.get('/parents/reports');
    return res.data;
  },
};
