import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedLayout() {
  const { accessToken, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
