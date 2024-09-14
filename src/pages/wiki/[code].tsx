import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import {
  checkProfileEditStatus,
  getProfileByCode,
  updateProfile,
} from "@/apis/profile";
import { ProfileDetail } from "@/types/wiki";
import ProfileHeader from "@/components/wiki/profileHeader";
import ProfileContentArea from "@/components/wiki/profileContentArea";
import SideProfile from "@/components/wiki/sideProfile";
import QuizModal from "@/components/wiki/wikiModal/Modals/QuizModal";
import WikiModal from "@/components/wiki/wikiModal";
import BlockingModal from "@/components/wiki/wikiModal/Modals/BlockingModal";

interface WikiProps {
  className: string;
  profile: ProfileDetail;
  securityAnswer: string;
}

const Wiki = (props: WikiProps) => {
  const [profile, setProfile] = useState<any>(null); //프로필 데이터 저장
  const [isEditable, setIsEditable] = useState<boolean>(false);
  //참여버튼 표시 여부 관리. 서버로부터 확인 후 업데이트, WikiHeader 컴포넌트에 영향
  const [showParticipateBtn, setShowParticipateBtn] = useState<boolean>(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  /* 편집 모드가 활성화되고 일정 시간 후 오류 모달 표시를 위한 타이머. 타이머 만료 시 isErrorModalOpen 상태가 true로 바뀜
  편집 모드 활성화될 때마다 타이머가 시작, 편집이 완료되거나 모드 해제 시 타이머 초기화*/
  const [editTimeout, setEditTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isModalVisible, setModalVisible] = useState(false); //모달 표시 여부 관리
  /* 서버로부터의 응답 상태 저장.
  checkProfileEditStatus 함수에서 API 응답 확인 후 프로필 편집 가능 여부에 따라 상태가 업데이트 */
  const [responseState, setResponseState] = useState<boolean>(true);
  //편집기에서 작성된 내용 저장. 저장 시 서버로 전송되어 프로필 본문 업데이트하는 데에 사용
  const [editorContent, setEditorContent] = useState("");
  //사용자가 편집 중인 프로필 데이터 저장. 사용자가 편집을 완료하고 저장할 때 이 상태의 값이 서버로 전송
  const [editedProfile, setEditedProfile] = useState<ProfileDetail>(profile);
  //편집기의 HTML 형식 데이터를 저장. 저장 시 서버로 전송, 프로필의 시각적인 본문 내용으로 사용
  const [editorHtmlContent, setEditorHtmlContent] = useState("");

  const router = useRouter();
  const { code } = router.query;

  //API 호출을 통해 프로필 데이터 가져와 상태 업데이트
  const getList = useCallback(async (code: string) => {
    try {
      const response = await getProfileByCode(code);
      const data = response.data;
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  //API 호출을 통해 수정중 여부 확인
  const checkEditStatus = useCallback(async (code: string) => {
    try {
      const response = await checkProfileEditStatus(code);
    } catch (err) {
      console.log(err);
    }
  }, []);

  //편집 모드가 활성화되면 수정 타이머 시작
  const startEditTimer = () => {
    if (editTimeout) {
      clearTimeout(editTimeout);
    }
    // 5분 후 오류 모달 표시
    const timer = setTimeout(() => {
      setIsErrorModalOpen(true);
      setIsEditable(false);
    }, 300000); //5분

    setEditTimeout(timer);
  };

  const handleModalToggle = () => {
    setModalVisible(!isModalVisible);
  };

  const closeModal = (type: "error" | "quiz") => {
    if (type === "error") {
      setIsErrorModalOpen(false);
    } else if (type === "quiz") {
      setModalVisible(false);
    }
  };

  //컴포넌트 렌더링 시 데이터 가져오고 수정 상태 확인
  useEffect(() => {
    const fetchData = async () => {
      if (typeof code === "string") {
        await getList(code);
        const response = await checkProfileEditStatus(code);
        if (response.status === 204) {
          setResponseState(true);
          setShowParticipateBtn(true);
        } else {
          setResponseState(false);
          setShowParticipateBtn(false);
        }
      }
    };
    fetchData();
  }, [code, showParticipateBtn]);

  //isEditable 상태 변경될 때 수정 타이머 시작 또는 정리
  useEffect(() => {
    if (isEditable) {
      startEditTimer();
    } else if (editTimeout) {
      clearTimeout(editTimeout);
    }
  }, [isEditable]);

  //프로필 데이터 로딩 중일 경우 Loading 표시
  if (!profile) {
    return <div>Loading...</div>;
  }

  //편집기 내용 변경 시 호출
  const handleEditorChange = (content: string, htmlContent: string) => {
    setEditorContent(content);
    setEditorHtmlContent(htmlContent);
  };

  //프로필 수정 시 호출
  const handleProfileChange = (updatedProfile: ProfileDetail) => {
    console.log("Profile updated:", updatedProfile);
    setEditedProfile(updatedProfile);
  };

  //편집된 프로필 데이터를 서버에 저장, 저장이 완료 시 알림 제공, 페이지를 새로 고쳐 업데이트 정보를 반영
  const handleSave = async () => {
    if (editTimeout) {
      clearTimeout(editTimeout);
    }

    try {
      console.log("Saving profile:", editedProfile);
      console.log("Saving content:", editorContent);

      const updatedData = {
        securityAnswer: profile.securityAnswer,
        securityQuestion:
          editedProfile?.securityQuestion || profile.securityQuestion,
        nationality: editedProfile?.nationality || profile.nationality,
        family: editedProfile?.family || profile.family,
        bloodType: editedProfile?.bloodType || profile.bloodType,
        nickname: editedProfile?.nickname || profile.nickname,
        birthday: editedProfile?.birthday || profile.birthday,
        sns: editedProfile?.sns || profile.sns,
        job: editedProfile?.job || profile.job,
        mbti: editedProfile?.mbti || profile.mbti,
        city: editedProfile?.city || profile.city,
        image: editedProfile?.image || profile.image,
        content: editorContent || profile.content,
      };

      console.log("Data to be sent:", updatedData);

      const response = await updateProfile(profile.code, updatedData);
      console.log("Update response:", response);

      if (response.data) {
        setProfile(response.data);
        setIsEditable(false);
        alert("프로필이 성공적으로 저장되었습니다.");
        window.location.reload();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("프로필 저장에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  //편집모드 취소 후 원래 프로필로 되돌림
  const handleCancel = () => {
    setIsEditable(false);
    setEditedProfile(profile);
  };

  return (
    <>
      <div
        className={clsx(
          "relative max-w-full mx-auto box-border",
          !isEditable ? "pt-10" : "pt-12",
          !isEditable && profile.content.length === 0 ? "pt-10" : "",
          "flex flex-col items-center" // 화면 가운데 정렬 추가
        )}
      >
        <main
          className={clsx(
            "flex gap-12",
            isEditable ? "md:gap-4" : "",
            "w-full max-w-[1200px]" // 최대 너비 설정
          )}
        >
          <div className="flex-grow md:max-w-[860px]">
            <div className="w-full max-w-[460px] md:hidden"></div>
            <ProfileHeader
              className="mb-10 md:mb-14 mt-16"
              profile={profile}
              isEditable={isEditable}
              onParticipateClick={handleModalToggle}
              checkEditStatus={checkEditStatus}
              showParticipateBtn={showParticipateBtn ?? false}
              code={typeof code === "string" ? code : ""}
            />
            <SideProfile //화면 작아지면 나타남, 커지면 사라짐
              className="block my-4 md:hidden md:w-[330px] md:ml-auto"
              profile={profile}
              setProfile={setProfile}
              isEditable={isEditable}
              setIsEditable={setIsEditable}
              onProfileChange={handleProfileChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
            <ProfileContentArea
              className="mb-10"
              profile={profile}
              onParticipateClick={handleModalToggle}
              checkEditStatus={checkEditStatus}
              isEditable={isEditable}
              onEditorChange={handleEditorChange}
            />
          </div>
          <div className="flex flex-col md:flex-row">
            <SideProfile //화면 커지면 나타남, 작아지면 사라짐
              className="hidden md:block md:w-[330px] md:ml-auto"
              profile={profile}
              setProfile={setProfile}
              isEditable={isEditable}
              setIsEditable={setIsEditable}
              onProfileChange={handleProfileChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </main>

        {!isEditable && isModalVisible && responseState && (
          <WikiModal
            contents={() => (
              <QuizModal
                code={typeof code === "string" ? code : ""}
                setIsEditable={setIsEditable}
                setIsModalOpen={setModalVisible}
                securityQuestion={profile.securityQuestion}
              />
            )}
            onClose={() => closeModal("quiz")}
          />
        )}

        {isErrorModalOpen && (
          <WikiModal
            contents={() => (
              <BlockingModal
                title="5분 이상 글을 쓰지 않아 접속이 끊어졌어요."
                description="위키 참여하기를 통해 다시 위키를 수정해 주세요."
                content="확인"
                onClose={() => closeModal("error")}
              />
            )}
            onClose={() => closeModal("error")}
          />
        )}
      </div>
    </>
  );
};

export default Wiki;
