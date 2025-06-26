import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Battery, Sun, Home, Power } from "lucide-react";

const PowerFlowCard = ({ activeMode = "SOLAR_HOME" }) => {
  // Flow states based on the active mode
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
  
  // Battery level simulation (0-100)
  const [batteryLevel, setBatteryLevel] = useState(60);
  
  useEffect(() => {
    // Set all flow states based on active mode
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
    
    // Configure flows for each mode
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
        // Simulate battery discharge
        if (batteryLevel > 10) {
          setBatteryLevel(prev => Math.max(prev - 0.1, 10));
        }
        break;
        
      case "SOLAR_GRID":
        newFlowStates.solarActive = true;
        newFlowStates.gridActive = true;
        newFlowStates.gridExport = true;
        newFlowStates.solarToGrid = true;
        break;
        
      case "SOLAR_HOME_GRID":
        newFlowStates.solarActive = true;
        newFlowStates.gridActive = true;
        newFlowStates.gridExport = true;
        newFlowStates.solarToHome = true;
        newFlowStates.gridActive = true;
        newFlowStates.gridImport = true;
        newFlowStates.gridToHome = true;
        break;
        
      case "GRID_HOME":
        newFlowStates.gridActive = true;
        newFlowStates.gridImport = true;
        newFlowStates.gridToHome = true;
        break;
        
      case "GRID_CHARGE":
        newFlowStates.gridActive = true;
        newFlowStates.batteryActive = true;
        newFlowStates.batteryCharging = true;
        newFlowStates.gridImport = true;
        newFlowStates.gridToBattery = true;
        // Simulate battery charging
        if (batteryLevel < 90) {
          setBatteryLevel(prev => Math.min(prev + 0.2, 90));
        }
        break;
        
      case "GRID_HOME_POWERHIVE":
        newFlowStates.gridActive = true;
        newFlowStates.batteryActive = true;
        newFlowStates.batteryCharging = true;
        newFlowStates.gridImport = true;
        newFlowStates.gridToHome = true;
        newFlowStates.gridToBattery = true;
        // Simulate slower battery charging
        if (batteryLevel < 90) {
          setBatteryLevel(prev => Math.min(prev + 0.1, 90));
        }
        break;
        
      default:
        // Default to solar home
        newFlowStates.solarActive = true;
        newFlowStates.solarToHome = true;
    }
    
    setFlowStates(newFlowStates);
    
    // Optional: Simulate small fluctuations for more dynamic visualization
    const interval = setInterval(() => {
      if (newFlowStates.solarActive) {
        // Subtle solar fluctuation
        setFlowStates(prev => ({
          ...prev,
          solarActive: !prev.solarActive,
        }));
        setTimeout(() => setFlowStates(prev => ({...prev, solarActive: newFlowStates.solarActive})), 500);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeMode, batteryLevel]);

  // Get color based on source
  const getSourceColor = (source) => {
    switch(source) {
      case 'solar': return "#FFB624";
      case 'battery': return "#0EA5E9";
      case 'grid': return "#6366F1";
      case 'home': return "#F43F5E";
      default: return "#94A3B8";
    }
  };

  return (
    <Card className="col-span-2 energy-card overflow-hidden relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          Power Flow
          <span className="text-sm font-normal text-muted-foreground">({activeMode})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="w-full h-[300px] relative bg-slate-50 dark:bg-slate-900/30 rounded-lg">
          {/* SVG Power Flow Diagram - NEW DESIGN */}
          <svg 
            viewBox="0 0 1000 400" 
            className="w-full h-full"
          >
            {/* Central Hub Design */}
            <circle cx="500" cy="200" r="60" fill="#1E293B" fillOpacity="0.2" />
            <circle cx="500" cy="200" r="50" fill="#1E293B" fillOpacity="0.1" />
            
            {/* === LEFT SIDE: SOLAR === */}
            <g className="solar-component" opacity={flowStates.solarActive ? "1" : "0.5"} transform="translate(150, 200)">
              {/* Solar Panel Icon */}
              <rect x="-60" y="-50" width="120" height="100" rx="8" fill={getSourceColor('solar')} fillOpacity="0.2" />
              
              {/* Sun Icon */}
              <circle cx="0" cy="0" r="30" fill={getSourceColor('solar')} fillOpacity="0.6">
                <animate attributeName="opacity" values="0.6;0.8;0.6" dur="3s" repeatCount="indefinite" begin="0s" />
              </circle>
              
              {/* Sun Rays */}
              {[...Array(8)].map((_, i) => (
                <line 
                  key={`sun-ray-${i}`}
                  x1="0" 
                  y1="0" 
                  x2={Math.cos(i * Math.PI / 4) * 40} 
                  y2={Math.sin(i * Math.PI / 4) * 40} 
                  stroke={getSourceColor('solar')} 
                  strokeWidth="2" 
                  strokeOpacity="0.6"
                >
                  <animate 
                    attributeName="stroke-opacity" 
                    values="0.6;0.9;0.6" 
                    dur="3s" 
                    repeatCount="indefinite" 
                    begin={`${i * 0.2}s`}
                  />
                </line>
              ))}
              
              {/* Label */}
              <text x="0" y="70" fill="currentColor" fontSize="14" fontWeight="500" textAnchor="middle">Solar</text>
            </g>
            
            {/* === RIGHT SIDE: GRID === */}
            <g className="grid-component" opacity={flowStates.gridActive ? "1" : "0.5"} transform="translate(850, 200)">
              {/* Grid Icon Background */}
              <rect x="-60" y="-50" width="120" height="100" rx="8" fill={getSourceColor('grid')} fillOpacity="0.2" />
              
              {/* Grid Tower */}
              <rect x="-20" y="-40" width="40" height="80" fill={getSourceColor('grid')} fillOpacity="0.6" rx="2" />
              <rect x="-35" y="-10" width="70" height="10" fill={getSourceColor('grid')} fillOpacity="0.8" />
              <rect x="-30" y="10" width="60" height="10" fill={getSourceColor('grid')} fillOpacity="0.8" />
              
              {/* Import/Export Indicator */}
              {flowStates.gridImport && (
                <circle cx="0" cy="-50" r="10" fill="#4ADE80">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {flowStates.gridExport && (
                <circle cx="0" cy="-50" r="10" fill="#F43F5E">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              
              {/* Label */}
              <text x="0" y="70" fill="currentColor" fontSize="14" fontWeight="500" textAnchor="middle">Grid</text>
            </g>
            
            {/* === TOP: BATTERY === */}
            <g className="battery-component" opacity={flowStates.batteryActive ? "1" : "0.5"} transform="translate(500, 60)">
              {/* Battery Icon Background */}
              <rect x="-50" y="-50" width="100" height="100" rx="8" fill={getSourceColor('battery')} fillOpacity="0.2" />
              
              {/* Battery Icon */}
              <rect x="-30" y="-30" width="60" height="80" rx="5" fill={getSourceColor('battery')} fillOpacity="0.4" />
              <rect x="-10" y="-40" width="20" height="10" rx="2" fill={getSourceColor('battery')} fillOpacity="0.6" />
              
              {/* Battery Fill */}
              <rect 
                x="-25" 
                y="45" 
                width="50" 
                height={-75 * (batteryLevel / 100)} 
                rx="2" 
                fill={flowStates.batteryCharging ? "#4ADE80" : getSourceColor('battery')} 
                fillOpacity="0.8"
                className="transition-all duration-1000"
              >
                {flowStates.batteryCharging && (
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                )}
              </rect>
              
              {/* Battery Percentage */}
              <text 
                x="0" 
                y="15" 
                fill="white" 
                fontSize="16" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                {Math.round(83.3)}%
              </text>
              
              {/* Label */}
              <text x="0" y="70" fill="currentColor" fontSize="14" fontWeight="500" textAnchor="middle">PowerHive</text>
            </g>
            
            {/* === BOTTOM: HOME === */}
            <g className="home-component" transform="translate(500, 340)">
              {/* Home Icon Background */}
              <rect x="-50" y="-50" width="100" height="100" rx="8" fill={getSourceColor('home')} fillOpacity="0.2" />
              
              {/* House Icon */}
              <rect x="-30" y="-15" width="60" height="40" fill={getSourceColor('home')} fillOpacity="0.7" rx="2" />
              <path d="M -35 -15 L 0 -45 L 35 -15 Z" fill={getSourceColor('home')} fillOpacity="0.7" />
              <rect x="-10" y="5" width="20" height="20" fill="white" fillOpacity="0.4" />
              
              {/* Label */}
              <text x="0" y="50" fill="currentColor" fontSize="14" fontWeight="500" textAnchor="middle">Home</text>
            </g>
            
            {/* === CONNECTION PATHS === */}
            
            {/* Solar to Central Hub */}
            <path 
              d="M 230 200 C 300 200, 380 200, 440 200" 
              stroke={getSourceColor('solar')} 
              strokeWidth="6" 
              strokeOpacity={flowStates.solarActive ? "0.3" : "0.1"} 
              fill="none" 
              strokeLinecap="round"
            />
            
            {/* Central Hub to Grid */}
            <path 
              d="M 560 200 C 620 200, 700 200, 770 200" 
              stroke={getSourceColor('grid')} 
              strokeWidth="6" 
              strokeOpacity={flowStates.gridActive ? "0.3" : "0.1"} 
              fill="none" 
              strokeLinecap="round"
            />
            
            {/* Central Hub to Battery */}
            <path 
              d="M 500 140 C 500 120, 500 110, 500 90" 
              stroke={getSourceColor('battery')} 
              strokeWidth="6" 
              strokeOpacity={flowStates.batteryActive ? "0.3" : "0.1"} 
              fill="none" 
              strokeLinecap="round"
            />
            
            {/* Central Hub to Home */}
            <path 
              d="M 500 260 C 500 280, 500 290, 500 310" 
              stroke={getSourceColor('home')} 
              strokeWidth="6" 
              strokeOpacity="0.3" 
              fill="none" 
              strokeLinecap="round"
            />
            
            {/* === FLOW ANIMATIONS === */}
            
            {/* Solar to Home Flow */}
            {flowStates.solarToHome && (
              <>
                <path 
                  d="M 230 200 C 300 200, 380 200, 440 200 C 470 200, 485 220, 500 260 C 500 280, 500 290, 500 310" 
                  stroke={getSourceColor('solar')} 
                  strokeWidth="2" 
                  strokeOpacity="0" 
                  fill="none" 
                  strokeLinecap="round"
                  id="solar-to-home-path"
                />
                {[...Array(3)].map((_, i) => (
                  <circle 
                    key={`solar-home-particle-${i}`}
                    r="3" 
                    fill={getSourceColor('solar')} 
                  >
                    <animateMotion
                      path="M 230 200 C 300 200, 380 200, 440 200 C 470 200, 485 220, 500 260 C 500 280, 500 290, 500 310"
                      dur="3s"
                      begin={`${i * 1}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </>
            )}
            
            {/* Solar to Battery Flow */}
            {flowStates.solarToBattery && (
              <>
                <path 
                  d="M 230 200 C 300 200, 380 200, 440 200 C 470 200, 485 180, 500 140 C 500 120, 500 110, 500 90" 
                  stroke={getSourceColor('solar')} 
                  strokeWidth="2" 
                  strokeOpacity="0" 
                  fill="none" 
                  strokeLinecap="round"
                  id="solar-to-battery-path"
                />
                {[...Array(3)].map((_, i) => (
                  <circle 
                    key={`solar-battery-particle-${i}`}
                    r="3" 
                    fill={getSourceColor('solar')} 
                  >
                    <animateMotion
                      path="M 230 200 C 300 200, 380 200, 440 200 C 470 200, 485 180, 500 140 C 500 120, 500 110, 500 90"
                      dur="3s"
                      begin={`${i * 1}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </>
            )}
            
            {/* Solar to Grid Flow */}
            {flowStates.solarToGrid && (
              <>
                <path 
                  d="M 230 200 C 300 200, 380 200, 440 200 C 500 200, 560 200, 620 200 C 700 200, 770 200, 770 200" 
                  stroke={getSourceColor('solar')} 
                  strokeWidth="2" 
                  strokeOpacity="0" 
                  fill="none" 
                  strokeLinecap="round"
                  id="solar-to-grid-path"
                />
                {[...Array(3)].map((_, i) => (
                  <circle 
                    key={`solar-grid-particle-${i}`}
                    r="3" 
                    fill={getSourceColor('solar')} 
                  >
                    <animateMotion
                      path="M 230 200 C 300 200, 380 200, 440 200 C 500 200, 560 200, 620 200 C 700 200, 770 200, 770 200"
                      dur="4s"
                      begin={`${i * 1.3}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </>
            )}
            
            {/* Battery to Home Flow */}
            {flowStates.batteryToHome && (
              <>
                <path 
                  d="M 500 90 C 500 110, 500 120, 500 140 C 500 180, 500 220, 500 260 C 500 280, 500 290, 500 310" 
                  stroke={getSourceColor('battery')} 
                  strokeWidth="2" 
                  strokeOpacity="0" 
                  fill="none" 
                  strokeLinecap="round"
                  id="battery-to-home-path"
                />
                {[...Array(3)].map((_, i) => (
                  <circle 
                    key={`battery-home-particle-${i}`}
                    r="3" 
                    fill={getSourceColor('battery')} 
                  >
                    <animateMotion
                      path="M 500 90 C 500 110, 500 120, 500 140 C 500 180, 500 220, 500 260 C 500 280, 500 290, 500 310"
                      dur="2.5s"
                      begin={`${i * 0.8}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </>
            )}
            
            {/* Grid to Home Flow */}
            {flowStates.gridToHome && (
              <>
                <path 
                  d="M 770 200 C 700 200, 620 200, 560 200 C 530 200, 515 220, 500 260 C 500 280, 500 290, 500 310" 
                  stroke={getSourceColor('grid')} 
                  strokeWidth="2" 
                  strokeOpacity="0" 
                  fill="none" 
                  strokeLinecap="round"
                  id="grid-to-home-path"
                />
                {[...Array(3)].map((_, i) => (
                  <circle 
                    key={`grid-home-particle-${i}`}
                    r="3" 
                    fill={getSourceColor('grid')} 
                  >
                    <animateMotion
                      path="M 770 200 C 700 200, 620 200, 560 200 C 530 200, 515 220, 500 260 C 500 280, 500 290, 500 310"
                      dur="3s"
                      begin={`${i * 1}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </>
            )}
            
            {/* Grid to Battery Flow */}
            {flowStates.gridToBattery && (
              <>
                <path 
                  d="M 770 200 C 700 200, 620 200, 560 200 C 530 200, 515 180, 500 140 C 500 120, 500 110, 500 90" 
                  stroke={getSourceColor('grid')} 
                  strokeWidth="2" 
                  strokeOpacity="0" 
                  fill="none" 
                  strokeLinecap="round"
                  id="grid-to-battery-path"
                />
                {[...Array(3)].map((_, i) => (
                  <circle 
                    key={`grid-battery-particle-${i}`}
                    r="3" 
                    fill={getSourceColor('grid')} 
                  >
                    <animateMotion
                      path="M 770 200 C 700 200, 620 200, 560 200 C 530 200, 515 180, 500 140 C 500 120, 500 110, 500 90"
                      dur="3s"
                      begin={`${i * 1}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </>
            )}
          </svg>
          
          {/* Legend */}
          <div className="absolute  left-0 right-0 flex justify-center space-x-6 text-xs flex-wrap">
            <div className="flex items-center px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm shadow-sm">
              <div className={`w-3 h-3 rounded-full mr-2 ${flowStates.solarActive ? "bg-[#FFB624]" : "bg-gray-300"}`}></div>
              <span>Solar</span>
            </div>
            <div className="flex items-center px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm shadow-sm">
              <div className={`w-3 h-3 rounded-full mr-2 ${flowStates.batteryActive ? "bg-[#0EA5E9]" : "bg-gray-300"}`}></div>
              <span>PowerHive {Math.round(batteryLevel)}%</span>
            </div>
            <div className="flex items-center px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm shadow-sm">
              <div className={`w-3 h-3 rounded-full mr-2 ${flowStates.gridActive ? "bg-[#6366F1]" : "bg-gray-300"}`}></div>
              <span>Grid {flowStates.gridImport ? "Import" : flowStates.gridExport ? "Export" : ""}</span>
            </div>
            <div className="flex items-center px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#F43F5E] mr-2"></div>
              <span>Home</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerFlowCard;