import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";

export default function RequireUser({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "USER") {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
}
