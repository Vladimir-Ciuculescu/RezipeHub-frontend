import axios from "axios";

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:3000', // Replace with your API base URL
  // baseURL: "http://192.168.1.130:3000",
  baseURL: "http://172.20.10.2:3000",

  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  config.params = config.data.params || {};
  return config;
});

export default axiosInstance;
