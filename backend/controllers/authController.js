const bcrypt = require('bcrypt');
const { Donor, BloodBank, Admin } = require('../models');
const { generateToken } = require('../utils/jwtHelper');

const registerDonor = async (req, res) => {
  try {
    const { full_name, age, gender, blood_group, phone, email, password, city, state, address, last_donation_date, weight } = req.body;

    const existingDonor = await Donor.findOne({ where: { email } });
    if (existingDonor) return res.status(400).json({ error: 'Email already registered.' });

    const existingPhone = await Donor.findOne({ where: { phone } });
    if (existingPhone) return res.status(400).json({ error: 'Phone number already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDonor = await Donor.create({
      full_name, age, gender, blood_group, phone, email, password: hashedPassword, city, state, address, last_donation_date, weight
    });

    const token = generateToken({ id: newDonor.id, role: 'donor' });
    res.status(201).json({ message: 'Donor registered successfully', token, donor: { id: newDonor.id, full_name, email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const registerBloodBank = async (req, res) => {
  try {
    const { blood_bank_name, license_number, email, phone, address, password } = req.body;

    const existingBank = await BloodBank.findOne({ where: { email } });
    if (existingBank) return res.status(400).json({ error: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBank = await BloodBank.create({
      blood_bank_name, license_number, email, phone, address, password: hashedPassword
    });

    const token = generateToken({ id: newBank.id, role: 'bloodbank' });
    res.status(201).json({ message: 'Blood bank registered successfully', token, bank: { id: newBank.id, name: blood_bank_name, email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body; // role: 'donor', 'bloodbank', or 'admin'
    
    let user = null;
    if (role === 'donor') user = await Donor.findOne({ where: { email } });
    else if (role === 'bloodbank') user = await BloodBank.findOne({ where: { email } });
    else if (role === 'admin') user = await Admin.findOne({ where: { email } });
    else return res.status(400).json({ error: 'Invalid role specified.' });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = generateToken({ id: user.id, role });
    res.status(200).json({ message: 'Login successful', token, role, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { registerDonor, registerBloodBank, login };
