import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Battery, Clock, ArrowUp, ArrowDown, Zap } from "lucide-react";
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const BatteryStatus = () => {
  // State variables for battery data
  const [batteryLevel, setBatteryLevel] = useState(50);
  const [charging, setCharging] = useState(false);
  const [powerFlow, setPowerFlow] = useState(0);
  const [chargeHistory, setChargeHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState("--h --m");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState(10.2); // kWh
  const [availableCapacity, setAvailableCapacity] = useState(0);
  const [batteryHealth, setBatteryHealth] = useState(100); // Percentage
  const [rawData, setRawData] = useState(null); // For storing and displaying raw data in console

  // Fetch latest battery data from Firebase
  const fetchLatestBatteryData = async () => {
    try {
      setIsLoading(true);
      
      // Reference to the readings collection for device001
      const deviceId = "device001"; // This could be dynamic or from a configuration
      const readingsRef = collection(db, "powerhive_data", deviceId, "readings");
      
      // Create query to get the most recent document with sensor type "Battery"
      const q = query(
        readingsRef,
        where("sensor", "==", "Battery"), // Updated to match your data sample
        orderBy("timestamp", "desc"), // Using timestamp field for ordering instead of documentId
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const latestDoc = querySnapshot.docs[0];
        const data = latestDoc.data();
        
        // Store raw data for console logging
        setRawData(data);
        console.log("Latest Battery Data:", data);
        
        // Update battery states with fetched data - mapping from the data fields in your sample
        const newBatteryLevel = Math.round(data.percentage || 0);
        setBatteryLevel(newBatteryLevel);
        
        // Determine charging state based on current
        // Negative current means discharging (as per your data sample)
        const isCharging = data.current > 0;
        setCharging(isCharging);
        
        // Calculate power flow in kW from power field
        // Your data shows power in watts, so divide by 1000 for kW
        const powerFlowKW = Math.abs(data.power) / 1000;
        setPowerFlow(Math.round(powerFlowKW * 10) / 10); // Round to 1 decimal place
        
        // Update battery capacity from data if available
        if (data.capacity_mAh) {
          // Convert mAh to kWh (approximation, using nominal voltage)
          const nominalVoltage = data.bus_voltage || 12; // Use bus_voltage if available
          const capacityKWh = (data.capacity_mAh * nominalVoltage) / 1000000;
          setBatteryCapacity(capacityKWh);
        }
        
        // Calculate available capacity
        const availableKWh = (batteryCapacity * newBatteryLevel / 100).toFixed(1);
        setAvailableCapacity(parseFloat(availableKWh));
        
        // Update charge history
        setChargeHistory(prev => {
          if (prev.length >= 12) {
            return [...prev.slice(1), newBatteryLevel];
          }
          return [...prev, newBatteryLevel];
        });
        
        // Calculate time remaining based on capacity and current
        calculateTimeRemaining(data.percentage, data.current, data.capacity_mAh);
        
        // Update last updated timestamp
        const timestamp = data.timestamp instanceof Date 
          ? data.timestamp 
          : new Date(data.timestamp);
        setLastUpdated(timestamp.toLocaleTimeString());
      } else {
        console.log("No battery data available");
      }
    } catch (error) {
      console.error("Error fetching battery data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate time remaining
  const calculateTimeRemaining = (percentage, current, capacityMah) => {
    if (!percentage || current === undefined || !capacityMah) {
      setTimeRemaining("--h --m");
      return;
    }

    // Convert current to mA if needed
    const currentMa = Math.abs(current) * 1000;

    if (current > 0) {
      // Charging: calculate time to full (95%)
      const capacityToFull = capacityMah * ((95 - percentage) / 100);
      const hoursToFull = capacityToFull / currentMa;
      
      const hours = Math.floor(hoursToFull);
      const minutes = Math.round((hoursToFull - hours) * 60);
      
      setTimeRemaining(`${hours}h ${minutes}m`);
    } else if (current < 0) {
      // Discharging: calculate time to empty (20%)
      const usableCapacity = capacityMah * ((percentage - 20) / 100);
      const hoursToEmpty = usableCapacity / currentMa;
      
      const hours = Math.floor(hoursToEmpty);
      const minutes = Math.round((hoursToEmpty - hours) * 60);
      
      setTimeRemaining(`${hours}h ${minutes}m`);
    } else {
      // Current is 0, battery idle
      setTimeRemaining("Idle");
    }
  };

  // Function to manually trigger data fetch (for testing)
  const manualRefresh = () => {
    console.log("Manual refresh triggered");
    fetchLatestBatteryData();
  };

  // Fetch data on component mount and set interval for periodic updates
  useEffect(() => {
    // Initial fetch
    fetchLatestBatteryData();
    
    // Set interval for regular updates
    const interval = setInterval(() => {
      fetchLatestBatteryData();
    }, 30000); // Fetch every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

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
    <Card 
    onClick={() => window.location.href="/battery-details"}
      className="battery-card w-full shadow-lg border-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 hover:from-sky-100 hover:to-sky-200 cursor-pointer dark:hover:from-sky-900 dark:hover:to-sky-800"
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
        
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
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Battery Level</span>
              <span className={`font-medium ${getBatteryColor()}`}>
                {0}%
              </span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Progress 
                value={0} 
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
          
          {/* Power Stats */}
          <div className="w-full grid grid-cols-3 gap-4 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="font-medium text-sm">{0.0} Wh</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="font-medium text-sm">{100} Wh</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Power</p>
              <p className={`font-medium text-sm ${charging ? 'text-blue-500' : 'text-rose-500'}`}>
                {charging ? "+" : "-"}{0} W
              </p>
            </div>
          </div>
          
          {/* Debug button - for testing only */}
          {/* <button 
            onClick={manualRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Data
          </button> */}
          
          {/* Raw data display - for testing only */}
          {/* {rawData && (
            <div className="w-full text-left bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs overflow-auto">
              <pre>{JSON.stringify(rawData, null, 2)}</pre>
            </div>
          )} */}
          
          {isLoading && (
            <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-800/50 flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-t-blue-500 border-slate-200 rounded-full animate-spin"></div>
            </div>
          )}                  
        </div>
      </CardContent>
    </Card>
  );
};

export default BatteryStatus;