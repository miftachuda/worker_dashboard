import React, { useState } from "react";
import MainFrame from "./MainFrame";
import { pb } from "@/lib/pocketbase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const user = pb.authStore.model;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmit, setSubmitting] = useState(false);
  const [isSave, setSavePasssword] = useState(false);
  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      if (avatarFile) formData.append("avatar", avatarFile);

      // Update basic profile
      const updated = await pb.collection("users").update(user.id, formData);

      const currentToken = pb.authStore.token;
      const newRecord = { ...pb.authStore.record, ...updated };
      pb.authStore.save(currentToken, newRecord);

      toast.success("Profile updated successfully");
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔐 Password Change Function
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      toast.warning("All password fields must be filled");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      toast.error("New password does not match!");
      return;
    }

    setSavePasssword(true);
    try {
      await pb.collection("users").update(user.id, {
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
        oldPassword: currentPassword, // PocketBase validation
      });

      toast.success("Password updated, please re-login!");
      pb.authStore.clear();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password. Check your current password.");
    } finally {
      setSavePasssword(false);
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

            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  disabled // 👈 tambah ini
                />
              </div>
            </div>

            <Button disabled={isSubmit} onClick={handleSave} className="w-full">
              {isSubmit ? "Updating..." : "Update Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* 🔐 Password Change Section */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Label>Current Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Label>New Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Label>Confirm New Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <Label>Show Password</Label>
            </div>

            <Button
              disabled={isSave}
              onClick={handlePasswordChange}
              className="w-full"
              variant="destructive"
            >
              {isSave ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </MainFrame>
  );
};

export default Profile;
