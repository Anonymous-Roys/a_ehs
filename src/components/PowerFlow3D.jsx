import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from 'framer-motion';

const PowerFlowSVG = ({ activeMode = "SOLAR_HOME" }) => {
  const [flowStates, setFlowStates] = useState({
    solarActive: false,
    batteryActive: false,
    gridActive: false,
    solarToHome: false,
    solarToBattery: false,
    solarToGrid: false,
    batteryToHome: false,
    gridToHome: false,
    gridToBattery: false,
  });
  const [batteryLevel] = useState(83.3);

  useEffect(() => {
    const newFlowStates = {
      solarActive: false,
      batteryActive: false,
      gridActive: false,
      solarToHome: false,
      solarToBattery: false,
      solarToGrid: false,
      batteryToHome: false,
      gridToHome: false,
      gridToBattery: false,
    };
    
    switch (activeMode) {
      case "SOLAR_HOME":
        newFlowStates.solarActive = true;
        newFlowStates.solarToHome = true;
        break;
      case "SOLAR_POWERHIVE_HOME":
        newFlowStates.solarActive = true;
        newFlowStates.batteryActive = true;
        newFlowStates.solarToHome = true;
        newFlowStates.solarToBattery = true;
        break;
      case "SOLAR_GRID":
        newFlowStates.solarActive = true;
        newFlowStates.gridActive = true;
        newFlowStates.solarToGrid = true;
        break;
      case "SOLAR_HOME_GRID":
        newFlowStates.solarActive = true;
        newFlowStates.gridActive = true;
        newFlowStates.solarToHome = true;
        newFlowStates.solarToGrid = true;
        break;
      case "POWERHIVE_HOME":
        newFlowStates.batteryActive = true;
        newFlowStates.batteryToHome = true;
        break;
      case "GRID_HOME":
        newFlowStates.gridActive = true;
        newFlowStates.gridToHome = true;
        break;
      case "GRID_CHARGE":
        newFlowStates.gridActive = true;
        newFlowStates.batteryActive = true;
        newFlowStates.gridToBattery = true;
        break;
      case "GRID_HOME_POWERHIVE":
        newFlowStates.gridActive = true;
        newFlowStates.batteryActive = true;
        newFlowStates.gridToHome = true;
        newFlowStates.gridToBattery = true;
        break;
      default:
        newFlowStates.solarActive = true;
        newFlowStates.solarToHome = true;
    }
    
    setFlowStates(newFlowStates);
  }, [activeMode]);

  return (
    <Card className="md:col-span-2 energy-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2 text-gray-900 dark:text-white">
          Power Flow System
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({activeMode})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="w-full h-[500px] bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-xl overflow-hidden">
          <svg viewBox="0 0 800 500" className="w-full h-full">
            {/* Definitions for gradients and patterns */}
            <defs>
              {/* Solar panel gradient */}
              <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              
              {/* House gradient */}
              <linearGradient id="houseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              
              {/* Battery gradient */}
              <linearGradient id="batteryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1f2937" />
                <stop offset="100%" stopColor="#374151" />
              </linearGradient>
              
              {/* Grid tower gradient */}
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4b5563" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
              
              {/* Glass reflection gradient */}
              <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
              </linearGradient>
              
              {/* Power flow gradients */}
              <linearGradient id="solarFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
              </linearGradient>
              
              <linearGradient id="batteryFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
              </linearGradient>
              
              <linearGradient id="gridFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* 3D Ground Plane - Comprehensive Base */}
            <defs>
              {/* Ground texture gradient */}
              <linearGradient id="groundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="30%" stopColor="#16a34a" />
                <stop offset="70%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
              
              {/* Concrete/pathway gradient */}
              <linearGradient id="concreteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
              
              {/* Dirt/soil gradient */}
              <linearGradient id="dirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a16207" />
                <stop offset="50%" stopColor="#92400e" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Main 3D Ground Plane */}
            <g>
              {/* Primary ground surface - 3D perspective */}
              <path d="M 0 400 L 800 400 L 750 500 L 50 500 Z" fill="url(#groundGradient)" stroke="#15803d" strokeWidth="1" opacity="0.9" />
              
              {/* Ground texture lines for depth */}
              <g opacity="0.3">
                <path d="M 0 420 L 800 420 L 750 480 L 50 480 Z" stroke="#16a34a" strokeWidth="0.5" fill="none" />
                <path d="M 0 440 L 800 440 L 750 460 L 50 460 Z" stroke="#16a34a" strokeWidth="0.5" fill="none" />
                <path d="M 100 400 L 150 500" stroke="#16a34a" strokeWidth="0.5" />
                <path d="M 200 400 L 250 500" stroke="#16a34a" strokeWidth="0.5" />
                <path d="M 300 400 L 350 500" stroke="#16a34a" strokeWidth="0.5" />
                <path d="M 400 400 L 450 500" stroke="#16a34a" strokeWidth="0.5" />
                <path d="M 500 400 L 550 500" stroke="#16a34a" strokeWidth="0.5" />
                <path d="M 600 400 L 650 500" stroke="#16a34a" strokeWidth="0.5" />
                <path d="M 700 400 L 700 500" stroke="#16a34a" strokeWidth="0.5" />
              </g>
              
              {/* Concrete pathway around house - extended to grid */}
              <path d="M 180 380 L 720 380 L 700 420 L 200 420 Z" fill="url(#concreteGradient)" stroke="#9ca3af" strokeWidth="1" opacity="0.8" />
              
              {/* Solar panel foundation area */}
              <ellipse cx="160" cy="420" rx="80" ry="20" fill="url(#dirtGradient)" opacity="0.6" />
              
              {/* Grid tower foundation - extended */}
              <ellipse cx="700" cy="430" rx="50" ry="20" fill="url(#concreteGradient)" opacity="0.8" />
              <ellipse cx="700" cy="425" rx="45" ry="15" fill="#e5e7eb" opacity="0.6" />
              
              {/* House foundation shadow */}
              <path d="M 200 400 L 600 400 L 580 440 L 220 440 Z" fill="#000000" opacity="0.1" />
              
              {/* Ground details - grass patches extended */}
              <g opacity="0.4">
                <ellipse cx="120" cy="450" rx="25" ry="8" fill="#22c55e" />
                <ellipse cx="680" cy="460" rx="30" ry="10" fill="#22c55e" />
                <ellipse cx="50" cy="470" rx="20" ry="6" fill="#22c55e" />
                <ellipse cx="750" cy="480" rx="35" ry="12" fill="#22c55e" />
                <ellipse cx="720" cy="450" rx="25" ry="8" fill="#22c55e" />
                <ellipse cx="650" cy="470" rx="20" ry="6" fill="#22c55e" />
              </g>
              
              {/* Ground edge highlight */}
              <path d="M 0 400 L 800 400" stroke="#16a34a" strokeWidth="2" opacity="0.6" />
            </g>

            {/* Solar Panel - 3D Ground-Mounted with Support Structure */}
            <g transform="translate(100, 80)" className={flowStates.solarActive ? 'animate-pulse' : ''}>
              {/* Panel shadow */}
              <ellipse cx="60" cy="120" rx="80" ry="15" fill="#000000" opacity="0.25" />
              
              {/* Support structure base */}
              <rect x="45" y="100" width="30" height="20" fill="#6b7280" stroke="#4b5563" strokeWidth="2" rx="2" />
              
              {/* Support legs/posts */}
              <rect x="50" y="80" width="4" height="20" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
              <rect x="66" y="80" width="4" height="20" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
              
              {/* Panel frame - aluminum */}
              <rect x="-3" y="27" width="126" height="56" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" rx="3" transform="skewY(25)" />
              
              {/* Panel surface - dark blue/black */}
              <rect x="0" y="30" width="120" height="50" fill="#1e293b" stroke="#334155" strokeWidth="1" rx="2" transform="skewY(25)" />
              
              {/* Solar cells with silver grid lines */}
              {Array.from({ length: 30 }, (_, i) => {
                const x = (i % 6) * 19 + 2;
                const y = Math.floor(i / 6) * 9 + 32;
                return (
                  <g key={i} transform="skewY(25)">
                    {/* Individual cell */}
                    <rect x={x} y={y} width="17" height="7" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" rx="1">
                      {flowStates.solarActive && (
                        <animate attributeName="fill" values="#0f172a;#1e293b;#334155;#0f172a" dur="3s" repeatCount="indefinite" begin={`${i * 0.08}s`} />
                      )}
                    </rect>
                    {/* Silver busbar lines */}
                    <line x1={x + 3} y1={y} x2={x + 3} y2={y + 7} stroke="#e5e7eb" strokeWidth="0.2" />
                    <line x1={x + 14} y1={y} x2={x + 14} y2={y + 7} stroke="#e5e7eb" strokeWidth="0.2" />
                    <line x1={x} y1={y + 3.5} x2={x + 17} y2={y + 3.5} stroke="#e5e7eb" strokeWidth="0.15" />
                  </g>
                );
              })}
              
              {/* Main silver grid lines */}
              <g transform="skewY(25)">
                <line x1="0" y1="46" x2="120" y2="46" stroke="#d1d5db" strokeWidth="1" />
                <line x1="0" y1="62" x2="120" y2="62" stroke="#d1d5db" strokeWidth="1" />
                <line x1="40" y1="30" x2="40" y2="80" stroke="#d1d5db" strokeWidth="1" />
                <line x1="80" y1="30" x2="80" y2="80" stroke="#d1d5db" strokeWidth="1" />
              </g>
              
              {/* Glow effect when active */}
              {flowStates.solarActive && (
                <rect x="-5" y="25" width="130" height="60" fill="none" stroke="#fbbf24" strokeWidth="2" rx="8" opacity="0.6" transform="skewY(25)">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </rect>
              )}
              
              <text x="60" y="140" textAnchor="middle" className="text-sm font-medium fill-gray-700 dark:fill-gray-300">Ground-Mount Solar</text>
            </g>

            {/* Smart House with attached PowerHive */}
            <g transform="translate(200, 150)">
              {/* 3D SVG house */}
              <g transform="scale(3)">
                {/* House shadow */}
                <ellipse cx="65" cy="95" rx="55" ry="8" fill="#000000" opacity="0.2" />
                
                {/* Front wall */}
                <path d="M 10 60 L 110 60 L 110 90 L 10 90 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                
                {/* Right wall (3D side) */}
                <path d="M 110 60 L 125 50 L 125 80 L 110 90 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1" />
                
                {/* Front roof */}
                <path d="M 5 60 L 60 20 L 115 60 Z" fill="#7f1d1d" stroke="#991b1b" strokeWidth="1" />
                
                {/* Right roof (3D side) */}
                <path d="M 115 60 L 130 50 L 75 10 L 60 20 Z" fill="#6b1d1d" stroke="#991b1b" strokeWidth="1" />
                
                {/* Roof ridge */}
                <path d="M 60 20 L 75 10" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
                
                {/* Front door */}
                <path d="M 50 70 L 70 70 L 70 90 L 50 90 Z" fill="#92400e" stroke="#a16207" strokeWidth="1" />
                <path d="M 70 70 L 75 67 L 75 87 L 70 90 Z" fill="#78350f" stroke="#a16207" strokeWidth="1" />
                <circle cx="67" cy="80" r="1" fill="#fbbf24" />
                
                {/* Front windows */}
                <rect x="25" y="70" width="15" height="12" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" rx="1" />
                <rect x="85" y="70" width="15" height="12" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" rx="1" />
                
                {/* Side window */}
                <path d="M 115 70 L 120 67 L 120 77 L 115 80 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
                
                {/* Window frames */}
                <line x1="32.5" y1="70" x2="32.5" y2="82" stroke="#1d4ed8" strokeWidth="0.5" />
                <line x1="25" y1="76" x2="40" y2="76" stroke="#1d4ed8" strokeWidth="0.5" />
                <line x1="92.5" y1="70" x2="92.5" y2="82" stroke="#1d4ed8" strokeWidth="0.5" />
                <line x1="85" y1="76" x2="100" y2="76" stroke="#1d4ed8" strokeWidth="0.5" />
                
                {/* Chimney front */}
                <rect x="85" y="35" width="8" height="25" fill="#7f1d1d" stroke="#991b1b" strokeWidth="1" />
                
                {/* Chimney side (3D) */}
                <path d="M 93 35 L 98 32 L 98 57 L 93 60 Z" fill="#6b1d1d" stroke="#991b1b" strokeWidth="1" />
                
                {/* Chimney top */}
                <path d="M 85 35 L 93 35 L 98 32 L 90 32 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
                
                {/* Foundation */}
                <path d="M 8 90 L 112 90 L 127 80 L 13 80 Z" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
                
                {/* Decorative elements */}
                <rect x="45" y="65" width="30" height="2" fill="#9ca3af" />
                <rect x="20" y="65" width="20" height="2" fill="#9ca3af" />
                <rect x="80" y="65" width="20" height="2" fill="#9ca3af" />
              </g>
              
              {/* PowerHive Battery - 3D Wall-Mounted Touching House */}
              <g transform="translate(400, 220)" className={flowStates.batteryActive ? 'animate-pulse' : ''}>
                {/* Wall mounting bracket */}
                <rect x="-5" y="10" width="50" height="8" fill="#6b7280" stroke="#4b5563" strokeWidth="1" rx="2" />
                
                {/* Battery housing - main body */}
                <rect x="0" y="0" width="40" height="60" fill="#1f2937" stroke="#111827" strokeWidth="2" rx="4" />
                
                {/* 3D side face */}
                <path d="M 40 0 L 48 -6 L 48 54 L 40 60 Z" fill="#0f172a" stroke="#111827" strokeWidth="1" />
                
                {/* 3D top face */}
                <path d="M 0 0 L 8 -6 L 48 -6 L 40 0 Z" fill="#374151" stroke="#1f2937" strokeWidth="1" />
                
                {/* PowerHive branding */}
                <rect x="2" y="2" width="36" height="12" fill="#374151" stroke="#4b5563" strokeWidth="1" rx="2" />
                <text x="20" y="10" textAnchor="middle" className="text-xs font-bold fill-white">Flux SOS</text>
                
                {/* Battery level indicator */}
                <rect x="3" y={60 - (batteryLevel * 0.45)} width="34" height={batteryLevel * 0.45} 
                      fill={flowStates.batteryActive ? "#10b981" : "#3b82f6"} opacity="0.8" rx="2">
                  {flowStates.batteryActive && (
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                  )}
                </rect>
                
                {/* Battery percentage display */}
                <rect x="5" y="20" width="30" height="8" fill="#000000" opacity="0.7" rx="2" />
                <text x="20" y="26" textAnchor="middle" className="text-xs font-bold fill-white">{Math.round(batteryLevel)}%</text>
                
                {/* Status LED */}
                <circle cx="35" cy="8" r="2" fill={flowStates.batteryActive ? "#10b981" : "#6b7280"}>
                  {flowStates.batteryActive && (
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                  )}
                </circle>
                
                {/* Charging port */}
                <rect x="15" y="55" width="10" height="4" fill="#4b5563" stroke="#374151" strokeWidth="1" rx="1" />
                
                {/* Ventilation grilles */}
                <g>
                  <line x1="5" y1="35" x2="35" y2="35" stroke="#4b5563" strokeWidth="0.5" />
                  <line x1="5" y1="38" x2="35" y2="38" stroke="#4b5563" strokeWidth="0.5" />
                  <line x1="5" y1="41" x2="35" y2="41" stroke="#4b5563" strokeWidth="0.5" />
                </g>
                
                {/* Direct connection to house wall - now touching */}
                <path d="M 0 30 L -5 30" stroke="#374151" strokeWidth="6" fill="none" strokeLinecap="round" />
                
                {/* Charging indicator when active */}
                {flowStates.batteryActive && (
                  <g>
                    <path d="M 17 45 L 21 45 L 19 50 L 23 50 L 19 55 L 15 50 L 19 50 Z" fill="#10b981">
                      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                    </path>
                  </g>
                )}
                
                <text x="20" y="75" textAnchor="middle" className="text-xs font-medium fill-gray-700 dark:fill-gray-300">Flux SOS</text>
              </g>
              
              {/* Smoke when house is active */}
              {(flowStates.solarToHome || flowStates.batteryToHome || flowStates.gridToHome) && (
                <g>
                  <circle cx="300" cy="20" r="3" fill="#d1d5db" opacity="0.7">
                    <animate attributeName="cy" values="20;-10;-40" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0.3;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="300" cy="20" r="2" fill="#d1d5db" opacity="0.5">
                    <animate attributeName="cy" values="20;-10;-40" dur="2s" repeatCount="indefinite" begin="0.5s" />
                    <animate attributeName="opacity" values="0.5;0.2;0" dur="2s" repeatCount="indefinite" begin="0.5s" />
                  </circle>
                </g>
              )}
              
              <text x="200" y="420" textAnchor="middle" className="text-sm font-medium fill-gray-700 dark:fill-gray-300">Smart Home + Flux SOS</text>
            </g>

            {/* PowerHive Battery - Detailed SVG - Moved to separate position */}
            <g transform="translate(600, 100)" className={flowStates.batteryActive ? 'animate-pulse' : ''} style={{ display: 'none' }}>
              {/* This is now hidden since battery is attached to house */}
            </g>

            {/* Grid Tower - Detailed SVG */}
            <g transform="translate(650, 100)" className={flowStates.gridActive ? 'animate-pulse' : ''}>
              {/* Main tower */}
              <path d="M 48 120 L 52 120 L 54 20 L 46 20 Z" fill="url(#gridGradient)" stroke="#4b5563" strokeWidth="1" />
              
              {/* Cross arms */}
              <path d="M 20 40 L 80 40" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
              <path d="M 25 55 L 75 55" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
              <path d="M 30 70 L 70 70" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
              
              {/* Power lines */}
              <path d="M 20 40 Q 10 45 0 40" stroke="#374151" strokeWidth="2" fill="none" />
              <path d="M 80 40 Q 90 45 100 40" stroke="#374151" strokeWidth="2" fill="none" />
              <path d="M 25 55 Q 15 60 5 55" stroke="#374151" strokeWidth="2" fill="none" />
              <path d="M 75 55 Q 85 60 95 55" stroke="#374151" strokeWidth="2" fill="none" />
              
              {/* Status light */}
              <circle cx="50" cy="15" r="4" fill={flowStates.gridActive ? "#10b981" : "#ef4444"}>
                {flowStates.gridActive && (
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                )}
              </circle>
              
              {/* Base foundation */}
              <path d="M 35 120 L 65 120 L 70 130 L 30 130 Z" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
              
              <text x="50" y="150" textAnchor="middle" className="text-sm font-medium fill-gray-700 dark:fill-gray-300">Grid Tower</text>
            </g>

            {/* Power Flow Lines with Animated Particles - Non-crossing paths */}
            
            {/* Solar to Home - Direct path */}
            {flowStates.solarToHome && (
              <g>
                <path d="M 160 140 L 160 200 L 300 200 L 300 360" stroke="url(#solarFlow)" strokeWidth="4" fill="none" strokeDasharray="8,4">
                  <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.5s" repeatCount="indefinite" />
                </path>
                {[...Array(4)].map((_, i) => (
                  <circle key={i} r="5" fill="#fbbf24">
                    <animateMotion path="M 160 140 L 160 200 L 300 200 L 300 360" dur="3s" begin={`${i * 0.75}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin={`${i * 0.75}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </g>
            )}

            {/* Solar to Battery - Upper path */}
            {flowStates.solarToBattery && (
              <g>
                <path d="M 160 140 L 160 160 L 500 160 L 500 220 L 600 220 L 600 370" stroke="url(#solarFlow)" strokeWidth="4" fill="none" strokeDasharray="8,4">
                  <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.5s" repeatCount="indefinite" />
                </path>
                {[...Array(3)].map((_, i) => (
                  <circle key={i} r="5" fill="#fbbf24">
                    <animateMotion path="M 160 140 L 160 160 L 500 160 L 500 220 L 600 220 L 600 370" dur="2.5s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </g>
            )}

            {/* Battery to Home - Direct short path */}
            {flowStates.batteryToHome && (
              <g>
                <path d="M 600 370 L 500 370 L 400 370" stroke="url(#batteryFlow)" strokeWidth="4" fill="none" strokeDasharray="8,4">
                  <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.5s" repeatCount="indefinite" />
                </path>
                {[...Array(3)].map((_, i) => (
                  <circle key={i} r="5" fill="#3b82f6">
                    <animateMotion path="M 600 370 L 500 370 L 400 370" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </g>
            )}

            {/* Grid to Home - Lower path */}
            {flowStates.gridToHome && (
              <g>
                <path d="M 700 220 L 700 300 L 550 300 L 550 380 L 400 380" stroke="url(#gridFlow)" strokeWidth="4" fill="none" strokeDasharray="8,4">
                  <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.5s" repeatCount="indefinite" />
                </path>
                {[...Array(3)].map((_, i) => (
                  <circle key={i} r="5" fill="#8b5cf6">
                    <animateMotion path="M 700 220 L 700 300 L 550 300 L 550 380 L 400 380" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </g>
            )}

            {/* Solar to Grid - Upper path */}
            {flowStates.solarToGrid && (
              <g>
                <path d="M 160 140 L 160 120 L 650 120 L 650 220" stroke="url(#solarFlow)" strokeWidth="4" fill="none" strokeDasharray="8,4">
                  <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.5s" repeatCount="indefinite" />
                </path>
                {[...Array(3)].map((_, i) => (
                  <circle key={i} r="5" fill="#fbbf24">
                    <animateMotion path="M 160 140 L 160 120 L 650 120 L 650 220" dur="2.5s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </g>
            )}

            {/* Grid to Battery - Direct path */}
            {flowStates.gridToBattery && (
              <g>
                <path d="M 700 220 L 700 250 L 650 250 L 650 370 L 600 370" stroke="url(#gridFlow)" strokeWidth="4" fill="none" strokeDasharray="8,4">
                  <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.5s" repeatCount="indefinite" />
                </path>
                {[...Array(3)].map((_, i) => (
                  <circle key={i} r="5" fill="#8b5cf6">
                    <animateMotion path="M 700 220 L 700 250 L 650 250 L 650 370 L 600 370" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </g>
            )}

            {/* Environmental Effects */}
            {flowStates.solarActive && (
              <g transform="translate(160, 50)">
                {/* Sun rays */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 45) * Math.PI / 180;
                  const x2 = Math.cos(angle) * 25;
                  const y2 = Math.sin(angle) * 25;
                  return (
                    <line key={i} x1="0" y1="0" x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                    </line>
                  );
                })}
                <circle cx="0" cy="0" r="8" fill="#fbbf24" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </svg>
        </div>
        
        {/* Status Legend */}
        <div className="mt-4 flex justify-center space-x-4 text-xs">
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
      </CardContent>
    </Card>
  );
};

export default PowerFlowSVG;