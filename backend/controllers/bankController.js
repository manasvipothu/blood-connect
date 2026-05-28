const { BloodBank } = require('../models');

const getBankProfile = async (req, res) => {
  try {
    const bank = await BloodBank.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!bank) return res.status(404).json({ error: 'Blood Bank not found' });
    res.status(200).json(bank);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateBloodStock = async (req, res) => {
  try {
    const { blood_stock } = req.body;
    await BloodBank.update({ blood_stock }, { where: { id: req.user.id } });
    res.status(200).json({ message: 'Blood stock updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getBankProfile, updateBloodStock };
