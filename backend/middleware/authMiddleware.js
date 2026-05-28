const { verifyToken } = require('../utils/jwtHelper');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }

  req.user = decoded; // { id, role }
  next();
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Access denied. Requires ${role} role.` });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
