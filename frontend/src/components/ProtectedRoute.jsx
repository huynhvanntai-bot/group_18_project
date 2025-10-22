import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const auth = useSelector(state => state.auth);
  const isLoggedIn = !!auth.accessToken;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && auth.user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
