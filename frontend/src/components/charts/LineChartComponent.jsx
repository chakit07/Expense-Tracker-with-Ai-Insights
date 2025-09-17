import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LineChartComponent = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item.name,
    Income: item.income,
    Expense: item.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
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
        <Line
          type="monotone"
          dataKey="Income"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="ease-out"
        />
        <Line
          type="monotone"
          dataKey="Expense"
          stroke="#ef4444"
          strokeWidth={3}
          dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
