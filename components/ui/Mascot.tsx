'use client';

import { motion } from 'framer-motion';

interface MascotProps {
  emotion?: 'happy' | 'excited' | 'thinking' | 'encouraging' | 'celebrating';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Mascot({
  emotion = 'happy',
  message,
  size = 'md',
}: MascotProps) {
  const sizeStyles = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
  };

  const emotionEmojis = {
    happy: '📚',
    excited: '🎉',
    thinking: '🤔',
    encouraging: '💪',
    celebrating: '🎊',
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={sizeStyles[size]}
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {emotionEmojis[emotion]}
      </motion.div>
      {message && (
        <div className="bg-white rounded-[1rem] px-6 py-3 shadow-[0_4px_15px_rgba(224,176,255,0.3)] max-w-sm text-center relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
          <p className="text-text-primary font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}
