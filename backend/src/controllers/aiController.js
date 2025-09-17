const Transaction = require('../models/Transaction');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const aiReportTemplate = require('../templates/aiReportTemplate');

// Helper function for retry with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 503 && attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed with 503, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

// @desc    Get AI-powered financial insights
// @route   GET /api/ai/insights
// @access  Private
exports.getFinancialInsights = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return res.status(500).json({ error: 'AI service is not configured' });
    }

    // Initialize the Gemini model inside the function after checking the key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: 'desc' }).limit(100); // Increase limit for better analysis

    if (transactions.length < 5) {
      return res.status(400).json({ error: 'Not enough transaction data for an analysis.' });
    }

    // Summarize transaction data
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryExpenses = {};
    const categoryIncome = {};
    const monthlySpending = {};
    const allTransactions = [];

    transactions.forEach(transaction => {
      const amount = transaction.amount;
      const category = transaction.category;
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      allTransactions.push(transaction);

      if (amount > 0) {
        totalIncome += amount;
        if (!categoryIncome[category]) categoryIncome[category] = 0;
        categoryIncome[category] += amount;
      } else {
        totalExpenses += Math.abs(amount);
        if (!categoryExpenses[category]) categoryExpenses[category] = 0;
        categoryExpenses[category] += Math.abs(amount);
      }

      if (!monthlySpending[monthKey]) monthlySpending[monthKey] = 0;
      monthlySpending[monthKey] += Math.abs(amount);
    });

    // Identify large transactions after calculating totals
    const largeTransactions = allTransactions.filter(transaction => {
      const absAmount = Math.abs(transaction.amount);
      return absAmount > Math.max(totalExpenses * 0.1, 5000);
    }).map(transaction => ({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date
    }));

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Top 3 expense categories
    const topCategories = Object.entries(categoryExpenses)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / totalExpenses) * 100).toFixed(1)
      }));

    // Monthly averages
    const months = Object.keys(monthlySpending).length;
    const avgMonthlyIncome = totalIncome / months;
    const avgMonthlyExpenses = totalExpenses / months;

    const summaryData = {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate: savingsRate.toFixed(1),
      categoryExpenses,
      categoryIncome,
      monthlySpending,
      largeTransactions,
      topCategories,
      avgMonthlyIncome,
      avgMonthlyExpenses,
      transactionCount: transactions.length
    };

    const prompt = `
      You are a financial expert and advisor. Analyze the following summarized financial data for a user (all amounts in Rupees) and provide clear, actionable financial insights.

      **Summary Data:**
      ${JSON.stringify(summaryData, null, 2)}

      **Analysis Goals:**
      1. Provide a Financial Overview: total income, total expenses, net savings/income, and monthly averages.
      2. Analyze Spending Patterns by category with percentages and trends.
      3. Identify the Top 3 expense categories with amounts and percentages.
      4. Compare Income sources versus Expenses.
      5. Calculate and comment on the Savings Rate.
      6. Highlight any Irregular or large transactions.
      7. Note Monthly Spending Trends.

      **Recommendations:**
      - Give 3-4 specific, actionable recommendations based on spending patterns.
      - Include both short-term and long-term financial goals.
      - Suggest budgeting strategies.
      - Provide personalized tips based on the summarized data.

      **Formatting Instructions:**
      - Use clear markdown with headers and subheaders.
      - Include specific amounts and percentages where relevant.
      - Use bullet points and numbered lists for clarity.
      - Maintain a professional yet encouraging tone.
      - Make insights data-driven and specific to the user's financial summary.

      **Response Format:**
      ${aiReportTemplate}
    `;

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    // The result object contains a 'response' with text method
    const text = result.response.text();

    res.status(200).json({ insights: text });

  } catch (error) {
    console.error('AI Insight Error:', error);
    res.status(500).json({ error: 'Failed to generate AI insights' });
  }
};
