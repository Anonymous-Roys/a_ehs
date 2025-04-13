import { useState } from "react";
import { Zap, Layers, AlertTriangle, Clock } from "lucide-react";

export default function PowerSettings() {
  const [powerMode, setPowerMode] = useState("smart");
  const [reserveLevel, setReserveLevel] = useState(30);
  const [allowFeedIn, setAllowFeedIn] = useState(true);
  const [peakOptimization, setPeakOptimization] = useState(true);
  const [peakStart, setPeakStart] = useState(16); // 4 PM in 24-hour format
  const [peakEnd, setPeakEnd] = useState(21); // 9 PM in 24-hour format
  const [isEditingPeakHours, setIsEditingPeakHours] = useState(false);

  // Converts 24-hour format to 12-hour format for display
  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  // Calculate peak hours display position and width
  const getPeakDisplayStyle = () => {
    const totalHours = 24;
    const startPercentage = (peakStart / totalHours) * 100;
    const duration = peakEnd > peakStart 
      ? peakEnd - peakStart 
      : (24 - peakStart) + peakEnd; // Handle wrapping around midnight
    const widthPercentage = (duration / totalHours) * 100;
    
    return {
      width: `${widthPercentage}%`,
      marginLeft: `${startPercentage}%`
    };
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 shadow-sm mb-6">
   
      
      <div className="p-6">
        <div className="space-y-6">
          {/* Battery Power Mode */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Battery Power Mode</p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setPowerMode("smart")}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  powerMode === "smart" 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' 
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <Zap className="h-4 w-4 mx-auto mb-1" />
                Smart
              </button>
              <button 
                onClick={() => setPowerMode("reserve")}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  powerMode === "reserve" 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' 
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <Layers className="h-4 w-4 mx-auto mb-1" />
                Reserve
              </button>
              <button 
                onClick={() => setPowerMode("backup")}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  powerMode === "backup" 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' 
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <AlertTriangle className="h-4 w-4 mx-auto mb-1" />
                Backup
              </button>
            </div>
            
            {powerMode === "smart" && (
              <p className="mt-2 text-xs text-slate-500">
                Smart mode optimizes battery usage based on your consumption patterns
              </p>
            )}
            {powerMode === "reserve" && (
              <p className="mt-2 text-xs text-slate-500">
                Reserve mode maintains battery level for peak usage periods
              </p>
            )}
            {powerMode === "backup" && (
              <p className="mt-2 text-xs text-slate-500">
                Backup mode preserves battery capacity for power outages
              </p>
            )}
          </div>
          
          {/* Time of Use Settings */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">Time of Use Settings</p>
              <button 
                onClick={() => setIsEditingPeakHours(!isEditingPeakHours)}
                className="text-xs text-blue-500 flex items-center gap-1"
              >
                <Clock className="h-3 w-3" />
                {isEditingPeakHours ? "Done" : "Edit Hours"}
              </button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Peak Hours Optimization</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Charge during off-peak, use battery during peak hours</p>
                </div>
                <button 
                  onClick={() => setPeakOptimization(!peakOptimization)}
                  className={`w-12 h-6 rounded-full relative ${peakOptimization ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div 
                    className={`absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full transition-all ${
                      peakOptimization ? 'right-1' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>
              
              {isEditingPeakHours ? (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Peak Hours Start</label>
                    <select 
                      value={peakStart}
                      onChange={(e) => setPeakStart(Number(e.target.value))}
                      className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm w-full"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={`start-${i}`} value={i}>
                          {formatHour(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Peak Hours End</label>
                    <select 
                      value={peakEnd}
                      onChange={(e) => setPeakEnd(Number(e.target.value))}
                      className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm w-full"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={`end-${i}`} value={i}>
                          {formatHour(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Peak Hours: {formatHour(peakStart)} - {formatHour(peakEnd)}
                  </p>
                  <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500" 
                      style={getPeakDisplayStyle()}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>12 AM</span>
                    <span>12 PM</span>
                    <span>12 AM</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Backup Reserve Level Setting */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Backup Reserve Level</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={reserveLevel}
                  onChange={(e) => setReserveLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                />
                <span className="text-sm font-medium w-12 text-right">{reserveLevel}%</span>
              </div>
              
              <div className="h-2 relative bg-slate-200 dark:bg-slate-700 rounded-full">
                <div 
                  className="absolute left-0 h-2 bg-blue-500 rounded-full" 
                  style={{ width: `${reserveLevel}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Grid Feed-in Control */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Grid Feed-In Control</p>
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              <div>
                <span className="font-medium">Allow Excess Solar to Grid</span>
                {allowFeedIn && <p className="text-xs text-slate-500 mt-1">Selling excess energy at 0.12$/kWh</p>}
              </div>
              <button
                onClick={() => setAllowFeedIn(!allowFeedIn)}
                className="relative"
              >
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  allowFeedIn ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    allowFeedIn ? 'translate-x-5' : ''
                  }`}></div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="pt-2">
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={() => alert(
                `Settings saved:\n- Power Mode: ${powerMode}\n- Peak Hours: ${formatHour(peakStart)} to ${formatHour(peakEnd)}\n- Peak Optimization: ${peakOptimization}\n- Reserve Level: ${reserveLevel}%\n- Feed-In: ${allowFeedIn}`
              )}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}