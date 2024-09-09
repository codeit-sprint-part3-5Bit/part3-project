import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const SearchForm = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) {
      router.push("/wikiList");
      return;
    }

    router.push(`/wikiList?name=${value}&page=1&pageSize=3`);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={value}
          placeholder="위키 검색하기"
          onChange={handleChange}
        />
      </form>
    </>
  );
};

export default SearchForm;
