import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import PocketBase, { RecordModel } from "pocketbase";

interface EditMaintenanceRecordProps {
  item: RecordModel;
  onUpdated?: () => void;
}

const EditMaintenanceRecord: React.FC<EditMaintenanceRecordProps> = ({
  item,
  onUpdated,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: item.title || "",
    description: item.description || "",
    discipline: item.discipline || "",
    start_time: item.start_time || "",
    end_time: item.end_time || "",
    performed_by: item.performed_by || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const pb = new PocketBase("https://base.miftachuda.my.id");
      await pb.collection("maintenance_collection").update(item.id, form);
      setOpen(false);
      onUpdated?.();
    } catch (error) {
      console.error("Failed to update record:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Edit button */}
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-gray-300 hover:text-white hover:bg-gray-700 absolute top-2 right-2"
        onClick={() => setOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Edit popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg text-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Edit Maintenance Record
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="!text-base font-extralight"
            />
            <Input
              name="discipline"
              placeholder="Discipline"
              value={form.discipline}
              onChange={handleChange}
            />
            <Input
              name="start_time"
              placeholder="Start Time"
              value={form.start_time}
              onChange={handleChange}
            />
            <Input
              name="end_time"
              placeholder="End Time"
              value={form.end_time}
              onChange={handleChange}
            />
            <Input
              name="performed_by"
              placeholder="Performed By"
              value={form.performed_by}
              onChange={handleChange}
            />
            <Button
              className="w-full mt-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditMaintenanceRecord;
