import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Sun, Battery, CloudSun } from "lucide-react";
import { db } from "../../firebase";
import { collection, query, orderBy, limit, getDocs, documentId } from "firebase/firestore";

const SolarStatus = () => {
  const [solarOutput, setSolarOutput] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [dailyTrend] = useState([25, 30, 45, 60, 75, 82, 78, 68]);

  useEffect(() => {
    const fetchLatestSolarData = async () => {
      try {
        // Reference to the readings collection for device001
        const readingsRef = collection(db, "powerhive_data", "device001", "readings");
        
        // Create query to get the most recent document (sorted by document ID which is the timestamp)
        const q = query(
          readingsRef,
          orderBy(documentId(), "desc"),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0];
          const data = latestDoc.data();
          
          // Check if the sensor is solar
          if (data.sensor === "SOLAR") {
            const newSolarOutput = data.power_mW || 0;
            const newGenerating = newSolarOutput > 10;
            setSolarOutput(newSolarOutput);
            setGenerating(newGenerating);
            setLastUpdated(new Date(latestDoc.id).toLocaleTimeString());
          }
        } else {
          console.log("No solar data available");
        }
      } catch (error) {
        console.error("Error fetching solar data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestSolarData();
    
    // Set up polling to refresh data every 10 seconds
    const interval = setInterval(fetchLatestSolarData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate estimated power in kW based on percentage
  const estimatedPower = (5.8 * solarOutput / 100).toFixed(1);

  // Determine color based on output
  const getOutputColor = (value) => {
    if (value > 70) return "text-green-500";
    if (value > 40) return "text-amber-500";
    return "text-gray-400";
  };

  if (isLoading) {
    return (
      <Card className="w-full shadow-lg border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      onClick={() => window.location.href="/solar-details"} 
      className="solar-card w-full shadow-lg border-0 overflow-hidden cursor-pointer transition-all duration-300 
        bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800
        hover:from-sky-100 hover:to-sky-200 dark:hover:from-sky-900 dark:hover:to-sky-800"
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Solar Icon with Animation */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20"></div>
            <div className={`absolute inset-0 rounded-full ${generating ? 'animate-pulse' : ''} opacity-70`}>
              {generating && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-amber-300/30 dark:border-amber-400/20 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 dark:border-amber-500/30 animate-pulse"></div>
                </>
              )}
            </div>
            <Sun 
              className={`h-10 w-10 ${generating ? 'text-amber-500 animate-spin-slow' : 'text-gray-400'}`} 
              strokeWidth={1.5} 
              style={{ animationDuration: '30s' }}
            />
            {generating && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="animate-rays">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute h-1 bg-amber-400/40 dark:bg-amber-500/30"
                      style={{
                        width: '120%',
                        transformOrigin: 'center',
                        transform: `rotate(${i * 45}deg) translateX(10px)`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Status and Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl font-medium">Solar System</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${generating 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                {generating ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <CloudSun className="h-4 w-4" />
              {generating 
                ? `Generating ${estimatedPower} kW now` 
                : "No power generation"}
              <span className="text-xs opacity-70 ml-2">({lastUpdated})</span>
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Output</span>
              <span className={`font-medium ${getOutputColor(solarOutput)}`}>
                {solarOutput}%
              </span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Progress 
                value={solarOutput} 
                className="h-2 transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, #FFB624 0%, #FFD700 ${solarOutput}%)`,
                }}
              />
              {generating && (
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent to-white/30 dark:to-white/20 animate-shimmer"
                  style={{ width: `${solarOutput}%` }}
                ></div>
              )}
            </div>
          </div>
          
          {/* Metrics Row */}
          <div className="w-full grid grid-cols-3 gap-4 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="font-medium text-sm">5.8 kW</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Today's</p>
              <p className="font-medium text-sm">18.4 kWh</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">To Battery</p>
              <div className="flex items-center justify-center">
                <Battery className="h-4 w-4 mr-1 text-green-500" />
                <p className="font-medium text-sm">32%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolarStatus;