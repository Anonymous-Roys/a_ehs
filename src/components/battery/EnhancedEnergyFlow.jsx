import { useState, useEffect } from "react";
import { Sun, Home, Battery, Zap, CloudLightning, PlugZap } from "lucide-react";

export default function EnhancedEnergyFlow() {
  // System state
  const [batteryLevel, setBatteryLevel] = useState(72);
  const [batteryCapacity] = useState(13.5); // kWh
  const [solarGeneration, setSolarGeneration] = useState(2.4); // kW (current)
  const [todayGeneration, setTodayGeneration] = useState(14.8); // kWh (daily total)
  const [homeConsumption, setHomeConsumption] = useState(1.7); // kW (current)
  const [todayConsumption, setTodayConsumption] = useState(18.5); // kWh (daily total)
  const [gridDirection, setGridDirection] = useState("import"); // "import", "export", "none"
  const [gridPower, setGridPower] = useState(0.5); // kW
  const [timeOfDay, setTimeOfDay] = useState("day"); // "day", "night", "sunset"
  
  // Demo mode - animate values to simulate a live system
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuations in solar generation
      const newSolar = Math.max(0, solarGeneration + (Math.random() - 0.5) * 0.3);
      setSolarGeneration(parseFloat(newSolar.toFixed(1)));
      setTodayGeneration(prev => parseFloat((prev + newSolar / 360).toFixed(1)));
      
      // Simulate fluctuations in home consumption
      const newConsumption = Math.max(0.2, homeConsumption + (Math.random() - 0.5) * 0.2);
      setHomeConsumption(parseFloat(newConsumption.toFixed(1)));
      setTodayConsumption(prev => parseFloat((prev + newConsumption / 360).toFixed(1)));
      
      // Calculate energy balance and update battery/grid
      const energyBalance = newSolar - newConsumption;
      
      // Update battery level based on energy balance
      const newBatteryLevel = Math.min(100, Math.max(0, batteryLevel + energyBalance / batteryCapacity * 100 * 0.05));
      setBatteryLevel(Math.round(newBatteryLevel));
      
      // Update grid flow based on energy balance and battery state
      if (energyBalance > 0 && batteryLevel >= 99) {
        setGridDirection("export");
        setGridPower(parseFloat(energyBalance.toFixed(1)));
      } else if (energyBalance < 0 && batteryLevel <= 10) {
        setGridDirection("import");
        setGridPower(parseFloat(Math.abs(energyBalance).toFixed(1)));
      } else {
        setGridDirection("none");
        setGridPower(0);
      }
      
      // Demo: cycle through time of day every 20 seconds
      const now = new Date();
      const seconds = now.getSeconds();
      if (seconds % 30 < 20) {
        setTimeOfDay("day");
      } else if (seconds % 30 < 25) {
        setTimeOfDay("sunset");
      } else {
        setTimeOfDay("night");
      }
      
    }, 3000);
    
    return () => clearInterval(interval);
  }, [solarGeneration, homeConsumption, batteryLevel, batteryCapacity]);
  
  // Helper functions
  const getBatteryBgColor = () => {
    if (batteryLevel > 80) return "bg-green-500"; 
    if (batteryLevel > 50) return "bg-green-400";
    if (batteryLevel > 20) return "bg-amber-400";
    return "bg-red-500";
  };
  
  const getBatteryColor = () => {
    if (batteryLevel > 80) return "text-green-500"; 
    if (batteryLevel > 50) return "text-green-400";
    if (batteryLevel > 20) return "text-amber-400";
    return "text-red-500";
  };
  
  const isCharging = solarGeneration > homeConsumption;
  const isDischarging = !isCharging && batteryLevel > 0;
  
  // Background gradient based on time of day
  const getBackgroundStyle = () => {
    switch(timeOfDay) {
      case "night":
        return "bg-gradient-to-b from-slate-800 to-slate-900";
      case "sunset":
        return "bg-gradient-to-b from-amber-100 via-pink-100 to-slate-200 dark:from-amber-900/40 dark:via-pink-900/30 dark:to-slate-900";
      default: // day
        return "bg-gradient-to-b from-blue-50 to-slate-100 dark:from-blue-900/30 dark:to-slate-900";
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 shadow-sm mb-6 overflow-hidden">
      <div className="px-6 py-4 border-b dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium">Energy Flow</h3>
        <div className="flex items-center text-sm space-x-2">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-slate-500">Live</span>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>
      
      <div className="p-0">
        <div className={`relative h-80 ${getBackgroundStyle()} rounded-lg overflow-hidden transition-all duration-1000`}>
          {/* Sun/Moon based on time of day */}
          <div className="absolute top-6 left-1/4 transform -translate-x-1/2 transition-all duration-500">
            <div className="relative">
              {timeOfDay === "night" ? (
                <>
                  <div className="absolute inset-0 bg-slate-300 rounded-full opacity-20"></div>
                  <svg className="h-16 w-16 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3a9 9 0 1 0 9 9c0-4.97-4.03-9-9-9zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
                    <path d="M12 7v2M12 15v2M7 12h2M15 12h2M8.5 8.5l1.5 1.5M14 14l1.5 1.5M8.5 15.5l1.5-1.5M14 10l1.5-1.5" />
                  </svg>
                </>
              ) : (
                <>
                  <div className={`absolute inset-0 bg-amber-300 rounded-full opacity-20 ${timeOfDay === "day" ? "animate-pulse-slow" : ""}`}></div>
                  <Sun className={`h-16 w-16 ${timeOfDay === "sunset" ? "text-amber-400" : "text-amber-500"}`} strokeWidth={1.5} />
                </>
              )}
            </div>
            <div className="text-center mt-1">
              <p className="font-medium">{todayGeneration.toFixed(1)} kWh</p>
              <div className={`flex items-center justify-center text-sm ${solarGeneration > 0 ? "text-green-500" : "text-slate-500"}`}>
                <Zap className="h-3 w-3 mr-1" />
                {solarGeneration.toFixed(1)} kW {timeOfDay === "night" && "(0)"}
              </div>
            </div>
          </div>
          
          {/* House */}
          <div className="absolute top-6 right-1/4 transform translate-x-1/2">
            <div className="relative">
              <Home className="h-16 w-16 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
              {homeConsumption > 2.5 && (
                <div className="absolute top-0 right-0 h-3 w-3 bg-amber-400 rounded-full animate-ping"></div>
              )}
            </div>
            <div className="text-center mt-1">
              <p className="font-medium">{todayConsumption.toFixed(1)} kWh</p>
              <p className="text-sm text-rose-500 flex items-center justify-center">
                <Zap className="h-3 w-3 mr-1" />
                {homeConsumption.toFixed(1)} kW
              </p>
            </div>
          </div>
          
          {/* Power Grid */}
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
            <div className="relative">
              <div className={`absolute inset-0 rounded-full ${gridDirection === "export" ? "bg-green-500" : "bg-blue-500"} opacity-30 ${gridDirection !== "none" ? "animate-pulse" : ""}`}></div>
              <PlugZap className="h-12 w-12 text-slate-600 dark:text-slate-400" strokeWidth={1.5} />
            </div>
            <div className="text-center mt-1">
              <p className="font-medium">Grid</p>
              {gridDirection !== "none" && (
                <p className={`text-sm ${gridDirection === "export" ? "text-green-500" : "text-blue-500"} flex items-center justify-center`}>
                  <Zap className="h-3 w-3 mr-1" />
                  {gridPower.toFixed(1)} kW
                  <span className="ml-1">
                    {gridDirection === "export" ? "→" : "←"}
                  </span>
                </p>
              )}
            </div>
          </div>
          
          {/* Battery */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className={`absolute inset-0 rounded-full ${getBatteryBgColor()} opacity-20 ${isCharging ? "animate-pulse-slow" : ""}`}></div>
              <div className="relative">
                <Battery className={`h-16 w-16 ${getBatteryColor()}`} strokeWidth={1.5} />
                
                {/* Battery level indicator */}
                <div className="absolute inset-y-0 left-0 right-0 mx-auto w-8 flex items-center justify-center">
                  <div className={`h-8 w-6 rounded ${getBatteryBgColor()} opacity-50`} style={{ height: `${Math.max(5, batteryLevel * 0.08)}rem` }}></div>
                </div>
                
                <p className="absolute inset-0 flex items-center justify-center font-bold text-lg">{batteryLevel}%</p>
                
                {/* Charging/discharging indicator */}
                {isCharging && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Charging
                  </div>
                )}
                {isDischarging && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Discharging
                  </div>
                )}
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="font-medium">{(batteryCapacity * batteryLevel / 100).toFixed(1)} kWh</p>
              <p className="text-xs text-slate-500">of {batteryCapacity} kWh capacity</p>
            </div>
          </div>
          
          {/* Connecting Lines with Animated Flows */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Sun to Battery - only active during day with solar generation */}
            {solarGeneration > 0 && (
              <>
                <line 
                  x1="25%" y1="15%" 
                  x2="50%" y2="75%" 
                  stroke="#3B82F6" 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                  className="animate-dash-flow"
                />
                <circle 
                  cx="37.5%" cy="45%" r="3" 
                  fill="#3B82F6" 
                  className="animate-flow-dot"
                />
              </>
            )}
            
            {/* House to Battery or Battery to House */}
            <line 
              x1="75%" y1="15%" 
              x2="50%" y2="75%" 
              stroke={isCharging ? "#22C55E" : "#F43F5E"} 
              strokeWidth="2" 
              strokeDasharray="5,5" 
              className="animate-dash-flow-reverse"
            />
            <circle 
              cx="62.5%" cy="45%" r="3" 
              fill={isCharging ? "#22C55E" : "#F43F5E"} 
              className="animate-flow-dot-reverse"
            />
            
            {/* Grid to House or Battery to Grid */}
            {gridDirection !== "none" && (
              <>
                <line 
                  x1="90%" y1="50%" 
                  x2="75%" y2="15%" 
                  stroke={gridDirection === "export" ? "#22C55E" : "#3B82F6"} 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                  className={gridDirection === "export" ? "animate-dash-flow" : "animate-dash-flow-reverse"}
                />
                <circle 
                  cx="82.5%" cy="32.5%" r="3" 
                  fill={gridDirection === "export" ? "#22C55E" : "#3B82F6"} 
                  className={gridDirection === "export" ? "animate-flow-dot" : "animate-flow-dot-reverse"}
                />
              </>
            )}
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2 shadow-sm text-xs">
              <div className="flex items-center mb-1">
                <div className="h-2 w-4 bg-blue-500 rounded mr-2"></div>
                <span>Solar Input</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="h-2 w-4 bg-rose-500 rounded mr-2"></div>
                <span>Home Usage</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-4 bg-green-500 rounded mr-2"></div>
                <span>Grid Export</span>
              </div>
            </div>
          </div>
          
          {/* Weather effects based on time of day */}
          {timeOfDay === "night" && (
            <div className="absolute inset-0">
              <div className="absolute top-8 left-20 text-white opacity-80">
                <CloudLightning className="h-6 w-6" />
              </div>
              <div className="absolute top-16 right-32 text-white opacity-80">
                <CloudLightning className="h-5 w-5" />
              </div>
              <div className="absolute top-12 left-1/2 text-white opacity-80">
                <CloudLightning className="h-7 w-7" />
              </div>
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-px h-2 bg-white opacity-30"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${0.5 + Math.random() * 1}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Energy summary statistics */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 grid grid-cols-3 gap-4 text-center">
          <div>
            <h4 className="text-sm text-slate-500 dark:text-slate-400">Current Balance</h4>
            <p className={`text-lg font-medium ${solarGeneration > homeConsumption ? "text-green-500" : "text-rose-500"}`}>
              {(solarGeneration - homeConsumption).toFixed(1)} kW
            </p>
          </div>
          <div>
            <h4 className="text-sm text-slate-500 dark:text-slate-400">Daily Balance</h4>
            <p className={`text-lg font-medium ${todayGeneration > todayConsumption ? "text-green-500" : "text-rose-500"}`}>
              {(todayGeneration - todayConsumption).toFixed(1)} kWh
            </p>
          </div>
          <div>
            <h4 className="text-sm text-slate-500 dark:text-slate-400">System Mode</h4>
            <p className="text-lg font-medium text-blue-500">
              {gridDirection === "export" ? "Grid Export" : isCharging ? "Charging" : "Backup"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}