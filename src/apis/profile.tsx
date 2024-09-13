import { Profile } from "@/types/wiki";
import authAxiosInstance from "@/lib/axios";

export const getProfileByCode = (code: string) => {
  return authAxiosInstance.get<Profile>(`/profiles/${code}`);
};

//이미지파일 서버 업로드 후 업로드 이미지 url 반환 api 호출
//FormData객체로 파일데이터 전송, 이미지url포함 객체 반환
export const imageFileToUrl = (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  return authAxiosInstance.post<{ url: string }>("/images/upload", formData);
};
