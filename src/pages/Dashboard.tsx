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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TOTAL */}
          <Card
            onClick={() => navigate("/workers")}
            className="cursor-pointer hover:scale-[1.02] transition-all"
          >
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm">Total Workers</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWorkers}</div>
              <p className="text-xs">
                {totalOrganik.length} Organik | {totalTAD.length} TAD |{" "}
                {totalExpert.length} Expert
              </p>
            </CardContent>
          </Card>

          {/* ACTIVE */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm">Active</CardTitle>
              <UserRoundCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {totalActiveWorkers}
              </div>
              <p className="text-xs">
                {countByStatus(totalOrganik, "Aktif")} Organik |{" "}
                {countByStatus(totalTAD, "Aktif")} TAD |{" "}
                {countByStatus(totalExpert, "Aktif")} Expert
              </p>
            </CardContent>
          </Card>

          {/* CUTI */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm">Cuti</CardTitle>
              <UserRoundX className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {onCutiWorkers}
              </div>
              <p className="text-xs">
                {countByStatus(totalOrganik, "Cuti")} Organik |{" "}
                {countByStatus(totalTAD, "Cuti")} TAD |{" "}
                {countByStatus(totalExpert, "Cuti")} Expert
              </p>
            </CardContent>
          </Card>

          {/* DINAS */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm">Dinas</CardTitle>
              <Plane className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-500">
                {onDinasWorkers}
              </div>
              <p className="text-xs">
                {countByStatus(totalOrganik, "Dinas")} Organik |{" "}
                {countByStatus(totalTAD, "Dinas")} TAD |{" "}
                {countByStatus(totalExpert, "Dinas")} Expert
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ================= SHIFT GROUP ================= */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Shift Group</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4">
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
