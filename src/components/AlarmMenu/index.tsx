import { useState } from "react";
import NotificationList from "./notificationList";
import useNotificationList from "./useNotificationList";
import useOutsideClick from "./useOutsideClick";
import AlarmIcon from "/public/assets/Icons/AlarmIcon_small.svg";

const AlarmMenu = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notificationList, totalCount, handleDeleteClick } =
    useNotificationList(isNotificationOpen);
  const toggleNotification = () => {
    setIsNotificationOpen((prevOpen) => !prevOpen);
  };
  const alarmRef = useOutsideClick<HTMLDivElement>(() => {
    setIsNotificationOpen(false);
  });

  return (
    <>
      <div className="flex" ref={alarmRef}>
        <AlarmIcon
          alt="알람 아이콘"
          className={`h-[25px] w-[30px] ${totalCount ? "animate-pulse" : ""}`}
          totalCount={totalCount}
          onClick={toggleNotification}
        />
        <div className="absolute -left-[230px] top-[45px] z-50 sm:-left-[250px] lg:left-[1170px]">
          <NotificationList
            isOpen={isNotificationOpen}
            handleIsOpen={toggleNotification}
            notificationList={notificationList}
            totalCount={totalCount}
            handleDeleteClick={handleDeleteClick}
          />
        </div>
      </div>
    </>
  );
};

export default AlarmMenu;
