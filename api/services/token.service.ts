import axios from 'axios';
import { handleError } from '../handleError';
import axiosInstance from '..';
import { ResendTokenRequest } from '@/types/token.types';

const TokenService = {
  resendToken: async (payload: ResendTokenRequest) => {
    await axiosInstance.post('/token/resend', { params: payload });

    try {
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default TokenService;
