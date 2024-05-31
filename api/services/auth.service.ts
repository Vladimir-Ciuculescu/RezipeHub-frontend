import axiosInstance from '..';
import { handleError } from '../handleError';

const authService = {
  registerUser: async (payload: any) => {
    try {
      await axiosInstance.post('/auth/register', payload);
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default authService;
