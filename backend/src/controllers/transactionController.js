const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            userId: req.userId
        });

        res.status(201).json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        res.json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        res.json({ success: true, message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getTransactionStats = async (req, res) => {
    try {
        const stats = await Transaction.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            income: 0,
            expense: 0,
            balance: 0,
            totalTransactions: 0
        };

        stats.forEach(stat => {
            result[stat._id] = stat.total;
            result.totalTransactions += stat.count;
        });

        result.balance = result.income - result.expense;

        res.json({ success: true, stats: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats
};
