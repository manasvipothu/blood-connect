const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const EmergencyRequest = sequelize.define('EmergencyRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  requester_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hospital_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  blood_group: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  units_required: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  urgency_level: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    allowNull: false,
  },
  contact_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Fulfilled', 'Cancelled'),
    defaultValue: 'Pending',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = EmergencyRequest;
