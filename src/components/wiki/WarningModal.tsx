import { Modal } from "flowbite-react";
import Closeicon from "@/public/assets/Icons/closeicon.svg";

interface ComponentProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

// 외부에 const [openModal, setOpenModal] = useState(false); 필요
// 외부 openModal의 true값 prop을 받아 모달창 열림
const Component: React.FC<ComponentProps> = ({ openModal, setOpenModal }) => {
  // 외부의 setOpenModal로 false값 내보내 외부의 openModal 상태 바꾸는 함수
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="md"
      >
        <div className="flex-col p-5 ">
          <button className="block ml-auto w-5 h-5 mb-5" onClick={handleClose}>
            <Closeicon />
          </button>
        </div>
        <h1 className=" mb-2.5 ml-6 text-left text-base font-semibold">
          <p>5분 이상 글을 쓰지 않아 접속이 끊어졌어요.</p>
        </h1>
        <div className="text-left text-sm text-graycale-400 mb-4 ml-6 ">
          <p>위키 참여하기를 통해 다시 위키를 수정해 주세요.</p>
        </div>
        <div className="flex justify-end mb-4 mt-6">
          <button
            className=" text-graycale-50  bg-green-200 w-20 rounded-lg h-10 mr-4 "
            onClick={handleClose}
          >
            확인
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Component;
