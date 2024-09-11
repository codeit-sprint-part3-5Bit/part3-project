import { useState, useRef, ChangeEvent } from "react";
import { Button } from "flowbite-react";
import CameraIcon from "/public/assets/Icons/CameraIcon.svg";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload = ({ onImageUpload }: ImageUploadProps): JSX.Element => {
  //이미지 파일 미리보기 url을 저장, 선택 파일 없으면 null
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  //선택된 파일 저장, 파일 없으면 null
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  //파일 입력 엘리먼트 참조에 사용, 클릭 이벤트로 파일 입력을 트리거할 때 사용
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; //단일 이미지 처리 설계에 따름
    if (file) {
      setSelectedFile(file); //파일이 선택되면 본 함수를 호출, 선택된 파일을 selectedFile에 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = () => {
    if (selectedFile) {
      onImageUpload(selectedFile);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-5 relative">
        <label
          htmlFor="file-input"
          className="text-xl font-semibold text-gray-500"
        >
          이미지
        </label>
        <div
          className="w-[354px] h-[160px] bg-gray-100 rounded-lg cursor-pointer relative"
          onClick={handleInputClick}
        >
          <input
            id="file-input"
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            accept="image/*" //속성은 이미지 파일만 선택할 수 있도록 제한
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="미리보기"
              className="w-full h-full object-contain"
            />
          ) : (
            <CameraIcon
              className="absolute top-[45%] left-[46%]"
              alt="카메라"
              width={36}
              height={36}
            />
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-green-200 mt-5"
          size="sm"
          onClick={handleInsert}
          disabled={!selectedFile}
        >
          삽입하기
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
