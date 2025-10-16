import { Input } from "./ui/input";

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
        <Input
          type="datetime-local"
          name="start_time"
          value={formattedStartTime}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              start_time: Math.floor(new Date(e.target.value).getTime() / 1000),
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
        />
      )}
    </div>
  );
}
