import CloseIcon from "/public/assets/Icons/closeicon.svg";
import { useCallback } from "react";

interface ImageUploadWrapProps {
  contents: React.FC;
  onClose?: () => void;
}

const ImageUploadWrap = ({
  contents: Contents,
  onClose,
}: ImageUploadWrapProps): JSX.Element => {
  const closeImageUpload = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  //모달 바깥 영역 클릭 시 모달 닫히도록 하는 함수
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    //e.currentTarget은 이벤트 리스너가 부착된 요소, 따라서 오버레이 div에 이벤트 리스너를 부착해야 함
    if (e.target === e.currentTarget) {
      closeImageUpload();
    }
  };

  return (
    <div
      className="fixed inset-0 z-1000 bg-modal-background flex flex-col justify-center items-center"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-grayscale-50 rounded-lg shadow-lg p-5 w-[335px] md:w-[395px]">
        <button
          className="absolute top-2 right-4 bg-grayscale-50 p-0"
          onClick={closeImageUpload}
        >
          <CloseIcon className="w-[20px] h-[20px]" />
        </button>
        {<Contents />}
      </div>
    </div>
  );
};

export default ImageUploadWrap;
