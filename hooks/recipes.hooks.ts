import RecipeService from "@/api/services/recipe.service";
import S3Service from "@/api/services/s3.service";
import {
  AddRecipeRequest,
  EditRecipePhotoRequest,
  EditRecipeRequest,
  GetRecipesByUserRequest,
} from "@/types/recipe.types";
import { AddPhotoRequest, DeleteRecipePhotoRequest } from "@/types/s3.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserRecipes = (params: GetRecipesByUserRequest) => {
  return useQuery({
    queryKey: ["recipes-per-user"],
    queryFn: async () => await RecipeService.getRecipesByUser(params),
  });
};

export const useRecipe = (recipeId: number) => {
  return useQuery({
    queryKey: ["recipe"],
    queryFn: async () => await RecipeService.getRecipe(recipeId),
  });
};

export const useAddRecipeMutation = () => {
  return useMutation({
    mutationFn: async (payload: AddRecipeRequest) => {
      try {
        const recipe = await RecipeService.addRecipe(payload);
        return recipe;
      } catch (error: any) {
        throw new Error(error.message || "Error adding recipe");
      }
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
    },
  });
};

export const useEditRecipeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EditRecipeRequest) => {
      try {
        await RecipeService.editRecipe(payload);
      } catch (error) {}
    },

    onError: (error) => {
      console.error("Error during mutation:", error);
    },
  });
};

export const useEditRecipePhotoMutation = () => {
  return useMutation({
    mutationFn: async (payload: EditRecipePhotoRequest) => {
      try {
        await RecipeService.editRecipePhoto(payload);
      } catch (error: any) {
        throw new Error(error.message || "Error adding recipe");
      }
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
    },
  });
};

export const useUploadToS3Mutation = () => {
  return useMutation({
    mutationFn: async (payload: AddPhotoRequest) => {
      const { userId, id, photoUrl } = payload;

      try {
        const formData = new FormData();

        formData.append("file", {
          uri: photoUrl,
          type: "image/jpeg",
          name: `users-${userId}-recipes-${id}`,
        } as any);

        formData.append("userId", userId.toString());
        formData.append("id", id.toString());
        const { url } = await S3Service.uploadImage(formData);

        return url;
      } catch (error: any) {
        throw new Error(error.message || "Could not upload to s3");
      }
    },
  });
};

export const useDeleteRecipeImageMutation = () => {
  return useMutation({
    mutationFn: async (payload: DeleteRecipePhotoRequest) => {
      try {
        await S3Service.deleteRecipeImage(payload);
      } catch (error: any) {
        throw new Error(error.message || "Could not delete from S3");
      }
    },
  });
};
