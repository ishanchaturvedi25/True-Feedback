import apiClient from "./api";

export const register = async ({ name, username, email, password }) => {
  const res = await apiClient.post("/users/register", {
    name,
    username,
    email,
    password,
  });
  return res.data;
};

export const login = async (identifier, password) => {
  const res = await apiClient.post("/users/login", { identifier, password });
  const token = res.data.token;
  if (token) {
    localStorage.setItem("token", token);
  }
  return res.data;
};

export const logout = async () => {
  localStorage.removeItem("token");
  await apiClient.post("/users/logout");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};