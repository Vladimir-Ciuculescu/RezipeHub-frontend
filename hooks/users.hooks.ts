import UserService from "@/api/services/user.service";
import { useMutation } from "@tanstack/react-query";

export const useEditProfileMutation = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      try {
        const accessToken = await UserService.updateProfile(payload);
        return accessToken;
      } catch (error) {
        console.log("Error during update profile", error);
      }
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
    },
  });
};
