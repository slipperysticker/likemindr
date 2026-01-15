'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'outlined';
  hoverable?: boolean;
  children: ReactNode;
}

export function Card({
  variant = 'default',
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyles =
    'rounded-[1.5rem] p-6 transition-all duration-200';

  const variantStyles = {
    default:
      'bg-white shadow-[0_4px_15px_rgba(224,176,255,0.3)]',
    gradient:
      'bg-gradient-to-br from-kawaii-lavender/30 via-white to-kawaii-pink/20 shadow-[0_4px_15px_rgba(224,176,255,0.3)]',
    outlined:
      'bg-white border-2 border-kawaii-lavender',
  };

  const hoverStyles = hoverable
    ? 'hover:shadow-[0_6px_20px_rgba(224,176,255,0.4)] hover:scale-[1.02] cursor-pointer'
    : '';

  if (hoverable) {
    return (
      <motion.div
        className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={props.onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
