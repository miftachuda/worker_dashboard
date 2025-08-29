import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Worker from "./pages/Workers";
import Shift from "./pages/Shift";
import Leave from "./pages/Leaves";
import Report from "./pages/Report";
import Notif from "./pages/Notif";
import Setting from "./pages/Setting";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workers" element={<Worker />} />
          <Route path="/shift" element={<Shift />} />
          <Route path="/leaves" element={<Leave />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/notifications" element={<Notif />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
