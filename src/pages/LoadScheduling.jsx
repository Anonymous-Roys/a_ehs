import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Trash2, Plus, Edit2, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const LoadSchedulingPage = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: "Water Heater",
      startTime: "10:00",
      endTime: "12:00",
      power: 2.5,
      enabled: true,
      priority: "high",
      condition: "Solar Available",
      recurring: "Daily",
    },
    {
      id: 2,
      name: "Washing Machine",
      startTime: "14:00",
      endTime: "15:30",
      power: 1.8,
      enabled: true,
      priority: "medium",
      condition: "Solar Available",
      recurring: "3x Weekly",
    },
    {
      id: 3,
      name: "EV Charging",
      startTime: "16:00",
      endTime: "22:00",
      power: 3.2,
      enabled: false,
      priority: "high",
      condition: "Grid or Solar",
      recurring: "Daily",
    },
  ]);

  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    startTime: "",
    endTime: "",
    power: "",
    priority: "medium",
    condition: "Solar Available",
    recurring: "Daily",
  });

  const hourlyData = [
    { hour: "6 AM", solar: 0.5, home: 0.8, scheduled: 0 },
    { hour: "9 AM", solar: 2.0, home: 1.2, scheduled: 0 },
    { hour: "12 PM", solar: 3.5, home: 1.5, scheduled: 2.5 },
    { hour: "3 PM", solar: 3.0, home: 1.3, scheduled: 1.8 },
    { hour: "6 PM", solar: 1.0, home: 2.0, scheduled: 3.2 },
    { hour: "9 PM", solar: 0, home: 1.5, scheduled: 0 },
    { hour: "12 AM", solar: 0, home: 0.5, scheduled: 0 },
  ];

  const handleAddSchedule = () => {
    if (
      newSchedule.name &&
      newSchedule.startTime &&
      newSchedule.endTime &&
      newSchedule.power
    ) {
      const schedule = {
        id: Math.max(...schedules.map((s) => s.id), 0) + 1,
        ...newSchedule,
        power: parseFloat(newSchedule.power),
        enabled: true,
      };
      setSchedules([...schedules, schedule]);
      setNewSchedule({
        name: "",
        startTime: "",
        endTime: "",
        power: "",
        priority: "medium",
        condition: "Solar Available",
        recurring: "Daily",
      });
      setShowNewSchedule(false);
    }
  };

  const toggleSchedule = (id) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "medium":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      default:
        return "";
    }
  };

  const totalScheduledPower = schedules
    .filter((s) => s.enabled)
    .reduce((sum, s) => sum + s.power, 0);

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
                Load Scheduling
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Optimize energy usage by scheduling loads during peak generation
              </p>
            </div>
            <motion.button
              onClick={() => setShowNewSchedule(!showNewSchedule)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Schedule Load
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            {
              label: "Total Scheduled",
              value: totalScheduledPower.toFixed(1),
              unit: "kW",
              color: "from-blue-500 to-blue-600",
              icon: Zap,
            },
            {
              label: "Active Schedules",
              value: schedules.filter((s) => s.enabled).length,
              unit: "Loads",
              color: "from-green-500 to-emerald-600",
              icon: Check,
            },
            {
              label: "Est. Daily Savings",
              value: (totalScheduledPower * 5.2).toFixed(2),
              unit: "$",
              color: "from-green-500 to-teal-600",
              icon: Zap,
            },
            {
              label: "Peak Hour",
              value: "12 PM",
              unit: "Optimal",
              color: "from-yellow-500 to-orange-600",
              icon: Clock,
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                className={`bg-gradient-to-br ${stat.color} rounded-lg shadow-lg p-6 text-white overflow-hidden relative`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full"
                  animate={{
                    x: [0, 10, 0],
                    y: [0, 5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon size={32} className="opacity-60" />
                  </div>
                  <p className="text-xs opacity-75 mt-2">{stat.unit}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* New Schedule Form */}
        {showNewSchedule && (
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Add New Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Load name"
                value={newSchedule.name}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, name: e.target.value })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <input
                type="time"
                value={newSchedule.startTime}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, startTime: e.target.value })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <input
                type="time"
                value={newSchedule.endTime}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, endTime: e.target.value })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Power (kW)"
                value={newSchedule.power}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, power: e.target.value })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                value={newSchedule.priority}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, priority: e.target.value })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select
                value={newSchedule.condition}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, condition: e.target.value })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option>Solar Available</option>
                <option>Battery Available</option>
                <option>Grid or Solar</option>
                <option>Always</option>
              </select>
              <select
                value={newSchedule.recurring}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, recurring: e.target.value })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option>Daily</option>
                <option>3x Weekly</option>
                <option>Weekly</option>
                <option>Once</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAddSchedule}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
              >
                Add Schedule
              </button>
              <button
                onClick={() => setShowNewSchedule(false)}
                className="px-6 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Schedules List */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg mb-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border-b dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Scheduled Loads
            </h3>
          </div>

          <motion.div
            className="divide-y dark:divide-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {schedules.map((schedule, idx) => (
              <motion.div
                key={schedule.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {schedule.name}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                          schedule.priority
                        )}`}
                      >
                        {schedule.priority.charAt(0).toUpperCase() +
                          schedule.priority.slice(1)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {schedule.recurring}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <p className="text-xs mb-1 opacity-70">Time</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs mb-1 opacity-70">Power</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {schedule.power} kW
                        </p>
                      </div>
                      <div>
                        <p className="text-xs mb-1 opacity-70">Est. Savings</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${(schedule.power * 0.2).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs mb-1 opacity-70">Condition</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {schedule.condition}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        schedule.enabled
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-600"
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {schedule.enabled ? "Enabled" : "Disabled"}
                    </motion.button>
                    <motion.button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Energy Availability Chart */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Hourly Energy Availability
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#6b7280" />
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
              <Bar dataKey="solar" fill="#FFB624" name="Solar (kW)" />
              <Bar dataKey="scheduled" fill="#3B82F6" name="Scheduled (kW)" />
              <Bar dataKey="home" fill="#10B981" name="Home Use (kW)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </main>
    </div>
  );
};

export default LoadSchedulingPage;
