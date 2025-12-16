import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, HashRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Worker from "./pages/Workers";
import Shift from "./pages/ShiftCalendar";
import Leave from "./pages/Leaves";
import Report from "./pages/Report";
import Setting from "./pages/Settings";
import Orders from "./pages/Orders";
import Maintenance from "./pages/MaintenanceRecords";
import Chemicalusage from "./pages/ChemicalUsage";
import TankTrend from "./pages/TankTrend";
import Labware from "./pages/Labware";
import Profile from "./pages/Profile";
import LOTO from "./pages/LOTO";
import PowerBi from "./pages/PowerBi";
import Input from "./pages/Input";
import Vibration from "./pages/Vibration";
import Furnace from "./pages/Furnace";
import InputCPDP from "./pages/InputCPDP";
import EditRKAP from "./pages/EditRKAP";
import EditChemical from "./pages/EditChemical";
import EditLeave from "./pages/EditLeave";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workers"
            element={
              <ProtectedRoute>
                <Worker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shift"
            element={
              <ProtectedRoute>
                <Shift />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaves"
            element={
              <ProtectedRoute>
                <Leave />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />

          <Route
            path="/maintenances"
            element={
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chemical"
            element={
              <ProtectedRoute>
                <Chemicalusage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tanktrend"
            element={
              <ProtectedRoute>
                <TankTrend />
              </ProtectedRoute>
            }
          />

          <Route
            path="/labware"
            element={
              <ProtectedRoute>
                <Labware />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loto"
            element={
              <ProtectedRoute>
                <LOTO />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vibration"
            element={
              <ProtectedRoute>
                <Vibration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/furnace"
            element={
              <ProtectedRoute>
                <Furnace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/input"
            element={
              <ProtectedRoute>
                <Input />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inputcpdp"
            element={
              <ProtectedRoute>
                <InputCPDP />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editrkap"
            element={
              <ProtectedRoute>
                <EditRKAP />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editchemical"
            element={
              <ProtectedRoute>
                <EditChemical />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editleave"
            element={
              <ProtectedRoute>
                <EditLeave />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/powerbi"
            element={
              <ProtectedRoute>
                <PowerBi />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
