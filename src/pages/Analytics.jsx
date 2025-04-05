import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Daily energy data
const dailyData = [
  { time: "00:00", solar: 0, battery: 0.8, grid: 0.7, load: 1.5 },
  { time: "03:00", solar: 0, battery: 0.5, grid: 1.2, load: 1.7 },
  { time: "06:00", solar: 0.8, battery: 0.2, grid: 0.5, load: 1.5 },
  { time: "09:00", solar: 3.2, battery: 0, grid: 0, load: 2.2 },
  { time: "12:00", solar: 5.1, battery: 0, grid: 0, load: 2.8 },
  { time: "15:00", solar: 4.2, battery: 0, grid: 0, load: 3.1 },
  { time: "18:00", solar: 1.5, battery: 0.5, grid: 1.1, load: 3.1 },
  { time: "21:00", solar: 0, battery: 1.2, grid: 1.3, load: 2.5 },
];

// Weekly energy data
const weeklyData = [
  { day: "Mon", solar: 18.4, battery: 7.2, grid: 9.8, load: 35.4 },
  { day: "Tue", solar: 22.1, battery: 8.5, grid: 7.3, load: 37.9 },
  { day: "Wed", solar: 16.5, battery: 6.8, grid: 12.4, load: 35.7 },
  { day: "Thu", solar: 21.8, battery: 9.2, grid: 6.9, load: 37.9 },
  { day: "Fri", solar: 19.7, battery: 7.8, grid: 8.9, load: 36.4 },
  { day: "Sat", solar: 24.3, battery: 11.2, grid: 4.3, load: 39.8 },
  { day: "Sun", solar: 23.9, battery: 10.8, grid: 5.1, load: 39.8 },
];

// Source distribution data
const sourceData = [
  { name: "Solar", value: 58 },
  { name: "Battery", value: 22 },
  { name: "Grid", value: 20 },
];

// Cost savings data
const savingsData = [
  { month: "Jan", savings: 78 },
  { month: "Feb", savings: 82 },
  { month: "Mar", savings: 95 },
  { month: "Apr", savings: 110 },
  { month: "May", savings: 125 },
  { month: "Jun", savings: 138 },
  { month: "Jul", savings: 148 },
  { month: "Aug", savings: 145 },
  { month: "Sep", savings: 130 },
  { month: "Oct", savings: 115 },
  { month: "Nov", savings: 95 },
  { month: "Dec", savings: 85 },
];

const COLORS = ["#FFB624", "#0EA5E9", "#6366F1", "#F43F5E"];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <h2 className="text-xl font-medium">Loading Analytics</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-28 animate-fade-in">
        <h1 className="text-3xl font-medium tracking-tight mb-10">Energy Analytics</h1>
        
        <Tabs defaultValue="consumption" className="mb-10">
          <TabsList className="mb-6">
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="consumption" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="energy-card">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Daily Energy Consumption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                          label={{ 
                            value: 'kW', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fontSize: 12, opacity: 0.6 }
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                          itemStyle={{ fontSize: 12 }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="solar" 
                          stackId="1" 
                          stroke="#FFB624" 
                          fill="#FFB624" 
                          name="Solar"
                          fillOpacity={0.7}
                          strokeWidth={2}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="battery" 
                          stackId="1" 
                          stroke="#0EA5E9" 
                          fill="#0EA5E9" 
                          name="Battery"
                          fillOpacity={0.7}
                          strokeWidth={2}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="grid" 
                          stackId="1" 
                          stroke="#6366F1" 
                          fill="#6366F1" 
                          name="Grid"
                          fillOpacity={0.7}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="load"
                          stroke="#F43F5E"
                          fill="none"
                          name="Load"
                          strokeWidth={3}
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="energy-card">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Weekly Energy Consumption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                          label={{ 
                            value: 'kWh', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fontSize: 12, opacity: 0.6 }
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                          itemStyle={{ fontSize: 12 }}
                        />
                        <Legend 
                          iconType="circle" 
                          iconSize={8}
                          wrapperStyle={{ fontSize: 12, padding: '10px 0' }}
                        />
                        <Bar 
                          dataKey="solar" 
                          name="Solar" 
                          stackId="a" 
                          fill="#FFB624"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="battery" 
                          name="Battery" 
                          stackId="a" 
                          fill="#0EA5E9"
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar 
                          dataKey="grid" 
                          name="Grid" 
                          stackId="a" 
                          fill="#6366F1"
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar 
                          dataKey="load" 
                          name="Total Load" 
                          fill="none" 
                          stroke="#F43F5E"
                          strokeWidth={2}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="production" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="energy-card md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Energy Sources Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                          label={{ 
                            value: 'kWh', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fontSize: 12, opacity: 0.6 }
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                          itemStyle={{ fontSize: 12 }}
                        />
                        <Legend 
                          iconType="circle" 
                          iconSize={8}
                          wrapperStyle={{ fontSize: 12, padding: '10px 0' }}
                        />
                        <Bar 
                          dataKey="solar" 
                          name="Solar" 
                          fill="#FFB624"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="battery" 
                          name="Battery" 
                          fill="#0EA5E9"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="grid" 
                          name="Grid" 
                          fill="#6366F1"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="energy-card">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Energy Source %</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="80%">
                      <PieChart>
                        <Pie
                          data={sourceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                          itemStyle={{ fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {sourceData.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-sm">{entry.name}: {entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="savings" className="animate-fade-in">
            <div className="grid grid-cols-1 gap-6 mb-6">
              <Card className="energy-card">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Monthly Cost Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={savingsData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                          label={{ 
                            value: '$ Saved', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fontSize: 12, opacity: 0.6 }
                          }}
                        />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Savings']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                          itemStyle={{ fontSize: 12 }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="savings" 
                          stroke="#10B981" 
                          fillOpacity={1}
                          fill="url(#savingsGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly Average</p>
                      <p className="text-xl font-medium">$112</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">Annual Total</p>
                      <p className="text-xl font-medium">$1,346</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">CO₂ Reduction</p>
                      <p className="text-xl font-medium">2.4 tons</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">ROI Timeline</p>
                      <p className="text-xl font-medium">4.2 years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
