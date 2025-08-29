import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserProfile } from "@/components/UserProfile";
import { WorkerGroupCard } from "@/components/WorkerGroupCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Calendar,
  Building,
  Plane,
  UserRoundX,
  UserRoundCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { Person } from "../types/Person";

const initialGroups = [
  {
    id: "1",
    title: "Shift A",
    description: "Morning shift team",
    workers: [
      {
        id: "1",
        name: "John Doe",
        position: "Line Supervisor",
        status: "active" as const,
      },
      {
        id: "2",
        name: "Jane Smith",
        position: "Operator",
        status: "active" as const,
      },
      {
        id: "3",
        name: "Mike Johnson",
        position: "Quality Control",
        status: "active" as const,
      },
      {
        id: "4",
        name: "Sarah Williams",
        position: "Operator",
        status: "on-leave" as const,
      },
      {
        id: "5",
        name: "David Brown",
        position: "Maintenance",
        status: "active" as const,
      },
      {
        id: "6",
        name: "Lisa Davis",
        position: "Operator",
        status: "active" as const,
      },
      {
        id: "7",
        name: "Tom Wilson",
        position: "Assistant",
        status: "active" as const,
      },
    ],
  },
  {
    id: "2",
    title: "Shift B",
    description: "Afternoon shift team",
    workers: [
      {
        id: "8",
        name: "Emily Chen",
        position: "QA Manager",
        status: "active" as const,
      },
      {
        id: "9",
        name: "Robert Lee",
        position: "Inspector",
        status: "active" as const,
      },
      {
        id: "10",
        name: "Maria Garcia",
        position: "Tester",
        status: "active" as const,
      },
      {
        id: "11",
        name: "James Taylor",
        position: "Lab Tech",
        status: "inactive" as const,
      },
      {
        id: "12",
        name: "Anna Martinez",
        position: "Inspector",
        status: "active" as const,
      },
      {
        id: "13",
        name: "Chris Anderson",
        position: "Analyst",
        status: "active" as const,
      },
    ],
  },
  {
    id: "3",
    title: "Shift C",
    description: "Night shift team",
    workers: [
      {
        id: "14",
        name: "Frank Miller",
        position: "Lead Mechanic",
        status: "active" as const,
      },
      {
        id: "15",
        name: "Steve Clark",
        position: "Electrician",
        status: "active" as const,
      },
      {
        id: "16",
        name: "Tony Rodriguez",
        position: "Mechanic",
        status: "active" as const,
      },
      {
        id: "17",
        name: "Paul Jackson",
        position: "Technician",
        status: "on-leave" as const,
      },
      {
        id: "18",
        name: "Mark Thompson",
        position: "Helper",
        status: "active" as const,
      },
    ],
  },
  {
    id: "4",
    title: "Shift D",
    description: "Off team",
    workers: [
      {
        id: "19",
        name: "Kevin White",
        position: "Logistics Manager",
        status: "active" as const,
      },
      {
        id: "20",
        name: "Rachel Green",
        position: "Forklift Operator",
        status: "active" as const,
      },
      {
        id: "21",
        name: "Brian Adams",
        position: "Warehouse Worker",
        status: "active" as const,
      },
      {
        id: "22",
        name: "Nicole Scott",
        position: "Inventory Clerk",
        status: "active" as const,
      },
      {
        id: "23",
        name: "Daniel King",
        position: "Shipping Clerk",
        status: "active" as const,
      },
      {
        id: "24",
        name: "Jessica Hill",
        position: "Receiver",
        status: "inactive" as const,
      },
      {
        id: "25",
        name: "Andrew Young",
        position: "Driver",
        status: "active" as const,
      },
      {
        id: "26",
        name: "Lauren Walker",
        position: "Coordinator",
        status: "active" as const,
      },
    ],
  },
  {
    id: "5",
    title: "Harian",
    description: "Pekerja harian",
    workers: [
      {
        id: "27",
        name: "Richard Hall",
        position: "Safety Manager",
        status: "active" as const,
      },
      {
        id: "28",
        name: "Sandra Lewis",
        position: "Safety Officer",
        status: "active" as const,
      },
      {
        id: "29",
        name: "Michael Turner",
        position: "Security Guard",
        status: "active" as const,
      },
      {
        id: "30",
        name: "Jennifer Parker",
        position: "First Aid Officer",
        status: "active" as const,
      },
      {
        id: "31",
        name: "William Evans",
        position: "Security Guard",
        status: "on-leave" as const,
      },
      {
        id: "32",
        name: "Helen Carter",
        position: "Compliance Officer",
        status: "active" as const,
      },
      {
        id: "33",
        name: "George Phillips",
        position: "Emergency Coordinator",
        status: "active" as const,
      },
      {
        id: "34",
        name: "Amy Roberts",
        position: "Trainer",
        status: "active" as const,
      },
      {
        id: "35",
        name: "Charles Mitchell",
        position: "Security Guard",
        status: "active" as const,
      },
    ],
  },
];

export default function Dashboard() {
  const [groups, setGroups] = useState(initialGroups);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: Manpower_all, error } = await supabase
        .from("Manpower_all")
        .select("*");
      if (error) setError(error);
      else setData(Manpower_all || []);
    };

    fetchData();
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
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
              <UserProfile />
            </div>
          </header>

          {/* Main Content */}
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
                <h2 className="text-2xl font-bold text-foreground">
                  Shift Group
                </h2>
                <div className="text-sm text-muted-foreground">
                  Click edit icon to manage workers (Admin only)
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
        </div>
      </div>
    </SidebarProvider>
  );
}
