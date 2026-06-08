import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Calendar, Heart, RefreshCw } from "lucide-react";
import { formatPetAppearance } from "../constants/petCatalog";

const API_BASE = "http://localhost:3001";

export default function LeaderboardPage({
  username,
  userId,
  petName,
  onLogout,
}) {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    try {
      const response = await fetch(`${API_BASE}/api/leaderboard`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  function calculateAgeString(pet) {
    const { days_lived, hours_lived, minutes_lived } = pet;
    if (days_lived > 0) {
      return `${days_lived}d ${hours_lived}h`;
    }
    if (hours_lived > 0) {
      return `${hours_lived}h ${minutes_lived}m`;
    }
    return `${minutes_lived}m`;
  }

  const getRankDecoration = (rank) => {
    if (rank === 1)
      return {
        color: "#fbc531",
        bg: "rgba(251,197,49,0.08)",
        border: "rgba(251,197,49,0.3)",
        medal: "🥇",
      };
    if (rank === 2)
      return {
        color: "#dcdde1",
        bg: "rgba(220,221,225,0.08)",
        border: "rgba(220,221,225,0.3)",
        medal: "🥈",
      };
    if (rank === 3)
      return {
        color: "#e58e26",
        bg: "rgba(229,142,38,0.08)",
        border: "rgba(229,142,38,0.3)",
        medal: "🥉",
      };
    return {
      color: "#a78bfa",
      bg: "rgba(139,92,246,0.05)",
      border: "rgba(139,92,246,0.15)",
      medal: `#${rank}`,
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#190d2e",
        color: "white",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes pulseGlow { 0%,100%{opacity:.3} 50%{opacity:.6} }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .blob { animation: pulseGlow 5s ease-in-out infinite; }
        .leaderboard-card {
          background: rgba(15,10,30,0.75);
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: 18px;
          padding: 20px 24px;
          transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
          cursor: default;
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .leaderboard-card:hover {
          border-color: rgba(167,139,250,0.45);
          transform: translateY(-2px);
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
        .spin-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* Background blobs */}
      <div
        className="blob"
        style={{
          position: "fixed",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        className="blob"
        style={{
          position: "fixed",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(91,33,182,0.12), transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0,
          animationDelay: "2.5s",
        }}
      />

      {/* Stars */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            borderRadius: "50%",
            background: `rgba(196,181,253,${Math.random() * 0.4 + 0.05})`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 860,
          margin: "0 auto",
          padding: "36px 24px 60px",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div>
            <button className="back-btn" onClick={() => navigate("/pet")}>
              <ArrowLeft size={15} /> Back to {petName || "Home"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="back-btn"
              onClick={() => fetchLeaderboard(true)}
              title="Refresh"
            >
              <RefreshCw size={15} className={refreshing ? "spin-icon" : ""} />
            </button>
            <button className="back-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "3rem",
              fontWeight: 700,
              margin: "0 0 10px 0",
              letterSpacing: "4px",
              lineHeight: 1.1,
              background: "linear-gradient(135deg, #e2d9f3, #ab9dd4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Hall of Companions
          </h1>
          <p
            style={{
              color: "#6b5a8a",
              fontSize: "0.88rem",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            The top virtual pets ranked by health and age.
            <br />
            Who is the most dedicated developer?
          </p>
        </div>

        {/* Leaderboard List */}
        {loading ? (
          <p
            style={{
              textAlign: "center",
              color: "#6b5a8a",
              fontStyle: "italic",
              marginTop: 40,
            }}
          >
            Summoning companions...
          </p>
        ) : leaderboard.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              background: "rgba(15,10,30,0.6)",
              border: "1px solid rgba(139,92,246,0.15)",
              borderRadius: "18px",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🌌</div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.4rem",
                color: "#a78bfa",
                margin: "0",
              }}
            >
              The Realm is Empty
            </p>
            <p style={{ color: "#6b5a8a", fontSize: "0.85rem", marginTop: 8 }}>
              No active pets were found. Give birth to a companion to claim rank
              #1!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {leaderboard.map((pet, i) => {
              const rank = i + 1;
              const dec = getRankDecoration(rank);
              const isCurrentUser = pet.username === username;

              return (
                <div
                  key={pet.id}
                  className="leaderboard-card"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    background: isCurrentUser
                      ? "rgba(139,92,246,0.12)"
                      : "rgba(15,10,30,0.75)",
                    borderColor: isCurrentUser
                      ? "rgba(139,92,246,0.35)"
                      : "rgba(139,92,246,0.15)",
                  }}
                >
                  {/* Left Section: Rank + Info */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 20 }}
                  >
                    {/* Rank Badge */}
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: dec.bg,
                        border: `1px solid ${dec.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: rank <= 3 ? "1.4rem" : "1rem",
                        fontWeight: 700,
                        color: dec.color,
                      }}
                    >
                      {dec.medal}
                    </div>

                    {/* Name + Owner */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "#e2d9f3",
                            margin: 0,
                          }}
                        >
                          {pet.name}
                        </h3>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: dec.color,
                            background: dec.bg,
                            border: `1px solid ${dec.border}`,
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {formatPetAppearance(
                            pet.pet_type,
                            pet.theme_index,
                            pet.pet_color,
                            pet.pet_color_sick,
                          )}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "0.78rem",
                          color: "#8b7ca6",
                        }}
                      >
                        Owner:{" "}
                        <span
                          style={{
                            color: isCurrentUser ? "#c4b5fd" : "#aea5c0",
                            fontWeight: isCurrentUser ? 600 : 400,
                          }}
                        >
                          @{pet.username}
                        </span>{" "}
                        {isCurrentUser && "(You)"}
                      </p>
                    </div>
                  </div>

                  {/* Right Section: Health + Age */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      textAlign: "right",
                    }}
                  >
                    {/* Health representation */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        minWidth: 120,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.72rem",
                          color: "#cdc8db",
                        }}
                      >
                        <span>Health</span>
                        <span
                          style={{
                            fontWeight: 600,
                            color:
                              pet.health < 35
                                ? "#f87171"
                                : pet.health < 65
                                  ? "#fbbf24"
                                  : "#a78bfa",
                          }}
                        >
                          {pet.health}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: "rgba(139,92,246,0.15)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pet.health}%`,
                            background:
                              pet.health < 35
                                ? "linear-gradient(90deg, #ef4444, #f87171)"
                                : pet.health < 65
                                  ? "linear-gradient(90deg, #d97706, #fbbf24)"
                                  : "linear-gradient(90deg, #7c3aed, #a78bfa)",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </div>

                    {/* Age Badge */}
                    <div className="stat-pill">
                      <Calendar size={13} style={{ marginRight: 2 }} />
                      Age: {calculateAgeString(pet)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            marginTop: 54,
            fontSize: "0.76rem",
            color: "#796b94",
            fontStyle: "italic",
            lineHeight: 1.7,
          }}
        >
          Keep committing on GitHub to protect your companion's rank. 💻🔥
        </p>
      </div>
    </div>
  );
}
