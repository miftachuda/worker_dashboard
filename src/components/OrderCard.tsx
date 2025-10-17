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
import { Orderx } from "@/types/Order";
import { formatDistanceToNow } from "date-fns";
import { CreateOrder } from "./CreateOrder";
import { Textarea } from "./ui/textarea";
import { Pencil } from "lucide-react";

export function OrderCard({ num, ...order }: Orderx & { num: number }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(order);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("Orders") // <-- replace with your table name
      .update({
        title: form.title,
        description: form.description,
        tag: form.tag,
      })
      .eq("id", form.id);

    if (error) {
      console.error("Update failed:", error);
    } else {
      setOpen(false);
    }
  };

  return (
    <Card className="relative ml-4 mt-2 pb-12 shadow-md rounded-2xl hover:shadow-lg transition-shadow">
      <div className="absolute bottom-2 right-2 bg-primary text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
        {num}
      </div>
      <div className="absolute bottom-2 right-12 bg-slate-800 px-2 rounded-sm text-gray-500 text-sm">
        {formatDistanceToNow(order.created_at, { addSuffix: true })}
      </div>
      <CardHeader>
        <CardTitle className="text-sm mt-0 font-semibold">
          {order.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p className="flex items-start gap-2 flex-col">
          <span className="font-medium">Description :</span>
          <span className="bg-gray-900 p-2 rounded-xl max-h-32 overflow-y-auto font-extralight italic w-full">
            {order.description}
          </span>
        </p>
        <p>
          <span className="font-medium">Tag :</span> {order.tag}
        </p>
      </CardContent>

      {/* Move dialog outside so fixed button is truly visible */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-2 left-2 rounded-full shadow-lg z-50"
          >
            <Pencil className="h-2 w-2" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit order</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input name="title" value={form.title} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
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
    </Card>
  );
}
