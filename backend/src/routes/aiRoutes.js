const express = require('express');
const router = express.Router();
const { getFinancialInsights } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/insights', verifyToken, getFinancialInsights);

module.exports = router;