import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import Database from "./pages/Database";
import Equipment from "./pages/EquipmentManagement";
import GPS from "./pages/GPSTracking";
import Settings from "./pages/Settings";
import AI from "./pages/AI";
import ClientWebsite from "./pages/ClientWebsite";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/client" element={<ClientWebsite />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/gps" element={<GPS />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/database" element={<Database />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai" element={<AI />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
