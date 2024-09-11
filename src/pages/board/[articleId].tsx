import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FaHeart } from "react-icons/fa"; // 좋아요 아이콘 추가

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

export default function ArticleDetail() {
  const router = useRouter();
  const { articleId } = router.query;
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null); // 수정 중인 댓글 ID
  const [editCommentContent, setEditCommentContent] = useState(""); // 수정 중인 댓글 내용
  const [error, setError] = useState("");
  const [likes, setLikes] = useState(0); // 좋아요 수 상태 추가
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태 추가

  // 임시 가짜 댓글 데이터 추가
  const fakeComments = [
    {
      id: 1,
      content: "이것은 가짜 댓글입니다.",
      writer: { name: "사용자1", image: "/default-avatar.png" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      content: "또 다른 가짜 댓글입니다.",
      writer: { name: "사용자2", image: "/default-avatar.png" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    if (articleId) {
      // 게시물 정보 불러오기
      axios
        .get(`https://wikied-api.vercel.app/2/articles/${articleId}`)
        .then((response) => {
          setArticle(response.data);
          setLikes(response.data.likes || 0); // 초기 좋아요 수 설정
        })
        .catch((error) => {
          console.error(error);
        });

      // 댓글 정보 불러오기 (가짜 댓글 포함)
      axios
        .get(
          `https://wikied-api.vercel.app/2/articles/${articleId}/comments?limit=10`
        )
        .then((response) => {
          setComments([...response.data.list, ...fakeComments]); // 가짜 댓글 추가
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [articleId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
  };

  // 댓글 수정 핸들러
  const handleEditComment = (commentId: number) => {
    setEditCommentId(commentId);
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setEditCommentContent(comment.content);
    }
  };

  // 댓글 수정 저장 핸들러
  const handleSaveEditComment = () => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === editCommentId
          ? { ...comment, content: editCommentContent }
          : comment
      )
    );
    setEditCommentId(null); // 수정 완료 후 초기화
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      axios
        .post(
          `https://wikied-api.vercel.app/2/articles/${articleId}/comments`,
          { content: newComment },
          {
            headers: {
              Authorization: "Bearer YOUR_ACCESS_TOKEN",
            },
          }
        )
        .then((response) => {
          setComments((prev) => [...prev, response.data]);
          setNewComment("");
          setError("");
        })
        .catch((error) => {
          console.error(error);
          setError("댓글 등록에 실패했습니다. 다시 시도해주세요.");
        });
    } else {
      setError("댓글 내용이 비어있습니다.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {article && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {article.title}
            </h1>
            <p className="text-gray-500 text-sm">
              {new Date(article.createdAt).toLocaleDateString()}
            </p>

            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover rounded-md my-4"
            />
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {article.content}
            </p>

            <div className="flex justify-between items-center">
              <button
                className="bg-green-200 text-white px-4 py-2 rounded-md hover:bg-green-300"
                onClick={() => router.push("/board")}
              >
                목록으로
              </button>
              <div className="flex items-center">
                <button
                  className={`flex items-center ${
                    isLiked ? "text-red-500" : "text-gray-400"
                  }`}
                  onClick={handleLike}
                >
                  <FaHeart className="w-6 h-6 mr-1" />
                  <span className="text-lg">{likes}</span>
                </button>
                <button
                  className="ml-4 bg-green-200 text-white px-4 py-2 rounded-md hover:bg-green-300"
                  onClick={() => router.push(`/board/edit/${articleId}`)}
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              댓글 {comments.length}
            </h2>

            {comments.length > 0 ? (
              <ul className="space-y-6 mt-6">
                {comments.map((comment) => (
                  <li key={comment.id} className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <img
                        src={comment.writer.image}
                        alt={comment.writer.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {comment.writer.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {editCommentId === comment.id ? (
                      <div>
                        <textarea
                          value={editCommentContent}
                          onChange={(e) =>
                            setEditCommentContent(e.target.value)
                          }
                          className="w-full p-4 border border-gray-300 rounded-md"
                        />
                        <button
                          onClick={handleSaveEditComment}
                          className="mt-2 bg-green-200 text-white py-2 px-4 rounded-md hover:bg-green-300"
                        >
                          저장
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-700">{comment.content}</p>
                    )}
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="text-blue-500"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500"
                      >
                        삭제
                      </button>
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
                className="mt-4 w-full bg-green-200 text-white py-2 px-4 rounded-md hover:bg-green-300"
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
