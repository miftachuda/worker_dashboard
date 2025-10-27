import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { WorkerCard } from "@/components/workers/WorkerCard";
import { Person } from "@/types/Person";
import { Input } from "@/components/ui/input"; // 👈 assuming shadcn/ui input
import MainFrame from "./MainFrame";

export default function Worker() {
  const [data, setData] = useState<Person[]>([]);
  const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: Manpower_all, error } = await supabase
        .from("Manpower_all")
        .select("*");
      if (error) setError(error);
      else {
        setData(Manpower_all || []);
        setFilteredData(Manpower_all || []);
      }
    };

    fetchData();
  }, []);

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
            .filter(Boolean) // remove undefined/null
            .some((field) => field.toLowerCase().includes(lowerSearch))
        )
      );
    }
  }, [search, data]);

  return (
    <MainFrame>
      <main>
        {error && <p className="text-red-500">{error.message}</p>}

        <div className="sticky top-4 z-10 ">
          <div className="ml-9 mr-6">
            <Input
              type="text"
              placeholder="Search worker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredData
            .sort((a, b) => b.PRL - a.PRL)
            .map((worker, index) => (
              <WorkerCard
                key={worker.id}
                {...worker}
                id={worker.id}
                num={index + 1}
              />
            ))}
        </div>
      </main>
    </MainFrame>
  );
}
