import { DeleteRecipePhotoRequest } from "@/types/s3.types";
import { axiosInstance } from "..";
import { S3 } from "../constants";
import { handleError } from "../handleError";

const S3Service = {
  uploadImage: async (formData: FormData) => {
    try {
      const { data } = await axiosInstance.post(`/${S3}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  deleteRecipeImage: async (payload: DeleteRecipePhotoRequest) => {
    try {
      await axiosInstance.delete(`/${S3}/delete`, { data: payload });
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default S3Service;
