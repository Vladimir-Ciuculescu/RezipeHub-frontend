import { IngredientItemResponse, IngredientPayload } from "./ingredient.types";
import { StepItemResponse, StepPayload } from "./step.types";

export interface AddRecipeRequest {
  userId: number;
  title: string;
  servings: number;
  photoUrl?: string;
  ingredients: IngredientPayload[];
  steps: StepPayload[];
}

export interface GetRecipesByUserRequest {
  page: number;
  limit: number;
  userId: number;
}

export interface RecipeResponse {
  id: number;
  userId: number;
  title: string;
  servings: number;
  photoUrl: string;
  ingredients: IngredientItemResponse[];
  steps: StepItemResponse[];
}
