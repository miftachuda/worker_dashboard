import { useState } from "react";
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
import { pb } from "@/lib/pocketbase";
import { Orderx } from "@/types/Order";
import { Plus } from "lucide-react";
import { sendNotif } from "@/lib/sendnotif";

export function CreateOrder({
  onCreated,
}: {
  onCreated?: (order: Orderx) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tag: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const record = await pb.collection("orders").create<Orderx>({
        title: form.title,
        description: form.description,
        tag: form.tag,
      });

      if (onCreated) onCreated(record);

      setOpen(false);
      setForm({ title: "", description: "", tag: "" });

      await sendNotif({
        title: "[Order] Created",
        page: "orders",
        message: `${form.title}.`,
      });
    } catch (error) {
      console.error("Create failed:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">
          <Plus className="w-5 h-5 text-black-600" /> Create Order
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new order</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full p-2 rounded bg-gray-900 border border-gray-900 text-white min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="tag">Tag</Label>
            <Input
              name="tag"
              value={form.tag}
              onChange={handleChange}
              placeholder="Enter tag"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
