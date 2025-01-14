import * as Yup from "yup";

export const editStepSchema = Yup.object({
  step: Yup.string().required("Please type in in the step !"),
});
