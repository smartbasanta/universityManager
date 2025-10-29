import { useAuthStore } from "@/stores";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"; // Use environment variable

const config = { baseURL, headers: { "Content-Type": "application/json" } };
export const axiosPrivateInstance = axios.create(config);
export const axiosPublicInstance = axios.create(config);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosPrivateInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosPrivateInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { logout } = useAuthStore.getState();
      const refreshToken = localStorage.getItem("rToken") || sessionStorage.getItem("rToken");

      if (!refreshToken) {
        logout();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );
        const { accessToken } = response.data; // Backend returns { accessToken: '...' }
        useAuthStore.getState().setAccessToken(accessToken);
        
        axiosPrivateInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        return axiosPrivateInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        logout(); // Logout the user if refresh fails
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);