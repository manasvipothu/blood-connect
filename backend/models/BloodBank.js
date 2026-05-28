const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BloodBank = sequelize.define('BloodBank', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  blood_bank_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  license_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  blood_stock: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: JSON.stringify({
      'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
      'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0
    }),
    get() {
      const rawValue = this.getDataValue('blood_stock');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('blood_stock', JSON.stringify(value));
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = BloodBank;
