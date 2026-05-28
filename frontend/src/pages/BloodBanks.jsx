import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Building2, Search as SearchIcon, MapPin, Phone, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';

const BloodBanks = () => {
  const [banks, setBanks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app this would call /api/banks. Since this is dummy data/demo, we mix real + dummy
    const fetchBanks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/banks');
        // Let's add some dummy banks to make the UI look like the screenshot if DB is empty
        const dummyBanks = [
          { id: 'd1', blood_bank_name: 'KEM Hospital Blood Bank', license_number: 'BB-MH-024', city: 'Mumbai', state: 'Maharashtra', address: 'Acharya Donde Marg, Parel, Mumbai', phone_number: '+91 2224107000', operating_hours: '24/7' },
          { id: 'd2', blood_bank_name: 'Rajasthan Red Cross Blood Bank', license_number: 'IRCS-RJ-008', city: 'Jaipur', state: 'Rajasthan', address: 'Jawahar Lal Nehru Marg, Jaipur', phone_number: '+91 1412227474', operating_hours: '8 AM - 8 PM' },
          { id: 'd3', blood_bank_name: 'Apollo Hospital Blood Bank', license_number: 'BB-TS-056', city: 'Hyderabad', state: 'Telangana', address: 'Jubilee Hills, Hyderabad', phone_number: '+91 4023607777', operating_hours: '24/7' },
          { id: 'd4', blood_bank_name: 'AIIMS Blood Center', license_number: 'BB-DL-001', city: 'Delhi', state: 'Delhi', address: 'Ansari Nagar, New Delhi', phone_number: '+91 1126588500', operating_hours: '24/7' },
          { id: 'd5', blood_bank_name: 'Fortis Hospital Blood Bank', license_number: 'BB-KA-088', city: 'Bangalore', state: 'Karnataka', address: 'Bannerghatta Road, Bangalore', phone_number: '+91 8066214444', operating_hours: '24/7' },
          { id: 'd6', blood_bank_name: 'Civil Hospital Blood Bank', license_number: 'BB-GJ-012', city: 'Ahmedabad', state: 'Gujarat', address: 'Asarwa, Ahmedabad', phone_number: '+91 7922683721', operating_hours: '24/7' },
          { id: 'd7', blood_bank_name: 'CMC Hospital Blood Bank', license_number: 'BB-TN-045', city: 'Chennai', state: 'Tamil Nadu', address: 'Vellore, Chennai', phone_number: '+91 4428881234', operating_hours: '24/7' },
          { id: 'd8', blood_bank_name: 'Ruby General Blood Center', license_number: 'BB-WB-099', city: 'Kolkata', state: 'West Bengal', address: 'Kasba Golpark, Kolkata', phone_number: '+91 3324986832', operating_hours: '10 AM - 10 PM' },
          { id: 'd9', blood_bank_name: 'Sanjeevani Blood Bank', license_number: 'BB-MH-055', city: 'Pune', state: 'Maharashtra', address: 'Shivaji Nagar, Pune', phone_number: '+91 2025533111', operating_hours: '9 AM - 9 PM' },
          { id: 'd10', blood_bank_name: 'Lions Club Blood Bank', license_number: 'BB-GJ-023', city: 'Surat', state: 'Gujarat', address: 'Ring Road, Surat', phone_number: '+91 2612345678', operating_hours: '24/7' },
        ];
        setBanks([...dummyBanks, ...res.data]);
      } catch (error) {
        console.error("Failed to fetch banks", error);
        const fallbackBanks = [
          { id: 'd1', blood_bank_name: 'KEM Hospital Blood Bank', license_number: 'BB-MH-024', city: 'Mumbai', state: 'Maharashtra', address: 'Acharya Donde Marg, Parel, Mumbai', phone_number: '+91 2224107000', operating_hours: '24/7' },
          { id: 'd2', blood_bank_name: 'Rajasthan Red Cross Blood Bank', license_number: 'IRCS-RJ-008', city: 'Jaipur', state: 'Rajasthan', address: 'Jawahar Lal Nehru Marg, Jaipur', phone_number: '+91 1412227474', operating_hours: '8 AM - 8 PM' },
          { id: 'd3', blood_bank_name: 'Apollo Hospital Blood Bank', license_number: 'BB-TS-056', city: 'Hyderabad', state: 'Telangana', address: 'Jubilee Hills, Hyderabad', phone_number: '+91 4023607777', operating_hours: '24/7' },
          { id: 'd4', blood_bank_name: 'AIIMS Blood Center', license_number: 'BB-DL-001', city: 'Delhi', state: 'Delhi', address: 'Ansari Nagar, New Delhi', phone_number: '+91 1126588500', operating_hours: '24/7' },
          { id: 'd5', blood_bank_name: 'Fortis Hospital Blood Bank', license_number: 'BB-KA-088', city: 'Bangalore', state: 'Karnataka', address: 'Bannerghatta Road, Bangalore', phone_number: '+91 8066214444', operating_hours: '24/7' },
          { id: 'd6', blood_bank_name: 'Civil Hospital Blood Bank', license_number: 'BB-GJ-012', city: 'Ahmedabad', state: 'Gujarat', address: 'Asarwa, Ahmedabad', phone_number: '+91 7922683721', operating_hours: '24/7' },
          { id: 'd7', blood_bank_name: 'CMC Hospital Blood Bank', license_number: 'BB-TN-045', city: 'Chennai', state: 'Tamil Nadu', address: 'Vellore, Chennai', phone_number: '+91 4428881234', operating_hours: '24/7' },
          { id: 'd8', blood_bank_name: 'Ruby General Blood Center', license_number: 'BB-WB-099', city: 'Kolkata', state: 'West Bengal', address: 'Kasba Golpark, Kolkata', phone_number: '+91 3324986832', operating_hours: '10 AM - 10 PM' },
          { id: 'd9', blood_bank_name: 'Sanjeevani Blood Bank', license_number: 'BB-MH-055', city: 'Pune', state: 'Maharashtra', address: 'Shivaji Nagar, Pune', phone_number: '+91 2025533111', operating_hours: '9 AM - 9 PM' },
          { id: 'd10', blood_bank_name: 'Lions Club Blood Bank', license_number: 'BB-GJ-023', city: 'Surat', state: 'Gujarat', address: 'Ring Road, Surat', phone_number: '+91 2612345678', operating_hours: '24/7' },
        ];
        setBanks(fallbackBanks);
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

  const filteredBanks = banks.filter(b => 
    b.blood_bank_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.city?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.state?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-darkBg text-textColor transition-colors duration-300 pb-20">
      <Navbar />
      
      <div className="pt-28 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md font-medium text-sm mb-4">
            <Building2 size={16} /> Blood Banks
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-textColor">Blood Bank Directory</h1>
          <p className="text-textMuted max-w-2xl mx-auto">Find blood banks near you or register your blood bank to join our network</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-10 relative">
          <SearchIcon size={20} className="absolute left-4 top-4 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search blood banks by name, city, or state..." 
            className="w-full bg-glassWhite border border-textColor/10 rounded-xl py-4 pl-12 pr-4 text-textColor focus:outline-none focus:border-bloodRed transition shadow-sm backdrop-blur-md"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        <p className="text-sm text-textMuted mb-4">Showing {filteredBanks.length} blood banks</p>
        
        {loading ? (
          <div className="text-center py-10">Loading blood banks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanks.map((bank, idx) => (
              <motion.div
                key={bank.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-glassWhite border border-textColor/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 size={24} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-textColor leading-tight mb-1">{bank.blood_bank_name}</h3>
                      <p className="text-xs text-textMuted">License: {bank.license_number || 'N/A'}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded-md">
                    Active
                  </span>
                </div>
                
                <div className="space-y-3 mb-6 text-sm text-textMuted flex-grow">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" /> 
                    <span>{bank.address ? `${bank.address}` : `${bank.city}, ${bank.state}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} /> {bank.phone_number || 'Not provided'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> {bank.operating_hours || '24/7'}
                  </div>
                </div>

                <a href={`tel:${bank.phone_number}`} className="block w-full mt-auto">
                  <button className="w-full bg-transparent border border-textColor/20 hover:border-textColor/50 text-textColor font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Phone size={16} /> Contact
                  </button>
                </a>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filteredBanks.length === 0 && (
          <div className="text-center py-20">
            <Building2 size={48} className="mx-auto text-textMuted mb-4 opacity-30" />
            <h3 className="text-xl font-medium text-textColor mb-2">No blood banks found</h3>
            <p className="text-textMuted">Try adjusting your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodBanks;
