const { Donor } = require('../models');
const { Op } = require('sequelize');

const searchDonors = async (req, res) => {
  try {
    const { blood_group, city, state } = req.query;
    
    // Eligibility: age >= 18, weight >= 50
    let whereClause = { 
      availability: true,
      age: { [Op.gte]: 18 },
      weight: { [Op.gte]: 50 }
    };
    
    if (blood_group) whereClause.blood_group = blood_group;
    if (city) whereClause.city = { [Op.like]: `%${city}%` };
    if (state) whereClause.state = { [Op.like]: `%${state}%` };

    const donors = await Donor.findAll({
      where: whereClause,
      attributes: ['id', 'full_name', 'blood_group', 'city', 'state', 'phone', 'last_donation_date']
    });

    // Post-filter for last_donation_date (must be null or > 90 days ago)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const eligibleDonors = donors.filter(donor => {
      if (!donor.last_donation_date) return true;
      const donationDate = new Date(donor.last_donation_date);
      return donationDate <= ninetyDaysAgo;
    });

    res.status(200).json(eligibleDonors);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    await Donor.update({ availability }, { where: { id: req.user.id } });
    res.status(200).json({ message: 'Availability updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateDonorProfile = async (req, res) => {
  try {
    const { full_name, age, weight, phone, city, state, address, last_donation_date, blood_group } = req.body;
    await Donor.update({
      full_name, age, weight, phone, city, state, address, last_donation_date, blood_group
    }, { where: { id: req.user.id } });
    
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { searchDonors, getDonorProfile, updateAvailability, updateDonorProfile };
