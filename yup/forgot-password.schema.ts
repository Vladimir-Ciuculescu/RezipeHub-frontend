import * as Yup from "yup";

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("This is not a valid email address !")
    .required("Please type in your email address !"),
});
