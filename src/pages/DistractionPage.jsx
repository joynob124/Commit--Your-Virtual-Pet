import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getSiteMeta } from '../constants/socialSites';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const POLL_MS = 10_000;

export default function DistractionPage({ username, userId, petId, petName, onPetId, onLogout }) {
  const navigate = useNavigate();
  const [distractions, setDistractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePetId, setActivePetId] = useState(petId);

  useEffect(() => {
    if (petId) setActivePetId(petId);
  }, [petId]);

  const fetchDistractions = useCallback(async () => {
    let id = activePetId ?? petId;

    if (!id && userId) {
      try {
        const petRes = await fetch(`${API_BASE}/api/pets/${userId}`);
        if (petRes.ok) {
          const pet = await petRes.json();
          id = pet.id;
          setActivePetId(id);
          if (onPetId) onPetId(id);
        }
      } catch (e) {
        console.error('Error resolving pet:', e);
      }
    }

    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/pets/${id}/social-log`);
      if (res.ok) {
        const data = await res.json();
        setDistractions(data);
      }
    } catch (e) {
      console.error('Error fetching distractions:', e);
    } finally {
      setLoading(false);
    }
  }, [activePetId, petId, userId, onPetId]);

  useEffect(() => {
    fetchDistractions();

    const interval = setInterval(fetchDistractions, POLL_MS);

    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') fetchDistractions();
    };
    document.addEventListener('visibilitychange', refreshOnFocus);
    window.addEventListener('focus', fetchDistractions);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshOnFocus);
      window.removeEventListener('focus', fetchDistractions);
    };
  }, [fetchDistractions]);

  const totalMinutes = distractions.reduce((a, c) => a + c.total_minutes, 0);
  const totalPenalty = distractions.reduce((a, c) => a + c.total_penalty, 0);
  const worstSite = distractions.length > 0
    ? distractions.reduce((a, b) => (a.total_minutes > b.total_minutes ? a : b))
    : null;

  const worstMeta = worstSite ? getSiteMeta(worstSite.site) : null;

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
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { width: 0; }
        }
        .blob { animation: pulseGlow 5s ease-in-out infinite; }
        .dist-card {
          background: rgba(15,10,30,0.75);
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: 18px;
          padding: 22px 26px;
          transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
          animation: fadeUp 0.45s ease forwards;
          opacity: 0;
        }
        .dist-card:hover {
          border-color: rgba(167,139,250,0.35);
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
        .bar-fill {
          height: 100%;
          border-radius: 4px;
          animation: barGrow 0.8s ease forwards;
        }
      `}</style>

      {/* Background blobs */}
      <div className="blob" style={{
        position: 'fixed', top: -200, right: -200,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,50,50,0.12), transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="blob" style={{
        position: 'fixed', bottom: -150, left: -150,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
        animationDelay: '2.5s',
      }} />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: Math.random() * 2 + 1,
          height: Math.random() * 2 + 1,
          borderRadius: '50%',
          background: `rgba(196,181,253,${Math.random() * 0.4 + 0.05})`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40 }}>
          <button className="back-btn" onClick={() => navigate('/pet')}>
            <ArrowLeft size={15} /> Back to {petName}
          </button>
          <div style={{ textAlign: 'right' }}>
            <button className="back-btn" onClick={onLogout} style={{ marginBottom: 8 }}>Logout</button>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#cdc8db', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              @{username}
            </p>
          </div>
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '3rem', fontWeight: 700,
            margin: '0 0 10px 0', letterSpacing: '4px', lineHeight: 1.1,
            background: 'linear-gradient(135deg, #f87171, #fbbf24)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Distraction Log</h1>
          <p style={{ color: '#6b5a8a', fontSize: '0.88rem', margin: 0, lineHeight: 1.7 }}>
            Every minute wasted here cost your pet health.<br />
            Today's damage report.
          </p>

          {/* Summary strip */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Wasted', value: `${totalMinutes} min` },
              { label: 'Health Lost Today', value: `-${totalPenalty} HP` },
              { label: 'Worst Offender', value: worstMeta ? worstMeta.label : '—' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(139,92,246,0.08)',
                border: `1px solid ${i === 1 ? 'rgba(248,113,113,0.3)' : 'rgba(139,92,246,0.18)'}`,
                borderRadius: '12px', padding: '12px 22px', textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.4rem', fontWeight: 700,
                  color: i === 1 ? '#f87171' : '#a78bfa',
                }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6b5a8a', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distraction Cards */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b5a8a', fontStyle: 'italic' }}>Loading…</p>
        ) : distractions.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: 'rgba(15,10,30,0.6)',
            border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: '18px',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎉</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#a78bfa', margin: '0 0 8px' }}>
              No Distractions Today!
            </p>
            <p style={{ color: '#6b5a8a', fontSize: '0.85rem', margin: 0 }}>
              Your focus is protecting your pet. Keep it up!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {distractions.map((item, i) => {
              const meta = getSiteMeta(item.site);
              const pct = totalMinutes > 0 ? (item.total_minutes / totalMinutes) * 100 : 0;
              return (
                <div key={i} className="dist-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '1.6rem' }}>{meta.emoji}</span>
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 700, color: '#e2d9f3' }}>
                          {meta.label}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#6b5a8a', letterSpacing: '0.5px' }}>{item.site}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c4b5fd' }}>{item.total_minutes} min</div>
                      <div style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 600 }}>−{item.total_penalty} HP</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 6, background: 'rgba(139,92,246,0.12)', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      className="bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${meta.color}99, ${meta.color})`,
                        animationDelay: `${i * 0.08 + 0.3}s`,
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.7rem', color: '#6b5a8a' }}>
                    <span>{pct.toFixed(0)}% of today's wasted time</span>
                    <span>10 min = −1 HP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <p style={{
          textAlign: 'center', marginTop: 48,
          fontSize: '0.78rem', color: '#796b94',
          fontStyle: 'italic', lineHeight: 1.7,
        }}>
          Tracked by the Commit browser extension.<br />
          Your pet is watching. 👁️
        </p>
      </div>
    </div>
  );
}
