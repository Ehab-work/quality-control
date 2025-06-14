import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });

      console.log("LOGIN RESPONSE:", res.data);
      const role = res.data.role?.trim().toLowerCase();
      console.log("Stored role:", role);

      // ✅ تعديل هنا: استبدال response بـ res
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);

      navigate('/HomeMain');
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      setError('Incorrect username or password');
    }
  };

  return (
    <div className="signin-container">
      <h1 className="signin-welcome-header">
        Welcome to the Product Management and Quality Control System — please sign in to continue.
      </h1>

      <form onSubmit={handleLogin} className="signin-form">
        <div className="signin-field">
          <label className="signin-label">Email Address :</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="signin-input"
          />
        </div>
        <div className="signin-field">
          <label className="signin-label">Password :</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="signin-input"
          />
        </div>
        <button type="submit" className="signin-button">Sign In</button>
        {error && <p className="signin-error">{error}</p>}
      </form>

      <p className="signin-footer">
        ©2025 Product Management and Quality Control System
      </p>
    </div>
  );
};

export default SignInPage;
