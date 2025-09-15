import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Calendar,
  IndianRupee,
  List,
  Percent,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AIInsights from "../components/AIInsights";
import BarChartComponent from "../components/charts/BarChartComponent";
import LineChartComponent from "../components/charts/LineChartComponent";
import PieChartComponent from "../components/charts/PieChartComponent";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionContext";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${color} text-white mr-4 shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {title === "Transactions"
              ? value
              : title === "Savings Rate"
              ? `${value}%`
              : `₹${value.toLocaleString("en-IN")}`}
          </p>
        </div>
      </div>
      {trend && (
        <div
          className={`flex items-center ${
            trend > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="text-sm font-medium ml-1">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { transactions } = useTransactions();
  const { currentUser } = useAuth();
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Get Firebase token
  useEffect(() => {
    const fetchToken = async () => {
      if (currentUser) {
        const t = await currentUser.getIdToken();
        setToken(t);
      }
    };
    fetchToken();
  }, [currentUser]);

  // Stats
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      balance: income - expense,
      income,
      expense,
      totalTransactions: transactions.length,
      savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
    };
  }, [transactions]);

  // Monthly data for charts
  const monthlyData = useMemo(() => {
    const dataByMonth = {};
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
      });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { name: month, income: 0, expense: 0 };
      }
      if (t.type === "income") {
        dataByMonth[month].income += t.amount;
      } else {
        dataByMonth[month].expense += t.amount;
      }
    });
    return Object.values(dataByMonth);
  }, [transactions]);

  // Category-wise expenses
  const categoryData = useMemo(() => {
    const dataByCategory = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!dataByCategory[t.category]) {
          dataByCategory[t.category] = { name: t.category, value: 0 };
        }
        dataByCategory[t.category].value += t.amount;
      });
    return Object.values(dataByCategory);
  }, [transactions]);

  // Top 3 spending categories
  const topCategories = useMemo(() => {
    return [...categoryData].sort((a, b) => b.value - a.value).slice(0, 3);
  }, [categoryData]);

  // Recent 5 transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  // Handler for "View All" button in Recent Transactions
  const handleViewAllTransactions = () => {
    navigate("/transactions");
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-100 text-lg">
              Here's your financial overview for{" "}
              {new Date().toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="hidden md:block">
            <Target className="w-16 h-16 text-blue-200 opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Balance"
          value={stats.balance}
          icon={IndianRupee}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Income"
          value={stats.income}
          icon={TrendingUp}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Total Expenses"
          value={stats.expense}
          icon={TrendingDown}
          color="bg-gradient-to-r from-red-500 to-red-600"
        />
        <StatCard
          title="Transactions"
          value={stats.totalTransactions}
          icon={Activity}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          title="Savings Rate"
          value={stats.savingsRate.toFixed(1)}
          icon={Percent}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Monthly Trends
            </h3>
          </div>
          <BarChartComponent data={monthlyData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Income vs Expenses
            </h3>
          </div>
          <LineChartComponent data={monthlyData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:col-span-2 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-3">
              <Percent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Expense Breakdown
            </h3>
          </div>
          <PieChartComponent data={categoryData} />
        </motion.div>
      </div>

      {/* Recent Transactions & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg mr-3">
                <List className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Transactions
              </h3>
            </div>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200">
              View All
            </button>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {recentTransactions.map((t, i) => (
                  <motion.div
                    key={t.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    {/* Left side: Category + Date */}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          t.type === "income" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {t.category}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(t.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Amount */}
                    <span
                      className={`text-lg font-bold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {t.amount.toLocaleString("en-IN")}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No transactions yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Start by adding your first transaction
              </p>
            </div>
          )}
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg mr-3">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Spending Categories
            </h3>
          </div>

          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {category.name}
                    </span>
                  </div>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    ₹{category.value.toLocaleString("en-IN")}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No expense data
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Add some expenses to see your top categories
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ✅ AI Insights now only needs token */}
      {token && <AIInsights token={token} />}
    </div>
  );
};

export default Dashboard;
