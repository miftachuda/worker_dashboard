import React, { useState } from "react";
import PocketBase, { RecordModel } from "pocketbase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeWithStatusPicker } from "./DateTimePicker";
const pb = new PocketBase("https://base.miftachuda.my.id");
interface CreateMaintenanceRecordProps {
  items: RecordModel;
  onCreated?: () => void;
}

const CreateMaintenanceRecord: React.FC<CreateMaintenanceRecordProps> = ({
  items,
  onCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discipline: "",
    start_time: "Now",
    end_time: "Now",
    performed_by: "",
    status: "",
    type: "",
    nametag: items.id,
    part_used: "",
    link_image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "start_time" || name === "end_time") {
      const timestamp = Math.floor(new Date(value).getTime() / 1000);
      setForm({ ...form, [name]: timestamp.toString() });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleValueChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const record = {
        ...form,
        part_used: {
          part_used: form.part_used.split(",").map((p) => p.trim()),
        },
        link_image: { link_image: [form.link_image] },
      };

      await pb.collection("maintenance_collection").create(record);
      setOpen(false);
      onCreated?.();
    } catch (err) {
      alert("Failed to create record: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ New Record</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Maintenance Record</DialogTitle>
          </DialogHeader>
          <DialogTitle>{items.nametag}</DialogTitle>
          <div className="grid gap-2 py-2">
            <Input
              name="title"
              placeholder="Judul Pekerjaan"
              value={form.title}
              onChange={handleChange}
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <Select
                  value={form.discipline}
                  onValueChange={(value) =>
                    handleValueChange("discipline", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stationary">Stationary</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Instrumentation">
                      Instrumentation
                    </SelectItem>
                    <SelectItem value="Rotating">Rotating</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Input
                  name="performed_by"
                  placeholder="Technician"
                  value={form.performed_by}
                  onChange={handleChange}
                />
              </div>
            </div>
            <Select
              value={form.status}
              defaultValue="In Progress"
              onValueChange={(value) => handleValueChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-4 p-4">
              {/* ✅ Show both start and end when Completed */}
              {form.status === "Completed" && (
                <DateRangeWithStatusPicker
                  form={form}
                  setForm={setForm}
                  showStart
                  showEnd
                />
              )}

              {/* ✅ Show only start when In Progress or Pending */}
              {(form.status === "In Progress" || form.status === "Pending") && (
                <DateRangeWithStatusPicker
                  form={form}
                  setForm={setForm}
                  showStart
                  showEnd={false}
                />
              )}
            </div>

            <Select
              value={form.type}
              onValueChange={(value) => handleValueChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Preventive Maintenance">
                  Preventive Maintenance
                </SelectItem>
                <SelectItem value="Inspekction">Inspection</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="part_used"
              placeholder="Comma-separated parts (plug, gasket...)"
              value={form.part_used}
              onChange={handleChange}
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 text-sm font-thin italic rounded bg-gray-900 border border-gray-700 text-white min-h-[250px]"
            />
            <Input
              name="link_image"
              placeholder="Image URL"
              value={form.link_image}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CreateMaintenanceRecord;
