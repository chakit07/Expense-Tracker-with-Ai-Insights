import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTransactions } from "../context/TransactionContext";
import toast from "react-hot-toast";

const TransactionForm = ({ isOpen, onClose, editingTransaction }) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        category: editingTransaction.category,
        amount: editingTransaction.amount.toString(),
        date: new Date(editingTransaction.date).toISOString().slice(0, 10),
      });
    } else {
      setFormData({
        type: "expense",
        category: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
      });
    }
  }, [editingTransaction]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData((prev) => ({ ...prev, [name]: value, category: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountValue = parseFloat(formData.amount);

    // ✅ Validation
    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    setLoading(true);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, {
          ...formData,
          amount: amountValue,
        });
        toast.success("Transaction updated successfully!");
      } else {
        await addTransaction({
          ...formData,
          amount: amountValue,
        });
        toast.success("Transaction added successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Failed to add transaction:", error);
      toast.error("Something went wrong while saving transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-lg relative transition-shadow duration-300 hover:shadow-3xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {editingTransaction ? "Edit Transaction" : "New Transaction"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-md p-2 transition-shadow duration-300 focus:shadow-lg"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-md p-2 transition-shadow duration-300 focus:shadow-lg"
            >
              <option value="">Select a category</option>
              {formData.type === "income" ? (
                <>
                  <option value="💰 Salary">💰 Salary</option>
                  <option value="💻 Freelance">💻 Freelance</option>
                  <option value="📈 Investment">📈 Investment</option>
                  <option value="🎁 Gift">🎁 Gift</option>
                  <option value="🏆 Bonus">🏆 Bonus</option>
                  <option value="📝 Other Income">📝 Other Income</option>
                </>
              ) : (
                <>
                  <option value="🍕 Food">🍕 Food</option>
                  <option value="🚗 Transportation">🚗 Transportation</option>
                  <option value="🎬 Entertainment">🎬 Entertainment</option>
                  <option value="🛍️ Shopping">🛍️ Shopping</option>
                  <option value="💡 Bills">💡 Bills</option>
                  <option value="🏥 Healthcare">🏥 Healthcare</option>
                  <option value="📚 Education">📚 Education</option>
                  <option value="✈️ Travel">✈️ Travel</option>
                  <option value="🏠 Rent">🏠 Rent</option>
                  <option value="📱 Phone">📱 Phone</option>
                  <option value="📝 Other">📝 Other</option>
                </>
              )}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-md p-2 transition-shadow duration-300 focus:shadow-lg"
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-md p-2 transition-shadow duration-300 focus:shadow-lg"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg hover:from-blue-700 hover:to-purple-800 disabled:opacity-50 transition-all"
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto text-white"
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
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : editingTransaction ? (
                "Update"
              ) : (
                "Save"
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TransactionForm;
