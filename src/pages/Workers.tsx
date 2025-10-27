import { useEffect, useState, useCallback } from "react";
import supabase from "../lib/supabaseClient";
import { WorkerCard } from "@/components/workers/WorkerCard";
import { Person } from "@/types/Person";
import { Input } from "@/components/ui/input";
import MainFrame from "./MainFrame";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button"; // 👈 optional for refresh button

export default function Worker() {
  const [data, setData] = useState<Person[]>([]);
  const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Define refreshData with useCallback so it can be reused
  const refreshData = useCallback(async (showToast = true) => {
    setLoading(true);
    const { data: Manpower_all, error } = await supabase
      .from("Manpower_all")
      .select("*");

    if (error) {
      setError(error);
      if (showToast) toast.error(`Failed to load data: ${error.message}`);
    } else {
      setData(Manpower_all || []);
      setFilteredData(Manpower_all || []);
      if (showToast) toast.success("Data refreshed");
    }
    setLoading(false);
  }, []);

  // Fetch on mount
  useEffect(() => {
    refreshData(false);
  }, [refreshData]);

  // Filter logic
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    if (lowerSearch.trim() === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((worker) =>
          [
            worker.Nama,
            worker.Shift,
            worker.Alamat,
            worker.Status,
            worker["No HP"],
            worker.Position,
          ]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(lowerSearch))
        )
      );
    }
  }, [search, data]);

  return (
    <MainFrame>
      <main>
        {error && <p className="text-red-500">{error.message}</p>}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          theme="dark"
        />

        {/* 🔍 Search + Refresh */}
        <div className="sticky top-4 z-10 flex items-center gap-2 ml-9 mr-6">
          <Input
            type="text"
            placeholder="Search worker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Button onClick={() => refreshData(true)} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* 🧩 Worker Grid */}
        <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredData
            .sort((a, b) => b.PRL - a.PRL)
            .map((worker, index) => (
              <WorkerCard
                key={worker.id}
                {...worker}
                id={worker.id}
                num={index + 1}
                onUpdated={refreshData} // 👈 pass down if WorkerCard needs it
              />
            ))}
        </div>
      </main>
    </MainFrame>
  );
}
