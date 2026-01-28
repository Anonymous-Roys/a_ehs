import { motion } from "framer-motion";
import { Battery } from "lucide-react";

const AnimatedBatteryGauge = ({ level = 72, capacity = 13.5, isCharging = false }) => {
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (level / 100) * circumference;

  const getColor = () => {
    if (level > 80) return "from-green-400 to-green-600";
    if (level > 50) return "from-cyan-400 to-blue-600";
    if (level > 20) return "from-amber-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const getTextColor = () => {
    if (level > 80) return "text-green-600";
    if (level > 50) return "text-blue-600";
    if (level > 20) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-8">
      <div className="flex flex-col items-center">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Battery Status</h3>

        {/* Circular Gauge */}
        <div className="relative w-48 h-48 mb-8">
          {/* Background circle */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 220 220">
            <circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
              className="dark:stroke-slate-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              strokeWidth="8"
              stroke={`url(#gaugeGradient)`}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              animate={{ strokeDashoffset: strokeDashoffset }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={getColor().split(" ")[1]} />
                <stop offset="100%" stopColor={getColor().split(" ")[3]} />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className={`text-5xl font-bold ${getTextColor()}`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {Math.round(level)}%
            </motion.div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Charged</p>
          </div>

          {/* Charging Animation Indicator */}
          {isCharging && (
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-6 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                +
              </div>
            </motion.div>
          )}
        </div>

        {/* Battery Stats */}
        <motion.div
          className="w-full space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Capacity */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Capacity</span>
            <motion.span
              className="font-semibold text-gray-900 dark:text-white"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {(level / 100 * capacity).toFixed(1)} / {capacity} kWh
            </motion.span>
          </div>

          {/* Health */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Health</span>
            <motion.span
              className="font-semibold text-green-600"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              95%
            </motion.span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Status</span>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${isCharging ? "bg-green-500" : "bg-blue-500"}`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {isCharging ? "Charging" : "Discharging"}
              </span>
            </div>
          </div>

          {/* Efficiency */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Efficiency</span>
            <motion.span
              className="font-semibold text-gray-900 dark:text-white"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              98.2%
            </motion.span>
          </div>

          {/* Temperature */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Temperature</span>
            <motion.span
              className="font-semibold text-gray-900 dark:text-white"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            >
              28°C
            </motion.span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Charge Level</span>
            <span className={`text-xs font-semibold ${getTextColor()}`}>{Math.round(level)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${level}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBatteryGauge;
