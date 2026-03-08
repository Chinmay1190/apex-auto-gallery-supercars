import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(() => setLoading(false), 500); return 100; }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Outer rotating ring */}
          <div className="relative mb-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32"
            >
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--gold-light))" />
                    <stop offset="50%" stopColor="hsl(var(--gold))" />
                    <stop offset="100%" stopColor="hsl(var(--gold-dark))" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="55" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                <circle cx="60" cy="60" r="55" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5"
                  strokeDasharray="80 260" strokeLinecap="round" />
              </svg>
            </motion.div>

            {/* Inner counter-rotating ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-3"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--gold) / 0.15)" strokeWidth="1" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--gold))" strokeWidth="1.5"
                  strokeDasharray="40 220" strokeLinecap="round" opacity="0.6" />
              </svg>
            </motion.div>

            {/* Center pulsing dot */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-4 h-4 rounded-full gold-gradient gold-glow" />
            </motion.div>
          </div>

          {/* Brand name with staggered reveal */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
              className="font-display text-4xl md:text-5xl gold-text tracking-[0.2em]"
            >
              VELOCITY
            </motion.h1>
          </div>
          
          <div className="overflow-hidden mb-10">
            <motion.p
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
              className="text-muted-foreground text-xs tracking-[0.4em] uppercase"
            >
              Luxury Supercars
            </motion.p>
          </div>

          {/* Progress bar */}
          <div className="w-56 relative">
            <div className="h-[2px] bg-border/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full gold-gradient"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <div className="flex justify-between mt-3">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground/60 text-[10px] tracking-[0.2em] uppercase"
              >
                Loading
              </motion.p>
              <p className="text-primary/80 text-xs font-display">{Math.min(Math.round(progress), 100)}%</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
