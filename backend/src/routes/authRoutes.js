const express = require('express');
const { login, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', verifyToken, login);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
