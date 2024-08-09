import { AddRecipeRequest, GetRecipesByUserRequest } from "@/types/recipe.types";
import { handleError } from "../handleError";
import { axiosInstance } from "..";
import { RECIPES } from "../constants";

const RecipeService = {
  addRecipe: async (payload: AddRecipeRequest) => {
    const { data } = await axiosInstance.post(`/${RECIPES}/add`, payload);

    return data;

    try {
    } catch (error) {
      throw handleError(error);
    }
  },

  getRecipesByUser: async (params: GetRecipesByUserRequest) => {
    try {
      const { data } = await axiosInstance.get(`/${RECIPES}`, { params });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default RecipeService;
