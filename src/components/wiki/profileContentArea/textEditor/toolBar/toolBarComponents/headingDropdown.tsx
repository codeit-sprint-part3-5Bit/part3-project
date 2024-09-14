import React, { useState } from "react";
import ArrowIcon from "/public/assets/Icons/ArrowIcon.svg";

interface HeadingDropdownProps {
  onHeadingSelect: (headingType: string) => void;
  selectedHeading: string;
}

const HeadingDropdown = ({
  onHeadingSelect,
  selectedHeading,
}: HeadingDropdownProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false); //드롭다운의 열림닫힘 상태 관리 및 제어

  const handleHeadingClick = (headingType: string) => {
    onHeadingSelect(headingType);
    setDropdownOpen(false);
  };

  return (
    <div className="dropdown-wrapper relative">
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="dropdown-button cursor-pointer bg-transparent border-0 p-0 flex items-center"
      >
        <span className="dropdown-title w-[80px] whitespace-nowrap flex items-center justify-center">
          {selectedHeading || "제목"}
          <ArrowIcon alt="Heading" width={24} height={24} />
        </span>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full w-[80px] p-1 bg-white border border-gray-300 rounded-md shadow-md z-50 flex flex-col gap-y-2 ">
          <button
            onClick={() => handleHeadingClick("header-one")}
            className="w-full ml-2 bg-transparent border-0 text-left cursor-pointer hover:bg-gray-100 py-1"
          >
            제목 1
          </button>
          <button
            onClick={() => handleHeadingClick("header-two")}
            className="w-full ml-2 bg-transparent border-0 text-left cursor-pointer hover:bg-gray-100 py-1"
          >
            제목 2
          </button>
          <button
            onClick={() => handleHeadingClick("header-three")}
            className="w-full ml-2 bg-transparent border-0 text-left cursor-pointer hover:bg-gray-100 py-1"
          >
            제목 3
          </button>
          <button
            onClick={() => handleHeadingClick("header-four")}
            className="w-full ml-2 bg-transparent border-0 text-left cursor-pointer hover:bg-gray-100 py-1"
          >
            기본값
          </button>
        </div>
      )}
    </div>
  );
};

export default HeadingDropdown;
