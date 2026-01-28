import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import AuthContainer from "./components/auth/AuthContainer";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Alerts from "./pages/Alerts";
import Controls from "./components/Controls";
import SolarDetailsPage from "./components/solar/SolarDetails";
import BatterySettings from "./pages/battery/BatterySettings";
import LoadDetails from "./pages/LoadDetails";
import CostSavingsDashboard from "./pages/CostSavingsDashboard";
import EnergyGoalsPage from "./pages/EnergyGoals";
import LoadSchedulingPage from "./pages/LoadScheduling";
import ReportsGeneratorPage from "./pages/ReportsGenerator";
import MaintenanceTrackerPage from "./pages/MaintenanceTracker";

const queryClient = new QueryClient();

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    // Check if user is already authenticated
    const savedAuth = localStorage.getItem('flux_authenticated');
    const savedUser = localStorage.getItem('flux_user');
    
    if (savedAuth === 'true' && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('flux_authenticated');
    localStorage.removeItem('flux_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster position="top-center" />
          <AuthContainer onAuthenticated={handleAuthenticated} />
          <div className="fixed bottom-0 right-0 m-6 z-50">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-center p-3 bg-blue-500 rounded-full hover:bg-blue-600 text-white shadow-lg transition backdrop-blur-lg"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-center" />
        <BrowserRouter className="relative">
          <Layout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/a" element={<Alerts />} />
              <Route path="/c" element={<Controls />} />
              <Route path="/solar-details" element={<SolarDetailsPage />} />
              <Route path="/battery-details/battery-settings/" element={<BatterySettings />} />
              <Route path="/load-details" element={<LoadDetails />} />
              <Route path="/cost-savings" element={<CostSavingsDashboard />} />
              <Route path="/energy-goals" element={<EnergyGoalsPage />} />
              <Route path="/load-scheduling" element={<LoadSchedulingPage />} />
              <Route path="/reports" element={<ReportsGeneratorPage />} />
              <Route path="/maintenance" element={<MaintenanceTrackerPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <div className="fixed bottom-0 right-0 m-6 z-50">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-center p-3 bg-blue-500 rounded-full hover:bg-blue-600 text-white shadow-lg transition backdrop-blur-lg"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
