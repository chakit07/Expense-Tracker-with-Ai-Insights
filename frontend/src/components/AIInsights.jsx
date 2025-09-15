import axios from "axios";
import { useEffect, useState } from "react";

const AIInsights = ({ token }) => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    if (!token) {
      setError("User not authenticated.");
      return;
    }
    setLoading(true);
    setError("");
    setInsights("");
    try {
      const API_URL = process.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.get(`${API_URL}/api/ai/insights`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInsights(response.data.insights);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to get insights. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [token]);

  return (
    <div>
      <button
        onClick={fetchInsights}
        disabled={loading || !token}
        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded disabled:opacity-50 mb-4 transition-colors"
      >
        {loading ? "Analyzing Your Finances..." : "Generate AI Summary"}
      </button>
      {error && (
        <p className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded mb-4">
          {error}
        </p>
      )}
      {insights && (
        <div className="mt-4 p-4 border rounded bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 prose prose-sm dark:prose-invert max-w-none">
          <pre
            className="text-gray-900 dark:text-gray-100"
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          >
            {insights}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
