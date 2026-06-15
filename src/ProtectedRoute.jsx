import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const savedRole = localStorage.getItem("role");

  if (savedRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;