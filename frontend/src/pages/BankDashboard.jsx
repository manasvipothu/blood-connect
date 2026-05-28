import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Droplet, Plus, Minus, LogOut, CalendarPlus, ListChecks } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Select from '../components/Select';

const BankDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stock, setStock] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, createdrives, mydrives
  const [drives, setDrives] = useState([]);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [selectedDriveAttendees, setSelectedDriveAttendees] = useState(null);
  
  const [newDrive, setNewDrive] = useState({
    title: '', description: '', date: '', location: '', city: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleViewAttendees = async (driveId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://blood-connect-w1ox.onrender.com/api/drives/${driveId}/attendees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedDriveAttendees({ driveId, attendees: res.data });
      setIsAttendeesModalOpen(true);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch attendees');
    }
  };

  const handleVerifyAttendee = async (driveId, regId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://blood-connect-w1ox.onrender.com/api/drives/${driveId}/attendees/${regId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Attendee verified!');
      handleViewAttendees(driveId);
    } catch (error) {
      console.error(error);
      alert('Failed to verify attendee');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('https://blood-connect-w1ox.onrender.com/api/banks/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setStock(res.data.blood_stock || {});
        
        // Also fetch their drives
        const drivesRes = await axios.get('https://blood-connect-w1ox.onrender.com/api/drives/my-drives', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDrives(drivesRes.data);
      } catch (error) {
        console.error(error);
        if(error.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const updateStock = async (group, change) => {
    const newQuantity = Math.max(0, (stock[group] || 0) + change);
    const newStock = { ...stock, [group]: newQuantity };
    setStock(newStock);
    
    const token = localStorage.getItem('token');

    try {
      await axios.put('https://blood-connect-w1ox.onrender.com/api/banks/stock', { blood_stock: newStock }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to update stock', error);
      alert('Failed to update stock');
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await axios.post('https://blood-connect-w1ox.onrender.com/api/drives', newDrive, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrives([res.data.drive, ...drives]);
      setActiveTab('mydrives');
      setNewDrive({ title: '', description: '', date: '', location: '', city: '' });
      alert('Blood drive scheduled successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create drive');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-darkBg text-textColor flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-darkBg text-textColor">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-1/4">
            <GlassCard className="h-full">
              <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/50">
                  <Building2 size={36} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">{profile?.blood_bank_name}</h3>
                <p className="text-textMuted text-sm">License: {profile?.license_number}</p>
                <p className="text-textMuted text-sm">{profile?.email}</p>
              </div>
              
              <div className="space-y-2 mb-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab('inventory')} 
                  className={`w-full justify-start ${activeTab === 'inventory' ? 'bg-white/10' : ''}`}
                >
                  <Droplet size={18} /> Inventory
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab('createdrives')} 
                  className={`w-full justify-start ${activeTab === 'createdrives' ? 'bg-white/10' : ''}`}
                >
                  <CalendarPlus size={18} /> Schedule Drive
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab('mydrives')} 
                  className={`w-full justify-start ${activeTab === 'mydrives' ? 'bg-white/10' : ''}`}
                >
                  <ListChecks size={18} /> Managed Drives
                </Button>
              </div>

              <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10">
                <LogOut size={18} /> Logout
              </Button>
            </GlassCard>
          </div>

          <div className="w-full md:w-3/4">
            <AnimatePresence mode="wait">
              {activeTab === 'inventory' && (
                <motion.div key="inv" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <GlassCard>
                    <div className="flex justify-between items-center mb-6 border-b border-glassWhite pb-4">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Droplet className="text-bloodRed" /> Blood Inventory Management
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {bloodGroups.map((bg) => (
                        <div key={bg} className="bg-darkBg/50 border border-glassWhite rounded-xl p-4 flex flex-col items-center shadow-lg">
                          <div className="text-2xl font-bold text-bloodRed mb-1">{bg}</div>
                          <div className="text-textMuted text-xs uppercase tracking-wider mb-4">Units Available</div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateStock(bg, -1)}
                              className="w-8 h-8 rounded-full bg-glassWhite border border-glassWhite flex items-center justify-center hover:bg-white/20 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-2xl font-bold w-8 text-center">{stock[bg] || 0}</span>
                            <button 
                              onClick={() => updateStock(bg, 1)}
                              className="w-8 h-8 rounded-full bg-bloodRed/20 border border-bloodRed/50 flex items-center justify-center text-bloodRed hover:bg-bloodRed hover:text-white transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === 'createdrives' && (
                <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <GlassCard>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <CalendarPlus className="text-bloodRed" /> Schedule a Blood Drive
                    </h2>
                    <form onSubmit={handleCreateDrive} className="space-y-4">
                      <div>
                        <label className="block text-sm text-textMuted mb-1">Drive Title</label>
                        <input required className="input-glass w-full rounded-lg p-3" value={newDrive.title} onChange={e => setNewDrive({...newDrive, title: e.target.value})} placeholder="e.g. Summer Blood Drive 2026" />
                      </div>
                      <div>
                        <label className="block text-sm text-textMuted mb-1">Description</label>
                        <textarea required className="input-glass w-full rounded-lg p-3" rows="3" value={newDrive.description} onChange={e => setNewDrive({...newDrive, description: e.target.value})} placeholder="Details about the event..." />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-textMuted mb-1">Date and Time</label>
                          <input required type="datetime-local" className="input-glass w-full rounded-lg p-3" value={newDrive.date} onChange={e => setNewDrive({...newDrive, date: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm text-textMuted mb-1">City</label>
                          <input required className="input-glass w-full rounded-lg p-3" value={newDrive.city} onChange={e => setNewDrive({...newDrive, city: e.target.value})} placeholder="City" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-textMuted mb-1">Precise Location / Venue</label>
                        <input required className="input-glass w-full rounded-lg p-3" value={newDrive.location} onChange={e => setNewDrive({...newDrive, location: e.target.value})} placeholder="Venue name or address" />
                      </div>
                      <Button type="submit" variant="primary" className="mt-4 py-3 px-6">Publish Drive</Button>
                    </form>
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === 'mydrives' && (
                <motion.div key="mydrives" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <GlassCard>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <ListChecks className="text-bloodRed" /> Managed Drives
                    </h2>
                    
                    {drives.length === 0 ? (
                      <div className="text-center py-10 text-textMuted">You haven't scheduled any blood drives yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {drives.map(drive => (
                          <div key={drive.id} className="bg-glassWhite p-4 rounded-xl border border-glassWhite flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-textColor">{drive.title}</h3>
                              <p className="text-textMuted text-sm mt-1">{new Date(drive.date).toLocaleString()} • {drive.city}</p>
                            </div>
                            <Button variant="ghost" className="border border-white/20" onClick={() => handleViewAttendees(drive.id)}>
                              View Attendees
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>

      {/* Attendees Modal */}
      {isAttendeesModalOpen && selectedDriveAttendees && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkBg border border-glassWhite p-6 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-textColor">Drive Attendees</h2>
              <button onClick={() => setIsAttendeesModalOpen(false)} className="text-textMuted hover:text-white">✕</button>
            </div>
            
            {selectedDriveAttendees.attendees.length === 0 ? (
              <div className="text-center py-8 text-textMuted">No donors have registered for this drive yet.</div>
            ) : (
              <div className="space-y-4">
                {selectedDriveAttendees.attendees.map(attendee => (
                  <div key={attendee.id} className="bg-glassWhite p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-textColor">{attendee.Donor?.full_name} <span className="text-bloodRed bg-bloodRed/10 px-2 py-0.5 rounded text-sm ml-2">{attendee.Donor?.blood_group}</span></h3>
                      <p className="text-textMuted text-sm mt-1">{attendee.Donor?.phone} • {attendee.Donor?.city}</p>
                      <div className="mt-2 text-sm">
                        Status: <span className={attendee.status === 'Attended' ? 'text-green-400 font-bold' : 'text-yellow-400'}>{attendee.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 min-w-[200px]">
                      {attendee.certificate_url ? (
                        <>
                          <a href={attendee.certificate_url} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline">View Certificate</a>
                          {attendee.certificate_status === 'Pending' && (
                            <Button variant="primary" className="py-1 px-3 text-sm" onClick={() => handleVerifyAttendee(selectedDriveAttendees.driveId, attendee.id)}>
                              Verify Attendance
                            </Button>
                          )}
                          {attendee.certificate_status === 'Verified' && (
                            <span className="text-green-400 text-sm font-bold flex items-center gap-1">✓ Verified</span>
                          )}
                        </>
                      ) : (
                        <span className="text-textMuted text-sm italic">No certificate uploaded</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BankDashboard;
