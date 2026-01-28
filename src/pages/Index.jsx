import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PowerFlowSVG from "../components/PowerFlow3D";
import BatteryStatus from "../components/battery/BatteryStatus";
import SolarStatus from "../components/solar/SolarStatus-2";
import GridStatus from "../components/GridStatus";
import LoadStatus from "../components/LoadStatus";
import ControlPanel from "../components/ControlPanel";
import { Sun, Battery, Zap, Home, Wind } from "lucide-react";
import { Badge } from "../components/ui/badge";
import WeatherForecast from "../components/WeatherForecast";
import QuickStats from "../components/QuickStats";
import WindStatus from "../components/wind/WindStatus";
import Onboarding from "../components/Onboarding";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("SOLAR_HOME_GRID");
  const [autoMode, setAutoMode] = useState(false);
  const [simulatedHour, setSimulatedHour] = useState(6);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!autoMode) return;
  
    const autoModeSimulation = setInterval(() => {
      setSimulatedHour((prevHour) => {
        let nextHour = prevHour + 1;
        if (nextHour > 23) nextHour = 0;
  
        if (nextHour >= 6 && nextHour < 8) {
          setActiveMode("SOLAR_HOME_GRID");
        } else if (nextHour >= 8 && nextHour < 9) {
          setActiveMode("SOLAR_POWERHIVE_HOME");
        } else if (nextHour >= 9 && nextHour < 10) {
          setActiveMode("POWERHIVE_HOME");
        } else {
          setActiveMode("GRID_HOME");
          setTimeout(() => {
            setActiveMode("POWERHIVE_HOME");
          }, 76000);
        }
  
        return nextHour;
      });
    }, 55000);
  
    return () => clearInterval(autoModeSimulation);
  }, [autoMode]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.08,
        delayChildren: isMobile ? 0.05 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <motion.div
          className="flex flex-col items-center px-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mb-4" />
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white text-center">Loading Dashboard</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Onboarding onComplete={() => setShowOnboarding(false)} />

      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 sm:space-y-10 md:space-y-12"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5 rounded-3xl blur-3xl -z-10" />
            
            <div className="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 sm:p-8 md:p-12">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2 sm:mb-3">
                      Flux SOS
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                      Your intelligent energy management system. Maximize renewable energy, minimize grid dependence, and optimize every watt.
                    </p>
                  </motion.div>
                </div>

                {/* Status Badges */}
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Badge className="bg-gradient-to-r from-green-400 to-emerald-600 text-white border-0 px-4 py-2 text-sm font-semibold">
                      <Battery className="w-4 h-4 mr-2" />
                      Charging
                    </Badge>
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  >
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-600 text-white border-0 px-4 py-2 text-sm font-semibold">
                      <Zap className="w-4 h-4 mr-2" />
                      Solar Active
                    </Badge>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Energy Overview */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Energy Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {[
                {
                  label: "Solar Generation",
                  value: "4.2 kW",
                  change: "+12%",
                  icon: Sun,
                  color: "from-yellow-400 to-orange-600",
                  route: "/solar-details",
                },
                {
                  label: "Battery Status",
                  value: "83.3%",
                  change: "Charging",
                  icon: Battery,
                  color: "from-blue-400 to-cyan-600",
                  route: "/battery-details/battery-settings/",
                },
                {
                  label: "Grid Usage",
                  value: "1.2 kW",
                  change: "-8%",
                  icon: Zap,
                  color: "from-purple-400 to-pink-600",
                  route: "/analytics",
                },
                {
                  label: "Home Load",
                  value: "3.5 kW",
                  change: "Active",
                  icon: Home,
                  color: "from-green-400 to-emerald-600",
                  route: "/load-details",
                },
                {
                  label: "Wind Generation",
                  value: "1.8 kW",
                  change: "Active",
                  icon: Wind,
                  color: "from-cyan-400 to-blue-600",
                  route: "/analytics",
                },
              ].map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: isMobile ? 0 : -8, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-4 sm:p-6 transition cursor-pointer"
                    onClick={() => window.location.href = metric.route}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition duration-300`} />
                    
                    <div className="relative z-10">
                      <div className={`inline-flex p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${metric.color} text-white mb-3 sm:mb-4`}>
                        <Icon size={isMobile ? 18 : 20} />
                      </div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {metric.label}
                      </h3>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metric.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {metric.change}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Power Flow and Controls Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <motion.div
              whileHover={{ y: isMobile ? 0 : -4 }}
              transition={{ duration: 0.2 }}
              className="sm:col-span-2 lg:col-span-2"
            >
              <div className="h-full rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
                <PowerFlowSVG activeMode={activeMode} />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: isMobile ? 0 : -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 overflow-hidden p-4 sm:p-6">
                <ControlPanel
                  deviceId="device001"
                  activeMode={activeMode}
                  setActiveMode={setActiveMode}
                  autoMode={autoMode}
                  setAutoMode={setAutoMode}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Weather and Stats Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <motion.div
              whileHover={{ y: isMobile ? 0 : -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
                <WeatherForecast />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: isMobile ? 0 : -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
                <QuickStats />
              </div>
            </motion.div>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5 border border-white/20 dark:border-slate-700/50 p-6 sm:p-8 text-center"
          >
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()} • All systems operating normally
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
