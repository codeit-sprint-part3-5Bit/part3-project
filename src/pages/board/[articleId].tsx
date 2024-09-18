import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FaHeart } from "react-icons/fa";
import DOMPurify from "dompurify";

interface Comment {
  id: number;
  content: string;
  writer: {
    name: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likeCount: number;
  writer: {
    name: string;
  };
}

export default function ArticleDetail() {
  const router = useRouter();
  const { articleId } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  const apiUrl = "https://wikied-api.vercel.app/8-2";

  useEffect(() => {
    if (articleId) {
      fetchArticle();
      fetchComments();
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

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      setIsAuthor(currentUser.name === response.data.writer.name);

      // 서버로부터 받은 좋아요 상태를 초기화
      setIsLiked(response.data.isLiked);
    } catch (error) {
      handleApiError(error, "게시글을 불러오는데 실패했습니다.");
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("댓글을 불러오기 위해 로그인이 필요합니다.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(
        `${apiUrl}/articles/${articleId}/comments?limit=500`,
        { headers }
      );

      if (response.data && Array.isArray(response.data.list)) {
        setComments(response.data.list);
      } else {
        console.error("Unexpected comments data structure:", response.data);
        setComments([]);
      }
    } catch (error) {
      handleApiError(error, "댓글을 불러오는데 실패했습니다.");
      setComments([]);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("좋아요를 위해 로그인이 필요합니다.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // 좋아요 상태에 따라 요청을 다르게 처리
      if (isLiked) {
        await axios.delete(`${apiUrl}/articles/${articleId}/like`, { headers });
        setIsLiked(false);
        if (article) {
          setArticle({
            ...article,
            likeCount: article.likeCount - 1, // 좋아요 취소 시 감소
          });
        }
      } else {
        await axios.post(
          `${apiUrl}/articles/${articleId}/like`,
          {},
          { headers }
        );
        setIsLiked(true);
        if (article) {
          setArticle({
            ...article,
            likeCount: article.likeCount + 1, // 좋아요 시 증가
          });
        }
      }
    } catch (error) {
      handleApiError(error, "좋아요 처리에 실패했습니다.");
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("댓글 작성을 위해 로그인이 필요합니다.");
        return;
      }

      if (!newComment.trim()) {
        setError("댓글 내용이 비어있습니다.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        `${apiUrl}/articles/${articleId}/comments?limit=500`,
        { content: newComment },
        { headers }
      );

      if (response.data && typeof response.data === "object") {
        setComments((prevComments) => {
          if (Array.isArray(prevComments)) {
            return [...prevComments, response.data];
          } else {
            console.error("prevComments is not an array:", prevComments);
            return [response.data];
          }
        });
      } else {
        console.error("Unexpected API response:", response.data);
        setError("댓글 등록에 실패했습니다. 서버 응답이 올바르지 않습니다.");
        return;
      }

      setNewComment("");
      setError("");
    } catch (error) {
      handleApiError(error, "댓글 등록에 실패했습니다.");
    }
  };

  const handleApiError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      console.error("API 오류:", error.response?.data);
      if (error.response?.status === 401) {
        setError("인증에 실패했습니다. 다시 로그인해 주세요.");
      } else {
        setError(
          `${defaultMessage}: ${error.response?.data?.message || error.message}`
        );
      }
    } else {
      console.error("알 수 없는 오류:", error);
      setError(`${defaultMessage}. 알 수 없는 오류가 발생했습니다.`);
    }
  };

  const handleEditComment = (commentId: number, content: string) => {
    setEditCommentId(commentId);
    setEditCommentContent(content);
  };

  const handleSaveComment = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("댓글 수정을 위해 로그인이 필요합니다.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // 수정된 API 엔드포인트
      await axios.patch(
        `${apiUrl}/comments/${editCommentId}`,
        { content: editCommentContent },
        { headers }
      );

      setComments(
        comments.map((comment) =>
          comment.id === editCommentId
            ? { ...comment, content: editCommentContent }
            : comment
        )
      );

      setEditCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      handleApiError(error, "댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("댓글 삭제를 위해 로그인이 필요합니다.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // 수정된 API 엔드포인트
      await axios.delete(`${apiUrl}/comments/${commentId}`, { headers });

      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      handleApiError(error, "댓글 삭제에 실패했습니다.");
    }
  };

  const handleDeleteArticle = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("게시글 삭제를 위해 로그인이 필요합니다.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await axios.delete(`${apiUrl}/articles/${articleId}`, { headers });
      router.push("/board"); // 삭제 후 게시판 목록으로 이동
    } catch (error) {
      handleApiError(error, "게시글 삭제에 실패했습니다.");
    }
  };

