import apiClient from "./api";

export const getContextDetails = async (id) => {
  try {
    const response = await apiClient.get(`/contexts/get-context/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching context details:", error);
    throw error;
  }
};

export const submitFeedback = async (contextId, feedbackData) => {
  try {
    const response = await apiClient.post(`/feedbacks/submit-feedback/${contextId}`, feedbackData);
    return response;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};