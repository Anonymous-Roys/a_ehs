import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";

const PowerFlowCard3D = ({ activeMode = "SOLAR_HOME" }) => {
  const [flowStates, setFlowStates] = useState({
    solarActive: false,
    batteryActive: false,
    batteryCharging: false,
    gridActive: false,
    gridImport: false,
    gridExport: false,
    solarToHome: false,
    solarToBattery: false,
    solarToGrid: false,
    batteryToHome: false,
    gridToHome: false,
    gridToBattery: false
  });
  
  const [batteryLevel, setBatteryLevel] = useState(83.3);

  useEffect(() => {
    const newFlowStates = {
      solarActive: false,
      batteryActive: false,
      batteryCharging: false,
      gridActive: false,
      gridImport: false,
      gridExport: false,
      solarToHome: false,
      solarToBattery: false,
      solarToGrid: false,
      batteryToHome: false,
      gridToHome: false,
      gridToBattery: false
    };
    
    switch (activeMode) {
      case "SOLAR_HOME":
        newFlowStates.solarActive = true;
        newFlowStates.solarToHome = true;
        break;
      case "SOLAR_POWERHIVE_HOME":
        newFlowStates.solarActive = true;
        newFlowStates.batteryActive = true;
        newFlowStates.batteryCharging = true;
        newFlowStates.solarToHome = true;
        newFlowStates.solarToBattery = true;
        break;
      case "POWERHIVE_HOME":
        newFlowStates.batteryActive = true;
        newFlowStates.batteryToHome = true;
        break;
      case "SOLAR_HOME_GRID":
        newFlowStates.solarActive = true;
        newFlowStates.gridActive = true;
        newFlowStates.gridImport = true;
        newFlowStates.solarToHome = true;
        newFlowStates.gridToHome = true;
        break;
      case "GRID_HOME":
        newFlowStates.gridActive = true;
        newFlowStates.gridImport = true;
        newFlowStates.gridToHome = true;
        break;
      default:
        newFlowStates.solarActive = true;
        newFlowStates.solarToHome = true;
    }
    
    setFlowStates(newFlowStates);
  }, [activeMode]);

  return (
    <Card className="md:col-span-2 energy-card overflow-hidden relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2 text-gray-900 dark:text-white">
          Power Flow
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({activeMode})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="w-full h-[400px] relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl overflow-hidden">
          
          {/* 3D Environment Container */}
          <div className="absolute inset-0 perspective-1000">
            
            {/* Solar Panel - Top Left */}
            <motion.div 
              className={`absolute top-8 left-8 w-32 h-24 transform-gpu ${flowStates.solarActive ? 'scale-110' : 'scale-100'}`}
              animate={{ 
                scale: flowStates.solarActive ? [1, 1.05, 1] : 1,
                rotateY: [0, 2, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Solar Panel 3D Effect */}
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg transform rotate-x-12 shadow-2xl">
                  {/* Solar cells grid */}
                  <div className="grid grid-cols-4 gap-1 p-2 h-full">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`bg-gradient-to-br from-blue-800 to-blue-600 rounded-sm ${flowStates.solarActive ? 'animate-pulse' : ''}`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
                {/* Glow effect */}
                {flowStates.solarActive && (
                  <div className="absolute inset-0 bg-yellow-400 rounded-lg opacity-20 animate-pulse" />
                )}
              </div>
              <div className="text-center mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Solar Panel</div>
            </motion.div>

            {/* 3D House - Bottom Center */}
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-32"
              animate={{ rotateY: [0, 1, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              {/* House 3D Structure */}
              <div className="relative w-full h-full">
                {/* House Base */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-b-lg shadow-xl">
                  {/* Windows */}
                  <div className="absolute top-2 left-2 w-4 h-4 bg-yellow-200 rounded-sm animate-pulse" />
                  <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-200 rounded-sm animate-pulse" />
                  {/* Door */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-brown-600 rounded-t-lg" />
                </div>
                {/* Roof */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gradient-to-br from-gray-600 to-gray-800 clip-triangle shadow-xl" 
                     style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                {/* Chimney */}
                <div className="absolute bottom-16 right-8 w-3 h-8 bg-gray-700 rounded-t-sm" />
              </div>
              <div className="text-center mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Smart Home</div>
            </motion.div>

            {/* PowerHive Battery - Top Right */}
            <motion.div 
              className={`absolute top-8 right-8 w-28 h-32 ${flowStates.batteryActive ? 'scale-110' : 'scale-100'}`}
              animate={{ 
                scale: flowStates.batteryActive ? [1, 1.05, 1] : 1,
                rotateY: [0, -2, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Battery 3D Structure */}
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-2xl">
                  {/* Battery Level Indicator */}
                  <div className="absolute bottom-2 left-2 right-2 h-20 bg-gray-800 rounded-lg overflow-hidden">
                    <motion.div 
                      className={`absolute bottom-0 left-0 right-0 rounded-lg ${flowStates.batteryCharging ? 'bg-gradient-to-t from-green-400 to-green-300' : 'bg-gradient-to-t from-blue-400 to-blue-300'}`}
                      animate={{ height: `${batteryLevel}%` }}
                      transition={{ duration: 1 }}
                    />
                    {/* Charging animation */}
                    {flowStates.batteryCharging && (
                      <div className="absolute inset-0 bg-gradient-to-t from-green-300 to-transparent animate-pulse" />
                    )}
                  </div>
                  {/* PowerHive Logo */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">PH</div>
                  {/* Battery Percentage */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
                    {Math.round(batteryLevel)}%
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">PowerHive</div>
            </motion.div>

            {/* Grid Tower - Bottom Right */}
            <motion.div 
              className={`absolute bottom-8 right-8 w-24 h-32 ${flowStates.gridActive ? 'scale-110' : 'scale-100'}`}
              animate={{ 
                scale: flowStates.gridActive ? [1, 1.05, 1] : 1,
                rotateY: [0, -1, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {/* Grid Tower 3D Structure */}
              <div className="relative w-full h-full">
                {/* Tower Base */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-20 bg-gradient-to-t from-gray-600 to-gray-400 shadow-xl" />
                {/* Power Lines */}
                <div className="absolute bottom-16 left-0 right-0 h-1 bg-gray-800" />
                <div className="absolute bottom-20 left-0 right-0 h-1 bg-gray-800" />
                <div className="absolute bottom-24 left-0 right-0 h-1 bg-gray-800" />
                {/* Tower Arms */}
                <div className="absolute bottom-16 left-2 w-20 h-1 bg-gray-600 transform rotate-12" />
                <div className="absolute bottom-16 right-2 w-20 h-1 bg-gray-600 transform -rotate-12" />
                {/* Status Indicator */}
                {flowStates.gridActive && (
                  <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${flowStates.gridImport ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                )}
              </div>
              <div className="text-center mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Grid</div>
            </motion.div>

            {/* Animated Power Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
              {/* Solar to Home */}
              {flowStates.solarToHome && (
                <g>
                  <path
                    d="M 80 60 Q 200 100 200 320"
                    stroke="url(#solarGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    className="animate-dash"
                  />
                  {[...Array(4)].map((_, i) => (
                    <circle key={i} r="4" fill="#FFB624">
                      <animateMotion
                        path="M 80 60 Q 200 100 200 320"
                        dur="3s"
                        begin={`${i * 0.75}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </g>
              )}

              {/* Solar to Battery */}
              {flowStates.solarToBattery && (
                <g>
                  <path
                    d="M 80 60 Q 200 40 320 60"
                    stroke="url(#solarGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    className="animate-dash"
                  />
                  {[...Array(3)].map((_, i) => (
                    <circle key={i} r="4" fill="#FFB624">
                      <animateMotion
                        path="M 80 60 Q 200 40 320 60"
                        dur="2.5s"
                        begin={`${i * 0.8}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </g>
              )}

              {/* Battery to Home */}
              {flowStates.batteryToHome && (
                <g>
                  <path
                    d="M 320 100 Q 260 200 200 320"
                    stroke="url(#batteryGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    className="animate-dash"
                  />
                  {[...Array(3)].map((_, i) => (
                    <circle key={i} r="4" fill="#0EA5E9">
                      <animateMotion
                        path="M 320 100 Q 260 200 200 320"
                        dur="2s"
                        begin={`${i * 0.7}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </g>
              )}

              {/* Grid to Home */}
              {flowStates.gridToHome && (
                <g>
                  <path
                    d="M 320 320 Q 260 320 200 320"
                    stroke="url(#gridGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    className="animate-dash"
                  />
                  {[...Array(3)].map((_, i) => (
                    <circle key={i} r="4" fill="#6366F1">
                      <animateMotion
                        path="M 320 320 Q 260 320 200 320"
                        dur="2s"
                        begin={`${i * 0.7}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </g>
              )}

              {/* Gradients for power lines */}
              <defs>
                <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFB624" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="batteryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Environmental Effects */}
            {flowStates.solarActive && (
              <div className="absolute top-4 left-4 w-8 h-8">
                {/* Sun rays */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-4 bg-yellow-400 opacity-60 animate-pulse"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      transformOrigin: '2px 16px',
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
                <div className="absolute top-3 left-3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              </div>
            )}

          </div>

          {/* Status Legend */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4 text-xs">
            <div className={`flex items-center px-3 py-1 rounded-full backdrop-blur-sm shadow-sm ${flowStates.solarActive ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-800/30'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${flowStates.solarActive ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-gray-700 dark:text-gray-300">Solar</span>
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full backdrop-blur-sm shadow-sm ${flowStates.batteryActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800/30'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${flowStates.batteryActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-gray-700 dark:text-gray-300">Battery {Math.round(batteryLevel)}%</span>
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full backdrop-blur-sm shadow-sm ${flowStates.gridActive ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800/30'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${flowStates.gridActive ? 'bg-purple-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-gray-700 dark:text-gray-300">Grid</span>
            </div>
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-x-12 {
          transform: rotateX(12deg);
        }
        .animate-dash {
          stroke-dasharray: 10, 5;
          animation: dash 2s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -15;
          }
        }
      `}</style>
    </Card>
  );
};

export default PowerFlowCard3D;