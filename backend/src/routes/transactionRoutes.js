const express = require('express');
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats
} = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require auth
router.use(verifyToken);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/stats', getTransactionStats);

module.exports = router;
