import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ── Pages ──────────────────────────────────────────────────
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyResumes from './pages/MyResumes';
import ATSAnalyzer from './pages/ATSAnalyzer';
import Profile from './pages/Profile';
import ResumeBuilder from './pages/ResumeBuilder';

// ── Components ─────────────────────────────────────────────
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoadingScreen from './components/LoadingScreen';

// ── Hooks ──────────────────────────────────────────────────
import useInitializeAuth from './hooks/useInitializeAuth';

export default function App() {
  const { loading } = useInitializeAuth();

  // Show full screen animated loader while verifying existing tokens
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      {/* Toast Notifications Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl backdrop-blur-xl',
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(51, 65, 85, 0.4)',
            color: '#f8fafc',
            backdropFilter: 'blur(12px)',
            borderRadius: '1rem',
          },
        }}
      />

      <Routes>
        {/* Public-Only Authenticating Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected SaaS Route Ecosystem */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes"
          element={
            <ProtectedRoute>
              <MyResumes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ats"
          element={
            <ProtectedRoute>
              <ATSAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder/new"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder/:id"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />

        {/* Default Gateway Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
