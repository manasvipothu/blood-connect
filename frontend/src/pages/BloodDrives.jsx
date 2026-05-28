import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar, MapPin, Building, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const BloodDrives = () => {
  const [drives, setDrives] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState(null);

  const fetchDrivesAndRegistrations = async () => {
    try {
      const drivesRes = await axios.get('https://blood-connect-w1ox.onrender.com/api/drives');
      setDrives(drivesRes.data);

      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      if (token && role === 'donor') {
        const regRes = await axios.get('https://blood-connect-w1ox.onrender.com/api/drives/my-registrations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(regRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivesAndRegistrations();
  }, []);

  const handleRegister = async (driveId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login as a donor to register for a drive.");
        return;
      }
      await axios.post(`https://blood-connect-w1ox.onrender.com/api/drives/${driveId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Successfully registered for the blood drive!');
      fetchDrivesAndRegistrations();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to register');
    }
  };

  const handleUnregister = async (driveId) => {
    if (!window.confirm("Are you sure you want to unregister from this drive?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://blood-connect-w1ox.onrender.com/api/drives/${driveId}/register`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Successfully unregistered from the blood drive.');
      fetchDrivesAndRegistrations();
    } catch (error) {
      console.error(error);
      alert('Failed to unregister');
    }
  };

  const handleUploadCertificate = async (driveId, file) => {
    if (!file) return;
    
    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result;
      try {
        const token = localStorage.getItem('token');
        await axios.post(`https://blood-connect-w1ox.onrender.com/api/drives/${driveId}/certificate`, 
          { certificate_url: base64String }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Certificate uploaded successfully!');
        setUploadingFor(null);
        fetchDrivesAndRegistrations();
      } catch (error) {
        console.error(error);
        alert('Failed to upload certificate');
      }
    };
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
            {drives.map((drive, index) => {
              const registration = registrations.find(r => r.drive_id === drive.id);
              const isRegistered = !!registration;
              
              return (
              <motion.div
                key={drive.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className={`h-full flex flex-col justify-between transition-colors ${isRegistered ? 'border-bloodRed shadow-[0_0_15px_rgba(255,42,42,0.15)]' : 'hover:border-bloodRed/50'}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold">{drive.title}</h3>
                      {isRegistered && (
                        <span className="bg-bloodRed/20 text-bloodRed text-xs px-2 py-1 rounded font-bold border border-bloodRed/30">
                          {registration.status === 'Attended' ? 'Attended' : 'Registered'}
                        </span>
                      )}
                    </div>
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
                  
                  <div className="space-y-3">
                    {!isRegistered ? (
                      <Button 
                        variant="primary" 
                        className="w-full py-3 flex items-center justify-center gap-2"
                        onClick={() => handleRegister(drive.id)}
                      >
                        <Users size={18} /> Register Now
                      </Button>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            className="w-1/2 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20"
                            onClick={() => handleUnregister(drive.id)}
                          >
                            Unregister
                          </Button>
                          
                          <Button 
                            variant="secondary" 
                            className="w-1/2 py-2 bg-white/5"
                            onClick={() => setUploadingFor(uploadingFor === drive.id ? null : drive.id)}
                          >
                            Certificate
                          </Button>
                        </div>
                        
                        {uploadingFor === drive.id && (
                          <div className="mt-3 p-3 bg-darkBg border border-white/10 rounded-lg">
                            <p className="text-xs text-textMuted mb-2">Upload proof of donation (Image/PDF)</p>
                            <input 
                              type="file" 
                              accept="image/*,.pdf"
                              className="text-xs w-full text-textColor file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-bloodRed file:text-white hover:file:bg-red-700"
                              onChange={(e) => handleUploadCertificate(drive.id, e.target.files[0])}
                            />
                          </div>
                        )}
                        
                        {registration.certificate_status !== 'None' && (
                          <div className={`text-xs text-center mt-2 p-1 rounded ${
                            registration.certificate_status === 'Verified' ? 'text-green-400 bg-green-400/10' : 
                            registration.certificate_status === 'Rejected' ? 'text-red-400 bg-red-400/10' : 
                            'text-yellow-400 bg-yellow-400/10'
                          }`}>
                            Certificate Status: {registration.certificate_status}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )})}
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
