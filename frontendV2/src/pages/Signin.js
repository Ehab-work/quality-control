import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/HomeMain');
    } catch (err) {
      setError('Incorrect username or password');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign In</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Sign In</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1f1f2f',
    minHeight: '100vh',
    fontFamily: 'Poppins, sans-serif',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: '2rem',
    marginBottom: 30
  },
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#2a2a3d',
    padding: 30,
    borderRadius: 12,
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
  },
  field: {
    marginBottom: 20
  },
  label: {
    display: 'block',
    marginBottom: 8,
    color: '#ccc'
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    backgroundColor: '#1f1f2f',
    color: 'white'
  },
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: 'none',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #057e76, #8604a0)',
    color: 'white',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center'
  }
};

export default SignInPage;
