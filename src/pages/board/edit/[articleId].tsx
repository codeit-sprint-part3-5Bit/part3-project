import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditArticle({ teamId }: { teamId: string }) {
  const router = useRouter();
  const { articleId } = router.query;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (articleId) {
      axios
        .get(`https://wikied-api.vercel.app/${teamId}/articles/${articleId}`)
        .then((response) => {
          const article = response.data;
          setTitle(article.title);
          setContent(article.content);
          setImage(article.image);
        })
        .catch((error) => {
          console.error(error);
          alert("게시글을 불러오는데 실패했습니다.");
        });
    }
  }, [articleId]);

  const handleUpdate = () => {
    axios
      .patch(`https://wikied-api.vercel.app/${teamId}/articles/${articleId}`, {
        title,
        content,
        image,
      })
      .then(() => {
        alert("게시글이 수정되었습니다.");
        router.push(`/articles/${articleId}`);
      })
      .catch((error) => {
        console.error(error);
        alert("게시글 수정에 실패했습니다.");
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 수정하기</h1>
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
        onClick={handleUpdate}
        className="bg-green-200 hover:bg-green-300 text-white py-2 px-4 rounded"
      >
        수정하기
      </button>
    </div>
  );
}
