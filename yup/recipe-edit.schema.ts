import * as Yup from "yup";

export const recipeEditSchema = Yup.object({
  title: Yup.string().required("Please type in a title"),
  servings: Yup.string()
    .matches(/^[1-9]\d*$/, "Number of servgins not valid !")
    .required("Please insert the number of servings !"),
  preparationTime: Yup.string()
    .matches(/^[1-9]\d*$/, "Preparation time not valid !")
    .required("Please insert the preparation time!"),
});
