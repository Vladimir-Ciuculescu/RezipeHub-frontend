import { IngredientItem, IngredientResponse } from "@/types/ingredient";
import { create } from "zustand";
import { createSelectors } from "./createSelectors";

interface State {
  ingredients: IngredientItem[];
}

interface Action {
  addIngredientAction: (ingredient: IngredientItem) => void;
}

const useRecipeStoreBase = create<State & Action>((set) => ({
  ingredients: [],
  addIngredientAction: (ingredient) =>
    set((state: any) => ({ ingredients: [...state.ingredients, ingredient] })),
}));

const useRecipeStore = createSelectors(useRecipeStoreBase);

export default useRecipeStore;
