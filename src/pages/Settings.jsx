import { useState } from "react";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
import { 
  Sliders, 
  BellRing, 
  Users, 
  Shield, 
  Wifi, 
  Clock, 
  RefreshCw,
  Save
} from "lucide-react";

const Settings = () => {
  // const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // toast({
      //   title: "Settings Saved",
      //   description: "Your settings have been successfully updated.",
      // });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-28 animate-fade-in">
        <h1 className="text-3xl font-medium tracking-tight mb-10">Settings</h1>
        
        <Tabs defaultValue="system" className="mb-10">
          <TabsList className="mb-6">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="system" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="energy-card">
                <CardHeader>
                  <CardTitle className="text-xl font-medium flex items-center">
                    <Sliders className="mr-2 h-5 w-5" />
                    Energy Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-switching">Automatic Source Switching</Label>
                      <Switch id="auto-switching" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically switch between energy sources based on availability and cost
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="grid-fallback">Grid Fallback Protection</Label>
                      <Switch id="grid-fallback" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically switch to grid power when battery level is critically low
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="battery-threshold">Battery Threshold (%)</Label>
                    <Input id="battery-threshold" type="number" defaultValue="15" min="5" max="50" />
                    <p className="text-sm text-muted-foreground">
                      Minimum battery level before switching to grid power
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority-order">Energy Source Priority</Label>
                    <select 
                      id="priority-order" 
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="solar-battery-grid">Solar → Battery → Grid</option>
                      <option value="solar-grid-battery">Solar → Grid → Battery</option>
                      <option value="battery-solar-grid">Battery → Solar → Grid</option>
                      <option value="cost-based">Cost-based (Automatic)</option>
                    </select>
                    <p className="text-sm text-muted-foreground">
                      Order in which energy sources will be used
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="energy-card">
                <CardHeader>
                  <CardTitle className="text-xl font-medium flex items-center">
                    <Wifi className="mr-2 h-5 w-5" />
                    Connectivity Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="wifi-network">Wi-Fi Network</Label>
                    <Input id="wifi-network" defaultValue="HomeNetwork" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wifi-password">Wi-Fi Password</Label>
                    <Input id="wifi-password" type="password" defaultValue="••••••••••" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cloud-sync">Cloud Synchronization</Label>
                      <Switch id="cloud-sync" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Synchronize your energy data with cloud services
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="remote-access">Remote Access</Label>
                      <Switch id="remote-access" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow remote access to your energy system
                    </p>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" className="w-[48%]">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Test Connection
                    </Button>
                    <Button className="w-[48%]">
                      <Shield className="mr-2 h-4 w-4" />
                      Secure Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="energy-card">
                <CardHeader>
                  <CardTitle className="text-xl font-medium flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Scheduling
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="time-based-control">Time-Based Control</Label>
                      <Switch id="time-based-control" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enable time-based control of energy sources
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="peak-start">Peak Hours Start</Label>
                      <Input id="peak-start" type="time" defaultValue="17:00" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="peak-end">Peak Hours End</Label>
                      <Input id="peak-end" type="time" defaultValue="21:00" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="peak-strategy">Peak Hours Strategy</Label>
                    <select 
                      id="peak-strategy" 
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="battery-only">Battery Only</option>
                      <option value="battery-solar">Battery + Solar</option>
                      <option value="minimize-grid">Minimize Grid Usage</option>
                      <option value="cost-optimized">Cost Optimized</option>
                    </select>
                    <p className="text-sm text-muted-foreground">
                      Energy strategy during peak hours
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="lg:col-span-2">
                <Button className="w-full" size="lg" onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save All Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="animate-fade-in">
            <Card className="energy-card">
              <CardHeader>
                <CardTitle className="text-xl font-medium flex items-center">
                  <BellRing className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alert Types</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="battery-alerts">Low Battery Alerts</Label>
                      <Switch id="battery-alerts" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when battery level drops below threshold
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="power-outage">Power Outage Alerts</Label>
                      <Switch id="power-outage" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications during grid power outages
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="performance-alerts">Performance Alerts</Label>
                      <Switch id="performance-alerts" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about system performance issues
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="usage-reports">Usage Reports</Label>
                      <Switch id="usage-reports" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly energy usage and savings reports
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Notification Methods</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notify">Email Notifications</Label>
                      <Switch id="email-notify" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input id="email-address" type="email" defaultValue="user@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notify">SMS Notifications</Label>
                      <Switch id="sms-notify" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <Input id="phone-number" type="tel" placeholder="+1 (555) 123-4567" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notify">Push Notifications</Label>
                      <Switch id="push-notify" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full" onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving Preferences...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="animate-fade-in">
            <Card className="energy-card">
              <CardHeader>
                <CardTitle className="text-xl font-medium flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" defaultValue="John" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" defaultValue="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <Input id="profile-email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <Switch id="two-factor" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Installation Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="system-id">System ID</Label>
                    <Input id="system-id" defaultValue="ECORES-10085" readOnly className="bg-muted" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="installation-date">Installation Date</Label>
                    <Input id="installation-date" type="date" defaultValue="2023-06-15" readOnly className="bg-muted" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firmware-version">Firmware Version</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="firmware-version" defaultValue="v2.4.5" readOnly className="bg-muted" />
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full" onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving Account Information...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Account Information
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;