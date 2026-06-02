import React from "react";

/** ─────────────────────────────────────────────────────────────
 *  ExtraPetBody — torsos, tails, belly patches, coils, etc.
 * ───────────────────────────────────────────────────────────── */
export function ExtraPetBody({
  petType,
  currentPetColor,
  woolColor,
  patchColor,
  accentColor,
}) {
  /* ── HAMSTER ─────────────────────────────────────────────── */
  if (petType === "hamster") {
    return (
      <>
        {/* Main chubby body */}
        <mesh position={[0, -0.05, 0]} scale={[1.15, 0.95, 1.1]}>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.85} />
        </mesh>
        {/* Cheek pouches */}
        <mesh position={[-0.42, 0.05, 0.14]} scale={[0.62, 0.55, 0.55]}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color={woolColor} roughness={1} />
        </mesh>
        <mesh position={[0.42, 0.05, 0.14]} scale={[0.62, 0.55, 0.55]}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color={woolColor} roughness={1} />
        </mesh>
        {/* White belly */}
        <mesh position={[0, -0.14, 0.34]} scale={[0.88, 0.7, 0.82]}>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color="white" roughness={1} />
        </mesh>
        {/* Tiny nub tail */}
        <mesh position={[0, -0.1, -0.54]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={patchColor} roughness={0.9} />
        </mesh>
        {/* Front paws */}
        <mesh position={[-0.28, -0.44, 0.28]} scale={[1, 0.55, 1.2]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.9} />
        </mesh>
        <mesh position={[0.28, -0.44, 0.28]} scale={[1, 0.55, 1.2]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.9} />
        </mesh>
        {/* Back feet */}
        <mesh position={[-0.22, -0.5, -0.1]} scale={[1.1, 0.5, 1.6]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.9} />
        </mesh>
        <mesh position={[0.22, -0.5, -0.1]} scale={[1.1, 0.5, 1.6]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.9} />
        </mesh>
      </>
    );
  }

  /* ── DUCK ────────────────────────────────────────────────── */
  if (petType === "duck") {
    return (
      <>
        {/* Body */}
        <mesh position={[0, -0.08, 0]} scale={[1.1, 0.98, 1.18]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.75} />
        </mesh>
        {/* White chest/belly */}
        <mesh position={[0, -0.1, 0.38]} scale={[0.85, 0.78, 0.7]}>
          <sphereGeometry args={[0.48, 24, 24]} />
          <meshStandardMaterial color="white" roughness={1} />
        </mesh>
        {/* Tail feathers — fanned upward */}
        <mesh position={[0, 0.18, -0.68]} rotation={[-0.55, 0, 0]}>
          <coneGeometry args={[0.22, 0.42, 12]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        <mesh position={[-0.14, 0.28, -0.72]} rotation={[-0.5, 0.3, 0.2]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshStandardMaterial color={patchColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.14, 0.28, -0.72]} rotation={[-0.5, -0.3, -0.2]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshStandardMaterial color={patchColor} roughness={0.8} />
        </mesh>
        {/* Webbed feet */}
        <mesh position={[-0.18, -0.65, 0.12]} scale={[1.6, 0.28, 1.3]}>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.18, -0.65, 0.12]} scale={[1.6, 0.28, 1.3]}>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.6} />
        </mesh>
        {/* Leg stubs */}
        <mesh position={[-0.18, -0.52, 0.1]}>
          <capsuleGeometry args={[0.06, 0.1, 6, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.18, -0.52, 0.1]}>
          <capsuleGeometry args={[0.06, 0.1, 6, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.6} />
        </mesh>
      </>
    );
  }

  /* ── CHICK ───────────────────────────────────────────────── */
  if (petType === "chick") {
    return (
      <>
        {/* Fluffy round body */}
        <mesh position={[0, -0.04, 0]} scale={[1.08, 1.08, 1.08]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={woolColor} roughness={1} />
        </mesh>
        {/* Belly fluff, slightly lighter */}
        <mesh position={[0, -0.1, 0.3]} scale={[0.78, 0.65, 0.6]}>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color={accentColor} roughness={1} />
        </mesh>
        {/* Leg stubs */}
        <mesh position={[-0.16, -0.58, 0.1]}>
          <capsuleGeometry args={[0.055, 0.14, 6, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.16, -0.58, 0.1]}>
          <capsuleGeometry args={[0.055, 0.14, 6, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.7} />
        </mesh>
        {/* Little feet */}
        <mesh position={[-0.16, -0.7, 0.15]} scale={[1.4, 0.3, 1.5]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.16, -0.7, 0.15]} scale={[1.4, 0.3, 1.5]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.7} />
        </mesh>
        {/* Tiny tail tuft */}
        <mesh position={[0, 0.12, -0.52]} rotation={[-0.5, 0, 0]}>
          <coneGeometry args={[0.1, 0.22, 8]} />
          <meshStandardMaterial color={woolColor} roughness={1} />
        </mesh>
      </>
    );
  }

  /* ── SEAL ────────────────────────────────────────────────── */
  if (petType === "seal") {
    return (
      <>
        {/* Main elongated body */}
        <mesh
          position={[0, -0.1, 0]}
          rotation={[0.15, 0, 0]}
          scale={[1.3, 0.72, 1.12]}
        >
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.7} />
        </mesh>
        {/* Belly patch */}
        <mesh position={[0, -0.06, 0.38]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color={patchColor} roughness={0.8} />
        </mesh>
        {/* Fore-flippers — rounded, not boxes */}
        <mesh
          position={[-0.72, -0.2, 0.22]}
          rotation={[0.1, 0, 0.45]}
          scale={[0.28, 0.14, 0.72]}
        >
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.7} />
        </mesh>
        <mesh
          position={[0.72, -0.2, 0.22]}
          rotation={[0.1, 0, -0.45]}
          scale={[0.28, 0.14, 0.72]}
        >
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.7} />
        </mesh>
        {/* Rear flippers — fanned out from tail end */}
        <mesh
          position={[-0.28, -0.42, -0.7]}
          rotation={[0.4, 0, 0.3]}
          scale={[0.6, 0.18, 0.85]}
        >
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.7} />
        </mesh>
        <mesh
          position={[0.28, -0.42, -0.7]}
          rotation={[0.4, 0, -0.3]}
          scale={[0.6, 0.18, 0.85]}
        >
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.7} />
        </mesh>
        {/* Tail nub between rear flippers */}
        <mesh
          position={[0, -0.28, -0.8]}
          rotation={[0.5, 0, 0]}
          scale={[0.6, 0.5, 1.0]}
        >
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.7} />
        </mesh>
      </>
    );
  }

  /* ── WOLF ────────────────────────────────────────────────── */
  if (petType === "wolf") {
    return (
      <>
        {/* Main torso */}
        <mesh
          position={[0, -0.05, -0.15]}
          rotation={[0.1, 0, 0]}
          scale={[1.05, 1, 1.25]}
        >
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.75} />
        </mesh>
        {/* Chest fluff / ruff */}
        <mesh position={[0, -0.08, 0.3]} scale={[1.05, 1.15, 0.75]}>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshStandardMaterial color={patchColor} roughness={0.9} />
        </mesh>
        {/* Fluffy tail */}
        <mesh position={[0, 0.08, -0.72]} rotation={[-0.45, 0, 0]}>
          <capsuleGeometry args={[0.1, 0.44, 6, 12]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.85} />
        </mesh>
        {/* Tail tip — white/light */}
        <mesh position={[0, 0.42, -1.02]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={patchColor} roughness={0.85} />
        </mesh>
        {/* Front legs */}
        <mesh position={[-0.24, -0.44, 0.22]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.24, -0.44, 0.22]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        {/* Front paws */}
        <mesh position={[-0.24, -0.64, 0.26]} scale={[1.2, 0.55, 1.3]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={patchColor} roughness={0.9} />
        </mesh>
        <mesh position={[0.24, -0.64, 0.26]} scale={[1.2, 0.55, 1.3]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={patchColor} roughness={0.9} />
        </mesh>
        {/* Back legs */}
        <mesh position={[-0.24, -0.44, -0.36]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.24, -0.44, -0.36]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        {/* Back paws */}
        <mesh position={[-0.24, -0.64, -0.32]} scale={[1.2, 0.55, 1.3]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={patchColor} roughness={0.9} />
        </mesh>
        <mesh position={[0.24, -0.64, -0.32]} scale={[1.2, 0.55, 1.3]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={patchColor} roughness={0.9} />
        </mesh>
      </>
    );
  }

  /* ── SNAKE ───────────────────────────────────────────────── */
  if (petType === "snake") {
    return (
      <>
        {/* Main coil */}
        <mesh position={[0, -0.35, 0.1]} rotation={[0.4, 0.3, 0]}>
          <torusGeometry args={[0.42, 0.18, 16, 32, Math.PI * 1.35]} />
          <meshStandardMaterial
            color={currentPetColor}
            roughness={0.6}
            metalness={0.12}
          />
        </mesh>
        {/* Body segment emerging from coil */}
        <mesh position={[0.35, -0.2, 0.35]} rotation={[0.2, -0.5, 0.8]}>
          <capsuleGeometry args={[0.14, 0.5, 8, 16]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.55} />
        </mesh>
        {/* Belly-coloured underside segment */}
        <mesh position={[-0.3, -0.28, -0.15]} rotation={[0.1, 0.4, -0.5]}>
          <capsuleGeometry args={[0.12, 0.45, 8, 16]} />
          <meshStandardMaterial color={patchColor} roughness={0.55} />
        </mesh>
        {/* Scale pattern bands — alternating rings */}
        {[-0.18, -0.02, 0.14, 0.3].map((y, i) => (
          <mesh key={i} position={[0, y - 0.35, 0.08]} rotation={[0.4, 0.3, 0]}>
            <torusGeometry args={[0.42, 0.045, 8, 32, Math.PI * 1.35]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? accentColor : patchColor}
              roughness={0.5}
            />
          </mesh>
        ))}
        {/* Tapering tail tip */}
        <mesh position={[-0.5, -0.44, -0.38]} rotation={[0.1, 0.5, -0.6]}>
          <coneGeometry args={[0.06, 0.32, 10]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.6} />
        </mesh>
      </>
    );
  }

  /* ── DRAGON ──────────────────────────────────────────────── */
  if (petType === "dragon") {
    return (
      <>
        {/* Main body */}
        <mesh position={[0, 0, 0]} scale={[1.1, 1.05, 1.15]}>
          <sphereGeometry args={[0.68, 32, 32]} />
          <meshStandardMaterial
            color={currentPetColor}
            roughness={0.75}
            metalness={0.1}
          />
        </mesh>
        {/* Belly */}
        <mesh position={[0, -0.05, 0.42]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color={patchColor}
            roughness={0.9}
            emissive={accentColor}
            emissiveIntensity={0.12}
          />
        </mesh>
        {/* Tail — segmented */}
        <mesh position={[0, -0.18, -0.68]} rotation={[-0.4, 0, 0]}>
          <coneGeometry args={[0.16, 0.72, 8]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.5, -1.06]} rotation={[-0.7, 0, 0]}>
          <coneGeometry args={[0.09, 0.42, 8]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        {/* Tail spike */}
        <mesh position={[0, -0.72, -1.32]} rotation={[-0.8, 0, 0]}>
          <coneGeometry args={[0.06, 0.28, 5]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.25}
          />
        </mesh>
        {/* Wings */}
        <mesh
          position={[-0.85, 0.22, -0.1]}
          rotation={[0, 0.2, 0.35]}
          scale={[0.32, 1.1, 0.7]}
        >
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.75} />
        </mesh>
        <mesh
          position={[0.85, 0.22, -0.1]}
          rotation={[0, -0.2, -0.35]}
          scale={[0.32, 1.1, 0.7]}
        >
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.75} />
        </mesh>
        {/* Wing membrane accent */}
        <mesh
          position={[-1.08, 0.5, -0.12]}
          rotation={[0, 0.2, 0.2]}
          scale={[0.15, 0.8, 0.5]}
        >
          <sphereGeometry args={[0.5, 10, 10]} />
          <meshStandardMaterial
            color={patchColor}
            roughness={0.85}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh
          position={[1.08, 0.5, -0.12]}
          rotation={[0, -0.2, -0.2]}
          scale={[0.15, 0.8, 0.5]}
        >
          <sphereGeometry args={[0.5, 10, 10]} />
          <meshStandardMaterial
            color={patchColor}
            roughness={0.85}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Front claws */}
        <mesh position={[-0.32, -0.72, 0.28]}>
          <capsuleGeometry args={[0.07, 0.28, 6, 10]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.32, -0.72, 0.28]}>
          <capsuleGeometry args={[0.07, 0.28, 6, 10]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        {[-0.22, -0.32, -0.42].map((z, i) => (
          <mesh key={`lc${i}`} position={[-0.32 + (i - 1) * 0.06, -0.9, z]}>
            <coneGeometry args={[0.03, 0.1, 6]} />
            <meshStandardMaterial color="#111111" roughness={0.4} />
          </mesh>
        ))}
        {[-0.22, -0.32, -0.42].map((z, i) => (
          <mesh key={`rc${i}`} position={[0.32 + (i - 1) * 0.06, -0.9, z]}>
            <coneGeometry args={[0.03, 0.1, 6]} />
            <meshStandardMaterial color="#111111" roughness={0.4} />
          </mesh>
        ))}
        {/* Spine ridge */}
        {[0, 0.18, 0.36].map((t, i) => (
          <mesh
            key={`sp${i}`}
            position={[0, 0.72 - i * 0.28, -0.18 - i * 0.25]}
            rotation={[0.5 + i * 0.1, 0, 0]}
          >
            <coneGeometry args={[0.055 - i * 0.01, 0.22 - i * 0.04, 4]} />
            <meshStandardMaterial
              color={patchColor}
              emissive={accentColor}
              emissiveIntensity={0.15}
            />
          </mesh>
        ))}
      </>
    );
  }

  /* ── SCORPION ────────────────────────────────────────────── */
  if (petType === "scorpion") {
    return (
      <>
        {/* Main flat body / cephalothorax */}
        <mesh position={[0, -0.24, 0]} scale={[1.22, 0.52, 1.05]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color={currentPetColor}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
        {/* Abdomen segments behind */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={`ab${i}`}
            position={[0, -0.18 + i * 0.06, -0.48 - i * 0.24]}
            scale={[1.05 - i * 0.12, 0.48 - i * 0.04, 0.88 - i * 0.06]}
          >
            <sphereGeometry args={[0.36, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? currentPetColor : patchColor}
              roughness={0.78}
              metalness={0.18}
            />
          </mesh>
        ))}
        {/* Claws — left */}
        <mesh position={[-0.52, -0.32, 0.36]} rotation={[0, 0, 0.55]}>
          <boxGeometry args={[0.36, 0.09, 0.14]} />
          <meshStandardMaterial color={patchColor} roughness={0.7} />
        </mesh>
        <mesh position={[-0.74, -0.24, 0.5]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color={patchColor} roughness={0.7} />
        </mesh>
        <mesh position={[-0.82, -0.36, 0.5]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={patchColor} roughness={0.7} />
        </mesh>
        {/* Claws — right */}
        <mesh position={[0.52, -0.32, 0.36]} rotation={[0, 0, -0.55]}>
          <boxGeometry args={[0.36, 0.09, 0.14]} />
          <meshStandardMaterial color={patchColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.74, -0.24, 0.5]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color={patchColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.82, -0.36, 0.5]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={patchColor} roughness={0.7} />
        </mesh>
        {/* 8 legs — 4 per side */}
        {[-1, 1].map((side) =>
          [0, 1, 2, 3].map((i) => (
            <mesh
              key={`leg_${side}_${i}`}
              position={[side * (0.42 + i * 0.04), -0.38, 0.12 - i * 0.2]}
              rotation={[0, 0, side * (0.65 + i * 0.1)]}
            >
              <capsuleGeometry args={[0.03, 0.44, 4, 8]} />
              <meshStandardMaterial color={currentPetColor} roughness={0.75} />
            </mesh>
          )),
        )}
        {/* Tail — 4 segments curving up */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={`ts${i}`}
            position={[0, -0.08 + i * 0.28, -0.78 - i * 0.18]}
            rotation={[-0.55 - i * 0.15, 0, 0]}
            scale={[1 - i * 0.06, 1 - i * 0.06, 1 - i * 0.06]}
          >
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? currentPetColor : patchColor}
              roughness={0.75}
              metalness={0.18}
            />
          </mesh>
        ))}
        {/* Stinger */}
        <mesh position={[0, 1.0, -1.48]} rotation={[-0.9, 0, 0]}>
          <coneGeometry args={[0.07, 0.28, 8]} />
          <meshStandardMaterial
            color={accentColor}
            emissive="#ff4400"
            emissiveIntensity={0.55}
          />
        </mesh>
        {/* Venom drop */}
        <mesh position={[0, 1.18, -1.62]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color="#44ff44"
            emissive="#22cc22"
            emissiveIntensity={0.9}
          />
        </mesh>
      </>
    );
  }

  return null;
}

/** ─────────────────────────────────────────────────────────────
 *  ExtraPetHeadFeatures — ears, beaks, snouts, hoods, etc.
 * ───────────────────────────────────────────────────────────── */
export function ExtraPetHeadFeatures({
  petType,
  currentPetColor,
  woolColor,
  patchColor,
  accentColor,
  leftEarRef,
  rightEarRef,
  leftEyeRef,
  rightEyeRef,
}) {
  /* ── HAMSTER ─────────────────────────────────────────────── */
  if (petType === "hamster") {
    return (
      <>
        {/* 3D ear cups — left */}
        <mesh ref={leftEarRef} position={[-0.3, 0.3, 0.02]}>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color={patchColor} roughness={0.9} />
        </mesh>
        <mesh position={[-0.3, 0.3, 0.1]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#f4b0b0" roughness={1} />
        </mesh>
        {/* 3D ear cups — right */}
        <mesh ref={rightEarRef} position={[0.3, 0.3, 0.02]}>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color={patchColor} roughness={0.9} />
        </mesh>
        <mesh position={[0.3, 0.3, 0.1]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#f4b0b0" roughness={1} />
        </mesh>
        {/* Tiny pink nose */}
        <mesh position={[0, 0.02, 0.42]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#e07070" roughness={0.7} />
        </mesh>
        {/* Eyes — white sclera */}
        <mesh position={[-0.18, 0.12, 0.38]}>
          <sphereGeometry args={[0.1, 14, 14]} />
          <meshStandardMaterial color="white" roughness={0.1} />
        </mesh>
        <mesh position={[0.18, 0.12, 0.38]}>
          <sphereGeometry args={[0.1, 14, 14]} />
          <meshStandardMaterial color="white" roughness={0.1} />
        </mesh>
        {/* Pupils */}
        <mesh ref={leftEyeRef} position={[-0.18, 0.12, 0.46]}>
          <sphereGeometry args={[0.062, 12, 12]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.18, 0.12, 0.46]}>
          <sphereGeometry args={[0.062, 12, 12]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        {/* Eye shine */}
        <mesh position={[-0.16, 0.15, 0.5]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.2, 0.15, 0.5]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </>
    );
  }

  /* ── DUCK ────────────────────────────────────────────────── */
  if (petType === "duck") {
    return (
      <>
        {/* Upper beak */}
        <mesh position={[0, -0.04, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.24, 12]} />
          <meshStandardMaterial color={accentColor} roughness={0.5} />
        </mesh>
        {/* Lower beak */}
        <mesh position={[0, -0.1, 0.5]} rotation={[Math.PI / 2 + 0.3, 0, 0]}>
          <coneGeometry args={[0.08, 0.18, 12]} />
          <meshStandardMaterial color={accentColor} roughness={0.5} />
        </mesh>
        {/* Nostril dots */}
        <mesh position={[-0.04, -0.02, 0.6]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#b07000" roughness={0.8} />
        </mesh>
        <mesh position={[0.04, -0.02, 0.6]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#b07000" roughness={0.8} />
        </mesh>
        {/* Eyes — white sclera */}
        <mesh position={[-0.26, 0.1, 0.4]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial color="white" roughness={0.1} />
        </mesh>
        <mesh position={[0.26, 0.1, 0.4]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial color="white" roughness={0.1} />
        </mesh>
        {/* Pupils */}
        <mesh ref={leftEyeRef} position={[-0.26, 0.1, 0.49]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.26, 0.1, 0.49]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        {/* Eye shine */}
        <mesh position={[-0.23, 0.14, 0.54]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.29, 0.14, 0.54]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </>
    );
  }

  /* ── CHICK ───────────────────────────────────────────────── */
  if (petType === "chick") {
    return (
      <>
        {/* Beak — upper */}
        <mesh position={[0, -0.04, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.07, 0.18, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.5} />
        </mesh>
        {/* Beak — lower */}
        <mesh position={[0, -0.09, 0.5]} rotation={[Math.PI / 2 + 0.35, 0, 0]}>
          <coneGeometry args={[0.055, 0.13, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.5} />
        </mesh>
        {/* Top head tuft */}
        <mesh position={[0, 0.44, 0.18]} rotation={[-0.2, 0, 0]}>
          <coneGeometry args={[0.06, 0.24, 6]} />
          <meshStandardMaterial color={woolColor} roughness={1} />
        </mesh>
        <mesh position={[-0.06, 0.42, 0.14]} rotation={[-0.1, 0.2, 0.3]}>
          <coneGeometry args={[0.045, 0.18, 6]} />
          <meshStandardMaterial color={woolColor} roughness={1} />
        </mesh>
        <mesh position={[0.06, 0.42, 0.14]} rotation={[-0.1, -0.2, -0.3]}>
          <coneGeometry args={[0.045, 0.18, 6]} />
          <meshStandardMaterial color={woolColor} roughness={1} />
        </mesh>
        {/* Eyes — white sclera */}
        <mesh position={[-0.2, 0.1, 0.42]}>
          <sphereGeometry args={[0.1, 14, 14]} />
          <meshStandardMaterial color="white" roughness={0.1} />
        </mesh>
        <mesh position={[0.2, 0.1, 0.42]}>
          <sphereGeometry args={[0.1, 14, 14]} />
          <meshStandardMaterial color="white" roughness={0.1} />
        </mesh>
        {/* Pupils */}
        <mesh ref={leftEyeRef} position={[-0.2, 0.1, 0.5]}>
          <sphereGeometry args={[0.062, 12, 12]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.2, 0.1, 0.5]}>
          <sphereGeometry args={[0.062, 12, 12]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        {/* Eye shine */}
        <mesh position={[-0.17, 0.14, 0.55]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.23, 0.14, 0.55]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </>
    );
  }

  /* ── SEAL ────────────────────────────────────────────────── */
  if (petType === "seal") {
    return (
      <>
        {/* Snout */}
        <mesh position={[0, -0.06, 0.52]} scale={[1, 0.72, 0.88]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={patchColor} roughness={0.8} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, -0.02, 0.68]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#222222" roughness={0.9} />
        </mesh>
        {/* Whiskers — left */}
        <mesh position={[-0.12, -0.06, 0.68]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.01, 0.26, 4, 6]} />
          <meshStandardMaterial color="#cccccc" roughness={0.6} />
        </mesh>
        <mesh position={[-0.12, -0.1, 0.66]} rotation={[0, 0, 0.05]}>
          <capsuleGeometry args={[0.01, 0.24, 4, 6]} />
          <meshStandardMaterial color="#cccccc" roughness={0.6} />
        </mesh>
        {/* Whiskers — right */}
        <mesh position={[0.12, -0.06, 0.68]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.01, 0.26, 4, 6]} />
          <meshStandardMaterial color="#cccccc" roughness={0.6} />
        </mesh>
        <mesh position={[0.12, -0.1, 0.66]} rotation={[0, 0, -0.05]}>
          <capsuleGeometry args={[0.01, 0.24, 4, 6]} />
          <meshStandardMaterial color="#cccccc" roughness={0.6} />
        </mesh>
        {/* Eyes — large glossy seal eyes */}
        <mesh position={[-0.22, 0.14, 0.46]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="white" roughness={0.05} />
        </mesh>
        <mesh position={[0.22, 0.14, 0.46]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="white" roughness={0.05} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.22, 0.14, 0.56]}>
          <sphereGeometry args={[0.092, 14, 14]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.22, 0.14, 0.56]}>
          <sphereGeometry args={[0.092, 14, 14]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        {/* Double catchlights per eye */}
        <mesh position={[-0.19, 0.18, 0.62]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[-0.24, 0.12, 0.61]}>
          <sphereGeometry args={[0.016, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.25, 0.18, 0.62]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.2, 0.12, 0.61]}>
          <sphereGeometry args={[0.016, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </>
    );
  }

  /* ── WOLF ────────────────────────────────────────────────── */
  if (petType === "wolf") {
    return (
      <>
        {/* Left ear — outer */}
        <mesh
          ref={leftEarRef}
          position={[-0.26, 0.36, -0.05]}
          rotation={[0.05, 0.05, 0.25]}
        >
          <coneGeometry args={[0.12, 0.32, 4]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.75} />
        </mesh>
        {/* Left ear — inner pink */}
        <mesh position={[-0.25, 0.36, 0.0]} rotation={[0.05, 0.05, 0.25]}>
          <coneGeometry args={[0.07, 0.2, 4]} />
          <meshStandardMaterial color="#e8a0a0" roughness={1} />
        </mesh>
        {/* Right ear — outer */}
        <mesh
          ref={rightEarRef}
          position={[0.26, 0.36, -0.05]}
          rotation={[0.05, -0.05, -0.25]}
        >
          <coneGeometry args={[0.12, 0.32, 4]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.75} />
        </mesh>
        {/* Right ear — inner pink */}
        <mesh position={[0.25, 0.36, 0.0]} rotation={[0.05, -0.05, -0.25]}>
          <coneGeometry args={[0.07, 0.2, 4]} />
          <meshStandardMaterial color="#e8a0a0" roughness={1} />
        </mesh>
        {/* Eyes — amber wolf eyes with vertical slit pupils */}
        <mesh position={[-0.2, 0.14, 0.41]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial color="#d4a017" roughness={0.1} />
        </mesh>
        <mesh position={[0.2, 0.14, 0.41]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial color="#d4a017" roughness={0.1} />
        </mesh>
        <mesh
          ref={leftEyeRef}
          position={[-0.2, 0.14, 0.5]}
          scale={[0.45, 1, 1]}
        >
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshBasicMaterial color="#0d0d0d" />
        </mesh>
        <mesh
          ref={rightEyeRef}
          position={[0.2, 0.14, 0.5]}
          scale={[0.45, 1, 1]}
        >
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshBasicMaterial color="#0d0d0d" />
        </mesh>
        <mesh position={[-0.17, 0.18, 0.55]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.23, 0.18, 0.55]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        {/* Muzzle group */}
        <group position={[0, -0.12, 0.42]}>
          {/* Upper snout */}
          <mesh position={[0, 0.04, 0]} rotation={[0.05, 0, 0]}>
            <boxGeometry args={[0.22, 0.12, 0.26]} />
            <meshStandardMaterial color={patchColor} roughness={0.8} />
          </mesh>
          {/* Nose tip */}
          <mesh position={[0, 0.09, 0.14]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </mesh>
          {/* Lower jaw */}
          <mesh position={[0, -0.04, -0.02]}>
            <boxGeometry args={[0.18, 0.06, 0.22]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          {/* Mouth line */}
          <mesh position={[0, 0, 0.02]} scale={[1, 0.2, 1.02]}>
            <boxGeometry args={[0.19, 0.05, 0.2]} />
            <meshStandardMaterial color="#1f2937" roughness={0.9} />
          </mesh>
        </group>
      </>
    );
  }

  /* ── SNAKE ───────────────────────────────────────────────── */
  if (petType === "snake") {
    return (
      <>
        {/* Hood / flared neck */}
        <mesh position={[0, -0.02, 0.08]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.14, 0.24, 3]} />
          <meshStandardMaterial color={accentColor} roughness={0.4} />
        </mesh>
        {/* Hood pattern */}
        <mesh position={[0, 0.0, 0.14]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.09, 0.18, 3]} />
          <meshStandardMaterial color={patchColor} roughness={0.4} />
        </mesh>
        {/* Eyes — yellow reptile eyes with slit pupils */}
        <mesh position={[-0.2, 0.08, 0.42]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#e8c840" roughness={0.1} />
        </mesh>
        <mesh position={[0.2, 0.08, 0.42]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#e8c840" roughness={0.1} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.2, 0.08, 0.5]} scale={[0.3, 1, 1]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.2, 0.08, 0.5]} scale={[0.3, 1, 1]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[-0.17, 0.12, 0.54]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.23, 0.12, 0.54]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        {/* Forked tongue */}
        <mesh position={[0, -0.15, 0.44]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.03, 0.01, 0.22]} />
          <meshStandardMaterial color="#ef4444" roughness={0.5} />
        </mesh>
        <mesh position={[-0.04, -0.15, 0.55]} rotation={[0.1, 0.25, 0]}>
          <capsuleGeometry args={[0.01, 0.08, 4, 6]} />
          <meshStandardMaterial color="#ef4444" roughness={0.5} />
        </mesh>
        <mesh position={[0.04, -0.15, 0.55]} rotation={[0.1, -0.25, 0]}>
          <capsuleGeometry args={[0.01, 0.08, 4, 6]} />
          <meshStandardMaterial color="#ef4444" roughness={0.5} />
        </mesh>
      </>
    );
  }

  /* ── DRAGON ──────────────────────────────────────────────── */
  if (petType === "dragon") {
    return (
      <>
        {/* Left horn */}
        <mesh position={[-0.22, 0.5, -0.05]} rotation={[0.2, 0, 0.4]}>
          <coneGeometry args={[0.07, 0.42, 4]} />
          <meshStandardMaterial
            color={patchColor}
            emissive={accentColor}
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Left horn secondary */}
        <mesh position={[-0.32, 0.44, -0.04]} rotation={[0.2, 0, 0.6]}>
          <coneGeometry args={[0.04, 0.24, 4]} />
          <meshStandardMaterial color={patchColor} />
        </mesh>
        {/* Right horn */}
        <mesh position={[0.22, 0.5, -0.05]} rotation={[0.2, 0, -0.4]}>
          <coneGeometry args={[0.07, 0.42, 4]} />
          <meshStandardMaterial
            color={patchColor}
            emissive={accentColor}
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Right horn secondary */}
        <mesh position={[0.32, 0.44, -0.04]} rotation={[0.2, 0, -0.6]}>
          <coneGeometry args={[0.04, 0.24, 4]} />
          <meshStandardMaterial color={patchColor} />
        </mesh>
        {/* Eyes — glowing dragon eyes with slit pupils */}
        <mesh position={[-0.24, 0.2, 0.5]}>
          <sphereGeometry args={[0.12, 14, 14]} />
          <meshStandardMaterial
            color="#ff6600"
            roughness={0.05}
            emissive="#ff3300"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.24, 0.2, 0.5]}>
          <sphereGeometry args={[0.12, 14, 14]} />
          <meshStandardMaterial
            color="#ff6600"
            roughness={0.05}
            emissive="#ff3300"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.24, 0.2, 0.6]} scale={[0.3, 1, 1]}>
          <sphereGeometry args={[0.085, 12, 12]} />
          <meshBasicMaterial color="#1a0000" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.24, 0.2, 0.6]} scale={[0.3, 1, 1]}>
          <sphereGeometry args={[0.085, 12, 12]} />
          <meshBasicMaterial color="#1a0000" />
        </mesh>
        <mesh position={[-0.21, 0.25, 0.66]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.27, 0.25, 0.66]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        {/* Snout */}
        <mesh position={[0, 0.24, 0.54]} scale={[1, 0.7, 1.05]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color={patchColor} roughness={0.85} />
        </mesh>
        {/* Nostrils */}
        <mesh position={[-0.06, 0.28, 0.7]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#220000" roughness={0.9} />
        </mesh>
        <mesh position={[0.06, 0.28, 0.7]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#220000" roughness={0.9} />
        </mesh>
        {/* Smoke wisps from nostrils */}
        <mesh position={[-0.06, 0.36, 0.72]} scale={[0.6, 1, 0.6]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial
            color="#888888"
            roughness={1}
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh position={[0.06, 0.36, 0.72]} scale={[0.6, 1, 0.6]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial
            color="#888888"
            roughness={1}
            transparent
            opacity={0.5}
          />
        </mesh>
      </>
    );
  }

  /* ── SCORPION ────────────────────────────────────────────── */
  if (petType === "scorpion") {
    return (
      <>
        {/* Distinct head plate */}
        <mesh position={[0, -0.14, 0.5]} scale={[0.85, 0.55, 0.78]}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial
            color={patchColor}
            roughness={0.78}
            metalness={0.22}
          />
        </mesh>
        {/* Glowing compound eyes — left */}
        <mesh position={[-0.14, -0.08, 0.68]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color="#ff3333"
            emissive="#ff0000"
            emissiveIntensity={0.55}
          />
        </mesh>
        {/* Glowing compound eyes — right */}
        <mesh position={[0.14, -0.08, 0.68]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color="#ff3333"
            emissive="#ff0000"
            emissiveIntensity={0.55}
          />
        </mesh>
        {/* Extra small eyes */}
        <mesh position={[-0.06, -0.06, 0.72]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial
            color="#ff5555"
            emissive="#ff0000"
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[0.06, -0.06, 0.72]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial
            color="#ff5555"
            emissive="#ff0000"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Chelicerae (small front pincers near mouth) */}
        <mesh position={[-0.1, -0.2, 0.72]} rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.03, 0.12, 6]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.1, -0.2, 0.72]} rotation={[0, 0, -0.4]}>
          <coneGeometry args={[0.03, 0.12, 6]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.7} />
        </mesh>
      </>
    );
  }

  return null;
}

/** ─────────────────────────────────────────────────────────────
 *  ExtraPetLimbs — wings, flippers, legs (kept for compat)
 *  NOTE: legs/paws are now inlined in ExtraPetBody for most
 *  pets so the parent PetModel can still pass refs cleanly.
 * ───────────────────────────────────────────────────────────── */
export function ExtraPetLimbs({
  petType,
  currentPetColor,
  accentColor,
  leftWingRef,
  rightWingRef,
  tailRef,
}) {
  // Duck / Chick wings + Dragon wings + tail are now fully in ExtraPetBody.
  // This component is kept so PetModel doesn't break; it handles
  // only the ref-animated parts (wing flap, tail wag).

  if (petType === "duck" || petType === "chick") {
    return (
      <>
        <mesh
          ref={leftWingRef}
          position={[-0.62, 0.02, 0]}
          rotation={[0, 0.2, 0.12]}
          scale={[0.36, 0.72, 0.55]}
        >
          <sphereGeometry args={[0.4, 14, 14]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.85} />
        </mesh>
        <mesh
          ref={rightWingRef}
          position={[0.62, 0.02, 0]}
          rotation={[0, -0.2, -0.12]}
          scale={[0.36, 0.72, 0.55]}
        >
          <sphereGeometry args={[0.4, 14, 14]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.85} />
        </mesh>
      </>
    );
  }

  if (petType === "dragon") {
    return (
      <group ref={tailRef} position={[0, -0.18, -0.68]}>
        <mesh rotation={[-0.4, 0, 0]}>
          <coneGeometry args={[0.16, 0.72, 8]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.5, -0.38]} rotation={[-0.7, 0, 0]}>
          <coneGeometry args={[0.09, 0.42, 8]} />
          <meshStandardMaterial color={currentPetColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.7, -0.64]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.18, 0.18, 0.02]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    );
  }

  if (petType === "seal") {
    return null; // Flippers are in ExtraPetBody
  }

  if (petType === "wolf") {
    return null; // Legs + tail are in ExtraPetBody
  }

  if (petType === "scorpion") {
    return (
      <group ref={tailRef} position={[0, -0.15, -0.35]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[0, i * 0.28, -i * 0.18]}
            rotation={[-0.55 - i * 0.15, 0, 0]}
          >
            <sphereGeometry args={[0.18 - i * 0.02, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? currentPetColor : accentColor}
              roughness={0.75}
            />
          </mesh>
        ))}
        <mesh position={[0, 1.12, -0.72]} rotation={[-0.9, 0, 0]}>
          <coneGeometry args={[0.07, 0.28, 8]} />
          <meshStandardMaterial
            color={accentColor}
            emissive="#ff4400"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    );
  }

  if (petType === "hamster") {
    return null; // Paws are now in ExtraPetBody
  }

  return null;
}

/** ─────────────────────────────────────────────────────────────
 *  Head layout constants (unchanged — keeps parent alignment)
 * ───────────────────────────────────────────────────────────── */
const HEAD_LAYOUT = {
  hamster: { y: 0.42, z: 0.38, r: 0.4 },
  duck: { y: 0.62, z: 0.15, r: 0.5 },
  chick: { y: 0.58, z: 0.2, r: 0.46 },
  seal: { y: 0.52, z: 0.55, r: 0.52 },
  wolf: { y: 0.46, z: 0.22, r: 0.48 },
  snake: { y: 0.35, z: 0.42, r: 0.48 },
  dragon: { y: 0.72, z: 0.15, r: 0.58 },
  scorpion: { y: 0.38, z: 0.48, r: 0.45 },
};

export function getExtraPetHeadLayout(petType) {
  return HEAD_LAYOUT[petType] || null;
}

export const EXTRA_PET_TYPES = Object.keys(HEAD_LAYOUT);

export function isExtraPet(petType) {
  return EXTRA_PET_TYPES.includes(petType);
}
