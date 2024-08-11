export interface IngredientResponse {
  food: Food;
  measures: Measure[];
}

export interface IngredientItem {
  foodId: string | number;
  measure: string;
  quantity: string | number;
  title: string;
  calories: number | string;
  carbs?: number | string;
  proteins?: number | string;
  fats?: number | string;
}

export interface IngredientItemResponse {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
}

export interface IngredientPayload {
  name: string;
  unit: string;
  quantity: number;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
}

interface Food {
  category: string;
  categoryLabel?: string;
  foodId: string;
  image?: string;
  knownAs?: string;
  label: string;
  nutrients: Nutrient;
}

export interface Measure {
  uri: string;
  //Unit measure
  label: string;
  weight: number;
}

export interface Nutrient {
  //Calcium
  CA?: number;
  //Carbohydrates
  CHOCDF?: number;
  //Cholesterol
  CHOLE?: number;
  //Calories
  ENERC_KCAL?: number;
  //Fatty acids, total monounsaturated
  FAMS?: number;
  //Fatty acids, total polyunsaturated
  FAPU?: number;
  //Fatty acids, total saturated
  FASAT?: number;
  //Fats, total lipids
  FAT?: number;
  //Fatty acids, total trans
  FATRN?: number;
  //Iron
  FE?: number;
  //Fibers
  FIBTG?: number;
  //Pottasium
  K?: number;
  //Magnesium
  MG?: number;
  //Sodium
  NA?: number;
  //Niacin
  NIA?: number;
  //Phosphorus
  P?: number;
  //Proteins
  PROCNT?: number;
  //Riboflavin
  RIBF?: number;
  //Sugar
  SUGAR?: number;
  //Thiamin
  THIA?: number;
  //Vitamin E
  TOCPHA?: number;
  //Vitamin A
  VITA_RAE?: number;
  //Vitamin B12
  VITB12?: number;
  //Vitamin B6
  VITB6?: number;
  //Vitamin C
  VITC?: number;
  //Vitamin D
  VITD?: number;
  //Vitamin K
  VITK1?: number;
  //Water
  WATER?: number;
  //Zinc
  ZN?: number;
}

type NutrientSymbol = {
  [K in keyof Nutrient]: NutrientDetail;
};

export interface NutrientDetail {
  label: "string";
  quantity: number;
  unit: string;
}

export interface NutrientsRequestPayload {
  foodId: string;
  measureURI: string;
  quantity: number;
}

export interface NutrientResponse {
  totalNutrients: NutrientSymbol;
  totalDaily: NutrientSymbol;
}
