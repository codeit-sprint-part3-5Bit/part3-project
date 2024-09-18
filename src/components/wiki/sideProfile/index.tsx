import { useState, useRef, useEffect } from "react";
import OriginalProfile from "./OriginalProfile";
import ExpandIcon from "../../../../public/assets/Icons/ExpandIcon.svg";
import FileUploadIcon from "../../../../public/assets/Icons/CameraIcon.svg";
import BasicProfileImg from "/public/assets/Icons/BigProfileIcon.svg";
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
          "flex flex-col items-start justify-start w-full max-w-[671px] rounded-lg bg-gray-50 shadow-lg overflow-hidden",
          "h-[700px]",
          className
        )}
      >
        <div className="my-[60px] mx-0">
          {isEditable && isCurrentUser ? (
            <div className="relative" onClick={handleDivClick}>
              <input
                type="file"
                className="flex flex-col items-center justify-center w-[200px] h-[200px] rounded-full"
                style={{ display: "none" }}
                onChange={handleFileChange}
                ref={inputRef}
                accept="image/*"
              />
              {!preview ? (
                <>
                  <FileUploadIcon
                    className="w-9 h-9 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                    alt="파일 업로드 아이콘"
                  />
                  {profile.image || !isEditable ? (
                    <>
                      <div className="w-52 h-52 absolute left-15 bg-gray-700 opacity-50 rounded-full z-10 ml-14"></div>
                      <img
                        src={profile.image || ""}
                        className="flex flex-col items-center justify-center w-[200px] h-[200px] rounded-full mx-[60px] box-border"
                        alt="프로필 이미지"
                      />
                    </>
                  ) : (
                    <BasicProfileImg
                      className="flex flex-col items-center justify-center w-[200px] h-[200px] rounded-full mx-auto box-border"
                      alt="기본 프로필 이미지"
                    />
                  )}
                </>
              ) : (
                <img
                  src={preview}
                  className="w-[200px] h-[200px] rounded-full mx-auto"
                  alt="첨부파일 미리보기"
                />
              )}
            </div>
          ) : profile.image ? (
            <img
              key={profile.image}
              src={profile.image}
              className="flex flex-col items-center justify-center w-[200px] h-[200px] rounded-full mx-[60px] box-border"
              alt="프로필 이미지"
            />
          ) : (
            <BasicProfileImg
              className="flex flex-col items-center justify-center w-[200px] h-[200px] rounded-full mx-auto box-border"
              alt="기본 프로필 이미지"
            />
          )}
        </div>

        <div className="px-10">
          {isEditable ? (
            <>
              <div className="flex flex-col gap-4 text-base leading-6 font-normal mb-10">
                {attributes.map((attr, index) => (
                  <OriginalProfile
                    key={index}
                    attributeName={attr.name}
                    name={attr.key}
                    value={attr.value}
                    isEditable={isEditable}
                    isCurrentUser={isCurrentUser}
                    onChange={(name, value) => handleInputChange(name, value)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 top-[320px] left-[30px] text-base font-normal">
              <div className="md:flex md:flex-col md:gap-4">
                {attributes.slice(0, 3).map((attr, index) => (
                  <OriginalProfile
                    key={index}
                    name={attr.key}
                    attributeName={attr.name}
                    value={attr.value}
                    isEditable={isEditable}
                  />
                ))}
              </div>
              <div className="hidden md:flex md:flex-col md:gap-4 mb-10">
                {attributes.slice(3, 8).map((attr, index) => (
                  <OriginalProfile
                    key={index}
                    name={attr.key}
                    attributeName={attr.name}
                    value={attr.value}
                    isEditable={isEditable}
                  />
                ))}
              </div>
              {isExpanded && (
                <div className="gap-2 sm:flex sm:flex-col sm:gap-1 md:hidden">
                  {attributes.slice(3, 8).map((attr, index) => (
                    <OriginalProfile
                      key={index}
                      name={attr.key}
                      attributeName={attr.name}
                      value={attr.value}
                      isEditable={isEditable}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {!isEditable && (
          <button
            className={clsx(
              "flex flex-col items-center justify-center col-start-3 row-start-3 bg-gray-50 border-none cursor-pointer p-2.5",
              "block md:hidden" // md 이하에서 block, md 이상에서 hidden
            )}
            onClick={handleToggle}
          >
            <ExpandIcon className="rotate-180" alt="더보기 아이콘" />
          </button>
        )}
      </div>
      {isEditable && (
        <div
          className={clsx(
            "top-[15px] left-[17px] right-[17px] p-1.5 px-4", // sm 미만
            "sm:absolute sm:top-[47px] sm:left-[57px] sm:right-[57px] sm:bg-gray-100 sm:rounded-lg sm:p-1.5 sm:mb-2 sm:flex sm:justify-between sm:items-center", // sm 이상 md 미만
            "md:flex md:flex-row md:gap-2.5 md:absolute md:top-[750px] md:right-[270px] md:left-[1300px]" // md 이상
          )}
        >
          <span
            className={clsx(
              "text-xl leading-xl font-medium text-gray-500",
              "sm:block sm:mr-auto",
              "md:hidden"
            )}
          >
            {profile.name}
          </span>
          <div className="flex gap-1 justify-end">
            <Button
              className={clsx(
                "w-[56px] text-xs bg-transparent",
                "sm:w-[65px] sm:ml-2 bg-transparent",
                "md:w-[65px] bg-gray-400"
              )}
              onClick={onCancel}
            >
              취소
            </Button>
            <Button
              className={clsx(
                "w-[56px] text-xs",
                "sm:w-[65px] sm:ml-2",
                "md:w-[65px]"
              )}
              onClick={onSave}
            >
              저장
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
export default SideProfile;
