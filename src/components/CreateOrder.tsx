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
import supabase from "@/lib/supabaseClient";
import { Orderx } from "@/types/Order";
import { Plus } from "lucide-react";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { data, error } = await supabase
      .from("Orders") // <-- replace with your table name
      .insert([form])
      .select()
      .single();

    if (error) {
      console.error("Create failed:", error);
    } else {
      if (onCreated && data) onCreated(data);
      setOpen(false);
      setForm({ title: "", description: "", tag: "" });
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
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
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
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
