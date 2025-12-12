import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "@/lib/pocketbase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    const controller = new AbortController();

    try {
      await pb.collection("users").authWithPassword(email, password, {
        fetch: (url, options) =>
          fetch(url, { ...options, signal: controller.signal }),
      });

      toast.success("Successfully logged in!");
      navigate("/");
    } catch (err) {
      if (err.name === "AbortError") return; // ignore natural abort
      toast.error("Email atau password salah");
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  const handleGuestLogin = async () => {
    if (guestLoading) return;
    setGuestLoading(true);

    const controller = new AbortController();

    try {
      await pb
        .collection("users")
        .authWithPassword("guest@guest.com", "password", {
          fetch: (url, options) =>
            fetch(url, { ...options, signal: controller.signal }),
        });

      toast.success("Logged in as Guest!");
      navigate("/");
    } catch (err) {
      if (err.name === "AbortError") return;
      toast.error("Guest login gagal");
    } finally {
      setGuestLoading(false);
    }

    return () => controller.abort();
  };

  const isDisabled = loading || guestLoading;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-950">
      <div className="text-green-100 mb-32 font-extrabold text-4xl">
        Lube Oil Complex II - Dashboard
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            disabled={isDisabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            disabled={isDisabled}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={isDisabled}
          >
            Login
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGuestLogin}
            disabled={isDisabled}
          >
            Login as Guest
          </Button>
        </CardContent>
      </Card>

      {/* 🔹 Loading Popup Overlay */}
      {(loading || guestLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl flex flex-col items-center shadow-xl">
            <Loader2 className="h-10 w-10 animate-spin text-green-400 mb-4" />
            <p className="text-green-100 text-lg font-semibold">
              Please wait...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
