import NoNotification from "/public/assets/image/NoNotification.svg";

export default function NoNotificationImg() {
  return (
    <div className="flex flex-col items-center gap-[20px]">
      <NoNotification alt="NoNotification" className="w-[150px] h-[150px]" />
      <div className="text-[14px]">새로운 알림이 없습니다.</div>
    </div>
  );
}
