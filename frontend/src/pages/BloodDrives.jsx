import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar, MapPin, Building, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const BloodDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/drives');
        setDrives(res.data);
      } catch (error) {
        console.error('Failed to fetch drives', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  const handleRegister = async (driveId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login as a donor to register for a drive.");
        return;
      }
      await axios.post(`http://localhost:5000/api/drives/${driveId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Successfully registered for the blood drive!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-textColor transition-colors duration-300">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blood <span className="text-bloodRed">Drives</span></h1>
          <p className="text-textMuted max-w-2xl mx-auto">Discover and register for blood donation drives organized by hospitals and NGOs in your city.</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-10 text-bloodRed font-bold text-xl">Loading drives...</div>
        ) : drives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drives.map((drive, index) => (
              <motion.div
                key={drive.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col justify-between hover:border-bloodRed/50 transition-colors">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{drive.title}</h3>
                    <p className="text-textMuted mb-4 line-clamp-3">{drive.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-textColor">
                        <Building size={16} className="text-bloodRed" /> 
                        <span className="font-semibold">{drive.BloodBank?.blood_bank_name || 'Organization'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-textColor">
                        <Calendar size={16} className="text-bloodRed" /> 
                        {new Date(drive.date).toLocaleDateString()} at {new Date(drive.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-textColor">
                        <MapPin size={16} className="text-bloodRed" /> 
                        {drive.location}, {drive.city}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-full py-3 flex items-center justify-center gap-2"
                    onClick={() => handleRegister(drive.id)}
                  >
                    <Users size={18} /> Register Now
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-glassWhite rounded-2xl border border-white/10 backdrop-blur-lg">
            <Calendar size={48} className="mx-auto text-textMuted mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">No upcoming drives</h3>
            <p className="text-textMuted">Check back later for new blood donation events.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodDrives;
