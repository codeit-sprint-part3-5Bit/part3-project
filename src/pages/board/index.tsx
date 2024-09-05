import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Custom SearchBar Component
function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}) {
  return (
    <div className="flex items-center space-x-4 flex-grow">
      <input
        type="text"
        className="w-full bg-gray-100 text-gray-400 py-2 px-4 rounded-md focus:outline-none h-[45px] border-0"
        placeholder="제목을 검색해 주세요"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-green-200 hover:bg-green-300 text-white py-2 px-4 rounded-md w-[80px] h-[45px]"
      >
        검색
      </button>
    </div>
  );
}

// Custom Dropdown Component
function CustomDropdown({
  orderBy,
  setOrderBy,
}: {
  orderBy: "recent" | "like";
  setOrderBy: (order: "recent" | "like") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 text-gray-500 py-2 px-4 rounded-md w-[140px] h-[45px]"
      >
        {orderBy === "recent" ? "최신순" : "인기순"}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full bg-gray-100 rounded-md shadow-lg z-10">
          <button
            className="block w-full text-left py-2 px-4 hover:bg-gray-200 text-gray-500"
            onClick={() => {
              setOrderBy("recent");
              setIsOpen(false);
            }}
          >
            최신순
          </button>
          <button
            className="block w-full text-left py-2 px-4 hover:bg-gray-200 text-gray-500"
            onClick={() => {
              setOrderBy("like");
              setIsOpen(false);
            }}
          >
            인기순
          </button>
        </div>
      )}
    </div>
  );
}

// Custom Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`py-2 px-4 rounded-md ${
            page === currentPage
              ? "bg-green-200 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

// Main Home Component
export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState<"recent" | "like">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(
        `https://wikied-api.vercel.app/7-7/articles?page=${currentPage}&pageSize=10&orderBy=${orderBy}`
      )
      .then((response) => {
        const data = response.data;
        if (data && Array.isArray(data.list)) {
          setArticles(
            data.list.map((item: any) => ({
              id: item.id,
              title: item.title,
              author: item.writer.name,
              likes: item.likeCount,
              date: new Date(item.createdAt).toLocaleDateString(),
              image: item.image,
            }))
          );
          setTotalPages(Math.ceil(data.totalCount / 5));
        } else {
          setArticles([]);
          setTotalPages(1);
        }
      })
      .catch((error) => {
        console.error(error);
        setArticles([]);
        setTotalPages(1);
      });
  }, [orderBy, currentPage]);

  const handleSearch = () => {
    axios
      .get(`https://wikied-api.vercel.app/7-7/articles?search=${searchQuery}`)
      .then((response) => {
        const data = response.data;
        if (data && Array.isArray(data.list)) {
          setArticles(
            data.list.map((item: any) => ({
              id: item.id,
              title: item.title,
              author: item.writer.name,
              likes: item.likeCount,
              date: new Date(item.createdAt).toLocaleDateString(),
              image: item.image,
            }))
          );
          setTotalPages(Math.ceil(data.totalCount / 5));
        } else {
          setArticles([]);
          setTotalPages(1);
        }
      })
      .catch((error) => {
        console.error(error);
        setArticles([]);
        setTotalPages(1);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">베스트 게시글</h1>
        <button
          onClick={() => router.push("/articles/create")}
          className="bg-green-200 hover:bg-green-300 text-white py-2 px-4 rounded-md"
        >
          게시물 등록하기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {articles.length > 0 ? (
          articles.slice(0, 4).map((article) => (
            <div
              key={article.id}
              className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer"
              onClick={() => router.push(`/articles/${article.id}`)}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{article.title}</h3>
                <p className="text-gray-500">{article.author}</p>
              </div>
            </div>
          ))
        ) : (
          <p>베스트 게시글이 없습니다.</p>
        )}
      </div>

      <div className="flex space-x-4 mb-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        <CustomDropdown orderBy={orderBy} setOrderBy={setOrderBy} />
      </div>

      <table className="w-full text-left table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2">번호</th>
            <th className="border border-gray-200 px-4 py-2">제목</th>
            <th className="border border-gray-200 px-4 py-2">작성자</th>
            <th className="border border-gray-200 px-4 py-2">좋아요</th>
            <th className="border border-gray-200 px-4 py-2">날짜</th>
          </tr>
        </thead>
        <tbody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/articles/${article.id}`)}
              >
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {article.id}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {article.title}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {article.author}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {article.likes}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {article.date}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="border border-gray-200 px-4 py-2 text-center"
              >
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
