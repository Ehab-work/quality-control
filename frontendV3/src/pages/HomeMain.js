// client/src/pages/HomeMain.js
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import './HomeMain.css';

const navOptions = [
  { title: 'Sales', to: '/sales', role: 'Sales' },
  { title: 'Purchasing', to: '/purchase', role: 'Purchase' },
  { title: 'Production', to: '/production', role: 'Production' },
  { title: 'Insights', to: '/AnalisePage', role: 'CEO' },
];

const HomePage = () => {
  const accessToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role')?.trim().toLowerCase(); // تأكد من استخدام ?. لتجنب الأخطاء
  const isSuperuser = localStorage.getItem('is_superuser') === 'true'; // استرجع كقيمة Boolean

  // 🔐 حماية ضد غير المسجلين
  if (!accessToken || !role) {
    return <Navigate to="/" />;
  }

  // 🎯 فلترة حسب الدور مع تطبيع الحروف
  const filteredOptions = navOptions.filter(option =>
    isSuperuser || option.role.toLowerCase() === role
  );

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <div className="split-home">
      <div className="split-left">
        <h2 className="split-title">Factory Dashboard</h2>

        {filteredOptions.map(({ title, to }) => (
          <Link key={title} to={to} className="split-card">
            <span className="split-text">{title}</span>
          </Link>
        ))}

        <div className="logout-spacer" />

        <div className="split-card logout-card" onClick={handleLogout}>
          <span className="split-icon"><FiLogOut /></span>
          <span className="split-text">Log out</span>
        </div>
      </div>

      <div className="split-right">
        <h2 className="welcome-title">Welcome...</h2>
      </div>
    </div>
  );
};

export default HomePage;