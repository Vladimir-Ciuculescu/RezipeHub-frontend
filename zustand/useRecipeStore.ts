import { IngredientItem } from "@/types/ingredient.types";
import { create } from "zustand";
import { createSelectors } from "./createSelectors";
import { Step } from "@/types/step.types";

interface State {
  ingredients: IngredientItem[];
  steps: Step[];
  title: string;
  servings: number;
  photo: string;
}

interface Action {
  addIngredientAction: (ingredient: IngredientItem) => void;
  setIngredientsAction: (ingredients: IngredientItem[]) => void;
  removeIngredientAction: (foodId: string) => void;
  addStepsAction: (steps: Step[]) => void;
  editStepAction: (ste: Step) => void;
  // removeStepAction: (stepNumber: number) => void;
  removeStepAction: (step: Step) => void;

  addInfoAction: (info: Omit<State, "ingredients" | "steps">) => void;
  reset: () => void;
}

const initialState: State = {
  ingredients: [],
  steps: [],
  title: "",
  servings: 1,
  photo: "",
};

const useRecipeStoreBase = create<State & Action>()((set, get) => ({
  ...initialState,
  // * Add one ingredient at a time
  addIngredientAction: (ingredient) =>
    set((state: State) => ({ ingredients: [...state.ingredients, ingredient] })),
  // * Overwrite the entire ingredients array
  setIngredientsAction: (ingredients) => set((state: State) => ({ ingredients })),
  removeIngredientAction: (foodId: string) =>
    set((state: State) => ({
      ingredients: state.ingredients.filter((ingredient) => ingredient.foodId !== foodId),
    })),
  // * Add one step at a time
  addStepsAction: (steps) => set((state: State) => ({ steps: steps })),
  editStepAction: (step) =>
    set((state: State) => ({
      steps: state.steps.map((item) => {
        return item.id == step.id
          ? {
              ...item,
              description: step.description,
            }
          : item;
      }),
    })),
  // removeStepAction: (stepNumber) =>
  //   set((state: State) => ({ steps: state.steps.filter((step) => step.number !== stepNumber) })),
  removeStepAction: (step) =>
    set((state: State) => ({ steps: state.steps.filter((item) => item.id !== step.id) })),
  addInfoAction: (info) => set((state: State) => ({ ...info })),
  reset: () => set(initialState),
}));

const useRecipeStore = createSelectors(useRecipeStoreBase);

export default useRecipeStore;
