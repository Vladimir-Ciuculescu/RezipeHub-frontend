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

  testCall: async () => {
    try {
      const { data } = await axios.post(
        `https://api.edamam.com/api/food-database/v2/nutrients?app_key=${appkey}&app_id=${appId}`,
        {
          ingredients: [
            // {
            // foodId: "food_bpumdjzb5rtqaeabb0kbgbcgr4t9",
            //   measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
            //   quantity: 100,
            // },
            {
              foodId: "food_bmyxrshbfao9s1amjrvhoauob6mo",
              quantity: 1,
              measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_gram", // Provide a default measure
            },
            // {
            //   foodId: "food_bmyxrshbfao9s1amjrvhoauob6mo",
            //   quantity: 196,
            //   measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_breast", // Provide a default measure
            // },
          ],
        },
      );
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  fetchFoodDetails: async (title: string) => {
    try {
      const { data } = await axios.get(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appkey}&nutrition-type=cooking`,
        {
          params: {
            foodId: "food_bpumdjzb5rtqaeabb0kbgbcgr4t9",
            ingr: title,
          },
        },
      );
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default FoodService;
