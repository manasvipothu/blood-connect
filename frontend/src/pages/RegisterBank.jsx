import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const RegisterBank = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    blood_bank_name: '', email: '', password: '', phone: '', 
    license_number: '', address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://blood-connect-w1ox.onrender.com/api/auth/register/bloodbank', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Registration failed. Backend might be unreachable.');
    }
  };

  const inputClass = "w-full bg-transparent border border-textColor/20 rounded-lg p-3 pl-10 text-sm text-textColor focus:outline-none focus:border-bloodRed transition-colors";

  const benefits = [
    "Manage your blood inventory digitally",
    "Organize and schedule Blood Drives",
    "Connect directly with donors in your city",
    "Receive instant emergency requests",
    "Track all donor history securely"
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
                Register a<br />
                <span className="text-blue-500">Blood Bank</span>
              </h1>
              <p className="text-textMuted mb-8 text-lg">
                Digitize your inventory and connect with thousands of willing donors in real-time.
              </p>
              
              <div className="bg-glassWhite border border-textColor/10 rounded-2xl p-8 shadow-sm backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-textColor">Why join Blood Connect?</h3>
                <div className="space-y-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
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
              <h2 className="text-2xl font-bold mb-6 text-textColor">Organization Registration</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><Building2 size={14}/> Blood Bank Name *</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="text" placeholder="Official name of your organization" className={inputClass} value={formData.blood_bank_name} onChange={e => setFormData({...formData, blood_bank_name: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><FileText size={14}/> License Number *</label>
                    <div className="relative">
                      <FileText size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="text" placeholder="Govt. License Number" className={inputClass} value={formData.license_number} onChange={e => setFormData({...formData, license_number: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><Phone size={14}/> Contact Phone *</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="tel" placeholder="Primary contact number" className={inputClass} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><Mail size={14}/> Organization Email *</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3.5 text-textMuted" />
                      <input required type="email" placeholder="contact@hospital.com" className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Password *</label>
                    <input required type="password" placeholder="Create a password" className="w-full bg-transparent border border-textColor/20 rounded-lg p-3 text-sm text-textColor focus:outline-none focus:border-bloodRed transition-colors" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1 flex items-center gap-2"><MapPin size={14}/> Complete Address *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3.5 text-textMuted" />
                    <input required type="text" placeholder="Full address including city and state" className={inputClass} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full py-4 text-lg mt-6 bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  Register Blood Bank
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-textMuted">
                Are you an individual Donor? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterBank;
