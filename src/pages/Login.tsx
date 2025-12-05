import { useState } from "react";
import { pb } from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await pb.collection("users").authWithPassword(email, password);
      toast.success("Successfully logged in!");
      window.location.href = "/#/";
    } catch (err) {
      toast.error("Email atau password salah");
    }
    setLoading(false);
  };

  const handleAnonymous = async () => {
    setLoading(true);
    try {
      await pb.collection("users").authWithOAuth2({ provider: "anonymous" });
      toast.success("Logged in as Guest!");
      window.location.href = "/#/";
    } catch (err) {
      toast.error("Anonymous login gagal");
    }
    setLoading(false);
  };

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Anonymous Login Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAnonymous}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Login as Guest"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
