import { IngredientItem } from "@/types/ingredient";
import { create } from "zustand";
import { createSelectors } from "./createSelectors";

interface State {
  ingredients: IngredientItem[];
}

interface Action {
  addIngredientAction: (ingredient: IngredientItem) => void;
  removeIngredientAction: (foodId: string) => void;
}

const useRecipeStoreBase = create<State & Action>((set) => ({
  ingredients: [],
  addIngredientAction: (ingredient: IngredientItem) =>
    set((state: State) => ({ ingredients: [...state.ingredients, ingredient] })),
  removeIngredientAction: (foodId: string) =>
    set((state: State) => ({
      ingredients: state.ingredients.filter((ingredient) => ingredient.foodId !== foodId),
    })),
}));

const useRecipeStore = createSelectors(useRecipeStoreBase);

export default useRecipeStore;
