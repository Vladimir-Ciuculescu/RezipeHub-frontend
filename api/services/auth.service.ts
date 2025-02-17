import {
  LoginUserRequest,
  LogOutRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  SocialLoginUserRequest,
  User,
} from "@/types/user.types";
import { handleError } from "../handleError";
import { axiosInstance, axiosPublicInstance } from "..";
import { AUTH } from "../constants";

const AuthService = {
  registerUser: async (payload: RegisterUserRequest): Promise<User> => {
    try {
      const { data } = await axiosPublicInstance.post(`/${AUTH}/register`, payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  loginUser: async (payload: LoginUserRequest) => {
    try {
      const { data } = await axiosPublicInstance.post(`/${AUTH}/login`, payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  socialLoginUser: async (payload: SocialLoginUserRequest) => {
    try {
      const { data } = await axiosPublicInstance.post(`${AUTH}/social-login`, payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  resetPassword: async (payload: ResetPasswordRequest) => {
    try {
      await axiosPublicInstance.post(`${AUTH}/reset-password`, payload);
    } catch (error) {
      throw handleError(error);
    }
  },

  logOut: async (data: LogOutRequest) => {
    try {
      await axiosInstance.delete(`${AUTH}/logout`, { data });
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default AuthService;
