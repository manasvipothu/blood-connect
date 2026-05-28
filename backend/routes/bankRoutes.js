const express = require('express');
const router = express.Router();
const { getBankProfile, updateBloodStock } = require('../controllers/bankController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, authorizeRole('bloodbank'), getBankProfile);
router.put('/stock', authenticateToken, authorizeRole('bloodbank'), updateBloodStock);

module.exports = router;
