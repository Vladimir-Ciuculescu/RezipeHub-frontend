import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('A valid email is required').required('Email required '),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});
