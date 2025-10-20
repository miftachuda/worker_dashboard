import React, { useState } from "react";
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

// Mock data for chemicals and their associated units
const chemicalData = [
  { name: "Furfural", units: ["m³", "% Vessel"] },
  { name: "MEK", units: ["m³", "% Vessel"] },
  { name: "Toluene", units: ["m³", "% Vessel"] },
  { name: "Sobi", units: ["kg", "Sack"] },
  { name: "Antifoam", units: ["Litre", "kg"] },
  { name: "Propane", units: ["m³", "% Vessel"] },
];

const ChemicalSpend: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    chemicalName: "",
    amount: "",
    unit: "",
  });
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);

  const handleChemicalChange = (chemicalName: string) => {
    const selectedChemical = chemicalData.find((c) => c.name === chemicalName);
    const units = selectedChemical ? selectedChemical.units : [];
    setAvailableUnits(units);
    setForm((prev) => ({
      ...prev,
      chemicalName,
      unit: units[0] || "", // Default to the first available unit
    }));
  };

  const handleSave = () => {
    console.log("Saving chemical spend:", form);
    setOpen(false);
  };

  return (
    <MainFrame>
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Chemical Spend Records</h2>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Spend Record
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Chemical Spend</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* TODO: Display the list of chemical spend records here */}
      </main>
    </MainFrame>
  );
};

export default ChemicalSpend;
