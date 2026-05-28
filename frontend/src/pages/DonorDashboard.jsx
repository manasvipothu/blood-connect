import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Heart, Settings, Bell, LogOut, Power, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const res = await axios.get('http://localhost:5000/api/donors/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setIsAvailable(res.data.availability);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const toggleAvailability = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/donors/availability', { availability: !isAvailable }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAvailable(!isAvailable);
    } catch (error) {
      console.error(error);
      alert('Failed to update availability');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-darkBg text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-darkBg text-white">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <GlassCard className="h-full">
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-bloodRed/20 rounded-full flex items-center justify-center mb-4 border-2 border-bloodRed">
                  <User size={40} className="text-bloodRed" />
                </div>
                <h3 className="text-xl font-bold">{profile?.full_name}</h3>
                <p className="text-gray-400">{profile?.email}</p>
                <div className="mt-2 bg-bloodRed px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(255,42,42,0.5)]">
                  {profile?.blood_group}
                </div>
              </div>
              
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left bg-white/5 border border-white/10"><User size={18} /> Profile Details</Button>
                <Button variant="ghost" className="w-full justify-start text-left hover:bg-white/5"><Heart size={18} /> Donation History</Button>
                <Button variant="ghost" className="w-full justify-start text-left hover:bg-white/5"><Bell size={18} /> Emergency Alerts</Button>
                <Button variant="ghost" className="w-full justify-start text-left hover:bg-white/5"><Settings size={18} /> Settings</Button>
                <hr className="border-white/10 my-4" />
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-left text-red-400 hover:text-red-300 hover:bg-red-400/10"><LogOut size={18} /> Logout</Button>
              </div>
            </GlassCard>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Donor Status</h2>
                    <p className="text-gray-400">Update your availability for emergency requests.</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-gray-500'}`}>
                      {isAvailable ? 'Available to Donate' : 'Currently Unavailable'}
                    </span>
                    <button 
                      onClick={toggleAvailability}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${isAvailable ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition duration-300 ${isAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-500/20 p-3 rounded-lg"><Activity size={24} className="text-blue-400" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Total Donations</h3>
                      <p className="text-3xl font-bold text-blue-400">3</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Last donation: {profile?.last_donation_date || 'N/A'}</p>
                </GlassCard>
                
                <GlassCard>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-bloodRed/20 p-3 rounded-lg"><Heart size={24} className="text-bloodRed" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Lives Impacted</h3>
                      <p className="text-3xl font-bold text-bloodRed">9</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Every donation saves up to 3 lives.</p>
                </GlassCard>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlassCard>
                <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Nearby Emergency Requests</h3>
                <div className="text-center py-8 text-gray-400">
                  <Bell size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No active emergency requests in your area right now.</p>
                  <p className="text-sm mt-2">We will notify you immediately if someone needs your blood type.</p>
                </div>
              </GlassCard>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
