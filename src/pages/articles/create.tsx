import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ContentWriter from "@/components/ContentWriter";

interface ArticleData {
  title: string;
  content: string;
}

export default function CreateArticle({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [articleData, setArticleData] = useState<ArticleData>({
    title: "",
    content: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleContentChange = (data: ArticleData) => {
    setArticleData(data);
  };

  const validateArticleData = (data: ArticleData): boolean => {
    if (!data.title.trim()) {
      setError("제목을 입력해주세요.");
      return false;
    }
    if (!data.content.trim()) {
      setError("내용을 입력해주세요.");
      return false;
    }
    if (data.title.length > 100) {
      setError("제목은 100자를 초과할 수 없습니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    const apiUrl = "https://wikied-api.vercel.app/8-2"; // API URL을 직접 설정

    if (!validateArticleData(articleData)) {
      return;
    }

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

      console.log("전송할 데이터:", articleData); // 데이터 로깅

      const response = await axios.post(`${apiUrl}/articles`, articleData, {
        headers,
      });

      console.log("서버 응답:", response);

      if (response.status === 200 || response.status === 201) {
        router.push(`/board/${response.data.id}`);
      } else {
        setError(`예상치 못한 응답: ${response.status}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API 오류:", error.response?.data);
        setError(
          `게시글 등록 실패: ${error.response?.data?.message || error.message}`
        );
      } else {
        console.error("알 수 없는 오류:", error);
        setError("게시글 등록 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 w-[1060px] mt-10">
      <ContentWriter onContentChange={handleContentChange} />
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          className="px-7 py-3 bg-green-200 text-white rounded-lg hover:bg-green-300 flex items-center"
        >
          게시글 등록
        </button>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
