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
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BarChartComponent from "../components/charts/BarChartComponent";
import LineChartComponent from "../components/charts/LineChartComponent";
import PieChartComponent from "../components/charts/PieChartComponent";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
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
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

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

  // Monthly data for charts (last 12 months)
  const monthlyData = useMemo(() => {
    const dataByMonth = {};
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 11); // last 12 months including current

    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (date >= startDate && date <= today) {
        const monthKey = date.toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        });
        if (!dataByMonth[monthKey]) {
          dataByMonth[monthKey] = { name: monthKey, income: 0, expense: 0 };
        }
        if (t.type === "income") {
          dataByMonth[monthKey].income += t.amount;
        } else {
          dataByMonth[monthKey].expense += t.amount;
        }
      }
    });

    // Sort months ascending
    const sortedMonths = Object.keys(dataByMonth).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    return sortedMonths.map((month) => dataByMonth[month]);
  }, [transactions]);

  // Daily data for line chart (last 30 days)
  const dailyData = useMemo(() => {
    const dataByDate = {};
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29); // last 30 days including today

    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (date >= startDate && date <= today) {
        const dateKey = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
        if (!dataByDate[dateKey]) {
          dataByDate[dateKey] = { name: dateKey, income: 0, expense: 0 };
        }
        if (t.type === "income") {
          dataByDate[dateKey].income += t.amount;
        } else {
          dataByDate[dateKey].expense += t.amount;
        }
      }
    });

    // Sort dates ascending
    const sortedDates = Object.keys(dataByDate).sort((a, b) => {
      const dateA = new Date(a + " 2023"); // add year for sorting
      const dateB = new Date(b + " 2023");
      return dateA - dateB;
    });

    return sortedDates.map((date) => dataByDate[date]);
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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: -40, scale: 0.9, rotate: -5 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: {
              duration: 1.5,
              ease: "easeOut",
              staggerChildren: 0.5,
            },
          },
        }}
        className={`relative overflow-hidden rounded-2xl p-8 shadow-xl ${
          theme === "light"
            ? "text-gray-900 animate-sunlight"
            : "text-white animate-night-sky"
        }`}
      >
        {/* Subtle shimmer animation */}
        <motion.div
          animate={{ x: ["-120%", "120%"], opacity: [0, 0.3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full bg-white transform skew-x-12"
          style={{ pointerEvents: "none" }}
        />
        {/* Floating particles */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.5 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {[...Array(15)].map((_, i) => (
            <motion.span
              key={i}
              className={`absolute rounded-full ${
                theme === "light" ? "bg-yellow-400" : "bg-yellow-200"
              }`}
              style={{
                width: theme === "light" ? 8 : 4,
                height: theme === "light" ? 8 : 4,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: "blur(1px)",
              }}
              animate={
                theme === "light"
                  ? {
                      y: [0, -15, 0],
                      opacity: [0.4, 1, 0.4],
                    }
                  : {
                      opacity: [0.2, 1, 0.2, 0.8, 0.2],
                    }
              }
              transition={{
                repeat: Infinity,
                duration:
                  theme === "light"
                    ? 5 + Math.random() * 2
                    : 2 + Math.random() * 1,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <motion.h1
              className="mb-2 text-4xl font-extrabold tracking-wide drop-shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {transactions.length === 0
                ? "Welcome to Expense Tracker! Let's start your financial journey."
                : "Welcome back, ready to conquer your finances?"}
            </motion.h1>
            <motion.p
              className="max-w-md leading-relaxed text-blue-100 text-lg drop-shadow-md"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {transactions.length === 0
                ? "Track your expenses, set budgets, and achieve your financial goals with ease. Add your first transaction to get started!"
                : `Here's your personalized financial snapshot for ${new Date().toLocaleDateString(
                    "en-IN",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}. Keep up the great work and keep pushing towards your goals!`}
            </motion.p>
          </div>
          <motion.div
            className="hidden md:block"
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Target className="w-20 h-20 text-blue-300 opacity-90 drop-shadow-lg" />
          </motion.div>
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
              Daily Income vs Expenses
            </h3>
          </div>
          <LineChartComponent data={dailyData} />
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
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
