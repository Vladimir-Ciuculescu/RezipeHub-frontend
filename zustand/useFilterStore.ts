import { CategoryItem } from "@/types/category.types";
import { create } from "zustand";
import { createSelectors } from "./createSelectors";
import { MAX_CALORIES, MAX_PREPARATION_TIME, RECIPE_TYPES } from "@/constants";
import { FilterObject } from "@/types/filter.types";

export interface FilterStoreState {
  text: string;
  categories: CategoryItem[];
  caloriesRange: [number, number];
  preparationTimeRange: [number, number];
}

interface Action {
  setFiltersAction: (filters: FilterObject) => void;
  resetFiltersAction: () => void;
}

const initialState: FilterStoreState = {
  text: "",
  categories: RECIPE_TYPES.map((category, index) => ({
    id: index,
    label: category.label,
    value: category.value,
    checked: false,
  })),
  caloriesRange: [0, MAX_CALORIES],
  preparationTimeRange: [0, MAX_PREPARATION_TIME],
};

const useFilterStoreBase = create<FilterStoreState & Action>()((set, get) => ({
  ...initialState,
  setFiltersAction: (filters) =>
    set((state) => ({
      text: filters.text,
      categories: filters.categories ? filters.categories : initialState.categories,
      preparationTimeRange: [filters.minPreparationTime, filters.maxPreparationTime],
      caloriesRange: [filters.minCalories, filters.maxCalories],
    })),
  resetFiltersAction: () => {
    set(initialState);
  },
}));

const useFilterStore = createSelectors(useFilterStoreBase);

export default useFilterStore;
