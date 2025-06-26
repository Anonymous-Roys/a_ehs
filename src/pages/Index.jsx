import { useState, useEffect } from "react";
import Header from "../components/Header";
import PowerFlowCard from "../components/PowerFlowCard";
import BatteryStatus from "../components/battery/BatteryStatus";
import SolarStatus from "../components/solar/SolarStatus-2";
import GridStatus from "../components/GridStatus";
import LoadStatus from "../components/LoadStatus";
import ControlPanel from "../components/ControlPanel";
import { BarChart3, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import WeatherForecast from "../components/WeatherForecast";
import QuickStats from "../components/QuickStats";
import WindStatus from "../components/wind/WindStatus";


const Index = () => {
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("SOLAR_HOME_GRID");
  const [autoMode, setAutoMode] = useState(false);
  const [simulatedHour, setSimulatedHour] = useState(6); // Start from 6 AM

  useEffect(() => {
    if (!autoMode) return;
  
    const autoModeSimulation = setInterval(() => {
      setSimulatedHour((prevHour) => {
        let nextHour = prevHour + 1;
        if (nextHour > 23) nextHour = 0; // reset after 24 hours
  
        // Set active mode based on simulated hour
        if (nextHour >= 6 && nextHour < 8) {
          setActiveMode("SOLAR_HOME_GRID"); // Morning: Solar + Grid → Home
        } else if (nextHour >= 8 && nextHour < 9) {
          setActiveMode("SOLAR_POWERHIVE_HOME"); // Afternoon: Solar → Home + PowerHive (Battery)
        } else if (nextHour >= 9 && nextHour < 10) {
          setActiveMode("POWERHIVE_HOME"); // Evening: Battery → Home
        } else {
          setActiveMode("GRID_HOME"); // Night: Grid → Home first
  
          // Simulate grid outage after 2s
          setTimeout(() => {
            setActiveMode("POWERHIVE_HOME"); // Battery → Home fallback
          }, 6000);
        }
  
        return nextHour;
      });
    }, 5000); // Every 5 seconds, simulate 1 hour
  
    return () => clearInterval(autoModeSimulation); // Cleanup
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
          <WindStatus/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ControlPanel
           deviceId="device001"
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            autoMode={autoMode}
            setAutoMode={setAutoMode}
          />
          <PowerFlowCard activeMode={activeMode} />
          {/* <WeatherForecast />
          <QuickStats /> */}
        </div>
      </main>
    </div>
  );
};

export default Index;
