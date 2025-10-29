import { useAuthStore } from "@/stores";
import axios from "axios";

const baseURL = "http://localhost:4000/api/v1";

const config = {
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
};

export const axiosPrivateInstance = axios.create({
  ...config,
});
 
export const axiosPublicInstance = axios.create({
  ...config,
});

axiosPrivateInstance.interceptors.request.use(
  (request) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken =
          localStorage.getItem("rToken") || sessionStorage.getItem("rToken");
        const response = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        const accessToken = response.data;
        const setAcessToken = useAuthStore.getState().setAccessToken;
        setAcessToken(accessToken);
        const setIsAuth = useAuthStore.getState().setIsAuth;
        setIsAuth(true);
        axiosPrivateInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return axiosPrivateInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // localStorage.removeItem("rToken");
        // window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);