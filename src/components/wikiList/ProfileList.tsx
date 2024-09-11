import { ProfileSummary } from "@/types/wiki";
import Image from "next/image";
import defaultimage from "/public/assets/image/defaultImage.png";
import LinkIcon from "/public/assets/Icons/LinkIcon.svg";
import { useEffect, useState } from "react";
import Snackbar from "../wiki/Snackbar";
import CheckIcon from "/public/assets/Icons/CheckIcon.svg";
import clsx from "clsx";
import { useRouter } from "next/router";

interface ProfileSummaryList {
  wikiItemList: ProfileSummary[];
  className?: string;
}

const ProfileList = ({ wikiItemList, className = "" }: ProfileSummaryList) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [copiedBadgeURL, setCopiedBadgeURL] = useState("");
  const router = useRouter();

  const handleOpenSnackbar = () => {
    setIsSnackbarOpen(true);
  };
  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const handleCopyBadgeURL = (badgeURL: string) => {
    navigator.clipboard
      .writeText(badgeURL)
      .then(() => {
        setCopiedBadgeURL(badgeURL);
        handleOpenSnackbar();
      })
      .catch((err) => {
        console.error("URL 복사 실패:", err);
      });
  };

  const handleClick = async (Item: ProfileSummary) => {
    try {
      await router.push(`/wiki/${Item.code}`);
    } catch (error) {
      console.error("페이지 이동간 오류", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Snackbar
        message={
          <>
            <div className="flex gap-2">
              <CheckIcon />
              위키 링크가 복사되었습니다.
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
      <ul>
        {wikiItemList.map((Item) => {
          const badgeURL = `${window.location.origin}/profiles/${Item.code}`;
          return (
            <li key={Item.id}>
              <div className="relative">
                <button
                  onClick={() => handleClick(Item)}
                  className="w-[55rem] h-36 px-9 py-6 flex bg-gray-50 drop-shadow-lg mb-6 justify-between"
                >
                  <div className="flex gap-8">
                    <div className="relative w-[95px] h-[95px]">
                      <Image
                        className="rounded-full"
                        src={Item.image || defaultimage}
                        alt="프로필 이미지"
                        fill
                        sizes="(max-width: 768px) 100vw"
                        priority
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-gray-500 mb-3.5 text-2xl font-semibold">
                        {Item.name}
                      </span>
                      <span className="text-gray-400 text-sm flex items-start">
                        {Item.city}, {Item.nationality}
                      </span>
                      <span className="text-gray-400 text-sm flex items-start">
                        {Item.job}
                      </span>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleCopyBadgeURL(badgeURL)}
                  className="bg-green-100 text-green-200 font-normal text-xs px-2.5 py-1.5 rounded-xl h-10 absolute right-7 bottom-7"
                >
                  <LinkIcon className="inline" />
                  <span className="">{Item.code}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProfileList;
