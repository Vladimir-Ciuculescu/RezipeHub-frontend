import { IngredientItem } from "@/types/ingredient";
import { create } from "zustand";
import { createSelectors } from "./createSelectors";
import { Step } from "@/types/step";

interface State {
  ingredients: IngredientItem[];
  steps: Step[];
  title: string;
  servings: number;
  photo: string;
}

interface Action {
  addIngredientAction: (ingredient: IngredientItem) => void;
  removeIngredientAction: (foodId: string) => void;
  addStepsAction: (steps: Step[]) => void;
  removeStepAction: (stepNumber: number) => void;
  addInfoAction: (info: Omit<State, "ingredients" | "steps">) => void;
}

const useRecipeStoreBase = create<State & Action>((set) => ({
  ingredients: [],
  steps: [],
  title: "",
  servings: 1,
  photo: "",
  addIngredientAction: (ingredient) =>
    set((state: State) => ({ ingredients: [...state.ingredients, ingredient] })),
  removeIngredientAction: (foodId: string) =>
    set((state: State) => ({
      ingredients: state.ingredients.filter((ingredient) => ingredient.foodId !== foodId),
    })),
  addStepsAction: (steps) => set((state: State) => ({ steps: steps })),
  removeStepAction: (stepNumber) =>
    set((state: State) => ({ steps: state.steps.filter((step) => step.number !== stepNumber) })),
  addInfoAction: (info) => set((state: State) => ({ ...info })),
}));

const useRecipeStore = createSelectors(useRecipeStoreBase);

export default useRecipeStore;
