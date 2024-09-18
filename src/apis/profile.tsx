import {
  Profile,
  UserInfo,
  ProfileDetail,
  ProfileEditStatus,
} from "@/types/wiki";
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

//현재 로그인된 사용자 정보 조회 api 호출, 사용자 정보 포함 UserInfo타입 반환
export const getUserInfo = () => {
  return authAxiosInstance.get<UserInfo>("/users/me");
};

//특정 프로필의 편집 상태를 확인하는 api 호출, 등록 시간(registeredAt)과 사용자 id(userId) 포함 객체 반환
export const checkProfileEditStatus = (code: string) => {
  return authAxiosInstance.get<{ registeredAt: string; userId: number }>(
    `/profiles/${code}/ping`
  );
};

//프로필 편집 상태 업데이트하는 api 호출, 요청 본문에 securityAnswer 포함, ProfileEditSTatus타입 반환
export const updateProfileEditStatus = (
  code: string,
  payload: { securityAnswer: string }
) => {
  return authAxiosInstance.post<ProfileEditStatus>(
    `/profiles/${code}/ping`,
    payload
  );
};

//특정 프로필 업데이트하는 api 호출, 수정된 프로필 세부 정보 포함하는 ProfileDetail타입 반환
export const updateProfile = (
  code: string,
  payload: {
    securityAnswer: string;
    securityQuestion: string;
    nationality: string;
    family: string;
    bloodType: string;
    nickname: string;
    birthday: string;
    sns: string;
    job: string;
    mbti: string;
    city: string;
    image: string | null;
    content: string;
  }
) => {
  return authAxiosInstance.patch<ProfileDetail>(`/profiles/${code}`, payload);
};
