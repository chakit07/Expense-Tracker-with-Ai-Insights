import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
      <XAxis dataKey="name" stroke="#888888" />
      <YAxis stroke="#888888" />
      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '0.5rem' }} />
      <Legend />
      <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
      <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export default LineChartComponent;