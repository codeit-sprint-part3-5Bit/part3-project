import axios from "axios";
import { LoginUserProps } from "@/types/login/types";
import { BASE_URL } from "../base";

export const postLogin = async ({ email, password }: LoginUserProps) => {
    return axios.post(`${BASE_URL}/auth/signIn`, {
        email,
        password
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
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