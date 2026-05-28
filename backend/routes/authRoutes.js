const express = require('express');
const router = express.Router();
const { registerDonor, registerBloodBank, login } = require('../controllers/authController');

router.post('/register/donor', registerDonor);
router.post('/register/bloodbank', registerBloodBank);
router.post('/login', login);

module.exports = router;
