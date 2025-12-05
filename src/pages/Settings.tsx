import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { pb } from "@/lib/pocketbase";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const Settings: React.FC = () => {
  const user = pb.authStore.model;
  const isGuest = user?.email === "guest@guest.com"; // ⛔ Guest mode

  const [shift, setShift] = useState<string>("");
  const [mode, setMode] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  // Load data
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const profile = await pb.collection("users").getOne(user.id);
        setShift(profile.preferred_shift || "");
        setMode(profile.shift_mode || "");
      } catch (err) {
        console.error(err);
      }
    };

    loadSettings();
  }, [user.id]);

  const handleSave = async () => {
    if (isGuest) return; // 🔒 Hard block
    try {
      setSaving(true);
      await pb.collection("users").update(user.id, {
        preferred_shift: shift,
        shift_mode: mode,
      });
      toast.success("Settings updated successfully.");
    } catch (err) {
      toast.error("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainFrame>
      <main className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Settings</h2>

        {/* Shift */}
        <div className="space-y-2">
          <label className="block font-medium">Select Your Shift</label>

          <Select
            value={shift}
            onValueChange={setShift}
            disabled={isGuest} // ❌ Disabled jika guest
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Shift A">Shift A</SelectItem>
              <SelectItem value="Shift B">Shift B</SelectItem>
              <SelectItem value="Shift C">Shift C</SelectItem>
              <SelectItem value="Shift D">Shift D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mode */}
        <div className="space-y-2">
          <label className="block font-medium">Select Mode</label>

          <Select
            value={mode}
            onValueChange={setMode}
            disabled={isGuest} // ❌ Disabled ketika guest
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mode 1">Mode 1</SelectItem>
              <SelectItem value="Mode 2">Mode 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button Only When Normal User */}
        {!isGuest && (
          <Button onClick={handleSave}>{saving ? "Saving..." : "Save"}</Button>
        )}

        {isGuest && (
          <p className="text-sm text-muted-foreground">
            Guest account is read-only. Login to save settings.
          </p>
        )}
      </main>
    </MainFrame>
  );
};

export default Settings;
