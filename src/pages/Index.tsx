import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // TODO: Replace with actual Supabase authentication
    // For demo purposes, accept admin@guardiverde.com / admin123
    if (email === "admin@guardiverde.com" && password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials.");
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard />;
};

export default Index;
