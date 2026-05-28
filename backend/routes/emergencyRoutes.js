const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/emergencyController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', createRequest);
router.get('/', getRequests);
router.put('/:id/status', authenticateToken, updateRequestStatus);

module.exports = router;
