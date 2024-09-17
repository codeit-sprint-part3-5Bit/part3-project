import { useEffect, useRef, useState } from "react";
import {
  getNotifications,
  deleteNotifications,
} from "@/apis/notificationListApi";
import { NotificationItemType } from "@/types/notificationType";

export const useNotificationList = (isOpen: boolean) => {
  const [notificationList, setNotificationList] = useState<
    NotificationItemType[]
  >([]);
  const totalCount = notificationList?.length;
  const [isLoading, setIsLoading] = useState(false);
  const trigger = useRef(1);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { list } = await getNotifications();
        setNotificationList(list);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
    if (isOpen || trigger.current === 1) {
      fetchData();
      if (trigger.current === 1) {
        trigger.current = 0;
      }
    }
  }, [isOpen]);

  const handleDeleteClick = async (id: number) => {
    await deleteNotifications(id);
    setNotificationList((prevList) => {
      return prevList.filter((item) => item.id !== id);
    });
  };

  return { totalCount, notificationList, handleDeleteClick, isLoading };
};

export default useNotificationList;
