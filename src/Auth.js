import React, { useState } from 'react';

function Auth({ onLogin, onBack }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const getUsers = () => JSON.parse(localStorage.getItem('examninjaUsers') || '[]');
  const saveUsers = (users) => localStorage.setItem('examninjaUsers', JSON.stringify(users));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const users = getUsers();

    if (mode === 'signup') {
      if (!name || !username || !password) { setError('Please fill in all fields.'); return; }
      if (username.length < 3) { setError('Username must be at least 3 characters.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (users.find(u => u.username === username)) { setError('Username already taken. Try another.'); return; }
      const newUser = { name, username, password, createdAt: new Date().toISOString() };
      saveUsers([...users, newUser]);
      localStorage.setItem('examninjaCurrentUser', JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      if (!username || !password) { setError('Please enter username and password.'); return; }
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) { setError('Wrong username or password.'); return; }
      localStorage.setItem('examninjaCurrentUser', JSON.stringify(user));
      onLogin(user);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)',
    color: 'white', fontSize: '14px', outline: 'none', marginBottom: '16px',
    boxSizing: 'border-box'
  };
  const labelStyle = {
    display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif", padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px', color: 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🥷</div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
            {mode === 'login' ? 'Welcome back' : 'Join ExamNinja'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            {mode === 'login' ? 'Log in to continue your prep' : 'Create your free account — takes 30 seconds'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <label style={labelStyle}>Your Name</label>
              <input
                type="text" placeholder="e.g. Priya Sharma" value={name}
                onChange={e => setName(e.target.value)} style={inputStyle}
              />
            </>
          )}

          <label style={labelStyle}>Username</label>
          <input
            type="text" placeholder="e.g. priya123" value={username}
            onChange={e => setUsername(e.target.value.toLowerCase())} style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password" placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
            value={password} onChange={e => setPassword(e.target.value)} style={inputStyle}
          />

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: '#ef4444'
            }}>
              {error}
            </div>
          )}

          <button type="submit" style={{
            width: '100%', padding: '14px', borderRadius: '50px', border: 'none',
            background: 'linear-gradient(90deg, #f7971e, #ffd200)',
            color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '4px'
          }}>
            {mode === 'login' ? 'Log In 🥷' : 'Create Account 🥷'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <span onClick={() => { setMode('signup'); setError(''); }}
                style={{ color: '#ffd200', cursor: 'pointer' }}>Sign up free</span>
            </>
          ) : (
            <>Already have an account?{' '}
              <span onClick={() => { setMode('login'); setError(''); }}
                style={{ color: '#ffd200', cursor: 'pointer' }}>Log in</span>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span onClick={onBack} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
            ← Back to home
          </span>
        </div>
      </div>
    </div>
  );
}

export default Auth;
