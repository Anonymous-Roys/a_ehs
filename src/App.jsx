
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Alerts from "./pages/Alerts";
import Controls from "./components/Controls";
import Connection from "./pages/Connection";
import { Toaster } from "sonner";
import SolarDetailsPage from "./components/solar/SolarDetails";
import BatteryDetails from "./pages/battery/BatteryDetails";
import LoadDetails from "./pages/LoadDetails";
import BatterySettings from "./pages/battery/BatterySettings";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-center"  />
      {/* <Sonner /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/a" element={<Alerts />} />
          <Route path="/c" element={<Controls />} />
          <Route path="/solar-details" element={<SolarDetailsPage />} />
          <Route path="/battery-details" element={<BatteryDetails />} />
          <Route path="/battery-details/battery-settings/" element={<BatterySettings />} />
          <Route path="/grid-details" element={<BatteryDetails />} />
          <Route path="/load-details" element={<LoadDetails />} />
          <Route path="/wind-details" element={<BatteryDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
