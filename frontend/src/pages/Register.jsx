import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Droplet, MapPin, Map, Calendar, Weight, CheckCircle2, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Select from '../components/Select';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', phone: '', 
    blood_group: '', state: '', city: '', address: '', age: '', weight: '', gender: 'Other',
    last_donation_date: '', is_available: true, medical_conditions: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map empty last_donation_date to null so Sequelize doesn't complain about invalid date string
      const payload = { ...formData, last_donation_date: formData.last_donation_date || null };
      
      await axios.post('https://blood-connect-w1ox.onrender.com/api/auth/register/donor', payload);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Registration failed. Backend might be unreachable.');
    }
  };

  const inputClass = "w-full bg-transparent border border-textColor/20 rounded-lg p-3 pl-10 text-sm text-textColor focus:outline-none focus:border-bloodRed transition-colors";

  const benefits = [
    "Free health check-up with every donation",
    "Know your blood type and basic health indicators",
    "Reduced risk of heart disease",
    "Burn up to 650 calories per donation",
    "Join a community of lifesavers",
    "Get notified when someone needs your blood type"
  ];

  return (
    <div className="min-h-screen bg-darkBg text-textColor transition-colors duration-300 pb-20">
      <Navbar />
      
      <div className="pt-28 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column - Benefits */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Register as a<br />
                <span className="text-bloodRed">Blood Donor</span>
              </h1>
              <p className="text-textMuted mb-8 text-lg">
                Join our community of lifesavers. Your donation can help save up to 3 lives with a single donation.
              </p>
              
              <div className="bg-glassWhite border border-textColor/10 rounded-2xl p-8 shadow-sm backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-textColor">Benefits of Donating Blood</h3>
                <div className="space-y-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-textColor">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="bg-glassWhite border border-textColor/10 rounded-2xl p-8 shadow-sm backdrop-blur-md"
            >
              <h2 className="text-2xl font-bold mb-6 text-textColor">Donor Registration Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><User size={14}/> Full Name *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="text" placeholder="Enter your full name" className={inputClass} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><Mail size={14}/> Email *</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="email" placeholder="your@email.com" className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><Phone size={14}/> Phone Number *</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="tel" placeholder="+91 XXXXX XXXXX" className={inputClass} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><Droplet size={14}/> Blood Type *</label>
                    <Select 
                      options={[{value: '', label: 'Select blood type'}, 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} 
                      value={formData.blood_group}
                      onChange={e => setFormData({...formData, blood_group: e.target.value})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><Map size={14}/> State *</label>
                    <div className="relative">
                      <Map size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="text" placeholder="Enter your state" className={inputClass} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><MapPin size={14}/> City *</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="text" placeholder="Enter your city" className={inputClass} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><MapPin size={14}/> Full Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3.5 text-textMuted" />
                    <input type="text" placeholder="Enter your complete address" className={inputClass} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><User size={14}/> Age *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="number" placeholder="Your age" className={inputClass} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><Weight size={14}/> Weight (kg)</label>
                    <div className="relative">
                      <Weight size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input type="number" placeholder="Weight in kg" className={inputClass} value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><Calendar size={14}/> Last Donation Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input type="date" className={inputClass} value={formData.last_donation_date} onChange={e => setFormData({...formData, last_donation_date: e.target.value})} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.is_available} onChange={e => setFormData({...formData, is_available: e.target.checked})} />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bloodRed"></div>
                      <span className="ml-3 text-sm font-medium text-textColor flex items-center gap-1"><Heart size={14} className="text-bloodRed"/> Available for Donation</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1">Password *</label>
                  <input required type="password" placeholder="Create a password" className="w-full bg-transparent border border-textColor/20 rounded-lg p-3 text-sm text-textColor focus:outline-none focus:border-bloodRed transition-colors" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1">Medical Conditions (if any)</label>
                  <input type="text" placeholder="E.g., Diabetes, Hypertension (Leave blank if none)" className="w-full bg-transparent border border-textColor/20 rounded-lg p-3 text-sm text-textColor focus:outline-none focus:border-bloodRed transition-colors" value={formData.medical_conditions} onChange={e => setFormData({...formData, medical_conditions: e.target.value})} />
                </div>

                <Button type="submit" variant="primary" className="w-full py-4 text-lg mt-6">
                  Register as Donor
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-textMuted">
                Are you a Blood Bank/Hospital? <Link to="/register-bank" className="text-bloodRed hover:underline">Register here</Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
