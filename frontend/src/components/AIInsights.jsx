import { useEffect } from "react";
import toast from "react-hot-toast";
import useAIInsights from "../hooks/useAIInsights";

const AIInsights = () => {
  const { insights, loading, error, refetch } = useAIInsights();

  useEffect(() => {
    if (insights) {
      toast.success("AI insights generated successfully!");
    }
  }, [insights]);

  return (
    <div>
      <button
        onClick={refetch}
        disabled={loading}
        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded disabled:opacity-50 mb-4 transition-colors"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Analyzing Your Finances...
          </div>
        ) : (
          "Generate AI Summary"
        )}
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
