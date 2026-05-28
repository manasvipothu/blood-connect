const { sequelize, connectDB } = require('../config/db');
const Donor = require('./Donor');
const BloodBank = require('./BloodBank');
const EmergencyRequest = require('./EmergencyRequest');
const Admin = require('./Admin');

const BloodDrive = require('./BloodDrive');
const DriveRegistration = require('./DriveRegistration');

// Define Relationships
BloodDrive.hasMany(DriveRegistration, { foreignKey: 'drive_id' });
DriveRegistration.belongsTo(BloodDrive, { foreignKey: 'drive_id' });

Donor.hasMany(DriveRegistration, { foreignKey: 'donor_id' });
DriveRegistration.belongsTo(Donor, { foreignKey: 'donor_id' });

BloodBank.hasMany(BloodDrive, { foreignKey: 'organizer_id' });
BloodDrive.belongsTo(BloodBank, { foreignKey: 'organizer_id' });

const syncDB = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  syncDB,
  Donor,
  BloodBank,
  EmergencyRequest,
  Admin,
  BloodDrive,
  DriveRegistration
};
