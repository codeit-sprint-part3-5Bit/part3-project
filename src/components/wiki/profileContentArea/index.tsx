import { useCallback } from "react";
import { ProfileDetail } from "@/types/wiki";
import { Button } from "flowbite-react";
import TextEditor from "./textEditor";
import DOMPurify from "dompurify";

interface ContentAreaProps {
  className: string;
  profile: ProfileDetail;
  onParticipateClick: () => void;
  checkEditStatus: (code: string) => Promise<any>;
  isEditable: boolean;
  onEditorChange: (content: string, htmlContent: string) => void;
}

const profileContentArea = ({
  className, //추가적으로 적용할 CSS 클래스를 받음
  profile, //위키 프로필 상세 정보 객체. 주로 profile.content에 위키 콘텐츠 포함
  onParticipateClick, //사용자가 위키 참여 버튼을 클릭했을 때 호출되는 함수
  checkEditStatus, //위키 콘텐츠가 현재 수정 중인지를 확인하는 비동기 함수
  isEditable, //위키 콘텐츠가 편집 가능한 상태인지 확인하는 boolean 값
  onEditorChange, //에디터에서 내용 변경될 때 호출되는 콜백 함수. 변경된 내용과 HTML 형식 내용 인자로 받음
}: ContentAreaProps) => {
  //비동기 함수 checkEditStatus를 호출하여 위키 콘텐츠가 현재 수정 중인지 확인, profile.code를 인자로 받음
  const checkParticipationStatus = useCallback(async () => {
    try {
      await checkEditStatus(profile.code);
    } catch (err) {
      console.error(err);
    }
  }, [checkEditStatus, profile.code]);

  return (
    <div className={`${className} flex flex-col gap-16`}>
      {profile.content && !isEditable ? (
        <div className="flex flex-col items-start gap-2">
          <div
            className="text-lg leading-relaxed font-normal text-gray-500"
            //DOMPurify로 보안처리 후 dangerouslySetInnerHTML을 사용해 그대로 출력
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(profile.content),
            }}
          ></div>
        </div>
      ) : isEditable ? (
        <div className="flex flex-col items-start gap-2">
          <span className="w-full text-lg leading-relaxed font-normal text-gray-500">
            <TextEditor
              profile={profile}
              onEditorChange={onEditorChange} //콘텐츠 변경될 때마다 onEditorChange 콜백 호출
              initialContent={profile.content} //초기 값
            />{" "}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 rounded-lg">
          <div className="flex flex-col items-center justify-center gap-5">
            <span className="text-lg leading-relaxed font-normal text-gray-400 text-center">
              아직 작성된 내용이 없네요.
              <p />
              위키에 참여해 보세요!
            </span>
            <Button
              className="relative whitespace-nowrap bg-green-200 z-10"
              size="sm"
              onClick={() => {
                checkParticipationStatus();
                onParticipateClick();
              }}
            >
              시작하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default profileContentArea;
