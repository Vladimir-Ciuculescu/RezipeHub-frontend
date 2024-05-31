import * as Yup from 'yup';

export const registerSchema = Yup.object({
  username: Yup.string().required('Username required'),
  firstName: Yup.string().required('First name required '),
  lastName: Yup.string().required('Last name required'),
  email: Yup.string().email('A valid email is required').required('Email required '),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .min(8, 'Password must be at least 8 characters')
    .required('Repeat password is required'),
});
