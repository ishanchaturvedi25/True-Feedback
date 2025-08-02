import apiClient from "./api";

export const getAllContexts = async () => {
  const res = await apiClient.get("/contexts/get-all-contexts");
  return res.data;
};