import RecipeService from "@/api/services/recipe.service";
import S3Service from "@/api/services/s3.service";
import { AddRecipeRequest, GetRecipesByUserRequest } from "@/types/recipe.types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUserRecipes = (params: GetRecipesByUserRequest) => {
  return useQuery({
    queryKey: ["recipes-per-user"],
    queryFn: async () => await RecipeService.getRecipesByUser(params),
  });
};

export const useRecipe = (recipeId: number) => {
  return useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: async () => await RecipeService.getRecipe(recipeId),
  });
};

export const useAddRecipeMutation = () => {
  return useMutation({
    mutationFn: async (payload: AddRecipeRequest) => {
      try {
        if (payload.photoUrl) {
          const formData = new FormData();
          formData.append("file", {
            uri: payload.photoUrl,
            type: "image/jpeg",
            name: `${payload.userId}-${payload.title}`,
          } as any);

          const { url } = await S3Service.uploadImage(formData);
          payload.photoUrl = url;
        }
        return await RecipeService.addRecipe(payload);
      } catch (error: any) {
        throw new Error(error.message || "Error adding recipe");
      }
    },

    onError: (error) => {
      console.error("Error during mutation:", error);
    },
  });
};
