import { useEffect, useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import SpotlightCard from '../components/SpotlightCard';

import FloatingBlobs from '../components/FloatingBlobs';

import './Home.css';

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }

    const particles: Particle[] = Array.from({ length: 75 }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w()) p.vx *= -1;
        if (p.y < 0 || p.y > h()) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', pointerEvents: 'none', zIndex: 1 }}
      aria-hidden="true"
    />
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const scaleInVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="container" style={{ position: 'relative', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Floating blobs behind the main section */}
      <FloatingBlobs />

      <section id="home" className="hero-section scanlines">
        <ParticleField />
        <div className="hero-radial-glow-1" aria-hidden="true" />
        <div className="hero-radial-glow-2" aria-hidden="true" />

        <div className="hero-content">
          <div className={`hero-badge ${loaded ? 'visible' : ''}`}>
            <span className="badge-dot">
              <span className="badge-dot-ping" />
              <span className="badge-dot-inner" />
            </span>
            <span className="badge-text">CSCP-CET // Active Now</span>
          </div>

          <div className={`hero-title-container delay-200 ${loaded ? 'visible' : ''}`}>
            <h1 className="hero-title">
              <span style={{ display: 'block' }}>Cyber Security</span>
              <span className="highlight">
                <span className="animate-glitch" aria-hidden="true">{'& '} Competitive</span>
              </span>
              <span style={{ display: 'block' }}>Programming</span>
            </h1>
          </div>

          <div className={`hero-subtitle delay-500 ${loaded ? 'visible' : ''}`}>
            Build securely. Think critically. Compete relentlessly. Workshops, CTFs, contests, and peer-learning sessions that push your limits.
          </div>

          <div className={`scroll-indicator delay-1200 ${loaded ? 'visible' : ''}`}>
            <span className="scroll-text">scroll</span>
            <div className="scroll-line" />
          </div>
        </div>
      </section>      

      {/* Grid of Section Focus Cards styled with neon spotlight effects */}
      <motion.section 
        style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} style={{ height: '100%' }}>
          <SpotlightCard style={{ height: '100%' }} className="card" spotlightColor="rgba(168, 85, 247, 0.25)">
            <div style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: '"Orbitron", sans-serif', color: 'var(--accent)' }}>Focus</div>
              <div style={{ marginTop: 14, fontSize: '1.35rem', fontWeight: 600, fontFamily: '"Russo One", sans-serif', letterSpacing: '1px' }}>Offensive & Defensive Security</div>
              <p className="muted" style={{ marginTop: '18px', fontSize: '1rem', flexGrow: 1, lineHeight: 1.6 }}>Master real-world pentesting, cryptography, and secure architecture.</p>
            </div>
          </SpotlightCard>
        </motion.div>

        <motion.div variants={itemVariants} style={{ height: '100%' }}>
          <SpotlightCard style={{ height: '100%' }} className="card" spotlightColor="rgba(56, 189, 248, 0.25)">
            <div style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: '"Orbitron", sans-serif', color: 'var(--accent-2)' }}>Practice</div>
              <div style={{ marginTop: 14, fontSize: '1.35rem', fontWeight: 600, fontFamily: '"Russo One", sans-serif', letterSpacing: '1px' }}>CP + DSA + Contests</div>
              <p className="muted" style={{ marginTop: '18px', fontSize: '1rem', flexGrow: 1, lineHeight: 1.6 }}>Sharpen algorithms and data structures to dominate competitive programming.</p>
            </div>
          </SpotlightCard>
        </motion.div>

        <motion.div variants={itemVariants} style={{ height: '100%' }}>
          <SpotlightCard style={{ height: '100%' }} className="card" spotlightColor="rgba(251, 113, 133, 0.25)">
            <div style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: '"Orbitron", sans-serif', color: 'var(--accent-3)' }}>Community</div>
              <div style={{ marginTop: 14, fontSize: '1.35rem', fontWeight: 600, fontFamily: '"Russo One", sans-serif', letterSpacing: '1px' }}>Mentorship + Teamwork</div>
              <p className="muted" style={{ marginTop: '18px', fontSize: '1rem', flexGrow: 1, lineHeight: 1.6 }}>Grow with peers through collaborative hackathons and expert guidance.</p>
            </div>
          </SpotlightCard>
        </motion.div>
      </motion.section>
    </div>
  );
}
