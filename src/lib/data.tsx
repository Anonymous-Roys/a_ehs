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
        { id: "SOLAR_HOME", label: "Solar → Home", description: "Solar powers Home" },
        { id: "SOLAR_POWERHIVE_HOME", label: "Solar → Flux SOS + Home", description: "Solar powers both Home and Flux SOS" },
        { id: "SOLAR_GRID", label: "Solar → Grid", description: "Solar powers Grid" },
        { id: "SOLAR_HOME_GRID", label: "Solar → Home + Grid", description: "Solar powers both Home and Grid" },
      ]
    },
    {
      id: "battery", 
      name: "Flux SOS Battery", 
      icon: Battery, 
      color: "bg-green-50",
      activeColor: "bg-green-100",
      iconColor: "text-green-500",
      modes: [
        { id: "POWERHIVE_HOME", label: "Flux SOS → Home", description: "Power home from Flux SOS battery" },
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
        { id: "GRID_CHARGE", label: "Grid → Flux SOS", description: "Charge Flux SOS from grid" },
        { id: "GRID_HOME_POWERHIVE", label: "Grid → Home + Flux SOS", description: "Power home and charge Flux SOS from grid" },
      ]
    }
  ];