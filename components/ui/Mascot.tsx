'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MascotProps {
  emotion?: 'happy' | 'excited' | 'thinking' | 'encouraging' | 'celebrating';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const rotatingQuotes = [
  'Imagine connecting with millions of people...',
  'What if you could never stop learning...',
  'Who else is reading what I am?',
];

export function Mascot({
  emotion = 'happy',
  message,
  size = 'md',
}: MascotProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const displayMessage = message || rotatingQuotes[currentQuoteIndex];

  useEffect(() => {
    if (!message) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % rotatingQuotes.length);
      }, 4000); // Change quote every 4 seconds

      return () => clearInterval(interval);
    }
  }, [message]);
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
      {displayMessage && (
        <div className="quote-bubble bg-white dark:bg-background-secondary rounded-[1rem] px-6 py-3 shadow-[0_4px_15px_rgba(224,176,255,0.3)] dark:shadow-[0_4px_15px_rgba(139,124,255,0.4)] max-w-sm text-center relative min-h-[60px] flex items-center justify-center">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white dark:border-b-background-secondary"></div>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-medium text-sm"
            >
              {displayMessage}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
