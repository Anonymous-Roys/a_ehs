import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Power, Activity, WifiOff, ChevronUp, Zap } from "lucide-react";

const GridStatus = () => {
  const [gridUsage, setGridUsage] = useState(22);
  const [importing, setImporting] = useState(true);
  const [voltage, setVoltage] = useState(238);
  const [frequency, setFrequency] = useState(49.8);
  // const [usageHistory, setUsageHistory] = useState([18, 19, 20, 21, 22]);
  // const [showDetails, setShowDetails] = useState(false);
  
  // useEffect(() => {
  //   // Simulate grid usage changes
  //   const interval = setInterval(() => {
  //     const newValue = gridUsage + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2);
  //     const boundedValue = Math.max(0, Math.min(80, newValue));
  //     setGridUsage(boundedValue);
  //     setImporting(boundedValue > 5);
      
  //     // Simulate small voltage fluctuations
  //     setVoltage(Math.round((238 + (Math.random() - 0.5) * 4) * 10) / 10);
      
  //     // Simulate small frequency fluctuations
  //     setFrequency(Math.round((50 + (Math.random() - 0.5) * 0.4) * 10) / 10);
      
  //     // Update usage history
  //     setUsageHistory(prev => {
  //       if (prev.length >= 10) {
  //         return [...prev.slice(1), boundedValue];
  //       }
  //       return [...prev, boundedValue];
  //     });
  //   }, 4000);
    
  //   return () => clearInterval(interval);
  // }, [gridUsage]);

  const getGridPower = () => {
    return (gridUsage / 100 * 10).toFixed(1);
  };

  return (
    <Card onClick={() => window.location.href="/grid-details"} className="grid-card cursor-pointer hover:from-sky-100 hover:to-sky-200 dark:hover:from-sky-900 dark:hover:to-sky-800 w-full shadow-lg border-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Grid Icon with Animation */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-indigo-100/70 dark:bg-indigo-900/20"></div>
            <div className="absolute inset-0 rounded-full opacity-70">
              {importing && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-300/30 dark:border-indigo-400/20 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-400/40 dark:border-indigo-500/30 animate-pulse"></div>
                </>
              )}
            </div>
            
            {/* Grid icon */}
            <div className="relative">
              <Power 
                className={`h-10 w-10 ${importing ? 'text-indigo-500' : 'text-gray-400'}`} 
                strokeWidth={1.5} 
              />
              
              {/* Power line animation */}
              {importing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid-animation-container">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute h-px bg-indigo-500 w-full opacity-0 animate-grid-pulse"
                        style={{ 
                          animationDelay: `${i * 0.5}s`,
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Status indicator */}
            <div className="absolute -top-1 right-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                importing ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {importing ? (
                  <Zap className="h-3 w-3 text-white" />
                ) : (
                  <WifiOff className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                )}
              </div>
            </div>
          </div>
          
          {/* Status and Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-medium">Grid Connection</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                importing 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {importing ? "Importing" : "Standby"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Activity className="h-4 w-4" />
              {importing 
                ? `Drawing ${getGridPower()} kW from grid` 
                : "No power imported"}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Usage</span>
              <span className={`font-medium ${importing ? 'text-indigo-500' : 'text-gray-500'}`}>
                {0}%
              </span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Progress 
                value={0} 
                className="h-2 transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, #6366F1 0%, #818CF8 ${gridUsage}%)`,
                }}
              />
              {/* Animated glowing effect for the progress bar */}
              {importing && (
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent to-white/30 dark:to-white/20 animate-shimmer"
                  style={{ width: `${gridUsage}%` }}
                ></div>
              )}
            </div>
          </div>
          
          {/* Mini Chart */}
          {/* <div className="w-full h-16 mt-2">
            <div className="text-xs text-muted-foreground mb-1 text-left">Import History</div>
            <div className="flex items-end justify-between h-12 gap-1">
              {usageHistory.map((value, index) => (
                <div 
                  key={index} 
                  className="flex-1 bg-indigo-500/80 dark:bg-indigo-600/80 rounded-t-sm transition-all duration-500"
                  style={{ 
                    height: `${value}%`,
                    opacity: index === usageHistory.length - 1 ? 1 : 0.3 + (index * 0.1)
                  }}
                ></div>
              ))}
            </div>
          </div> */}
          
          {/* Metrics Row */}
          <div className="w-full grid grid-cols-3 gap-4 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Voltage</p>
              <p className="font-medium text-sm">{240.0} V</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Frequency</p>
              <p className="font-medium text-sm">{49.8} Hz</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Power</p>
              <p className={`font-medium text-sm ${importing ? 'text-indigo-500' : 'text-gray-500'}`}>
                {importing ? "20.0" : "20.0"} W
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
                  <p className="text-xs text-muted-foreground">Power Factor</p>
                  <p className="font-medium">0.96</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Connection</p>
                  <p className="font-medium text-green-500">Stable</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Today's Import</p>
                  <p className="font-medium">23.7 kWh</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Max Rate</p>
                  <p className="font-medium">12.5 kW</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">Power Quality</p>
                <div className="flex items-center">
                  <div className="h-2 flex-1 bg-green-500 rounded-l"></div>
                  <div className="h-2 flex-1 bg-green-300"></div>
                  <div className="h-2 flex-1 bg-gray-300 rounded-r"></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Excellent</span>
                  <span>Good</span>
                  <span>Poor</span>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
};



export default GridStatus;