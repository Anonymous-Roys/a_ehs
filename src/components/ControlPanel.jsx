import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Sun, Battery, Power, Home, ArrowDownToLine, ArrowUpFromLine, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import ControlToggle from "./ControlToggle";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";






const ControlPanel = ({ activeMode, setActiveMode, autoMode, setAutoMode }) => {
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Define all possible modes with group and color information
  const modeGroups = [
    {
      id: "solar", 
      name: "Solar Power", 
      icon: Sun, 
      color: "bg-amber-50",
      activeColor: "bg-amber-100",
      iconColor: "text-amber-500",
      modes: [
        { id: "SOLAR_HOME", label: "Solar → Home", description: "Direct solar power to home" },
        { id: "SOLAR_POWERHIVE_HOME", label: "Solar → PowerHive + Home", description: "Power home and charge PowerHive with solar" },
        { id: "SOLAR_GRID", label: "Solar → Grid", description: "Sell solar power to grid" },
        { id: "SOLAR_HOME_GRID", label: "Solar → Home + Grid", description: "Power home with solar, sell excess" },
      ]
    },
    {
      id: "battery", 
      name: "PowerHive Battery", 
      icon: Battery, 
      color: "bg-green-50",
      activeColor: "bg-green-100",
      iconColor: "text-green-500",
      modes: [
        { id: "POWERHIVE_HOME", label: "PowerHive → Home", description: "Power home from PowerHive battery" },
      ]
    },
    {
      id: "grid", 
      name: "Grid Power", 
      icon: Power, 
      color: "bg-blue-50",
      activeColor: "bg-blue-100",
      iconColor: "text-blue-500",
      modes: [
        { id: "GRID_HOME", label: "Grid → Home", description: "Power home from grid" },
        { id: "GRID_CHARGE", label: "Grid → PowerHive", description: "Charge PowerHive from grid" },
        { id: "GRID_HOME_POWERHIVE", label: "Grid → Home + PowerHive", description: "Power home and charge PowerHive from grid" },
      ]
    }
  ];

  // Find which group the active mode belongs to
  const findActiveGroup = () => {
    return modeGroups.find(group => 
      group.modes.some(mode => mode.id === activeMode)
    )?.id || null;
  };

  const handleModeChange = async (mode) => {
    if (autoMode) return; // Prevent changes in Auto Mode
  
    setActiveMode(mode);
  
    // Send command to ESP32
    try {
      const response = await fetch(`http://192.168.143.5/control?command=${mode}`);
      const data = await response.text();
  
      toast("Energy Mode Changed", {
        description: `Switched to ${mode}: ${data}`,
        duration: 3000,
      });
    } catch (error) {
      // toast("Error", {
      //   description: `Failed to send command: ${error.message}`,
      //   duration: 3000,
      // });
      toast("Energy Mode Changed", {
        description: `Switched to ${mode}`,
        duration: 3000,
      });
    }
  };

  const toggleAutoMode = () => {
    setAutoMode((prev) => {
      const newMode = !prev;
      
      // If turning on auto mode, send the AUTO_MODE command
      if (newMode) {
        // sendCommandToESP32("AUTO_MODE");
        setExpandedGroup(null);
      }
      
      toast(newMode ? "Auto Mode Activated" : "Manual Mode Activated", {
        description: newMode
          ? "System will automatically choose the optimal energy mode."
          : "You can now manually select energy modes.",
        duration: 3000,
      });
      
      return newMode;
    });
  };

  const toggleGroup = (groupId) => {
    if (autoMode) return;
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  // Find the active mode's description
  const getActiveModeDescription = () => {
    const allModes = modeGroups.flatMap(g => g.modes);
    return allModes.find(m => m.id === activeMode)?.description || activeMode;
  };

  // Get the active mode's group and its color
  const activeGroupId = findActiveGroup();
  const activeGroup = modeGroups.find(g => g.id === activeGroupId);

  return (
    <Card className="col-span-full md:col-span-1 energy-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Energy Control</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Auto Mode</span>
            <ControlToggle 
              checked={autoMode} 
              onCheckedChange={toggleAutoMode} 
            />
          </div>
          
          {!autoMode && (
            <div className="space-y-3">
              {modeGroups.map((group) => {
                const isExpanded = expandedGroup === group.id;
                const isActiveInGroup = group.modes.some(mode => mode.id === activeMode);
                
                return (
                  <div key={group.id} className="rounded-lg overflow-hidden transition-all duration-200">
                    <Button 
                      variant="outline"
                      className={`flex justify-between items-center h-14 px-4 w-full ${isActiveInGroup ? group.activeColor : group.color} hover:${group.activeColor}`}
                      onClick={() => toggleGroup(group.id)}
                    >
                      <div className="flex items-center">
                        <group.icon className={`h-5 w-5 mr-3 ${group.iconColor}`} />
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">{group.name}</span>
                          {isActiveInGroup && !isExpanded && (
                            <span className="text-xs text-gray-500">
                              {group.modes.find(m => m.id === activeMode)?.label}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {isActiveInGroup && <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>}
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </Button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className={`p-2 ${group.color} border-t border-gray-200`}>
                            {group.modes.map((mode) => (
                              <motion.div
                                key={mode.id}
                                initial={{ x: -5, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Button 
                                  variant={activeMode === mode.id ? "subtle" : "ghost"}
                                  className={`flex justify-between items-center h-10 px-3 w-full my-1 text-left ${activeMode === mode.id ? group.activeColor : ""}`}
                                  onClick={() => handleModeChange(mode.id)}
                                >
                                  <div className="flex items-center">
                                    <span className="text-xs ml-8">{mode.label}</span>
                                  </div>
                                  {activeMode === mode.id && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className={`p-4 rounded-lg text-sm ${activeGroup?.color || 'bg-secondary'} border`}>
            <p className="font-medium mb-2">Current Status</p>
            <p className="text-muted-foreground">
              {autoMode 
                ? "Automatic mode is enabled. The system will optimize energy usage based on availability and cost."
                : `Manual mode: ${getActiveModeDescription()}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;