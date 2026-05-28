const express = require('express');
const router = express.Router();
const { searchDonors, getDonorProfile, updateAvailability } = require('../controllers/donorController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/search', searchDonors);
router.get('/profile', authenticateToken, authorizeRole('donor'), getDonorProfile);
router.put('/availability', authenticateToken, authorizeRole('donor'), updateAvailability);

module.exports = router;
