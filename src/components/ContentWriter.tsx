import { useEffect, useState } from "react";
import Bold from "/public/assets/Icons/BoldIcon.svg";
import Italic from "/public/assets/Icons/ItalicIcon.svg";
import UnderLineIcon from "/public/assets/Icons/UnderlineIcon.svg";
import AlignIcon_left from "/public/assets/Icons/Alignment_left.svg";
import AlignIcon_center from "/public/assets/Icons/AlignIcon_center.svg";
import Alignment_right from "/public/assets/Icons/Alignment_right.svg";
import BulletIcon from "/public/assets/Icons/BulletIcon.svg";
import NumberIcon from "/public/assets/Icons/NumberIcon.svg";
import Font from "/public/assets/Icons/Font.svg";
import ImageIcon from "/public/assets/Icons/ImageIcon.svg";
import LinkIcon from "/public/assets/Icons/LinkIcon.svg";

const ContentWriter = () => {
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 30;
  const [fullCharCount, setFullCharCount] = useState(0);
  const [nonSpaceCharCount, setNonSpaceCharCount] = useState(0);

  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentCount = event.target.value.length;
    if (currentCount <= maxCharCount) {
      setCharCount(currentCount);
    }
  };

  const charCountClass =
    charCount >= maxCharCount ? "text-green-300" : "text-grayscale-500";

  const handleEditorInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;
    setFullCharCount(inputValue.length);

    const nonSpaceInput = inputValue.replace(/\s/g, "");
    setNonSpaceCharCount(nonSpaceInput.length);
  };

  return (
    <form>
      <div className="shadow-md max-w-screen-lg px-8 pt-12 pb-8">
        <div className="flex justify-between">
          <h2 className="mb-6 text-2xl font-bold text-grayscale-500">
            게시물 등록하기
          </h2>
          <button
            type="submit"
            className="w-36 h-11 mt-0 text-grayscale-50 bg-grayscale-300 rounded-lg hover:bg-green-200"
          >
            등록하기
          </button>
        </div>
        <div className="whitespace-nowrap text-gray-400 mb-8">
          등록일 2024.02.24.
        </div>
        <hr />

        <div className="flex items-center justify-between ">
          <input
            type="text"
            className="flex items-center h-14 text-xl outline-none border-none w-3/5 p-0 text-grayscale-600 placeholder-gray-400 focus:outline-none"
            placeholder="제목을 입력해주세요"
            maxLength={maxCharCount}
            onChange={handleTitleInputChange}
            required
          />
          <div className="flex whitespace-nowrap">
            <p className={charCountClass}>{charCount}/</p>
            <p className="text-green-300">{maxCharCount}</p>
          </div>
        </div>
        <hr />
        <div className="text-grayscale-600 mt-5 mb-3 text-base">
          공백포함 : 총 {fullCharCount}자 | 공백제외 : 총 {nonSpaceCharCount}자
        </div>
        <div className="w-full dark:bg-gray-700 dark:border-gray-600">
          <div className="">
            <label htmlFor="editor" className="sr-only">
              Publish post
            </label>
            <textarea
              id="editor"
              rows={8}
              className="block w-full px-0 text-xl p-0 text-grayscale-600 bg-white border-0 dark:bg-gray-800 placeholder:text-grayscale-300 focus:ring-0 dark:text-white dark:placeholder-gray-400"
              placeholder="본문을 입력해주세요"
              required
              onChange={handleEditorInputChange}
            ></textarea>
          </div>

          <div className="shadow-sm h-11 flex items-center justify-between border-2 border-slate-50 rounded-3xl dark:border-gray-600 pl-4 pr-4 pt-2 pb-2">
            <div className="flex gap-4 items-center justify-between dark:divide-gray-600">
              <div className="gap-1 flex items-center justify-between">
                <button
                  type="button"
                  className="rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <Bold aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </Bold>
                  <span className="sr-only">Bold</span>
                </button>
                <button
                  type="button"
                  className="rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <Italic aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </Italic>
                  <span className="sr-only">Italic</span>
                </button>
                <button
                  type="button"
                  className="rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <UnderLineIcon aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </UnderLineIcon>
                  <span className="sr-only">UnderLineIcon</span>
                </button>
              </div>
              <div className="gap-1 flex items-center justify-between">
                <button
                  type="button"
                  className="text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <AlignIcon_left aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </AlignIcon_left>
                  <span className="sr-only">AlignIcon_left</span>
                </button>
                <button
                  type="button"
                  className="text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <AlignIcon_center aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </AlignIcon_center>
                  <span className="sr-only">AlignIcon_center</span>
                </button>
                <button
                  type="button"
                  className="text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <Alignment_right aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </Alignment_right>
                  <span className="sr-only">Alignment_right</span>
                </button>
              </div>
              <div className="gap-1 flex items-center justify-between">
                <button
                  type="button"
                  className="rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <BulletIcon aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </BulletIcon>
                  <span className="sr-only">BulletIcon</span>
                </button>
                <button
                  type="button"
                  className="rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <NumberIcon aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </NumberIcon>
                  <span className="sr-only">NumberIcon</span>
                </button>
                <button
                  type="button"
                  className="rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <Font aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </Font>
                  <span className="sr-only">Font</span>
                </button>
                <button
                  type="button"
                  className="rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <ImageIcon aria-hidden="true" fill="currentColor">
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </ImageIcon>
                  <span className="sr-only">ImageIcon</span>
                </button>
              </div>
            </div>
            <button
              className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center"
              type="button"
            >
              <LinkIcon />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContentWriter;
