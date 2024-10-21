import { axiosInstance } from "..";
import { RECIPES, USERS } from "../constants";
import { handleError } from "../handleError";

const UserService = {
  updateProfile: async (payload: any) => {
    try {
      // await UserService.updateProfile(payload);
    } catch (error) {
      throw handleError(error);
    }
  },

  getProfile: async (userId: number) => {
    try {
      const { data } = await axiosInstance.get(`${USERS}/profile`, { params: { id: userId } });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default UserService;
