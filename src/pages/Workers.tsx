import { useEffect, useState, useCallback } from "react";
import { pb } from "@/lib/pocketbase";
import { WorkerCard } from "@/components/workers/WorkerCard";
import { Person } from "@/types/Person";
import { Input } from "@/components/ui/input";
import MainFrame from "./MainFrame";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

export default function Worker() {
  const [data, setData] = useState<Person[]>([]);
  const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ REFRESH DATA FROM POCKETBASE
  const refreshData = useCallback(async (showToast = true) => {
    setLoading(true);

    try {
      const records = await pb.collection("manpower").getFullList<any>({
        sort: "-prl",
      });

      const formatted = records.map(
        (item): Person => ({
          id: item.id,
          nomor: item.nomor,
          created: item.created_at,
          last_update: item.last_update,
          last_move: item.last_move,
          Nama: item.nama,
          Nopek: item.nopek,
          Nopek_kpi: item.nopek_kpi,
          "No HP": item.no_hp ?? "",
          Position: item.position,
          Alamat: item.alamat,
          Status: item.status,
          Shift: item.shift,
          PRL: Number(item.prl), // 🔧 force number
          type: item.type,
        })
      );

      setData(formatted);
      setFilteredData(formatted);

      if (showToast) toast.success("Data refreshed from PocketBase ✅");
    } catch (err: any) {
      setError(err);
      if (showToast) toast.error(`Failed: ${err.message}`);
    }

    setLoading(false);
  }, []);

  // Fetch on mount
  useEffect(() => {
    refreshData(false);
  }, [refreshData]);

  // 🔍 Filter logic
  useEffect(() => {
    const lowerSearch = search.toLowerCase();

    if (!lowerSearch.trim()) {
      setFilteredData(data);
      return;
    }

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
          .some((field) => field.toString().toLowerCase().includes(lowerSearch))
      )
    );
  }, [search, data]);

  return (
    <MainFrame>
      <main>
        {error && (
          <p className="text-red-500">
            {error.message || "Error loading data"}
          </p>
        )}

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
          {filteredData.map((worker, index) => (
            <WorkerCard
              key={worker.id}
              {...worker}
              id={worker.id}
              num={index + 1}
              onUpdated={refreshData}
            />
          ))}
        </div>
      </main>
    </MainFrame>
  );
}
