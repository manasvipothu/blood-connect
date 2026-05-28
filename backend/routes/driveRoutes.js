const express = require('express');
const router = express.Router();
const driveController = require('../controllers/driveController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', driveController.getAllDrives);

// Organization specific routes
router.post('/', authenticateToken, authorizeRole('bloodbank'), driveController.createDrive);
router.get('/my-drives', authenticateToken, authorizeRole('bloodbank'), driveController.getOrganizerDrives);
router.get('/:id/attendees', authenticateToken, authorizeRole('bloodbank'), driveController.getDriveAttendees);
router.put('/:id/attendees/:regId/verify', authenticateToken, authorizeRole('bloodbank'), driveController.verifyAttendee);

// Donor specific routes
router.get('/my-registrations', authenticateToken, authorizeRole('donor'), driveController.getMyRegistrations);
router.post('/:id/register', authenticateToken, authorizeRole('donor'), driveController.registerForDrive);
router.delete('/:id/register', authenticateToken, authorizeRole('donor'), driveController.unregisterForDrive);
router.post('/:id/certificate', authenticateToken, authorizeRole('donor'), driveController.uploadCertificate);

module.exports = router;
