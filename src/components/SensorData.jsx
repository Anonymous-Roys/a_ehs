import React, { useEffect, useState } from "react";
import { getSensorData } from "../api";

// interface SensorData {
//   batteryLevel: number;
//   solarPower: number;
//   loadPower: number;
//   surplusPower: number;
// }

const SensorData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSensorData();
        setData(response);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-lg font-bold">Real-Time Sensor Data</h2>
      {data ? (
        <div>
          <p>🔋 Battery Level: {data.batteryLevel}%</p>
          <p>☀️ Solar Power: {data.solarPower} W</p>
          <p>⚡ Load Power: {data.loadPower} W</p>
          <p>📈 Surplus Power: {data.surplusPower} W</p>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default SensorData;
