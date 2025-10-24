import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Props type for clarity
interface DateSelectorProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DateSelector({ value, onChange }: DateSelectorProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (date) {
                onChange(date); // only update if date is not undefined
                setOpen(false);
              }
            }}
            initialFocus
            classNames={{
              day_today: "bg-blue-100 text-blue-700 font-bold", // current day
              day_selected: "bg-blue-600 text-white hover:bg-blue-700", // selected date
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
