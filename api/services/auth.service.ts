import { User } from '@/types/user.types';
import axiosInstance from '..';
import { handleError } from '../handleError';

const AuthService = {
  registerUser: async (payload: any): Promise<User> => {
    try {
      const { data } = await axiosInstance.post('/auth/register', payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default AuthService;
