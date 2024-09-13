import { useState } from "react";
import CustomInput from "@/components/common/customInput";
import { Button } from "flowbite-react";
import { updateProfileEditStatus } from "@/apis/profile";
import Image from "next/image";

interface QuizModalProps {
  code: string; //보안 질문 코드
  setIsEditable: (editable: boolean) => void; //편집 가능 상태 설정 함수
  setIsModalOpen: (open: boolean) => void; //모달창 열림 상태 설정 함수
  securityQuestion: string; //보안 질문 텍스트
}

const QuizModal = ({
  code,
  setIsEditable,
  setIsModalOpen,
  securityQuestion,
}: QuizModalProps) => {
  const [answer, setAnswer] = useState<string>(""); //사용자 입력을 저장하는 상태
  const [errorMessage, setErrorMessage] = useState<string>(""); //에러 메시지를 저장하는 상태

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    try {
      const response = await updateProfileEditStatus(code, {
        securityAnswer: answer,
      });
      setIsEditable(true);
      setIsModalOpen(false);
      setErrorMessage("");
    } catch (error) {
      setIsEditable(false);
      setErrorMessage("정답이 아닙니다. 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
          <Image
            src="/assets/Icons/lockicon.svg"
            alt="자물쇠"
            width={20}
            height={20}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="text-center text-gray-400 text-md leading-md font-normal">
          <p>다음 퀴즈를 맞추고</p>
          <p>위키를 작성해보세요.</p>
        </div>
      </div>
      <div
        className={`flex flex-col gap-2.5 my-9 ${errorMessage ? "my-9" : ""}`}
      >
        <label className="text-2xl font-semibold text-gray-500">
          {securityQuestion}
        </label>
        <CustomInput
          id="answer"
          name="answer"
          type="text"
          placeholder="답안을 입력해 주세요"
          fullWidth
          errorMessage={errorMessage} //틀릴 시 시각적 에러 피드백 제공
          onChange={handleInputChange} //함수 호출하여 입력값을 상태(answer)에 저장, 에러 메시지 초기화
        />
      </div>
      {/* 사용자가 제출할 수 있는 버튼 제공 */}
      <Button
        className="text-white bg-green-200 w-full rounded-lg h-10"
        onClick={handleSubmit}
      >
        확인
      </Button>
      {/* 위키 사용 시 유의 사항 텍스트 */}
      <div className="flex flex-col items-center text-gray-400 text-xs leading-4 font-normal mt-5">
        <p>위키드는 지인들과 함께하는 즐거운 공간입니다.</p>
        <p>지인에게 상처를 주지 않도록 작성해 주세요.</p>
      </div>
    </>
  );
};

export default QuizModal;
