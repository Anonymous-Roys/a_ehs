import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Leaf, Calendar, BarChart3, PieChart } from "lucide-react";
import { LineChart, Line, AreaChart, Area, PieChart as PieChartComponent, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CostSavingsDashboard = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [savingsData, setSavingsData] = useState([]);
  const [costBreakdown, setCostBreakdown] = useState([
    { name: "Solar Saved", value: 156, color: "#FFB624" },
    { name: "Battery Used", value: 89, color: "#0EA5E9" },
    { name: "Grid Import", value: 45, color: "#6366F1" },
  ]);

  useEffect(() => {
    // Generate sample data for visualization
    const generateData = () => {
      const data = [];
      for (let i = 0; i < 30; i++) {
        data.push({
          day: `Day ${i + 1}`,
          solarSavings: Math.random() * 50 + 30,
          gridCost: Math.random() * 30 + 10,
          netSavings: Math.random() * 40 + 20,
        });
      }
      return data;
    };

    setSavingsData(generateData());
  }, [timeRange]);

  const stats = [
    {
      label: "Monthly Savings",
      value: "$156.43",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Solar Generated",
      value: "314.8 kWh",
      change: "+8.3%",
      icon: TrendingUp,
      color: "from-yellow-500 to-orange-600",
    },
    {
      label: "CO2 Avoided",
      value: "125.4 kg",
      change: "+15.2%",
      icon: Leaf,
      color: "from-green-400 to-teal-600",
    },
    {
      label: "Grid Usage",
      value: "45.2 kWh",
      change: "-22.1%",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Cost & Savings Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your energy savings and costs over time
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                className={`bg-gradient-to-br ${stat.color} rounded-lg shadow-lg p-6 text-white overflow-hidden relative group`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full"
                  animate={{
                    x: [0, 20, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium opacity-90">{stat.label}</h3>
                    <Icon size={24} className="opacity-80" />
                  </div>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-xs opacity-75">
                    <span className="text-green-200">{stat.change}</span> from last month
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Savings Trend Chart */}
          <motion.div
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6"
            whileHover={{ shadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Daily Savings Trend
              </h3>
              <div className="flex gap-2">
                {["week", "month", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      timeRange === range
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={savingsData}>
                <defs>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB624" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FFB624" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(31, 41, 55, 0.95)",
                    border: "1px solid rgba(107, 114, 128, 0.3)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="solarSavings"
                  stroke="#FFB624"
                  fillOpacity={1}
                  fill="url(#colorSolar)"
                  name="Solar Savings"
                />
                <Area
                  type="monotone"
                  dataKey="netSavings"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorNet)"
                  name="Net Savings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Cost Breakdown */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6"
            whileHover={{ shadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <PieChart size={20} />
              Cost Breakdown
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChartComponent>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(31, 41, 55, 0.95)",
                    border: "1px solid rgba(107, 114, 128, 0.3)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChartComponent>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {costBreakdown.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Monthly Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Usage
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Cost
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Savings
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    category: "Solar Generation",
                    usage: "314.8 kWh",
                    cost: "-$52.45",
                    savings: "$52.45",
                  },
                  {
                    category: "Battery Discharge",
                    usage: "89.2 kWh",
                    cost: "-$14.87",
                    savings: "$14.87",
                  },
                  {
                    category: "Grid Import",
                    usage: "45.2 kWh",
                    cost: "$15.23",
                    savings: "-",
                  },
                  {
                    category: "Total",
                    usage: "449.2 kWh",
                    cost: "-$51.09",
                    savings: "$67.32",
                  },
                ].map((row, idx) => (
                  <motion.tr
                    key={idx}
                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {row.category}
                    </td>
                    <td className="text-right py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {row.usage}
                    </td>
                    <td className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {row.cost}
                    </td>
                    <td className="text-right py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">
                      {row.savings}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CostSavingsDashboard;
