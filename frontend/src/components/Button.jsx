import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  const baseStyles = 'px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-bloodRed hover:bg-red-700 text-white shadow-[0_0_15px_rgba(255,42,42,0.5)] hover:shadow-[0_0_25px_rgba(255,42,42,0.8)]',
    secondary: 'bg-transparent border border-textColor/30 text-textColor hover:bg-textColor/10 hover:border-textColor/50 backdrop-blur-sm',
    ghost: 'bg-transparent text-textMuted hover:text-textColor hover:bg-textColor/5',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
