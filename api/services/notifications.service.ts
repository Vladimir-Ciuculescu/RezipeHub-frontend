import { axiosInstance } from "..";
import { NOTIFICATIONS } from "../constants";
import { handleError } from "../handleError";

const NotificationService = {
  getNotifications: async (params: any) => {
    try {
      const payload = {
        userId: params.pageParam.userId,
        page: params.pageParam.page,
        limit: 10,
      };

      const data = await axiosInstance.get(`${NOTIFICATIONS}/`, { params: payload });

      return data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  resetBadgeCountNotification: async (deviceToken: string) => {
    try {
      await axiosInstance.post(`${NOTIFICATIONS}/reset-badge`, { deviceToken });
    } catch (error) {
      throw handleError(error);
    }
  },

  markAsReadNotification: async (notificationId: number) => {
    try {
      await axiosInstance.put(`${NOTIFICATIONS}/mark-as-read`, { notificationId });
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default NotificationService;
