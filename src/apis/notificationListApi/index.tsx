import authAxiosInstance from "@/lib/axios";
import { NotificationListType } from "@/types/notificationType";

export const getNotifications = async () => {
  const res = await authAxiosInstance.get<NotificationListType>(
    `notifications?page=1&pageSize=20`
  );
  const data = res.data;
  return data;
};

export const deleteNotifications = async (id: number) => {
  const res = await authAxiosInstance.delete(`notifications/${id}`);
};
