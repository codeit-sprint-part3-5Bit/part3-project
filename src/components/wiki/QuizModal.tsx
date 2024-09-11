import { Button, Modal } from "flowbite-react";
import React, { useState } from "react";
import Closeicon from "/public/assets/Icons/closeicon.svg";
import Lockicon from "/public/assets/Icons/lockicon.svg";
import clsx from "clsx";

interface QuizModalProps {
  quizButtonText: string; //퀴즈 모달 버튼 내용
  buttonWidth: string; // 퀴즈 모달 버튼 너비
  buttonHigth: string; // 퀴즈 모달 버튼 높이
  question: string; // 퀴즈 내용 api 연동 필요
  answer: string; // api 연동 필요함 -> 사용자가 응답한 대답으로 api 연동
  onQuizSubmit: () => void; //조건부 렌더링 위한 임시 type
}

const QuizModal = ({
  quizButtonText,
  buttonWidth,
  buttonHigth,
  question,
  answer,
  onQuizSubmit, //임시 type
}: QuizModalProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setOpenModal(false);
    setInputValue("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event?.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue !== answer) {
      setError("정답이 아닙니다. 다시 시도해주세요.");
    } else {
      setError("");
      handleClose();
      // setInputValue("");
      onQuizSubmit(); // 퀴즈 제출 후 콜백 호출, 임시
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        className={`${buttonWidth} ${buttonHigth} bg-green-200 font-semibold text-lg`}
      >
        {quizButtonText}
      </Button>
      <div>
        <Modal
          dismissible
          show={openModal}
          onClose={() => setOpenModal(false)}
          size="md"
        >
          <div className="flex-col p-5 ">
            <button
              className="block ml-auto w-5 h-5 mb-5"
              onClick={handleClose}
            >
              <Closeicon />
            </button>
            <Lockicon className="block mx-auto  mb-5" />
            <div className="text-center text-sm text-grayscale-400 mb-9 ">
              <p>다음 퀴즈를 맞추고</p>
              <p>위키를 작성해 보세요.</p>
            </div>
            <h1 className="mb-2.5 text-lg font-semibold">{question}</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="답안을 입력 해 주세요"
                className={clsx(
                  `focus:ring-green-100 border-none pl-5 w-full h-11 rounded-lg  placeholder:text-gray-400`,
                  { "bg-grayscale-100": !error, "bg-red-100": error }
                )}
              />
              {error && <p className="mt-2.5 text-red-200 text-xs">{error}</p>}
              <div className="flex justify-center mb-5 mt-10">
                <button
                  type="submit"
                  className=" text-grayscale-50  bg-green-200 w-full rounded-lg h-10 "
                >
                  확인
                </button>
              </div>
            </form>
            <div className="text-xs text-grayscale-400 ">
              <p className="text-center">
                위키드는 지인들과 함꼐하는 즐거운 공간입니다.
              </p>
              <p className="text-center">
                지인에게 상처를 주지 않도록 작성해 주세요.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default QuizModal;
