import { useCallback, useEffect, useState } from "react";
import { Button } from "flowbite-react";
import Snackbar from "../Snackbar";
import CheckIcon from "/public/assets/Icons/CheckIcon.svg";
import Link from "../../../../public/assets/Icons/LinkIcon.svg";
import { clsx } from "clsx";
import { ProfileDetail } from "@/types/wiki";

interface ProfileHeaderProps {
  className?: string; //추가적인 스타일링을 위한 클래스 이름
  profile: ProfileDetail; //위키에 관련된 프로필 정보를 포함한 객체, name, code, content와 같은 정보가 포함될 수 있음
  isEditable: boolean; //위키 페이지가 수정 가능한 상태인지 여부를 결정
  onParticipateClick: () => void; //참여 버튼 클릭 시 실행되는 콜백 함수
  checkEditStatus: (code: string) => Promise<any>; //위키 편집 상태를 확인하는 비동기 함수, 다른 사용자가 편집 중인지 확인
  showParticipateBtn: boolean; //위키 참여 버튼의 표시 여부를 제어
  code: string; //위키 페이지의 고유 코드
}

const ProfileHeader = ({
  className,
  profile,
  isEditable,
  onParticipateClick,
  checkEditStatus,
  showParticipateBtn,
  code,
}: ProfileHeaderProps) => {
  const [snackBarMessage, setSnackBarMessage] = useState(""); //스낵바에 표시할 메시지 내용을 저장
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false); //스낵바의 표시 여부를 제어
  const [showLinkCopySnackBar, setShowLinkCopySnackBar] =
    useState<boolean>(true); //특정 상황에서 스낵바를 표시하기 위한 상태
  const [showHandleErrSnackBar, setShowHandleErrSnackBar] =
    useState<boolean>(true); //특정 상황에서 스낵바를 표시하기 위한 상태
  const handleOpenSnackbar = () => {
    setShowSnackBar(true);
  };
  const handleCloseSnackbar = () => {
    setShowSnackBar(false);
  };

  const handleCopyClick = () => {
    const linkToCopy = `https://www.wikied.kr/${profile.code}`;
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        setSnackBarMessage("내 위키 링크가 복사되었습니다.");
        handleOpenSnackbar();
        setShowLinkCopySnackBar(true);
      })
      .catch(() => {
        setSnackBarMessage("복사에 실패했습니다.");
        handleOpenSnackbar();
        setShowLinkCopySnackBar(true);
      });
  };

  //위키가 다른 사람에 의해 편집 중일 때 호출
  const handleError = () => {
    setSnackBarMessage("5분 이내에 누군가 편집했군요! 잠시만 기다려주세요!");
    setShowSnackBar(true);
    setShowHandleErrSnackBar(true);
  };

  //checkEditStatus 함수를 호출하여 위키 페이지 편집 상태 확인, 오류 발생 시 handleError로 사용자에게 알림
  const checkParticipationStatus = useCallback(async () => {
    try {
      await checkEditStatus(profile.code);
    } catch (err) {
      console.error(err);
      handleError();
    }
  }, [checkEditStatus, profile.code]);

  useEffect(() => {
    if (!showParticipateBtn) {
      handleError();
    }
  }, [showParticipateBtn]);

  return (
    <>
      {isEditable ? (
        <div className="bg-gray-100 grid grid-cols-[82px_minmax(0,_178px)_minmax(537px,_auto)] overflow-hidden rounded-lg"></div>
      ) : (
        <section className={`flex flex-col items-start gap-8 ${className}`}>
          <section className="flex items-center justify-between w-full gap-8">
            <span className="text-5xl font-semibold text-gray-800 whitespace-nowrap">
              {profile.name}
            </span>
            {profile.content &&
              (showParticipateBtn ? (
                <>
                  <Button
                    className="w-40 relative whitespace-nowrap bg-green-200"
                    size="md"
                    onClick={() => {
                      checkParticipationStatus();
                      onParticipateClick();
                    }}
                  >
                    위키 참여하기
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="pointer-events-none w-40 bg-gray-400 text-white"
                    size="md"
                    onClick={onParticipateClick}
                  >
                    편집 쿨타임
                  </Button>
                </>
              ))}
          </section>
          <section className="flex items-center max-w-[860px] rounded-lg bg-green-100 p-2 px-3 gap-2">
            <Link width={20} height={20} alt="링크 아이콘" />
            <button
              onClick={handleCopyClick}
              className="flex items-center overflow-hidden text-sm text-green-200 bg-transparent border-none cursor-pointer flex-grow"
            >
              <section className="text-sm text-green-200 truncate">
                https://www.wikied.kr/{profile.code}
              </section>
            </button>
          </section>
        </section>
      )}
      {showSnackBar && (
        <>
          <div className="flex justify-center items-center">
            <Snackbar
              message={
                <>
                  <div className="flex gap-2">
                    <CheckIcon />
                    {snackBarMessage}
                  </div>
                </>
              }
              isOpen={showSnackBar}
              onClose={handleCloseSnackbar}
              duration={3000}
              className={clsx(
                `fixed top-20 left-1/2 transform -translate-x-1/2 font-semibold text-sm bg-green-100 text-green-300 px-5 py-3 rounded-xl shadow-lg border border-green-200 transition-transform duration-300 ease-in-out`,
                {
                  "translate-y-5 opacity-100": showSnackBar,
                  "translate-y-0 opacity-0": !showSnackBar,
                }
              )}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProfileHeader;
