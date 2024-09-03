import { IngredientItem, IngredientItemResponse, IngredientPayload } from "./ingredient.types";
import { Step, StepItemResponse, StepPayload } from "./step.types";

export interface AddRecipeRequest {
  userId: number;
  title: string;
  servings: number;
  photoUrl?: string;
  ingredients: IngredientPayload[];
  steps: StepPayload[];
}

export interface EditRecipePhotoRequest {
  id: number;
  photoUrl: string;
}

export interface EditRecipeRequest {
  recipe: {
    id: number;
    title: string;
    servings: number;
    photoUrl: string;
    ingredients?: IngredientItem[];
    steps?: Step[];
  };
  ingredientsIds?: number[];
  nutritionalInfoIds?: number[];
  stepsIds?: number[];
}

export interface GetRecipesByUserRequest {
  page: number;
  limit: number;
  userId: number;
}

export interface RecipeBriefResponse {
  id: number;
  photoUrl: string;
  servings: number;
  title: string;
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
