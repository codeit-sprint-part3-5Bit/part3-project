import { useState, useRef, useEffect } from "react";
import OriginalProfile from "./OriginalProfile";
import ExpandIcon from "../../../../public/assets/Icons/ExpandIcon.svg";
import fileUploadIcon from "../../../../public/assets/Icons/CameraIcon.svg";
import BasicProfileImg from "../../../../public/assets/Icons/ProfileIcon.svg";
import { Button } from "flowbite-react";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import { ProfileDetail } from "@/types/wiki";
import { imageFileToUrl, getUserInfo } from "@/apis/profile";

interface SideProfileProps {
  className: string; //스타일링 클래스 이름
  profile: ProfileDetail; //사용자 프로필 데이터
  setProfile: React.Dispatch<React.SetStateAction<ProfileDetail>>; //프로필 함수 업데이트
  isEditable: boolean; //프로필 편집 가능 여부 상태
  setIsEditable: (isEditable: boolean) => void; //편집 가능 여부 변경 함수
  onProfileChange: (updatedProfile: ProfileDetail) => void; //프로필 변경 시 호출되는 함수
  onSave: () => void; //저장 버튼 클릭 시 호출되는 함수
  onCancel: () => void; //취소 버튼 클릭 시 호출되는 함수
}

const SideProfile = ({
  className,
  profile,
  isEditable,
  onProfileChange,
  onSave,
  onCancel,
}: SideProfileProps) => {
  const [isExpanded, setIsExpanded] = useState(false); //모바일에서 프로필 상세 정보가 확장되었는지 나타냄
  const [preview, setPreview] = useState<string | null>(null); //프로필 이미지 미리보기 url 저장
  const [editedProfile, setEditedProfile] = useState<ProfileDetail>(profile); //수정된 프로필 정보 저장
  const [imageFile, setImageFile] = useState<File | null>(null); //업로드된 프로필 이미지 파일 저장
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false); //현재 사용자 프로필 주인 여부 저장
  const inputRef = useRef<HTMLInputElement | null>(null);

  //프로필 업데이트될 때마다 editedProfile 상태를 최신 프로필로 동기화
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  //getUserInfo api를 호출해 현재 사용자 정보를 가져오고, 이 사용자가 프로필 주인인지 확인
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getUserInfo();
        const { data } = response;
        const userId = String(data.profile.id);
        const profileIdStr = String(profile.id);
        setIsCurrentUser(profileIdStr === userId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, [profile.id]);

  //작은 화면에서 프로필 확장/축소 버튼 클릭할 때 isExpanded 상태 토글
  const handleToggle = () => {
    setIsExpanded((prevState) => !prevState);
  };

  //파일 변경 시 미리보기 이미지 생성, 파일 이름을 uuid(v4로 랜덤값 생성)로 변경한 후 서버로 업로드
  //업로드 된 이미지의 url을 editedProfile에 저장 후 onProfileChange 콜백 호출
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const nextPreview = URL.createObjectURL(file);
      setPreview(nextPreview);

      const newFileName = `${uuidv4()}.${file.name.split(".").pop()}`;
      const newFile = new File([file], newFileName, { type: file.type });
      setImageFile(newFile);

      try {
        const response = await imageFileToUrl(newFile);
        const imageUrl = response.data.url;
        const updatedProfile = {
          ...editedProfile,
          image: imageUrl,
        };
        setEditedProfile(updatedProfile);
        onProfileChange(updatedProfile);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }

      return () => {
        URL.revokeObjectURL(nextPreview);
      };
    }
  };

  const handleDivClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (name: string, value: string) => {
    const updatedProfile = {
      ...editedProfile,
      [name]: value,
    };
    setEditedProfile(updatedProfile);
    onProfileChange(updatedProfile);
  };

  const attributes = [
    { name: "거주 도시", value: editedProfile.city, key: "city" },
    { name: "MBTI", value: editedProfile.mbti, key: "mbti" },
    { name: "직업", value: editedProfile.job, key: "job" },
    { name: "SNS 계정", value: editedProfile.sns, key: "sns" },
    { name: "생일", value: editedProfile.birthday, key: "birthday" },
    { name: "별명", value: editedProfile.nickname, key: "nickname" },
    { name: "혈액형", value: editedProfile.bloodType, key: "bloodType" },
    { name: "국적", value: editedProfile.nationality, key: "nationality" },
  ];

  return (
    <>
      <div
        className={clsx(
          "relative overflow-hidden max-h-[650px] shadow-lg rounded-lg p-4",
          className,
          {
            "bg-gray-100": isEditable,
            "bg-white": !isEditable,
          },
          "max-w-sm mx-auto md:mx-0"
        )}
      >
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 md:w-40 md:h-40">
            {profile.image ? (
              <img
                src={profile.image}
                className="object-cover w-full h-full"
                alt="프로필 이미지"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <BasicProfileImg className="object-cover" />
              </div>
            )}
            {isEditable && isCurrentUser && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 cursor-pointer"
                onClick={handleDivClick}
              >
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={inputRef}
                  accept="image/*"
                />
                <img
                  src={fileUploadIcon.src}
                  className="w-8 h-8"
                  alt="파일 업로드 아이콘"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-12">
          {isEditable ? (
            attributes.map((attr, index) => (
              <OriginalProfile
                key={index}
                attributeName={attr.name}
                name={attr.key}
                value={attr.value || "-"}
                isEditable={isEditable}
                isCurrentUser={isCurrentUser}
                onChange={(name, value) => handleInputChange(name, value)}
              />
            ))
          ) : (
            <div>
              <div className="space-y-4">
                {attributes.slice(0, 3).map((attr, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 ml-12"
                  >
                    <span className="text-gray-400 text-md font-medium w-1/3 ">
                      {attr.name}
                    </span>
                    <span className="text-gray-600 text-md w-2/3">
                      {attr.value || "-"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="hidden md:block space-y-4 mt-4">
                {attributes.slice(3, 8).map((attr, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 ml-12"
                  >
                    <span className="text-gray-400 text-md font-medium w-1/3">
                      {attr.name}
                    </span>
                    <span className="text-gray-600 text-md w-2/3">
                      {attr.value || "-"}
                    </span>
                  </div>
                ))}
              </div>
              {isExpanded && (
                <div className="block md:hidden space-y-2 mt-4 ml-12">
                  {attributes.slice(3, 8).map((attr, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="text-gray-400 text-md font-medium w-1/3">
                        {attr.name}
                      </span>
                      <span className="text-gray-600 text-md w-2/3">
                        {attr.value || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {!isEditable && (
          <button
            className={clsx(
              "absolute bottom-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300",
              "block md:hidden",
              { "rotate-180": isExpanded }
            )}
            onClick={handleToggle}
          >
            <ExpandIcon className="w-6 h-6" alt="더보기 아이콘" />
          </button>
        )}

        {isEditable && (
          <div className="flex justify-between mt-4">
            <span className="text-lg font-medium">{profile.name}</span>
            <div className="flex gap-2">
              <Button
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-400"
                size="sm"
                onClick={onCancel}
              >
                취소
              </Button>
              <Button
                className="bg-green-400 text-white hover:bg-blue-600"
                size="sm"
                onClick={onSave}
              >
                저장
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default SideProfile;
