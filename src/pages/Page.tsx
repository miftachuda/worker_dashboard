import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

export default function DatePickerTest() {
  const [value, setValue] = useState(dayjs());

  return (
    <div className="p-10">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker label="Start" value={value} onChange={setValue} />
      </LocalizationProvider>
    </div>
  );
}
