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

router.use(verifyToken);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/stats', getTransactionStats);

module.exports = router;
