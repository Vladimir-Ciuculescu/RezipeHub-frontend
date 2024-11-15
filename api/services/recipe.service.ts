import {
  AddRecipeRequest,
  EditRecipePhotoRequest,
  EditRecipeRequest,
  GetLatestRecipesRequest,
  GetMostPopularRecipesRequest,
  GetRecipesByUserRequest,
  RecipeResponse,
} from "@/types/recipe.types";
import { handleError } from "../handleError";
import { axiosInstance } from "..";
import { FAVORITES, RECIPES } from "../constants";
import { QueryKeyType } from "@/types/query";
import { CategoryItem } from "@/types/category.types";

const RecipeService = {
  addRecipe: async (payload: AddRecipeRequest) => {
    try {
      const { data } = await axiosInstance.post(`/${RECIPES}/add`, payload);

      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  editRecipePhoto: async (payload: EditRecipePhotoRequest) => {
    try {
      await axiosInstance.put(`/${RECIPES}/edit-photo`, payload);
    } catch (error) {
      throw handleError(error);
    }
  },

  getRecipesByUser: async (params: GetRecipesByUserRequest) => {
    try {
      const { data } = await axiosInstance.get(`/${RECIPES}/user-recipes`, { params });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getPaginatedRecipesPerUser: async (params: any) => {
    try {
      const payload = {
        page: params.pageParam.page,
        userId: params.pageParam.userId,
        limit: 10,
      };

      const { data } = await axiosInstance.get(`/${RECIPES}/user-recipes`, { params: payload });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },
  getRecipe: async (recipeId: number): Promise<RecipeResponse> => {
    try {
      const { data } = await axiosInstance.get(`/${RECIPES}/${recipeId}`);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getLatestRecipes: async (params: GetLatestRecipesRequest) => {
    try {
      const { data } = await axiosInstance.get(`${RECIPES}/latest`, { params });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getPaginatedLatestRecipes: async (params: any) => {
    try {
      const payload = {
        page: params.pageParam.page,
        userId: params.pageParam.userId,
        limit: 10,
      };

      const { data } = await axiosInstance.get(`${RECIPES}/latest`, { params: payload });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getMostPopularRecipes: async (params: GetMostPopularRecipesRequest) => {
    try {
      const { data } = await axiosInstance.get(`${RECIPES}/most-popular`, { params });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getPaginatedMostPopularRecipes: async (params: any) => {
    try {
      const payload = {
        page: params.pageParam.page,
        userId: params.pageParam.userId,
        limit: 10,
      };

      const { data } = await axiosInstance.get(`${RECIPES}/most-popular`, { params: payload });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getRecipes: async (params: QueryKeyType) => {
    const [_, filters] = params.queryKey;

    const paramsObject = {
      userId: filters.userId,
      title: filters.text,
      categories: filters.categories
        .filter((category: CategoryItem) => category.checked)
        .map((category: CategoryItem) => category.value),
      caloriesRange: filters.caloriesRange,
      preparationTimeRange: filters.preparationTimeRange,
      page: params.pageParam.page,
      limit: 10,
    };

    try {
      const { data } = await axiosInstance.get(`/${RECIPES}`, {
        params: paramsObject,
      });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  editRecipe: async (payload: EditRecipeRequest) => {
    try {
      const { data } = await axiosInstance.put(`/${RECIPES}/edit`, payload);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateViewCount: async (recipeId: number) => {
    try {
      await axiosInstance.put(`/${RECIPES}/${recipeId}/view`);
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default RecipeService;
