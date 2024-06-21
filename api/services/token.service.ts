import axios from "axios";
import { handleError } from "../handleError";
import axiosInstance from "..";
import { ConfirmTokenRequest, ResendTokenRequest } from "@/types/token.types";

const TokenService = {
  resendToken: async (payload: ResendTokenRequest) => {
    try {
      await axiosInstance.post("/token/resend", { params: payload });
    } catch (error) {
      throw handleError(error);
    }
  },

  validateToken: async (payload: ConfirmTokenRequest) => {
    try {
      await axiosInstance.post("/token/confirm", payload);
    } catch (error) {
      throw handleError(error);
    }
  },

  sendResetPasswordToken: async (email: string) => {
    try {
      await axiosInstance.post("/token/send-reset-email", { email });
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default TokenService;
