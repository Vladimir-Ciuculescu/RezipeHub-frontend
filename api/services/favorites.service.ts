import { GetIsInFavoritesRequest, ToggleFavoriteRequest } from "@/types/favorites";
import { axiosInstance } from "..";
import { FAVORITES, RECIPES } from "../constants";
import { handleError } from "../handleError";

const FavoritesService = {
  getIsInFavorites: async (params: GetIsInFavoritesRequest) => {
    try {
      const { data } = await axiosInstance.get(`/${FAVORITES}/is-favorite`, { params });

      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  toggleFavoriteRecipe: async (body: ToggleFavoriteRequest) => {
    try {
      await axiosInstance.post(`/${FAVORITES}/toggle-favorite`, body);
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default FavoritesService;
