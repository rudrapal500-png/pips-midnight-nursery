import { useRef, useMemo, useState, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './DreamRoom.css';

/**
 * Deterministic pseudo-random helper.
 */
function pseudoRandom(seed) {
  const x = Math.sin(seed * 7891.23) * 10000;
  return x - Math.floor(x);
}

function isWebGLSupported() {
  try {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

class DreamRoomErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    console.warn('Dream Room 3D fallback active:', err);
  }

  render() {
    if (this.state.hasError) {
      return <div className="dream-room-css-fallback" aria-hidden="true" />;
    }
    return this.props.children;
  }
}

/**
 * 3D Dream Bubbles drifting gently upward in the nursery.
 */
function DreamBubbles({ count = 8, isDay = false }) {
  const groupRef = useRef();

  const bubbleData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const r1 = pseudoRandom(i * 3 + 1);
      const r2 = pseudoRandom(i * 3 + 2);
      const r3 = pseudoRandom(i * 3 + 3);

      return {
        x: (r1 - 0.5) * 14,
        y: (r2 - 0.5) * 8 - 1,
        z: (r3 - 0.5) * 6 - 2,
        radius: 0.35 + r1 * 0.45,
        speed: 0.2 + r2 * 0.3,
        wobble: 0.8 + r3 * 1.2,
      };
    });
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    groupRef.current.children.forEach((mesh, i) => {
      const b = bubbleData[i];
      // Slowly rise and wrap around
      mesh.position.y = ((b.y + t * b.speed) % 10) - 4;
      mesh.position.x = b.x + Math.sin(t * b.wobble + i) * 0.25;
      mesh.rotation.y = t * 0.2;
    });
  });

  const bubbleColor = isDay ? '#fbcfe8' : '#e9d5ff';

  return (
    <group ref={groupRef}>
      {bubbleData.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <sphereGeometry args={[b.radius, 16, 16]} />
          <meshStandardMaterial
            color={bubbleColor}
            roughness={0.1}
            metalness={0.15}
            transparent
            opacity={isDay ? 0.45 : 0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 3D Clouds drifting in the background.
 */
function RoomCloud({ position, scale = 1, speed = 0.06, color = '#2b2158' }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.x -= delta * speed;
    if (ref.current.position.x < -18) {
      ref.current.position.x = 18;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <mesh position={[-0.9, -0.2, 0.1]}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[1.0, -0.15, -0.1]}>
        <sphereGeometry args={[1.0, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.55} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * 3D Crescent Moon / Morning Sun in the Dream Room.
 */
function CelestialOrb3D({ isDay = false }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = 4.2 + Math.sin(t * 0.7) * 0.12;
  });

  return (
    <group ref={meshRef} position={[6.5, 4.2, -5]}>
      {/* Radiant celestial body */}
      <mesh>
        <sphereGeometry args={[isDay ? 1.6 : 1.3, 24, 24]} />
        <meshStandardMaterial
          color={isDay ? '#fde047' : '#fef08a'}
          emissive={isDay ? '#f59e0b' : '#fde047'}
          emissiveIntensity={isDay ? 0.9 : 0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Soft celestial aura */}
      <mesh position={[0, 0, -0.2]}>
        <circleGeometry args={[isDay ? 2.8 : 2.2, 24]} />
        <meshBasicMaterial
          color={isDay ? '#fef08a' : '#d8b4fe'}
          transparent
          opacity={isDay ? 0.35 : 0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Point light */}
      <pointLight
        color={isDay ? '#fde047' : '#fef08a'}
        intensity={isDay ? 3.0 : 1.8}
        distance={16}
        decay={2}
      />
    </group>
  );
}

/**
 * 3D Starfield with visibility adjusting smoothly based on Day/Night.
 */
function RoomStarfield({ count = 90, isDay = false }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#fffbeb'),
      new THREE.Color('#fef08a'),
      new THREE.Color('#e9d5ff'),
      new THREE.Color('#fbcfe8'),
    ];

    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 3 + 1);
      const r2 = pseudoRandom(i * 3 + 2);
      const r3 = pseudoRandom(i * 3 + 3);

      pos[i * 3] = (r1 - 0.5) * 28;
      pos[i * 3 + 1] = (r2 - 0.2) * 18;
      pos[i * 3 + 2] = -4 - r3 * 14;

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        opacity={isDay ? 0.18 : 0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Dream Room Scene Container.
 */
function RoomScene({ isDay = false }) {
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x += (mouse.current.x * 0.35 - groupRef.current.position.x) * 0.035;
    groupRef.current.position.y += (mouse.current.y * 0.25 - groupRef.current.position.y) * 0.035;
  });

  const ambientColor = isDay ? '#fdf4ff' : '#1e1642';
  const ambientIntensity = isDay ? 1.9 : 1.3;
  const cloudColor = isDay ? '#f5d0fe' : '#2d2258';

  return (
    <group ref={groupRef}>
      <ambientLight color={ambientColor} intensity={ambientIntensity} />
      <directionalLight
        position={[-5, 7, 4]}
        color={isDay ? '#fed7aa' : '#c084fc'}
        intensity={isDay ? 1.5 : 0.8}
      />

      <CelestialOrb3D isDay={isDay} />
      <RoomStarfield count={90} isDay={isDay} />
      <DreamBubbles count={8} isDay={isDay} />

      <RoomCloud position={[-7, -2.5, -6]} scale={1.8} speed={0.08} color={cloudColor} />
      <RoomCloud position={[5, -3.2, -4]} scale={2.0} speed={0.11} color={cloudColor} />
      <RoomCloud position={[-1, -4.5, -3]} scale={2.4} speed={0.14} color={cloudColor} />
    </group>
  );
}

/**
 * Main DreamRoomCanvas3D export.
 */
export default function DreamRoomCanvas3D({ isDay = false }) {
  const [canRenderWebGL] = useState(() => isWebGLSupported());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener?.('change', listener);
    return () => mql.removeEventListener?.('change', listener);
  }, []);

  if (!canRenderWebGL || prefersReducedMotion) {
    return <div className="dream-room-css-fallback" aria-hidden="true" />;
  }

  return (
    <div className="dream-room-canvas-wrapper" aria-hidden="true">
      <DreamRoomErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 46 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: 'low-power',
            alpha: true,
            stencil: false,
            depth: true,
          }}
          className="dream-room-canvas"
        >
          <RoomScene isDay={isDay} />
        </Canvas>
      </DreamRoomErrorBoundary>
    </div>
  );
}
