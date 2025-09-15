import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Edit3,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import TransactionForm from "./TransactionForm";

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { transactions, deleteTransaction } = useTransactions();

  // Separate income and expense transactions
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  // Handle edit
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Card for each transaction type
  const renderCard = (title, data, color, Icon, delay = 0) => (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-lg font-semibold flex items-center gap-2 ${color}`}
        >
          <Icon className="w-5 h-5" /> {title}
        </h2>
        <span className="text-sm text-gray-500">
          {data.length} {title.toLowerCase()}
        </span>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No {title.toLowerCase()} yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((t) => (
            <motion.li
              key={t._id || t.id}
              className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 transition"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Left: category + date */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white">
                  {t.category}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(t.date).toLocaleDateString("en-IN")}
                </span>
              </div>

              {/* Right: amount + actions */}
              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}₹
                  {t.amount.toLocaleString("en-IN")}
                </span>

                <motion.button
                  onClick={() => handleEdit(t)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Edit3 className="w-4 h-4 text-blue-500" />
                </motion.button>
                <motion.button
                  onClick={() => deleteTransaction(t._id || t.id)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </motion.button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Transactions
        </h1>
        <motion.button
          onClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Transaction
        </motion.button>
      </div>

      {/* Cards for income + expense */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderCard(
          "Income Transactions",
          incomeTransactions,
          "text-green-600 dark:text-green-400",
          ArrowUpCircle,
          0
        )}
        {renderCard(
          "Expense Transactions",
          expenseTransactions,
          "text-red-600 dark:text-red-400",
          ArrowDownCircle,
          0.2
        )}
      </div>

      {/* Modal Form (for add + edit) */}
      <TransactionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTransaction={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
