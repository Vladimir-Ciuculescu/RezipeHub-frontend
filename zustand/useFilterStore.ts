import { CategoryItem } from "@/types/category.types";
import { create } from "zustand";
import { createSelectors } from "./createSelectors";

export interface FilterStoreState {
  categories: CategoryItem[];
  caloriesRange: [number, number] | [];
  preparationTimeRange: [number, number] | [];
}

interface Action {
  setFiltersAction: (filters: Partial<FilterStoreState>) => void;
}

const initialState: FilterStoreState = {
  categories: [],
  caloriesRange: [],
  preparationTimeRange: [],
};

const useFilterStoreBase = create<FilterStoreState & Action>()((set, get) => ({
  ...initialState,
  setFiltersAction: (filters) =>
    set((state) => ({
      categories: filters.categories ? filters.categories : initialState.categories,
      caloriesRange: filters.caloriesRange ? filters.caloriesRange : initialState.caloriesRange,
      preparationTimeRange: filters.preparationTimeRange
        ? filters.preparationTimeRange
        : initialState.preparationTimeRange,
    })),
  resetFiltersAction: () => initialState,
}));

const useFilterStore = createSelectors(useFilterStoreBase);

export default useFilterStore;
