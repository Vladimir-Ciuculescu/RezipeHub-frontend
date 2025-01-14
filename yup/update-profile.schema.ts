import * as Yup from "yup";

export const updateProfileSchema = Yup.object({
  firstName: Yup.string().required("First name required "),
  lastName: Yup.string().required("Last name required"),
  email: Yup.string().email("A valid email is required").required("Email required "),
});
