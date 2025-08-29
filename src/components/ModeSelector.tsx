import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ModeSelectorProps = {
  selectedMode: string;
  onModeChange: (Mode: string) => void;
};

export default function ModeSelector({
  selectedMode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <Tabs value={selectedMode} onValueChange={onModeChange}>
      <TabsList className="grid grid-cols-2 w-auto">
        <TabsTrigger value="Mode 1">Mode 1</TabsTrigger>
        <TabsTrigger value="Mode 2">Mode 2</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
