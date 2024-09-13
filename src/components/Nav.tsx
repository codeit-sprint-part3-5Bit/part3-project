import Link from "next/link";
import Logo from "/public/assets/image/Lendinf_GreenW.svg";
import AlarmIcon from "/public/assets/Icons/AlarmIcon_small.svg";
import Profile from "/public/assets/Icons/ProfileIcon.svg";
import { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import { useRouter } from "next/router";
import { useAuth } from "@/components/context/AuthContext";

const Nav = () => {
  const { accessToken, setAccessToken } = useAuth();
  const router = useRouter();

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
              <AlarmIcon />
            </div>
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <div className="cursor-pointer">
                  <Profile />
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
