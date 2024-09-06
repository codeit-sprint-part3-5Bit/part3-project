import QuizModal from "@/components/wiki/QuizModal";
import { useEffect, useState } from "react";
import Image from "next/image";
import LinkIcon from "/public/assets/Icons/LinkIcon.svg";
import { useRouter } from "next/router";
import authAxiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/types/wiki";
import Snackbar from "@/components/wiki/Snackbar";
import CheckIcon from "/public/assets/Icons/CheckIcon.svg";
import defaultimage from "/public/assets/image/defaultImage.png";
import clsx from "clsx";

const fetchUserData = async (code: string): Promise<Profile> => {
  const response = await authAxiosInstance.get(`/profiles/${code}`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("데이터 가져오기 실패");
  }
};

export default function WikiPage() {
  const [badgeURL, setBadgeURL] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const router = useRouter();
  const { code } = router.query;

  const handleOpenSnackbar = () => {
    setIsSnackbarOpen(true);
  };
  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  useEffect(() => {
    setBadgeURL(window.location.href);
  }, []);

  const handleCopyBadgeURL = () => {
    navigator.clipboard
      .writeText(badgeURL)
      .then(() => {
        handleOpenSnackbar();
      })
      .catch((err) => {
        console.error("URL 복사 실패:", err);
      });
  };

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery<Profile>({
    queryKey: ["userData", code],
    queryFn: () => fetchUserData(code as string),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-500 border-b-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const profileData = [
    { label: "거주도시", value: userData?.city },
    { label: "MBTI", value: userData?.mbti },
    { label: "직업", value: userData?.job },
    { label: "SNS 계정", value: userData?.sns },
    { label: "생일", value: userData?.birthday },
    { label: "별명", value: userData?.nickname },
    { label: "혈액형", value: userData?.bloodType },
    { label: "국적", value: userData?.nationality },
  ];

  return (
    <>
      <div className="flex justify-center mt-[4.8rem]">
        <main className="flex w-[1260px] justify-between">
          <article className="mt-[5.6rem] w-[52rem]">
            <div className="flex justify-between ">
              <h1 className="text-5xl text-grayscale-500 font-semibold mb-8">
                {userData?.nickname || "사용자 이름"}
              </h1>
              <div className="flex justify-end">
                {userData?.content && (
                  <QuizModal
                    quizButtonText="위키 참여하기"
                    buttonWidth="w-40"
                    buttonHigth="h-11"
                    question="안녕"
                    answer="1"
                  />
                )}
              </div>
            </div>
            <button
              onClick={handleCopyBadgeURL}
              className="bg-green-100 text-green-200 font-normal text-xs px-2.5 py-1.5 rounded-xl"
            >
              <LinkIcon className="inline" />
              {badgeURL}
            </button>
            <Snackbar
              message={
                <>
                  <div className="flex gap-2">
                    <CheckIcon />내 위키 링크가 복사되었습니다.
                  </div>
                </>
              }
              isOpen={isSnackbarOpen}
              onClose={handleCloseSnackbar}
              duration={3000}
              className={clsx(
                `fixed top-20 left-1/2 transform -translate-x-1/2 font-semibold text-sm bg-green-100 text-green-300 px-5 py-3 rounded-xl shadow-lg border border-green-200 transition-transform duration-300 ease-in-out`,
                {
                  "translate-y-5 opacity-100": isSnackbarOpen,
                  "translate-y-0 opacity-0": !isSnackbarOpen,
                }
              )}
            />
            {!userData?.content ? (
              <div className="bg-grayscale-100 flex flex-col justify-center items-center w-[54rem] h-48 rounded-lg mt-[3.5rem]">
                <p className="text-grayscale-400 text-lg">
                  아직 작성된 내용이 없네요
                </p>
                <p className="mb-4 text-grayscale-400 text-lg">
                  위키에 참여해보세요
                </p>
                <QuizModal
                  quizButtonText="시작하기"
                  buttonWidth="w-24"
                  buttonHigth="h-10"
                  question="안녕"
                  answer="1"
                />
              </div>
            ) : (
              <div className="mt-[3.5rem]">{userData?.content}</div>
            )}
          </article>

          <section className="mt-[3.1rem]">
            <div className="p-12 w-80 h-[42rem] bg-grayscale-50 drop-shadow-2xl ">
              <Image
                src={userData?.image || defaultimage}
                alt="프로필 이미지"
                className="mb-[3.7rem] w-[12.5rem] h-[12.5rem] m-auto rounded-full"
                priority={true}
                width={200}
                height={200}
              />

              <div className="grid gap-3">
                {profileData.map((item, index) => (
                  <div key={index} className="grid grid-cols-[80px_auto] ">
                    <div className=" font-medium text-sm text-grayscale-400">
                      {item.label}
                    </div>
                    <div className="font-normal text-sm text-grayscale-500">
                      {item.value || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
