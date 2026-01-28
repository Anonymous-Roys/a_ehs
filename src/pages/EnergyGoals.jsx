import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Zap, TrendingUp, Award, Plus, Trash2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const EnergyGoalsPage = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Monthly Solar Generation",
      target: 400,
      current: 314.8,
      unit: "kWh",
      deadline: "Feb 28, 2025",
      progress: 78.7,
      color: "from-yellow-400 to-orange-600",
      category: "generation",
    },
    {
      id: 2,
      name: "Reduce Grid Import",
      target: 50,
      current: 45.2,
      unit: "kWh",
      deadline: "Feb 28, 2025",
      progress: 90.4,
      color: "from-green-400 to-emerald-600",
      category: "consumption",
    },
    {
      id: 3,
      name: "Monthly Savings",
      target: 200,
      current: 156.43,
      unit: "$",
      deadline: "Feb 28, 2025",
      progress: 78.2,
      color: "from-blue-400 to-cyan-600",
      category: "savings",
    },
  ]);

  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    unit: "kWh",
    deadline: "",
  });

  const progressData = [
    { week: "Week 1", solar: 85, grid: 12, savings: 45 },
    { week: "Week 2", solar: 92, grid: 10, savings: 52 },
    { week: "Week 3", solar: 78, grid: 14, savings: 41 },
    { week: "Week 4", solar: 95, grid: 9, savings: 53 },
  ];

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.deadline) {
      const goal = {
        id: goals.length + 1,
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: parseFloat(newGoal.target) * 0.6,
        unit: newGoal.unit,
        deadline: newGoal.deadline,
        progress: 60,
        color: "from-purple-400 to-pink-600",
        category: "custom",
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: "", target: "", unit: "kWh", deadline: "" });
      setShowNewGoal(false);
    }
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return "text-green-500";
    if (progress >= 70) return "text-blue-500";
    if (progress >= 50) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Energy Goals & Targets
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Set and track your energy efficiency targets
              </p>
            </div>
            <motion.button
              onClick={() => setShowNewGoal(!showNewGoal)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              New Goal
            </motion.button>
          </div>
        </motion.div>

        {/* New Goal Form */}
        {showNewGoal && (
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Create New Goal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Goal name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Target value"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <select
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option>kWh</option>
                <option>$</option>
                <option>kg CO2</option>
              </select>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAddGoal}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
              >
                Add Goal
              </button>
              <button
                onClick={() => setShowNewGoal(false)}
                className="px-6 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Goals Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {goals.map((goal, idx) => (
            <motion.div
              key={goal.id}
              className={`bg-gradient-to-br ${goal.color} rounded-lg shadow-lg p-6 text-white overflow-hidden relative`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full"
                animate={{
                  x: [0, 10, 0],
                  y: [0, 5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{goal.name}</h3>
                    <p className="text-sm opacity-90">Due: {goal.deadline}</p>
                  </div>
                  <motion.button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium">
                      {goal.current.toFixed(1)} / {goal.target} {goal.unit}
                    </span>
                    <span className={`text-2xl font-bold ${getProgressColor(goal.progress)}`}>
                      {goal.progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 text-sm">
                  {goal.progress >= 90 && (
                    <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                      <Award size={14} />
                      <span>On Track</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Weekly Progress */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6"
            whileHover={{ shadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Weekly Progress
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(31, 41, 55, 0.95)",
                    border: "1px solid rgba(107, 114, 128, 0.3)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="solar" fill="#FFB624" name="Solar (kWh)" />
                <Bar dataKey="grid" fill="#6366F1" name="Grid (kWh)" />
                <Bar dataKey="savings" fill="#10B981" name="Savings ($)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Achievement Stats */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6"
            whileHover={{ shadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Award size={20} />
              Your Achievements
            </h3>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {[
                { icon: "🌞", title: "Solar Champion", desc: "Generated 300+ kWh this month" },
                { icon: "💰", title: "Money Saver", desc: "Saved $150+ this month" },
                { icon: "🌍", title: "Eco Warrior", desc: "Avoided 100kg of CO2" },
                { icon: "📈", title: "Trending Up", desc: "15% improvement over last month" },
              ].map((achievement, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <span className="text-3xl">{achievement.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border dark:border-slate-700 shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            💡 Tips to Achieve Your Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Schedule heavy loads during peak solar hours (10 AM - 3 PM)",
              "Keep battery charged during low generation periods",
              "Monitor real-time data and adjust consumption patterns",
            ].map((tip, idx) => (
              <motion.div
                key={idx}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * idx }}
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default EnergyGoalsPage;
