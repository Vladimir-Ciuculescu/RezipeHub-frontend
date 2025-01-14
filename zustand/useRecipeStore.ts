import { IngredientItem } from "@/types/ingredient.types";
import { create } from "zustand";
import { createSelectors } from "./createSelectors";
import { Step } from "@/types/step.types";
import { RecipeType } from "@/types/enums";

export interface RecipeStoreState {
  id?: number;
  ingredients: IngredientItem[];
  steps: Step[];
  title: string;
  servings: number;
  photo: string;
  type: RecipeType | "";
  preparationTime: number;
}

interface Action {
  addIngredientAction: (ingredient: IngredientItem) => void;
  editIngredientAction: (ingredient: IngredientItem) => void;
  setIngredientsAction: (ingredients: IngredientItem[]) => void;
  removeIngredientAction: (ingredient: IngredientItem) => void;
  addStepsAction: (steps: Step[]) => void;
  editStepAction: (ste: Step) => void;
  removeStepAction: (step: Step) => void;

  addInfoAction: (info: Omit<RecipeStoreState, "ingredients" | "steps">) => void;
  reset: () => void;
}

const initialState: RecipeStoreState = {
  id: 0,
  ingredients: [],
  steps: [],
  title: "",
  servings: 1,
  photo: "",
  type: "",
  preparationTime: 0,
};

const useRecipeStoreBase = create<RecipeStoreState & Action>()((set, get) => ({
  ...initialState,
  // * Add one ingredient at a time
  addIngredientAction: (ingredient) =>
    set((state: RecipeStoreState) => ({ ingredients: [...state.ingredients, ingredient] })),
  // * Edit one ingredient at a time
  editIngredientAction: (ingredient) =>
    set((state: RecipeStoreState) => ({
      ingredients: state.ingredients.map((item) => {
        const { measure, quantity, calories, carbs, proteins, fats } = ingredient;

        return item.foodId === ingredient.foodId
          ? {
              ...item,
              measure,
              quantity,
              proteins,
              fats,
              calories,
              carbs,
            }
          : item;
      }),
    })),
  // * Overwrite the entire ingredients array
  setIngredientsAction: (ingredients) => set((state: RecipeStoreState) => ({ ingredients })),
  // * Remove one ingredient at a time
  removeIngredientAction: (ingredient: IngredientItem) =>
    set((state: RecipeStoreState) => ({
      ingredients: state.ingredients.filter((item) => item.foodId !== ingredient.foodId),
    })),
  // * Add all steps
  addStepsAction: (steps) => set((state: RecipeStoreState) => ({ steps: steps })),

  // * Edit one step at a time
  editStepAction: (step) =>
    set((state: RecipeStoreState) => ({
      steps: state.steps.map((item) => {
        return item.id == step.id
          ? {
              ...item,
              description: step.description,
            }
          : item;
      }),
    })),
  // * Remove one step at a time
  removeStepAction: (step) =>
    set((state: RecipeStoreState) => ({
      steps: state.steps.filter((item) => item.id !== step.id),
    })),
  addInfoAction: (info) => set((state: RecipeStoreState) => ({ ...info })),
  reset: () => set(initialState),
}));

const useRecipeStore = createSelectors(useRecipeStoreBase);

export default useRecipeStore;
