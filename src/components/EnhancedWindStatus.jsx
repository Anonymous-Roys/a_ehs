import { motion } from "framer-motion";
import { Wind, TrendingUp } from "lucide-react";

const EnhancedWindStatus = ({ generation = 0.8, daily = 3.2, speed = 12 }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800 shadow-lg p-6 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      whileHover={{ scale: 1.02, shadow: "0 20px 40px rgba(59, 130, 246, 0.2)" }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 15, 0],
          y: [0, -8, 0],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Wind Generation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Real-time monitoring</p>
          </div>
          <motion.div
            className="p-3 bg-blue-400 rounded-full"
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wind size={24} className="text-white" />
          </motion.div>
        </div>

        {/* Main Power Display */}
        <motion.div
          className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700"
          animate={{ boxShadow: ["0 0 0 rgba(59, 130, 246, 0)", "0 0 20px rgba(59, 130, 246, 0.3)", "0 0 0 rgba(59, 130, 246, 0)"] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Current Output</p>
              <motion.p
                className="text-4xl font-bold text-blue-500"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {generation.toFixed(2)}
              </motion.p>
              <p className="text-sm text-gray-500 dark:text-gray-400">kW</p>
            </div>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="text-green-500" size={32} />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg p-3 border dark:border-slate-700"
            whileHover={{ scale: 1.05, translateY: -2 }}
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Daily Total</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{daily.toFixed(1)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">kWh</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg p-3 border dark:border-slate-700"
            whileHover={{ scale: 1.05, translateY: -2 }}
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Wind Speed</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{speed}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">km/h</p>
          </motion.div>
        </motion.div>

        {/* Turbine Status */}
        <motion.div
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            />
            <span className="text-sm text-blue-700 dark:text-blue-300">2/2 Turbines Active</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedWindStatus;
