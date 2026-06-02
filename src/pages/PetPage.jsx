import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

const BIRD_COLOR = "#ff4d4d";

function PetModel({ isSyncing = false }) {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Body Animation
    if (groupRef.current) {
      groupRef.current.position.y = isSyncing
        ? Math.abs(Math.sin(t * 6)) * 0.4
        : Math.sin(t * 2) * 0.1;
    }

    // Head movement - video-r moto ektu natural
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.15;
      headRef.current.rotation.x = Math.sin(t * 2) * 0.05;
    }

    // Eye Blinking
    const blink = Math.pow(Math.sin(t * 0.5), 20) > 0.95 ? 0.1 : 1;
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;

      // Eyeball movement - mouse ba time onujayi ektu ghura
      const eyeMove = Math.sin(t * 2) * 0.05;
      leftEyeRef.current.rotation.y = eyeMove;
      rightEyeRef.current.rotation.y = eyeMove;
    }

    // Wings
    if (leftWingRef.current && rightWingRef.current) {
      const flap = isSyncing ? Math.sin(t * 20) * 0.8 : Math.sin(t * 5) * 0.2;
      leftWingRef.current.rotation.z = flap + 0.5;
      rightWingRef.current.rotation.z = -flap - 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={BIRD_COLOR} roughness={0.8} />
      </mesh>
      {/* belly */}
      <mesh position={[0, -0.15, 0.38]}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
      {/* head */}
      <group ref={headRef} position={[0, 0.7, 0.2]}>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color={BIRD_COLOR} />
        </mesh>
        {/* crest */}
        <mesh position={[0, 0.55, -0.1]} rotation={[-0.2, 0, 0]}>
          <coneGeometry args={[0.12, 0.5, 16]} />
          <meshStandardMaterial color={BIRD_COLOR} />
        </mesh>

        {/* EYES */}
        <group position={[0, 0.1, 0.5]}>
          {/* Left eye */}
          <mesh position={[-0.25, 0, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="white" roughness={0.1} />
          </mesh>
          <mesh position={[-0.25, 0, 0.14]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial color="#111111" />
          </mesh>
          <mesh position={[-0.19, 0.06, 0.22]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="white" />
          </mesh>

          {/* Right eye */}
          <mesh position={[0.25, 0, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="white" roughness={0.1} />
          </mesh>
          <mesh position={[0.25, 0, 0.14]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial color="#111111" />
          </mesh>
          <mesh position={[0.31, 0.06, 0.22]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>

        {/* BEAK */}
        <mesh position={[0, -0.1, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.25, 16]} />
          <meshStandardMaterial color="#FFA500" />
        </mesh>
      </group>

      {/* Wings & Feet (keep same) */}
      <mesh ref={leftWingRef} position={[-0.85, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.7, 0.4]} />
        <meshStandardMaterial color={BIRD_COLOR} />
      </mesh>
      <mesh ref={rightWingRef} position={[0.85, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.7, 0.4]} />
        <meshStandardMaterial color={BIRD_COLOR} />
      </mesh>
      <group position={[0, -0.8, 0.2]}>
        <mesh position={[-0.3, 0, 0]}>
          <boxGeometry args={[0.25, 0.1, 0.35]} />
          <meshStandardMaterial color="#FFA500" />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.25, 0.1, 0.35]} />
          <meshStandardMaterial color="#FFA500" />
        </mesh>
      </group>
    </group>
  );
}

export default function PetPage({ username, userId, petName, onLogout }) {
  const [health, setHealth] = useState(100);
  const [isSyncing, setIsSyncing] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const [petId, setPetId] = useState(null);
  const [age, setAge] = useState({ y: 0, m: 0, d: 0, h: 0, i: 0, s: 0 });
  const [isDead, setIsDead] = useState(false);

  const navigate = useNavigate();

  // Fetch pet data from server
  const fetchPetData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/pets/${userId}`);
      if (response.ok) {
        const pet = await response.json();
        setPetId(pet.id);
        const birthStr = pet.birth_date.endsWith('Z') ? pet.birth_date : pet.birth_date + 'Z';
        setBirthDate(new Date(birthStr));

        // Check if pet died from server-side decay
        if (pet.is_alive === 0 || pet.health <= 0) {
          setHealth(0);
          setIsDead(true);
        } else {
          setHealth(pet.health);
        }
      } else if (response.status === 404) {
        // No active pet — pet must have died
        setIsDead(true);
        setHealth(0);
      }
    } catch (error) {
      console.error("Error fetching pet data:", error);
    }
  };

  // Load font + initial fetch
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    fetchPetData();
  }, [userId]);

  // Re-sync with server every 5 minutes to get accurate decayed health
  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (!isDead) fetchPetData();
    }, 5 * 60 * 1000);
    return () => clearInterval(syncInterval);
  }, [userId, isDead]);

  // Client-side visual health decay (smooth animation between server syncs)
  // Decay rate: lose 1 health point every 10 minutes and persist to database
  useEffect(() => {
    if (isDead || health <= 0 || !petId) return;

    const decayInterval = setInterval(async () => {
      const nextHealth = Math.max(0, health - 1);
      
      // Update local visual state
      setHealth(nextHealth);

      // Persist directly to the SQLite database
      try {
        await fetch(`http://localhost:3001/api/pets/${petId}/health`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ health: nextHealth }),
        });

        if (nextHealth <= 0) {
          setIsDead(true);
        }
      } catch (error) {
        console.error("Error persisting health decay to backend DB:", error);
      }
    }, 10 * 60 * 1000); // lose 1 hp every 10 minutes

    return () => clearInterval(decayInterval);
  }, [isDead, health, petId]);

  // Handle pet death — show alert and navigate away
  useEffect(() => {
    if (isDead) {
      setTimeout(() => {
        alert(`${petName} has passed away from neglect... 💀\nMake more commits to keep your next pet alive!`);
        navigate("/name");
      }, 500);
    }
  }, [isDead]);

  // Age timer — only runs once birthDate is loaded from the server
  useEffect(() => {
    if (!birthDate) return;

    const computeAge = () => {
      const now = new Date();
      let diff = Math.max(0, Math.floor((now - birthDate) / 1000));
      const y = Math.floor(diff / 31536000); diff %= 31536000;
      const m = Math.floor(diff / 2592000);  diff %= 2592000;
      const d = Math.floor(diff / 86400);    diff %= 86400;
      const h = Math.floor(diff / 3600);     diff %= 3600;
      const i = Math.floor(diff / 60);
      const s = diff % 60;
      setAge({ y, m, d, h, i, s });
    };

    computeAge();
    const interval = setInterval(computeAge, 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  const syncActivity = async (simulate = false) => {
    if (!petId || isDead) return;

    setIsSyncing(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/pets/${petId}/sync-github`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ simulate }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        if (data.healed) {
          setHealth(data.health);
          alert(data.message);
        } else {
          alert(data.message);
        }
      } else {
        alert(data.error || "Failed to sync GitHub commits");
      }
    } catch (error) {
      console.error("Error syncing GitHub:", error);
      alert("Failed to connect to server");
    }

    setTimeout(() => setIsSyncing(false), 3000);
  };

  const status =
    health >= 80
      ? "Thriving! 🌟"
      : health >= 60
        ? "Doing well"
        : health >= 40
          ? "Getting hungry..."
          : health >= 20
            ? "Needs attention! ⚠️"
            : health > 0
              ? "CRITICAL! 🚨"
              : "Dead 💀";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#291a44",
        color: "white",
        fontFamily: "'Raleway', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes pulseGlow { 0%,100%{opacity:.3} 50%{opacity:.6} }
        .blob { animation: pulseGlow 5s ease-in-out infinite; }
        .nav-btn {
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.25);
          color: #c4b5fd;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Raleway', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-btn:hover {
          background: rgba(139,92,246,0.22);
          border-color: rgba(167,139,250,0.5);
        }
      `}</style>

      {/* Background glow */}
      <div
        className="blob"
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="blob"
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(91,33,182,0.15), transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          animationDelay: "2s",
        }}
      />

      {/* Top Left — Title */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          padding: "22px 24px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            margin: 4,
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            letterSpacing: "2px",
            background: "linear-gradient(135deg, #e2d9f3 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {petName}
        </h1>
        <p
          style={{
            margin: "3px 0 0 0",
            fontSize: "0.80rem",
            color: "#6b5a8a",
            letterSpacing: "1px",
          }}
        >
          @{username}
        </p>
      </div>

      {/* Top Right — Nav + Health Card */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10,
          padding: "22px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 12,
        }}
      >
        {/* Nav buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="nav-btn" onClick={() => navigate("/fossils")}>
            Fossil Record
          </button>
          <button className="nav-btn" onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Health Card */}
        <div
          style={{
            background: "rgba(15,10,30,0.75)",
            padding: "20px 24px",
            borderRadius: "16px",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(139,92,246,0.2)",
            minWidth: "220px",
            boxShadow: "0 0 30px rgba(124,58,237,0.1)",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              marginBottom: "6px",
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#aea5c0",
            }}
          >
            Health
          </p>
          <p
            style={{
              fontSize: "2.2rem",
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              color:
                health < 30 ? "#f87171" : health < 60 ? "#fbbf24" : "#a78bfa",
              margin: "0 0 6px 0",
              lineHeight: 1,
            }}
          >
            {health}%
          </p>
          <div
            style={{
              height: 4,
              background: "rgba(139,92,246,0.15)",
              borderRadius: 4,
              marginBottom: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${health}%`,
                background:
                  health < 30
                    ? "#f87171"
                    : health < 60
                      ? "#fbbf24"
                      : "linear-gradient(90deg, #7c3aed, #a855f7)",
                borderRadius: 4,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <p style={{ fontSize: "0.8rem", color: "#7c6ca0", marginBottom: 14 }}>
            Status:{" "}
            <span style={{ fontWeight: 600, color: "#c4b5fd" }}>{status}</span>
          </p>
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <button
              onClick={() => syncActivity(false)}
              style={{
                flex: 1,
                padding: "10px 12px",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.78rem",
                letterSpacing: "0.5px",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Sync Commits
            </button>
            <button
              onClick={() => syncActivity(true)}
              style={{
                flex: 1,
                padding: "10px 12px",
                background: "rgba(139,92,246,0.1)",
                border: "1px dashed rgba(139,92,246,0.5)",
                color: "#c4b5fd",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.78rem",
                letterSpacing: "0.5px",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(139,92,246,0.2)";
                e.target.style.borderColor = "rgba(167,139,250,0.8)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(139,92,246,0.1)";
                e.target.style.borderColor = "rgba(139,92,246,0.5)";
              }}
            >
              Simulate Push
            </button>
          </div>
        </div>

        {/* Age Display */}
        <div style={{ marginBottom: "15px" }}>
          <p
            style={{
              fontSize: "0.9rem",
              marginBottom: "4px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#ab9aca",
            }}
          >
            Life Span
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              fontFamily: "'Cinzel', serif",
              color: "#e2d9f3",
            }}
          >
            {age.y}y {age.m}m {age.d}d{" "}
            <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {age.h}h {age.i}m {age.s}s
            </span>
          </p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        camera={{ position: [0, 0, 5], fov: 40 }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        <PetModel isSyncing={isSyncing} />
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
        />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
