import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Select from '../components/Select';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'donor' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.role);
      
      if (res.data.role === 'donor') navigate('/dashboard/donor');
      else if (res.data.role === 'bloodbank' || res.data.role === 'organization') navigate('/dashboard/bank');
      else navigate('/dashboard/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'donor', label: 'Donor' },
    { value: 'bloodbank', label: 'Blood Bank / Organization' },
    { value: 'admin', label: 'Administrator' }
  ];

  return (
    <div className="min-h-screen bg-darkBg text-textColor relative flex flex-col transition-colors duration-300">
      <Navbar />
      
      {/* Background Mesh Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bloodRed/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10 pt-20">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Welcome <span className="text-bloodRed">Back</span></h2>
                <p className="text-textMuted">Login to continue saving lives.</p>
              </div>

              {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-6 text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-textMuted mb-1">Login As</label>
                  <Select 
                    name="role" 
                    options={roleOptions} 
                    value={formData.role} 
                    onChange={handleChange} 
                  />
                </div>

                <div>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    className="input-glass w-full rounded-lg p-3" 
                    onChange={handleChange} 
                  />
                </div>
                
                <div>
                  <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    required 
                    className="input-glass w-full rounded-lg p-3" 
                    onChange={handleChange} 
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" className="w-full text-lg py-3" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </form>
              
              <div className="text-center mt-6 text-textMuted">
                Don't have an account? <Link to="/register" className="text-bloodRed hover:underline">Register now</Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
