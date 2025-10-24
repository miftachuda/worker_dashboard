import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ShiftSelectorProps = {
  selectedShift: string;
  onShiftChange: (shift: string) => void;
};

export default function ShiftSelector({
  selectedShift,
  onShiftChange,
}: ShiftSelectorProps) {
  return (
    <Tabs value={selectedShift} onValueChange={onShiftChange}>
      <TabsList className="grid grid-cols-4 w-[300px]">
        <TabsTrigger value="A">Shift A</TabsTrigger>
        <TabsTrigger value="B">Shift B</TabsTrigger>
        <TabsTrigger value="C">Shift C</TabsTrigger>
        <TabsTrigger value="D">Shift D</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
