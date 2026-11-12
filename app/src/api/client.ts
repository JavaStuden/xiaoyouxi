import axios from 'axios';

// 默认指向本地 Spring Boot 后端，可根据网络环境配置为局域网 IP 如 http://192.168.1.100:8080
export const API_BASE_URL = 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let currentAuthToken = '';

export const setAuthToken = (token: string) => {
  currentAuthToken = token;
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMsg = error.response?.data?.message || error.message || '网络请求异常';
    return Promise.reject(new Error(errorMsg));
  }
);
