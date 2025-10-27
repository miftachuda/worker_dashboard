import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { ToastContainer, toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DashboardPerformance from "../components/chemical_usage/chart";
import { ChemicalUsage } from "../types/ChemicalUsage";

const chemicalData = [
  { name: "Furfural", units: ["% Vessel", "m³", "kg"] },
  { name: "MEK", units: ["% Vessel", "m³"] },
  { name: "Toluene", units: ["% Vessel", "m³"] },
  { name: "Sobi", units: ["kg", "Sack"] },
  { name: "Antifoam", units: ["Liter", "kg"] },
  { name: "Propane", units: ["m³", "% Vessel"] },
];

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#ffffff",
      secondary: "#ffffff",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ffffff" },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffffff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffffff",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-focused": { color: "#ffffff" },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: { color: "#ffffff" },
      },
    },
  },
});

const Chemicalusage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Chemicalusage, setChemicalusage] = useState<ChemicalUsage[]>([]);

  const [form, setForm] = useState({
    chemicalName: "",
    amount: "",
    unit: "",
    time: dayjs(), // store time directly here
  });
  const grouped = Chemicalusage.reduce((acc, item) => {
    if (!acc[item.chemical_name]) {
      acc[item.chemical_name] = [];
    }
    acc[item.chemical_name].push(item);
    return acc;
  }, {} as Record<string, typeof Chemicalusage>);
  function sumAmounts(arr) {
    if (!Array.isArray(arr)) return 0;

    return arr.reduce((total, item) => {
      const value = parseFloat(item.amount);
      return total + (isNaN(value) ? 0 : value);
    }, 0);
  }
  // Create separate variables
  const fpersentonmcubic = 1.82; // example: 1% Vessel = 1.82 m³
  const fpersentoton = 2.11;
  const ftontomcubic = fpersentonmcubic / fpersentoton;
  const mtpersentonmcubic = 0.95; // example: 1% Vessel = 1.82 m³
  const mtpersentoton = 0.8279;
  const mttontomcubic = mtpersentonmcubic / mtpersentoton;

  const furfural = (grouped["Furfural"] || []).map((item) => {
    if (item.unit === "% Vessel") {
      return {
        ...item,
        amount: (item.amount * fpersentonmcubic).toFixed(2),
        unit: "m³",
      };
    }
    if (item.unit === "m³") {
      return item;
    }
    if (item.unit === "kg") {
      return {
        ...item,
        amount: ((item.amount * ftontomcubic) / 1000).toFixed(2),
        unit: "m³",
      };
    }
  });
  const MEK = (grouped["MEK"] || []).map((item) => {
    if (item.unit === "% Vessel") {
      return {
        ...item,
        amount: (item.amount * mtpersentonmcubic).toFixed(2),
        unit: "m³",
      };
    }
    if (item.unit === "m³") {
      return item;
    }
    if (item.unit === "kg") {
      return {
        ...item,
        amount: ((item.amount * mttontomcubic) / 1000).toFixed(2),
        unit: "m³",
      };
    }
  });
  const Toluene = (grouped["Toluene"] || []).map((item) => {
    if (item.unit === "% Vessel") {
      return {
        ...item,
        amount: (item.amount * mtpersentonmcubic).toFixed(2),
        unit: "m³",
      };
    }
    if (item.unit === "m³") {
      return item;
    }
    if (item.unit === "kg") {
      return {
        ...item,
        amount: ((item.amount * mttontomcubic) / 1000).toFixed(2),
        unit: "m³",
      };
    }
  });
  const propane = grouped["Propane"] || [];

  const sumFurfural = sumAmounts(furfural).toFixed(2);
  const sumMEK = sumAmounts(MEK).toFixed(2);
  const sumToluene = sumAmounts(Toluene).toFixed(2);
  const sumPropane = sumAmounts(propane).toFixed(2);
  const allChemicalusage = [furfural, MEK, Toluene, propane];
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);

  const handleChemicalChange = (chemicalName: string) => {
    const selectedChemical = chemicalData.find((c) => c.name === chemicalName);
    const units = selectedChemical ? selectedChemical.units : [];
    setAvailableUnits(units);
    setForm((prev) => ({
      ...prev,
      chemicalName,
      unit: units[0] || "",
    }));
  };

  const handleSave = async () => {
    if (!form.chemicalName || !form.amount || !form.unit) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await pb.collection("chemical_usage").create({
        chemical_name: form.chemicalName,
        amount: parseFloat(form.amount),
        unit: form.unit,
        time: form.time ? Math.floor((form.time as Dayjs).unix()) : undefined,
      });
      await fetchChemicalUsage();
      setOpen(false);
      setForm({
        chemicalName: "",
        amount: "",
        unit: "",
        time: dayjs(),
      });
      toast.success("Chemical Usage Record Saved Successfully!");
    } catch (error) {
      toast.error("Failed to save.");
    } finally {
      setLoading(false);
    }
  };
  const fetchChemicalUsage = async () => {
    try {
      const records = await pb
        .collection("chemical_usage")
        .getFullList<ChemicalUsage>({
          sort: "time",
        });
      setChemicalusage(records);
    } catch (err) {
      console.error("Error fetching chemical usage:", err);
    }
  };
  useEffect(() => {
    fetchChemicalUsage();
  }, []);

  return (
    <MainFrame>
      <main className="p-6">
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          theme="dark"
        />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Chemical usage record
        </Button>
        <div className="pt-3 min-h-screen">
          <DashboardPerformance
            title="Chart of Chemical Usage"
            chartData={allChemicalusage}
            chartColor="#ff4db8"
            metrics={[
              {
                title: "Furfural Used",
                value: sumFurfural,
                icon: <div className="font-extrabold">FUR</div>,
                gradient: "linear-gradient(135deg,#ff6a00,#ee0979)",
              },
              {
                title: "MEK Used",
                value: sumMEK,
                icon: <div className="font-extrabold">MEK</div>,
                gradient: "linear-gradient(135deg,#7928ca,#ff0080)",
              },
              {
                title: "Toluene Used",
                value: sumToluene,
                icon: <div className="font-extrabold">TOL</div>,
                gradient: "linear-gradient(135deg,#00c6ff,#0072ff)",
              },
              {
                title: "Propane Used",
                value: sumPropane,
                icon: <div className="font-extrabold">PROP</div>,
                gradient: "linear-gradient(135deg,#f85032,#e73827)",
              },
            ]}
            onChemicalChange={(chemical) => {
              console.log("Selected chemical:", chemical);
              // update chartData or fetch new data here
            }}
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Chemical Spend</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Chemical Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chemicalName" className="text-right">
                  Chemical
                </Label>
                <Select
                  onValueChange={handleChemicalChange}
                  value={form.chemicalName}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a chemical" />
                  </SelectTrigger>
                  <SelectContent>
                    {chemicalData.map((chem) => (
                      <SelectItem key={chem.name} value={chem.name}>
                        {chem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="col-span-3"
                />
              </div>

              {/* Unit */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unit
                </Label>
                <Select
                  onValueChange={(value) => setForm({ ...form, unit: value })}
                  value={form.unit}
                  disabled={!form.chemicalName}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <div className="col-span-3">
                  <ThemeProvider theme={darkTheme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Select Time"
                        ampm={false}
                        value={form.time}
                        onChange={(newValue) =>
                          setForm({ ...form, time: newValue })
                        }
                        format="DD/MMM/YYYY HH:mm"
                        slotProps={{
                          popper: { disablePortal: true },
                        }}
                      />
                    </LocalizationProvider>
                  </ThemeProvider>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </MainFrame>
  );
};

export default Chemicalusage;
