import { IngredientItem } from "@/types/ingredient";
import { create } from "zustand";
import { createSelectors } from "./createSelectors";
import { Step } from "@/types/step";

interface State {
  ingredients: IngredientItem[];
  steps: Step[];
}

interface Action {
  addIngredientAction: (ingredient: IngredientItem) => void;
  removeIngredientAction: (foodId: string) => void;
  addStepsAction: (steps: Step[]) => void;
  removeStepAction: (stepNumber: number) => void;
}

const useRecipeStoreBase = create<State & Action>((set) => ({
  ingredients: [],
  steps: [],
  addIngredientAction: (ingredient) =>
    set((state: State) => ({ ingredients: [...state.ingredients, ingredient] })),
  removeIngredientAction: (foodId: string) =>
    set((state: State) => ({
      ingredients: state.ingredients.filter((ingredient) => ingredient.foodId !== foodId),
    })),
  addStepsAction: (steps) => set((state: State) => ({ steps: steps })),
  removeStepAction: (stepNumber) =>
    set((state: State) => ({ steps: state.steps.filter((step) => step.number !== stepNumber) })),
}));

const useRecipeStore = createSelectors(useRecipeStoreBase);

export default useRecipeStore;
