import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devhire_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("devhire_token");
      localStorage.removeItem("devhire_user");
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
