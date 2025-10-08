import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { ApplianceProvider } from "./contexts/ApplianceContext";
import Dashboard from "./pages/Dashboard";
import AddAppliance from "./pages/AddAppliance";
import ApplianceDetail from "./pages/ApplianceDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ApplianceProvider>
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddAppliance />} />
            <Route path="/appliance/:id" element={<ApplianceDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ApplianceProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
