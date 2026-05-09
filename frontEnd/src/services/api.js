//  import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true,
//   headers: { 'Content-Type': 'application/json' }
// });

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// ── Events ──────────────────────────────────────────────────────────────────
export const fetchEvents = () => api.get('/events');
export const fetchEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (formData) => api.post('/events', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateEvent = (id, formData) => api.put(`/events/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const fetchAdminStats = () => api.get('/events/stats');

// ── Registrations ────────────────────────────────────────────────────────────
export const registerForEvent = (eventId) => api.post('/registrations', { eventId });
export const fetchMyRegistrations = () => api.get('/registrations/my');
export const fetchEventRegistrations = (eventId) => api.get(`/registrations/event/${eventId}`);
export const cancelRegistration = (id) => api.delete(`/registrations/${id}`);

// ── Attendance ───────────────────────────────────────────────────────────────
export const fetchAttendance = (eventId) => api.get(`/attendance/${eventId}`);
export const markAttendance = (eventId, studentId, present) =>
  api.post('/attendance', { eventId, studentId, present });

// ── Auth (already in AuthContext, but exported for convenience) ──────────────
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const logoutUser = () => api.post('/auth/logout');
export const fetchMe = () => api.get('/auth/me');
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp });
export const resetPassword = (email, otp, password) =>
  api.post('/auth/reset-password', { email, otp, password });

export default api;