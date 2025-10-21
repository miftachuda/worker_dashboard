import React, { useState } from "react";

import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface DateRangeWithStatusPickerProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  showStart?: boolean;
  showEnd?: boolean;
}

// Create a custom theme to override input styles specifically for the pickers
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
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffffff",
          },
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
          "&.Mui-focused": {
            color: "#ffffff",
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
  },
});

export function DateRangeWithStatusPicker({
  form,
  setForm,
  showStart = true,
  showEnd = true,
  lastDate,
}: DateRangeWithStatusPickerProps) {
  // Local states for the MUI pickers
  const [startValue, setStartValue] = useState<dayjs.Dayjs | null>(
    form.start_time ? dayjs(form.start_time * 1000) : dayjs()
  );
  const [endValue, setEndValue] = useState<dayjs.Dayjs | null>(
    form.end_time ? dayjs(form.end_time * 1000) : dayjs()
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex flex-col gap-4">
          {showStart && (
            <DateTimePicker
              label="Start Maintenance Time"
              value={startValue}
              ampm={false}
              format="DD/MMM/YYYY HH:mm"
              onChange={(newValue) => {
                setStartValue(newValue);
                if (newValue) {
                  setForm((prev) => ({
                    ...prev,
                    start_time: Math.floor(newValue.unix()),
                  }));
                }
              }}
              slots={{
                openPickerIcon: EditCalendarIcon,
              }}
              slotProps={{
                popper: {
                  disablePortal: true,
                  style: {
                    zIndex: 1300,
                  },
                },
              }}
            />
          )}

          {showEnd && (
            <div className="flex flex-col gap-2">
              <DateTimePicker
                label="End Maintenance Time"
                value={endValue}
                ampm={false} // 24-hour format
                format="DD/MMM/YYYY HH:mm"
                views={["year", "month", "day", "hours", "minutes"]}
                slots={{
                  openPickerIcon: EditCalendarIcon,
                }}
                slotProps={{
                  popper: {
                    disablePortal: true,
                    style: {
                      zIndex: 1300,
                    },
                  },
                }}
                onChange={(newValue) => {
                  setEndValue(newValue);
                  if (newValue) {
                    setForm((prev) => ({
                      ...prev,
                      end_time: Math.floor(newValue.unix()),
                    }));
                  }
                }}
              />
            </div>
          )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
