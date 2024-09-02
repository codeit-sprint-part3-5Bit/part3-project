import QuizModal from "@/components/wiki/QuizModal";
import { useEffect } from "react";
import Image from "next/image";
import useBadgeStore from "../../../store/Zustand/badgeStore";
import LinkIcon from "../../../public/assets/Icons/LinkIcon.svg";

const WikiPage = () => {
  const { badgeURL, setBadgeURL } = useBadgeStore();

  useEffect(() => {
    setBadgeURL(window.location.href);
  }, []);

  const profileData = [
    { label: "거주도시", value: "서울" },
    { label: "MBTI", value: "INFJ" },
    { label: "직업", value: "코드잇 콘텐츠 프로듀서" },
    { label: "SNS 계정", value: "dlwleje-ofoij" },
    { label: "생일", value: "1999-12-31" },
    { label: "별명", value: "없음" },
    { label: "혈액형", value: "A" },
    { label: "국적", value: "대한민국" },
  ];

  return (
    <>
      <header>
        <div>~~~~~~~~~~~~~~~~~~~~~~헤더 부분~~~~~~~~~~~~~~~~</div>
      </header>
      <div className="flex justify-center mt-[5.6rem]">
        <main className="flex gap-[7.5rem]">
          <article className="mt-[5.6rem]">
            <h1 className="text-5xl font-semibold mb-8">이지동</h1>
            <a
              href={badgeURL}
              className="bg-green-100 text-green-200 font-normal text-xs px-2.5 py-1.5 rounded-xl"
            >
              <LinkIcon className="inline" />
              {badgeURL}
            </a>
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
                question="안녕"
                answer="1"
              />
            </div>
          </article>

          <section className="mt-[3.1rem]">
            <div className="p-12 w-80 h-[42rem] bg-grayscale-50 drop-shadow-2xl ">
              <Image
                src={"#"}
                alt="프로필 이미지"
                className="mb-[3.7rem] w-[12.5rem] h-[12.5rem] m-auto rounded-full"
              />

              <div className="grid gap-3">
                {profileData.map((item, index) => (
                  <div key={index} className="grid grid-cols-[80px_auto] ">
                    <div className=" font-medium text-sm text-grayscale-400">
                      {item.label}
                    </div>
                    <div className="font-normal text-sm text-grayscale-500">
                      {item.value}
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
};

export default WikiPage;
