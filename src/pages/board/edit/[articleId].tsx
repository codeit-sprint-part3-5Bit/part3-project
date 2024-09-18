import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface Article {
  id: number;
  title: string;
  content: string;
}

const EditArticle = () => {
  const router = useRouter();
  const { articleId } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const apiUrl = "https://wikied-api.vercel.app/8-2";

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("로그인이 필요합니다.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(`${apiUrl}/articles/${articleId}`, {
        headers,
      });
      setArticle(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      console.error("게시글을 불러오는 중 오류 발생:", error);
      setError("게시글을 불러오는 데 실패했습니다.");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("로그인이 필요합니다.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await axios.patch(
        `${apiUrl}/articles/${articleId}`,
        { title, content },
        { headers }
      );

      router.push(`/board/${articleId}`);
    } catch (error) {
      console.error("게시글을 저장하는 중 오류 발생:", error);
      setError("게시글 저장에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("로그인이 필요합니다.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await axios.delete(`${apiUrl}/articles/${articleId}`, { headers });

      router.push("/board"); // 게시글 목록 페이지로 이동
    } catch (error) {
      console.error("게시글을 삭제하는 중 오류 발생:", error);
      setError("게시글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {error && <p className="text-red-500">{error}</p>}
      {article ? (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
          <div className="mb-4">
            <label className="block text-gray-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md"
              rows={8}
            />
          </div>

          <div className="flex justify-end gap-4 mt-5">
            <button
              onClick={handleSave}
              className="bg-green-200 text-white px-4 py-2 rounded-md hover:bg-green-300"
            >
              저장하기
            </button>
            <button
              onClick={() => router.push(`/board/${articleId}`)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p>게시글을 불러오는 중...</p>
      )}
    </div>
  );
};

export default EditArticle;
