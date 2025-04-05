import React from "react";
import SensorData from "../components/SensorData";
import Controls from "../components/EspControls";
import RealTime from "../components/Realtime";


const Connection = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold">PowerHive Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorData />
        <Controls />
      </div>
      <RealTime />
    </div>
  );
};

export default Connection;
