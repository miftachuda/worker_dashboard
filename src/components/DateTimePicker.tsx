import { Input } from "./ui/input";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

interface DateRangeWithStatusPickerProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  showStart?: boolean;
  showEnd?: boolean;
}

export function DateRangeWithStatusPicker({
  form,
  setForm,
  showStart = true,
  showEnd = true,
}: DateRangeWithStatusPickerProps) {
  const endTimeValue =
    form.end_time && !isNaN(form.end_time)
      ? new Date(form.end_time * 1000)
      : new Date();
  const startTimeValue =
    form.start_time && !isNaN(form.start_time)
      ? new Date(form.start_time * 1000)
      : new Date();

  const formattedStartTime = startTimeValue.toISOString().slice(0, 16);
  const formattedEndTime = endTimeValue.toISOString().slice(0, 16);
  return (
    <div className="flex flex-col gap-4">
      {showStart && (
        <Flatpickr
          data-enable-time
          options={{ enableTime: true, time_24hr: true }}
          value={form.start_time * 1000}
          onChange={(dates) =>
            setForm((prev) => ({
              ...prev,
              start_time: Math.floor(dates[0].getTime() / 1000),
            }))
          }
        />
      )}

      {showEnd && (
        <Input
          type="datetime-local"
          name="end_time"
          value={formattedEndTime}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              end_time: Math.floor(new Date(e.target.value).getTime() / 1000),
            }))
          }
          className="w-64 text-sm text-gray-200 bg-slate-900 rounded-md p-2"
          style={{
            colorScheme: "dark", // makes native picker dark mode friendly
          }}
        />
      )}
    </div>
  );
}
