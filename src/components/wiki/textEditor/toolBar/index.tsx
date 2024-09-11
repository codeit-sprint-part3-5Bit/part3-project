import { EditorState, RichUtils } from "draft-js";
import {
  isTextLeftAligned,
  isTextCenterAligned,
  isTextRightAligned,
} from "contenido";
import BoldIcon from "/public/assets/Icons/BoldIcon.svg";
import ItalicIcon from "/public/assets/Icons/italicIcon.svg";
import UnderlineIcon from "/public/assets/Icons/UnderlineIcon.svg";
import AlignLeft from "/public/assets/Icons/Alignment_left.svg";
import AlignCenter from "/public/assets/Icons/AlignIcon_center.svg";
import AlignRight from "/public/assets/Icons/Alignment_right.svg";
import ListBulletIcon from "/public/assets/Icons/BulletIcon.svg";
import ListNumberIcon from "/public/assets/Icons/NumberIcon.svg";
import LinkIcon from "/public/assets/Icons/LinkIcon.svg";
import ImageIcon from "/public/assets/Icons/ImageIcon.svg";
import ColorSelector from "@/components/wiki/textEditor/toolBar/toolBarComponents/colorSelector";
import HeadingDropdown from "@/components/wiki/textEditor/toolBar/toolBarComponents/headingDropdown";
import { ProfileDetail } from "@/types/wiki";

interface ToolBarProps {
  editorState: EditorState; //draft-js 에디터의 현재 상태
  onEditorChange: (editorState: EditorState) => void; //에디터 상태가 변경될 때 호출되는 함수
  onImageUpload: () => void; //이미지를 업로드할 때 호출되는 함수
  profile: ProfileDetail; //사용자의 프로필 정보를 포함하는 객체
}

const ToolBar = ({
  editorState,
  onEditorChange,
  onImageUpload,
  profile,
}: ToolBarProps) => {
  const toggleInlineStyle = (style: string) => {
    onEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    console.log("블록 타입 변경:", blockType);
    onEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleToggleAlign = (alignment: string) => {
    onEditorChange(
      RichUtils.toggleBlockType(editorState, `text-align-${alignment}`)
    );
  };

  const getHeadingType = (blockType: string) => {
    switch (blockType) {
      case "header-one":
        return "제목 1";
      case "header-two":
        return "제목 2";
      case "header-three":
        return "제목 3";
      default:
        return "제목";
    }
  };

  //현재 에디터에서 선택된 블록의 타입을 가져옴
  //editorState를 받아서, 현재 선택된 블록(단락, 제목, 리스트)의 타입을 문자열로 반환
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  const selectedHeading = getHeadingType(currentBlockType);

  return (
    <div className="toolbar flex items-center bg-gray-100 rounded-lg py-4 px-0">
      <div className="user-name-container flex-shrink-0 ml-4 mr-4">
        <span className="user-name text-xl leading-xl font-medium text-gray-500 truncate hidden md:block">
          {profile.name}
        </span>
      </div>
      <div className="left-buttons flex items-center justify-center flex-grow">
        <div className="button-wrapper flex gap-2 px-2 border-r border-gray-300 last:border-r-0">
          <button
            onClick={() => toggleInlineStyle("BOLD")}
            className="flex items-center justify-center w-6 h-6 rounded-md p-0 hover:bg-gray-200"
          >
            <BoldIcon alt="Bold" width={24} height={24} />
          </button>
          <button
            onClick={() => toggleInlineStyle("ITALIC")}
            className="flex items-center justify-center w-6 h-6 rounded-md p-0 hover:bg-gray-200"
          >
            <ItalicIcon alt="Italic" width={24} height={24} />
          </button>
          <button
            onClick={() => toggleInlineStyle("UNDERLINE")}
            className="flex items-center justify-center w-6 h-6 rounded-md p-0 hover:bg-gray-200"
          >
            <UnderlineIcon alt="Underline" width={24} height={24} />
          </button>
        </div>
        <div className="button-wrapper flex gap-2 px-2 border-r border-gray-300 last:border-r-0">
          <div className="heading flex items-center justify-center w-20 h-auto hover:bg-gray-200">
            <HeadingDropdown
              onHeadingSelect={toggleBlockType}
              selectedHeading={selectedHeading}
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleToggleAlign("left");
            }}
            className={`align-button flex items-center justify-center w-6 h-6 rounded-md p-0 ${
              isTextLeftAligned(editorState) ? "bg-gray-200" : ""
            }`}
          >
            <AlignLeft alt="왼쪽 정렬" width={24} height={24} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleToggleAlign("center");
            }}
            className={`align-button flex items-center justify-center w-6 h-6 rounded-md p-0 ${
              isTextCenterAligned(editorState) ? "bg-gray-200" : ""
            }`}
          >
            <AlignCenter alt="중앙 정렬" width={24} height={24} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleToggleAlign("right");
            }}
            className={`align-button flex items-center justify-center w-6 h-6 rounded-md p-0 ${
              isTextRightAligned(editorState) ? "bg-gray-200" : ""
            }`}
          >
            <AlignRight alt="오른쪽 정렬" width={24} height={24} />
          </button>
        </div>
        <div className="button-wrapper flex gap-2 px-2 border-r border-gray-300 last:border-r-0">
          <button
            onClick={() => toggleBlockType("unordered-list-item")}
            className="bullet-button flex items-center justify-center w-6 h-6 rounded-md p-0 hover:bg-gray-200"
          >
            <ListBulletIcon alt="불릿 정렬" width={24} height={24} />
          </button>
          <button
            onClick={() => toggleBlockType("ordered-list-item")}
            className="number-button flex items-center justify-center w-6 h-6 rounded-md p-0 hover:bg-gray-200"
          >
            <ListNumberIcon alt="숫자 정렬" width={24} height={24} />
          </button>
          <ColorSelector
            editorState={editorState}
            onEditorChange={onEditorChange}
            className="color-palette-button flex items-center justify-center w-6 h-6 rounded-md p-0 hover:bg-gray-200"
          />
          <button
            onClick={onImageUpload}
            className="flex items-center justify-center w-6 h-6 rounded-md p-0 hover:bg-gray-200"
          >
            <ImageIcon alt="Image" width={24} height={24} />
          </button>
          {/* 링크 삽입 기능 추가 예정 */}
          <button className="link-button flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full p-0">
            <LinkIcon alt="Link" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
