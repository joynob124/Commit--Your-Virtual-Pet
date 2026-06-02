import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { Focus, AlertTriangle, ChevronRight } from "lucide-react";
import { getSiteMeta } from "../constants/socialSites";
import {
  getSpeciesLabel,
  resolvePetColors,
  formatPetAppearance,
  lightenColor,
  darkenColor,
} from "../constants/petCatalog";
import {
  ExtraPetBody,
  ExtraPetHeadFeatures,
  ExtraPetLimbs,
  getExtraPetHeadLayout,
  isExtraPet,
} from "../pets/extraPetMeshes";

const API_BASE = "http://localhost:3001";
const HEALTH_POLL_MS = 10_000;

function detectNewPenalties(prevLog, nextLog) {
  if (!prevLog) return [];
  const toasts = [];
  for (const item of nextLog) {
    const prev = prevLog.find((p) => p.site === item.site);
    const delta = item.total_penalty - (prev?.total_penalty ?? 0);
    if (delta > 0) {
      const meta = getSiteMeta(item.site);
      toasts.push({
        id: `${item.site}-${item.total_penalty}-${Date.now()}`,
        text: `${meta.label}: −${delta} HP (${item.total_minutes} min today)`,
      });
    }
  }
  return toasts;
}

function PetModel({
  isSyncing = false,
  health = 100,
  petType: propPetType = null,
  themeIndex: propThemeIndex = null,
  petColor: propPetColor = null,
  petColorSick: propPetColorSick = null,
}) {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const leftEarRef = useRef();
  const rightEarRef = useRef();
  const tailRef = useRef();
  const trunkRef = useRef();

  const isLowHealth = health < 35;
  const petType = propPetType ?? "bird";
  const theme = resolvePetColors({
    themeIndex: propThemeIndex,
    petColor: propPetColor,
    petColorSick: propPetColorSick,
  });
  const currentPetColor = isLowHealth ? theme.sick : theme.base;
  const woolColor = lightenColor(theme.base, 0.42);
  const patchColor = darkenColor(theme.base, 0.5);
  const accentColor = lightenColor(theme.base, 0.32);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Body Animation
    if (groupRef.current) {
      if (isSyncing) {
        groupRef.current.position.y = Math.abs(Math.sin(t * 6)) * 0.4;
      } else if (isLowHealth) {
        groupRef.current.position.y = -0.08 + Math.sin(t * 22) * 0.015;
      } else {
        if (petType === "bunny") {
          // Realistic hopping arc: smooth parabolic bounce
          const hop = Math.pow(Math.max(0, Math.sin(t * 3.5)), 1.6);
          groupRef.current.position.y = hop * 0.35 - 0.05;
        } else if (petType === "frog") {
          groupRef.current.position.y =
            Math.max(0, Math.sin(t * 4.5)) * 0.18 - 0.05;
        } else if (
          petType === "cat" ||
          petType === "dog" ||
          petType === "fox"
        ) {
          // Breathing sway
          groupRef.current.position.y = Math.sin(t * 1.8) * 0.05 - 0.02;
          groupRef.current.rotation.z = Math.sin(t * 1.8) * 0.015;
        } else if (petType === "bird") {
          // Bird bobs up and down with each wing flap
          groupRef.current.position.y = Math.sin(t * 5) * 0.07;
        } else if (petType === "alien") {
          groupRef.current.position.y = Math.sin(t * 2.2) * 0.14 + 0.06;
        } else if (petType === "pig") {
          groupRef.current.position.y = Math.sin(t * 3.2) * 0.06 - 0.02;
          groupRef.current.rotation.z = Math.sin(t * 3.2) * 0.02;
        } else if (petType === "sheep") {
          groupRef.current.position.y = Math.sin(t * 1.6) * 0.05;
        } else if (petType === "hamster" || petType === "chick") {
          groupRef.current.position.y = Math.sin(t * 4) * 0.04 - 0.02;
        } else if (petType === "duck" || petType === "seal") {
          groupRef.current.position.y = Math.sin(t * 2.2) * 0.06;
        } else if (petType === "wolf" || petType === "dragon") {
          groupRef.current.position.y = Math.sin(t * 2.8) * 0.05;
          groupRef.current.rotation.y = Math.sin(t * 1.2) * 0.04;
        } else if (petType === "snake") {
          groupRef.current.position.y = Math.sin(t * 1.4) * 0.03 - 0.12;
        } else if (petType === "scorpion") {
          groupRef.current.position.y = -0.15 + Math.sin(t * 3) * 0.02;
        } else {
          groupRef.current.position.y = Math.sin(t * 2.5) * 0.08;
        }
      }
    }

    // Head movement
    if (headRef.current) {
      if (isLowHealth) {
        headRef.current.position.y =
          getExtraPetHeadLayout(petType)?.y ??
          (petType === "cat" ||
          petType === "dog" ||
          petType === "fox" ||
          petType === "pig" ||
          petType === "wolf"
            ? 0.48
            : petType === "bunny"
              ? 0.95
              : 0.62);
        headRef.current.rotation.x = 0.22 + Math.sin(t * 1.5) * 0.04;
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.08;
      } else {
        headRef.current.position.y =
          getExtraPetHeadLayout(petType)?.y ??
          (petType === "cat" ||
          petType === "dog" ||
          petType === "fox" ||
          petType === "pig" ||
          petType === "wolf"
            ? 0.55
            : petType === "bunny"
              ? 1.05
              : 0.7);
        headRef.current.rotation.y = Math.sin(t * 1.5) * 0.12;
        headRef.current.rotation.x = Math.sin(t * 2) * 0.04;
      }
    }

    // Eye Blinking
    const blink = Math.pow(Math.sin(t * 0.5), 20) > 0.95 ? 0.1 : 1;
    const eyeScaleY = isLowHealth ? 0.35 : 1;
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blink * eyeScaleY;
      rightEyeRef.current.scale.y = blink * eyeScaleY;
      const eyeMove = isLowHealth
        ? Math.sin(t * 0.5) * 0.01
        : Math.sin(t * 2) * 0.05;
      leftEyeRef.current.rotation.y = eyeMove;
      rightEyeRef.current.rotation.y = eyeMove;
    }

    // Wings (Bird) — rapid flapping, synced with body bob
    if (
      leftWingRef.current &&
      rightWingRef.current &&
      (petType === "bird" ||
        petType === "duck" ||
        petType === "chick" ||
        petType === "dragon")
    ) {
      if (isSyncing) {
        const flap = Math.sin(t * 22) * 1.0;
        leftWingRef.current.rotation.z = flap + 0.3;
        rightWingRef.current.rotation.z = -flap - 0.3;
      } else if (isLowHealth) {
        const flap = Math.sin(t * 1.5) * 0.04;
        leftWingRef.current.rotation.z = flap + 0.15;
        rightWingRef.current.rotation.z = -flap - 0.15;
      } else {
        // Fast wing flap matched to body bob frequency
        const flap = Math.sin(t * 5) * 0.35;
        leftWingRef.current.rotation.z = flap + 0.4;
        rightWingRef.current.rotation.z = -flap - 0.4;
      }
    }

    // Bunny Ears
    if (
      leftEarRef.current &&
      rightEarRef.current &&
      (petType === "bunny" || petType === "wolf")
    ) {
      if (isSyncing) {
        leftEarRef.current.rotation.z = 0.15 + Math.sin(t * 15) * 0.2;
        rightEarRef.current.rotation.z = -0.15 - Math.sin(t * 15) * 0.2;
      } else if (isLowHealth) {
        leftEarRef.current.rotation.z = 0.55 + Math.sin(t * 1.5) * 0.05;
        rightEarRef.current.rotation.z = -0.55 - Math.sin(t * 1.5) * 0.05;
        leftEarRef.current.rotation.x = 0.4;
        rightEarRef.current.rotation.x = 0.4;
      } else {
        leftEarRef.current.rotation.z = 0.15 + Math.sin(t * 2) * 0.04;
        rightEarRef.current.rotation.z = -0.15 - Math.sin(t * 2) * 0.04;
        leftEarRef.current.rotation.x = 0.1;
        rightEarRef.current.rotation.x = 0.1;
      }
    }

    // Tails (Cat, Dog, Fox, Pig) — cat has fast perky wiggle
    if (
      tailRef.current &&
      (petType === "cat" ||
        petType === "dog" ||
        petType === "fox" ||
        petType === "pig" ||
        petType === "wolf")
    ) {
      if (isSyncing) {
        tailRef.current.rotation.y = Math.sin(t * 14) * 0.55;
        tailRef.current.rotation.x = -0.3;
      } else if (isLowHealth) {
        tailRef.current.rotation.y = Math.sin(t * 1) * 0.05;
        tailRef.current.rotation.x = -0.8;
      } else if (petType === "cat") {
        // Cat: high curling tail, slow graceful sway side to side
        tailRef.current.rotation.y = Math.sin(t * 2.5) * 0.45;
        tailRef.current.rotation.x = -0.9 + Math.sin(t * 1.2) * 0.1;
      } else {
        tailRef.current.rotation.y = Math.sin(t * 4) * 0.3;
        tailRef.current.rotation.x = -0.4;
      }
    }

    // Scorpion tail sting sway
    if (tailRef.current && petType === "scorpion") {
      if (isSyncing) {
        tailRef.current.rotation.x = 0.4 + Math.sin(t * 10) * 0.35;
      } else if (isLowHealth) {
        tailRef.current.rotation.x = 0.75 + Math.sin(t * 1) * 0.05;
      } else {
        tailRef.current.rotation.x = 0.55 + Math.sin(t * 3.5) * 0.2;
        tailRef.current.rotation.y = Math.sin(t * 2) * 0.15;
      }
    }

    // Trunk (Elephant)
    if (trunkRef.current && petType === "elephant") {
      if (isSyncing) {
        trunkRef.current.rotation.x = -0.6 + Math.sin(t * 8) * 0.3;
      } else if (isLowHealth) {
        trunkRef.current.rotation.x = 0.5 + Math.sin(t * 1) * 0.05;
      } else {
        trunkRef.current.rotation.x = 0.1 + Math.sin(t * 2) * 0.12;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* BIRD — large round body, prominent white belly patch, cute claws */}
      {petType === "bird" && (
        <>
          {/* Main round body */}
          <mesh position={[0, 0, 0]} scale={[1, 1.05, 0.95]}>
            <sphereGeometry args={[0.78, 32, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.6} />
          </mesh>
          {/* White belly patch */}
          <mesh position={[0, -0.18, 0.44]} scale={[0.85, 0.72, 0.55]}>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="white" roughness={1} />
          </mesh>
          {/* Bird Claws */}
          <group position={[0, -0.75, 0.15]}>
            <mesh position={[-0.18, 0, 0]} rotation={[0.2, 0.1, 0]}>
              <capsuleGeometry args={[0.04, 0.14, 8, 8]} />
              <meshStandardMaterial color="#FFA500" roughness={0.5} />
            </mesh>
            <mesh position={[-0.18, -0.05, 0.08]} rotation={[0.2, 0.6, 0]}>
              <capsuleGeometry args={[0.03, 0.1, 8, 8]} />
              <meshStandardMaterial color="#FFA500" roughness={0.5} />
            </mesh>
            <mesh position={[0.18, 0, 0]} rotation={[0.2, -0.1, 0]}>
              <capsuleGeometry args={[0.04, 0.14, 8, 8]} />
              <meshStandardMaterial color="#FFA500" roughness={0.5} />
            </mesh>
            <mesh position={[0.18, -0.05, 0.08]} rotation={[0.2, -0.6, 0]}>
              <capsuleGeometry args={[0.03, 0.1, 8, 8]} />
              <meshStandardMaterial color="#FFA500" roughness={0.5} />
            </mesh>
          </group>
        </>
      )}

      {/* BUNNY — tall pear/egg silhouette, cute hind feet & cotton tail */}
      {petType === "bunny" && (
        <>
          {/* Lower pear belly */}
          <mesh position={[0, -0.18, 0]} scale={[1.0, 1.0, 0.92]}>
            <sphereGeometry args={[0.76, 32, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.75} />
          </mesh>
          {/* Upper chest */}
          <mesh position={[0, 0.48, 0]} scale={[0.72, 0.82, 0.78]}>
            <sphereGeometry args={[0.72, 32, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.75} />
          </mesh>
          {/* White tummy patch */}
          <mesh position={[0, -0.1, 0.44]} scale={[0.8, 1.15, 0.55]}>
            <sphereGeometry args={[0.52, 32, 32]} />
            <meshStandardMaterial color="white" roughness={1} />
          </mesh>
          {/* Front paws */}
          <mesh position={[-0.35, 0.1, 0.3]} rotation={[0.4, 0, 0.3]}>
            <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          <mesh position={[0.35, 0.1, 0.3]} rotation={[0.4, 0, -0.3]}>
            <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          {/* Big hind feet */}
          <mesh position={[-0.3, -0.85, 0.15]} rotation={[-0.15, 0, 0]}>
            <capsuleGeometry args={[0.1, 0.35, 8, 16]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          <mesh position={[0.3, -0.85, 0.15]} rotation={[-0.15, 0, 0]}>
            <capsuleGeometry args={[0.1, 0.35, 8, 16]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          {/* White toe pads */}
          <mesh position={[-0.3, -0.88, 0.38]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0.3, -0.88, 0.38]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          {/* Fluffy cotton tail */}
          <mesh position={[0, -0.15, -0.8]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="white" roughness={1.2} />
          </mesh>
        </>
      )}

      {/* CAT — horizontal capsule body, tail, clean legs & paws */}
      {petType === "cat" && (
        <>
          {/* Horizontal barrel body */}
          <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 1.3, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.75} />
          </mesh>
          {/* Round cap front */}
          <mesh position={[0, -0.08, 0.65]}>
            <sphereGeometry args={[0.52, 32, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.75} />
          </mesh>
          {/* Round cap back */}
          <mesh position={[0, -0.08, -0.65]}>
            <sphereGeometry args={[0.52, 32, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.75} />
          </mesh>
          {/* White belly stripe */}
          <mesh position={[0, -0.46, 0.2]} scale={[0.65, 0.25, 0.9]}>
            <sphereGeometry args={[0.62, 32, 32]} />
            <meshStandardMaterial color="white" roughness={1} />
          </mesh>
        </>
      )}

      {/* DOG / FOX / PIG — horizontal capsule body */}
      {(petType === "dog" || petType === "fox" || petType === "pig") && (
        <>
          <mesh position={[0, -0.1, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
              args={[
                petType === "pig" ? 0.6 : 0.52,
                petType === "pig" ? 0.6 : 0.52,
                1.25,
                32,
              ]}
            />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.18, 0.3]} scale={[1, 1.1, 1]}>
            <sphereGeometry args={[0.42, 32, 32]} />
            <meshStandardMaterial color="white" roughness={1} />
          </mesh>
        </>
      )}

      {/* BEAR / PANDA — themed bear or panda with matching accents */}
      {(petType === "bear" || petType === "panda") && (
        <>
          {/* Main Body - Panda uses currentPetColor (NOT hardcoded white) */}
          <mesh position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[0.75, 32, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          {/* Belly Patch - Panda uses dark charcoal, Bear uses white */}
          <mesh position={[0, -0.1, 0.38]}>
            <sphereGeometry args={[0.54, 32, 32]} />
            <meshStandardMaterial
              color={petType === "panda" ? patchColor : "white"}
              roughness={1}
            />
          </mesh>
        </>
      )}

      {/* PENGUIN — sleek body, white belly */}
      {petType === "penguin" && (
        <>
          <mesh position={[0, 0, 0]} scale={[1, 1.3, 0.95]}>
            <sphereGeometry args={[0.75, 32, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.1, 0.38]}>
            <sphereGeometry args={[0.54, 32, 32]} />
            <meshStandardMaterial color="white" roughness={1} />
          </mesh>
        </>
      )}

      {/* FROG — squashed body, cream belly */}
      {petType === "frog" && (
        <>
          <mesh position={[0, -0.1, 0]} scale={[1.2, 0.9, 1.1]}>
            <sphereGeometry args={[0.72, 32, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.18, 0.36]} scale={[1.1, 0.9, 1.1]}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color="#fffacd" roughness={1} />
          </mesh>
        </>
      )}

      {/* ELEPHANT — heavy body, gray chest */}
      {petType === "elephant" && (
        <>
          <mesh position={[0, 0, 0]} scale={[1.22, 1.22, 1.22]}>
            <sphereGeometry args={[0.74, 32, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.1, 0.42]}>
            <sphereGeometry args={[0.56, 32, 32]} />
            <meshStandardMaterial color="#dcdde1" roughness={1} />
          </mesh>
        </>
      )}

      {/* SHEEP — fluffy body made of overlapping wool puffs */}
      {petType === "sheep" && (
        <>
          {/* Central body base */}
          <mesh position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[0.75, 32, 32]} />
            <meshStandardMaterial color={woolColor} roughness={1.0} />
          </mesh>
          {/* Fluffy wool puffs surrounding the body */}
          <mesh position={[-0.32, 0.22, 0.32]}>
            <sphereGeometry args={[0.38, 16, 16]} />
            <meshStandardMaterial color={woolColor} roughness={1.0} />
          </mesh>
          <mesh position={[0.32, 0.22, 0.32]}>
            <sphereGeometry args={[0.38, 16, 16]} />
            <meshStandardMaterial color={woolColor} roughness={1.0} />
          </mesh>
          <mesh position={[-0.35, -0.22, 0.35]}>
            <sphereGeometry args={[0.34, 16, 16]} />
            <meshStandardMaterial color={woolColor} roughness={1.0} />
          </mesh>
          <mesh position={[0.35, -0.22, 0.35]}>
            <sphereGeometry args={[0.34, 16, 16]} />
            <meshStandardMaterial color={woolColor} roughness={1.0} />
          </mesh>
          <mesh position={[0, 0.45, -0.25]}>
            <sphereGeometry args={[0.42, 16, 16]} />
            <meshStandardMaterial color={woolColor} roughness={1.0} />
          </mesh>
          <mesh position={[0, -0.35, -0.35]}>
            <sphereGeometry args={[0.42, 16, 16]} />
            <meshStandardMaterial color={woolColor} roughness={1.0} />
          </mesh>
          <mesh position={[-0.45, 0, -0.2]}>
            <sphereGeometry args={[0.36, 16, 16]} />
            <meshStandardMaterial color={woolColor} roughness={1.0} />
          </mesh>
          <mesh position={[0.45, 0, -0.2]}>
            <sphereGeometry args={[0.36, 16, 16]} />
            <meshStandardMaterial color={woolColor} roughness={1.0} />
          </mesh>
        </>
      )}

      {/* ALIEN — vertical body, high-tech chest plate */}
      {petType === "alien" && (
        <>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 1.1, 32]} />
            <meshStandardMaterial color={currentPetColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.1, 0.32]}>
            <sphereGeometry args={[0.34, 32, 32]} />
            <meshStandardMaterial color="#ff7675" roughness={1} />
          </mesh>
        </>
      )}

      <ExtraPetBody
        petType={petType}
        currentPetColor={currentPetColor}
        woolColor={woolColor}
        patchColor={patchColor}
        accentColor={accentColor}
      />

      {/* HEAD SECTION */}
      <group
        ref={headRef}
        position={[
          0,
          getExtraPetHeadLayout(petType)?.y ??
            (petType === "cat" ||
            petType === "dog" ||
            petType === "fox" ||
            petType === "pig" ||
            petType === "wolf"
              ? 0.55
              : petType === "bunny"
                ? 1.05
                : petType === "alien"
                  ? 0.85
                  : 0.7),
          getExtraPetHeadLayout(petType)?.z ??
            (petType === "cat" ||
            petType === "dog" ||
            petType === "fox" ||
            petType === "pig" ||
            petType === "wolf"
              ? 0.55
              : 0.2),
        ]}
      >
        {/* Head Base - Panda uses currentPetColor (NOT hardcoded white) */}
        <mesh scale={petType === "bunny" ? [1.0, 0.88, 0.95] : [1, 1, 1]}>
          <sphereGeometry
            args={[
              getExtraPetHeadLayout(petType)?.r ??
                (petType === "alien"
                  ? 0.64
                  : petType === "bunny"
                    ? 0.46
                    : 0.55),
              32,
              32,
            ]}
          />
          <meshStandardMaterial
            color={petType === "sheep" ? patchColor : currentPetColor}
          />
        </mesh>

        <ExtraPetHeadFeatures
          petType={petType}
          currentPetColor={currentPetColor}
          woolColor={woolColor}
          patchColor={patchColor}
          accentColor={accentColor}
          leftEarRef={leftEarRef}
          rightEarRef={rightEarRef}
          leftEyeRef={leftEyeRef}
          rightEyeRef={rightEyeRef}
        />

        {/* BIRD CREST */}
        {petType === "bird" && (
          <mesh position={[0, 0.55, -0.1]} rotation={[-0.2, 0, 0]}>
            <coneGeometry args={[0.12, 0.5, 16]} />
            <meshStandardMaterial color={currentPetColor} />
          </mesh>
        )}

        {/* BUNNY EARS */}
        {petType === "bunny" && (
          <>
            <group
              ref={leftEarRef}
              position={[-0.18, 0.38, -0.02]}
              rotation={[0.05, 0, 0.12]}
            >
              <mesh position={[0, 0.42, 0]}>
                <cylinderGeometry args={[0.055, 0.08, 0.85, 16]} />
                <meshStandardMaterial color={currentPetColor} />
              </mesh>
              <mesh position={[0, 0.42, 0.03]}>
                <cylinderGeometry args={[0.028, 0.045, 0.72, 16]} />
                <meshStandardMaterial color="#ffb3ba" />
              </mesh>
            </group>
            <group
              ref={rightEarRef}
              position={[0.18, 0.38, -0.02]}
              rotation={[0.05, 0, -0.12]}
            >
              <mesh position={[0, 0.42, 0]}>
                <cylinderGeometry args={[0.055, 0.08, 0.85, 16]} />
                <meshStandardMaterial color={currentPetColor} />
              </mesh>
              <mesh position={[0, 0.42, 0.03]}>
                <cylinderGeometry args={[0.028, 0.045, 0.72, 16]} />
                <meshStandardMaterial color="#ffb3ba" />
              </mesh>
            </group>
          </>
        )}

        {/* CAT EARS */}
        {petType === "cat" && (
          <>
            <mesh position={[-0.32, 0.45, 0.1]} rotation={[0.1, 0, 0.32]}>
              <coneGeometry args={[0.15, 0.32, 4]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0.32, 0.45, 0.1]} rotation={[0.1, 0, -0.32]}>
              <coneGeometry args={[0.15, 0.32, 4]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
          </>
        )}

        {/* DOG FLOPPY EARS */}
        {petType === "dog" && (
          <>
            <group position={[-0.45, 0.2, 0]} rotation={[0, 0, 0.15]}>
              <mesh position={[0, -0.22, 0]}>
                <boxGeometry args={[0.14, 0.42, 0.14]} />
                <meshStandardMaterial color={currentPetColor} />
              </mesh>
            </group>
            <group position={[0.45, 0.2, 0]} rotation={[0, 0, -0.15]}>
              <mesh position={[0, -0.22, 0]}>
                <boxGeometry args={[0.14, 0.42, 0.14]} />
                <meshStandardMaterial color={currentPetColor} />
              </mesh>
            </group>
          </>
        )}

        {/* FOX POINTY EARS */}
        {petType === "fox" && (
          <>
            <mesh position={[-0.35, 0.48, 0.05]} rotation={[0.1, 0, 0.25]}>
              <coneGeometry args={[0.16, 0.38, 4]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0.35, 0.48, 0.05]} rotation={[0.1, 0, -0.25]}>
              <coneGeometry args={[0.16, 0.38, 4]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
          </>
        )}

        {/* BEAR / PANDA ROUND EARS - Panda uses dark charcoal */}
        {(petType === "bear" || petType === "panda") && (
          <>
            <mesh position={[-0.38, 0.42, 0.05]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
            <mesh position={[0.38, 0.42, 0.05]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
          </>
        )}

        {/* ELEPHANT FLAP EARS */}
        {petType === "elephant" && (
          <>
            <mesh position={[-0.58, 0.08, 0.05]} rotation={[0, 0.2, -0.08]}>
              <boxGeometry args={[0.08, 0.62, 0.52]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0.58, 0.08, 0.05]} rotation={[0, -0.2, 0.08]}>
              <boxGeometry args={[0.08, 0.62, 0.52]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
          </>
        )}

        {/* FROG BULGING EYES OVERLAY */}
        {petType === "frog" && (
          <group position={[0, 0.35, 0.15]}>
            <mesh position={[-0.24, 0.08, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0.24, 0.08, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
          </group>
        )}

        {/* ALIEN ANTENNA */}
        {petType === "alien" && (
          <group position={[0, 0.48, 0]}>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshBasicMaterial color="#ffff00" />
            </mesh>
          </group>
        )}

        {/* EYES */}
        {petType !== "frog" && petType !== "alien" && !isExtraPet(petType) && (
          <group position={[0, 0.08, 0.46]}>
            <mesh position={[-0.22, 0, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color="white" roughness={0.1} />
            </mesh>
            <mesh position={[-0.22, 0, 0.12]} ref={leftEyeRef}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[-0.17, 0.05, 0.2]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>

            <mesh position={[0.22, 0, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color="white" roughness={0.1} />
            </mesh>
            <mesh position={[0.22, 0, 0.12]} ref={rightEyeRef}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[0.27, 0.05, 0.2]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        )}

        {/* FROG BULGING EYEBALLS */}
        {petType === "frog" && (
          <group position={[0, 0.35, 0.15]}>
            <mesh position={[-0.24, 0.08, 0.14]} ref={leftEyeRef}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[-0.2, 0.12, 0.2]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[0.24, 0.08, 0.14]} ref={rightEyeRef}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[0.28, 0.12, 0.2]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        )}

        {/* ALIEN THREE EYES */}
        {petType === "alien" && (
          <group position={[0, 0.08, 0.54]}>
            <mesh position={[-0.24, 0, 0]} scale={[0.7, 0.7, 0.7]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[-0.24, 0, 0.09]} ref={leftEyeRef}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0.14, 0.11]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[0.24, 0, 0]} scale={[0.7, 0.7, 0.7]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0.24, 0, 0.09]} ref={rightEyeRef}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
          </group>
        )}

        {/* PANDA DARK CHARCOAL EYE PATCHES */}
        {petType === "panda" && (
          <group position={[0, 0.08, 0.44]}>
            <mesh position={[-0.22, 0, 0]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[0.22, 0.26, 0.02]} />
              <meshStandardMaterial color={patchColor} />
            </mesh>
            <mesh position={[0.22, 0, 0]} rotation={[0, 0, -0.25]}>
              <boxGeometry args={[0.22, 0.26, 0.02]} />
              <meshStandardMaterial color={patchColor} />
            </mesh>
          </group>
        )}

        {/* BIRD BEAK */}
        {petType === "bird" && (
          <mesh position={[0, -0.1, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.09, 0.22, 16]} />
            <meshStandardMaterial color="#FFA500" />
          </mesh>
        )}

        {/* BUNNY SNOUT */}
        {petType === "bunny" && (
          <mesh position={[0, -0.05, 0.54]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color="#ffb3ba" />
          </mesh>
        )}

        {/* CAT SNOUT & WHISKERS */}
        {petType === "cat" && (
          <>
            <mesh position={[0, -0.05, 0.53]}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#ffb3ba" />
            </mesh>
            <group position={[0, -0.08, 0.5]}>
              <mesh position={[-0.2, 0, 0]} rotation={[0, 0.1, 0.05]}>
                <boxGeometry args={[0.26, 0.015, 0.015]} />
                <meshBasicMaterial color="#111111" />
              </mesh>
              <mesh position={[-0.2, -0.04, 0]} rotation={[0, 0.1, -0.05]}>
                <boxGeometry args={[0.26, 0.015, 0.015]} />
                <meshBasicMaterial color="#111111" />
              </mesh>
              <mesh position={[0.2, 0, 0]} rotation={[0, -0.1, -0.05]}>
                <boxGeometry args={[0.26, 0.015, 0.015]} />
                <meshBasicMaterial color="#111111" />
              </mesh>
              <mesh position={[0.2, -0.04, 0]} rotation={[0, -0.1, 0.05]}>
                <boxGeometry args={[0.26, 0.015, 0.015]} />
                <meshBasicMaterial color="#111111" />
              </mesh>
            </group>
          </>
        )}

        {/* DOG SNOUT & TONGUE */}
        {petType === "dog" && (
          <>
            <mesh position={[0, -0.06, 0.52]}>
              <boxGeometry args={[0.2, 0.15, 0.18]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, 0.02, 0.62]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[0, -0.14, 0.54]} rotation={[0.08, 0, 0]}>
              <boxGeometry args={[0.08, 0.12, 0.03]} />
              <meshStandardMaterial color="#ff7675" />
            </mesh>
          </>
        )}

        {/* FOX LONG SNOUT */}
        {petType === "fox" && (
          <>
            <mesh position={[0, -0.08, 0.58]} rotation={[0.1, 0, 0]}>
              <coneGeometry args={[0.12, 0.35, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, -0.05, 0.76]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
          </>
        )}

        {/* BEAR / PANDA SNOUT */}
        {(petType === "bear" || petType === "panda") && (
          <>
            <mesh position={[0, -0.08, 0.52]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#f5cd79" />
            </mesh>
            <mesh position={[0, -0.02, 0.62]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
          </>
        )}

        {/* PENGUIN BEAK */}
        {petType === "penguin" && (
          <mesh position={[0, -0.06, 0.53]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.08, 0.22, 16]} />
            <meshStandardMaterial color="#fbc531" />
          </mesh>
        )}

        {/* FROG MOUTH LINE */}
        {petType === "frog" && (
          <mesh position={[0, -0.18, 0.52]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.38, 0.02, 0.02]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
        )}

        {/* ELEPHANT TRUNK */}
        {petType === "elephant" && (
          <group
            ref={trunkRef}
            position={[0, -0.05, 0.52]}
            rotation={[0.1, 0, 0]}
          >
            <mesh position={[0, -0.22, 0.08]} rotation={[-0.4, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.06, 0.45, 12]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, -0.42, 0.22]} rotation={[-0.8, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.055, 0.3, 12]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
          </group>
        )}

        {/* PIG NOSE */}
        {petType === "pig" && (
          <group position={[0, -0.08, 0.54]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.12, 16]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Nostrils */}
            <mesh position={[-0.04, 0, 0.07]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
            <mesh position={[0.04, 0, 0.07]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
          </group>
        )}
      </group>

      {/* BIRD WINGS */}
      {petType === "bird" && (
        <>
          <group ref={leftWingRef} position={[-0.8, 0.05, -0.1]}>
            <mesh position={[-0.26, 0, 0.05]} rotation={[0.08, 0, 0]}>
              <boxGeometry args={[0.52, 0.06, 0.68]} />
              <meshStandardMaterial color={currentPetColor} roughness={0.6} />
            </mesh>
            <mesh position={[-0.52, -0.03, 0.08]} rotation={[0.1, 0.1, -0.15]}>
              <boxGeometry args={[0.16, 0.05, 0.26]} />
              <meshStandardMaterial color={currentPetColor} roughness={0.5} />
            </mesh>
          </group>
          <group ref={rightWingRef} position={[0.8, 0.05, -0.1]}>
            <mesh position={[0.26, 0, 0.05]} rotation={[0.08, 0, 0]}>
              <boxGeometry args={[0.52, 0.06, 0.68]} />
              <meshStandardMaterial color={currentPetColor} roughness={0.6} />
            </mesh>
            <mesh position={[0.52, -0.03, 0.08]} rotation={[0.1, -0.1, 0.15]}>
              <boxGeometry args={[0.16, 0.05, 0.26]} />
              <meshStandardMaterial color={currentPetColor} roughness={0.5} />
            </mesh>
          </group>
        </>
      )}

      {/* PENGUIN FLIPPERS */}
      {petType === "penguin" && (
        <>
          <mesh position={[-0.8, 0.08, 0]} rotation={[0, 0, -0.22]}>
            <boxGeometry args={[0.06, 0.48, 0.2]} />
            <meshStandardMaterial color={currentPetColor} />
          </mesh>
          <mesh position={[0.8, 0.08, 0]} rotation={[0, 0, 0.22]}>
            <boxGeometry args={[0.06, 0.48, 0.2]} />
            <meshStandardMaterial color={currentPetColor} />
          </mesh>
        </>
      )}

      <ExtraPetLimbs
        petType={petType}
        currentPetColor={currentPetColor}
        accentColor={accentColor}
        leftWingRef={leftWingRef}
        rightWingRef={rightWingRef}
        tailRef={tailRef}
      />

      {/* QUADRUPED LIMBS & PAWS (Cat, Dog, Fox, Pig) — Wolf has its own in ExtraPetBody */}
      {(petType === "cat" ||
        petType === "dog" ||
        petType === "fox" ||
        petType === "pig") && (
        <>
          {/* Front Left Leg */}
          <group position={[-0.32, -0.58, 0.4]}>
            <mesh>
              <capsuleGeometry args={[0.085, 0.35, 8, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            {/* Paw */}
            <mesh position={[0, -0.22, 0.06]} scale={[1.1, 0.7, 1.3]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial
                color={petType === "pig" ? accentColor : currentPetColor}
              />
            </mesh>
          </group>
          {/* Front Right Leg */}
          <group position={[0.32, -0.58, 0.4]}>
            <mesh>
              <capsuleGeometry args={[0.085, 0.35, 8, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, -0.22, 0.06]} scale={[1.1, 0.7, 1.3]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial
                color={petType === "pig" ? accentColor : currentPetColor}
              />
            </mesh>
          </group>
          {/* Back Left Leg */}
          <group position={[-0.34, -0.58, -0.42]}>
            <mesh>
              <capsuleGeometry args={[0.085, 0.35, 8, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, -0.22, 0.06]} scale={[1.1, 0.7, 1.3]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial
                color={petType === "pig" ? accentColor : currentPetColor}
              />
            </mesh>
          </group>
          {/* Back Right Leg */}
          <group position={[0.34, -0.58, -0.42]}>
            <mesh>
              <capsuleGeometry args={[0.085, 0.35, 8, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, -0.22, 0.06]} scale={[1.1, 0.7, 1.3]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial
                color={petType === "pig" ? accentColor : currentPetColor}
              />
            </mesh>
          </group>

          {/* Tail */}
          {petType === "cat" ? (
            <group
              ref={tailRef}
              position={[0, 0.1, -0.7]}
              rotation={[-1.1, 0, 0]}
            >
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.05, 0.06, 0.6, 8]} />
                <meshStandardMaterial color={currentPetColor} />
              </mesh>
              <mesh position={[0, 0.72, 0.12]} rotation={[0.45, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
                <meshStandardMaterial color={currentPetColor} />
              </mesh>
              <mesh position={[0, 1.0, 0.3]}>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshStandardMaterial color="white" roughness={1.2} />
              </mesh>
            </group>
          ) : (
            <group
              ref={tailRef}
              position={[0, 0.2, -0.6]}
              rotation={[-0.6, 0, 0]}
            >
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
                <meshStandardMaterial color={currentPetColor} />
              </mesh>
              <mesh position={[0, 0.52, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="white" />
              </mesh>
            </group>
          )}
        </>
      )}

      {/* BEAR / PANDA LIMBS & CUTE PAWS */}
      {(petType === "bear" || petType === "panda") && (
        <>
          {/* Leg Color: Panda uses dark charcoal, Bear uses currentPetColor */}
          {/* Front Left */}
          <group position={[-0.35, -0.55, 0.2]}>
            <mesh>
              <capsuleGeometry args={[0.13, 0.35, 8, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
            <mesh position={[0, -0.22, 0.04]} scale={[1.2, 0.75, 1.2]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
          </group>
          {/* Front Right */}
          <group position={[0.35, -0.55, 0.2]}>
            <mesh>
              <capsuleGeometry args={[0.13, 0.35, 8, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
            <mesh position={[0, -0.22, 0.04]} scale={[1.2, 0.75, 1.2]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
          </group>
          {/* Back Left */}
          <group position={[-0.35, -0.55, -0.3]}>
            <mesh>
              <capsuleGeometry args={[0.13, 0.35, 8, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
            <mesh position={[0, -0.22, 0.04]} scale={[1.2, 0.75, 1.2]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
          </group>
          {/* Back Right */}
          <group position={[0.35, -0.55, -0.3]}>
            <mesh>
              <capsuleGeometry args={[0.13, 0.35, 8, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
            <mesh position={[0, -0.22, 0.04]} scale={[1.2, 0.75, 1.2]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={petType === "panda" ? patchColor : currentPetColor}
              />
            </mesh>
          </group>
        </>
      )}

      {/* PENGUIN FEET (orange webbed feet on ground) */}
      {petType === "penguin" && (
        <group position={[0, -0.76, 0.18]}>
          <mesh
            position={[-0.24, 0, 0]}
            rotation={[0.08, 0, 0.05]}
            scale={[1.2, 0.5, 1.5]}
          >
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#fbc531" roughness={0.5} />
          </mesh>
          <mesh
            position={[0.24, 0, 0]}
            rotation={[0.08, 0, -0.05]}
            scale={[1.2, 0.5, 1.5]}
          >
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#fbc531" roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* FROG CROUCHED HIND LEGS & WEBBED FEET */}
      {petType === "frog" && (
        <>
          {/* Crouched back legs */}
          <group position={[0, -0.4, -0.15]}>
            <mesh
              position={[-0.52, -0.1, 0.1]}
              rotation={[0.8, 0.4, -0.4]}
              scale={[1, 0.6, 0.6]}
            >
              <sphereGeometry args={[0.28, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh
              position={[0.52, -0.1, 0.1]}
              rotation={[0.8, -0.4, 0.4]}
              scale={[1, 0.6, 0.6]}
            >
              <sphereGeometry args={[0.28, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
          </group>
          {/* Front Legs */}
          <mesh position={[-0.3, -0.55, 0.3]} rotation={[0.15, 0, 0.08]}>
            <capsuleGeometry args={[0.075, 0.32, 8, 16]} />
            <meshStandardMaterial color={currentPetColor} />
          </mesh>
          <mesh position={[0.3, -0.55, 0.3]} rotation={[0.15, 0, -0.08]}>
            <capsuleGeometry args={[0.075, 0.32, 8, 16]} />
            <meshStandardMaterial color={currentPetColor} />
          </mesh>
          {/* Webbed feet */}
          <group position={[0, -0.74, 0.28]}>
            <mesh
              position={[-0.3, 0, 0.08]}
              rotation={[0, 0.15, 0]}
              scale={[1.4, 0.4, 1.6]}
            >
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh
              position={[0.3, 0, 0.08]}
              rotation={[0, -0.15, 0]}
              scale={[1.4, 0.4, 1.6]}
            >
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
          </group>
        </>
      )}

      {/* ELEPHANT STUBBY LEGS & WHITE TOENAILS */}
      {petType === "elephant" && (
        <>
          {/* Column limbs */}
          {/* Front Left */}
          <group position={[-0.38, -0.55, 0.25]}>
            <mesh>
              <capsuleGeometry args={[0.14, 0.42, 8, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, -0.22, 0.03]} scale={[1.15, 0.7, 1.2]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            {/* Toenails */}
            <mesh position={[-0.05, -0.26, 0.12]} scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0.05, -0.26, 0.12]} scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
          </group>
          {/* Front Right */}
          <group position={[0.38, -0.55, 0.25]}>
            <mesh>
              <capsuleGeometry args={[0.14, 0.42, 8, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, -0.22, 0.03]} scale={[1.15, 0.7, 1.2]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[-0.05, -0.26, 0.12]} scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0.05, -0.26, 0.12]} scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
          </group>
          {/* Back Left */}
          <group position={[-0.38, -0.55, -0.3]}>
            <mesh>
              <capsuleGeometry args={[0.14, 0.42, 8, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, -0.22, 0.03]} scale={[1.15, 0.7, 1.2]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
          </group>
          {/* Back Right */}
          <group position={[0.38, -0.55, -0.3]}>
            <mesh>
              <capsuleGeometry args={[0.14, 0.42, 8, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
            <mesh position={[0, -0.22, 0.03]} scale={[1.15, 0.7, 1.2]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={currentPetColor} />
            </mesh>
          </group>
        </>
      )}

      {/* SHEEP LIMBS & HOOVES */}
      {petType === "sheep" && (
        <group>
          {/* Front Left */}
          <group position={[-0.3, -0.55, 0.25]}>
            <mesh>
              <capsuleGeometry args={[0.065, 0.4, 8, 16]} />
              <meshStandardMaterial color="#222226" />
            </mesh>
            <mesh position={[0, -0.22, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 10]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </group>
          {/* Front Right */}
          <group position={[0.3, -0.55, 0.25]}>
            <mesh>
              <capsuleGeometry args={[0.065, 0.4, 8, 16]} />
              <meshStandardMaterial color="#222226" />
            </mesh>
            <mesh position={[0, -0.22, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 10]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </group>
          {/* Back Left */}
          <group position={[-0.3, -0.55, -0.25]}>
            <mesh>
              <capsuleGeometry args={[0.065, 0.4, 8, 16]} />
              <meshStandardMaterial color="#222226" />
            </mesh>
            <mesh position={[0, -0.22, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 10]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </group>
          {/* Back Right */}
          <group position={[0.3, -0.55, -0.25]}>
            <mesh>
              <capsuleGeometry args={[0.065, 0.4, 8, 16]} />
              <meshStandardMaterial color="#222226" />
            </mesh>
            <mesh position={[0, -0.22, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 10]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </group>
        </group>
      )}

      {/* ALIEN LEVITATING SPHERES (Sci-fi floating effect) */}
      {petType === "alien" && (
        <group position={[0, -0.65, 0]}>
          <mesh position={[-0.24, -0.12, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[0, -0.2, 0.14]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[0.24, -0.12, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function PetPage({
  username,
  userId,
  petName,
  onPetName,
  onPetId,
  onLogout,
}) {
  const [health, setHealth] = useState(100);
  const [isSyncing, setIsSyncing] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const [petId, setPetId] = useState(null);
  const [petType, setPetType] = useState(null);
  const [themeIndex, setThemeIndex] = useState(null);
  const [petColor, setPetColor] = useState(null);
  const [petColorSick, setPetColorSick] = useState(null);
  const [age, setAge] = useState({ y: 0, m: 0, d: 0, h: 0, i: 0, s: 0 });
  const [isDead, setIsDead] = useState(false);
  const [distractions, setDistractions] = useState([]);
  const [distractionsLoading, setDistractionsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const prevLogRef = useRef(null);
  const navigate = useNavigate();

  const fetchDistractions = useCallback(async (id, { silent = false } = {}) => {
    if (!id) return;
    if (!silent) setDistractionsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/pets/${id}/social-log`);
      if (response.ok) {
        const data = await response.json();
        const newToasts = detectNewPenalties(prevLogRef.current, data);
        if (newToasts.length > 0) {
          setToasts((prev) => [...prev, ...newToasts]);
          newToasts.forEach((toast) => {
            setTimeout(() => {
              setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, 5000);
          });
        }
        prevLogRef.current = data;
        setDistractions(data);
      }
    } catch (error) {
      console.error("Error fetching distraction log:", error);
    } finally {
      if (!silent) setDistractionsLoading(false);
    }
  }, []);

  const fetchPetData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/pets/${userId}`);
      if (response.ok) {
        const pet = await response.json();
        setPetId(pet.id);
        if (onPetId) onPetId(pet.id);
        // Set pet appearance from DB (permanent, unique per pet)
        setPetType(pet.pet_type || "bird");
        setThemeIndex(
          pet.theme_index !== undefined && pet.theme_index !== null
            ? pet.theme_index
            : 0,
        );
        setPetColor(pet.pet_color || null);
        setPetColorSick(pet.pet_color_sick || null);
        const birthStr = pet.birth_date.endsWith("Z")
          ? pet.birth_date
          : pet.birth_date + "Z";
        setBirthDate(new Date(birthStr));

        if (pet.is_alive === 0 || pet.health <= 0) {
          setHealth(0);
          setIsDead(true);
        } else {
          setHealth(pet.health);
        }

        await fetchDistractions(pet.id, {
          silent: prevLogRef.current !== null,
        });
      } else if (response.status === 404) {
        setIsDead(true);
        setHealth(0);
      }
    } catch (error) {
      console.error("Error fetching pet data:", error);
    }
  }, [userId, onPetId, fetchDistractions]);

  // Load font + initial fetch
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    fetchPetData();
  }, [fetchPetData]);

  // Poll server for health + distraction updates
  useEffect(() => {
    if (isDead) return;

    const syncInterval = setInterval(fetchPetData, HEALTH_POLL_MS);

    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") fetchPetData();
    };
    document.addEventListener("visibilitychange", refreshOnFocus);
    window.addEventListener("focus", fetchPetData);

    return () => {
      clearInterval(syncInterval);
      document.removeEventListener("visibilitychange", refreshOnFocus);
      window.removeEventListener("focus", fetchPetData);
    };
  }, [isDead, fetchPetData]);

  // Client-side visual health decay (smooth animation between server syncs)
  // Decay rate: lose 1 health point every 10 minutes and persist to database
  useEffect(() => {
    if (isDead || health <= 0 || !petId) return;

    const decayInterval = setInterval(
      async () => {
        const nextHealth = Math.max(0, health - 1);

        // Update local visual state
        setHealth(nextHealth);

        // Persist directly to the SQLite database
        try {
          await fetch(`${API_BASE}/api/pets/${petId}/health`, {
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
      },
      10 * 60 * 1000,
    ); // lose 1 hp every 10 minutes

    return () => clearInterval(decayInterval);
  }, [isDead, health, petId]);

  // Handle pet death — show alert and navigate away
  useEffect(() => {
    if (isDead) {
      setTimeout(() => {
        alert(
          `${petName} has passed away from neglect... 💀\nMake more commits to keep your next pet alive!`,
        );
        if (onPetName) onPetName(null);
        if (onPetId) onPetId(null);
        navigate("/name");
      }, 500);
    }
  }, [isDead, petName, onPetName, onPetId, navigate]);

  // Age timer — only runs once birthDate is loaded from the server
  useEffect(() => {
    if (!birthDate) return;

    const computeAge = () => {
      const now = new Date();
      let diff = Math.max(0, Math.floor((now - birthDate) / 1000));
      const y = Math.floor(diff / 31536000);
      diff %= 31536000;
      const m = Math.floor(diff / 2592000);
      diff %= 2592000;
      const d = Math.floor(diff / 86400);
      diff %= 86400;
      const h = Math.floor(diff / 3600);
      diff %= 3600;
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
        `${API_BASE}/api/pets/${petId}/sync-github`,
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

    await fetchPetData();
    setTimeout(() => setIsSyncing(false), 3000);
  };

  const totalWastedMinutes = distractions.reduce(
    (sum, row) => sum + row.total_minutes,
    0,
  );
  const totalDistractionPenalty = distractions.reduce(
    (sum, row) => sum + row.total_penalty,
    0,
  );

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
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .penalty-toast {
          animation: toastIn 0.35s ease forwards;
        }
      `}</style>

      {/* Distraction penalty toasts */}
      <div
        style={{
          position: "absolute",
          top: 88,
          right: 24,
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 320,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="penalty-toast"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              background: "rgba(127,29,29,0.9)",
              border: "1px solid rgba(248,113,113,0.45)",
              borderRadius: 12,
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              fontSize: "0.82rem",
              color: "#fecaca",
            }}
          >
            <AlertTriangle size={16} color="#f87171" />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

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
          @{username} •{" "}
          <span
            style={{
              color: petColor || resolvePetColors({ themeIndex }).base,
              fontWeight: 600,
            }}
          >
            {petType
              ? formatPetAppearance(petType, themeIndex, petColor, petColorSick)
              : ""}
          </span>
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
          <button className="nav-btn" onClick={() => navigate("/distractions")}>
            🚫 Distractions
          </button>
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

      {/* Middle Left — Focus & Distractions */}
      <div
        style={{
          position: "absolute",
          left: 24,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "min(300px, calc(100vw - 48px))",
        }}
      >
        <div
          style={{
            background: "rgba(15,10,30,0.78)",
            padding: "18px 20px",
            borderRadius: "16px",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(248,113,113,0.2)",
            boxShadow: "0 0 28px rgba(248,113,113,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Focus size={16} color="#f87171" />
            <p
              style={{
                margin: 0,
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#aea5c0",
              }}
            >
              Focus & Distractions
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.68rem",
                  color: "#6b5a8a",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Wasted today
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "#c4b5fd",
                }}
              >
                {distractionsLoading ? "…" : `${totalWastedMinutes} min`}
              </p>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.68rem",
                  color: "#6b5a8a",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Health lost
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "#f87171",
                }}
              >
                {distractionsLoading ? "…" : `−${totalDistractionPenalty} HP`}
              </p>
            </div>
          </div>

          {distractionsLoading ? (
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b5a8a" }}>
              Loading…
            </p>
          ) : distractions.length === 0 ? (
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#7c6ca0" }}>
              No distractions today — great focus! 🎉
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxHeight: 220,
                overflowY: "auto",
              }}
            >
              {distractions.slice(0, 6).map((row) => {
                const meta = getSiteMeta(row.site);
                const Icon = meta.Icon;
                return (
                  <div
                    key={row.site}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 10,
                      background: "rgba(139,92,246,0.06)",
                      border: "1px solid rgba(139,92,246,0.12)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 0,
                      }}
                    >
                      <Icon size={15} color={meta.color} />
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#e2d9f3",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "#c4b5fd",
                          fontWeight: 600,
                        }}
                      >
                        {row.total_minutes}m
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#f87171",
                          fontWeight: 600,
                        }}
                      >
                        −{row.total_penalty} HP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p
            style={{
              margin: "12px 0 0",
              fontSize: "0.65rem",
              color: "#6b5a8a",
            }}
          >
            10 min on a tracked site = −1 HP
          </p>

          <button
            type="button"
            className="nav-btn"
            onClick={() => navigate("/distractions")}
            style={{
              marginTop: 12,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            Full report <ChevronRight size={14} />
          </button>
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
        <PetModel
          isSyncing={isSyncing}
          health={health}
          petType={petType}
          themeIndex={themeIndex}
          petColor={petColor}
          petColorSick={petColorSick}
        />
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
