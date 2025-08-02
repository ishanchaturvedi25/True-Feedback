import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;