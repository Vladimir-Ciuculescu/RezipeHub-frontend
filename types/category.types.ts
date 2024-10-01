export interface CategoryItem {
  id: number;
  label: string;
  value: string;
  checked: boolean;
}

export type CategoryFilter = Omit<CategoryItem, "id" | "value" | "checked">;
