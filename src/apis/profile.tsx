import { Profile } from "@/types/wiki";
import authAxiosInstance from "@/lib/axios";

export const getProfileByCode = (code: string) => {
  return authAxiosInstance.get<Profile>(`/profiles/${code}`);
};

export const imageFileToUrl = (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  return authAxiosInstance.post<{ url: string }>("/images/upload", formData);
};
