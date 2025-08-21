import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;