import Link from "next/link";
import Logo from "../../public/assets/Image/Logo.svg";
import Image from "next/image";
import AlarmIcon from "../../public/assets/Icons/AlarmIcon_small.svg";
import Profile from "../../public/assets/Icons/ProfileIcon.svg";

const Nav = () => {
  return (
    <nav className="flex items-center justify-between h-16 shadow-md">
      <div className="flex items-center gap-10 ml-20 text-grayscale-500">
        <Link href="#" className="whitespace-nowrap flex items-center gap-1">
          <Image src={Logo} alt="로고" width={32} height={32} />
          <span className="ml-2 font-open-sans text-grayscale-300">Wikied</span>
        </Link>
        <Link href="#">위키목록</Link>
        <Link href="#">자유게시판</Link>
      </div>
      <div className="flex items-center gap-10 mr-20">
        <Link href="#">
          <AlarmIcon />
        </Link>
        <Link href="#">
          <Profile />
        </Link>
        <Link href="#" className=" text-grayscale-500">
          로그인
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
