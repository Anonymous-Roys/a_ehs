import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Battery, Clock, ArrowUp, ArrowDown, ChevronUp, Zap, ArrowRight } from "lucide-react";

const BatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState(27);
  const [charging, setCharging] = useState(true);
  const [powerFlow, setPowerFlow] = useState(2.1);
  const [chargeHistory, setChargeHistory] = useState([22, 24, 25, 26, 27, 27]);
  const [timeRemaining, setTimeRemaining] = useState("5h 20m");
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Simulate battery level changes
    const interval = setInterval(() => {
      if (charging) {
        setBatteryLevel(prev => {
          const newLevel = Math.min(95, prev + 1);
          if (newLevel >= 95) {
            setCharging(false);
          }
          return newLevel;
        });
        
        // Simulate variable charging rate
        setPowerFlow(Math.round((2 + Math.random() * 0.5) * 10) / 10);
      } else {
        setBatteryLevel(prev => {
          const newLevel = Math.max(20, prev - 1);
          if (newLevel <= 20) {
            setCharging(true);
          }
          return newLevel;
        });
        
        // Simulate variable discharge rate
        setPowerFlow(Math.round((1.2 + Math.random() * 0.6) * 10) / 10);
      }
      
      // Update charge history
      setChargeHistory(prev => {
        if (prev.length >= 12) {
          return [...prev.slice(1), batteryLevel];
        }
        return [...prev, batteryLevel];
      });
      
      // Update time remaining
      if (charging) {
        const hoursToFull = Math.round((95 - batteryLevel) / 10);
        const minutesToFull = Math.round(((95 - batteryLevel) % 10) * 6);
        setTimeRemaining(`${hoursToFull}h ${minutesToFull}m`);
      } else {
        const hoursToEmpty = Math.round((batteryLevel - 20) / 7);
        const minutesToEmpty = Math.round(((batteryLevel - 20) % 7) * 8);
        setTimeRemaining(`${hoursToEmpty}h ${minutesToEmpty}m`);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [charging, batteryLevel]);

  // Get status color based on battery level
  const getBatteryColor = () => {
    if (batteryLevel > 80) return "text-green-500";
    if (batteryLevel > 50) return "text-teal-500";
    if (batteryLevel > 30) return "text-blue-500";
    if (batteryLevel > 15) return "text-amber-500";
    return "text-rose-500";
  };

  // Get background color based on battery level
  const getBatteryBgColor = () => {
    if (batteryLevel > 80) return "bg-green-100 dark:bg-green-900/30";
    if (batteryLevel > 50) return "bg-teal-100 dark:bg-teal-900/30";
    if (batteryLevel > 30) return "bg-blue-100 dark:bg-blue-900/30";
    if (batteryLevel > 15) return "bg-amber-100 dark:bg-amber-900/30";
    return "bg-rose-100 dark:bg-rose-900/30";
  };

  // Get progress bar color based on battery level
  const getProgressColor = () => {
    if (batteryLevel > 80) return "#10B981"; // green
    if (batteryLevel > 50) return "#14B8A6"; // teal
    if (batteryLevel > 30) return "#0EA5E9"; // blue
    if (batteryLevel > 15) return "#F59E0B"; // amber
    return "#F43F5E"; // rose
  };

  return (
    <Card onClick={() => window.location.href="/battery-details"} className="battery-card w-full shadow-lg border-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 hover:from-sky-100 hover:to-sky-200 cursor-pointer dark:hover:from-sky-900 dark:hover:to-sky-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Battery Icon with Animation */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full ${getBatteryBgColor()} transition-colors duration-1000`}></div>
            <div className="absolute inset-0 rounded-full opacity-70">
              {charging && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-300/30 dark:border-blue-400/20 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/40 dark:border-blue-500/30 animate-pulse"></div>
                </>
              )}
            </div>
            
            {/* Battery icon and charging indicator */}
            <div className="relative">
              <Battery 
                className={`h-10 w-10 ${getBatteryColor()} transition-colors duration-1000`} 
                strokeWidth={1.5}
              />
              
              {/* Battery fill animation */}
              <div 
                className="absolute bottom-[13px] left-[4px] right-[11px] bg-current rounded transition-all duration-1000 ease-out"
                style={{ 
                  height: `${Math.max(2, (batteryLevel / 100) * 24)}px`,
                  opacity: 0.5
                }}
              ></div>
              
              {/* Charging lightning bolt */}
              {charging && (
                <div className="absolute inset-0 flex items-center justify-center animate-bounce-subtle">
                  <Zap className="h-6 w-6 text-blue-500 dark:text-blue-400" strokeWidth={2} />
                </div>
              )}
            </div>
            
            {/* Power flow indicators */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              {charging && (
                <div className="flex flex-col items-center animate-power-flow">
                  <ArrowDown className="h-6 w-6 text-blue-500" strokeWidth={2.5} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              {!charging && (
                <div className="flex flex-col items-center animate-power-flow">
                  <ArrowUp className="h-6 w-6 text-rose-500" strokeWidth={2.5} />
                </div>
              )}
            </div>
          </div>
          
          {/* Status and Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl font-medium">PowerHive</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                charging 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                {charging ? "Charging" : "Discharging"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
              {charging 
                ? `${timeRemaining} until full` 
                : `${timeRemaining} remaining`}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Battery Level</span>
              <span className={`font-medium ${getBatteryColor()}`}>
                {batteryLevel}%
              </span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Progress 
                value={batteryLevel} 
                className="h-2 transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, ${getProgressColor()} 0%, ${getProgressColor()}cc ${batteryLevel}%)`,
                }}
              />
              {/* Animated glowing effect for the progress bar */}
              {charging && (
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent to-white/30 dark:to-white/20 animate-shimmer"
                  style={{ width: `${batteryLevel}%` }}
                ></div>
              )}
            </div>
          </div>
          
          {/* Mini Chart */}
          {/* <div className="w-full h-16 mt-2">
            <div className="text-xs text-muted-foreground mb-1 text-left">Charge Level History</div>
            <div className="flex items-end justify-between h-12 gap-1">
              {chargeHistory.map((value, index) => (
                <div 
                  key={index} 
                  className="flex-1 rounded-t-sm transition-all duration-500"
                  style={{ 
                    height: `${value}%`,
                    backgroundColor: getProgressColor() + (index === chargeHistory.length - 1 ? 'ff' : '80'),
                    opacity: 0.3 + (index * 0.1)
                  }}
                ></div>
              ))}
            </div>
          </div> */}
          
          {/* Power Stats */}
          <div className="w-full grid grid-cols-3 gap-4 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="font-medium text-sm">10.2 kWh</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="font-medium text-sm">{Math.round(10.2 * batteryLevel / 100 * 10) / 10} kWh</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Power</p>
              <p className={`font-medium text-sm ${charging ? 'text-blue-500' : 'text-rose-500'}`}>
                {charging ? "+" : "-"}{powerFlow} kW
              </p>
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Cycle Count</p>
                  <p className="font-medium">342</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Health</p>
                  <p className="font-medium text-green-500">97%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Full Charge</p>
                  <p className="font-medium">Yesterday, 8:42 PM</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                  <p className="font-medium">94.2%</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">Battery Power Mode</p>
                <div className="grid grid-cols-3 gap-1">
                  <button className="py-1 px-2 bg-blue-100 text-blue-700 rounded-l-md text-xs font-medium dark:bg-blue-900/40 dark:text-blue-400">
                    Smart
                  </button>
                  <button className="py-1 px-2 bg-slate-100 text-slate-500 text-xs font-medium dark:bg-slate-800 dark:text-slate-400">
                    Reserve
                  </button>
                  <button className="py-1 px-2 bg-slate-100 text-slate-500 rounded-r-md text-xs font-medium dark:bg-slate-800 dark:text-slate-400">
                    Backup
                  </button>
                </div>
              </div>
            </div>
          )} */}
        </div>
        {/* <button 
            onClick={() => window.location.href="/solar-details"}
            className="flex items-center justify-center w-full p-2 mt-4 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 transition-colors"
          >
            View Detailed Analytics
            <ArrowRight className="h-4 w-4 ml-1" />
          </button> */}
      </CardContent>
    </Card>
  );
};



export default BatteryStatus;