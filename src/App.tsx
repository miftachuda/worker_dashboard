import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, HashRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Worker from "./pages/Workers";
import Shift from "./pages/ShiftCalendar";
import Leave from "./pages/Leaves";
import Report from "./pages/Report";
import Setting from "./pages/Settings";
import Orders from "./pages/Orders";
import Maintenance from "./pages/MaintenanceRecords";
import Test from "./pages/Test";
import Chemicalusage from "./pages/ChemicalUsage";
import DatePickerTest from "./pages/Page";
import TankTrend from "./pages/TankTrend";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workers" element={<Worker />} />
          <Route path="/shift" element={<Shift />} />
          <Route path="/leaves" element={<Leave />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/maintenances" element={<Maintenance />} />
          <Route path="/chemical" element={<Chemicalusage />} />
          <Route path="/tanktrend" element={<TankTrend />} />
          <Route path="/settings" element={<Test />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/test" element={<DatePickerTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
