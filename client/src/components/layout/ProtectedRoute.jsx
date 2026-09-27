import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <img
            src="/logo.png"
            alt="Smart Minds Tuitions"
            className="w-16 h-16 rounded-full border-2 border-gold-400 shadow-gold animate-pulse"
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-navy-900 font-semibold">
          <svg className="animate-spin h-5 w-5 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to proper role portal if they try to access an unauthorized portal
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'parent') return <Navigate to="/parent" replace />;
    if (role === 'tutor') return <Navigate to="/tutor" replace />;
    if (role === 'center') return <Navigate to="/center" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};
