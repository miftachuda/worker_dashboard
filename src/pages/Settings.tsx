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
  const [shift, setShift] = useState<string>("");
  const [mode, setMode] = useState<string>(""); // 👈 NEW
  const [saving, setSaving] = useState<boolean>(false);

  // Load user shift + mode from DB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const profile = await pb.collection("users").getOne(user.id);
        setShift(profile.preferred_shift || "");
        setMode(profile.shift_mode || ""); // 👈 NEW
      } catch (err) {
        console.error(err);
      }
    };

    loadSettings();
  }, [user.id]);

  // Save updated shift + mode to DB
  const handleSave = async () => {
    try {
      setSaving(true);
      await pb.collection("users").update(user.id, {
        preferred_shift: shift,
        shift_mode: mode, // 👈 NEW
      });

      toast("Settings updated successfully.");
      setSaving(false);
    } catch (err) {
      console.error(err);
      toast("Failed to update settings.");
      setSaving(false);
    }
  };

  return (
    <MainFrame>
      <main className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Settings</h2>

        {/* SHIFT SELECTION */}
        <div className="space-y-2">
          <label className="block font-medium">Select Your Shift</label>

          <Select value={shift} onValueChange={setShift}>
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

        {/* MODE SELECTION */}
        <div className="space-y-2">
          <label className="block font-medium">Select Mode</label>

          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mode 1">Mode 1</SelectItem>
              <SelectItem value="Mode 2">Mode 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave}>{saving ? "Saving..." : "Save"}</Button>
      </main>
    </MainFrame>
  );
};

export default Settings;
