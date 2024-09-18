import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Article 타입 정의
interface Article {
  id: number;
  title: string;
  author: string;
  likes: number;
  date: string;
  image: string;
}

// API 응답 타입 정의
interface ArticleResponse {
  list: Array<{
    id: number;
    title: string;
    writer: { name: string };
    likeCount: number;
    createdAt: string;
    image: string;
  }>;
  totalCount: number;
}

// SearchBar props 타입 정의
interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  return (
    <div className="flex items-center space-x-4 flex-grow">
      <input
        type="text"
        className="w-full bg-gray-100 text-gray-400 py-2 px-4 rounded-md focus:outline-none h-[45px] border-0"
        placeholder="제목을 검색해 주세요"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button
        onClick={handleSearch}
        className="bg-green-200 hover:bg-green-300 text-white py-2 px-4 rounded-md w-[80px] h-[45px]"
      >
        검색
      </button>
    </div>
  );
};

// CustomDropdown props 타입 정의
interface CustomDropdownProps {
  orderBy: "recent" | "like";
  setOrderBy: (order: "recent" | "like") => void;
}

// Custom Dropdown Component
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  orderBy,
  setOrderBy,
}) => {
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
};

// Pagination props 타입 정의
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Custom Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  let startPage, endPage;
  if (totalPages <= 5) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`py-2 px-4 rounded-md ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        &lt;
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`py-2 px-4 rounded-md ${
            number === currentPage
              ? "bg-green-200 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`py-2 px-4 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        &gt;
      </button>
    </div>
  );
};

// Main Home Component
const Home: React.FC = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [bestArticles, setBestArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState<"recent" | "like">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const fetchArticles = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
      const response = await axios.get<ArticleResponse>(
        `${apiUrl}/articles?pageSize=1000&orderBy=${orderBy}`
      );
      const data = response.data;
      if (data && Array.isArray(data.list)) {
        setAllArticles(
          data.list.map((item) => ({
            id: item.id,
            title: item.title,
            author: item.writer.name,
            likes: item.likeCount,
            date: new Date(item.createdAt).toLocaleDateString(),
            image: item.image,
          }))
        );
      } else {
        setAllArticles([]);
      }
    } catch (error) {
      console.error(error);
      setAllArticles([]);
    }
  }, [orderBy]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    const fetchBestArticles = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
        const response = await axios.get<ArticleResponse>(
          `${apiUrl}/articles?orderBy=like&page=1&pageSize=4`
        );
        const data = response.data;
        if (data && Array.isArray(data.list)) {
          setBestArticles(
            data.list.map((item) => ({
              id: item.id,
              title: item.title,
              author: item.writer.name,
              likes: item.likeCount,
              date: new Date(item.createdAt).toLocaleDateString(),
              image: item.image,
            }))
          );
        } else {
          setBestArticles([]);
        }
      } catch (error) {
        console.error(error);
        setBestArticles([]);
      }
    };

    fetchBestArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    if (!activeSearchQuery) return allArticles;
    return allArticles.filter((article) =>
      article.title.toLowerCase().includes(activeSearchQuery.toLowerCase())
    );
  }, [allArticles, activeSearchQuery]);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredArticles.length / 10);
  }, [filteredArticles]);

  const handleSearch = useCallback(() => {
    setActiveSearchQuery(searchQuery);
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="container mx-auto p-4 w-[1080px] mt-10 mb-24">
      <div className="flex justify-between items-start mb-9">
        <h1 className="text-2xl font-bold text-gray-700 flex justify-center justify-items-center">
          베스트 게시글
        </h1>
        <button
          onClick={() => router.push("/articles/create")}
          className="bg-green-200 hover:bg-green-300 text-white py-2 px-4 rounded-md w-[160px] h-[45px]"
        >
          게시물 등록하기
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {bestArticles.length > 0 ? (
          bestArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer"
              onClick={() => router.push(`/board/${article.id}`)}
            >
              <img
                src={article.image} // 이미지가 없을 경우 임시 이미지로 대체
                alt={article.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{article.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-400">{article.author}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{article.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">❤ {article.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>베스트 게시글이 없습니다.</p>
        )}
      </div>
      <div className="flex space-x-4 mb-7 mt-20">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        <CustomDropdown orderBy={orderBy} setOrderBy={setOrderBy} />
      </div>

      <table className="w-full text-left table-auto border-t border-gray-200 mt-8 mb-16">
        <thead className="w-[1060px]">
          <tr className="text-center h-[49px] text-gray-400">
            <th className="border-b border-gray-200 px-4 py-2 w-[10%]">번호</th>
            <th className="border-b border-gray-200 px-4 py-2 w-[35%]">제목</th>
            <th className="border-b border-gray-200 px-4 py-2 w-[20%]">
              작성자
            </th>
            <th className="border-b border-gray-200 px-4 py-2 w-[15%]">
              좋아요
            </th>
            <th className="border-b border-gray-200 px-4 py-2 w-[20%]">날짜</th>
          </tr>
        </thead>
        <tbody className="w-[1060px]">
          {paginatedArticles.length > 0 ? (
            paginatedArticles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 cursor-pointer h-[49px] text-gray-700"
                onClick={() => router.push(`/board/${article.id}`)}
              >
                <td className="border-b border-gray-200 px-4 py-2 text-center">
                  {article.id}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-center">
                  <span className="block truncate">{article.title}</span>
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-center">
                  {article.author}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-center">
                  {article.likes}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-center">
                  {article.date}
                </td>
              </tr>
            ))
          ) : (
            <tr className="h-[49px]">
              <td
                colSpan={5}
                className="border-b border-gray-200 px-4 py-2 text-center"
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
};

export default Home;
