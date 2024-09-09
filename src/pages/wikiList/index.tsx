import ProfileList from "@/components/wikiList/ProfileList";
import SearchForm from "@/components/wikiList/SearchForm";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { Pagination } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";

const fetchProfiles = async ({
  queryKey,
}: {
  queryKey: [string, { name: string; page: number; pageSize: number }];
}) => {
  const [, { name, page, pageSize }] = queryKey;
  const query = name
    ? `name=${name}&page=${page}&pageSize=${pageSize}`
    : `page=${page}&pageSize=${pageSize}`;
  const res = await axios.get(`/profiles?${query}`);
  return res.data;
};

const WikiList = () => {
  const router = useRouter();
  const { name = "", page = 1, pageSize = 3 } = router.query;

  const { data, isError, isLoading } = useQuery({
    queryKey: [
      "profiles",
      { name: name as string, page: Number(page), pageSize: Number(pageSize) },
    ],
    queryFn: fetchProfiles,
  });

  const handlePageChange = (newPage: number) => {
    router.push({
      pathname: "/wikiList",
      query: { name, page: newPage, pageSize },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-500 border-b-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return <div>프로필 데이터를 가져오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <>
      <SearchForm />
      <ProfileList wikiItemList={data?.list || []} />
      <Pagination
        currentPage={Number(page)}
        totalPages={data?.totalCount || 1}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default WikiList;
