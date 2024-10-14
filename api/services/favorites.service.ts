import {
  GetFavoritesRequest,
  GetIsInFavoritesRequest,
  ToggleFavoriteRequest,
} from "@/types/favorites";
import { axiosInstance } from "..";
import { FAVORITES, RECIPES } from "../constants";
import { handleError } from "../handleError";

const FavoritesService = {
  getFavorties: async (params: GetFavoritesRequest) => {
    try {
      const { data } = await axiosInstance.get(`${FAVORITES}`, { params });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getPaginatedFavorites: async (params: any) => {
    try {
      const payload = {
        page: params.pageParam.page,
        userId: params.pageParam.userId,
        limit: 10,
      };

      const { data } = await axiosInstance.get(`${FAVORITES}`, { params: payload });

      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

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
