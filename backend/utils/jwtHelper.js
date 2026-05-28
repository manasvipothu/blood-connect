const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
