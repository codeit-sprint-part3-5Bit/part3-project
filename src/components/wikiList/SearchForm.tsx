import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import SearchIcon from "../../../public/assets/Icons/searchicon.svg";

const SearchForm = ({
  data,
  isLoading,
  isError,
}: {
  data: { totalCount: number };
  isLoading: boolean;
  isError: boolean;
}) => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/wikiList?name=${value}&page=1&pageSize=3`);
    setSearchValue(value);

    if (!value) {
      router.push("/wikiList");
      setSearchValue("");
      return;
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              id="name"
              name="name"
              value={value}
              placeholder="위키 검색하기"
              onChange={handleChange}
              className="w-[55rem] h-11 outline-none bg-grayscale-100 px-11 py-2.5 rounded-lg mt-10 placeholder-grayscale-400"
              autoComplete="off"
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-[3.9rem] transform -translate-y-1/2 text-gray-400"
            >
              <SearchIcon />
            </label>
          </div>
        </form>

        <div className="mb-16 mt-4 text-grayscale-400 text-lg">
          {data && (
            <div>
              "{searchValue}"님을 총{" "}
              <span className="text-green-200">{data.totalCount || 0}</span>명
              찾았습니다.
            </div>
          )}
          {isLoading && <div>로딩 중입니다...</div>}
          {isError && <div>검색 중 오류가 발생했습니다.</div>}
        </div>
      </div>
    </>
  );
};

export default SearchForm;
