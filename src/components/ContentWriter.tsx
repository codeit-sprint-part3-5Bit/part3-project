import React, { useState, ReactNode, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import { Modal } from "flowbite-react";
import { FaCamera } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";

interface ButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  isActive,
  icon,
  className = "",
}) => (
  <button
    onClick={onClick}
    className={`p-1 rounded hover:bg-gray-100 ${
      isActive ? "bg-gray-200" : ""
    } ${className}`}
  >
    {icon}
  </button>
);

interface MenuBarProps {
  editor: Editor | null;
  onImageClick: () => void;
  onLinkClick: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  onImageClick,
  onLinkClick,
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 mb-4 p-2 border rounded-full">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon={<Bold size={16} />}
      />
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon={<Italic size={16} />}
      />
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        icon={<UnderlineIcon size={16} />}
      />
      <div className="border-r h-6 mx-2" />
      <Button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        icon={<AlignLeft size={16} />}
      />
      <Button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        icon={<AlignCenter size={16} />}
      />
      <Button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        icon={<AlignRight size={16} />}
      />
      <div className="border-r h-6 mx-2" />
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        icon={<List size={16} />}
      />
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        icon={<ListOrdered size={16} />}
      />
      <Button onClick={onImageClick} icon={<ImageIcon size={16} />} />
      <div className="flex-grow" />
      <Button
        onClick={onLinkClick}
        isActive={editor.isActive("link")}
        icon={<LinkIcon size={16} />}
        className="bg-gray-100 rounded-full p-1"
      />
    </div>
  );
};

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (url: string) => void;
  teamId: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
}) => {
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
      onClose();
      setImageUrl(null);
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
          <button
            onClick={handleInsert}
            disabled={!imageUrl}
            className={`px-4 py-2 rounded ${
              !imageUrl
                ? "bg-gray-300 cursor-not-allowed text-white select-none"
                : "bg-gray-300 hover:bg-green-200 text-white select-none transition delay-50"
            }`}
          >
            삽입하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface CharacterCountState {
  characters: number;
  charactersWithoutSpaces: number;
}

interface ContentWriterProps {
  onContentChange: (data: { title: string; content: string }) => void;
}

const ContentWriter: React.FC<ContentWriterProps> = ({ onContentChange }) => {
  const [title, setTitle] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<CharacterCountState>({
    characters: 0,
    charactersWithoutSpaces: 0,
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [teamId, setTeamId] = useState("8-2");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      CharacterCount.configure({
        limit: 1000,
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onContentChange({ title, content });

      const textContent = editor.getText();
      const characters = textContent.length;
      const charactersWithoutSpaces = textContent.replace(/\s+/g, "").length;

      setCharacterCount({
        characters,
        charactersWithoutSpaces,
      });
    },
  });

  useEffect(() => {
    onContentChange({ title, content: editor?.getHTML() || "" });
  }, [title, editor?.getHTML()]);

  const handleImageInsert = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
  };

  const handleLinkInsert = () => {
    const url = window.prompt("Enter the URL");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0].replace(/-/g, ".");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">게시물 등록하기</h1>
        {/* <button
          onClick={() =>
            onContentChange({ title, content: editor?.getHTML() || "" })
          }
          className="bg-green-200 text-white px-9 py-2 rounded-lg hover:bg-green-300 transition-colors"
        >
          등록하기
        </button> */}
      </div>

      <p className="text-gray-500 mb-6">등록일 {formatDate(new Date())}</p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          className="w-full text-xl border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={30}
        />
        <p className="text-right text-sm text-green-500 mt-1">
          {title.length}/30
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          공백포함 : 총 {characterCount.characters}자 | 공백제외 : 총{" "}
          {characterCount.charactersWithoutSpaces}자
        </p>
      </div>

      <EditorContent
        editor={editor}
        className="prose max-w-none min-h-[470px] border border-gray-200 mb-4"
        style={{ overflow: "auto", maxHeight: "none" }}
      />

      <MenuBar
        editor={editor}
        onImageClick={() => setIsImageModalOpen(true)}
        onLinkClick={handleLinkInsert}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsertImage={handleImageInsert}
        teamId={"8-2"}
      />
    </div>
  );
};

export default ContentWriter;
