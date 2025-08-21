import { createContext, useContext, useEffect, useState } from "react";
import { login as loginUser, logout as logoutUser } from "../services/authService";
import apiClient from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await apiClient.get("/users/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("User fetched from token:", res.data?.user);
          setUser(res.data?.user || null);
        } catch (err) {
          console.error("Invalid token or user fetch failed", err);
          logoutUser();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (identifier, password) => {
    const userRes = await loginUser(identifier, password);
    setUser(userRes);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateReceiveFeedback = async (value) => {
    try {
      const res = await apiClient.patch("/users/receive-feedback", { isReceivingFeedback: value });
      setUser((prev) => ({ ...prev, isReceivingFeedback: res.data.isReceivingFeedback }));
    } catch (err) {
      console.error("Failed to update feedback toggle", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, isLoggedIn: !!user, updateReceiveFeedback }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);