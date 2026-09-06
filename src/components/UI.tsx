import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAppContext } from '../App';

export const Card: React.FC<{ children: React.ReactNode; className?: string; delay?: number; id?: string; onClick?: (e: any) => void }> = ({ children, className = '', delay = 0, id, onClick }) => (
  <motion.div
    id={id}
    onClick={onClick}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}
    transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={`bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-900 dark:to-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl p-6 shadow-xl dark:shadow-2xl transition-colors duration-500 ${className}`}
  >
    {children}
  </motion.div>
);

export const Button: React.FC<{ children: React.ReactNode; onClick?: (e: any) => void; variant?: 'primary' | 'secondary' | 'outline'; className?: string; disabled?: boolean }> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group";
  const variants = {
    primary: "bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-500 dark:to-gold-400 text-white dark:text-luxury-950 shadow-[0_0_15px_rgba(166,136,104,0.4)] dark:shadow-[0_0_15px_rgba(197,156,106,0.4)]",
    secondary: "bg-gradient-to-r from-luxury-100 to-white dark:from-luxury-800 dark:to-luxury-900 text-luxury-900 dark:text-luxury-50 border border-luxury-300 dark:border-luxury-700",
    outline: "border border-gold-700 dark:border-gold-500 text-gold-700 dark:text-gold-500"
  };
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {/* Shimmer effect overlay */}
      {!disabled && variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

export const ProgressGauge: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({ progress, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div 
      className="relative flex items-center justify-center" 
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg className="transform -rotate-90 w-full h-full">
        <defs>
          <linearGradient id="goldGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B08552" />
            <stop offset="50%" stopColor="#A68868" />
            <stop offset="100%" stopColor="#7A5735" />
          </linearGradient>
          <linearGradient id="goldGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E3CEB1" />
            <stop offset="50%" stopColor="#C59C6A" />
            <stop offset="100%" stopColor="#936B40" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-luxury-200 dark:text-luxury-800 transition-colors duration-500" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} stroke="url(#goldGradientLight)" strokeWidth={strokeWidth} fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          className="dark:hidden drop-shadow-[0_0_8px_rgba(166,136,104,0.5)]"
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} stroke="url(#goldGradientDark)" strokeWidth={strokeWidth} fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          className="hidden dark:block drop-shadow-[0_0_8px_rgba(197,156,106,0.5)]"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="font-serif font-bold text-2xl bg-gradient-to-b from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-transparent bg-clip-text"
        >
          {progress}%
        </motion.span>
      </div>
    </motion.div>
  );
};

export const MaterialComparator: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useAppContext();

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-2xl bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-transparent bg-clip-text inline-block">{t('comparator.title')}</h3>
      <p className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{t('comparator.desc')}</p>
      <motion.div 
        ref={containerRef}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden cursor-ew-resize select-none border border-luxury-200 dark:border-luxury-800 transition-colors duration-500 shadow-lg"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        <img src="https://picsum.photos/id/1015/1000/600" alt="Material 1" className="absolute inset-0 w-full h-full object-cover" draggable="false" />
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <img src="https://picsum.photos/id/1016/1000/600" alt="Material 2" className="absolute inset-0 w-full h-full object-cover filter grayscale" draggable="false" />
        </div>
        <div 
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold-600 via-gold-700 to-gold-800 dark:from-gold-300 dark:via-gold-500 dark:to-gold-700 shadow-[0_0_10px_rgba(166,136,104,0.8)] dark:shadow-[0_0_10px_rgba(197,156,106,0.8)]"
          style={{ left: `calc(${sliderPos}% - 2px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-luxury-950 border-2 border-gold-700 dark:border-gold-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-4 h-1 bg-gradient-to-r from-gold-600 to-gold-700 dark:from-gold-400 dark:to-gold-600 rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
