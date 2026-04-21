import { useRef, useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Torus, Icosahedron, MeshDistortMaterial, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, TrendingUp, Heart, Zap, Check, Star, ChevronDown } from 'lucide-react';

/* ───────────────────────────── 3D COMPONENTS ───────────────────────────── */

// Floating gold DNA helix / wealth strand
function WealthHelix() {
  const ref = useRef();
  const pointsRef = useRef();

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 200; i++) {
      const t = (i / 200) * Math.PI * 8;
      const r = 1.8;
      pts.push(new THREE.Vector3(
        Math.cos(t) * r,
        (i / 200) * 12 - 6,
        Math.sin(t) * r
      ));
    }
    return pts;
  }, []);

  const points2 = useMemo(() => {
    return points.map(p => new THREE.Vector3(-p.x, p.y, -p.z));
  }, [points]);

  const geometry1 = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  const geometry2 = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points2);
    return g;
  }, [points2]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.12;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <group ref={ref} position={[3.5, 0, -3]}>
      <line geometry={geometry1}>
        <lineBasicMaterial color="#00C48C" linewidth={2} transparent opacity={0.7} />
      </line>
      <line geometry={geometry2}>
        <lineBasicMaterial color="#4B6EF5" linewidth={2} transparent opacity={0.7} />
      </line>
      {/* Connection bars */}
      {points.filter((_, i) => i % 20 === 0).map((p, i) => (
        <line key={i} geometry={new THREE.BufferGeometry().setFromPoints([p, points2[i * 20]])}>
          <lineBasicMaterial color="#F59E0B" transparent opacity={0.5} />
        </line>
      ))}
    </group>
  );
}

// Floating geometric coins / assets
function FloatingOrb({ position, color, scale = 1, speed = 1, shape = 'torus' }) {
  const ref = useRef();
  const offset = Math.random() * Math.PI * 2;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.4;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.6;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5 + offset) * 0.4;
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        {shape === 'torus' && <torusGeometry args={[0.5, 0.18, 16, 64]} />}
        {shape === 'ico' && <icosahedronGeometry args={[0.5, 1]} />}
        {shape === 'oct' && <octahedronGeometry args={[0.5]} />}
        {shape === 'box' && <boxGeometry args={[0.7, 0.7, 0.7]} />}
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe={shape === 'ico'}
        />
      </mesh>
    </Float>
  );
}

// Central hero orb — glowing pulsing wealth sphere
function HeroOrb() {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[-3, 0, 0]}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshStandardMaterial
          color="#00C48C"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Main orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#0D1321"
          emissive="#00C48C"
          emissiveIntensity={0.12}
          metalness={0.9}
          roughness={0.05}
          distort={0.3}
          speed={2}
        />
      </mesh>
      {/* Ring 1 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.025, 16, 128]} />
        <meshStandardMaterial color="#00C48C" emissive="#00C48C" emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
      {/* Ring 2 */}
      <mesh rotation={[Math.PI / 3, 0.4, 0]}>
        <torusGeometry args={[2.6, 0.015, 16, 128]} />
        <meshStandardMaterial color="#4B6EF5" emissive="#4B6EF5" emissiveIntensity={0.8} transparent opacity={0.4} />
      </mesh>
      {/* Ring 3 */}
      <mesh rotation={[-Math.PI / 4, 0.8, 0]}>
        <torusGeometry args={[3.0, 0.01, 16, 128]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.6} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Particle field
function ParticleField() {
  const count = 4000;
  const ref = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#00C48C'),
      new THREE.Color('#4B6EF5'),
      new THREE.Color('#F59E0B'),
      new THREE.Color('#8B5CF6'),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// Floating data streams
function DataStreams() {
  const lines = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const pts = [];
      const x = (i - 6) * 2;
      for (let j = 0; j < 30; j++) {
        pts.push(new THREE.Vector3(
          x + Math.sin(j * 0.3 + i) * 0.5,
          -15 + j,
          -8 + Math.cos(j * 0.2 + i) * 0.5
        ));
      }
      return { pts, color: i % 3 === 0 ? '#00C48C' : i % 3 === 1 ? '#4B6EF5' : '#F59E0B8A' };
    });
  }, []);

  const refs = useRef([]);

  useFrame((state) => {
    refs.current.forEach((r, i) => {
      if (r) r.position.y = (state.clock.elapsedTime * 0.8 + i * 2) % 20 - 10;
    });
  });

  return (
    <group>
      {lines.map((l, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(l.pts);
        return (
          <line key={i} ref={el => refs.current[i] = el} geometry={geo}>
            <lineBasicMaterial color={l.color} transparent opacity={0.15} />
          </line>
        );
      })}
    </group>
  );
}

