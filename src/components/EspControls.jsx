import React from "react";
import { sendCommand } from "../api";

const Controls = () => {
  const handleCommand = async (command) => {
    try {
      await sendCommand(command);
      alert(`Command sent: ${command}`);
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-lg font-bold">Power Control</h2>
      <button className="bg-blue-500 p-2 m-2 rounded" onClick={() => handleCommand("grid_home")}>
        🔌 Grid Power Home
      </button>
      <button className="bg-yellow-500 p-2 m-2 rounded" onClick={() => handleCommand("solar_home")}>
        ☀️ Solar Power Home
      </button>
      <button className="bg-green-500 p-2 m-2 rounded" onClick={() => handleCommand("powerhive_home")}>
        ⚡ PowerHive Home
      </button>
    </div>
  );
};

export default Controls;
