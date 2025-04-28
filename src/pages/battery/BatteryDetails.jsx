import { useState, useEffect, useRef } from "react";
import { 
  Battery, Clock, ArrowUp, ArrowDown, Zap, 
  Calendar, ChevronDown, RefreshCw, Home, 
  Sun, Layers, Settings, Download, Upload,
  ChevronLeft, BarChart3, LineChart, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


const BatteryDetails = () => {
  const [batteryLevel, setBatteryLevel] = useState(27);
  const [charging, setCharging] = useState(true);
  const [powerFlow, setPowerFlow] = useState(2.1);
  const [timeRemaining, setTimeRemaining] = useState("5h 20m");
  const [timeRange, setTimeRange] = useState("week");
  const [powerData, setPowerData] = useState([]);
  const [todayGeneration, setTodayGeneration] = useState(12.4);
  const [todayConsumption, setTodayConsumption] = useState(15.7);
  const [batteryCapacity, setBatteryCapacity] = useState(10.2);
  const [batteryHealth, setBatteryHealth] = useState(97);
  const [cycleCount, setCycleCount] = useState(342);
  const [savings, setSavings] = useState(124.50);
  const [temperature, setTemperature] = useState(22.4);
  const [powerMode, setPowerMode] = useState("smart");
  const [timeFrame, setTimeFrame] = useState("day");
  const [reserveLevel, setReserveLevel] = useState(30); // reserve backup %
const [allowFeedIn, setAllowFeedIn] = useState(true);

  
  // Ref for the header animation
  const headerRef = useRef(null);
  
  useEffect(() => {
    // Initialize with sample data
    generatePowerData(timeFrame);
    
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
      
      // Update available capacity
      setTodayGeneration(prev => prev + (Math.random() * 0.05));
      setTodayConsumption(prev => prev + (Math.random() * 0.08));
      setTemperature(22 + Math.random() * 1.5);
      setSavings(prev => prev + (Math.random() * 0.02));
    }, 2000);
    
    // Add scroll effect for header
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
          headerRef.current.classList.add('compact-header');
        } else {
          headerRef.current.classList.remove('compact-header');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [charging, batteryLevel, timeFrame]);

  // Generate sample power data
  const generatePowerData = (period) => {
    const data = [];
    const points = period === "day" ? 24 : period === "week" ? 7 : 30;
    const labels = getPeriodLabels(period);
    
    for (let i = 0; i < points; i++) {
      let charging = Math.sin(i / (points / 4)) > 0;
      let powerValue = charging 
        ? -(Math.random() * 3 + 1) // Negative when charging (solar input)
        : (Math.random() * 2 + 0.5); // Positive when discharging
        
      // Add some variation
      if (period === "day") {
        // More solar during midday
        if (i > 6 && i < 18) {
          powerValue = powerValue * 1.5;
        }
      }
      
      data.push({
        time: labels[i],
        power: parseFloat(powerValue.toFixed(2)),
        batteryLevel: Math.min(95, Math.max(20, 40 + Math.round(powerValue * 5) + Math.round(Math.random() * 10))),
        solarInput: charging ? Math.abs(powerValue) : Math.random() * 0.5,
        homeUsage: charging ? Math.random() * 1.5 : Math.abs(powerValue) + Math.random() * 1.5
      });
    }
    
    setPowerData(data);
  };
  
  // Get labels for the chart based on time period
  const getPeriodLabels = (period) => {
    if (period === "day") {
      return Array.from({length: 24}, (_, i) => `${i}:00`);
    } else if (period === "week") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    } else {
      return Array.from({length: 30}, (_, i) => `${i+1}`);
    }
  };

  // Change time frame and regenerate data
  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
    generatePowerData(newTimeFrame);
  };
  
  // Get status color based on battery level
  const getBatteryColor = () => {
    if (batteryLevel > 80) return "text-green-500";
    if (batteryLevel > 50) return "text-sky-500";
    if (batteryLevel > 30) return "text-blue-500";
    if (batteryLevel > 15) return "text-amber-500";
    return "text-rose-500";
  };
  
  // Get background color based on battery level
  const getBatteryBgColor = () => {
    if (batteryLevel > 80) return "bg-green-100 dark:bg-green-900/30";
    if (batteryLevel > 50) return "bg-sky-100 dark:bg-sky-900/30";
    if (batteryLevel > 30) return "bg-blue-100 dark:bg-blue-900/30";
    if (batteryLevel > 15) return "bg-amber-100 dark:bg-amber-900/30";
    return "bg-rose-100 dark:bg-rose-900/30";
  };
  
  // Get progress bar color based on battery level
  const getProgressColor = () => {
    if (batteryLevel > 80) return "#10B981"; // green
    if (batteryLevel > 50) return "#0EA5E9"; // sky
    if (batteryLevel > 30) return "#3B82F6"; // blue
    if (batteryLevel > 15) return "#F59E0B"; // amber
    return "#F43F5E"; // rose
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium">{data.time}</p>
          <p className="text-sm text-blue-500">
            {data.power < 0 ? "Charging" : "Discharging"}: {Math.abs(data.power).toFixed(2)} kW
          </p>
          <p className="text-sm text-amber-500">Solar Input: {data.solarInput.toFixed(2)} kW</p>
          <p className="text-sm text-rose-500">Home Usage: {data.homeUsage.toFixed(2)} kW</p>
          <p className="text-sm text-green-500">Battery Level: {data.batteryLevel}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      {/* Sticky Header with Battery Status */}
      <div 
        ref={headerRef}
        className="sticky top-0 z-10 transition-all duration-500 py-6 bg-gradient-to-b from-slate-50 to-slate-50/95 dark:from-slate-900 dark:to-slate-900/95 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()} 
                className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold">PowerHive Details</h1>
                <p className="text-sm text-muted-foreground">Home Energy Storage System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <RefreshCw className="h-5 w-5" />
              </button>
              <button onClick={() => window.location.href="/battery-details/battery-settings"} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Battery Status Card */}
          <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center">
              {/* Battery Icon */}
              <div className="relative mr-4">
                <div className={`absolute inset-0 rounded-full ${getBatteryBgColor()} transition-colors duration-1000`}></div>
                <Battery 
                  className={`h-12 w-12 ${getBatteryColor()} relative z-10`} 
                  strokeWidth={1.5}
                />
                {charging && (
                  <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                )}
              </div>
              
              {/* Battery Status */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <h3 className={`text-xl font-bold ${getBatteryColor()}`}>{batteryLevel}%</h3>
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      charging 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {charging ? "Charging" : "Discharging"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {charging 
                      ? `${timeRemaining} until full` 
                      : `${timeRemaining} remaining`}
                  </div>
                </div>
                
                {/* Progress Bar */}
                {/* <div className="relative h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <Progress 
                    value={batteryLevel} 
                    className="h-2 transition-all duration-1000"
                    style={{
                      background: `linear-gradient(90deg, ${getProgressColor()} 0%, ${getProgressColor()}cc ${batteryLevel}%)`,
                    }}
                  />
                  {charging && (
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent to-white/30 dark:to-white/20 animate-shimmer"
                      style={{ width: `${batteryLevel}%` }}
                    ></div>
                  )}
                </div> */}
                
                {/* Quick Stats */}
                {/* <div className="flex mt-2 text-sm">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="font-medium">{Math.round(batteryCapacity * batteryLevel / 100 * 10) / 10} kWh</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="font-medium">{batteryCapacity} kWh</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-muted-foreground">Power</p>
                    <p className={`font-medium ${charging ? 'text-blue-500' : 'text-rose-500'}`}>
                      {charging ? "+" : "-"}{powerFlow} kW
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-6">
        {/* Energy Flow Visualization */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader>
            <CardTitle>Energy Flow</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative h-60 bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
              {/* Sun */}
              <div className="absolute top-4 left-1/4 transform -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-300 rounded-full opacity-20 animate-pulse-slow"></div>
                  <Sun className="h-16 w-16 text-amber-500" strokeWidth={1.5} />
                </div>
                <p className="text-center font-medium mt-1">{todayGeneration.toFixed(1)} kWh</p>
              </div>
              
              {/* House */}
              <div className="absolute top-4 right-1/4 transform translate-x-1/2">
                <div className="relative">
                  <Home className="h-16 w-16 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                </div>
                <p className="text-center font-medium mt-1">{todayConsumption.toFixed(1)} kWh</p>
              </div>
              
              {/* Battery */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full ${getBatteryBgColor()} opacity-50`}></div>
                  <Battery className={`h-16 w-16 ${getBatteryColor()}`} strokeWidth={1.5} />
                  <p className="absolute inset-0 flex items-center justify-center font-bold text-lg">{batteryLevel}%</p>
                </div>
                <p className="text-center font-medium mt-1">{(batteryCapacity * batteryLevel / 100).toFixed(1)} kWh</p>
              </div>
              
              {/* Connecting Lines with Animated Flows */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Sun to Battery */}
                <line 
                  x1="25%" y1="15%" 
                  x2="50%" y2="75%" 
                  stroke="#3B82F6" 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                  className="animate-dash-flow"
                />
                
                {/* House to Battery or Battery to House */}
                <line 
                  x1="75%" y1="15%" 
                  x2="50%" y2="75%" 
                  stroke={charging ? "#22C55E" : "#F43F5E"} 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                  className="animate-dash-flow-reverse"
                />
                
                {/* Flow indicators */}
                <circle 
                  cx="37.5%" cy="45%" r="3" 
                  fill="#3B82F6" 
                  className="animate-flow-dot"
                />
                <circle 
                  cx="62.5%" cy="45%" r="3" 
                  fill={charging ? "#22C55E" : "#F43F5E"} 
                  className="animate-flow-dot-reverse"
                />
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-3 right-3">
                <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2 shadow-sm text-xs">
                  <div className="flex items-center mb-1">
                    <div className="h-2 w-4 bg-blue-500 rounded mr-2"></div>
                    <span>Solar Input</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-4 bg-rose-500 rounded mr-2"></div>
                    <span>Home Usage</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Power Chart */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Power Trends</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={powerData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => `${value} kW`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="power" 
                    stroke="#3B82F6" 
                    fillOpacity={1}
                    fill="url(#colorPower)"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center mt-4 px-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-6 bg-gradient-to-t from-blue-100 to-blue-500 rounded mr-2"></div>
                  <span>Charging (- kW)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-6 bg-gradient-to-t from-rose-100 to-rose-500 rounded mr-2"></div>
                  <span>Discharging (+ kW)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Battery Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Battery Health & Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Battery Health</span>
                  <div className="flex items-center">
                    <span className="font-medium text-green-500">{batteryHealth}%</span>
                    <div className="ml-2 w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${batteryHealth}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cycle Count</span>
                  <span className="font-medium">{cycleCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="font-medium">{temperature.toFixed(1)}°C</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Efficiency</span>
                  <span className="font-medium">94.2%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Full Charge</span>
                  <span className="font-medium">Yesterday, 8:42 PM</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Firmware Version</span>
                  <span className="font-medium">v2.4.1</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Energy Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center my-4">
                <h3 className="text-3xl font-bold text-green-500">${savings.toFixed(2)}</h3>
                <p className="text-muted-foreground">This month's savings</p>
              </div>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Grid Energy Offset</span>
                  <span className="font-medium text-green-500">78%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Peak Shaving</span>
                  <span className="font-medium">4.2 kWh</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CO₂ Reduction</span>
                  <span className="font-medium">342 kg</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Savings YTD</span>
                  <span className="font-medium text-green-500">$1,287.45</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
        </div>
      )}

export default BatteryDetails;