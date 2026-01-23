import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../context/userAuthContext';
import Spinner from './Spinner';

type ProtectedRouteProps = {
  children: JSX.Element;
  requireRole?: string | string[]; // single role or array of allowed roles
  redirectTo?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole, redirectTo = '/login' }) => {
  const { user, role, loading } = useUserAuth();

  console.log("Protected Route State:", { loading, user, role });

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireRole) {
    const allowed = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!role || !allowed.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
