const { EmergencyRequest } = require('../models');

const createRequest = async (req, res) => {
  try {
    const { requester_name, hospital_name, blood_group, units_required, urgency_level, contact_number, city } = req.body;
    
    const newRequest = await EmergencyRequest.create({
      requester_name, hospital_name, blood_group, units_required, urgency_level, contact_number, city
    });

    res.status(201).json({ message: 'Emergency request created successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.findAll({
      where: { status: 'Pending' },
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await EmergencyRequest.update({ status }, { where: { id } });
    res.status(200).json({ message: 'Request status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createRequest, getRequests, updateRequestStatus };
