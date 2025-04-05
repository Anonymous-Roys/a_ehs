import axios from "axios";
import { io } from "socket.io-client";



// Change this to your ESP32 Master IP
const ESP32_IP = "http://192.168.143.5"; 



export const getSensorData = async () => {
  const response = await axios.get(`${ESP32_IP}/`);
  return response.data;
};

export const sendCommand = async (command) => {
  await axios.get(`${ESP32_IP}/${command}`);
};

const socket = io(ESP32_IP);

export const subscribeToSensorUpdates = (callback) => {
  socket.on("sensorData", callback);
};
