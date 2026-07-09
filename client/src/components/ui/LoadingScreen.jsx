import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const { isDark } = useTheme();

  const logoBackgroundClass = isDark ? 'bg-white' : 'bg-black';
  const logoTextClass = isDark ? 'text-black' : 'text-white';
  const progressTrackClass = isDark ? 'bg-white/10' : 'bg-black/10';
  const progressFillClass = isDark ? 'bg-white' : 'bg-black';

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 bg-background flex flex-col items-center justify-center"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${logoBackgroundClass}`}>
        <span className={`${logoTextClass} font-bold text-xl`}>RT</span>
      </div>
      <h2 className="text-xl font-semibold mb-2">RiseTogether</h2>
      <p className="text-muted text-sm mb-8">Loading your experience...</p>
      <div className={`w-48 h-1 rounded-full overflow-hidden ${progressTrackClass}`}>
        <motion.div className={`h-full rounded-full ${progressFillClass}`} style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
}
