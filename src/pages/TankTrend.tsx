import React, { useEffect, useState, useRef } from "react";
import MainFrame from "./MainFrame";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { fetchPHDData, GetDataParams } from "../lib/phdFetch";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";

// === NEW: Imports for Date Picker ===
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// === END NEW ===

interface ChartDataPoint {
  timestamp: string;
  value: number;
}

interface TagOption {
  label: string;
  value: string;
}

// --- START OF CUSTOM AXIS CODE ---
let lastDisplayedDay: string | null = null;
// --- END OF CUSTOM AXIS CODE ---

const TankTrend: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<TagOption>({
    label: "41T-101",
    value: "41T101_P_LEVEL.pv",
  });
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // === NEW: State for Date Range ===
  const [startDate, setStartDate] = useState(
    dayjs("11/01/2025 00:00:00.000", "MM/DD/YYYY HH:mm:ss.SSS").toDate()
  );
  const [endDate, setEndDate] = useState(new Date()); // Defaults to "now"
  // === END NEW ===

  const tagOptions: { label: string; value: string }[] = [
    // ... (your tag options are unchanged)
    { label: "41T-101", value: "41T101_P_LEVEL.pv" },
    { label: "41T-102", value: "41T102_P_LEVEL.pv" },
    { label: "41T-103", value: "41T103_P_LEVEL.pv" },
    { label: "41T-104", value: "41T104_P_LEVEL.pv" },
    { label: "41T-105", value: "41T105_P_LEVEL.pv" },
    { label: "41T-106", value: "41T106_P_LEVEL.pv" },
    { label: "41T-107", value: "41T107_P_LEVEL.pv" },
    { label: "41T-108", value: "41T108_P_LEVEL.pv" },
    { label: "41T-109", value: "41T109_P_LEVEL.pv" },
    { label: "41T-110", value: "41T110_P_LEVEL.pv" },
    { label: "41T-111", value: "41T111_P_LEVEL.pv" },
    { label: "41T-112", value: "41T112_P_LEVEL.pv" },
    { label: "41T-113", value: "41T113_P_LEVEL.pv" },
    { label: "41T-114", value: "41T114_P_LEVEL.pv" },
    { label: "4NB-115", value: "41T115_P_LEVEL.pv" },
    { label: "41T-116", value: "41T116_P_LEVEL.pv" },
    { label: "41T-117", value: "41T117_P_LEVEL.pv" },
    { label: "41T-118", value: "41T118_P_LEVEL.pv" },
    { label: "41T-119", value: "41T119_P_LEVEL.pv" },
    { label: "41T-120", value: "41T120_P_LEVEL.pv" },
    { label: "41T-121", value: "41T121_P_LEVEL.pv" },
    { label: "41T-122", value: "41T122_P_LEVEL.pv" },
  ];

  const filteredOptions = tagOptions.filter((tag) =>
    tag.label.toLowerCase().includes(search.toLowerCase())
  );

  // === MODIFIED: getData function ===
  // It now uses the startDate and endDate from state
  const getData = async (tagName: string) => {
    // Format the dates from state into the string format your API expects
    const formattedStartTime = dayjs(startDate).format(
      "MM/DD/YYYY HH:mm:ss.SSS"
    );
    const formattedEndTime = dayjs(endDate).format("MM/DD/YYYY HH:mm:ss.SSS");

    const params: GetDataParams = {
      startTime: formattedStartTime, // Use formatted date from state
      endTime: formattedEndTime, // Use formatted date from state
      interval: 900000,
      tagName: [tagName],
    };

    try {
      setLoading(true);
      setError(null);
      const result = (await fetchPHDData(params))[0];
      const timestamps: string[] = result.TimeStamp || [];
      const values: number[] = result.Value || [];
      setData(
        timestamps.map((ts, idx) => ({
          timestamp: ts,
          value: Number(values[idx].toFixed(1)),
        }))
      );
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // === MODIFIED: useEffect for data fetching ===
  // Added startDate and endDate to the dependency array
  useEffect(() => {
    // Ensure dates are valid before fetching
    if (startDate && endDate) {
      getData(selectedTag.value);
    }
  }, [selectedTag, startDate, endDate]); // Refetch when tag OR dates change

  // Klik di luar dropdown untuk menutup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const targetTicks = 60;
  const interval = Math.max(1, Math.floor(data.length / targetTicks));

  lastDisplayedDay = null;
  const CustomizedAxisTick = (props: any) => {
    // ... (your CustomizedAxisTick component is unchanged)
    const { x, y, payload, index } = props;
    const { value } = payload; // This is the timestamp

    const date = dayjs(value);
    const currentDay = date.format("MM/DD");

    let displayText = "";
    let color = "#94a3b8"; // Default color for TIME (slate-400)

    if (index === 0) {
      displayText = date.format("HH:mm");
      lastDisplayedDay = currentDay; // Set the day tracker
    } else if (currentDay !== lastDisplayedDay) {
      lastDisplayedDay = currentDay;
      displayText = date.format("DD-MMM-YY");
      color = "#32CD32"; // Color for DATE
    } else {
      displayText = date.format("HH:mm");
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16} // Pushes text down from the axis line
          textAnchor="end"
          fill={color} // Apply the conditional color
          transform="rotate(-45)"
          fontSize={10}
        >
          {displayText}
        </text>
      </g>
    );
  };
  return (
    <MainFrame>
      <div className="w-full h-full flex flex-col gap-4 p-4">
        {/* === NEW: Control Bar Wrapper === */}
        <div className="flex flex-wrap items-center gap-4">
          {/* === Dropdown + Search (Existing) === */}
          <div className="relative w-64" ref={dropdownRef}>
            <div
              className="flex items-center justify-between border border-gray-500 bg-slate-900 text-slate-100 rounded-md px-3 py-2 cursor-pointer select-none"
              onClick={() => setOpen((prev) => !prev)}
            >
              <span>{selectedTag.label}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>

            {open && (
              <div className="absolute top-12 left-0 right-0 bg-slate-800 border border-gray-600 rounded-md z-20">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 text-slate-100 border-b border-gray-600 outline-none"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto">
                  {filteredOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        setSelectedTag(opt);
                        setSearch("");
                        setOpen(false);
                      }}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-700 ${
                        selectedTag.value === opt.value ? "bg-slate-700" : ""
                      }`}
                    >
                      {opt.label}
                    </div>
                  ))}
                  {filteredOptions.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-400">
                      No results
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* === NEW: Date Range Selectors === */}
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-sm text-slate-300">
              Start:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              showTimeSelect
              dateFormat="MM/dd/yyyy HH:mm"
              className="w-40 bg-slate-900 text-slate-100 border border-gray-500 rounded-md px-3 py-2 text-sm outline-none"
              id="startDate"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="text-sm text-slate-300">
              End:
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              showTimeSelect
              dateFormat="MM/dd/yyyy HH:mm"
              className="w-40 bg-slate-900 text-slate-100 border border-gray-500 rounded-md px-3 py-2 text-sm outline-none"
              id="endDate"
            />
          </div>
          {/* === END NEW === */}
        </div>

        {/* === Chart === */}
        {/* This container handles the height and horizontal scrolling */}
        <div className="flex-1 w-full overflow-x-auto overflow-y-hidden">
          {loading && <p>Loading data...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {!loading && !error && data.length > 0 && (
            // This div sets the minimum width to enable scrolling
            <div style={{ minWidth: "2000px", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

                  <XAxis
                    dataKey="timestamp"
                    stroke="#94a3b8"
                    tick={<CustomizedAxisTick />}
                    interval={interval}
                  />

                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                    }}
                    labelStyle={{ color: "#cbd5e1" }}
                    labelFormatter={(label) =>
                      dayjs(label).format("DD-MMM-YY HH:mm")
                    }
                  />
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="url(#colorValue)"
                    fillOpacity={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {!loading && !error && data.length === 0 && <p>No data available</p>}
        </div>
      </div>
    </MainFrame>
  );
};

export default TankTrend;
