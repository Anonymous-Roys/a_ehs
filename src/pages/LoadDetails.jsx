import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BatteryFull, ChevronLeft, Flame, Home, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const generateRandomData = (length = 24, max = 8) => {
  return Array.from({ length }, (_, i) => ({
    time: `${i}:00`,
    power: parseFloat((Math.random() * max).toFixed(2))
  }));
};

const PowerChart = ({ timeFrame }) => {
  const [chartData, setChartData] = useState(generateRandomData());

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateRandomData(timeFrame === 'day' ? 24 : timeFrame === 'week' ? 7 : 30));
    }, 3000);

    return () => clearInterval(interval);
  }, [timeFrame]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 10]} />
        <Tooltip />
        <Area type="monotone" dataKey="power" stroke="#10B981" fillOpacity={1} fill="url(#colorPower)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const LoadDetails = () => {
  const [timeFrame, setTimeFrame] = useState("day");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="p-6 space-y-6"
    >
        <button onClick={() => window.history.back()} className="flex items-center text-muted-foreground hover:text-foreground">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </button>
      <Card className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="text-green-500" />
              Power Overview
            </h2>
            <Tabs value={timeFrame} onValueChange={setTimeFrame}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <PowerChart timeFrame={timeFrame} />
        </CardContent>
      </Card>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2, duration: 0.5 }} 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Energy Sources</span>
            </div>
            <div className="mt-2 space-y-2">
              {[
                { label: "Solar", color: "bg-yellow-400", icon: Flame },
                { label: "Battery", color: "bg-blue-500", icon: BatteryFull },
                { label: "Grid", color: "bg-indigo-500", icon: Home }
              ].map((source, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex gap-2 items-center">
                    <source.icon className={`w-4 h-4 ${source.color}`} />
                    <span>{source.label}</span>
                  </div>
                  <div className="font-medium">{Math.floor(Math.random() * 50 + 20)}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-2">Appliance Usage</div>
            <div className="space-y-1">
              {["HVAC", "Kitchen", "Lights", "Washer", "Other"].map((name, idx) => {
                const percent = Math.floor(Math.random() * 25 + 10);
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs">
                      <span>{name}</span>
                      <span>{(percent * 0.08).toFixed(1)} kW</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LoadDetails;
