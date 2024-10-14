import { CategoryFilter, CategoryItem } from "./category.types";
import { RecipeType } from "./enums";
import { IngredientItem, IngredientItemResponse, IngredientPayload } from "./ingredient.types";
import { Step, StepItemResponse, StepPayload } from "./step.types";

export interface AddRecipeRequest {
  userId: number;
  title: string;
  servings: number;
  photoUrl?: string;
  ingredients: IngredientPayload[];
  steps: StepPayload[];
  type: RecipeType;
  preparationTime: number;
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
    type: RecipeType;
    preparationTime: number;
    ingredients?: IngredientItem[];
    steps?: Step[];
  };
  ingredientsIds?: number[];
  nutritionalInfoIds?: number[];
  stepsIds?: number[];
}

export interface GetLatestRecipesRequest {
  page: number;
  limit: number;
  userId: number;
}

export interface GetRecipesByUserRequest {
  page: number;
  limit: number;
  userId: number;
}

export interface GetRecipesRequest {
  userId: number;
  text: string;
  categories: CategoryItem[];
  caloriesRange: [min: number, max: number];
  preparationTimeRange: [min: number, max: number];
}

export interface RecipeBriefResponse {
  id: number;
  photoUrl: string;
  servings: number;
  title: string;
}

export interface RecipeSearchResponse {
  id: number;
  title: string;
  photoUrl: string;
  preparationTime: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    photoUrl: string;
  };
}

export interface LatestRecipeResponse {
  id: number;
  title: string;
  photoUrl: string;
  preparationTime: number;
  isInFavorites: boolean;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    photoUrl: string;
  };
}

export interface RecipeResponse {
  id: number;
  userId: number;
  title: string;
  servings: number;
  photoUrl: string;
  preparationTime: number;
  type: RecipeType;
  ingredients: IngredientItemResponse[];
  steps: StepItemResponse[];
}
export interface PaginatedRecipeItem {
  id: number;
  title: string;
  photoUrl: string;
  servings: number;
  type: RecipeType;
  totalCalories: number;
  preparationTime: number;
}
