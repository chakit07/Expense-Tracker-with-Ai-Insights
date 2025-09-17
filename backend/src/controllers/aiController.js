const Transaction = require('../models/Transaction');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const aiReportTemplate = require('../templates/aiReportTemplate');

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// @desc    Get AI-powered financial insights
// @route   GET /api/ai/insights
// @access  Private
exports.getFinancialInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: 'desc' }).limit(50);

    if (transactions.length < 5) {
      return res.status(400).json({ error: 'Not enough transaction data for an analysis.' });
    }

    const prompt = `
      You are a financial expert and advisor. Analyze the following JSON transaction data for a user in Rupee symbol and provide clear, actionable financial insights.

      **Analysis Goals:**
      1. Provide a Financial Overview: total income, total expenses, net savings/income, and monthly averages.
      2. Analyze Spending Patterns by category with percentages and trends.
      3. Identify the Top 3 expense categories with amounts and percentages.
      4. Compare Income sources versus Expenses.
      5. Calculate and comment on the Savings Rate, if applicable.
      6. Highlight any Irregular or large transactions.
      7. Note Monthly Spending Trends.

      **Recommendations:**
      - Give 3-4 specific, actionable recommendations based on spending patterns.
      - Include both short-term and long-term financial goals.
      - Suggest budgeting strategies.
      - Provide personalized tips based on the transaction data.

      **Formatting Instructions:**
      - Use clear markdown with headers and subheaders.
      - Include specific amounts and percentages where relevant.
      - Use bullet points and numbered lists for clarity.
      - Maintain a professional yet encouraging tone.
      - Make insights data-driven and specific to the user's transaction history.

      **Transaction Data:**
      ${JSON.stringify(transactions)}

      **Response Format:**
      ${aiReportTemplate}
    `;

    const result = await model.generateContent(prompt);
    // The result object contains a 'response' with text method
    const text = result.response.text();

    res.status(200).json({ insights: text });

  } catch (error) {
    console.error('AI Insight Error:', error);
    res.status(500).json({ error: 'Failed to generate AI insights' });
  }
};
