import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Calendar, CheckCircle, AlertCircle, Plus, Trash2, Clock } from "lucide-react";

const MaintenanceTrackerPage = () => {
  const [maintenance, setMaintenance] = useState([
    {
      id: 1,
      name: "Solar Panel Cleaning",
      component: "Solar Panels",
      lastCompleted: "Dec 15, 2024",
      nextDue: "Feb 15, 2025",
      daysLeft: 18,
      status: "upcoming",
      priority: "medium",
      frequency: "Every 2 months",
      estimatedTime: "2 hours",
      cost: "$150",
    },
    {
      id: 2,
      name: "Battery Health Check",
      component: "Battery System",
      lastCompleted: "Jan 10, 2025",
      nextDue: "Apr 10, 2025",
      daysLeft: 72,
      status: "completed",
      priority: "high",
      frequency: "Quarterly",
      estimatedTime: "1.5 hours",
      cost: "$200",
    },
    {
      id: 3,
      name: "Inverter Firmware Update",
      component: "Inverter",
      lastCompleted: "Nov 30, 2024",
      nextDue: "Jan 28, 2025",
      daysLeft: 0,
      status: "overdue",
      priority: "high",
      frequency: "As needed",
      estimatedTime: "30 minutes",
      cost: "Free",
    },
    {
      id: 4,
      name: "Filter Replacement",
      component: "Wind Turbine",
      lastCompleted: "Jan 20, 2025",
      nextDue: "Jul 20, 2025",
      daysLeft: 173,
      status: "upcoming",
      priority: "low",
      frequency: "Every 6 months",
      estimatedTime: "1 hour",
      cost: "$120",
    },
  ]);

  const [showNewMaintenance, setShowNewMaintenance] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    name: "",
    component: "",
    frequency: "",
    priority: "medium",
    estimatedTime: "",
    cost: "",
  });

  const handleAddMaintenance = () => {
    if (newMaintenance.name && newMaintenance.component && newMaintenance.frequency) {
      const maintenance_item = {
        id: Math.max(...maintenance.map((m) => m.id), 0) + 1,
        ...newMaintenance,
        lastCompleted: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        nextDue: "To be scheduled",
        daysLeft: Math.floor(Math.random() * 90 + 10),
        status: "scheduled",
      };

      setMaintenance([...maintenance, maintenance_item]);
      setNewMaintenance({
        name: "",
        component: "",
        frequency: "",
        priority: "medium",
        estimatedTime: "",
        cost: "",
      });
      setShowNewMaintenance(false);
    }
  };

  const deleteMaintenance = (id) => {
    setMaintenance(maintenance.filter((m) => m.id !== id));
  };

  const completeMaintenance = (id) => {
    setMaintenance(
      maintenance.map((m) =>
        m.id === id
          ? {
              ...m,
              status: "completed",
              lastCompleted: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            }
          : m
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "overdue":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300";
      case "upcoming":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300";
      case "completed":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "overdue":
        return <AlertCircle size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const upcomingCount = maintenance.filter((m) => m.status === "upcoming").length;
  const overdueCount = maintenance.filter((m) => m.status === "overdue").length;
  const completedCount = maintenance.filter((m) => m.status === "completed").length;
  const totalCost = maintenance.reduce(
    (sum, m) => sum + (parseFloat(m.cost) || 0),
    0
  );

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
                Maintenance Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Schedule and track system maintenance
              </p>
            </div>
            <motion.button
              onClick={() => setShowNewMaintenance(!showNewMaintenance)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Add Maintenance
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
              label: "Total Tasks",
              value: maintenance.length,
              color: "from-blue-500 to-blue-600",
              icon: Wrench,
            },
            {
              label: "Overdue",
              value: overdueCount,
              color: "from-red-500 to-red-600",
              icon: AlertCircle,
            },
            {
              label: "Upcoming",
              value: upcomingCount,
              color: "from-yellow-500 to-orange-600",
              icon: Calendar,
            },
            {
              label: "Completed",
              value: completedCount,
              color: "from-green-500 to-emerald-600",
              icon: CheckCircle,
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
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon size={32} className="opacity-60" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* New Maintenance Form */}
        {showNewMaintenance && (
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Schedule Maintenance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Maintenance name"
                value={newMaintenance.name}
                onChange={(e) =>
                  setNewMaintenance({ ...newMaintenance, name: e.target.value })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Component/System"
                value={newMaintenance.component}
                onChange={(e) =>
                  setNewMaintenance({
                    ...newMaintenance,
                    component: e.target.value,
                  })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Frequency (e.g., Every 3 months)"
                value={newMaintenance.frequency}
                onChange={(e) =>
                  setNewMaintenance({
                    ...newMaintenance,
                    frequency: e.target.value,
                  })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Estimated time"
                value={newMaintenance.estimatedTime}
                onChange={(e) =>
                  setNewMaintenance({
                    ...newMaintenance,
                    estimatedTime: e.target.value,
                  })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Cost"
                value={newMaintenance.cost}
                onChange={(e) =>
                  setNewMaintenance({ ...newMaintenance, cost: e.target.value })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              <select
                value={newMaintenance.priority}
                onChange={(e) =>
                  setNewMaintenance({
                    ...newMaintenance,
                    priority: e.target.value,
                  })
                }
                className="px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAddMaintenance}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowNewMaintenance(false)}
                className="px-6 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Maintenance List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {maintenance.map((item, idx) => (
            <motion.div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          item.status
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 opacity-70">
                          Component
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.component}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 opacity-70">
                          Frequency
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.frequency}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 opacity-70">
                          Estimated Time
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.estimatedTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 opacity-70">
                          Cost
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.cost}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mt-4 pt-4 border-t dark:border-slate-700 flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Last Completed
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.lastCompleted}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Next Due
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.nextDue}
                        </p>
                      </div>
                      {item.daysLeft > 0 && (
                        <motion.div
                          className="ml-auto px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                            {item.daysLeft} days left
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t dark:border-slate-700">
                  {item.status !== "completed" && (
                    <motion.button
                      onClick={() => completeMaintenance(item.id)}
                      className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition"
                      whileHover={{ scale: 1.05 }}
                    >
                      Mark Complete
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => deleteMaintenance(item.id)}
                    className="ml-auto p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 rounded-lg transition"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Card */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border dark:border-slate-700 shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Maintenance Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Annual Maintenance Cost
              </p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                ${totalCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                System Health Score
              </p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  95%
                </p>
                <motion.div
                  className="text-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  ✓
                </motion.div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Next Critical Maintenance
              </p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                Inverter Update (Overdue)
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MaintenanceTrackerPage;
