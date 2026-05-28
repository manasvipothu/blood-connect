const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DriveRegistration = sequelize.define('DriveRegistration', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  drive_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  donor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Registered', 'Attended', 'Cancelled'),
    defaultValue: 'Registered',
  },
}, {
  timestamps: true,
  createdAt: 'registered_at',
  updatedAt: false,
});

module.exports = DriveRegistration;
