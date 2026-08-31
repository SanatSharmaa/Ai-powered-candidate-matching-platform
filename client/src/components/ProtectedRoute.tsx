import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
