import { Navigate } from "react-router-dom";
import { useAdmin } from "../store/adminStore";
import { useAuth } from "../store/authStore";

export default function AdminRoute({ children }) {
  const adminStoreIsAdmin = useAdmin((s) => s.isAdmin);
  const authStoreIsAdmin = useAuth((s) => s.isAdmin);

  // Either store can grant access
  if (!adminStoreIsAdmin && !authStoreIsAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}