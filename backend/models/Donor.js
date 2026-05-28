const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Donor = sequelize.define('Donor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
  },
  blood_group: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_donation_date: {
    type: DataTypes.DATEONLY,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Donor;
