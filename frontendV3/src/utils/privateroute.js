import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role')?.trim().toLowerCase();
  const username = localStorage.getItem('username');

  if (!token || !role) {
    return <Navigate to="/" />;
  }

  const isSuperuser = username === 'admin'; // أو استخدم localStorage.getItem('is_superuser') لو بتحفظها

  if (isSuperuser || allowedRoles.includes(role)) {
    return children;
  }

  return <Navigate to="/unauthorized" />;
};


export default PrivateRoute;
