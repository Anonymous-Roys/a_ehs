import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Home, ChevronUp, Gauge, BatteryFull, ArrowDown } from "lucide-react";

const LoadStatus = () => {
  const [loadUsage, setLoadUsage] = useState(45);
  const [loadPower, setLoadPower] = useState(3.8);
  const [loadHistory, setLoadHistory] = useState([40, 42, 43, 44, 45]);
  const [energySources, setEnergySources] = useState({ solar: 40, battery: 35, grid: 25 });
  const [showDetails, setShowDetails] = useState(false);
  const [applianceData, setApplianceData] = useState([
    { name: "HVAC", power: 1.8, percentage: 38 },
    { name: "Kitchen", power: 0.9, percentage: 19 },
    { name: "Lights", power: 0.6, percentage: 13 },
    { name: "Other", power: 1.4, percentage: 30 }
  ]);
  
  useEffect(() => {
    // Simulate load usage changes
    const interval = setInterval(() => {
      const newValue = loadUsage + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4);
      const boundedValue = Math.max(10, Math.min(90, newValue));
      setLoadUsage(boundedValue);
      
      // Update power based on usage
      const newPower = (boundedValue / 100 * 8.5).toFixed(1);
      setLoadPower(newPower);
      
      // Update load history
      setLoadHistory(prev => {
        if (prev.length >= 10) {
          return [...prev.slice(1), boundedValue];
        }
        return [...prev, boundedValue];
      });
      
      // Simulate changing energy sources
      setEnergySources({
        solar: Math.floor(35 + Math.random() * 15),
        battery: Math.floor(30 + Math.random() * 15),
        grid: Math.floor(20 + Math.random() * 15)
      });
      
      // Update appliance data
      setApplianceData([
        { name: "HVAC", power: (newPower * 0.38).toFixed(1), percentage: 38 },
        { name: "Kitchen", power: (newPower * 0.19).toFixed(1), percentage: 19 },
        { name: "Lights", power: (newPower * 0.13).toFixed(1), percentage: 13 },
        { name: "Other", power: (newPower * 0.30).toFixed(1), percentage: 30 }
      ]);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [loadUsage]);

  // Calculate load level severity
  const getLoadColor = () => {
    if (loadUsage > 75) return "text-rose-500";
    if (loadUsage > 50) return "text-amber-500";
    return "text-green-500";
  };

  // Calculate progress color based on load level
  const getProgressColor = () => {
    if (loadUsage > 75) return "#F43F5E"; // rose
    if (loadUsage > 50) return "#F59E0B"; // amber
    return "#10B981"; // green
  };

  return (
    <Card onClick={() => window.location.href="/load-details"} className="hover:from-sky-100 hover:to-sky-200 cursor-pointer dark:hover:from-sky-900 dark:hover:to-sky-800 load-card w-full shadow-lg border-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Home Icon with Animation */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full ${
              loadUsage > 75 ? "bg-rose-100/70 dark:bg-rose-900/20" :
              loadUsage > 50 ? "bg-amber-100/70 dark:bg-amber-900/20" :
              "bg-green-100/70 dark:bg-green-900/20"
            } transition-colors duration-1000`}></div>
            <div className="absolute inset-0 rounded-full opacity-70">
              <div className="absolute inset-0 rounded-full border-2 border-rose-400/40 dark:border-rose-500/30 animate-pulse"></div>
            </div>
            
            {/* Home icon */}
            <div className="relative">
              <Home 
                className={`h-10 w-10 ${getLoadColor()} transition-colors duration-1000`} 
                strokeWidth={1.5} 
              />
              
              {/* Power consumption animation */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-col items-center">
                  <ArrowDown 
                    className={`h-6 w-6 ${getLoadColor()} animate-power-flow`}
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
            
            {/* Power meter indicator */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center justify-center">
                <Gauge 
                  className={`h-5 w-5 ${getLoadColor()}`}
                  style={{ transform: `rotate(${loadUsage * 1.8}deg)` }}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
          
          {/* Status and Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl font-medium">Home Load</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                loadUsage > 75 ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                loadUsage > 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {loadUsage > 75 ? "High" : loadUsage > 50 ? "Medium" : "Low"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <BatteryFull className="h-4 w-4" />
              {`Currently using ${loadPower} kW`}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Usage Level</span>
              <span className={`font-medium ${getLoadColor()}`}>
                {loadUsage}%
              </span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Progress 
                value={loadUsage} 
                className="h-2 transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, ${getProgressColor()} 0%, ${getProgressColor()}cc ${loadUsage}%)`,
                }}
              />
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent to-white/30 dark:to-white/20 animate-shimmer"
                style={{ width: `${loadUsage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Mini Chart */}
          {/* <div className="w-full h-16 mt-2">
            <div className="text-xs text-muted-foreground mb-1 text-left">Usage History</div>
            <div className="flex items-end justify-between h-12 gap-1">
              {loadHistory.map((value, index) => (
                <div 
                  key={index} 
                  className="flex-1 rounded-t-sm transition-all duration-500"
                  style={{ 
                    height: `${value}%`,
                    backgroundColor: getProgressColor() + (index === loadHistory.length - 1 ? 'ff' : '80'),
                    opacity: 0.3 + (index * 0.1)
                  }}
                ></div>
              ))}
            </div>
          </div> */}
          
          {/* Energy Sources */}
          {/* <div className="w-full pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-xs text-muted-foreground mb-2 text-left">Energy Sources</div>
            <div className="h-4 w-full flex rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 transition-all duration-500 flex items-center justify-center"
                style={{ width: `${energySources.solar}%` }}
              >
                <span className="text-xs text-white font-medium">Solar</span>
              </div>
              <div 
                className="bg-blue-500 transition-all duration-500 flex items-center justify-center"
                style={{ width: `${energySources.battery}%` }}
              >
                <span className="text-xs text-white font-medium">Battery</span>
              </div>
              <div 
                className="bg-indigo-500 transition-all duration-500 flex items-center justify-center"
                style={{ width: `${energySources.grid}%` }}
              >
                <span className="text-xs text-white font-medium">Grid</span>
              </div>
            </div>
          </div> */}
          
          {/* Basic Metrics */}
          <div className="w-full grid grid-cols-2 gap-4 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs text-muted-foreground">Current Draw</p>
              <p className="font-medium text-sm">{loadPower} kW</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Today's Usage</p>
              <p className="font-medium text-sm">42.7 kWh</p>
            </div>
          </div>
          
          {/* Toggle Details Button */}
          {/* <button 
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{showDetails ? "Hide details" : "Show details"}</span>
            <ChevronUp className={`h-4 w-4 ml-1 transition-transform ${showDetails ? '' : 'rotate-180'}`} />
          </button> */}
          
          {/* Expanded Details */}
          {/* {showDetails && (
            <div className="w-full space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-sm animate-fade-in">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Load Distribution</p>
                <div className="space-y-2">
                  {applianceData.map((appliance, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs">
                        <span>{appliance.name}</span>
                        <span>{appliance.power} kW ({appliance.percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                        <div 
                          className="h-full rounded-full bg-rose-500 dark:bg-rose-600"
                          style={{ width: `${appliance.percentage}%`, opacity: 0.7 + (index * 0.1) }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Peak Today</p>
                  <p className="font-medium">7.2 kW at 7:30 PM</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average</p>
                  <p className="font-medium">3.8 kW</p>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
};



export default LoadStatus;