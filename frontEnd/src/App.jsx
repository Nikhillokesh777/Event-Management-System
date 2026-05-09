 import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { PrivateRoute, AdminRoute } from './components/layout/Routes';

// Auth
import LoginPage          from './pages/auth/LoginPage';
import SignupPage         from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/Forgotpasswordpage.jsx';


// Student
import StudentDashboard    from './pages/student/StudentDashboard';
import EventDetailsPage    from './pages/student/EventDetailsPage';
import MyEventsPage        from './pages/student/MyEventsPage';
import ProfilePage         from './pages/student/ProfilePage';

// Admin
import AdminDashboard      from './pages/admin/AdminDashboard';
import ManageEventsPage    from './pages/admin/ManageEventsPage';
import CreateEditEventPage from './pages/admin/CreateEditEventPage';
import AttendancePage      from './pages/admin/AttendancePage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/signup"         element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Student routes */}
            <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
            <Route path="/events/:id" element={<PrivateRoute><EventDetailsPage /></PrivateRoute>} />
            <Route path="/my-events" element={<PrivateRoute><MyEventsPage /></PrivateRoute>} />
            <Route path="/profile"   element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

            {/* Admin routes */}
            <Route path="/admin"                     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/events"              element={<AdminRoute><ManageEventsPage /></AdminRoute>} />
            <Route path="/admin/events/create"       element={<AdminRoute><CreateEditEventPage /></AdminRoute>} />
            <Route path="/admin/events/:id/edit"     element={<AdminRoute><CreateEditEventPage /></AdminRoute>} />
            <Route path="/admin/attendance"          element={<AdminRoute><AttendancePage /></AdminRoute>} />
            <Route path="/admin/profile"             element={<AdminRoute><ProfilePage /></AdminRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}