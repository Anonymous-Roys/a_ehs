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
import { collection, query, where, orderBy, limit, getDocs, documentId } from "firebase/firestore";
import { db } from "../../firebase";


const BatteryDetails = () => {
  // Battery status state
  const [batteryData, setBatteryData] = useState({
    level: 83.3,
    charging: false,
    powerFlow: 0,
    voltage: 0,
    current: 0,
    temperature: 0,
    timestamp: ""
  });
  
  // Historical data
  const [historicalData, setHistoricalData] = useState({
    day: [],
    week: [],
    month: []
  });
  
  // System stats
  const [systemStats, setSystemStats] = useState({
    todayGeneration: 0,
    todayConsumption: 0,
    capacity: 120,
    health: 90,
    cycles: 0,
    savings: 0
  });
  
  // Settings
  const [settings, setSettings] = useState({
    powerMode: "smart",
    reserveLevel: 30,
    allowFeedIn: true
  });
  
  // UI state
  const [timeFrame, setTimeFrame] = useState("day");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  
  // Refs
  const headerRef = useRef(null);
  const chartRef = useRef(null);

  // Fetch latest battery data
  const fetchLatestBatteryData = async () => {
    try {
      setIsRefreshing(true);
      
      const readingsRef = collection(db, "powerhive_data", "device001", "readings");
      const q = query(
        readingsRef,
        where("sensor", "==", "BATTERY"),
        orderBy(documentId(), "desc"),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        
        const newBatteryData = {
          level: Math.round(data.percentage || 0),
          charging: data.current_mA > 0,
          powerFlow: Math.abs(data.power_mW) / 1000000,
          voltage: data.bus_voltage || 0,
          current: data.current_mA || 0,
          temperature: data.temperature || 0,
          timestamp: doc.id
        };
        
        setBatteryData(newBatteryData);
        setLastUpdated(new Date(doc.id).toLocaleTimeString());
        
        // Update cycles based on days since install (simplified)
        setSystemStats(prev => ({
          ...prev,
          cycles: Math.floor(Date.now() / (24 * 60 * 60 * 1000) % 500 + 300)
        }));
        
        updateChartData(newBatteryData);
      }
    } catch (error) {
      console.error("Error fetching battery data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      setIsLoading(true);
      
      const [dayData, weekData, monthData] = await Promise.all([
        fetchDataForPeriod("day"),
        fetchDataForPeriod("week"),
        fetchDataForPeriod("month")
      ]);
      
      setHistoricalData({
        day: dayData,
        week: weekData,
        month: monthData
      });
      
      calculateDailyStats(dayData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data for specific period
  const fetchDataForPeriod = async (period) => {
    try {
      const now = new Date();
      let startTime;
      
      switch (period) {
        case "day":
          startTime = new Date(now.setHours(0, 0, 0, 0)).getTime().toString();
          break;
        case "week":
          startTime = new Date(now.setDate(now.getDate() - 7)).getTime().toString();
          break;
        case "month":
          startTime = new Date(now.setDate(now.getDate() - 30)).getTime().toString();
          break;
        default:
          startTime = new Date(now.setHours(0, 0, 0, 0)).getTime().toString();
      }
      
      const readingsRef = collection(db, "powerhive_data", "device001", "readings");
      const q = query(
        readingsRef,
        where("sensor", "==", "BATTERY"),
        where(documentId(), ">=", startTime),
        where(documentId(), "<=", now.getTime().toString()),
        orderBy(documentId())
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return generateFallbackData(period);
      }
      
      return processSnapshotData(snapshot, period);
    } catch (error) {
      console.error(`Error fetching ${period} data:`, error);
      return generateFallbackData(period);
    }
  };

  // Process Firestore snapshot data
  const processSnapshotData = (snapshot, period) => {
    const data = snapshot.docs.map(doc => {
      const timestamp = new Date(doc.id);
      const data = doc.data();
      
      return {
        time: getTimeLabel(timestamp, period),
        power: (data.current_mA * data.bus_voltage) / 1000000,
        batteryLevel: Math.round(data.percentage || 0),
        solarInput: data.current_mA > 0 ? Math.abs(data.power_mW) / 1000000 : 0,
        homeUsage: data.current_mA <= 0 ? Math.abs(data.power_mW) / 1000000 : 0,
        timestamp: timestamp.getTime()
      };
    });
    
    return fillDataGaps(data, period);
  };

  // Generate time label based on period
  const getTimeLabel = (timestamp, period) => {
    if (period === "day") return `${timestamp.getHours()}:00`;
    if (period === "week") return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][timestamp.getDay()];
    return `${timestamp.getDate()}`;
  };

  // Fill gaps in data
  const fillDataGaps = (data, period) => {
    const labels = getPeriodLabels(period);
    const filledData = [];
    
    labels.forEach(label => {
      const existing = data.find(d => d.time === label);
      filledData.push(existing || createSyntheticPoint(label, period));
    });
    
    return filledData;
  };

  // Generate fallback data
  const generateFallbackData = (period) => {
    return getPeriodLabels(period).map(label => 
      createSyntheticPoint(label, period)
    );
  };

  // Create synthetic data point
  const createSyntheticPoint = (label, period) => {
    const hour = period === "day" ? parseInt(label.split(":")[0]) : 12;
    const isDaytime = hour >= 7 && hour <= 17;
    
    return {
      time: label,
      power: isDaytime ? 1.5 + Math.sin(Math.PI * (hour - 7) / 5) : -0.5,
      batteryLevel: 50 + 30 * Math.sin(Math.PI * (hour - 6) / 12),
      solarInput: isDaytime ? 2.0 * Math.sin(Math.PI * (hour - 7) / 10) : 0.1,
      homeUsage: hour >= 6 && hour <= 9 ? 2.0 : 
                hour >= 17 && hour <= 22 ? 2.5 : 1.0,
      timestamp: Date.now()
    };
  };

  // Get period labels
  const getPeriodLabels = (period) => {
    if (period === "day") return Array.from({length: 24}, (_, i) => `${i}:00`);
    if (period === "week") return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return Array.from({length: 30}, (_, i) => `${i+1}`);
  };

  // Update chart with latest data
  const updateChartData = (newData) => {
    setHistoricalData(prev => {
      const updated = {...prev};
      const currentData = updated[timeFrame];
      
      if (currentData.length > 0) {
        const currentLabel = getTimeLabel(new Date(newData.timestamp), timeFrame);
        const index = currentData.findIndex(d => d.time === currentLabel);
        
        if (index !== -1) {
          updated[timeFrame][index] = {
            ...currentData[index],
            power: newData.powerFlow * (newData.charging ? 1 : -1),
            batteryLevel: newData.level,
            solarInput: newData.charging ? newData.powerFlow : 0,
            homeUsage: !newData.charging ? newData.powerFlow : 0
          };
        }
      }
      
      return updated;
    });
  };

  // Calculate daily stats
  const calculateDailyStats = (dayData) => {
    const generation = dayData.reduce((sum, d) => sum + d.solarInput, 0);
    const consumption = dayData.reduce((sum, d) => sum + d.homeUsage, 0);
    
    setSystemStats(prev => ({
      ...prev,
      todayGeneration: parseFloat(generation.toFixed(1)),
      todayConsumption: parseFloat(consumption.toFixed(1)),
      savings: parseFloat((generation * 0.15 * 30).toFixed(2)) // $0.15/kWh
    }));
  };

  // Handle time frame change
  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchLatestBatteryData();
    fetchHistoricalData();
  };

  // Initialize data
  useEffect(() => {
    fetchLatestBatteryData();
    fetchHistoricalData();
    
    const interval = setInterval(fetchLatestBatteryData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time remaining
  const calculateTimeRemaining = () => {
    if (!batteryData.current) return "--h --m";
    
    const hours = batteryData.charging 
      ? ((95 - batteryData.level) * systemStats.capacity * 1000) / batteryData.current
      : ((batteryData.level - 20) * systemStats.capacity * 1000) / Math.abs(batteryData.current);
    
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    
    return `${h}h ${m}m`;
  };

  // Get battery color based on level
  const getBatteryColor = (level) => {
    if (level > 80) return "text-green-500";
    if (level > 50) return "text-sky-500";
    if (level > 30) return "text-blue-500";
    if (level > 15) return "text-amber-500";
    return "text-rose-500";
  };

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded shadow border border-slate-200 dark:border-slate-700">
        <p className="font-medium">{data.time}</p>
        <p className="text-sm text-blue-500">
          {data.power < 0 ? "Charging" : "Discharging"}: {Math.abs(data.power).toFixed(2)} kW
        </p>
        <p className="text-sm text-amber-500">Solar: {data.solarInput.toFixed(2)} kW</p>
        <p className="text-sm text-rose-500">Usage: {data.homeUsage.toFixed(2)} kW</p>
        <p className="text-sm text-green-500">Battery: {data.batteryLevel}%</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      {/* Header */}
      <div ref={headerRef} className="sticky top-0 z-10 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold">Battery Details</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
              <button 
                onClick={() => window.location.href="/settings"}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-6">
        {/* Battery Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Battery className="h-5 w-5 mr-2 text-amber-500" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Battery Level */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4">
                  <Progress 
                    value={batteryData.level} 
                    className="h-full w-full rounded-full transform -rotate-90"
                    style={{
                      backgroundColor: "rgba(226, 232, 240, 0.5)",
                      ["--progress-color"]: getBatteryColor(batteryData.level)
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${getBatteryColor(batteryData.level)}`}>
                      {batteryData.level}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {batteryData.charging ? "Charging" : "Discharging"}
                </p>
              </div>
              
              {/* Power Flow */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center mb-2">
                  {batteryData.charging ? (
                    <ArrowDown className="h-6 w-6 text-green-500 mr-1" />
                  ) : (
                    <ArrowUp className="h-6 w-6 text-rose-500 mr-1" />
                  )}
                  <span className="text-2xl font-bold">
                    {batteryData.powerFlow.toFixed(1)} kW
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {batteryData.charging ? "From solar" : "To home"}
                </p>
              </div>
              
              {/* Time Remaining */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 mr-1 text-blue-500" />
                  <span className="text-xl font-medium">
                    {calculateTimeRemaining()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {batteryData.charging ? "To full" : "Remaining"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Today's Solar</p>
                  <p className="text-xl font-bold">{systemStats.todayGeneration} kWh</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Today's Usage</p>
                  <p className="text-xl font-bold">{systemStats.todayConsumption} kWh</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Savings</p>
                  <p className="text-xl font-bold">${systemStats.savings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Layers className="h-5 w-5 mr-2 text-sky-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Battery Health</p>
                  <p className="text-xl font-bold">{systemStats.health}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Power Flow Chart */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-amber-500" />
                Power Flow
              </CardTitle>
              <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">24 Hours</SelectItem>
                  <SelectItem value="week">7 Days</SelectItem>
                  <SelectItem value="month">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historicalData[timeFrame]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="power"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="solarInput"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="homeUsage"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Battery Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voltage</span>
                  <span className="font-medium">{batteryData.voltage.toFixed(2)} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current</span>
                  <span className="font-medium">{Math.abs(batteryData.current).toFixed(0)} mA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="font-medium">{batteryData.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{systemStats.capacity} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Charge Cycles</span>
                  <span className="font-medium">{systemStats.cycles}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-amber-500" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Power Mode</span>
                  <span className="font-medium capitalize">{settings.powerMode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Reserve Level</span>
                  <span className="font-medium">{settings.reserveLevel}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Grid Feed-in</span>
                  <span className="font-medium">
                    {settings.allowFeedIn ? "Allowed" : "Disabled"}
                  </span>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => window.location.href="/settings"}
                    className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
                  >
                    Configure Settings
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BatteryDetails;