import QuizModal from "@/components/wiki/QuizModal";
import { useEffect, useState } from "react";
import prfileImage from "../../../public/assets/image/photo_2021-06-15_00-50-22.jpg";
import Image from "next/image";

const WikiPage = () => {
  const [badgeURL, setBadgeURL] = useState("");

  useEffect(() => {
    setBadgeURL(window.location.href);
  }, []);

  return (
    <>
      <header>
        <div>~~~~~~~~~~~~~~~~~~~~~~헤더 부분~~~~~~~~~~~~~~~~</div>
      </header>
      <div className="flex justify-center">
        <main className="flex gap-[7.5rem]">
          <article className="mt-[5.6rem]">
            <h1 className="text-5xl font-semibold mb-8">이지동</h1>
            <a
              href={badgeURL}
              className="bg-green-100 text-green-200 font-normal text-xs px-2.5 py-0.5 rounded-xl"
            >
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
                src={prfileImage}
                alt="프로필 이미지"
                className="mb-[3.7rem] w-[12.5rem] h-[12.5rem] m-auto rounded-full"
              />

              <div className="grid grid-cols-2 gap-3">
                <span>거주도시</span>
                <span>{"서울"}</span>
                <span>MBTI</span>
                <span>{"INFJ"}</span>
                <span>직업</span>
                <span>{"코드잇 콘텐츠 프로듀서"}</span>
                <span>SNS 계정</span>
                <span>{"dlwleje-ofoij"}</span>
                <span>생일</span>
                <span>{"1999-12-31"}</span>
                <span>별명</span>
                <span>{"없음"}</span>
                <span>혈액형</span>
                <span>{"A"}</span>
                <span>국적</span>
                <span>{"대한민국"}</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default WikiPage;
