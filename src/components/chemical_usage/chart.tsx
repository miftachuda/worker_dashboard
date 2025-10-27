import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CountUp } from "./countUp";
import { ChemicalUsage } from "@/types/ChemicalUsage";

interface MetricCard {
  title: string;
  value: number;
  icon?: React.ReactNode;
  gradient?: string; // gradient color string
}

interface DashboardPerformanceProps {
  title?: string;
  chartData: (
    | ChemicalUsage
    | {
        amount: string;
        unit: string;
        id: string;
        chemical_name: string;
        time: number;
        created: string;
        updated: string;
      }
  )[][];
  chartColor?: string;
  yLabel?: string;
  metrics: MetricCard[];
  chartType?: "line" | "area";
  onChemicalChange?: (chemical: string) => void; // callback for dropdown change
}
function getLineDataByChemical(groupedArray, chemicalName: string) {
  const group = groupedArray.find(
    (g) => g.length > 0 && g[0].chemical_name === chemicalName
  );
  return group
    ? group.map((item) => ({
        name: new Date(item.time * 1000).toLocaleDateString("en-GB"),
        value: parseFloat(item.amount),
      }))
    : [];
}
const DashboardPerformance: React.FC<DashboardPerformanceProps> = ({
  title = "Performance",
  chartData,
  chartColor = "#ff66cc",
  yLabel = "Total Engagements",
  metrics,
  chartType = "line",
  onChemicalChange,
}) => {
  const [selectedChemical, setSelectedChemical] = useState("Furfural");
  const [selectedChemicalData, setSelectedChemicalData] = useState<any>();

  const handleChemicalChange = (value: string) => {
    setSelectedChemical(value);
    const lineData = getLineDataByChemical(chartData, value);
    setSelectedChemicalData(lineData);
    if (onChemicalChange) onChemicalChange(value);
  };
  useEffect(() => {
    const lineData = getLineDataByChemical(chartData, selectedChemical);
    setSelectedChemicalData(lineData);
  }, [chartData]);

  return (
    <div className="bg-[#0f172a] text-white p-6 rounded-sm shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center space-x-2 relative z-50">
          <div className="relative">
            <Select
              value={selectedChemical}
              onValueChange={handleChemicalChange}
            >
              <SelectTrigger className="w-44 h-10 bg-[#1e293b] border border-gray-600 text-gray-200 rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 flex justify-start items-center">
                <div className="flex-1 text-left">
                  <SelectValue placeholder="Select Chemical">
                    {selectedChemical}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent
                align="start"
                side="bottom"
                sideOffset={4}
                position="popper"
                className="min-w-[11rem] bg-[#1e293b] border border-gray-600 rounded-sm text-gray-200 shadow-lg"
              >
                {["Furfural", "MEK", "Toluene", "Propane"].map((chemical) => (
                  <SelectItem
                    key={chemical}
                    value={chemical}
                    className="px-3 rounded-sm py-2 text-sm hover:bg-pink-600/30 focus:bg-pink-600/30 focus:text-white"
                  >
                    {chemical}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={selectedChemicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
              labelStyle={{ color: "#cbd5e1" }}
            />
            {chartType === "line" && (
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1e293b]"
          >
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full mb-2"
              style={{
                background:
                  metric.gradient || "linear-gradient(135deg,#ff66cc,#6b73ff)",
              }}
            >
              <div className="text-white">{metric.icon}</div>
            </div>
            <div className="text-lg font-semibold">
              <>
                <CountUp value={metric.value} decimals={2} /> m³
              </>
            </div>
            <div className="text-sm text-gray-400">{metric.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPerformance;
