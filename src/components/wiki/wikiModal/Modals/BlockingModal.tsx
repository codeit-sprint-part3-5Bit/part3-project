import { Button } from "flowbite-react";

interface BlockingModalProps {
  title: string; //경고창 제목
  description: string; //경고창 설명
  content: string; //버튼 표시 내용
  onClose?: () => void; //경고창 닫을 때 호출되는 함수
}

const BlockingModal = ({
  title,
  description,
  content,
  onClose,
}: BlockingModalProps): JSX.Element => {
  return (
    <>
      <div className="flex flex-col gap-4 px-2.5 my-5 items-center">
        <strong className="font-semibold text-base leading-2xl text-gray-500">
          {title}
        </strong>
        <p className="font-regular text-sm leading-lg text-gray-400">
          {description}
        </p>
      </div>
      <div className="flex justify-end mb-4 mt-6">
        <Button
          className="text-white bg-green-200 w-20 rounded-lg h-10 mr-4 whitespace-nowrap"
          size="sm"
          onClick={onClose}
        >
          {content}
        </Button>
      </div>
    </>
  );
};

export default BlockingModal;
