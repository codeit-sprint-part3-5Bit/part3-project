import axios from "axios";
import { BASE_URL } from "@/apis/base";

const authAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

authAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      error.message = "로그인이 필요한 서비스입니다.";
    }
    return Promise.reject(error);
  }
);

export default authAxiosInstance;
