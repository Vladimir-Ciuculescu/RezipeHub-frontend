import { ACCESS_TOKEN, storage } from "@/storage";
import axios from "axios";

const axiosPublicInstance = axios.create({
  //baseURL: 'http://localhost:3000', // Replace with your API base URL
  baseURL: "http://192.168.1.132:3000",
  //baseURL: "http://172.20.10.2:3000",

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
  //baseURL: 'http://localhost:3000', // Replace with your API base URL
  baseURL: "http://192.168.1.132:3000",
  //baseURL: "http://172.20.10.2:3000",

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

    config.params = config.data.params || {};
    return config;
  },
  (error) => Promise.reject(error),
);

// export default axiosInstance;

export { axiosInstance, axiosPublicInstance };
