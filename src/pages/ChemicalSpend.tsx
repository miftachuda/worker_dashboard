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
interface Post {
  id: string;
  chemical_name: string;
  amount: number;
  unit: string;
  time: number;
  created: string;
  updated: string;
}

const ChemicalSpend: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ChemicalSpend, setChemicalSpend] = useState<Post[]>([]);

  const [form, setForm] = useState({
    chemicalName: "",
    amount: "",
    unit: "",
    time: dayjs(), // store time directly here
  });
  const grouped = ChemicalSpend.reduce((acc, item) => {
    if (!acc[item.chemical_name]) {
      acc[item.chemical_name] = [];
    }
    acc[item.chemical_name].push(item);
    return acc;
  }, {} as Record<string, typeof ChemicalSpend>);

  // Create separate variables
  const furfural = grouped["Furfural"] || [];
  const propane = grouped["Propane"] || [];
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
      await pb.collection("chemical_spend").create({
        chemical_name: form.chemicalName,
        amount: parseFloat(form.amount),
        unit: form.unit,
        time: form.time ? Math.floor((form.time as Dayjs).unix()) : undefined,
      });

      setOpen(false);
      setForm({
        chemicalName: "",
        amount: "",
        unit: "",
        time: dayjs(),
      });
      toast.success("Chemical spend saved successfully!");
    } catch (error) {
      toast.error("Failed to save.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const records = await pb
          .collection("chemical_spend")
          .getFullList<Post>({
            sort: "created",
          });
        setChemicalSpend(records);
      } catch (err) {
        console.error("Error fetching equipment:", err);
      }
    };
    fetchEquipment();
  }, []);
  return (
    <MainFrame>
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Chemical Spend Records</h2>
        <ToastContainer />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Spend Record
        </Button>

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

export default ChemicalSpend;
