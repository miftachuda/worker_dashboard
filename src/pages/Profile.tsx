import React, { useState, useEffect } from "react";
import MainFrame from "./MainFrame";
import { pb } from "@/lib/pocketbase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Profile: React.FC = () => {
  const user = pb.authStore.model;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmit, setSubmitting] = useState(false);

  const avatarURL = avatarFile
    ? URL.createObjectURL(avatarFile)
    : user?.avatar
    ? pb.files.getURL(user, user.avatar)
    : "/avatar.png";

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("role", role);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const updated = await pb.collection("users").update(user.id, formData);

      pb.authStore.save(updated.token, updated.record);

      toast.success("Profile updated successfully");
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <MainFrame>
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarURL} alt="Avatar" />
                <AvatarFallback>
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <Label className="block mb-2">Change Avatar</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setAvatarFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              {isSubmit ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </MainFrame>
  );
};

export default Profile;
