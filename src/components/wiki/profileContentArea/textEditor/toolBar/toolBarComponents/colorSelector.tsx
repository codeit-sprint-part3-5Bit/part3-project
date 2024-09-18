import { useState } from "react";
import ColoringIcon from "/public/assets/Icons/coloringIcon.svg";
import { EditorState } from "draft-js";
import { RichUtils } from "draft-js";
import clsx from "clsx";

interface ColorSelectorProps {
  editorState: EditorState;
  onEditorChange: (editorState: EditorState) => void;
  className?: string;
}

const colorList = [
  { name: "RED", color: "#FF0000" },
  { name: "ORANGE", color: "#FFA500" },
  { name: "YELLOW", color: "#FFFF00" },
  { name: "GREEN", color: "#008000" },
  { name: "BLUE", color: "#0000FF" },
  { name: "PURPLE", color: "#800080" },
  { name: "BLACK", color: "#000000" },
];

const ColorSelector: React.FC<ColorSelectorProps> = ({
  editorState,
  onEditorChange,
  className = "",
}) => {
  const [showSelector, setShowSelector] = useState(false); //사용자가 색상 팔레트를 표시할지 여부 결정
  const [selectedColor, setSelectedColor] = useState<string | null>(null); //팔레트에서 선택된 색상 저장

  const handleToggleColor = (colorStyle: string) => {
    let newState = editorState;

    //RichUtils.toggleInlineStyle 메서드는 주어진 스타일을 활성화하거나 비활성화하는 기능을 제공
    //selectedColor 상태에 현재 활성화된 색상이 있다면, 새로운 색상 선택 전 기존 색상 제거
    if (selectedColor) {
      newState = RichUtils.toggleInlineStyle(newState, selectedColor);
    }

    newState = RichUtils.toggleInlineStyle(newState, colorStyle);

    onEditorChange(newState); //새로운 상태 부모 컴포넌트로 전달
    setSelectedColor(colorStyle); //현재 활성화된 색상 업데이트
  };

  return (
    <div className="relative">
      <button //색상 팔레트 표시 또는 숨기는 역할
        className="w-6 h-6 border-none bg-transparent cursor-pointer p-0 hover:opacity-80"
        onClick={() => setShowSelector(!showSelector)}
      >
        <ColoringIcon alt="Color" width={24} height={24} />
      </button>
      {showSelector && (
        <div className="absolute top-full left-0 flex gap-1 bg-white p-1 rounded shadow-md z-50">
          {colorList.map((color) => (
            <button
              key={color.name}
              onClick={() => handleToggleColor(color.name)}
              className={clsx(
                "w-6 h-6 rounded-full p-0 cursor-pointer relative hover:opacity-80 transition-transform transform",
                selectedColor === color.name && "scale-110"
              )}
              style={{ backgroundColor: color.color }}
            >
              {selectedColor === color.name && (
                <span className="absolute inset-0 m-auto block w-2.5 h-2.5 rounded-full bg-white"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
export { colorList };
