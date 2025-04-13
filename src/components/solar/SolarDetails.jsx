import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { ArrowLeft, Sun, Battery, CloudSun, Calendar, Clock, Zap, BarChart3, TrendingUp, Leaf } from "lucide-react";

const SolarDetailsPage = () => {
  const [solarOutput, setSolarOutput] = useState(68);
  const [generating, setGenerating] = useState(true);
  const [dailyTrend, setDailyTrend] = useState([25, 30, 45, 60, 75, 82, 78, 68]);
  const [hourlyData, setHourlyData] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  
  useEffect(() => {
    // Simulate solar output changes
    const interval = setInterval(() => {
      const newValue = solarOutput + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
      const boundedValue = Math.max(0, Math.min(95, newValue));
      setSolarOutput(boundedValue);
      setGenerating(boundedValue > 10);
      
      // Update trend with new value
      if (dailyTrend.length >= 12) {
        setDailyTrend(prev => [...prev.slice(1), boundedValue]);
      } else {
        setDailyTrend(prev => [...prev, boundedValue]);
      }
    }, 3000);
    
    // Generate hourly data for the charts
    generateHourlyData();
    
    return () => clearInterval(interval);
  }, [solarOutput]);
  
  const generateHourlyData = () => {
    const hours = [];
    const now = new Date();
    const currentHour = now.getHours();
    
    // Generate data for past hours
    for (let i = 6; i <= currentHour; i++) {
      const timeString = `${i}:00`;
      // Higher values mid-day, lower in morning/evening
      let value = 0;
      if (i < 9) value = 10 + Math.random() * 30;
      else if (i < 12) value = 40 + Math.random() * 30;
      else if (i < 15) value = 60 + Math.random() * 35;
      else if (i < 18) value = 40 + Math.random() * 30;
      else value = 10 + Math.random() * 20;
      
      hours.push({ time: timeString, output: Math.floor(value) });
    }
    
    // Generate estimated data for future hours
    for (let i = currentHour + 1; i <= 20; i++) {
      const timeString = `${i}:00`;
      // Estimated values - declining as day progresses
      let value = 0;
      if (i < 12) value = 40 + Math.random() * 30;
      else if (i < 15) value = 60 + Math.random() * 35;
      else if (i < 18) value = 40 + Math.random() * 30;
      else value = 10 + Math.random() * 20;
      
      hours.push({ 
        time: timeString, 
        output: Math.floor(value),
        estimated: true
      });
    }
    
    setHourlyData(hours);
  };
  
  // Calculate estimated power in kW based on percentage
  const estimatedPower = (5.8 * solarOutput / 100).toFixed(1);
  
  // Determine color based on output
  const getOutputColor = (value) => {
    if (value > 70) return "text-green-500";
    if (value > 40) return "text-amber-500";
    return "text-gray-400";
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => window.location.href="/"}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold ml-4">Solar System Analytics</h1>
      </div>
      
      {/* Current Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-1 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Sun className="h-5 w-5 mr-2 text-amber-500" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20"></div>
                {generating && (
                  <div className="absolute inset-0 rounded-full opacity-70">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-300/30 dark:border-amber-400/20 animate-pulse"></div>
                  </div>
                )}
                <Sun 
                  className={`h-10 w-10 ${generating ? 'text-amber-500' : 'text-gray-400'}`} 
                  strokeWidth={1.5}
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${generating 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {generating ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm flex items-center justify-center gap-1">
                  <CloudSun className="h-4 w-4" />
                  {generating 
                    ? `Generating ${estimatedPower} kW now` 
                    : "No power generation"}
                </p>
              </div>
              
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Output</span>
                  <span className={`font-medium ${getOutputColor(solarOutput)}`}>
                    {solarOutput}%
                  </span>
                </div>
                <Progress 
                  value={solarOutput} 
                  className="h-2 transition-all duration-1000"
                />
              </div>
              
              <div className="w-full grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="font-medium text-sm">5.8 kW</p>
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
        
        {/* Summary Stats */}
        <Card className="md:col-span-2 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Energy Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center text-amber-500 mb-1">
                  <Clock className="h-5 w-5 mr-1" />
                </div>
                <p className="text-xs text-muted-foreground">Today's Energy</p>
                <p className="text-xl font-medium">18.4 kWh</p>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center text-green-500 mb-1">
                  <Calendar className="h-5 w-5 mr-1" />
                </div>
                <p className="text-xs text-muted-foreground">Monthly Total</p>
                <p className="text-xl font-medium">342 kWh</p>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center text-blue-500 mb-1">
                  <Zap className="h-5 w-5 mr-1" />
                </div>
                <p className="text-xs text-muted-foreground">Peak Today</p>
                <p className="text-xl font-medium">3.9 kW</p>
                <p className="text-xs text-muted-foreground">at 1:24 PM</p>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center text-green-600 mb-1">
                  <Leaf className="h-5 w-5 mr-1" />
                </div>
                <p className="text-xs text-muted-foreground">CO₂ Avoided</p>
                <p className="text-xl font-medium">186 kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Power Output Chart */}
      <Card className="shadow-md mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <BarChart3 className="h-5 w-5 mr-2 text-amber-500" />
            Power Output
          </CardTitle>
        </CardHeader>
          <Tabs defaultValue="today" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-xs grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
         
        <CardContent>
          <TabsContent value="today" className="mt-0">
            <div className="h-64">
              {/* Power Output Chart */}
              <div className="flex flex-col h-full">
                <div className="flex-1 relative">
                  {/* Chart bars */}
                  <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
                    {hourlyData.map((hour, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div 
                          className={`w-full max-w-8 rounded-t 
                            ${hour.estimated 
                              ? 'bg-amber-300/50 dark:bg-amber-400/30' 
                              : 'bg-amber-500 dark:bg-amber-500'}`}
                          style={{ height: `${hour.output}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="h-6 flex text-xs text-muted-foreground mt-1">
                  {hourlyData.map((hour, index) => (
                    <div key={index} className="flex-1 text-center">
                      {index % 2 === 0 ? hour.time : ''}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center mt-4 text-xs">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-amber-500 mr-1 rounded"></div>
                  <span>Actual</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-300/50 mr-1 rounded"></div>
                  <span>Estimated</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="mt-0">
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Weekly data visualization would appear here
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="mt-0">
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Monthly data visualization would appear here
            </div>
          </TabsContent>
        </CardContent>
        </Tabs>
      </Card>
      
      {/* System Health & Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Panel Efficiency</span>
                <span className="font-medium text-green-500">Excellent (98%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inverter Status</span>
                <span className="font-medium text-green-500">Optimal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Maintenance</span>
                <span className="font-medium">March 15, 2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Next Checkup</span>
                <span className="font-medium">September 15, 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Environmental Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">CO₂ Avoided (Today)</span>
                <span className="font-medium">8.3 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">CO₂ Avoided (Month)</span>
                <span className="font-medium">186 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">CO₂ Avoided (Year)</span>
                <span className="font-medium">2,147 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Equivalent Trees Planted</span>
                <span className="font-medium">96 trees</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SolarDetailsPage;