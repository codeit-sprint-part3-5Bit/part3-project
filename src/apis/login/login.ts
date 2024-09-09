import axios from "axios";
import { LoginUserProps } from "@/types/login/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const postLogin = async ({ email, password }: LoginUserProps) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
  
    return axios.post(`${BASE_URL}/auth/signIn`, formData);
};

export const postMemberRefresh = async (refreshToken: string) => {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh-token`,
      {},
      {
        headers: {
          AuthorizationRefresh: `Bearer ${refreshToken}`,
        },
      },
    );
    return response.data;
  };