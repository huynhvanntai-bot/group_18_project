import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, adminOnly = false, allowedRoles = null }) {
  const auth = useSelector(state => state.auth);
  const isLoggedIn = !!auth.accessToken;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles provided, ensure user role is included
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!auth.user || !allowedRoles.includes(auth.user.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  if (adminOnly && auth.user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
