import * as Yup from "yup";

export const resetPasswordSchema = Yup.object({
  token: Yup.string()
    .min(6, "Token must be of 6 digit")
    .max(6, "Too many digits")
    .required("Token required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .min(8, "Password must be at least 8 characters")
    .required("Repeat password is required"),
});
