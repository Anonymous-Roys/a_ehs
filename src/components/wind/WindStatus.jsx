import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Wind, Battery, ChevronUp, CloudSun, ArrowRight } from "lucide-react";

const WindStatus = () => {
  const [windOutput, setWindOutput] = useState(68);
  const [generating, setGenerating] = useState(true);
  const [dailyTrend, setDailyTrend] = useState([25, 30, 45, 60, 75, 82, 78, 68]);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = windOutput + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
      const boundedValue = Math.max(0, Math.min(95, newValue));
      setWindOutput(boundedValue);
      setGenerating(boundedValue > 10);

      if (dailyTrend.length >= 12) {
        setDailyTrend(prev => [...prev.slice(1), boundedValue]);
      } else {
        setDailyTrend(prev => [...prev, boundedValue]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [windOutput, dailyTrend]);

  const estimatedPower = (5.8 * windOutput / 100).toFixed(1);

  const getOutputColor = (value) => {
    if (value > 70) return "text-green-500";
    if (value > 40) return "text-amber-500";
    return "text-gray-400";
  };

  return (
    <Card onClick={() => window.location.href="/wind-details"} className="w-fullhover:from-sky-100 hover:to-sky-200 dark:hover:from-sky-900 dark:hover:to-sky-800 cursor-pointer  shadow-lg border-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* Wind Icon and Animation */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 dark:from-sky-900/30 dark:to-sky-800/20"></div>
            <div className={`absolute inset-0 rounded-full ${generating ? 'animate-pulse' : ''} opacity-70`}>
              {generating && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-sky-300/30 dark:border-sky-400/20 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-sky-400/40 dark:border-sky-500/30 animate-pulse"></div>
                </>
              )}
            </div>
            <Wind 
              className={`h-10 w-10 ${generating ? 'text-sky-500 animate-spin-slow' : 'text-gray-400'}`} 
              strokeWidth={1.5} 
              style={{ animationDuration: '30s' }}
            />
          </div>

          {/* Status Info */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl font-medium">Wind Turbine</h3>
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
            </p>
          </div>

          {/* Output Progress */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Output</span>
              <span className={`font-medium ${getOutputColor(windOutput)}`}>
                {windOutput}%
              </span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Progress 
                value={windOutput} 
                className="h-2 transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, #38BDF8 0%, #0EA5E9 ${windOutput}%)`,
                }}
              />
              {generating && (
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent to-white/30 dark:to-white/20 animate-shimmer"
                  style={{ width: `${windOutput}%` }}
                ></div>
              )}
            </div>
          </div>

          {/* Metrics Row */}
          <div className="w-full grid grid-cols-3 gap-4 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="font-medium text-sm">5.8 W</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Today's</p>
              <p className="font-medium text-sm">18.4 Wh</p>
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

export default WindStatus;
