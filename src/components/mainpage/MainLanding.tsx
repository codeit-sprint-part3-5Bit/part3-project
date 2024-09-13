import Link from "next/link";
import Profile from "/public/assets/image/Lending_Profile.png";
import HandOnKeybord from "/public/assets/image/Lending_HandOnKeybord.png";
import Content from "/public/assets/image/Lending_Content.png";
import SpeechBubble from "/public/assets/image/Lendinf_SpeechBubble.png";
import ContentPage from "/public/assets/image/Lending_ContentPage.png";
import Roudspeaker from "/public/assets/image/Lending_Roudspeaker.png";
import GreenW from "/public/assets/image/Lending_Logo.png";
import Phone from "/public/assets/image/Lendinf_Phone.png";
import Bell from "/public/assets/image/Lending_bell.png";
import LetSee from "/public/assets/image/Lending_LetSee.png";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";

interface Profile {
  id: number;
  code: string;
  image: string | null;
  city: string;
  nationality: string;
  job: string;
  updatedAt: string;
  name: string;
}

const MainLanding = () => {
  const router = useRouter();

  const checkUserStatus = async () => {
    let accessTocken = localStorage.getItem("accessToken");

    if (!accessTocken) {
      router.push("/login");
      return;
    }

    try {
      // API 호출을 통해 계정 설정 상태 확인
      const res = await axios.get(
        "https://wikied-api.vercel.app/8-2/users/me",
        {
          headers: {
            Authorization: `Bearer ${accessTocken}`,
          },
        }
      );

      // 지금 리스트에서 3개의 프로필 code 를 가져오고 있어서 제대로 위키 페이지로 넘어가지 못하고 있음...

      const codes = res.data.profile;

      if (!codes || codes.length === 0) {
        router.push("/AccountSet");
      } else {
        router.push(`wiki/${codes.code}`);
      }
    } catch (error) {
      console.error("데이터 가져오는데 에러", error);
      router.push("/login");
    }
  };

  return (
    <>
      <div className="w-full h-full min-h-screen bg-[#f1f4fd] flex justify-center items-center">
        <div className="w-[2000px] h-[5385px] relative bg-[#f1f4fd] overflow-hidden">
          <div className="w-[2000px] h-[1412px] left-[-40px] top-[793px] absolute">
            <div className="w-[2000px] h-[1211px] left-[40px] top-[201px] absolute bg-[#474d66]" />
            <div
              className="w-[2145px] h-[400px] left-[-100px] top-0 absolute bg-[#474d66]"
              style={{ borderRadius: "100%/80%" }}
            />
          </div>
          <div className="w-full h-[1291px] left-0 top-[3256px] absolute bg-[#ecf0fa]" />
          <button onClick={checkUserStatus}>
            <div
              className="px-[30px] py-[15px] absolute bg-[#474d66] rounded-[15px] justify-center items-center gap-2.5 inline-flex"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: "428px",
              }}
            >
              <div className="text-center text-white text-2xl font-bold font-['NanumGothic']">
                위키 만들기
              </div>
            </div>
          </button>
          <div
            className="absolute flex-col justify-start items-center gap-[15px] inline-flex"
            style={{ left: "50%", transform: "translateX(-50%)", top: "200px" }}
          >
            <div className="text-center text-[#474d66] text-6xl font-light font-['Open Sans']">
              남들이 만드는
            </div>
            <div className="text-center text-[#474d66] text-[90px] font-bold font-['Open Sans']">
              나만의 위키
            </div>
          </div>
          <div className="left-[25rem] top-[1379px] absolute text-white text-[50px] font-normal font-['Open Sans']">
            친구의 위키,
            <br />
            직접 작성해 봐요
          </div>
          <div className="left-[56rem] top-[2460px] absolute text-right text-[#474d66] text-[50px] font-normal font-['Open Sans']">
            내 위키 만들고
            <br />
            친구에게 공유해요
          </div>
          <div className="left-[25rem] top-[1324px] absolute text-[#4cbfa3] text-3xl font-bold font-['Open Sans']">
            WRITE
          </div>
          <div className="left-[72.5rem] top-[2405px] absolute text-right text-[#4cbfa3] text-3xl font-bold font-['Open Sans']">
            SHARE
          </div>
          <div className="left-[25rem] top-[3511px] absolute text-[#474d66] text-[50px] font-normal font-['Open Sans']">
            친구들이 달아준
            <br />
            내용을 확인해 봐요
          </div>
          <div className="left-[25rem] top-[3456px] absolute text-[#4cbfa3] text-3xl font-bold font-['Open Sans']">
            VIEW
          </div>
          <div className="w-full h-[568px] left-0 top-[4547px] absolute bg-[#474d66]" />
          <div className="w-full h-[270px] left-0 top-[5115px] absolute bg-[#3b415b]" />
          <Link href="#">
            <div className="px-[30px] py-[15px] left-[48rem] top-[4856px] absolute bg-white rounded-[15px] justify-center items-center gap-2.5 inline-flex">
              <div className="text-center text-[#474d66] text-2xl font-bold font-['NanumGothic']">
                지금 시작하기
              </div>
            </div>
          </Link>
          <div className="left-[37rem] top-[4747px] absolute text-center text-white text-6xl font-bold font-['Open Sans']">
            나만의 위키 만들어 보기
          </div>
          <div className="w-[530px] h-[107px] left-[80px] top-[5195px] absolute">
            <div className="left-0 top-0 absolute text-white text-base font-bold font-['NanumGothic']">
              Copyright ⓒ Wikied. All Rights Reserved
            </div>
            <div className="left-0 top-[29px] absolute text-white text-sm font-normal font-['NanumGothic']">
              사업자등록번호 000-00-00000 | 통신판매신고 제2020-서울-00000호 |
              대표 : 이지은
              <br />
              서울특별시 중구 청계천로 123, 위키드빌딩
            </div>
            <div className="left-0 top-[93px] absolute text-white text-sm font-normal font-['NanumGothic']">
              서비스 이용약관
            </div>
            <div className="left-[119px] top-[93px] absolute text-white text-sm font-normal font-['NanumGothic']">
              개인정보 취급방침
            </div>
            <div className="left-[250px] top-[93px] absolute text-white text-sm font-normal font-['NanumGothic']">
              전자금융거래 기본약관
            </div>
          </div>
          <div className="left-[-295px] top-[2696px] absolute justify-start items-start gap-[70px] inline-flex">
            <div className="w-[360px] h-[360px] relative bg-[#dee5f5] rounded-[25px]" />
            <div className="w-[360px] h-[360px] bg-[#b2a5fd] rounded-[25px] justify-center items-center flex">
              <div className="grow shrink basis-0 self-stretch justify-center items-center inline-flex">
                <Image
                  alt="스피커"
                  src={Roudspeaker}
                  width={360}
                  height={360}
                />
              </div>
            </div>
            <div className="w-[360px] h-[360px] bg-[#acecdd] rounded-[25px] justify-center items-center flex">
              <div className="grow shrink basis-0 self-stretch justify-center items-center inline-flex">
                <Image alt="로고" src={GreenW} width={360} height={360} />
              </div>
            </div>
            <div className="w-[360px] h-[360px] bg-[#dee5f5] rounded-[25px] justify-center items-center flex">
              <div className="grow shrink basis-0 self-stretch justify-center items-center inline-flex">
                <Image alt="폰" src={Phone} width={360} height={360} />
              </div>
            </div>
            <div className="w-[360px] h-[360px] bg-[#dee5f5] rounded-[25px] justify-center items-center flex">
              <div className="grow shrink basis-0 self-stretch justify-center items-center inline-flex">
                <Image
                  alt="말풍선들"
                  src={SpeechBubble}
                  width={360}
                  height={360}
                />
              </div>
            </div>
            <div className="w-[360px] h-[360px] relative bg-[#dee5f5] rounded-[25px]" />
          </div>
          <div className="w-[604px] h-[280px] left-[45rem] top-[4067px] absolute justify-center items-center inline-flex">
            <Image alt="Letsee" src={LetSee} width={604} height={280} />
          </div>
          <div className="w-[924px] h-[280px] left-[25rem] top-[3747px] absolute justify-center items-center inline-flex">
            <Image alt="Content" src={Content} width={924} height={280} />
          </div>
          <div className="w-[280px] h-[280px] left-[25rem] top-[4067px] absolute">
            <div className="w-[280px] h-[280px] left-0 top-0 absolute bg-[#8d65ff] rounded-[20px]" />
            <div className="w-[280px] h-[280px] left-0 top-0 absolute justify-center items-center inline-flex">
              <Image alt="벨" src={Bell} width={280} height={280} />
            </div>
          </div>
          <div className="w-[520px] h-[681px] left-[50rem] top-[1324px] absolute flex-col justify-center items-center inline-flex">
            <Image
              alt="contentpage"
              src={ContentPage}
              width={520}
              height={681}
            />
          </div>
          <div className="w-[364px] h-[450px] left-[25rem] top-[1555px] absolute">
            <div className="w-[364px] h-[450px] left-0 top-0 absolute bg-[#4cbfa3] rounded-[20px]" />
            <div className="w-[310px] h-[450px] left-0 top-0 absolute flex-col justify-center items-center inline-flex">
              <Image
                alt="키보드"
                src={HandOnKeybord}
                width={310}
                height={450}
              />
            </div>
          </div>
          <div
            className="w-[22rem] h-[590px] absolute flex-col justify-center items-center inline-flex"
            style={{ left: "50%", transform: "translateX(-50%)", top: "541px" }}
          >
            <Image alt="프로필" src={Profile} width={498} height={590} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLanding;
