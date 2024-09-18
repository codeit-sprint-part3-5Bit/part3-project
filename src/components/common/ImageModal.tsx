import React, { useState } from "react";
import { Modal } from "flowbite-react";
import { FaCamera } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (url: string) => void;
  teamId: string; // Add teamId prop
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
  teamId,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = async () => {
    if (imageFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(
          `https://wikied-api.vercel.app/${teamId}/images/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        const data = await response.json();
        onInsertImage(data.url);
        onClose();
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setIsUploading(false);
        setImageFile(null);
        setPreviewUrl(null);
      }
    }
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="md"
      position="center"
      className="!fixed !inset-0"
    >
      <div className="relative flex flex-col items-center !max-h-none w-[100%] h-[360px] p-4 bg-white rounded-lg shadow-md">
        <button
          onClick={onClose}
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
          {previewUrl ? (
            <img
              src={previewUrl}
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
          <button
            onClick={handleInsert}
            disabled={!imageFile || isUploading}
            className={`px-4 py-2 rounded ${
              !imageFile || isUploading
                ? "bg-gray-300 cursor-not-allowed text-white select-none"
                : "bg-gray-300 hover:bg-green-200 text-white select-none transition delay-50"
            }`}
          >
            {isUploading ? "업로드 중..." : "삽입하기"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
