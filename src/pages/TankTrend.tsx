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
  AreaChart,
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
  level: number;
  temperature: number;
}

interface TagOption {
  label: string;
  value: string;
  temp: string;
}

let lastDisplayedDay: string | null = null;

const TankTrend: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<TagOption>({
    label: "41T-101",
    value: "41T101_P_LEVEL.pv",
    temp: "41T101_P_TEMP.PV",
  });
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState(
    dayjs("11/01/2025 00:00:00.000", "MM/DD/YYYY HH:mm:ss.SSS").toDate()
  );
  const [endDate, setEndDate] = useState(new Date());
  const tagOptions: { label: string; value: string; temp: string }[] = [
    { label: "41T-101", value: "41T101_P_LEVEL.pv", temp: "41T101_P_TEMP.PV" },
    { label: "41T-102", value: "41T102_P_LEVEL.pv", temp: "41T102_P_TEMP.PV" },
    { label: "41T-103", value: "41T103_P_LEVEL.pv", temp: "41T103_P_TEMP.PV" },
    { label: "41T-104", value: "41T104_P_LEVEL.pv", temp: "41T104_P_TEMP.PV" },
    { label: "41T-105", value: "41T105_P_LEVEL.pv", temp: "41T105_P_TEMP.PV" },
    { label: "41T-106", value: "41T106_P_LEVEL.pv", temp: "41T106_P_TEMP.PV" },
    { label: "41T-107", value: "41T107_P_LEVEL.pv", temp: "41T107_P_TEMP.PV" },
    { label: "41T-108", value: "41T108_P_LEVEL.pv", temp: "41T108_P_TEMP.PV" },
    { label: "41T-109", value: "41T109_P_LEVEL.pv", temp: "41T109_P_TEMP.PV" },
    { label: "41T-110", value: "41T110_P_LEVEL.pv", temp: "41T110_P_TEMP.PV" },
    { label: "41T-111", value: "41T111_P_LEVEL.pv", temp: "41T111_P_TEMP.PV" },
    { label: "41T-112", value: "41T112_P_LEVEL.pv", temp: "41T112_P_TEMP.PV" },
    { label: "41T-113", value: "41T113_P_LEVEL.pv", temp: "41T113_P_TEMP.PV" },
    { label: "41T-114", value: "41T114_P_LEVEL.pv", temp: "41T114_P_TEMP.PV" },
    { label: "41T-115", value: "41T115_P_LEVEL.pv", temp: "41T115_P_TEMP.PV" },
    { label: "41T-116", value: "41T116_P_LEVEL.pv", temp: "41T116_P_TEMP.PV" },
    { label: "41T-117", value: "41T117_P_LEVEL.pv", temp: "41T117_P_TEMP.PV" },
    { label: "41T-118", value: "41T118_P_LEVEL.pv", temp: "41T118_P_TEMP.PV" },
    { label: "41T-119", value: "41T119_P_LEVEL.pv", temp: "41T119_P_TEMP.PV" },
    { label: "41T-120", value: "41T120_P_LEVEL.pv", temp: "41T120_P_TEMP.PV" },
    { label: "41T-121", value: "41T121_P_LEVEL.pv", temp: "41T121_P_TEMP.PV" },
    { label: "41T-122", value: "41T122_P_LEVEL.pv", temp: "41T122_P_TEMP.PV" },
  ];
  const filteredOptions = tagOptions.filter((tag) =>
    tag.label.toLowerCase().includes(search.toLowerCase())
  );
  const getData = async (tagName: string[]) => {
    const formattedStartTime = dayjs(startDate).format(
      "MM/DD/YYYY HH:mm:ss.SSS"
    );
    const formattedEndTime = dayjs(endDate).format("MM/DD/YYYY HH:mm:ss.SSS");
    const params: GetDataParams = {
      startTime: formattedStartTime, // Use formatted date from state
      endTime: formattedEndTime, // Use formatted date from state
      interval: 900000,
      tagName: tagName,
    };
    try {
      setLoading(true);
      setError(null);
      const result = await fetchPHDData(params);
      const level = result[0];
      const temp = result[1];
      const timestamps: string[] = level.TimeStamp || [];
      const levelValues: any[] = level.Value || [];
      const tempValues: any[] = temp.Value || [];

      const chartData = timestamps
        .map((ts, idx) => {
          const levelValue = levelValues[idx];
          const tempValue = tempValues[idx];
          if (
            levelValue === null ||
            levelValue === undefined ||
            typeof levelValue !== "number"
          ) {
            return null;
          }
          if (
            tempValue === null ||
            tempValue === undefined ||
            typeof tempValue !== "number"
          ) {
            return null;
          }
          if (isNaN(levelValue)) {
            return null;
          }
          if (isNaN(tempValue)) {
            return null;
          }
          return {
            timestamp: ts,
            level: Number(levelValue.toFixed(1)),
            temperature: Number(tempValues[idx].toFixed(1)),
          };
        })
        .filter((entry): entry is ChartDataPoint => entry !== null);
      setData(chartData);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (startDate && endDate) {
      getData([selectedTag.value, selectedTag.temp]);
    }
  }, [selectedTag, startDate, endDate]); // Refetch when tag OR dates change
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
    const { x, y, payload, index } = props;
    const { value } = payload;

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
  const myColor = "#03ff63ff";
  const myColor2 = "#ffd503ff";
  const customTicks = [
    0, 2500, 5000, 7500, 10000, 12500, 15000, 17500, 20000, 22500,
  ];
  const customTicks2 = [
    0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180,
  ];
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
              <div className="absolute top-12 left-0 right-0 bg-slate-800 border border-gray-600  z-20">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 text-slate-100 border-b border-gray-600 outline-none"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto ">
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
              dateFormat="dd-MMM-yyyy HH:mm"
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
              dateFormat="dd-MMM-yyyy HH:mm"
              className="w-40 bg-slate-900 text-slate-100 border border-gray-500 rounded-md px-3 py-2 text-sm outline-none"
              id="endDate"
            />
          </div>
          {/* === END NEW === */}
        </div>

        {/* === Chart === */}
        {/* This container handles the height and horizontal scrolling */}
        <div className="flex-1 w-full overflow-x-auto overflow-y-hidden">
          {loading && (
            // Flex container to center the spinner
            <div
              className="flex justify-center items-center w-full h-full"
              style={{ minHeight: "300px" }}
            >
              {/* This is the Tailwind spinner */}
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div
              className="flex justify-center items-center w-full h-full"
              style={{ minHeight: "300px" }}
            >
              <p style={{ color: "red" }}>Error: {error}</p>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            // This div sets the minimum width to enable scrolling
            <div style={{ minWidth: "2000px", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  {/* ... rest of your chart ... */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#94a3b8"
                    tick={<CustomizedAxisTick />}
                    interval={interval}
                  />

                  {/* Y-Axis 1 (Left) */}
                  <YAxis
                    yAxisId="1" // ID for the first dataset
                    stroke="#94a3b8"
                    type="number"
                    domain={[0, 22500]}
                    allowDataOverflow={true}
                    ticks={customTicks}
                  />

                  {/* Y-Axis 2 (Right) - FOR THE SECOND DATASET */}
                  <YAxis
                    yAxisId="2" // ID for the second dataset
                    orientation="right" // Place it on the right
                    stroke="#94a3b8" // Style as needed
                    domain={[0, 130]}
                    allowDataOverflow={true}
                    ticks={customTicks2}
                    // domain={[min, max]} // Set domain if needed, or let it be auto
                    // type="number"
                  />

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
                    {/* Gradient for First Area */}
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={myColor} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={myColor} stopOpacity={0} />
                    </linearGradient>

                    {/* Gradient for Second Area */}
                    <linearGradient
                      id="colorValue2"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={myColor2}
                        stopOpacity={0.8}
                      />
                      <stop offset="95%" stopColor={myColor2} stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* --- First Dataset --- */}
                  <Area
                    yAxisId="1"
                    type="monotone"
                    dataKey="level" // Data key for first dataset
                    stroke={myColor}
                    fill="url(#colorValue)"
                    fillOpacity={1}
                  />
                  <Line
                    yAxisId="1"
                    type="monotone"
                    dataKey="level" // Data key for first dataset
                    stroke={myColor}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    yAxisId="2" // Connect to the second Y-axis
                    type="monotone"
                    dataKey="temperature" // Data key for second dataset
                    stroke={myColor2} // Use the second color
                    fill="url(#colorValue2)" // Use the second gradient
                    fillOpacity={1}
                  />
                  <Line
                    yAxisId="2" // Connect to the second Y-axis
                    type="monotone"
                    dataKey="temperature" // Data key for second dataset
                    stroke={myColor2} // Use the second color
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            // Centered "No data" message
            <div
              className="flex justify-center items-center w-full h-full"
              style={{ minHeight: "300px" }}
            >
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>
    </MainFrame>
  );
};

export default TankTrend;
