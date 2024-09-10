import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ContentWriter from "@/components/ContentWriter";

export default function CreateArticle({ teamId }: { teamId: string }) {
  const router = useRouter();

  const handleSubmit = () => {
    axios
      .post(`https://wikied-api.vercel.app/${teamId}/articles`, {})
      .then((response) => {
        if (response.status === 200) {
          router.push(`/articles/${response.data.id}`);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("게시글 등록에 실패했습니다.");
      });
  };

  return (
    <div className="container mx-auto p-4 w-[1060px] mt-10">
      <ContentWriter></ContentWriter>
    </div>
  );
}
