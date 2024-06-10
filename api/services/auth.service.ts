import { LoginUserRequest, RegisterUserRequest, User } from "@/types/user.types";
import axiosInstance from "..";
import { handleError } from "../handleError";

const AuthService = {
  registerUser: async (payload: RegisterUserRequest): Promise<User> => {
    try {
      const { data } = await axiosInstance.post("/auth/register", payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  loginUser: async (payload: LoginUserRequest) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default AuthService;
