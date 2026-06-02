import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Skull, Calendar, Heart, GitCommit } from 'lucide-react';

export default function FossilPage({ username, userId, petName, onLogout }) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [fossils, setFossils] = useState([]);

  useEffect(() => {
    const fetchFossils = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/fossils/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFossils(data);
        }
      } catch (error) {
        console.error('Error fetching fossils:', error);
      }
    };

    fetchFossils();
  }, [userId]);

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: '#190d2e',
      color: 'white',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes pulseGlow { 0%,100%{opacity:.3} 50%{opacity:.6} }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .blob { animation: pulseGlow 5s ease-in-out infinite; }
        .fossil-card {
          background: rgba(15,10,30,0.75);
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: 18px;
          padding: 28px;
          transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
          cursor: default;
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }
        .fossil-card:hover {
          border-color: rgba(167,139,250,0.4);
          transform: translateY(-3px);
          box-shadow: 0 8px 40px rgba(124,58,237,0.15);
        }
        .back-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.2);
          color: #c4b5fd;
          padding: 9px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: background 0.2s, border-color 0.2s;
        }
        .back-btn:hover {
          background: rgba(139,92,246,0.2);
          border-color: rgba(167,139,250,0.45);
        }
        .stat-pill {
          display: flex; align-items: center; gap: 6px;
          background: rgba(139,92,246,0.08);
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.78rem;
          color: #9d8abf;
          font-weight: 500;
        }
      `}</style>

      {/* Background blobs */}
      <div className="blob" style={{
        position: 'fixed', top: -200, right: -200,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="blob" style={{
        position: 'fixed', bottom: -150, left: -150,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,33,182,0.12), transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
        animationDelay: '2.5s',
      }} />

      {/* Stars */}
      {[...Array(25)].map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: Math.random() * 2 + 1,
          height: Math.random() * 2 + 1,
          borderRadius: '50%',
          background: `rgba(196,181,253,${Math.random() * 0.4 + 0.05})`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <button className="back-btn" onClick={() => navigate('/pet')}>
              <ArrowLeft size={15} /> Back to {petName}
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="back-btn" onClick={onLogout} style={{ marginBottom: 8 }}>
              Logout
            </button>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#cdc8db', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>
              @{username}
            </p>
          </div>
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '3rem',
            fontWeight: 700,
            margin: '0 0 10px 0',
            letterSpacing: '4px',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #e2d9f3, #ab9dd4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Fossil Record</h1>
          <p style={{ color: '#6b5a8a', fontSize: '0.88rem', margin: 0, lineHeight: 1.7 }}>
            A memorial to every bird that came before.<br />
          </p>

          {/* Summary strip */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 16,
            marginTop: 24, flexWrap: 'wrap',
          }}>
            {[
              { label: 'Total Generations', value: fossils.length },
              { label: 'Longest Lived', value: fossils.length > 0 ? `${Math.max(...fossils.map(f => f.days_lived))} days` : '0 days' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.18)',
                borderRadius: '12px',
                padding: '12px 22px',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: '#a78bfa' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b5a8a', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fossil Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {fossils.map((fossil, i) => (
            <div
              key={fossil.id}
              className="fossil-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>

                {/* Left: identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.1rem', fontWeight: 700,
                        color: '#e2d9f3', margin: 0,
                      }}>{fossil.name}</h3>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 700,
                        color: '#afc9d3', background: '#afc9d318',
                        border: '1px solid #afc9d335',
                        padding: '2px 10px', borderRadius: '20px',
                        letterSpacing: '1px', textTransform: 'uppercase',
                      }}>Gen {fossil.generation}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b5a8a', fontStyle: 'italic' }}>
                      "{fossil.cause_of_death}"
                    </p>
                  </div>
                </div>

                {/* Right: stats */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div className="stat-pill">
                    {new Date(fossil.birth_date).toLocaleDateString()} → {new Date(fossil.death_date).toLocaleDateString()}
                  </div>
                  <div className="stat-pill">
                    Age : {fossil.days_lived} days
                  </div>
                  
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', marginTop: 48,
          fontSize: '0.78rem', color: '#796b94',
          fontStyle: 'italic', lineHeight: 1.7,
        }}>
          Rest in peace.<br />
        </p>
      </div>
    </div>
  );
}