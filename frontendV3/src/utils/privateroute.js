// client/src/privateroute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role')?.trim().toLowerCase();
  const isSuperuser = localStorage.getItem('is_superuser') === 'true'; // استرجع كقيمة Boolean

  if (!token || !role) {
    return <Navigate to="/" />;
  }

  if (isSuperuser || allowedRoles.includes(role)) {
    return children;
  }

  return <Navigate to="/unauthorized" />;
};

export default PrivateRoute;