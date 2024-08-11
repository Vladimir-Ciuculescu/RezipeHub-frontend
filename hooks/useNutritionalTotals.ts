import { IngredientItem } from "@/types/ingredient.types";
import { useMemo } from "react";

const useNutritionalTotals = (ingredients: IngredientItem[]) => {
  const calculateTotal = (
    property: keyof Omit<IngredientItem, "foodId" | "measure" | "quantity" | "title">,
  ): number => {
    //@ts-ignore
    return ingredients.reduce((sum, ingredient) => sum + (ingredient[property] || 0), 0);
  };

  const totalProteins = useMemo(() => Math.floor(calculateTotal("proteins")), [ingredients]);
  const totalCarbs = useMemo(() => Math.floor(calculateTotal("carbs")), [ingredients]);
  const totalCalories = useMemo(() => Math.floor(calculateTotal("calories")), [ingredients]);
  const totalFats = useMemo(() => Math.floor(calculateTotal("fats")), [ingredients]);

  return { totalProteins, totalCarbs, totalCalories, totalFats };
};

export default useNutritionalTotals;
