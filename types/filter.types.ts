import { CategoryItem } from "./category.types";

export interface FilterObject {
  text: string;
  minCalories: number;
  maxCalories: number;
  categories: CategoryItem[];
  minPreparationTime: number;
  maxPreparationTime: number;
}
