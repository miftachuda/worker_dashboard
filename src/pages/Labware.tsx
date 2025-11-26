import React, { useState, useEffect } from "react";
import MainFrame from "./MainFrame";
import DarkSampleGroups from "@/components/Labware/Card";
import { pb } from "@/lib/pocketbase";
import { SampleLimit } from "@/types/SampleLimit";

const Labware: React.FC = () => {
  const [shift, setShift] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<SampleLimit[]>();
  const [loadingLimit, setLoadingLimit] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const loading = loadingLimit || loadingData;

  // Tentukan shift berdasarkan waktu saat pertama kali load
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 8) setShift("Malam");
    else if (hour >= 8 && hour < 16) setShift("Pagi");
    else setShift("Sore");
  }, []);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingLimit(true);

        const records = await pb.collection("sample_limit").getFullList();

        const mapped: SampleLimit[] = records.map((r: any) => ({
          id: r.id,
          sample_code: r.sample_code,
          param_name: r.param_name,
          low_limit: r.low_limit,
          high_limit: r.high_limit,
          isNumber: r.isNumber,
        }));

        setLimit(mapped);
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoadingLimit(false);
      }
    };

    fetchAll();
  }, []);
  // Fetch data setiap kali shift berubah
  useEffect(() => {
    if (!shift) return; // ⬅️ skip if shift not yet initialized

    const fetchData = async () => {
      setLoadingData(true);
      setError(null);
      try {
        const url = `https://labware.miftachuda.my.id/${shift.toLowerCase()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
        setData(null);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [shift]);

  return (
    <MainFrame>
      <main className="p-4 min-h-screen transition-colors duration-300 ">
        <div className="h-full overflow-y-auto ">
          <div className="max-w-sm flex flex-row items-center mb-4 ">
            <label
              htmlFor="shift"
              className="block font-medium flex-nowrap p-2 pt-1 pr-5"
            >
              Pilih Shift :
            </label>
            <select
              id="shift"
              value={shift || ""}
              onChange={(e) => setShift(e.target.value)}
              className="w-auto border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white"
            >
              <option className="bg-gray-800 text-white" value="Malam">
                Malam
              </option>
              <option className="bg-gray-800 text-white" value="Pagi">
                Pagi
              </option>
              <option className="bg-gray-800 text-white" value="Sore">
                Sore
              </option>
            </select>
          </div>

          {error && (
            <p className="text-red-400 text-center py-4">Error: {error}</p>
          )}

          <DarkSampleGroups data={data} loading={loading} limit={limit} />
        </div>
      </main>
    </MainFrame>
  );
};

export default Labware;
