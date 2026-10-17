import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const getStudents = (search = '') =>
  api.get('/students', { params: search ? { search } : {} }).then((r) => r.data.data);
export const getStudent = (id) => api.get(`/students/${id}`).then((r) => r.data.data);
export const createStudent = (data) => api.post('/students', data).then((r) => r.data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data).then((r) => r.data);
export const deleteStudent = (id) => api.delete(`/students/${id}`).then((r) => r.data);

// Pull the most useful message out of an Axios error
export const errMsg = (err) =>
  err.response?.data?.message || (err.request ? 'Cannot reach the server' : err.message);
