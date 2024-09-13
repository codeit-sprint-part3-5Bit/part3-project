import CloseIcon from "/public/assets/Icons/closeicon.svg";
import { useCallback } from "react";

interface WikiModalProps {
  contents: React.FC;
  onClose?: () => void;
}

const WikiModal = ({
  contents: Contents,
  onClose,
}: WikiModalProps): JSX.Element => {
  const closeImageUpload = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
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

export default WikiModal;