  const createMarkup = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <div className="container mx-auto p-6">
      {article && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-10">
            <div className="flex justify-items-end justify-between">
              <h1 className="flexjustify-items-center justify-center text-3xl font-bold text-gray-800">
                {article.title}
              </h1>

              <div className="flex justify-items-start mb-8 gap-4 justify-start">
                <button
                  className=" bg-green-200 text-white px-4 py-2 rounded-md hover:bg-green-300 w-[140px] h-[45px]"
                  onClick={() => router.push(`/board/edit/${articleId}`)}
                >
                  수정하기
                </button>
                <button
                  className=" bg-green-200 text-white px-4 py-2 rounded-md hover:bg-green-300  h-[45px] w-[140px]"
                  onClick={handleDeleteArticle}
                >
                  삭제하기
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-12">
              <p className="text-gray-500 text-sm">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
              <button
                className={`flex items-center ${
                  isLiked ? "text-red-500" : "text-gray-400"
                }`}
                onClick={handleLike}
              >
                <FaHeart className="w-5 h-5 mr-1" />
                <span className="text-lg">{article.likeCount}</span>
              </button>
            </div>

            <div
              className="text-gray-700 text-lg mb-6 leading-relaxed"
              dangerouslySetInnerHTML={createMarkup(article.content)}
            />

            <div className="flex justify-center items-center mt-24">
              <button
                className="border-green-200 border text-green-200 px-4 py-2 rounded-md hover:bg-green-300 hover:text-white h-[45px] w-[140px]"
                onClick={() => router.push("/board")}
              >
                목록으로
              </button>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              댓글 {comments.length}
            </h2>
            {comments.length > 0 ? (
              <ul className="space-y-6 mt-6">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="flex items-start space-x-4 p-4 bg-white shadow rounded-md"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-6 h-6 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-3 0-9 1.5-9 4.5V20h18v-1.5c0-3-6-4.5-9-4.5z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span
                          className="text-lg font-medium text-gray-500"
                          style={{ fontSize: "18px" }}
                        >
                          {comment.writer.name}
                        </span>
                        <span
                          className="text-sm text-gray-400"
                          style={{ fontSize: "14px" }}
                        >
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {editCommentId === comment.id ? (
                        <div>
                          <textarea
                            value={editCommentContent}
                            onChange={(e) =>
                              setEditCommentContent(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md mt-2"
                            rows={3}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={handleSaveComment}
                              className="bg-green-200 text-white px-2 py-1 rounded-md hover:bg-green-300 mr-2"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => setEditCommentId(null)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p
                          className="mt-2 text-gray-500"
                          style={{ fontSize: "16px" }}
                        >
                          {comment.content}
                        </p>
                      )}
                      {editCommentId !== comment.id && (
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() =>
                              handleEditComment(comment.id, comment.content)
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                              style={{ width: "17px", height: "17px" }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232a3 3 0 114.243 4.243L10.243 18.707l-4.243.707.707-4.243L15.232 5.232z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                              style={{ width: "17px", height: "17px" }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-500">댓글이 없습니다.</p>
            )}

            <div className="mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md"
                placeholder="댓글을 입력하세요..."
                rows={3}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <button
                onClick={handleCommentSubmit}
                className="mt-4 w-full bg-green-200 text-white py-2 px-4 rounded-md hover:bg-green-300 h-[45px]"
              >
                댓글 등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
