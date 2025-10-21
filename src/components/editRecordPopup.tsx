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
import { Edit } from "lucide-react";
import { pb } from "@/lib/pocketbase";

interface EditRecordPopupProps {
  items: RecordModel;
  onCreated?: () => void;
}

const EditRecordPopup: React.FC<EditRecordPopupProps> = ({
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

  const handleUpdate = async () => {
    setLoading(true);
    let start_time = form.start_time;
    let end_time = form.end_time;
    const now = String(Math.floor(Date.now() / 1000));
    if (form.status === "Completed") {
      if (start_time === "Now") start_time = now;
      if (end_time === "Now") end_time = now;
    } else if (form.status === "Pending" || form.status === "In Progress") {
      // Start time should not be "Now"
      if (start_time === "Now") start_time = now;
      end_time = "Now";
    }

    try {
      const record = {
        ...form,
        start_time,
        end_time,
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
      {/* <Button onClick={() => setOpen(true)}>+ New Record</Button> */}
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-gray-300 hover:text-white hover:bg-gray-700"
        onClick={() => setOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl w-[800px]">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <DialogTitle>Create Maintenance Record</DialogTitle>
              <DialogTitle className="text-lime-400">
                {items.expand?.nametag?.nametag}
              </DialogTitle>
            </div>
          </DialogHeader>
          <Input
            name="title"
            placeholder="Judul Pekerjaan"
            value={items.title}
            onChange={handleChange}
            className="w-full"
          />
          <div className="grid gap-1 space-y-2  text-sm">
            <div className="flex flex-row gap-4 w-full">
              {/* Left Section */}
              <div className="flex-1 flex flex-col gap-2 w-full">
                <Select
                  value={items.type}
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
                    <SelectItem value="Inspection">Inspection</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 w-full">
                  <div className="flex-1">
                    <Select
                      value={items.discipline}
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
                      value={items.performed_by}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>
                <Select
                  value={items.status}
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
              </div>

              {/* Right Section */}
              <div className="flex-1 flex space-y-2 flex-col gap-2 w-full">
                <div className="space-y-1 w-full">
                  {form.status === "Completed" && (
                    <DateRangeWithStatusPicker
                      form={form}
                      setForm={setForm}
                      showStart
                      showEnd
                    />
                  )}

                  {(form.status === "In Progress" ||
                    form.status === "Pending") && (
                    <DateRangeWithStatusPicker
                      form={form}
                      setForm={setForm}
                      showStart
                      showEnd={false}
                    />
                  )}
                </div>
              </div>
            </div>

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
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default EditRecordPopup;
