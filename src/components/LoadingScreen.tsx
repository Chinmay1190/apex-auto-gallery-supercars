import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(() => setLoading(false), 300); return 100; }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          {/* Spinning wheel */}
          <div className="relative mb-8">
            <svg className="w-24 h-24 animate-spin-wheel" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--gold) / 0.2)" strokeWidth="2" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(var(--gold) / 0.3)" strokeWidth="1" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1="50" y1="50"
                  x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                  y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                  stroke="hsl(var(--gold))"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              ))}
              <circle cx="50" cy="50" r="8" fill="hsl(var(--gold))" opacity="0.8" />
              <circle cx="50" cy="50" r="4" fill="hsl(var(--background))" />
            </svg>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl gold-text mb-2 tracking-wider"
          >
            VELOCITY
          </motion.h1>
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-8">
            Luxury Supercars
          </p>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full gold-gradient"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-muted-foreground text-xs mt-3">{Math.min(Math.round(progress), 100)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
