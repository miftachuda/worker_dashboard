import React, { useEffect, useState } from "react";
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
import MultiImageUploadPBEdit from "./editUploadImage";
import { toast } from "react-toastify";

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
    title: items.title,
    description: items.description,
    discipline: items.discipline,
    start_time: items.start_time,
    end_time: items.end_time,
    performed_by: items.performed_by,
    status: items.status,
    type: items.type,
    nametag: items.nametag,
    part_used: items.part_used,
    photo: items.photo,
  });
  useEffect(() => {
    if (form.status === "In Progress" || form.status === "Pending") {
      setForm((prev) => ({
        ...prev,
        end_time: "Now",
      }));
    }
  }, [form.status, setForm]);
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
    const formData = new FormData();

    // --- 1. Handle Time Logic (same as your code) ---
    let start_time = form.start_time;
    let end_time = form.end_time;
    const now = String(Math.floor(Date.now() / 1000));

    if (form.status === "Completed") {
      if (start_time === "Now") start_time = now;
      if (end_time === "Now") end_time = now;
    } else if (form.status === "Pending" || form.status === "In Progress") {
      if (start_time === "Now") start_time = now;
      end_time = "Now"; // Or send null/"" if you want to clear it
    }

    // --- 2. Append All Non-File Fields ---
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("discipline", form.discipline);
    formData.append("performed_by", form.performed_by);
    formData.append("status", form.status);
    formData.append("type", form.type);
    formData.append("nametag", form.nametag);
    formData.append("part_used", form.part_used);
    formData.append("start_time", start_time);
    formData.append("end_time", end_time);

    // --- 3. Append File Data (The Deletion Fix) ---

    // If the photo array is empty, send an empty string to clear the field
    if (form.photo.length === 0) {
      formData.append("photo", "");
    } else {
      form.photo.forEach((fileOrName: string | File) => {
        formData.append("photo", fileOrName);
      });
    }

    // --- 4. Submit FormData ---
    try {
      // Send FormData instead of the 'form' object
      await pb.collection("maintenance_collection").update(items.id, formData);
      setOpen(false);
      onCreated?.();
      toast.success("Record Updated");
    } catch (err) {
      console.error("PocketBase update failed:", JSON.stringify(err, null, 2));
      toast.error("Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <DialogTitle>Edit Maintenance Record</DialogTitle>
              <DialogTitle className="text-lime-400">
                {items.expand?.nametag?.nametag}
              </DialogTitle>
            </div>
          </DialogHeader>
          <Input
            name="title"
            placeholder="Judul Pekerjaan"
            value={form.title}
            onChange={handleChange}
            className="w-full"
          />
          <div className="grid gap-1 space-y-2  text-sm">
            <div className="flex flex-row gap-4 w-full">
              {/* Left Section */}
              <div className="flex-1 flex flex-col gap-2 w-full">
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
                    <SelectItem value="Inspection">Inspection</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 w-full">
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
                      className="w-full"
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
            <MultiImageUploadPBEdit
              form={form}
              setForm={setForm}
              record={items}
              fieldName="photo"
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
