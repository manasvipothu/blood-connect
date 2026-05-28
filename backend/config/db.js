const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'blood_connect',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      logging: false, // Set to console.log to see SQL queries
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
