import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, orderBy, limit, getDocs, documentId } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { ArrowLeft, Sun, Battery, CloudSun, Calendar, Clock, Zap, BarChart3, TrendingUp, Leaf } from "lucide-react";
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  LineElement, 
  PointElement, 
  LinearScale,
  Title, 
  Tooltip, 
  Legend,
  CategoryScale,
  TimeScale,
  TimeSeriesScale
} from 'chart.js';

// Register the necessary elements
ChartJS.register(
  LineElement, 
  PointElement, 
  LinearScale,
  CategoryScale,
  Title, 
  Tooltip, 
  Legend,
  TimeScale,
  TimeSeriesScale
);

const SolarDetailsPage = () => {
  const [solarData, setSolarData] = useState({
    bus_voltage: 0,
    shunt_voltage: 0,
    current_mA: 0,
    power_mW: 0,
    timestamp: ""
  });
  const [generating, setGenerating] = useState(false);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate solar output percentage (assuming 5.8kW system)
  const solarOutput = Math.min(100, Math.round((solarData.power_mW / 5800) * 100));

  useEffect(() => {
    const fetchSolarData = async () => {
      try {
        // Fetch latest reading
        const readingsRef = collection(db, "powerhive_data", "device001", "readings");
        const latestQuery = query(
          readingsRef,
          orderBy(documentId(), "desc"),
          limit(1)
        );
        
        const latestSnapshot = await getDocs(latestQuery);
        
        if (!latestSnapshot.empty) {
          const doc = latestSnapshot.docs[0];
          const data = doc.data();
          
          if (data.sensor === "SOLAR") {
            setSolarData({
              bus_voltage: data.bus_voltage || 0,
              shunt_voltage: data.shunt_voltage || 0,
              current_mA: data.current_mA || 0,
              power_mW: data.power_mW || 0,
              timestamp: doc.id
            });
            setGenerating(data.power_mW > 1000); // Consider generating if > 1W
          }
        }

        // Fetch historical data for charts (last 24 hours)
        const historicalQuery = query(
          readingsRef,
          orderBy(documentId(), "desc"),
          limit(24)
        );
        
        const historicalSnapshot = await getDocs(historicalQuery);
        const historicalData = historicalSnapshot.docs
          .map(doc => ({
            time: new Date(doc.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            output: doc.data().power_mW / 1000, // Convert to kW
            voltage: doc.data().bus_voltage,
            current: doc.data().current_mA
          }))
          .reverse(); // Oldest first
        
        setHourlyData(historicalData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching solar data:", err);
        setError("Failed to load solar data");
        setLoading(false);
      }
    };

    fetchSolarData();
    
    // Set up polling to refresh data every 10 seconds
    const interval = setInterval(fetchSolarData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const generateChartData = (data) => {
    return {
      labels: data.map(item => item.time),
      datasets: [{
        label: "Power Output (kW)",
        data: data.map(item => item.output),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
        tension: 0.1,
        fill: true
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw.toFixed(2)} kW`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Power (kW)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  // Calculate estimated power in kW
  const estimatedPower = (solarData.power_mW / 1000).toFixed(2);

  // Calculate today's total energy (kWh) - simplified calculation
  const todaysEnergy = hourlyData.length > 0 
    ? (hourlyData.reduce((sum, item) => sum + item.output, 0) / hourlyData.length * 24)
    : 0;

  // Determine color based on output
  const getOutputColor = (value) => {
    if (value > 70) return "text-green-500";
    if (value > 40) return "text-amber-500";
    return "text-gray-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading solar data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back to the dashboard"
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
                    ? `Generating ${estimatedPower} kW` 
                    : "No power generation"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(solarData.timestamp).toLocaleString()}
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

              <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Voltage</p>
                  <p className="font-medium">{solarData.bus_voltage.toFixed(2)} V</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="font-medium">{solarData.current_mA.toFixed(0)} mA</p>
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
                <p className="text-xl font-medium">{todaysEnergy.toFixed(1)} kWh</p>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center text-green-500 mb-1">
                  <Calendar className="h-5 w-5 mr-1" />
                </div>
                <p className="text-xs text-muted-foreground">Monthly Total</p>
                <p className="text-xl font-medium">{(todaysEnergy * 30).toFixed(0)} kWh</p>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center text-blue-500 mb-1">
                  <Zap className="h-5 w-5 mr-1" />
                </div>
                <p className="text-xs text-muted-foreground">Peak Today</p>
                <p className="text-xl font-medium">
                  {hourlyData.length > 0 
                    ? Math.max(...hourlyData.map(item => item.output)).toFixed(2) 
                    : "0.00"} kW
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center text-green-600 mb-1">
                  <Leaf className="h-5 w-5 mr-1" />
                </div>
                <p className="text-xs text-muted-foreground">CO₂ Avoided</p>
                <p className="text-xl font-medium">{(todaysEnergy * 0.5).toFixed(1)} kg</p>
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
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-0">
            <div className="h-64 p-4">
              <Line 
                data={generateChartData(hourlyData)} 
                options={chartOptions}
              />
            </div>
          </TabsContent>
          <TabsContent value="week" className="mt-0">
            <div className="h-64 p-4">
              <p className="text-center text-muted-foreground py-16">
                Weekly data visualization would be implemented with actual 7-day data
              </p>
            </div>
          </TabsContent>
          <TabsContent value="month" className="mt-0">
            <div className="h-64 p-4">
              <p className="text-center text-muted-foreground py-16">
                Monthly data visualization would be implemented with actual 30-day data
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SolarDetailsPage;