import React, { useState } from "react";

interface OriginalProfileProps {
  attributeName: string; //사용자에게 보여지는 속성의 이름
  value: string; //속성의 현재 값
  name: string; //속성의 데이터 키
  isEditable: boolean; //속성의 편집 가능 여부
  isCurrentUser?: boolean; //현재 사용자인지 여부 (주로 편집 가능 여부를 결정)
  onChange?: (name: string, value: string) => void; //값이 변경될 시 호출되는 콜백 함수
  className?: string; //추가적인 클래스 이름
}

//사용자 프로필 개별 속성 표시 및 편집 기능
const OriginalProfile = ({
  attributeName,
  value,
  name,
  isEditable = false,
  isCurrentUser,
  onChange,
  className,
}: OriginalProfileProps) => {
  const [attributeValue, setAttributeValue] = useState(value); //초기값: value prop

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAttributeValue(newValue);
    if (onChange) {
      onChange(name, newValue);
    }
  };

  return (
    <div className={`flex items-center ${className} mb-1`}>
      <span className="text-gray-600 text-sm font-medium mr-4">
        {attributeName}
      </span>
      {isEditable && isCurrentUser ? (
        <input
          className={`bg-gray-100 rounded-lg p-3 text-sm border-none outline-none ${
            isEditable ? "" : "cursor-not-allowed"
          }`}
          value={attributeValue}
          onChange={handleChange}
        />
      ) : (
        <span className="text-gray-500 text-sm">{value}</span>
      )}
    </div>
  );
};

export default OriginalProfile;
