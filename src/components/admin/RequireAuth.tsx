import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated, useAuthStore } from "@/stores/authStore";

type RequireAuthProps = {
  children: React.ReactNode;
};

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const authed = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!authed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};
