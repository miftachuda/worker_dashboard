import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/lib/supabaseClient";
import { fullShift } from "../lib/shift";
import { Person } from "@/types/Person";

export function WorkerCard({ num, ...worker }: Person & { num: number }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(worker);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("Manpower_all") // <-- replace with your table name
      .update({
        Nama: form.Nama,
        Position: form.Position,
        "No HP": form["No HP"],
        Nopek: form.Nopek,
        Alamat: form.Alamat,
        Shift: form.Shift,
        Status: form.Status,
      })
      .eq("id", form.id);

    if (error) {
      console.error("Update failed:", error);
    } else {
      setOpen(false);
    }
  };

  return (
    <Card className="relative ml-4 mt-2 shadow-md rounded-2xl hover:shadow-lg transition-shadow">
      <div className="absolute bottom-2 right-2 bg-primary text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
        {num}
      </div>
      <div>
        <div className="absolute bottom-2 right-10 bg-green-300 text-black text-xs font-bold rounded-sm pl-3 pr-3 w-auto h-6 flex items-center justify-center shadow-md">
          {fullShift(worker.Shift.slice(-1))}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg mt-4 font-semibold">
          {worker.Nama}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{worker.Position}</p>
      </CardHeader>
      <CardContent className="space-y-1 ml-6 text-sm">
        <p>
          <span className="font-medium">No HP :</span> {worker["No HP"]}
        </p>
        <p>
          <span className="font-medium">Nopek :</span> {worker.Nopek}
        </p>
        <p className="font-thin italic">
          <span className="font-medium not-italic">Alamat :</span>
          {worker.Alamat}
        </p>
        <p>
          <span className="font-medium">Shift :</span> {worker.Shift}
        </p>
        <p>
          <span className="font-medium">Status :</span> {worker.Status}
        </p>
        {/* Edit Button with Dialog */}
      </CardContent>
      <div className="ml-2 mb-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-2" size="sm" variant="outline">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Worker</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <Label htmlFor="Nama">Nama</Label>
                <Input name="Nama" value={form.Nama} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="Position">Position</Label>
                <Input
                  name="Position"
                  value={form.Position}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="No HP">No HP</Label>
                <Input
                  name="No HP"
                  value={form["No HP"]}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="Nopek">Nopek</Label>
                <Input
                  name="Nopek"
                  value={form.Nopek}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="Alamat">Alamat</Label>
                <Input
                  name="Alamat"
                  value={form.Alamat}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="Shift">Shift</Label>
                <select
                  name="Shift"
                  value={form.Shift}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Harian">Harian</option>
                  <option value="Shift A">Shift A</option>
                  <option value="Shift B">Shift B</option>
                  <option value="Shift C">Shift C</option>
                  <option value="Shift D">Shift D</option>
                </select>
              </div>
              <div>
                <Label htmlFor="Status">Status</Label>
                <select
                  name="Status"
                  value={form.Status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Dinas">Dinas</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
