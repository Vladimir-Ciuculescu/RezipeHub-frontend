import { axiosInstance } from "..";
import { S3 } from "../constants";

const S3Service = {
  uploadImage: async (formData: FormData) => {
    const { data } = await axiosInstance.post(`/${S3}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },
};

export default S3Service;
