import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', animate = false, delay = 0 }) => {
  const baseCard = (
    <div className={`glass-card p-6 relative overflow-hidden ${className}`}>
      {/* Neon glow effect in the corner */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-bloodRed/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
      >
        {baseCard}
      </motion.div>
    );
  }

  return baseCard;
};

export default GlassCard;
