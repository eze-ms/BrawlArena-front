import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";

interface Props {
  children: React.ReactNode;
  role?: "USER" | "ADMIN";
}

export default function RequireUser({ children, role = "USER" }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== role) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
}
