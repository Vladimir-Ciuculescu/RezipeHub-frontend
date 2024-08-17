import * as Yup from "yup";

export const recipeEditSchema = Yup.object({
  title: Yup.string().required("Title is required !"),
  servings: Yup.string().required("Number of servings is required  !"),
});
