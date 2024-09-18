import Link from "next/link";
import Logo from "/public/assets/image/Lendinf_GreenW.svg";
import Profile from "/public/assets/Icons/ProfileIcon.svg";
import { Dropdown } from "flowbite-react";
import { useRouter } from "next/router";
import { useAuth } from "@/components/context/AuthContext";
import AlarmMenu from "./AlarmMenu";
import { useCallback, useEffect, useState } from "react";
import { getProfileByCode, getUserInfo } from "@/apis/profile";

const Nav = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const { accessToken, setAccessToken } = useAuth();
  const router = useRouter();

  const fetchProfileData = useCallback(async () => {
    try {
      if (!accessToken) return; // accessToken이 없으면 아무 작업도 하지 않음
      // 1단계: 사용자 정보 가져오기
      const userInfoResponse = await getUserInfo();
      const code = userInfoResponse.data.profile.code;
      setCode(code);

      // 2단계: 프로필 이미지 가져오기
      const profileResponse = await getProfileByCode(code);
      const image = profileResponse.data.image;
      setProfileImage(image);
    } catch (err) {
      console.log(err);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    router.push("/login");
  };

  const handleMyWiki = () => {
    router.push("/AccountSet");
  };

  return (
    <nav className="flex items-center justify-between h-16 shadow-md">
      <div className="flex items-center gap-10 ml-20 text-grayscale-500">
        <Link href="/" className="whitespace-nowrap flex items-center gap-1">
          <Logo />
          <span className="ml-2 font-open-sans text-grayscale-300">Wikied</span>
        </Link>
        <Link href="/wikiList">위키목록</Link>
        <Link href="/board">자유게시판</Link>
      </div>
      <div className="flex items-center gap-10 mr-20">
        {accessToken ? (
          <>
            <div className="cursor-pointer">
              <AlarmMenu />
            </div>
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <div className="cursor-pointer">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <Profile />
                  )}
                </div>
              )}
            >
              <Dropdown.Item>계정 설정</Dropdown.Item>
              <Dropdown.Item onClick={handleMyWiki}>내 위키</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <Link href="/login" className=" text-grayscale-500">
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
