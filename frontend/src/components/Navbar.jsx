import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Droplet, Moon, Sun } from 'lucide-react';
import Button from './Button';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Donors', path: '/search' },
    { name: 'Blood Banks', path: '/banks' },
    { name: 'Blood Drives', path: '/drives' },
    { name: 'Emergency', path: '/emergency' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-darkBg/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Droplet className="text-bloodRed w-8 h-8 fill-bloodRed" />
            </motion.div>
            <span className="text-xl font-bold tracking-wider text-textColor">BLOOD<span className="text-bloodRed">CONNECT</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-bloodRed ${location.pathname === link.path ? 'text-bloodRed' : 'text-textMuted'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="text-textMuted hover:text-bloodRed transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Become a Donor</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="text-textColor hover:text-bloodRed transition">
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-textColor hover:text-bloodRed transition">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-darkBg border-b border-gray-200 dark:border-white/10 shadow-lg"
        >
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-textMuted hover:text-bloodRed block py-2 text-base font-medium"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-gray-200 dark:border-white/10 my-2" />
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button variant="secondary" className="w-full justify-center">Login</Button>
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full justify-center">Become a Donor</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
