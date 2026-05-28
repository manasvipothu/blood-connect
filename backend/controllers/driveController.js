const { BloodDrive, DriveRegistration, Donor, BloodBank } = require('../models');

exports.createDrive = async (req, res) => {
  try {
    const { title, description, date, location, city } = req.body;
    
    // the organizer is the logged in bloodbank
    const organizer_id = req.user.id;

    const drive = await BloodDrive.create({
      organizer_id, title, description, date, location, city
    });

    res.status(201).json({ message: 'Blood drive created successfully', drive });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating drive' });
  }
};

exports.getAllDrives = async (req, res) => {
  try {
    const drives = await BloodDrive.findAll({
      include: [{ model: BloodBank, attributes: ['blood_bank_name', 'email'] }],
      order: [['date', 'ASC']]
    });
    res.json(drives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching drives' });
  }
};

exports.registerForDrive = async (req, res) => {
  try {
    const drive_id = req.params.id;
    const donor_id = req.user.id;

    const existing = await DriveRegistration.findOne({ where: { drive_id, donor_id } });
    if (existing) {
      return res.status(400).json({ error: 'Already registered for this drive' });
    }

    const reg = await DriveRegistration.create({ drive_id, donor_id });
    res.status(201).json({ message: 'Successfully registered for the drive', registration: reg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error registering for drive' });
  }
};

exports.getDriveAttendees = async (req, res) => {
  try {
    const drive_id = req.params.id;
    const drive = await BloodDrive.findByPk(drive_id);
    
    if (!drive || drive.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this drive' });
    }

    const attendees = await DriveRegistration.findAll({
      where: { drive_id },
      include: [{ model: Donor, attributes: ['full_name', 'blood_group', 'phone', 'city'] }]
    });

    res.json(attendees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching attendees' });
  }
};

exports.getOrganizerDrives = async (req, res) => {
  try {
    const drives = await BloodDrive.findAll({
      where: { organizer_id: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(drives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching organizer drives' });
  }
};
