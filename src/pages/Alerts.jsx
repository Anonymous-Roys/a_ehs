import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  AlertTriangle, 
  Info, 
  Check, 
  AlertCircle, 
  Bell, 
  CheckCircle2, 
  RefreshCw 
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";
import { toast } from "sonner";

// type AlertSeverity = "critical" | "warning" | "info";

// interface  {
//   id: string;
//   severity: "critical" | "warning" | "info";
//   title: string;
//   message: string;
//   timestamp: string;
//   resolved: boolean;
// }

const alerts = [
  {
    id: "1",
    severity: "critical",
    title: "Low Battery",
    message: "Battery level has dropped below 30%. Consider switching to grid power or reducing consumption.",
    timestamp: "Today, 10:23 AM",
    resolved: false
  },
  {
    id: "2",
    severity: "warning",
    title: "Solar Panel Efficiency",
    message: "Solar panel efficiency has decreased to 70% due to weather conditions. Expected to improve in 3 hours.",
    timestamp: "Today, 08:15 AM",
    resolved: false
  },
  {
    id: "3",
    severity: "info",
    title: "System Switched Sources",
    message: "System automatically switched from grid to battery power due to detected price increase.",
    timestamp: "Yesterday, 06:45 PM",
    resolved: true
  },
  {
    id: "4",
    severity: "warning",
    title: "Grid Instability",
    message: "Grid power fluctuations detected. System will prioritize battery usage until stabilized.",
    timestamp: "Yesterday, 03:22 PM",
    resolved: true
  },
  {
    id: "5",
    severity: "info",
    title: "Battery Charged",
    message: "Battery has reached 100% charge. Excess solar power redirected to home usage.",
    timestamp: "Yesterday, 01:10 PM",
    resolved: true
  },
  {
    id: "6",
    severity: "critical",
    title: "Connection Lost",
    message: "Connection to the solar panel controller was temporarily lost. Reconnected automatically after 5 minutes.",
    timestamp: "2 days ago, 11:45 AM",
    resolved: true
  }
];

const getAlertIcon = (severity, resolved) => {
  if (resolved) return <CheckCircle2 className="h-5 w-5 text-muted-foreground" />;
  
  switch (severity) {
    case "critical":
      return <AlertCircle className="h-5 w-5 text-energy-consumption" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-energy-battery" />;
    case "info":
      return <Info className="h-5 w-5 text-energy-grid" />;
  }
};

const getSeverityBadge = (severity, resolved) => {
  if (resolved) {
    return <Badge variant="outline" className="text-xs">Resolved</Badge>;
  }
  
  switch (severity) {
    case "critical":
      return <Badge variant="destructive" className="text-xs">Critical</Badge>;
    case "warning":
      return <Badge className="bg-energy-battery text-xs">Warning</Badge>;
    case "info":
      return <Badge className="bg-energy-grid text-xs">Info</Badge>;
  }
};

const Alerts = () => {
  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);
  
  const handleMarkResolved = (id) => {
    toast.success("Alert marked as resolved");
  };
  
  const handleResolveAll = () => {
    toast.success("All alerts marked as resolved");
  };
  
  const handleClearHistory = () => {
    toast.success("Alert history cleared");
  };
  
  const handleTestAlerts = () => {
    toast.info("Test alert sent");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">System Alerts</h2>
        <Button onClick={handleTestAlerts} size="sm" variant="outline" className="flex items-center gap-1">
          <Bell className="h-4 w-4" />
          Test Alerts
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-energy-consumption" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.filter(a => a.severity === "critical" && !a.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-energy-battery" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.filter(a => a.severity === "warning" && !a.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">May require attention soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Info className="h-4 w-4 text-energy-grid" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.filter(a => a.severity === "info" && !a.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">System information updates</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> 
              Active ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="flex items-center gap-1">
              <Check className="h-4 w-4" /> 
              Resolved ({resolvedAlerts.length})
            </TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={activeAlerts.length > 0 ? handleResolveAll : handleClearHistory}
          >
            {activeAlerts.length > 0 ? "Resolve All" : "Clear History"}
          </Button>
        </div>
        
        <TabsContent value="active">
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-10">
                <Check className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                <p className="text-muted-foreground">
                  There are no active alerts in your system. Everything is running smoothly.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className={cn(
                  "overflow-hidden",
                  alert.severity === "critical" && "border-energy-consumption/30"
                )}>
                  <CardContent className="p-0">
                    <div className="flex p-4">
                      <div className="mr-4 pt-1">
                        {getAlertIcon(alert.severity, alert.resolved)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{alert.title}</h3>
                          {getSeverityBadge(alert.severity, alert.resolved)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkResolved(alert.id)}
                          >
                            Mark Resolved
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resolved">
          {resolvedAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center p-10">
                <p className="text-muted-foreground">
                  No resolved alerts history available.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {resolvedAlerts.map((alert) => (
                <Card key={alert.id} className="border-border/50">
                  <CardContent className="p-0">
                    <div className="flex p-4">
                      <div className="mr-4 pt-1">
                        {getAlertIcon(alert.severity, alert.resolved)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-muted-foreground">{alert.title}</h3>
                          {getSeverityBadge(alert.severity, alert.resolved)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => toast.info("Alert reactivated")}
                            className="flex items-center gap-1"
                          >
                            <RefreshCw className="h-3 w-3" /> Reactivate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;