import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);

    try {
      const endpoint = isRegister ? 'http://localhost:3001/api/register' : 'http://localhost:3001/api/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin({
          username: data.username,
          userId: data.userId,
          petName: data.petName,
          petId: data.petId,
        });
        navigate(data.petName ? '/pet' : '/name');
      } else {
        alert(data.error || (isRegister ? 'Registration failed' : 'Login failed'));
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Failed to connect to server. Make sure the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', width: '100vw',
      background: '#0a0a12',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeUp 0.6s ease forwards; }
        .bird-float { animation: float 3.5s ease-in-out infinite; }
        .blob { animation: pulseGlow 4s ease-in-out infinite; }
        .login-input {
          width: 100%;
          padding: 14px 14px 14px 46px;
          background: rgba(139,92,246,0.07);
          border: 1px solid rgba(139,92,246,0.25);
          border-radius: 12px;
          color: #e2d9f3;
          font-size: 0.92rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, background 0.2s;
        }
        .login-input:focus {
          border-color: rgba(167,139,250,0.6);
          background: rgba(139,92,246,0.12);
        }
        .login-input::placeholder { color: #6b5a8a; }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.5px;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 6px;
        }
        .login-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Background blobs */}
      <div className="blob" style={{
        position: 'absolute', top: -140, right: -120,
        width: 450, height: 450, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <div className="blob" style={{
        position: 'absolute', bottom: -100, left: -100,
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)',
        filter: 'blur(50px)',
        animationDelay: '1.5s',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '15%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,33,182,0.15), transparent 70%)',
        filter: 'blur(35px)',
      }} />

      {/* Stars */}
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: Math.random() * 2 + 1,
          height: Math.random() * 2 + 1,
          borderRadius: '50%',
          background: `rgba(196,181,253,${Math.random() * 0.5 + 0.1})`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }} />
      ))}

      {/* Card */}
      <div className="login-card" style={{
        width: 420,
        padding: '48px 42px',
        background: 'rgba(15,10,30,0.85)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '24px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 60px rgba(124,58,237,0.15), 0 20px 60px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 2,
          background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
          borderRadius: '0 0 4px 4px',
        }} />


        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.9rem',
            fontWeight: 700,
            color: '#e2d9f3',
            margin: '0 0 8px 0',
            letterSpacing: '1px',
          }}>Commit</h1>
          <p style={{
            fontSize: '0.84rem',
            color: '#7c6ca0',
            lineHeight: 1.7,
            margin: 0,
          }}>
            {isRegister ? 'Create your account' : 'Connect your GitHub'}<br />
            Your pet grows every time you commit!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <User size={17} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#7c6ca0', pointerEvents: 'none' }} />
            <input
              className="login-input"
              type="text"
              placeholder="GitHub Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={17} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#7c6ca0', pointerEvents: 'none' }} />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isRegister ? 'Creating account…' : 'Adopting…') : <><span>{isRegister ? 'Create Account' : 'Adopt Your Pet'}</span></>}
          </button>

          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{
                background: 'none',
                border: 'none',
                color: '#7c6ca0',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              {isRegister ? 'Already have an account? Login' : 'New user? Create account'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}