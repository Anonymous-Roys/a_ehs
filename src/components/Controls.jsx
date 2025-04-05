import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { 
  Sun, 
  Battery, 
  Plug, 
  ArrowDownUp, 
  TimerReset, 
  AlertTriangle, 
  BellRing, 
  Volume2, 
  Power, 
  Clock,
  Bolt
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "../lib/utils";

const Controls = () => {
  const [priorityOrder, setPriorityOrder] = useState([
    "solar", "battery", "grid"
  ]);
  
  const [settings, setSettings] = useState({
    autoMode: true,
    batteryThreshold: 20,
    gridFallback: true,
    quietMode: false,
    nightMode: true,
    emergencyReserve: 15,
    notifications: true,
    soundAlerts: false,
    lowBatteryAlert: true
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    toast.success(`${setting} ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : 'updated'}`);
  };

  const handlePriorityUpdate = () => {
    // In a real app, this would update the priority order in the backend
    toast.success("Source priority order updated successfully");
  };

  const handleEmergencyReserve = (value) => {
    setSettings(prev => ({ ...prev, emergencyReserve: value[0] }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">System Controls</h2>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* System Mode Control Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Power className="h-4 w-4 text-primary" />
                    <Label htmlFor="auto-mode">Automatic Mode</Label>
                  </div>
                  <Switch 
                    id="auto-mode" 
                    checked={settings.autoMode}
                    onCheckedChange={(value) => handleSettingChange('autoMode', value)} 
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Plug className="h-4 w-4 text-energy-grid" />
                    <Label htmlFor="grid-fallback">Grid Fallback</Label>
                  </div>
                  <Switch 
                    id="grid-fallback" 
                    checked={settings.gridFallback}
                    onCheckedChange={(value) => handleSettingChange('gridFallback', value)} 
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <Label htmlFor="night-mode">Night Mode</Label>
                  </div>
                  <Switch 
                    id="night-mode" 
                    checked={settings.nightMode}
                    onCheckedChange={(value) => handleSettingChange('nightMode', value)} 
                  />
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={() => toast.info("System diagnostics initiated")}>
                    Run System Diagnostics
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Priority Order Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Energy Source Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Drag to reorder energy sources priority (top = highest)
                </p>
                
                <div className="space-y-2 my-4">
                  {priorityOrder.map((source, index) => (
                    <div 
                      key={source}
                      className={cn(
                        "p-3 rounded-md border border-border bg-secondary flex items-center gap-3 cursor-move",
                        index === 0 && "border-energy-solar"
                      )}
                    >
                      <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                      {source === "solar" && (
                        <>
                          <Sun className="h-5 w-5 text-energy-solar" />
                          <span>Solar Panels</span>
                        </>
                      )}
                      {source === "battery" && (
                        <>
                          <Battery className="h-5 w-5 text-energy-battery" />
                          <span>Battery Storage</span>
                        </>
                      )}
                      {source === "grid" && (
                        <>
                          <Plug className="h-5 w-5 text-energy-grid" />
                          <span>Utility Grid</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button onClick={handlePriorityUpdate} className="w-full">
                  Update Priority
                </Button>
              </CardContent>
            </Card>
            
            {/* Battery Management Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Battery Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>
                        Minimum Battery Threshold ({settings.batteryThreshold}%)
                      </Label>
                      <span className="text-sm text-muted-foreground">Min: 10%</span>
                    </div>
                    <Slider 
                      value={[settings.batteryThreshold]} 
                      min={10} 
                      max={50} 
                      step={5}
                      onValueChange={(value) => handleSettingChange('batteryThreshold', value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      System will switch to grid when battery reaches this level
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>
                        Emergency Reserve ({settings.emergencyReserve}%)
                      </Label>
                      <span className="text-sm text-muted-foreground">Critical: 5%</span>
                    </div>
                    <Slider
                      value={[settings.emergencyReserve]}
                      min={5}
                      max={30}
                      step={5}
                      onValueChange={handleEmergencyReserve}
                    />
                    <p className="text-xs text-muted-foreground">
                      Reserved capacity for emergency situations
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 flex items-center gap-2"
                    onClick={() => toast.info("Battery calibration started")}
                  >
                    <TimerReset className="h-4 w-4" />
                    Calibrate Battery
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Power Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <Bolt className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Advanced power distribution controls are available for authorized technicians only
                  </p>
                  <Button className="mt-4" onClick={() => toast.error("Access restricted to authorized personnel")}>
                    Request Access
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Energy Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Set schedules for optimized energy usage based on time-of-day pricing
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border border-border rounded-md">
                    <div>
                      <p className="font-medium">Peak Hours Avoidance</p>
                      <p className="text-xs text-muted-foreground">Use battery during 2PM-8PM</p>
                    </div>
                    <Switch 
                      checked={true}
                      onCheckedChange={() => toast.success("Schedule updated")}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border border-border rounded-md">
                    <div>
                      <p className="font-medium">Night Charging</p>
                      <p className="text-xs text-muted-foreground">Charge battery during 12AM-6AM</p>
                    </div>
                    <Switch 
                      checked={false} 
                      onCheckedChange={() => toast.success("Schedule updated")}
                    />
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2" onClick={() => toast.info("Coming soon")}>
                    Add Custom Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications & Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4" />
                      <Label htmlFor="notifications">System Notifications</Label>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={settings.notifications}
                      onCheckedChange={(value) => handleSettingChange('notifications', value)} 
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <Label htmlFor="sound-alerts">Sound Alerts</Label>
                    </div>
                    <Switch 
                      id="sound-alerts" 
                      checked={settings.soundAlerts}
                      onCheckedChange={(value) => handleSettingChange('soundAlerts', value)} 
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-energy-consumption" />
                      <Label htmlFor="low-battery">Low Battery Alerts</Label>
                    </div>
                    <Switch 
                      id="low-battery" 
                      checked={settings.lowBatteryAlert}
                      onCheckedChange={(value) => handleSettingChange('lowBatteryAlert', value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Alert Contact Methods</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-alerts" className="rounded border-gray-400" checked />
                      <Label htmlFor="email-alerts" className="text-sm">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms-alerts" className="rounded border-gray-400" />
                      <Label htmlFor="sms-alerts" className="text-sm">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="app-alerts" className="rounded border-gray-400" checked />
                      <Label htmlFor="app-alerts" className="text-sm">In-App</Label>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" onClick={() => toast.info("Settings saved successfully")}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Controls;