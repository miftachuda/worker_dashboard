import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchPHDData, GetDataParams } from "../lib/phdFetch";
interface ChartDataPoint {
  timestamp: string;
  value: number;
}

const TankTrend: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chartType = "line";
  const chartColor = "#8884d8";

  useEffect(() => {
    const params: GetDataParams = {
      startTime: "NOW-1W",
      endTime: "NOW",
      interval: 900000,
      tagName: ["41T108_P_LEVEL.pv"],
    };

    const getData = async () => {
      try {
        setLoading(true);
        const result = (await fetchPHDData(params))[0];

        // Assuming result has TimeStamp and Value arrays
        const timestamps: string[] = result.TimeStamp || [];
        const values: number[] = result.Value || [];

        const chartData: ChartDataPoint[] = timestamps.map((ts, idx) => ({
          timestamp: ts,
          value: values[idx],
        }));

        setData(chartData);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <MainFrame>
      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="timestamp" stroke="#94a3b8" />
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
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
      {!loading && !error && data.length === 0 && <p>No data available</p>}
    </MainFrame>
  );
};

export default TankTrend;
