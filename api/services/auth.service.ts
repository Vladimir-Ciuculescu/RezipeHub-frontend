import {
  LoginUserRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  SocialLoginUserRequest,
  User,
} from "@/types/user.types";
import { handleError } from "../handleError";
import { axiosPublicInstance } from "..";

const AuthService = {
  registerUser: async (payload: RegisterUserRequest): Promise<User> => {
    try {
      const { data } = await axiosPublicInstance.post("/auth/register", payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  loginUser: async (payload: LoginUserRequest) => {
    try {
      const { data } = await axiosPublicInstance.post("/auth/login", payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  socialLoginUser: async (payload: SocialLoginUserRequest) => {
    try {
      const { data } = await axiosPublicInstance.post("auth/social-login", payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  resetPassword: async (payload: ResetPasswordRequest) => {
    try {
      await axiosPublicInstance.post("auth/reset-password", payload);
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default AuthService;
