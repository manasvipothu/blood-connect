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

exports.unregisterForDrive = async (req, res) => {
  try {
    const drive_id = req.params.id;
    const donor_id = req.user.id;

    const deleted = await DriveRegistration.destroy({ where: { drive_id, donor_id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.status(200).json({ message: 'Successfully unregistered from the drive' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error unregistering from drive' });
  }
};

exports.uploadCertificate = async (req, res) => {
  try {
    const drive_id = req.params.id;
    const donor_id = req.user.id;
    const { certificate_url } = req.body;

    const registration = await DriveRegistration.findOne({ where: { drive_id, donor_id } });
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    await registration.update({ certificate_url, certificate_status: 'Pending' });

    res.status(200).json({ message: 'Certificate uploaded successfully, pending verification' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error uploading certificate' });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const donor_id = req.user.id;
    const registrations = await DriveRegistration.findAll({ where: { donor_id } });
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching registrations' });
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
      include: [{ model: Donor, attributes: ['id', 'full_name', 'blood_group', 'phone', 'city'] }]
    });

    res.json(attendees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching attendees' });
  }
};

exports.verifyAttendee = async (req, res) => {
  try {
    const { id, regId } = req.params;
    const drive = await BloodDrive.findByPk(id);
    
    if (!drive || drive.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const registration = await DriveRegistration.findOne({ where: { id: regId, drive_id: id } });
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    await registration.update({ certificate_status: 'Verified', status: 'Attended' });

    // Update the donor's last_donation_date to the drive's date
    const donor = await Donor.findByPk(registration.donor_id);
    if (donor) {
      // Create a date formatted as YYYY-MM-DD
      const driveDate = new Date(drive.date).toISOString().split('T')[0];
      await donor.update({ last_donation_date: driveDate });
    }

    res.status(200).json({ message: 'Attendee verified and donor record updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error verifying attendee' });
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
