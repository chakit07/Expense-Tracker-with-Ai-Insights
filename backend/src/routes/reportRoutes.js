const express = require('express');
const { exportToExcel, exportToPDF } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/excel', verifyToken, exportToExcel);
router.get('/pdf', verifyToken, exportToPDF);

module.exports = router;
