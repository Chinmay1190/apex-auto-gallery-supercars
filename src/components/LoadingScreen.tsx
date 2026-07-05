import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TAGLINES = [
  'Igniting twelve cylinders',
  'Calibrating launch control',
  'Polishing carbon fibre',
  'Warming carbon-ceramics',
  'Syncing dual-clutch gearbox',
  'Pressurising fuel rails',
  'Aligning aero surfaces',
];

const SYSTEMS = [
  { label: 'Powertrain', at: 18 },
  { label: 'Aero', at: 42 },
  { label: 'Telemetry', at: 68 },
  { label: 'Cabin', at: 92 },
];

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 700);
          return 100;
        }
        return prev + Math.random() * 11 + 3.5;
      });
    }, 140);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTaglineIdx(i => (i + 1) % TAGLINES.length), 1100);
    return () => clearInterval(t);
  }, []);

  const clamped = Math.min(progress, 100);
  const ARC_LENGTH = 360;
  const dash = (clamped / 100) * ARC_LENGTH;
  const needleAngle = -110 + (clamped / 100) * 220;
  // RPM readout — purely visual, climbs with progress
  const rpm = Math.round(800 + (clamped / 100) * 8400);
  const gear = clamped < 20 ? 1 : clamped < 40 ? 2 : clamped < 60 ? 3 : clamped < 80 ? 4 : clamped < 95 ? 5 : 6;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.12),transparent_60%)]" />

          {/* Conic spotlight sweep */}
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg at 50% 50%, transparent 0deg, hsl(var(--gold)/0.4) 12deg, transparent 40deg, transparent 360deg)',
              mixBlendMode: 'screen',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          />

          {/* Animated grid floor */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              maskImage: 'linear-gradient(to top, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
            }}
          />

          {/* Scanline overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, hsl(var(--gold)) 0 1px, transparent 1px 3px)',
            }}
          />

          {/* Drifting light streaks */}
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-48 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              style={{ top: `${10 + i * 11}%` }}
              initial={{ x: '-20vw' }}
              animate={{ x: '120vw' }}
              transition={{
                duration: 2.6 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'linear',
              }}
            />
          ))}

          {/* Particle field */}
          <div className="absolute inset-0">
            {[...Array(32)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/30"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.15, 0.75, 0.15],
                  scale: [1, 1.6, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Speedometer */}
          <div className="relative mb-10 w-60 h-60">
            {/* Outer ring rotation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="96" fill="none" stroke="hsl(var(--border) / 0.5)" strokeWidth="0.5" strokeDasharray="2 6" />
                <circle cx="100" cy="100" r="92" fill="none" stroke="hsl(var(--gold) / 0.15)" strokeWidth="0.5" strokeDasharray="1 4" />
              </svg>
            </motion.div>

            {/* Counter-rotating inner ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-3"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="88" fill="none" stroke="hsl(var(--gold) / 0.25)" strokeWidth="0.4" strokeDasharray="6 10" />
              </svg>
            </motion.div>

            {/* Speedometer arc */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-[110deg]">
              <defs>
                <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--gold-light))" />
                  <stop offset="55%" stopColor="hsl(var(--gold))" />
                  <stop offset="100%" stopColor="hsl(var(--luxury-red, var(--gold-dark)))" />
                </linearGradient>
                <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--gold) / 0.8)" />
                  <stop offset="100%" stopColor="hsl(var(--gold) / 0)" />
                </radialGradient>
              </defs>
              {/* Glow halo behind */}
              <circle cx="100" cy="100" r="50" fill="url(#hubGlow)" opacity="0.6" />
              {/* Track */}
              <circle
                cx="100" cy="100" r="80"
                fill="none"
                stroke="hsl(var(--border) / 0.5)"
                strokeWidth="3"
                strokeDasharray={`${ARC_LENGTH} 1000`}
                strokeLinecap="round"
              />
              {/* Progress */}
              <circle
                cx="100" cy="100" r="80"
                fill="none"
                stroke="url(#speedGrad)"
                strokeWidth="4.5"
                strokeDasharray={`${dash} 1000`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.15s linear', filter: 'drop-shadow(0 0 10px hsl(var(--gold) / 0.7))' }}
              />
              {/* Tick marks (major + minor) */}
              {[...Array(21)].map((_, i) => {
                const angle = (i / 20) * 220 * (Math.PI / 180);
                const major = i % 2 === 0;
                const r1 = major ? 66 : 70;
                const r2 = 74;
                const x1 = 100 + Math.cos(angle) * r1;
                const y1 = 100 + Math.sin(angle) * r1;
                const x2 = 100 + Math.cos(angle) * r2;
                const y2 = 100 + Math.sin(angle) * r2;
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={major ? 'hsl(var(--gold) / 0.7)' : 'hsl(var(--gold) / 0.3)'}
                    strokeWidth={major ? 1.6 : 0.8}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Needle */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.15s linear' }}
            >
              <div className="absolute top-1/2 left-1/2 origin-left h-[2.5px] w-[74px] -translate-y-1/2 rounded-full gold-gradient" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--gold)))' }} />
            </div>

            {/* Center hub */}
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full gold-gradient gold-glow ring-4 ring-background" />
            </motion.div>

            {/* RPM + Gear digital readout */}
            <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-0.5">
              <div className="flex items-end gap-2">
                <p className="font-display text-3xl gold-text leading-none tabular-nums">
                  {Math.round(clamped).toString().padStart(3, '0')}
                </p>
                <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/70 mb-1">km/h</p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[9px] tracking-[0.25em] uppercase text-primary/70 tabular-nums">
                  {rpm.toLocaleString()} <span className="text-muted-foreground/60">rpm</span>
                </p>
                <span className="w-px h-3 bg-border/60" />
                <p className="text-[9px] tracking-[0.25em] uppercase text-primary/70">gear · <span className="text-primary font-bold">{gear}</span></p>
              </div>
            </div>
          </div>

          {/* Brand name with staggered reveal */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
              className="font-display text-5xl md:text-6xl gold-text tracking-[0.22em] relative"
              style={{ textShadow: '0 0 40px hsl(var(--gold) / 0.35)' }}
            >
              VELOCITY
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-8">
            <motion.p
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
              className="text-muted-foreground text-[11px] tracking-[0.5em] uppercase"
            >
              Luxury Supercars · Nagpur
            </motion.p>
          </div>

          {/* Rotating tagline */}
          <div className="h-5 mb-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIdx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-primary/80 text-xs tracking-[0.25em] uppercase"
              >
                {TAGLINES[taglineIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress bar with shimmer */}
          <div className="w-72 relative">
            <div className="h-[3px] bg-border/40 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full gold-gradient relative"
                style={{ width: `${clamped}%` }}
                transition={{ duration: 0.15 }}
              >
                <motion.span
                  className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-white/70"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between mt-3">
              <p className="text-muted-foreground/60 text-[10px] tracking-[0.3em] uppercase">Initializing Drive Systems</p>
              <p className="text-primary/90 text-[10px] tracking-[0.2em] tabular-nums font-bold">{Math.round(clamped)}%</p>
            </div>
          </div>

          {/* VIN-style footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-6 text-[9px] tracking-[0.4em] uppercase text-muted-foreground/40 tabular-nums"
          >
            VIN · VLCTY{Math.floor(100000 + clamped * 999).toString().slice(0, 6)} · NAGPUR · IN
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
