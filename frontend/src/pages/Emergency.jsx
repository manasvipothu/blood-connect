import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AlertCircle, Clock, MapPin, Activity, CheckCircle, XCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Select from '../components/Select';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Emergency = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    requester_name: '', hospital_name: '', blood_group: 'O-', 
    units_required: 1, urgency_level: 'Critical', contact_number: '', city: ''
  });
  const [socket, setSocket] = useState(null);

  // Hardcoded coordinates  // Dummy locations for demonstration (in India - Mumbai area)
  const mapCenter = [19.0760, 72.8777];
  
  const dummyBloodBanks = [
    { id: 1, name: "City General Hospital", position: [19.0800, 72.8800] },
    { id: 2, name: "Metro Blood Center", position: [19.0720, 72.8750] },
    { id: 3, name: "Hope Medical Clinic", position: [19.0780, 72.8700] }
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/emergencies');
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('new_emergency', (data) => {
      setRequests(prev => [data, ...prev]);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/emergencies', formData);
      if (socket) {
        socket.emit('emergency_request', res.data.request);
      }
      setRequests([res.data.request, ...requests]);
      setShowForm(false);
      alert('Emergency request posted! Notifying nearby donors with matching blood types.');
    } catch (error) {
      console.error(error);
      alert('Failed to post request');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/emergencies/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
    } catch (error) {
      console.error(error);
      alert('Failed to update status. Are you logged in?');
    }
  };

  const inputClass = "w-full bg-darkBg border border-glassWhite rounded-lg p-3 text-textColor focus:outline-none focus:border-bloodRed transition-colors";

  return (
    <div className="min-h-screen bg-darkBg text-textColor relative transition-colors duration-300 pb-20">
      <Navbar />
      
      {/* Background Pulse Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-20">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-96 h-96 bg-bloodRed rounded-full blur-[150px]"
        />
      </div>

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
              <AlertCircle className="text-bloodRed" size={40} />
              Emergency <span className="text-bloodRed">Board</span>
            </h1>
            <p className="text-textMuted mt-2">Real-time critical blood requests</p>
          </div>
          
          <Button 
            variant="primary" 
            className="mt-6 md:mt-0"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel Request' : 'Post Emergency Request'}
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="mb-10 overflow-hidden"
            >
              <GlassCard className="border-bloodRed/50 bg-bloodRed/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required placeholder="Your Name" className={inputClass} onChange={(e) => setFormData({...formData, requester_name: e.target.value})} />
                    <input required placeholder="Hospital Name" className={inputClass} onChange={(e) => setFormData({...formData, hospital_name: e.target.value})} />
                    
                    <div className="flex gap-4">
                      <div className="w-full">
                        <Select 
                          name="blood_group"
                          options={['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']} 
                          value={formData.blood_group} 
                          onChange={(e) => setFormData({...formData, blood_group: e.target.value})} 
                        />
                      </div>
                      <input required type="number" min="1" placeholder="Units" className={inputClass} onChange={(e) => setFormData({...formData, units_required: e.target.value})} />
                    </div>
                    
                    <div>
                      <Select 
                        name="urgency_level"
                        options={['Critical', 'High', 'Medium']} 
                        value={formData.urgency_level} 
                        onChange={(e) => setFormData({...formData, urgency_level: e.target.value})} 
                      />
                    </div>
                    
                    <input required placeholder="City" className={inputClass} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                    <input required placeholder="Contact Number" className={inputClass} onChange={(e) => setFormData({...formData, contact_number: e.target.value})} />
                    
                    <div className="col-span-1 md:col-span-2 mt-4">
                      <Button type="submit" variant="primary" className="w-full text-lg py-4 shadow-[0_0_15px_rgba(255,42,42,0.6)] hover:shadow-[0_0_25px_rgba(255,42,42,1)]">
                        Broadcast Request Now
                      </Button>
                    </div>
                  </form>

                  {/* Leaflet Map for Nearby Banks */}
                  <div className="h-64 lg:h-full min-h-[300px] rounded-xl overflow-hidden border border-glassWhite relative z-0">
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Circle center={mapCenter} radius={2000} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1 }} />
                      {dummyBloodBanks.map(bank => (
                        <Marker key={bank.id} position={bank.position}>
                          <Popup>{bank.name}</Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Feed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-bloodRed font-medium mb-4">
            <Activity className="animate-pulse" size={18} /> Live Request Feed
          </div>
          
          <AnimatePresence>
            {requests.length === 0 ? (
              <div className="text-center py-10 text-textMuted glass-card rounded-xl">No pending emergency requests.</div>
            ) : (
              requests.filter(req => req.status !== 'Cancelled').map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  layout
                >
                  <GlassCard className={`border-l-4 ${req.urgency_level === 'Critical' ? 'border-l-bloodRed bg-bloodRed/5' : 'border-l-orange-500'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-white bg-bloodRed px-3 py-1 rounded-md shadow-[0_0_10px_rgba(255,42,42,0.5)]">{req.blood_group}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${req.urgency_level === 'Critical' ? 'bg-bloodRed/20 text-bloodRed' : 'bg-orange-500/20 text-orange-500'}`}>
                            {req.urgency_level}
                          </span>
                          <span className="text-textMuted text-sm">Needs {req.units_required} Units</span>
                          {req.status === 'Fulfilled' && (
                            <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-green-500/20 text-green-500 flex items-center gap-1">
                              <CheckCircle size={12} /> Fulfilled
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{req.hospital_name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-textMuted">
                          <span className="flex items-center gap-1"><MapPin size={14}/> {req.city}</span>
                          <span className="flex items-center gap-1"><Clock size={14}/> {new Date(req.created_at || Date.now()).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto flex flex-col items-end gap-2">
                        <p className="text-sm text-textMuted">Requested by: {req.requester_name}</p>
                        {req.status === 'Pending' ? (
                          <div className="flex gap-2 w-full justify-end">
                            <a href={`tel:${req.contact_number}`} className="w-full">
                              <Button className="w-full border-bloodRed/30 text-bloodRed hover:bg-bloodRed hover:text-white">Call {req.contact_number}</Button>
                            </a>
                            {/* In a real app, only the creator or admin can mark it fulfilled */}
                            <button onClick={() => updateStatus(req.id, 'Fulfilled')} className="p-3 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition" title="Mark Fulfilled">
                              <CheckCircle size={20} />
                            </button>
                            <button onClick={() => updateStatus(req.id, 'Cancelled')} className="p-3 bg-gray-500/20 text-gray-500 hover:bg-gray-500 hover:text-white rounded-lg transition" title="Cancel Request">
                              <XCircle size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-green-500 font-bold">Request Closed</div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
