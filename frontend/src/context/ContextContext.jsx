import { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../services/api";

const ContextContext = createContext();

export const ContextProvider = ({ children }) => {
  const [contexts, setContexts] = useState([]);

  const fetchContexts = async () => {
    const res = await apiClient.get("/contexts");
    setContexts(res.data);
  };

  const createContextItem = async (title, description) => {
    const res = await apiClient.post("/contexts", { title, description });
    setContexts((prev) => [...prev, res.data]);
  };

  useEffect(() => {
    fetchContexts();
  }, []);

  return (
    <ContextContext.Provider value={{ contexts, fetchContexts, createContextItem }}>
      {children}
    </ContextContext.Provider>
  );
};

export const useContexts = () => useContext(ContextContext);