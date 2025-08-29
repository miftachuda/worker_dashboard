import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserProfile } from "@/components/UserProfile";
import { WorkerCard } from "@/components/WorkerCard";
import { Person } from "@/types/Person";
import { Input } from "@/components/ui/input"; // 👈 assuming shadcn/ui input

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

  // 🔍 live search effect
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((worker) =>
          worker.Nama?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, data]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="text-foreground hover:text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Worker Monitoring Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage workforce
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* 🔍 Search bar */}
              <Input
                type="text"
                placeholder="Search worker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <UserProfile />
            </div>
          </div>
        </header>
        <main className="p-6">
          {error && <p className="text-red-500">{error.message}</p>}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredData
              .sort((a, b) => b.PRL - a.PRL)
              .map((worker, index) => (
                <WorkerCard
                  key={worker.id}
                  {...worker}
                  id={String(worker.id)}
                  num={index + 1}
                />
              ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
