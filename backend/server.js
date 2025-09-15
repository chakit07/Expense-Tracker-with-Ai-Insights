const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const aiRoutes = require('./src/routes/aiRoutes')

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/transactions', require('./src/routes/transactionRoutes'));
app.use('/api/ai', aiRoutes);
app.use('/api/reports', require('./src/routes/reportRoutes'));

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
