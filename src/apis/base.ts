import axios from "axios";
import renewTokens from "@/utils/token/renewTokens";
import { getTokens } from "@/utils/token/token";
import { useQueryClient } from "@tanstack/react-query";

export const BASE_URL = process.env.NEXT_PUBLIC_API_KEY;

const request = axios.create({
  baseURL: BASE_URL,
});

request.interceptors.request.use(
  async config => {
    const { accessToken, refreshToken } = getTokens() || {}; // 기본값 추가
    if (!refreshToken) {
      window.location.href = '';
      return config;
    }

    if (!accessToken) {
      try {
        const tokens = await renewTokens();
        if (tokens && tokens.accessToken && tokens.refreshToken) {
          // 로컬 스토리지에 토큰 저장
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
        } else {
          throw new Error('토큰 갱신 실패');
        }
      } catch (error) {
        console.error('토큰 갱신 중 오류 발생:', error);
        window.location.href = ''; // 오류 발생 시 리다이렉트
        return config;
      }
    } else {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    console.log('에러발생');
    console.error(error);
    return Promise.reject(error);
  },
);

// accessToken 만료시
request.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = await renewTokens();
        if (tokens && tokens.accessToken) {
          // 로컬 스토리지에 새로운 엑세스 토큰 저장
          localStorage.setItem('accessToken', tokens.accessToken);
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return request(originalRequest);
        } else {
          throw new Error('토큰 갱신 실패');
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

// refreshToken 만료시
request.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    console.log('api error', error);
    const status = error.response?.status;
    const message = error.response?.data.message;

    if (status === 500 && message === '회원이 존재하지 않습니다.') {
      // 로컬 스토리지에서 리프레시 토큰 삭제
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken'); // 엑세스 토큰도 삭제할 수 있습니다.
      window.location.href = '';

      const queryClient = useQueryClient();
      queryClient.clear();
    }
    return Promise.reject(error);
  },
);

export default request;