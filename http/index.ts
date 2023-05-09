import { AuthResponce } from "@/clientModels/responce/AuthResponce";
import axios from "axios";

const api = axios.create({ withCredentials: true });

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status == 401 && err.config && !err.config._isRetry) {
      originalRequest._isRetry = true;
      try {
        const responce = await axios.get<AuthResponce>("/api/refresh", {
          withCredentials: true,
        });
        localStorage.setItem("token", responce.data.accessToken);
        return api.request(originalRequest);
      } catch (error) {
        console.log("не авторизирован");
      }
    }
    throw err;
  }
);

export default api;
