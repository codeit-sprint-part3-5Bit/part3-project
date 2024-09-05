import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateArticle({ teamId }: { teamId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    axios
      .post(`https://wikied-api.vercel.app/${teamId}/articles`, {
        title,
        content,
        image,
      })
      .then((response) => {
        if (response.status === 200) {
          router.push(`/articles/${response.data.id}`);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("게시글 등록에 실패했습니다.");
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 등록하기</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows={6}
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="이미지 URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-green-200 hover:bg-green-300 text-white py-2 px-4 rounded"
      >
        등록하기
      </button>
    </div>
  );
}