// Scroll-aware camera
function CameraRig({ scrollY }) {
  const { camera } = useThree();

  useFrame(() => {
    const target = scrollY.current;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6 + target * 0.005, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -target * 0.002, 0.05);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, target * 0.0003, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─────────────────────────── MAIN SCENE ────────────────────────────────── */
function Scene({ scrollY }) {
  return (
    <>
      <CameraRig scrollY={scrollY} />
      <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
      <ParticleField />
      <DataStreams />
      <HeroOrb />
      <WealthHelix />
      {/* Floating shapes */}
      <FloatingOrb position={[6, 2, -2]} color="#00C48C" scale={0.8} speed={1.2} shape="torus" />
      <FloatingOrb position={[-6, -2, -4]} color="#4B6EF5" scale={1.1} speed={0.8} shape="ico" />
      <FloatingOrb position={[5, -3, -6]} color="#F59E0B" scale={0.6} speed={1.5} shape="oct" />
      <FloatingOrb position={[-5, 3, -2]} color="#8B5CF6" scale={0.9} speed={1.0} shape="oct" />
      <FloatingOrb position={[8, 0, -8]} color="#F6465D" scale={0.7} speed={1.3} shape="ico" />
      <FloatingOrb position={[-8, 1, -6]} color="#06B6D4" scale={0.8} speed={0.9} shape="torus" />
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[-4, 2, 2]} intensity={2} color="#00C48C" />
      <pointLight position={[4, -2, 2]} intensity={2} color="#4B6EF5" />
      <pointLight position={[0, 0, 4]} intensity={1} color="#F59E0B" />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
    </>
  );
}

/* ─────────────────────────── UI OVERLAY ────────────────────────────────── */

const FEATURES = [
  { icon: Shield, color: '#818CF8', title: 'Digital Asset Vault', desc: 'Track every account, investment and property in one encrypted place.' },
  { icon: Heart, color: '#FB7185', title: 'AI Letters (Gemini)', desc: 'Deeply personal farewell letters powered by real asset data and AI.' },
  { icon: TrendingUp, color: '#00C48C', title: 'Wealth Simulator', desc: 'Monte Carlo projections show your family wealth across 30 years.' },
  { icon: Zap, color: '#FBBF24', title: "Dead Man's Switch", desc: 'Automated inactivity alerts that protect your family automatically.' },
];

const STATS = [
  { v: '₹2.4Cr+', l: 'Assets Protected' },
  { v: '1,200+', l: 'Families' },
  { v: '4,800+', l: 'Letters Written' },
  { v: '99.9%', l: 'Uptime' },
];

const TESTIMONIALS = [
  { name: 'Arjun Mehta', role: 'Software Engineer, Bangalore', text: 'The AI letters made my family cry — in the best way. This platform is a game changer.' },
  { name: 'Priya Sharma', role: 'Doctor, Mumbai', text: "The Dead Man's Switch gives me genuine peace of mind for my family's future." },
  { name: 'Vikram Nair', role: 'Entrepreneur, Chennai', text: 'Real-time stock tracking + estate planning in one place. Incredible product.' },
];

const TICKER_STATS = ['₹2.4Cr+ Protected', '1,200+ Families', 'Live Market Data', 'Gemini AI Powered', '4,800+ Letters', 'NSE/BSE/Crypto', '99.9% Uptime', '256-bit Encrypted'];

export default function Landing() {
  const nav = useNavigate();
  const scrollRef = useRef({ current: 0 });
  const containerRef = useRef();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current.current = window.scrollY;
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen" style={{ background: '#050810' }}>

      {/* 3D Canvas — fixed background */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: 'radial-gradient(ellipse at center, #0B0E1A 0%, #050810 100%)' }}
        >
          <Scene scrollY={scrollRef.current} />
        </Canvas>
      </div>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
        style={{ background: scrolled ? 'rgba(5,8,16,0.9)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)' }}>↑</div>
            <span className="font-bold text-lg text-white">Inheritance OS</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Security', 'Pricing'].map(l => (
              <span key={l} className="text-sm cursor-pointer transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>{l}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => nav('/login')} className="text-sm px-4 py-2 rounded-xl transition-all" style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>Sign In</button>
            <button onClick={() => nav('/login')} className="text-sm font-semibold px-5 py-2 rounded-xl transition-all" style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)', boxShadow: '0 0 20px rgba(75,110,245,0.3)' }}>Get Started →</button>
          </div>
        </div>
      </nav>

      {/* ── Live Ticker ─────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 mt-16" style={{ background: 'rgba(0,196,140,0.08)', borderBottom: '1px solid rgba(0,196,140,0.15)' }}>
        <div className="overflow-hidden py-1.5">
          <div className="flex gap-10 animate-ticker whitespace-nowrap">
            {[...TICKER_STATS, ...TICKER_STATS, ...TICKER_STATS].map((s, i) => (
              <span key={i} className="text-xs font-semibold flex-shrink-0" style={{ color: 'rgba(0,196,140,0.9)' }}>
                ● {s} {'  '}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center pt-24">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold"
                style={{ background: 'rgba(0,196,140,0.1)', color: '#00C48C', border: '1px solid rgba(0,196,140,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C] animate-pulse" />
                Powered by Google Gemini AI · Live Market Data
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
              className="font-black leading-[1.06] tracking-tight mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 68px)', color: 'white' }}
            >
              Your Wealth
              <br />
              Transfers{' '}
              <span style={{ background: 'linear-gradient(135deg, #00C48C, #4B6EF5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Love
              </span>,
              <br />
              Not{' '}
              <span style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through', textDecorationColor: '#F6465D' }}>
                Chaos
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
              className="text-lg leading-relaxed mb-8"
              style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 480 }}
            >
              India's most advanced AI estate planning platform. Track live assets,
              simulate generational wealth, and create farewell letters your family will treasure.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="flex gap-4">
              <button onClick={() => nav('/login')}
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all"
                style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)', boxShadow: '0 0 40px rgba(75,110,245,0.35)' }}>
                Start for Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => nav('/dashboard')}
                className="px-8 py-4 rounded-2xl font-bold text-base transition-all"
                style={{ color: 'white', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}>
                View Demo
              </button>
            </motion.div>

            {/* Trust row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex items-center gap-5 mt-8">
              {['SSL Encrypted', 'GDPR Compliant', 'Zero Data Sold'].map(b => (
                <div key={b} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <Check size={11} style={{ color: '#00C48C' }} /> {b}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — 3D space is visible here (canvas is behind) */}
          <div className="hidden lg:block">
            {/* Floating stats cards in 3D zone */}
            <div className="relative h-[480px]">
              {[
                { label: 'Portfolio Value', val: '₹2.25Cr', color: '#00C48C', pos: 'top-8 right-8' },
                { label: 'Live Assets', val: 'AAPL · BTC-USD', color: '#4B6EF5', pos: 'top-1/2 left-0' },
                { label: 'Estate Readiness', val: '83%', color: '#FBBF24', pos: 'bottom-8 right-12' },
              ].map((c, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className={`absolute ${c.pos} px-4 py-3 rounded-2xl`}
                  style={{ background: 'rgba(13,19,33,0.85)', border: `1px solid ${c.color}30`, backdropFilter: 'blur(12px)', boxShadow: `0 0 20px ${c.color}20` }}
                >
                  <div className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.label}</div>
                  <div className="font-bold font-mono-num" style={{ color: c.color, fontSize: 17 }}>{c.val}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </motion.div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-4 gap-px rounded-3xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
          >
            {STATS.map((s, i) => (
              <div key={i} className="text-center py-8 px-4" style={{ background: 'rgba(5,8,16,0.6)', backdropFilter: 'blur(20px)' }}>
                <div className="text-3xl font-bold font-mono-num mb-1" style={{ color: '#00C48C' }}>{s.v}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(75,110,245,0.12)', color: '#818CF8', border: '1px solid rgba(75,110,245,0.2)' }}>
            Platform Features
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Everything Your Family Needs</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Built for Indian families. Powered by AI. Designed with love.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group p-7 rounded-3xl cursor-pointer transition-all duration-300"
              style={{ background: 'rgba(13,19,33,0.7)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)' }}
              whileHover={{ scale: 1.02, borderColor: `${f.color}40` }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}25` }}>
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: f.color }}>
                Learn more <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Trusted by Indian Families</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)' }}>Join thousands who've secured their legacy</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl"
              style={{ background: 'rgba(13,19,33,0.7)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)' }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array(5).fill(0).map((_, j) => <Star key={j} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)' }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative z-10 py-20 max-w-4xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="text-center p-16 rounded-[2.5rem] relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(75,110,245,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(75,110,245,0.2)', backdropFilter: 'blur(20px)' }}
        >
          {/* Glow orbs inside CTA */}
          <div className="absolute top-[-40%] left-[20%] w-64 h-64 rounded-full blur-[80px]" style={{ background: 'rgba(75,110,245,0.15)' }} />
          <div className="absolute bottom-[-40%] right-[20%] w-64 h-64 rounded-full blur-[80px]" style={{ background: 'rgba(0,196,140,0.1)' }} />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-3">Ready to Protect Your Legacy?</h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Join 1,200+ Indian families who plan ahead with Inheritance OS
            </p>
            <button onClick={() => nav('/login')}
              className="inline-flex items-center gap-3 px-12 py-4 rounded-2xl text-lg font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)', boxShadow: '0 0 50px rgba(75,110,245,0.4)' }}>
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>No credit card required · Cancel anytime</p>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="relative z-10 border-t py-8 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Inheritance OS — Built with ❤️ for Indian Families · Powered by Gemini AI · Live Yahoo Finance
        </p>
      </footer>
    </div>
  );
}
