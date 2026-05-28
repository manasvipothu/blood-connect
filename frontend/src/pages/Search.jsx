import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Search as SearchIcon, MapPin, Phone, Calendar, Filter, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Select from '../components/Select';

const Search = () => {
  const [donors, setDonors] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    blood_group: '',
    state: '',
    city: '',
    type: 'All Donors'
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh'
  ]; 

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 
    'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 
    'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar'
  ].sort();

  const fetchDonors = async (searchFilters = filters) => {
    try {
      // Build query string based on filters
      const params = new URLSearchParams();
      if (searchFilters.blood_group) params.append('blood_group', searchFilters.blood_group);
      if (searchFilters.city) params.append('city', searchFilters.city);
      if (searchFilters.state) params.append('state', searchFilters.state);
      
      const res = await axios.get(`https://blood-connect-w1ox.onrender.com/api/donors/search?${params.toString()}`);
      
      if (res.data) {
        setDonors(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch donors", error);
      setDonors([]);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonors(filters);
  };

  const clearFilters = () => {
    const emptyFilters = { name: '', blood_group: '', state: '', city: '', type: 'All Donors' };
    setFilters(emptyFilters);
    fetchDonors(emptyFilters);
  };

  return (
    <div className="min-h-screen bg-darkBg text-textColor transition-colors duration-300 pb-20">
      <Navbar />
      
      <div className="pt-28 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Blood Donors</h1>
          <p className="text-textMuted max-w-2xl mx-auto">Search our database of registered donors to find compatible donors in your area</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-glassWhite border border-textColor/10 rounded-xl p-6 mb-10 shadow-sm backdrop-blur-md relative z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-textColor">
              <Filter size={18} className="text-bloodRed" /> Filter Donors
            </h3>
            <button onClick={clearFilters} className="text-sm text-textMuted hover:text-bloodRed flex items-center gap-1 transition">
              <X size={14} /> Clear All
            </button>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <SearchIcon size={18} className="absolute left-3 top-3.5 text-textMuted" />
              <input 
                type="text" 
                placeholder="Search by name..." 
                className="w-full bg-darkBg border border-textColor/10 rounded-lg py-3 pl-10 pr-4 text-sm text-textColor focus:outline-none focus:border-bloodRed transition"
                value={filters.name}
                onChange={e => setFilters({...filters, name: e.target.value})}
              />
            </div>
            
            <Select 
              options={[{value: '', label: 'All Blood Types'}, ...bloodGroups.map(bg => ({value: bg, label: bg}))]} 
              value={filters.blood_group}
              onChange={e => setFilters({...filters, blood_group: e.target.value})}
            />

            <Select 
              options={[{value: '', label: 'All States'}, ...states.map(st => ({value: st, label: st}))]} 
              value={filters.state}
              onChange={e => setFilters({...filters, state: e.target.value})}
            />

            <Select 
              options={[{value: '', label: 'All Cities'}, 'Mumbai', 'Surat', 'New Delhi', 'Bangalore', 'Jaipur']} 
              value={filters.city}
              onChange={e => setFilters({...filters, city: e.target.value})}
            />

            <Select 
              options={[{value: 'All Donors', label: 'All Donors'}, 'Available Only']} 
              value={filters.type}
              onChange={e => setFilters({...filters, type: e.target.value})}
            />

            <Button type="submit" variant="primary" className="w-full py-3">
              <SearchIcon size={18} /> Search Donors
            </Button>
          </form>
        </div>

        {/* Results */}
        <p className="text-sm text-textMuted mb-4">Showing {donors.length} donors</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor, idx) => (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-glassWhite border border-textColor/10 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-bloodRed rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {donor.blood_group}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-textColor">{donor.full_name}</h3>
                    <div className="flex items-center gap-1 text-xs text-textMuted mt-1">
                      <MapPin size={12} /> {donor.city}, {donor.state || 'India'}
                    </div>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Eligible & Available
                </span>
              </div>
              
              <div className="space-y-2 mb-6 text-sm text-textMuted">
                <div className="flex items-center gap-2">
                  <Phone size={14} /> +91 {donor.phone?.substring(donor.phone.length - 10) || '9876543210'}
                </div>
                {donor.last_donation_date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} /> Last donated: {new Date(donor.last_donation_date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                  </div>
                )}
              </div>

              <a href={`tel:+91${donor.phone}`} className="block w-full">
                <button className="w-full bg-bloodRed hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Phone size={16} /> Contact Donor
                </button>
              </a>
            </motion.div>
          ))}
        </div>
        
        {donors.length === 0 && (
          <div className="text-center py-20">
            <SearchIcon size={48} className="mx-auto text-textMuted mb-4 opacity-30" />
            <h3 className="text-xl font-medium text-textColor mb-2">No donors found</h3>
            <p className="text-textMuted">Try adjusting your filters to find donors in your area.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
