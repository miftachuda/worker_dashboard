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
  return (
    <div className="flex flex-col gap-4">
      {showStart && (
        <Input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, start_time: e.target.value }))
          }
        />
      )}

      {showEnd && (
        <Input
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, end_time: e.target.value }))
          }
        />
      )}
    </div>
  );
}
