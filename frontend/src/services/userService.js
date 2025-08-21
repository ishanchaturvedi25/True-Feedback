import apiClient from "./api";

export const getFeedbackStatus = async () => {
  const res = await apiClient.get("/users/feedback-status");
  return res.data;
};

export const toggleFeedbackStatus = async (enabled) => {
  const res = await apiClient.patch("/users/receive-feedback", { enabled });
  return res.data;
};