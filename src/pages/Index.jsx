import { useState, useEffect } from "react";
import Header from "../components/Header";
import PowerFlowCard from "../components/PowerFlowCard";
import BatteryStatus from "../components/BatteryStatus";
import SolarStatus from "../components/SolarStatus";
import GridStatus from "../components/GridStatus";
import LoadStatus from "../components/LoadStatus";
import ControlPanel from "../components/ControlPanel";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart3, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import WeatherForecast from "../components/WeatherForecast";
import QuickStats from "../components/QuickStats";


const Index = () => {
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("SOLAR_HOME");
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (!autoMode) return;

    // Simulate automatic mode switching based on time of day or conditions
    const autoModeSimulation = setInterval(() => {
      // Get current hour to simulate different power sources based on time
      const hour = new Date().getHours();

      // Simplified logic - just for demonstration
      if (hour >= 8 && hour < 16) {
        // Daytime: prioritize solar
        setActiveMode("SOLAR_POWERHIVE_HOME");
      } else if (hour >= 16 && hour < 20) {
        // Evening: use battery
        setActiveMode("POWERHIVE_HOME");
      } else {
        // Night: charge from grid when rates are lower
        setActiveMode("GRID_HOME_POWERHIVE");
      }
    }, 10000); // Check every 10 seconds (for demo purposes)
    // setLoading(false);

    return () => clearInterval(autoModeSimulation);
  }, [autoMode]);
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse-slow flex flex-col items-center">
          <Zap className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-medium">Loading Dashboard</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-28 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight mb-2">PowerHive</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 font-normal">
              Charging • 27% charged
            </Badge>
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 font-normal">
              Solar Active
            </Badge>
          </div>
        </div>

        <div className="justify-center align-middle grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <SolarStatus />
          <BatteryStatus />
          <GridStatus />
          <LoadStatus />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <PowerFlowCard activeMode={activeMode} />
          <ControlPanel
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            autoMode={autoMode}
            setAutoMode={setAutoMode}
          />
          <WeatherForecast />
          <QuickStats />
        </div>
      </main>
    </div>
  );
};

export default Index;
