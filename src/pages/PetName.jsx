import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function PetName({ username, userId, onName, onPetId }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, name: name.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        onName(name.trim());
        if (onPetId && data.petId) onPetId(data.petId);
        navigate('/pet');
      } else {
        alert(data.error || 'Failed to create pet');
        setLoading(false);
      }
    } catch (error) {
      console.error('Pet creation error:', error);
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
      fontFamily: "'Raleway', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow { 0%,100%{opacity:.4} 50%{opacity:.7} }
        .name-card { animation: fadeUp 0.6s ease forwards; }
        .bird-float { animation: float 3.5s ease-in-out infinite; display:inline-block; }
        .blob { animation: pulseGlow 4s ease-in-out infinite; }
        .name-input {
          width: 100%;
          padding: 14px 14px 14px 46px;
          background: rgba(139,92,246,0.07);
          border: 1px solid rgba(139,92,246,0.25);
          border-radius: 12px;
          color: #32116e;
          font-size: 0.95rem;
          font-family: 'Raleway', sans-serif;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, background 0.2s;
        }
        .name-input:focus {
          border-color: rgba(167,139,250,0.6);
          background: rgba(139,92,246,0.12);
        }
        .name-input::placeholder { color: #6b5a8a; }
        .name-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Raleway', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.5px;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 6px;
        }
        .name-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .name-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Background blobs */}
      <div className="blob" style={{
        position: 'absolute', top: -140, left: -120,
        width: 450, height: 450, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <div className="blob" style={{
        position: 'absolute', bottom: -100, right: -100,
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)',
        filter: 'blur(50px)',
        animationDelay: '2s',
      }} />

      {/* Stars */}
      {[...Array(28)].map((_, i) => (
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
      <div className="name-card" style={{
        width: 420,
        padding: '48px 42px',
        // background: 'rgba(15,10,30,0.85)',
        background: '#d1c2eb',
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
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 2,
          background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
          borderRadius: '0 0 4px 4px',
        }} />

        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#220a4e',
            margin: '0 0 10px 0',
            letterSpacing: '1px',
          }}>Name your pet</h1>
          <p style={{ fontSize: '0.86rem', color: '#7c6ca0', lineHeight: 1.7, margin: 0 }}>
            Hey <span style={{ color: '#2b1864', fontWeight: 600 }}>{username}</span>!<br/> Give your pet a beautiful name <br/> they'll carry it forever.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            
            <input
              className="name-input"
              type="text"
              placeholder="Set a name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
              maxLength={30}
            />
          </div>

          <button type="submit" className="name-btn" disabled={loading}>
            {loading ? 'Setting name…' : <><span>Save</span></>}
          </button>
        </form>
      </div>
    </div>
  );
}