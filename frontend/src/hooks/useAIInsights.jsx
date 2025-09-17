import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const useAIInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    if (!user) {
      setError("No authenticated user found.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await axios.get(`${API_URL}/api/ai/insights`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInsights(res.data.insights);
    } catch (err) {
      console.error("AI Insights fetch error:", err);
      if (err.response && err.response.status === 400) {
        setError(err.response.data.error || "Bad Request");
      } else {
        setError("Failed to fetch AI insights.");
      }
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
