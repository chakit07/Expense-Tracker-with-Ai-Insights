import { getIdToken } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import {
  addTransactionAPI,
  deleteTransactionAPI,
  fetchTransactionsAPI,
  updateTransactionAPI,
} from "../api/transactions";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from backend on mount or token change
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        setTransactions([]);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchTransactionsAPI(token);
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  const addTransaction = async (transaction) => {
    if (!token || !user) {
      console.error("Token or user not available");
      return;
    }
    try {
      // Refresh token before API call
      const freshToken = await getIdToken(user, true);
      const data = await addTransactionAPI(transaction, freshToken);
      setTransactions((prev) => [...prev, data.transaction]);
    } catch (error) {
      if (error.response) {
        console.error(
          "Failed to add transaction:",
          error.response.data,
          "Status:",
          error.response.status
        );
      } else {
        console.error("Failed to add transaction:", error.message);
      }
    }
  };

  const updateTransaction = async (id, transaction) => {
    if (!token) {
      console.error("Token not available");
      return;
    }
    try {
      const data = await updateTransactionAPI(id, transaction, token);
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? data.transaction : t))
      );
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  const deleteTransaction = async (id) => {
    if (!token) {
      console.error("Token not available");
      return;
    }
    try {
      await deleteTransactionAPI(id, token);
      setTransactions((prev) =>
        prev.filter((t) => t._id !== id && t.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
