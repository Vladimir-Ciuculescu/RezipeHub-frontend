import axios from "axios";
import { handleError } from "../handleError";
import { ConfirmTokenRequest, ResendTokenRequest } from "@/types/token.types";
import { axiosPublicInstance } from "..";
import { TOKEN } from "../constants";

const TokenService = {
  resendToken: async (payload: ResendTokenRequest) => {
    try {
      await axiosPublicInstance.post(`/${TOKEN}/resend`, { params: payload });
    } catch (error) {
      throw handleError(error);
    }
  },

  validateToken: async (payload: ConfirmTokenRequest) => {
    try {
      await axiosPublicInstance.post(`/${TOKEN}/confirm`, payload);
    } catch (error) {
      throw handleError(error);
    }
  },

  sendResetPasswordToken: async (email: string) => {
    try {
      await axiosPublicInstance.post(`/${TOKEN}/send-reset-email`, { email });
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default TokenService;
