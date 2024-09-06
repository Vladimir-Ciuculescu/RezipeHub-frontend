import { IngredientItem } from "@/types/ingredient.types";
import { create } from "zustand";
import { createSelectors } from "./createSelectors";
import { Step } from "@/types/step.types";
import { RecipeType } from "@/types/types";

interface State {
  id?: number;
  ingredients: IngredientItem[];
  steps: Step[];
  title: string;
  servings: number;
  photo: string;
  type: RecipeType;
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

  addInfoAction: (info: Omit<State, "ingredients" | "steps">) => void;
  reset: () => void;
}

const initialState: State = {
  id: 0,
  ingredients: [],
  steps: [],
  title: "",
  servings: 1,
  photo: "",
  type: "",
  preparationTime: 0,
};

const useRecipeStoreBase = create<State & Action>()((set, get) => ({
  ...initialState,
  // * Add one ingredient at a time
  addIngredientAction: (ingredient) =>
    set((state: State) => ({ ingredients: [...state.ingredients, ingredient] })),
  // * Edit one ingredient at a time
  editIngredientAction: (ingredient) =>
    set((state: State) => ({
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
  setIngredientsAction: (ingredients) => set((state: State) => ({ ingredients })),
  // * Remove one ingredient at a time
  removeIngredientAction: (ingredient: IngredientItem) =>
    set((state: State) => ({
      ingredients: state.ingredients.filter((item) => item.foodId !== ingredient.foodId),
    })),
  // * Add all steps
  addStepsAction: (steps) => set((state: State) => ({ steps: steps })),

  // * Edit one step at a time
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
  // * Remove one step at a time
  removeStepAction: (step) =>
    set((state: State) => ({ steps: state.steps.filter((item) => item.id !== step.id) })),
  addInfoAction: (info) => set((state: State) => ({ ...info })),
  reset: () => set(initialState),
}));

const useRecipeStore = createSelectors(useRecipeStoreBase);

export default useRecipeStore;
