import { Profile } from "@/types/wiki";
import authAxiosInstance from "@/lib/axios";

export const getProfileByCode = (code: string) => {
  return authAxiosInstance.get<Profile>(`/profiles/${code}`);
};
