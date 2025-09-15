import { Trash2 } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";

const TransactionList = () => {
  const { transactions, deleteTransaction } = useTransactions();

  // Group transactions by date for a cleaner UI
  const groupedTransactions = transactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {});

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">
          No transactions yet. Add one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([date, transactionsOnDate]) => (
        <div key={date}>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {date}
          </h3>
          <ul className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
            {transactionsOnDate.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between p-4 group"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {t.category}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`font-semibold ${
                      t.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"} ₹
                    {t.amount.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                    aria-label="Delete transaction"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
