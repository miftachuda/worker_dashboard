import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ShiftSelector() {
  const [selectedShift, setSelectedShift] = useState("A");
  return (
    <Tabs value={selectedShift} onValueChange={setSelectedShift}>
      <TabsList className="grid grid-cols-4 w-[300px]">
        <TabsTrigger value="A">Shift A</TabsTrigger>
        <TabsTrigger value="B">Shift B</TabsTrigger>
        <TabsTrigger value="C">Shift C</TabsTrigger>
        <TabsTrigger value="D">Shift D</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
