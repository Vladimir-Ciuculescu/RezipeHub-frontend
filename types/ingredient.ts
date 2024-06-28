export interface IngredientResponse {
  food: Food;
  measures: Measure[];
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

interface Measure {
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
