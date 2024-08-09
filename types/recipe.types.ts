import { IngredientPayload } from "./ingredient";
import { StepPayload } from "./step";

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
