import React, { useEffect, useState } from "react";
import { subscribeToSensorUpdates } from "../api";

const RealTime = () => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    subscribeToSensorUpdates((data) => setSensorData(data));
  }, []);

  return (
    <div className="bg-purple-700 p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-lg font-bold">Live Data</h2>
      {sensorData ? (
        <p>{JSON.stringify(sensorData)}</p>
      ) : (
        <p>Waiting for updates...</p>
      )}
    </div>
  );
};

export default RealTime;
