const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BloodDrive = sequelize.define('BloodDrive', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  organizer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = BloodDrive;
