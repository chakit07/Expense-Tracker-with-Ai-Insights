import AIInsights from "../components/AIInsights";

const AIInsightsPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          AI-Powered Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get personalized financial insights and recommendations based on your
          transaction data using advanced AI analysis.
        </p>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <AIInsights />
      </div>
    </div>
  );
};

export default AIInsightsPage;
