import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Home, Battery, Zap, Cloud, Wind } from "lucide-react";

const AnimatedEnergyFlow = () => {
  const [batteryLevel, setBatteryLevel] = useState(72);
  const [solarPower, setSolarPower] = useState(2.4);
  const [homePower, setHomePower] = useState(1.7);
  const [gridPower, setGridPower] = useState(0.5);
  const [flowDirection, setFlowDirection] = useState("import");
  const [timeOfDay, setTimeOfDay] = useState("day");

  useEffect(() => {
    const interval = setInterval(() => {
      setSolarPower(Math.max(0, 2.4 + (Math.random() - 0.5) * 0.4));
      setHomePower(Math.max(0.2, 1.7 + (Math.random() - 0.5) * 0.3));
      setBatteryLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 2)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Animated particles component
  const EnergyParticles = ({ from, to, color, intensity = 1 }) => {
    const particles = Array.from({ length: Math.ceil(intensity * 5) }, (_, i) => (
      <motion.div
        key={i}
        className={`absolute w-2 h-2 rounded-full ${color}`}
        initial={{ 
          x: from.x, 
          y: from.y,
          opacity: 1,
          scale: 1
        }}
        animate={{ 
          x: to.x, 
          y: to.y,
          opacity: 0,
          scale: 0.5
        }}
        transition={{
          duration: 2,
          delay: i * 0.1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ));
    return particles;
  };

  const getBackgroundGradient = () => {
    switch(timeOfDay) {
      case "sunset":
        return "from-amber-50 via-orange-50 to-slate-100 dark:from-amber-900/30 dark:via-orange-900/20 dark:to-slate-900";
      case "night":
        return "from-slate-900 via-blue-900/40 to-slate-900 dark:from-slate-900 dark:via-blue-900/50 dark:to-slate-900";
      default:
        return "from-blue-50 via-cyan-50 to-slate-100 dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-slate-900";
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getBackgroundGradient()} rounded-lg border dark:border-slate-800 shadow-lg mb-6 overflow-hidden p-8 relative`}>
      {/* Background animated elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, 10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-400 rounded-full blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Energy Flow</h3>
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-yellow-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Solar</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-blue-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Battery</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Home</span>
            </div>
          </motion.div>
        </div>

        {/* SVG Energy Flow Diagram */}
        <svg className="w-full h-64 mb-8" viewBox="0 0 1000 300">
          {/* Solar Node */}
          <g>
            <motion.circle
              cx="100"
              cy="150"
              r="50"
              fill="url(#solarGradient)"
              animate={{ r: [50, 55, 50] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="100" y="165" textAnchor="middle" className="text-sm font-bold fill-white">Solar</text>
            <motion.text
              x="100"
              y="195"
              textAnchor="middle"
              className="text-lg font-bold fill-yellow-500"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {solarPower.toFixed(1)} kW
            </motion.text>
          </g>

          {/* Battery Node */}
          <g>
            <motion.circle
              cx="500"
              cy="100"
              r="50"
              fill="url(#batteryGradient)"
              animate={{ r: [50, 55, 50] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            />
            <text x="500" y="105" textAnchor="middle" className="text-sm font-bold fill-white">Battery</text>
            <motion.text
              x="500"
              y="135"
              textAnchor="middle"
              className="text-lg font-bold fill-blue-500"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            >
              {batteryLevel.toFixed(0)}%
            </motion.text>
          </g>

          {/* Home Node */}
          <g>
            <motion.circle
              cx="900"
              cy="150"
              r="50"
              fill="url(#homeGradient)"
              animate={{ r: [50, 55, 50] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            />
            <text x="900" y="165" textAnchor="middle" className="text-sm font-bold fill-white">Home</text>
            <motion.text
              x="900"
              y="195"
              textAnchor="middle"
              className="text-lg font-bold fill-green-500"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            >
              {homePower.toFixed(1)} kW
            </motion.text>
          </g>

          {/* Connecting Lines with Gradient */}
          <defs>
            <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB624" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
            <linearGradient id="batteryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
            <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFB624" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFB624" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFB624" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Animated Flow Lines */}
          <motion.line
            x1="150"
            y1="150"
            x2="450"
            y2="100"
            stroke="url(#flowGradient)"
            strokeWidth="4"
            animate={{ strokeDasharray: [10, 5], strokeDashoffset: [0, -15] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          />

          <motion.line
            x1="550"
            y1="100"
            x2="850"
            y2="150"
            stroke="url(#flowGradient)"
            strokeWidth="4"
            animate={{ strokeDasharray: [10, 5], strokeDashoffset: [0, -15] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear", delay: 0.1 }}
          />

          {/* Additional connection line */}
          <motion.line
            x1="150"
            y1="150"
            x2="850"
            y2="150"
            stroke="url(#flowGradient)"
            strokeWidth="3"
            opacity="0.5"
            animate={{ strokeDasharray: [10, 5], strokeDashoffset: [0, -15] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "linear", delay: 0.2 }}
          />
        </svg>

        {/* Energy Balance Stats */}
        <motion.div
          className="grid grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border dark:border-slate-700"
            whileHover={{ scale: 1.05, shadow: "0 20px 25px rgba(0, 0, 0, 0.1)" }}
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Solar Gen</p>
            <p className="text-2xl font-bold text-yellow-500">{solarPower.toFixed(1)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">kW</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border dark:border-slate-700"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Battery</p>
            <p className="text-2xl font-bold text-blue-500">{batteryLevel.toFixed(0)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">%</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border dark:border-slate-700"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Home Cons</p>
            <p className="text-2xl font-bold text-green-500">{homePower.toFixed(1)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">kW</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border dark:border-slate-700"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Grid Flow</p>
            <p className={`text-2xl font-bold ${flowDirection === "import" ? "text-red-500" : "text-green-500"}`}>
              {gridPower.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{flowDirection}</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedEnergyFlow;
