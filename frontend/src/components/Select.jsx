import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Select = ({ options, value, onChange, placeholder, name, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value === value : opt === value
  );

  const displayValue = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) 
    : placeholder;

  const handleSelect = (val) => {
    // Mimic the native event object for compatibility with standard onChange handlers
    const fakeEvent = {
      target: {
        name,
        value: typeof val === 'object' ? val.value : val
      }
    };
    onChange(fakeEvent);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        className="input-glass w-full rounded-lg p-3 flex justify-between items-center cursor-pointer border border-textColor/10 bg-transparent text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!value ? "text-textMuted" : "text-textColor"}>{displayValue}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={18} className="text-textMuted" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[100] w-full mt-2 bg-darkBg border border-glassWhite rounded-lg shadow-2xl overflow-hidden backdrop-blur-3xl"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((opt, idx) => {
                const optValue = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                return (
                  <div 
                    key={idx}
                    className={`px-4 py-3 hover:bg-bloodRed hover:text-white cursor-pointer transition-colors text-sm ${value === optValue ? 'bg-bloodRed/10 text-bloodRed font-bold' : 'text-textColor'}`}
                    onClick={() => handleSelect(opt)}
                  >
                    {optLabel}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
