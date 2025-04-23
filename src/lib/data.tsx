import { Sun, Battery, Power, Home, ArrowDownToLine, ArrowUpFromLine, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";

 
 

 
 
 // Define all possible modes with group and color information
  export const modeGroups = [
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