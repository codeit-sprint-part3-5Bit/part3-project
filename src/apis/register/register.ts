import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { BASE_URL } from "../base";
import { registerData } from '@/types/register/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, name, password, passwordConfirmation }: registerData = req.body; // 타입 지정

    try {
      const response = await axios.post(`${BASE_URL}/auth/signIn`, {
        email,
        name,
        password,
        passwordConfirmation,
      });

      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: '회원가입에 실패했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
