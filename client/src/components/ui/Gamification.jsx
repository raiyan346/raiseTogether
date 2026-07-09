import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString() + suffix; },
    });
  }, [value, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}

export function XPProgressBar({ xp, className }) {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentLevelXP = Math.pow(level - 1, 2) * 100;
  const nextLevelXP = Math.pow(level, 2) * 100;
  const progress = Math.min(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100, 100);

  return (
    <div className={className}>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-muted">Level {level}</span>
        <span className="text-muted">{xp} XP</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gray-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function AchievementBadge({ name, icon: Icon, unlocked = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl glass ${unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}
    >
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <span className="text-xs text-center font-medium">{name}</span>
    </motion.div>
  );
}
