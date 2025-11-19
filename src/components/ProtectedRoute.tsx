import { pb } from "@/lib/pocketbase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const isLoggedIn = pb.authStore.isValid;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
