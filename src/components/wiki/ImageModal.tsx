import { Modal } from "flowbite-react";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface ImageModalProps {
  onInsertImage: (url: string) => void;
}

const CustomButton = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded ${
      disabled
        ? "bg-gray-300 cursor-not-allowed text-white select-none"
        : "bg-gray-300 hover:bg-green-200 text-white select-none transition delay-50"
    }`}
  >
    {children}
  </button>
);

export default function ImageModal({ onInsertImage }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = () => {
    if (imageUrl) {
      onInsertImage(imageUrl);
      setIsOpen(false);
      setImageUrl(null);
    }
  };

  return (
    <div className="relative z-50">
      <CustomButton onClick={() => setIsOpen(true)}>이미지 삽입</CustomButton>

      <Modal
        show={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        position="center"
        className="!fixed !inset-0"
      >
        <div className="relative flex flex-col items-center !max-h-none w-[100%] h-[360px] p-4 bg-white rounded-lg shadow-lg">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-gray-500 hover:text-green-200"
          >
            <IoClose size={24} />
          </button>

          <div className="text-center font-bold text-lg w-full mb-4 mt-8">
            <h2 className="text-graycale-500">이미지</h2>
          </div>
          <div
            className="w-[100%] h-[160px] flex items-center justify-center bg-gray-100 rounded-[10px] cursor-pointer hover:bg-gray-200"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Selected"
                className="max-h-full max-w-full rounded-[10px]"
              />
            ) : (
              <FaCamera className="text-gray-400 text-4xl" />
            )}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="w-full flex justify-end mt-8">
            <CustomButton onClick={handleInsert} disabled={!imageUrl}>
              삽입하기
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
