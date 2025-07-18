
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BarChartGenerator from "./components/BarChartGenerator";
import PieChartGenerator from "./components/PieChartGenerator";
import SavedBarCharts from "./components/SavedBarCharts";
import SavedPieCharts from "./components/SavedPieCharts";
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
          <Route path="/bar-chart" element={<BarChartGenerator />} />
          <Route path="/pie-chart" element={<PieChartGenerator />} />
          <Route path="/saved-bar" element={<SavedBarCharts />} />
          <Route path="/saved-pie" element={<SavedPieCharts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
