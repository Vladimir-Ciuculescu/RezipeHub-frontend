import { ACCESS_TOKEN, REFRESH_TOKEN, storage } from "@/storage";
import axios from "axios";

const baseURL = "http://192.168.1.128:3000";
const iosBaseUrL = "http://localhost:3000";
const andrdoidBaseUrl = "http://192.168.0.1:3000";

const axiosPublicInstance = axios.create({
  //

  //baseURL: "http://localhost:3000", // Replace with your API base URL
  //baseURL: Platform.OS === "ios" ? iosBaseUrL : andrdoidBaseUrl,
  baseURL,

  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPublicInstance.interceptors.request.use((config) => {
  config.params = config.data.params || {};

  return config;
});

const axiosInstance = axios.create({
  //baseURL: "http://localhost:3000", // Replace with your API base URL
  baseURL,
  // baseURL: Platform.OS === "ios" ? iosBaseUrL : andrdoidBaseUrl,

  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = storage.getString(ACCESS_TOKEN);
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (config.data) {
      config.data.params = config.params || {};
    }

    // config.params = config.params || config.data.params || {};
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("interceptor error: ", error);

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getString(REFRESH_TOKEN);
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${refreshToken}`,
        };
        const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken }, { headers });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        storage.set(ACCESS_TOKEN, access_token);
        storage.set(REFRESH_TOKEN, newRefreshToken);

        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { axiosInstance, axiosPublicInstance };
