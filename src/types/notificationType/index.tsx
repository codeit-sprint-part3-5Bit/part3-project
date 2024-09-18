export type NotificationListType = {
  list: NotificationItemType[];
  totalCount: number;
};

export type NotificationItemType = {
  createdAt: string;
  content: string;
  id: number;
};

export type UserInfo = {
  profile: {
    code: string;
    id: 1;
  };
  updatedAt: string;
  createdAt: string;
  teamId: string;
  name: string;
  id: number;
};
