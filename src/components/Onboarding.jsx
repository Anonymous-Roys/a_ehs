import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Battery,
  Zap,
  TrendingUp,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const seen = localStorage.getItem("powerhive_onboarding");
    if (seen) {
      setHasSeenOnboarding(true);
      onComplete();
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("powerhive_onboarding", "true");
    setHasSeenOnboarding(true);
    onComplete();
  };

  const steps = [
    {
      icon: Sun,
      title: "Monitor Your Energy",
      description:
        "Track real-time solar generation, battery status, and home consumption with beautiful visualizations.",
      color: "from-yellow-400 to-orange-600",
      highlight: "Solar Generation",
    },
    {
      icon: Battery,
      title: "Optimize Storage",
      description:
        "Maximize your battery efficiency by scheduling loads during peak solar hours and managing power flow.",
      color: "from-blue-400 to-cyan-600",
      highlight: "Battery Management",
    },
    {
      icon: TrendingUp,
      title: "Save Money",
      description:
        "Track your savings, analyze costs, and get insights to reduce grid dependency and maximize ROI.",
      color: "from-green-400 to-emerald-600",
      highlight: "Cost Analytics",
    },
    {
      icon: Zap,
      title: "Control Everything",
      description:
        "Set goals, schedule loads, generate reports, and maintain your system with advanced features.",
      color: "from-purple-400 to-pink-600",
      highlight: "Smart Controls",
    },
  ];

  const CurrentIcon = steps[step].icon;

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence mode="wait">
      {!hasSeenOnboarding && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md sm:max-w-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header Background */}
            <div
              className={`h-32 sm:h-40 bg-gradient-to-r ${steps[step].color} relative overflow-hidden`}
            >
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              {/* Animated Icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <CurrentIcon size={isMobile ? 60 : 80} className="text-white opacity-90" />
                </motion.div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 md:p-12 min-h-60 sm:min-h-64 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={slideVariants}
                  custom={step}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0 p-6 sm:p-8 md:p-12"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <motion.h2
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {steps[step].title}
                      </motion.h2>

                      <motion.p
                        className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {steps[step].description}
                      </motion.p>

                      <motion.div
                        className={`mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${steps[step].color} text-white text-xs sm:text-sm font-semibold`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {steps[step].highlight}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Step Indicators */}
              <motion.div
                className="flex gap-2 mt-8 justify-center relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {steps.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setStep(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === step
                        ? "bg-gray-900 dark:bg-white w-6 sm:w-8"
                        : "bg-gray-300 dark:bg-slate-600 w-2 hover:bg-gray-400 dark:hover:bg-slate-500"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex gap-2 sm:gap-4 mt-8 justify-between relative z-10 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className={`px-3 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
                    step === 0
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  ← Previous
                </button>

                {step === steps.length - 1 ? (
                  <motion.button
                    onClick={handleComplete}
                    className="flex items-center gap-2 px-4 sm:px-8 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle size={18} />
                    Get Started
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-2 px-4 sm:px-8 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                    <ChevronRight size={18} />
                  </motion.button>
                )}
              </motion.div>

              {/* Skip Button */}
              <motion.button
                onClick={handleComplete}
                className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mt-4 transition relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Skip onboarding
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Onboarding;
