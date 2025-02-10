import { axiosInstance } from "..";
import { RECIPES, USERS } from "../constants";
import { handleError } from "../handleError";

const UserService = {
  updateProfile: async (payload: FormData) => {
    try {
      //Get the new access token after profile info is updated
      const { data } = await axiosInstance.put(`${USERS}/update-profile`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getProfile: async (userId: number) => {
    try {
      const { data } = await axiosInstance.get(`${USERS}/profile`, { params: { id: userId } });

      return data;
    } catch (error: any) {
      if (error.status === 403) {
        // throw handleError(error);
        throw { message: "Not found", stauts: 401 };
      }
    }
  },
};

export default UserService;
