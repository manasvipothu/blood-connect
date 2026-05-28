const express = require('express');
const router = express.Router();
const driveController = require('../controllers/driveController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', driveController.getAllDrives);

// Organization specific routes
router.post('/', authenticateToken, authorizeRole('bloodbank'), driveController.createDrive);
router.get('/my-drives', authenticateToken, authorizeRole('bloodbank'), driveController.getOrganizerDrives);
router.get('/:id/attendees', authenticateToken, authorizeRole('bloodbank'), driveController.getDriveAttendees);

// Donor specific routes
router.post('/:id/register', authenticateToken, authorizeRole('donor'), driveController.registerForDrive);

module.exports = router;
