import api from './api';

export const centerService = {
  getDashboard: async () => {
    const res = await api.get('/centers/dashboard');
    return res.data;
  },

  getBatches: async () => {
    const res = await api.get('/centers/batches');
    return res.data;
  },

  createBatch: async (batchData) => {
    const res = await api.post('/centers/batches', batchData);
    return res.data;
  },

  getStudents: async (params = {}) => {
    const res = await api.get('/centers/students', { params });
    return res.data;
  },

  addStudent: async (studentData) => {
    const res = await api.post('/centers/students', studentData);
    return res.data;
  },

  markAttendance: async (attendanceData) => {
    const res = await api.post('/centers/attendance', attendanceData);
    return res.data;
  },

  getAttendance: async (params = {}) => {
    const res = await api.get('/centers/attendance', { params });
    return res.data;
  },

  recordPerformance: async (perfData) => {
    const res = await api.post('/centers/performance', perfData);
    return res.data;
  },

  sendPerformanceToParent: async (performanceId) => {
    const res = await api.post(`/centers/performance/${performanceId}/send`);
    return res.data;
  },

  getPerformance: async (params = {}) => {
    const res = await api.get('/centers/performance', { params });
    return res.data;
  },

  getFees: async (params = {}) => {
    const res = await api.get('/centers/fees', { params });
    return res.data;
  },

  createFeeRecord: async (feeData) => {
    const res = await api.post('/centers/fees', feeData);
    return res.data;
  },

  updateFeeStatus: async (feeId, statusData) => {
    const res = await api.put(`/centers/fees/${feeId}`, statusData);
    return res.data;
  },

  sendFeeReminder: async (feeId) => {
    const res = await api.post(`/centers/fees/${feeId}/remind`);
    return res.data;
  },

  postTutorRequirement: async (reqData) => {
    const res = await api.post('/centers/tutor-requirements', reqData);
    return res.data;
  },
};
