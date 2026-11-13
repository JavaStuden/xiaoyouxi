import axios from 'axios';

// 默认指向本地 Spring Boot 后端 (端口 18080，避免与系统及常用应用端口冲突)
export const API_BASE_URL = 'http://localhost:18080/api/v1';

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
