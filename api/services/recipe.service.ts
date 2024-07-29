import { AddRecipeRequest } from "@/types/recipe.types";
import { handleError } from "../handleError";
import { axiosInstance } from "..";

const RecipeService = {
  addRecipe: async (payload: AddRecipeRequest) => {
    await axiosInstance.post("/recipe/add", payload);

    try {
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default RecipeService;
