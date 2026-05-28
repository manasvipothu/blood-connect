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
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'profile'
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const res = await axios.get('https://blood-connect-w1ox.onrender.com/api/donors/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setEditForm(res.data);
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
      await axios.put('https://blood-connect-w1ox.onrender.com/api/donors/availability', { availability: !isAvailable }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAvailable(!isAvailable);
    } catch (error) {
      console.error(error);
      alert('Failed to update availability');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('https://blood-connect-w1ox.onrender.com/api/donors/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(editForm);
      alert('Profile updated successfully!');
      setActiveTab('dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-darkBg text-textColor flex items-center justify-center">Loading...</div>;
  }

  const inputClass = "w-full bg-darkBg border border-glassWhite rounded-lg p-3 text-textColor focus:outline-none focus:border-bloodRed transition-colors";

  return (
    <div className="min-h-screen bg-darkBg text-textColor transition-colors duration-300">
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
                <p className="text-textMuted">{profile?.email}</p>
                <div className="mt-2 bg-bloodRed text-white px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(255,42,42,0.5)]">
                  {profile?.blood_group}
                </div>
              </div>
              
              <div className="space-y-2">
                <Button variant={activeTab === 'dashboard' ? 'primary' : 'ghost'} onClick={() => setActiveTab('dashboard')} className="w-full justify-start text-left border border-textColor/10"><Activity size={18} /> Dashboard</Button>
                <Button variant={activeTab === 'profile' ? 'primary' : 'ghost'} onClick={() => setActiveTab('profile')} className="w-full justify-start text-left border border-textColor/10"><User size={18} /> Profile Details</Button>
                <Button variant={activeTab === 'history' ? 'primary' : 'ghost'} onClick={() => setActiveTab('history')} className="w-full justify-start text-left border border-textColor/10"><Heart size={18} /> Donation History</Button>
                <Button variant={activeTab === 'alerts' ? 'primary' : 'ghost'} onClick={() => setActiveTab('alerts')} className="w-full justify-start text-left border border-textColor/10"><Bell size={18} /> Emergency Alerts</Button>
                <hr className="border-textColor/10 my-4" />
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-left text-red-500 hover:text-red-400 hover:bg-red-500/10"><LogOut size={18} /> Logout</Button>
              </div>
            </GlassCard>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4 space-y-8">
            {activeTab === 'dashboard' ? (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <GlassCard>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">Donor Status</h2>
                        <p className="text-textMuted">Update your availability for emergency requests.</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`font-semibold ${isAvailable ? 'text-green-500' : 'text-textMuted'}`}>
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
                      <p className="text-sm text-textMuted">Last donation: {profile?.last_donation_date || 'N/A'}</p>
                    </GlassCard>
                    
                    <GlassCard>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-bloodRed/20 p-3 rounded-lg"><Heart size={24} className="text-bloodRed" /></div>
                        <div>
                          <h3 className="text-lg font-bold">Lives Impacted</h3>
                          <p className="text-3xl font-bold text-bloodRed">9</p>
                        </div>
                      </div>
                      <p className="text-sm text-textMuted">Every donation saves up to 3 lives.</p>
                    </GlassCard>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <GlassCard>
                    <h3 className="text-xl font-bold mb-4 border-b border-textColor/10 pb-2">Nearby Emergency Requests</h3>
                    <div className="text-center py-8 text-textMuted">
                      <Bell size={40} className="mx-auto mb-3 opacity-50" />
                      <p>No active emergency requests in your area right now.</p>
                      <p className="text-sm mt-2">We will notify you immediately if someone needs your blood type.</p>
                    </div>
                  </GlassCard>
                </motion.div>
              </>
            ) : activeTab === 'profile' ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <GlassCard>
                  <h2 className="text-2xl font-bold mb-6 border-b border-textColor/10 pb-4">Edit Profile Details</h2>
                  <form onSubmit={updateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-textMuted mb-1">Full Name</label>
                        <input className={inputClass} value={editForm.full_name || ''} onChange={e => setEditForm({...editForm, full_name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-textMuted mb-1">Email</label>
                        <input className={inputClass} disabled value={editForm.email || ''} />
                      </div>
                      <div>
                        <label className="block text-sm text-textMuted mb-1">Age</label>
                        <input type="number" className={inputClass} value={editForm.age || ''} onChange={e => setEditForm({...editForm, age: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-textMuted mb-1">Weight (kg)</label>
                        <input type="number" className={inputClass} value={editForm.weight || ''} onChange={e => setEditForm({...editForm, weight: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-textMuted mb-1">Phone Number</label>
                        <input className={inputClass} value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-textMuted mb-1">Blood Group</label>
                        <input className={inputClass} value={editForm.blood_group || ''} onChange={e => setEditForm({...editForm, blood_group: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-textMuted mb-1">City</label>
                        <input className={inputClass} value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-textMuted mb-1">State</label>
                        <input className={inputClass} value={editForm.state || ''} onChange={e => setEditForm({...editForm, state: e.target.value})} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-textMuted mb-1">Address</label>
                        <textarea className={inputClass} rows="2" value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})}></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-textMuted mb-1">Last Donation Date</label>
                        <input type="date" className={inputClass} value={editForm.last_donation_date || ''} onChange={e => setEditForm({...editForm, last_donation_date: e.target.value})} />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <Button type="submit" variant="primary">Save Changes</Button>
                      <Button type="button" variant="ghost" onClick={() => setActiveTab('dashboard')} className="border border-textColor/10">Cancel</Button>
                    </div>
                  </form>
                </GlassCard>
              </motion.div>
            ) : activeTab === 'history' ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <GlassCard>
                  <h2 className="text-2xl font-bold mb-6 border-b border-textColor/10 pb-4">Donation History</h2>
                  <div className="text-center py-12 text-textMuted">
                    <Heart size={48} className="mx-auto mb-4 opacity-50 text-bloodRed" />
                    <h3 className="text-lg font-bold text-textColor mb-2">You have made 3 donations!</h3>
                    <p>Your last donation was on {profile?.last_donation_date || 'an unknown date'}.</p>
                    <p className="mt-4 text-sm">Thank you for being a lifesaver. More detailed history tracking is coming soon.</p>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <GlassCard>
                  <h2 className="text-2xl font-bold mb-6 border-b border-textColor/10 pb-4">Emergency Alerts</h2>
                  <div className="text-center py-12 text-textMuted">
                    <Bell size={48} className="mx-auto mb-4 opacity-50 text-yellow-500" />
                    <h3 className="text-lg font-bold text-textColor mb-2">No Active Alerts</h3>
                    <p>There are no emergency requests matching your blood type ({profile?.blood_group}) in your area right now.</p>
                    <p className="mt-4 text-sm">Make sure your availability status is set to "Available" so we can notify you if someone is in need.</p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
