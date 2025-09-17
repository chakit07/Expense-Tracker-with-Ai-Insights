import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BarChartComponent = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item.name,
    Income: item.income,
    Expense: item.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#888888" }}
          axisLine={{ stroke: "#888888" }}
        />
        <YAxis
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          tick={{ fontSize: 12, fill: "#888888" }}
          axisLine={{ stroke: "#888888" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            borderRadius: 10,
            color: "#fff",
            fontSize: 14,
          }}
          formatter={(value, name) => [
            `₹${value.toLocaleString("en-IN")}`,
            name,
          ]}
        />
        <Legend wrapperStyle={{ color: "#888888", fontSize: 12 }} />
        <Bar
          dataKey="Income"
          fill="url(#incomeGradient)"
          radius={[5, 5, 0, 0]}
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="ease-out"
        />
        <Bar
          dataKey="Expense"
          fill="url(#expenseGradient)"
          radius={[5, 5, 0, 0]}
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="ease-out"
        />
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#dc2626" stopOpacity={0.8} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
