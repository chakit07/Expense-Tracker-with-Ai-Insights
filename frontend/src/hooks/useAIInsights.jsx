import axios from "axios";
import { useEffect, useState } from "react";

const useAIInsights = (token) => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    if (!token) {
      setError("No auth token found.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/ai/insights", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInsights(res.data.insights);
    } catch (err) {
      console.error("AI Insights fetch error:", err);
      setError("Failed to fetch AI insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { insights, loading, error, refetch: fetchInsights };
};

export default useAIInsights;
