import apiClient from "./api";

export const getAllContexts = async () => {
  const res = await apiClient.get("/contexts/get-all-contexts");
  return res.data;
};

export const createContext = async ({ label, description }) => {
  const res = await apiClient.post("/contexts/create-context", {
    label,
    description,
  });
  return res.data;
};

export const getContextDetails = async (id) => {
  const res = await apiClient.get(`/contexts/get-context/${id}`);
  const res2 = await apiClient.get(`/feedbacks/get-all-feedbacks/${id}`);
  return { ...res.data, feedbacks: res2.data.feedbacks };
};