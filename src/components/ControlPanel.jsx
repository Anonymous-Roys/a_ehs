import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import ControlToggle from "./ControlToggle";
import { toast } from "sonner";
import { useState } from "react";
import {  AnimatePresence, motion } from "framer-motion";
import { modeGroups } from "../lib/data";





const ControlPanel = ({ deviceId, activeMode, setActiveMode, autoMode, setAutoMode }) => {
 const [expandedGroup, setExpandedGroup] = useState(null);
  const [isSendingCommand, setIsSendingCommand] = useState(false);

  const findActiveGroup = () => {
    return modeGroups.find(group => 
      group.modes.some(mode => mode.id === activeMode)
    )?.id || null;
  };

  const sendCommand = async (command, parameters = {}) => {
    setIsSendingCommand(true);
    try {
      const response = await fetch("https://powerhive-backend-annex.onrender.com/api/commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          deviceId,
          command,
          parameters
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(isSendingCommand);
  console.log(command, parameters);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Command failed:", error);
      throw error;
    } finally {
      setIsSendingCommand(false);
    }
  };

  const handleModeChange = async (mode) => {
    if (autoMode) return;
    
    try {
      const result = await sendCommand("SET_MODE", { mode });
      
      if (result.success) {
        setActiveMode(mode);
        toast.success("Mode Changed", {
          description: `Successfully switched to ${mode}`,
        });
      } else {
        toast.error("Failed to change mode", {
          description: result.message || "Unknown error occurred",
        });
      }
    } catch (error) {
      toast.error("Command Failed", {
        description: error.message || "Failed to send command to device",
      });
    }
  };

  const toggleAutoMode = async () => {
    const newMode = !autoMode;
    const command = newMode ? "ENABLE_AUTO_MODE" : "DISABLE_AUTO_MODE";
    
    try {
      const result = await sendCommand(command);
      
      if (result.success) {
        setAutoMode(newMode);
        setExpandedGroup(null);
        toast.success(newMode ? "Auto Mode Activated" : "Manual Mode Activated", {
          description: newMode
            ? "System will automatically optimize energy usage"
            : "You can now manually select energy modes",
        });
      }
    } catch (error) {
      toast.error("Failed to toggle mode", {
        description: error.message || "Could not change auto mode setting",
      });
    }
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
    <Card className="col-span-full md:col-span-1 energy-card text-black">
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