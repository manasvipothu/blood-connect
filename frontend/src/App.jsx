import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterBank from './pages/RegisterBank';
import Search from './pages/Search';
import Emergency from './pages/Emergency';
import DonorDashboard from './pages/DonorDashboard';
import BankDashboard from './pages/BankDashboard';
import BloodDrives from './pages/BloodDrives';
import BloodBanks from './pages/BloodBanks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-bank" element={<RegisterBank />} />
        <Route path="/search" element={<Search />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/drives" element={<BloodDrives />} />
        <Route path="/banks" element={<BloodBanks />} />
        <Route path="/dashboard/donor" element={<DonorDashboard />} />
        <Route path="/dashboard/bank" element={<BankDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
