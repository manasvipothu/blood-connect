import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Activity, Users, MapPin, Mail, Phone, ArrowRight, Droplet } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero3D from '../components/Hero3D';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const Home = () => {
  return (
    <div className="min-h-screen bg-darkBg text-textColor overflow-hidden relative transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <Hero3D />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-darkBg/90 pointer-events-none z-1"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Every Drop Can <span className="text-bloodRed drop-shadow-[0_0_15px_rgba(255,42,42,0.8)]">Save A Life.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-textMuted mb-10 max-w-2xl mx-auto"
          >
            Connecting donors, blood banks, and lives through technology. Experience a futuristic approach to blood donation.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button variant="primary" className="w-full sm:w-auto text-lg py-4 px-8 shadow-[0_0_20px_rgba(255,42,42,0.6)]">Become a Donor</Button>
            </Link>
            <Link to="/search">
              <Button variant="secondary" className="w-full sm:w-auto text-lg py-4 px-8">Find Blood</Button>
            </Link>
            <Link to="/emergency">
              <Button variant="ghost" className="w-full sm:w-auto text-lg py-4 px-8 border border-bloodRed/30 text-bloodRed hover:bg-bloodRed hover:text-white">
                Emergency Request
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative z-10 -mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard animate delay={0.2} className="text-center bg-gradient-to-t from-darkBg to-glassWhite">
            <Users className="w-12 h-12 text-bloodRed mx-auto mb-4" />
            <h3 className="text-5xl font-bold text-textColor mb-2">10K+</h3>
            <p className="text-textMuted uppercase tracking-widest text-sm font-semibold">Active Donors</p>
          </GlassCard>
          <GlassCard animate delay={0.4} className="text-center bg-gradient-to-t from-darkBg to-glassWhite">
            <Activity className="w-12 h-12 text-bloodRed mx-auto mb-4" />
            <h3 className="text-5xl font-bold text-textColor mb-2">500+</h3>
            <p className="text-textMuted uppercase tracking-widest text-sm font-semibold">Blood Banks</p>
          </GlassCard>
          <GlassCard animate delay={0.6} className="text-center bg-gradient-to-t from-darkBg to-glassWhite border-bloodRed/30 shadow-[0_0_30px_rgba(255,42,42,0.15)]">
            <Heart className="w-12 h-12 text-bloodRed mx-auto mb-4" />
            <h3 className="text-5xl font-bold text-bloodRed mb-2 drop-shadow-[0_0_10px_rgba(255,42,42,0.5)]">50K+</h3>
            <p className="text-textMuted uppercase tracking-widest text-sm font-semibold">Lives Saved</p>
          </GlassCard>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute inset-0 bg-bloodRed/20 blur-[100px] rounded-full"></div>
              <GlassCard className="p-2 border-0 bg-gradient-to-br from-glassWhite to-transparent">
                {/* Changed image source to use the user-provided image (assuming it's saved in public folder as about-image.png) */}
                <img src="/about-image.png" alt="Blood Donation" className="rounded-xl w-full h-[400px] object-cover opacity-90 hover:opacity-100 transition-all duration-500" />
              </GlassCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-6"
            >
              <h2 className="text-sm font-bold text-bloodRed tracking-widest uppercase">About Us</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-textColor">Redefining the <br />Donation Experience.</h3>
              <p className="text-lg text-textMuted leading-relaxed">
                Blood Connect isn't just a directory—it's a real-time, AI-powered lifeline. We built this platform to bridge the gap between critical emergencies and willing donors instantly. By leveraging cutting-edge web technologies, real-time WebSockets, and location-based matching, we ensure that every drop reaches its destination before time runs out.
              </p>
              
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-textColor font-medium">
                  <div className="w-8 h-8 rounded-full bg-bloodRed/20 text-bloodRed flex items-center justify-center"><CheckIcon /></div>
                  Real-time Emergency Broadcasting
                </li>
                <li className="flex items-center gap-3 text-textColor font-medium">
                  <div className="w-8 h-8 rounded-full bg-bloodRed/20 text-bloodRed flex items-center justify-center"><CheckIcon /></div>
                  Smart Location & Blood Group Matching
                </li>
                <li className="flex items-center gap-3 text-textColor font-medium">
                  <div className="w-8 h-8 rounded-full bg-bloodRed/20 text-bloodRed flex items-center justify-center"><CheckIcon /></div>
                  Secure Blood Bank Inventory Tracking
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-darkBg pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Droplet className="text-bloodRed w-8 h-8 fill-bloodRed" />
              <span className="text-xl font-bold tracking-wider text-textColor">BLOOD<span className="text-bloodRed">CONNECT</span></span>
            </Link>
            <p className="text-textMuted max-w-sm">
              The premier platform connecting donors and blood banks to save lives instantly using futuristic web technologies.
            </p>
          </div>
          
          <div>
            <h4 className="text-textColor font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/search" className="text-textMuted hover:text-bloodRed transition">Find Blood</Link></li>
              <li><Link to="/emergency" className="text-textMuted hover:text-bloodRed transition">Emergencies</Link></li>
              <li><Link to="/drives" className="text-textMuted hover:text-bloodRed transition">Blood Drives</Link></li>
              <li><Link to="/register" className="text-textMuted hover:text-bloodRed transition">Register</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-textColor font-bold mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-textMuted">
                <MapPin className="text-bloodRed w-5 h-5" /> 123 Tech Park, NY
              </li>
              <li className="flex items-center gap-3 text-textMuted">
                <Phone className="text-bloodRed w-5 h-5" /> +1 (555) 000-0000
              </li>
              <li className="flex items-center gap-3 text-textMuted">
                <Mail className="text-bloodRed w-5 h-5" /> help@bloodconnect.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center border-t border-white/10 pt-8 text-textMuted text-sm">
          <p>&copy; {new Date().getFullYear()} Blood Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default Home;
