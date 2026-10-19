import { useRef, useMemo, useState, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CssDreamSky from './CssDreamSky';
import './DreamCanvas3D.css';

/**
 * Deterministic pseudo-random generator for pure React renders.
 */
function pseudoRandom(seed) {
  const x = Math.sin(seed * 9876.54) * 10000;
  return x - Math.floor(x);
}

/**
 * Checks if WebGL is supported by the client browser.
 */
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

/**
 * ErrorBoundary to guarantee the hero never crashes if WebGL fails.
 */
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL scene encountered an issue, falling back to CSS Dream Sky:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <CssDreamSky />;
    }
    return this.props.children;
  }
}

/**
 * 3D Twinkling Starfield using lightweight BufferGeometry (1 draw call).
 */
function DreamStarfield({ count = 140 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#fffbeb'), // Starlight cream
      new THREE.Color('#fef08a'), // Soft golden
      new THREE.Color('#e9d5ff'), // Lavender
      new THREE.Color('#fbcfe8'), // Soft pink
      new THREE.Color('#93c5fd'), // Pale cyan
    ];

    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 3 + 1);
      const r2 = pseudoRandom(i * 3 + 2);
      const r3 = pseudoRandom(i * 3 + 3);

      pos[i * 3] = (r1 - 0.5) * 36;
      pos[i * 3 + 1] = (r2 - 0.3) * 24;
      pos[i * 3 + 2] = -5 - r3 * 20;

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.012;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.88}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * 3D Drifting Dream Dust that rises gently.
 */
function DreamDust({ count = 24 }) {
  const groupRef = useRef();
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const r1 = pseudoRandom(i * 4 + 1);
      const r2 = pseudoRandom(i * 4 + 2);
      const r3 = pseudoRandom(i * 4 + 3);
      const r4 = pseudoRandom(i * 4 + 4);

      return {
        x: (r1 - 0.5) * 20,
        y: (r2 - 0.5) * 12,
        z: (r3 - 0.5) * 8 - 2,
        speedY: 0.15 + r4 * 0.25,
        wobbleSpeed: 0.5 + r1 * 1.5,
        phase: r2 * Math.PI * 2,
        color: i % 2 === 0 ? '#fbcfe8' : '#fde047',
      };
    });
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((mesh, i) => {
      const p = particles[i];
      mesh.position.y = ((p.y + t * p.speedY) % 14) - 7;
      mesh.position.x = p.x + Math.sin(t * p.wobbleSpeed + p.phase) * 0.4;
      const s = 0.08 + Math.sin(t * 2 + p.phase) * 0.03;
      mesh.scale.set(s, s, s);
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={p.color}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 3D Crescent Moon in the upper right sky.
 */
function CrescentMoon3D() {
  const moonRef = useRef();

  useFrame((state) => {
    if (!moonRef.current) return;
    const t = state.clock.elapsedTime;
    moonRef.current.position.y = 5.2 + Math.sin(t * 0.6) * 0.15;
    moonRef.current.rotation.z = Math.sin(t * 0.4) * 0.04;
  });

  const crescentShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 1.8, -Math.PI * 0.45, Math.PI * 0.45, false);
    shape.absarc(0.7, 0, 1.45, Math.PI * 0.45, -Math.PI * 0.45, true);
    return shape;
  }, []);

  return (
    <group ref={moonRef} position={[8.5, 5.2, -6]}>
      <mesh rotation={[0, -0.2, 0.1]}>
        <extrudeGeometry
          args={[
            crescentShape,
            {
              depth: 0.25,
              bevelEnabled: true,
              bevelSegments: 4,
              steps: 1,
              bevelSize: 0.08,
              bevelThickness: 0.08,
            },
          ]}
        />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fde047"
          emissiveIntensity={0.65}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0.4, 0, -0.2]}>
        <circleGeometry args={[2.8, 24]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight color="#fef08a" intensity={2.2} distance={18} decay={2} position={[0, 0, 1]} />
    </group>
  );
}

/**
 * Floating 3D Cloud Cluster composed of soft low-poly spheres.
 */
function CloudPuff({ position, scale = 1, speed = 0.08, color = '#2e2557' }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.x -= delta * speed;
    if (ref.current.position.x < -24) {
      ref.current.position.x = 24;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.65} depthWrite={false} />
      </mesh>
      <mesh position={[-1.2, -0.3, 0.2]}>
        <sphereGeometry args={[1.1, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <mesh position={[1.3, -0.2, -0.1]}>
        <sphereGeometry args={[1.2, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <mesh position={[0.5, 0.7, 0.1]}>
        <sphereGeometry args={[1.0, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * Scene Manager with subtle group parallax reaction to pointer.
 */
function DreamScene() {
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
    // Smooth group parallax without mutating camera hook value
    groupRef.current.position.x += (mouse.current.x * 0.4 - groupRef.current.position.x) * 0.04;
    groupRef.current.position.y += (mouse.current.y * 0.3 - groupRef.current.position.y) * 0.04;
  });

  return (
    <group ref={groupRef}>
      {/* Dream Lighting */}
      <ambientLight color="#1e1642" intensity={1.4} />
      <directionalLight position={[-6, 8, 5]} color="#d8b4fe" intensity={0.9} />
      <pointLight position={[5, -2, 3]} color="#f472b6" intensity={1.8} distance={15} decay={2} />

      {/* 3D Celestial Objects */}
      <CrescentMoon3D />
      <DreamStarfield count={130} />
      <DreamDust count={20} />

      {/* Floating Fluffy Cloud Clusters at different depths */}
      <CloudPuff position={[-9, -3.5, -7]} scale={1.8} speed={0.12} color="#2d2258" />
      <CloudPuff position={[6, -4.2, -5]} scale={2.2} speed={0.16} color="#3b2d6e" />
      <CloudPuff position={[-2, -5.5, -3]} scale={2.5} speed={0.2} color="#4c3682" />
      <CloudPuff position={[14, -3.0, -8]} scale={1.9} speed={0.1} color="#261b4d" />
      <CloudPuff position={[-16, 2.5, -9]} scale={1.5} speed={0.08} color="#231945" />
    </group>
  );
}

/**
 * Main DreamCanvas3D Component with WebGL detection & automatic CSS fallback.
 */
export default function DreamCanvas3D() {
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
    return <CssDreamSky />;
  }

  return (
    <div className="dream-canvas-container" aria-hidden="true">
      <div className="canvas-gradient-underlay" />
      
      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 11], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: 'low-power',
            alpha: true,
            stencil: false,
            depth: true,
          }}
          className="three-dream-canvas"
        >
          <DreamScene />
        </Canvas>
      </WebGLErrorBoundary>

      <div className="canvas-mist-overlay" />
    </div>
  );
}
