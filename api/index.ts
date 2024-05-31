import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:3000', // Replace with your API base URL
  //baseURL: 'http://192.120.16.108:3000',
  baseURL: 'http://192.168.0.187:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
