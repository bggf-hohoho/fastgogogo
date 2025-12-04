import React from 'react';
import { motion } from 'framer-motion';

export const GlassPanel = ({ children, className = '', delay = 0, variant = 'default', onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 120, 
        damping: 20, 
        delay: delay 
      }}
      className={`
        relative overflow-hidden backdrop-blur-xl rounded-[24px] border
        ${variant === 'default' 
            ? 'bg-white/70 border-white/40 shadow-xl dark:bg-premium-card/60 dark:border-premium-border dark:shadow-premium' 
            : 'bg-white/10 border-white/20 shadow-lg'}
        ${className}
      `}
    >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent opacity-50 pointer-events-none" />
        {children}
    </motion.div>
  );
};

export const VisionButton = ({ children, className, variant = 'primary', onClick, disabled, ...props }) => {
  const handleHover = () => {
      if (!disabled) {
          const play = (window as any).playSound;
          if (play) play('hover');
      }
  };

  const handleClick = (e) => {
    if (disabled) return;
    const play = (window as any).playSound;
    if (play) play('click');
    onClick && onClick(e);
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.96, y: 1 } : undefined}
      onHoverStart={handleHover}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-[20px] font-medium transition-all duration-300
        flex items-center justify-center gap-2
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        ${variant === 'primary' ? 'bg-premium-blue text-white shadow-glow-blue py-4 px-6' : ''}
        ${variant === 'secondary' ? 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 dark:bg-premium-surface dark:border-premium-border dark:text-premium-text-primary dark:hover:bg-white/5 py-3 px-5' : ''}
        ${variant === 'ghost' ? 'bg-transparent text-gray-500 hover:text-gray-900 dark:text-premium-text-secondary dark:hover:text-white py-2 px-4' : ''}
        ${variant === 'icon' ? 'p-3 text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-premium-text-secondary dark:hover:text-white dark:hover:bg-white/5 rounded-full' : ''}
        ${className || ''}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export const FloatingText = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export const TiltCard = ({ children, className }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`transform-style-3d ${className}`}
        >
            {children}
        </motion.div>
    )
};

(window as any).GlassPanel = GlassPanel;
(window as any).VisionButton = VisionButton;
(window as any).FloatingText = FloatingText;
(window as any).TiltCard = TiltCard;