import { useState } from "react";
import { WorkerGroupCard } from "@/components/workers/WorkerGroupCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plane, UserRoundX, UserRoundCheck } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Person } from "../types/Person";
import MainFrame from "./MainFrame";
import { fetchEmployee } from "@/lib/worker";

export default function Dashboard() {
  const [groups, setGroups] = useState(null);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  0;
  useEffect(() => {
    fetchEmployee().then(({ data, error }) => {
      if (error) setError(error);
      else setData(data || []);
    });
  }, []);

  const handleGroupUpdate = (groupId: string, updatedWorkers: any[]) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, workers: updatedWorkers } : group
      )
    );
  };

  const totalWorkers = data.length;
  const totalOrganik = data.filter((person) => person.type == "Organik");
  const totalTAD = data.filter((person) => person.type == "TAD");
  const totalExpert = data.filter((person) => person.type == "Expert");

  const totalActiveWorkers = data.filter(
    (person) => person.Status == "Aktif"
  ).length;
  const totalActiveOrganik = totalOrganik.filter(
    (person) => person.Status == "Aktif"
  ).length;
  const totalActiveTAD = totalTAD.filter(
    (person) => person.Status == "Aktif"
  ).length;
  const totalActiveExpert = totalExpert.filter(
    (person) => person.Status == "Aktif"
  ).length;

  const onCutiWorkers = data.filter((person) => person.Status == "Cuti").length;
  const totalCutiOrganik = totalOrganik.filter(
    (person) => person.Status == "Cuti"
  ).length;
  const totalCutiTAD = totalTAD.filter(
    (person) => person.Status == "Cuti"
  ).length;
  const totalCutiExpert = totalExpert.filter(
    (person) => person.Status == "Cuti"
  ).length;

  const onDinasWorkers = data.filter(
    (person) => person.Status == "Dinas"
  ).length;
  const totalDinasOrganik = totalOrganik.filter(
    (person) => person.Status == "Dinas"
  ).length;
  const totalDinasTAD = totalTAD.filter(
    (person) => person.Status == "Dinas"
  ).length;
  const totalDinasExpert = totalExpert.filter(
    (person) => person.Status == "Dinas"
  ).length;

  const groupedByShift = data.reduce<Record<string, Person[]>>(
    (acc, person) => {
      const shift = person.Shift;
      if (!acc[shift]) {
        acc[shift] = [];
      }
      acc[shift].push(person);
      return acc;
    },
    {}
  );
  const groupedList = Object.entries(groupedByShift).map(
    ([shift, anggota]) => ({
      id: shift, // use shift name as unique id
      shift,
      anggota,
    })
  );
  const navigate = useNavigate();
  return (
    <MainFrame>
      <main className="flex-1 p-2 space-y-2">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            onClick={() => navigate("/workers")}
            className="bg-gradient-card shadow-card border-border/50 
             cursor-pointer transition-all 
             hover:shadow-lg hover:scale-[1.02] 
             active:scale-[0.98]"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Workers
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalWorkers}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalOrganik.length} Organik | {totalTAD.length} TAD |{" "}
                {totalExpert.length} Expert
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Workers
              </CardTitle>
              <UserRoundCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {totalActiveWorkers}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalActiveOrganik} Organik | {totalActiveTAD} TAD |{" "}
                {totalActiveExpert} Expert
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cuti
              </CardTitle>
              <UserRoundX className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {onCutiWorkers}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalCutiOrganik} Organik | {totalCutiTAD} TAD |{" "}
                {totalCutiExpert} Expert
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dinas
              </CardTitle>
              <Plane className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-500">
                {onDinasWorkers}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalDinasOrganik} Organik | {totalDinasTAD} TAD |{" "}
                {totalDinasExpert} Expert
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Worker Groups */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Shift Group</h2>
            <div className="text-sm text-muted-foreground">
              Click edit icon to manage workers
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4">
            {groupedList
              // ascending
              .map((group) => (
                <WorkerGroupCard
                  key={group.id}
                  group={group}
                  isAdmin={true} // TODO: Connect to actual auth system
                  onUpdate={handleGroupUpdate}
                />
              ))}
          </div>
        </div>
      </main>
    </MainFrame>
  );
}
