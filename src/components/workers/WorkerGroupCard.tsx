import { useState } from "react";
import { Users, Edit3, Check, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Person } from "@/types/Person";

interface WorkerGroupCardProps {
  group: {
    id: string;
    shift: string;
    anggota: Person[];
  };
  isAdmin?: boolean;
  onUpdate?: (groupId: string, workers: Person[]) => void;
}

export function WorkerGroupCard({
  group,
  isAdmin = false,
  onUpdate,
}: WorkerGroupCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkers, setEditedWorkers] = useState<Person[]>(group.anggota);
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerPosition, setNewWorkerPosition] = useState("");

  const getStatusColor = (status: Person["Status"]) => {
    switch (status) {
      case "Aktif":
        return "bg-success text-white";
      case "Dinas":
        return "bg-cyan-500 text-white";
      case "Cuti":
        return "bg-orange-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleSave = () => {
    onUpdate?.(group.id, editedWorkers);
    setIsEditing(false);
    setNewWorkerName("");
    setNewWorkerPosition("");
  };

  const handleCancel = () => {
    setEditedWorkers(group.anggota);
    setIsEditing(false);
    setNewWorkerName("");
    setNewWorkerPosition("");
  };

  const handleAddWorker = () => {
    // TODO Handle adding new worker
  };

  const handleRemoveWorker = (workerId: string) => {
    // TODO Handle adding new worker
  };

  const handleWorkerChange = (
    workerId: string,
    field: keyof Worker,
    value: string
  ) => {
    // TODO Handle worker change
  };

  return (
    <Card className="pb-1 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 border border-border/50 hover:border-primary/30">
      <CardHeader className="p-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1 bg-gradient-primary rounded-lg">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-row">
              <CardTitle className="text-lg font-semibold text-foreground pt-1">
                {group.shift}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {group.anggota.length} members
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-0">
        {isEditing ? (
          <div className="space-y-4">
            {/* Existing Workers - Editable */}
            <div className="space-y-2">
              {editedWorkers
                .sort((a, b) => a.PRL - b.PRL)
                .map((worker) => (
                  <div
                    key={worker.id}
                    className="flex items-center space-x-2 py-2 px-1 bg-secondary/50 rounded-md"
                  >
                    <Input
                      value={worker.Nama}
                      onChange={
                        (e) => {}
                        // TODO handle worker change name
                      }
                      className="flex-1"
                      placeholder="Worker name"
                    />
                    <Input
                      value={worker.Position}
                      onChange={(e) => {
                        // TODO handle worker change position}
                      }}
                      className="flex-1"
                      placeholder="Position"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {}} // TODO handle worker change status
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>

            {/* Add New Worker */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  placeholder="New worker name"
                  className="flex-1"
                />
                <Input
                  value={newWorkerPosition}
                  onChange={(e) => setNewWorkerPosition(e.target.value)}
                  placeholder="Position"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddWorker}
                  disabled={!newWorkerName.trim() || !newWorkerPosition.trim()}
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-success hover:bg-success/90"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          /* Display Mode */
          <div className="space-y-1">
            {group.anggota
              .sort((a, b) => b.PRL - a.PRL)
              .map((worker) => (
                <div
                  key={worker.id}
                  className="relative flex items-center justify-between my-0 py-0 px-2 h-12 
             rounded-2xl bg-black/40 
             border border-cyan-500/20
             shadow-inner
             overflow-hidden"
                >
                  <div
                    className="absolute inset-0 rounded-2xl p-0 m-0
                  bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent 
                  blur-2xl"
                  ></div>
                  <div>
                    <p className="font-medium text-foreground text-sm p-0">
                      {worker.Nama}
                    </p>
                    <p className="text-[9px] text-muted-foreground p-0">
                      {worker.Position}
                    </p>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(worker.Status)}`}>
                    {worker.Status}
                  </Badge>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
