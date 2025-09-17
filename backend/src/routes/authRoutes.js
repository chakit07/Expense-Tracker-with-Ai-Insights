const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', verifyToken, login);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
