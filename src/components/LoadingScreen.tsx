import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TAGLINES = [
  'Igniting twelve cylinders',
  'Calibrating telemetry',
  'Polishing carbon fiber',
  'Unleashing horsepower',
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
          setTimeout(() => setLoading(false), 600);
          return 100;
        }
        return prev + Math.random() * 12 + 4;
      });
    }, 140);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTaglineIdx(i => (i + 1) % TAGLINES.length), 1100);
    return () => clearInterval(t);
  }, []);

  const clamped = Math.min(progress, 100);
  // Speedometer arc: 220° sweep, starting at -200deg
  const ARC_LENGTH = 360; // path length approximation
  const dash = (clamped / 100) * ARC_LENGTH;
  const needleAngle = -110 + (clamped / 100) * 220;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.08),transparent_60%)]" />

          {/* Animated grid floor */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              maskImage: 'linear-gradient(to top, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
            }}
          />

          {/* Drifting light streaks */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-40 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              style={{ top: `${15 + i * 12}%` }}
              initial={{ x: '-20vw' }}
              animate={{ x: '120vw' }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'linear',
              }}
            />
          ))}

          {/* Particle field */}
          <div className="absolute inset-0">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/30"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.2, 0.7, 0.2],
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
          <div className="relative mb-10 w-56 h-56">
            {/* Outer ring rotation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="95" fill="none" stroke="hsl(var(--border) / 0.4)" strokeWidth="0.5" strokeDasharray="2 6" />
              </svg>
            </motion.div>

            {/* Speedometer arc */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-[110deg]">
              <defs>
                <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--gold-light))" />
                  <stop offset="60%" stopColor="hsl(var(--gold))" />
                  <stop offset="100%" stopColor="hsl(var(--luxury-red, var(--gold-dark)))" />
                </linearGradient>
              </defs>
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
                strokeWidth="4"
                strokeDasharray={`${dash} 1000`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.15s linear', filter: 'drop-shadow(0 0 8px hsl(var(--gold) / 0.6))' }}
              />
              {/* Tick marks */}
              {[...Array(11)].map((_, i) => {
                const angle = (i / 10) * 220 * (Math.PI / 180);
                const x1 = 100 + Math.cos(angle) * 68;
                const y1 = 100 + Math.sin(angle) * 68;
                const x2 = 100 + Math.cos(angle) * 74;
                const y2 = 100 + Math.sin(angle) * 74;
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="hsl(var(--gold) / 0.5)"
                    strokeWidth="1.5"
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
              <div className="absolute top-1/2 left-1/2 origin-left h-[2px] w-[70px] -translate-y-1/2 rounded-full gold-gradient" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--gold)))' }} />
            </div>

            {/* Center hub */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full gold-gradient gold-glow ring-4 ring-background" />
            </motion.div>

            {/* Digital readout */}
            <div className="absolute inset-x-0 bottom-8 flex flex-col items-center">
              <p className="font-display text-3xl gold-text leading-none tabular-nums">
                {Math.round(clamped).toString().padStart(3, '0')}
              </p>
              <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/70 mt-1">km/h</p>
            </div>
          </div>

          {/* Brand name with staggered reveal */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
              className="font-display text-5xl md:text-6xl gold-text tracking-[0.2em]"
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
                className="text-primary/70 text-xs tracking-[0.25em] uppercase"
              >
                {TAGLINES[taglineIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="w-64 relative">
            <div className="h-[2px] bg-border/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full gold-gradient"
                style={{ width: `${clamped}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <div className="flex justify-between mt-3">
              <p className="text-muted-foreground/60 text-[10px] tracking-[0.3em] uppercase">Loading</p>
              <p className="text-primary/80 text-[10px] tracking-[0.2em] tabular-nums">{Math.round(clamped)}%</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
