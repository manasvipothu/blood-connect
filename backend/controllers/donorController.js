const { Donor } = require('../models');
const { Op } = require('sequelize');

const searchDonors = async (req, res) => {
  try {
    const { blood_group, city, state } = req.query;
    
    let whereClause = { availability: true };
    if (blood_group) whereClause.blood_group = blood_group;
    if (city) whereClause.city = { [Op.like]: `%${city}%` };
    if (state) whereClause.state = { [Op.like]: `%${state}%` };

    const donors = await Donor.findAll({
      where: whereClause,
      attributes: ['id', 'full_name', 'blood_group', 'city', 'state', 'phone'] // Exclude password and sensitive info if needed, but phone is needed to contact
    });

    res.status(200).json(donors);
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

module.exports = { searchDonors, getDonorProfile, updateAvailability };
