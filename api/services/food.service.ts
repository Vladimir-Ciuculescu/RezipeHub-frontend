import axios from "axios";
import { handleError } from "../handleError";
import { NutrientsRequestPayload } from "@/types/ingredient.types";

const appkey = process.env.EXPO_PUBLIC_EDAMAM_APP_KEY;
const appId = process.env.EXPO_PUBLIC_EDAMAN_APP_ID;

const FoodService = {
  searchFood: async (text: string) => {
    try {
      const { data } = await axios.get(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appkey}&nutrition-type=cooking`,
        { params: { ingr: text } },
      );
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getNutritionData: async (payload: NutrientsRequestPayload) => {
    try {
      const { data } = await axios.post(
        `https://api.edamam.com/api/food-database/v2/nutrients?app_key=${appkey}&app_id=${appId}`,
        {
          ingredients: [payload],
        },
      );
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default FoodService;
