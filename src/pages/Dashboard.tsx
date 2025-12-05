import { useState, useEffect } from "react";
import { WorkerGroupCard } from "@/components/workers/WorkerGroupCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plane, UserRoundX, UserRoundCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Person } from "../types/Person";
import MainFrame from "./MainFrame";
import { fetchEmployee } from "@/lib/worker";

/* ================= TYPES ================= */

type WorkerGroup = {
  id: string;
  shift: string;
  anggota: Person[];
};

/* ================ COMPONENT ================ */

export default function Dashboard() {
  const [data, setData] = useState<Person[]>([]);
  const [groups, setGroups] = useState<WorkerGroup[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  /* ========== FETCH DATA ========== */
  useEffect(() => {
    fetchEmployee().then(({ data, error }) => {
      if (error) {
        setError(error);
      } else {
        setData(data || []);
      }
    });
  }, []);

  /* ========== GROUP BY SHIFT ========== */
  useEffect(() => {
    const groupedByShift = data.reduce<Record<string, Person[]>>(
      (acc, person) => {
        const shift = person.Shift || "Unknown";
        if (!acc[shift]) acc[shift] = [];
        acc[shift].push(person);
        return acc;
      },
      {}
    );

    const groupedList: WorkerGroup[] = Object.entries(groupedByShift).map(
      ([shift, anggota]) => ({
        id: shift,
        shift,
        anggota,
      })
    );

    setGroups(groupedList);
  }, [data]);

  /* ========== HANDLER ========== */
  const handleGroupUpdate = (groupId: string, updatedWorkers: Person[]) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, anggota: updatedWorkers } : group
      )
    );
  };

  /* ========== STATS ========== */
  const totalWorkers = data.length;

  const totalOrganik = data.filter((p) => p.type === "Organik");
  const totalTAD = data.filter((p) => p.type === "TAD");
  const totalExpert = data.filter((p) => p.type === "Expert");

  const totalActiveWorkers = data.filter((p) => p.Status === "Aktif").length;
  const onCutiWorkers = data.filter((p) => p.Status === "Cuti").length;
  const onDinasWorkers = data.filter((p) => p.Status === "Dinas").length;

  const countByStatus = (arr: Person[], status: string) =>
    arr.filter((p) => p.Status === status).length;

  /* ========== UI ========== */
  return (
    <MainFrame>
      <main className="flex-1 p-2 space-y-2">
        {/* ERROR HANDLING */}
        {error && (
          <div className="text-red-500 text-sm">
            Failed to load data: {error.message}
          </div>
        )}

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* TOTAL */}
          <Card
            onClick={() => navigate("/workers")}
            className="cursor-pointer hover:scale-[1.02] transition-all"
          >
            <div className="flex justify-between items-center p-2 pb-1">
              <span className="text-[11px] font-medium">Total Workers</span>
              <Users className="h-3 w-3" />
            </div>

            <div className="p-2 pt-0">
              <div className="text-xl font-bold leading-none">
                {totalWorkers}
              </div>
              <p className="text-[10px] leading-tight">
                {totalOrganik.length} Organik | {totalTAD.length} TAD |{" "}
                {totalExpert.length} Expert
              </p>
            </div>
          </Card>

          {/* ACTIVE */}
          <Card>
            <div className="flex justify-between items-center p-2 pb-1">
              <span className="text-[11px] font-medium">Active</span>
              <UserRoundCheck className="h-3 w-3 text-green-500" />
            </div>

            <div className="p-2 pt-0">
              <div className="text-xl font-bold leading-none text-green-500">
                {totalActiveWorkers}
              </div>
              <p className="text-[10px] leading-tight">
                {countByStatus(totalOrganik, "Aktif")} Org |{" "}
                {countByStatus(totalTAD, "Aktif")} TAD |{" "}
                {countByStatus(totalExpert, "Aktif")} Exp
              </p>
            </div>
          </Card>

          {/* CUTI */}
          <Card>
            <div className="flex justify-between items-center p-2 pb-1">
              <span className="text-[11px] font-medium">Cuti</span>
              <UserRoundX className="h-3 w-3 text-orange-500" />
            </div>

            <div className="p-2 pt-0">
              <div className="text-xl font-bold leading-none text-orange-500">
                {onCutiWorkers}
              </div>
              <p className="text-[10px] leading-tight">
                {countByStatus(totalOrganik, "Cuti")} Org |{" "}
                {countByStatus(totalTAD, "Cuti")} TAD |{" "}
                {countByStatus(totalExpert, "Cuti")} Exp
              </p>
            </div>
          </Card>

          {/* DINAS */}
          <Card>
            <div className="flex justify-between items-center p-2 pb-1">
              <span className="text-[11px] font-medium">Dinas</span>
              <Plane className="h-3 w-3 text-cyan-500" />
            </div>

            <div className="p-2 pt-0">
              <div className="text-xl font-bold leading-none text-cyan-500">
                {onDinasWorkers}
              </div>
              <p className="text-[10px] leading-tight">
                {countByStatus(totalOrganik, "Dinas")} Org |{" "}
                {countByStatus(totalTAD, "Dinas")} TAD |{" "}
                {countByStatus(totalExpert, "Dinas")} Exp
              </p>
            </div>
          </Card>
        </div>

        {/* ================= SHIFT GROUP ================= */}
        <div className="space-y-1">
          <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {groups.map((group) => (
              <WorkerGroupCard
                key={group.id}
                group={group}
                isAdmin={true}
                onUpdate={handleGroupUpdate}
              />
            ))}
          </div>
        </div>
      </main>
    </MainFrame>
  );
}
