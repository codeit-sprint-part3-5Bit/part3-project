import { useState, FormEvent, useEffect } from "react";
import axios from "@/lib/axios";

type QuestionData = {
  securityQuestion: string;
  securityAnswer: string;
};

type ApiResponse = {
  message: string;
};

export default function Home() {
  const [securityQuestion, setSecurityQuestion] = useState<string>("");
  const [securityAnswer, setSecurityAnswer] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const passwordData = {
      currentPassword,
      password: newPassword,
      passwordConfirmation: confirmPassword,
    };

    try {
      const response = await axios.patch<ApiResponse>(
        "users/me/password",
        passwordData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data: QuestionData = {
      securityQuestion,
      securityAnswer,
    };

    try {
      const response = await axios.post<ApiResponse>("/profiles", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        alert("위키 설정 완료");

        setSecurityQuestion("");
        setSecurityAnswer("");
      } else {
        alert("전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[85vh]">
      <h1 className="text-2xl font-semibold text-grayscale-500 mb-16">
        계정 설정
      </h1>
      <div className="w-[25rem] h-[31rem] flex flex-col placeholder-grayscale-400">
        <div className="pb-8 mb-8 border-b-2 border-b-grayscale-200">
          <h2 className="flex text-sm text-grayscale-500 mb-2.5">
            비밀번호 변경
          </h2>
          <form onSubmit={handlePasswordChange}>
            <div className="flex flex-col gap-2">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="기존 비밀번호"
                className="border-none px-4 bg-gray-100 rounded-lg placeholder:text-[14px]"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="새 비밀번호"
                className="border-none px-4 bg-gray-100 rounded-lg placeholder:text-[14px]"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="새 비밀번호 확인"
                className="border-none px-4 bg-gray-100 rounded-lg placeholder:text-[14px]"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="mt-4 text-gray-100 bg-green-200 py-2 px-5 rounded-xl"
                type="submit"
              >
                변경하기
              </button>
            </div>
          </form>
        </div>

        <h2 className="text-sm text-grayscale-500 mb-2.5 ">위키 생성하기</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 ">
            <input
              type="text"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
              placeholder="질문을 입력해 주세요"
              className="w-[25rem] px-4 border-none bg-gray-100 rounded-lg placeholder:text-[14px]"
            />
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
              placeholder="답을 입력해 주세요"
              className="w-[25rem] px-4 border-none bg-gray-100 rounded-lg placeholder:text-[14px]"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="mt-4 text-gray-100 bg-green-200 py-2 px-5 rounded-xl"
              type="submit"
            >
              생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
